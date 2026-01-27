import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Property } from "../models/property.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { AMENITIES } from "../utils/constants.js"

const createProperty = asyncHandler(async (req, res) => {
    const {
        type,
        address,
        city,
        state,
        pincode,
        rent,
        securityDeposit,
        amenities,
        capacity,
        description,
        preferences,
        coordinates // expect { lng, lat } from frontend
    } = req.body;

    const owner = req.user?._id;
    const role = req.user?.role;

    if (role !== "owner") throw new ApiError(403, "Unauthorized");

    // Validate coordinates
    if (
        !coordinates ||
        typeof coordinates.lng !== "number" ||
        typeof coordinates.lat !== "number"
    ) {
        throw new ApiError(400, "Valid coordinates (lng, lat) are required");
    }

    const imageFiles = req.files?.images;
    if (!imageFiles || imageFiles.length === 0) throw new ApiError(400, "At least one image is required");
    if (imageFiles.length > 4) throw new ApiError(400, "Maximum 4 images allowed");

    // Upload images to Cloudinary
    const uploadedImages = [];
    for (const file of imageFiles) {
        const uploaded = await uploadOnCloudinary(file.path);
        if (!uploaded?.secure_url) throw new ApiError(500, "Image upload failed");
        uploadedImages.push({ url: uploaded.secure_url, publicId: uploaded.public_id });
    }

    // Validate amenities
    const validAmenities = amenities.filter(a => AMENITIES.includes(a));
    if (validAmenities.length !== amenities.length) throw new ApiError(400, "One or more invalid amenities provided");

    // Create property
    const property = await Property.create({
        type,
        location: {
            addressLine: address,
            city,
            state,
            pincode,
            coordinates: {
                type: "Point",
                coordinates: [coordinates.lng, coordinates.lat] // GeoJSON format
            }
        },
        rent,
        securityDeposit,
        amenities: validAmenities,
        images: uploadedImages,
        capacity,
        description,
        preferences, // string
        owner
    });

    // Add property ID to owner's properties array
    await User.findByIdAndUpdate(owner, { $push: { properties: property._id } });

    return res.status(201).json(new ApiResponse(201, property, "Property added successfully and linked to owner"));
});


const updateProperty = asyncHandler(async (req, res) => {
    const { propertyId } = req.params;
    const {
        type,
        address,
        city,
        state,
        pincode,
        rent,
        securityDeposit,
        amenities,
        capacity,
        description,
        preferences,
        coordinates
    } = req.body;

    const userId = req.user?._id;
    const role = req.user?.role;

    if (role !== "owner") throw new ApiError(403, "Unauthorized");

    const property = await Property.findById(propertyId);
    if (!property) throw new ApiError(404, "Property not found");
    if (property.owner.toString() !== userId.toString()) throw new ApiError(403, "Not your property");

    const imageFiles = req.files?.images;
    if (!imageFiles || imageFiles.length === 0) throw new ApiError(400, "Images are required");
    if (imageFiles.length > 4) throw new ApiError(400, "Maximum 4 images allowed");

    // Delete old images
    await Promise.all(
        property.images.map(img => cloudinary.uploader.destroy(img.publicId))
    );

    // Upload new images
    const uploadedImages = await Promise.all(
        imageFiles.map(async file => {
            const uploaded = await uploadOnCloudinary(file.path);
            if (!uploaded?.secure_url) throw new ApiError(500, "Image upload failed");
            return { url: uploaded.secure_url, publicId: uploaded.public_id };
        })
    );

    // Validate amenities
    const validAmenities = amenities.filter(a => AMENITIES.includes(a));
    if (validAmenities.length !== amenities.length) throw new ApiError(400, "One or more invalid amenities provided");

    // Merge capacity safely
    const updatedCapacity = {
        total: capacity?.total ?? property.capacity.total,
        occupied: property.capacity.occupied
    };

    // Validate coordinates
    const updatedCoordinates =
        coordinates &&
            typeof coordinates.lng === "number" &&
            typeof coordinates.lat === "number"
            ? { type: "Point", coordinates: [coordinates.lng, coordinates.lat] }
            : property.location.coordinates;

    const updatedProperty = await Property.findByIdAndUpdate(
        propertyId,
        {
            type,
            location: {
                addressLine: address,
                city,
                state,
                pincode,
                coordinates: updatedCoordinates
            },
            rent,
            securityDeposit,
            amenities: validAmenities,
            capacity: updatedCapacity,
            description,
            preferences,
            images: uploadedImages
        },
        { new: true }
    );

    return res.status(200).json(new ApiResponse(200, updatedProperty, "Property updated successfully"));
});


const getPropertyById = asyncHandler(async (req, res) => {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId); // fetch property only

    if (!property) throw new ApiError(404, "Property not found");

    return res.status(200).json(
        new ApiResponse(200, property, "Property fetched successfully")
    );
});

const verifyPropertyRequest = asyncHandler(async (req, res) => {
    const { propertyId } = req.params
    const { documentTypes } = req.body

    const userId = req.user?._id
    const role = req.user?.role

    if (role !== "owner") {
        throw new ApiError(403, "Unauthorized")
    }

    const property = await Property.findById(propertyId)
    if (!property) {
        throw new ApiError(404, "Property not found")
    }

    if (property.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "Not your property")
    }

    if (property.verification.status === "approved") {
        throw new ApiError(400, "Property is already verified")
    }

    const documentFiles = req.files?.documents || []

    if (documentFiles.length < 4) {
        throw new ApiError(400, "Minimum 4 documents are required")
    }

    // Business rule: compulsory documents
    if (
        !documentTypes.includes("ownership_proof") ||
        !documentTypes.includes("government_id")
    ) {
        throw new ApiError(
            400,
            "ownership_proof and government_id are compulsory documents"
        )
    }

    // Remove any previously uploaded documents (cleanup)
    for (const doc of property.documents) {
        if (doc.publicId) {
            await deleteFromCloudinary(doc.publicId)
        }
    }

    const uploadedDocuments = []

    for (let i = 0; i < documentFiles.length; i++) {
        const uploaded = await uploadOnCloudinary(documentFiles[i].path)

        if (!uploaded?.secure_url) {
            throw new ApiError(500, "Document upload failed")
        }

        uploadedDocuments.push({
            type: documentTypes[i], // enum enforced by schema
            url: uploaded.secure_url,
            publicId: uploaded.public_id
        })
    }

    // Replace documents and trigger verification
    property.documents = uploadedDocuments
    property.verification.status = "pending"
    property.verification.rejectionReason = undefined
    property.verification.verifiedBy = undefined
    property.verification.verifiedAt = undefined

    await property.save()

    return res.status(200).json(
        new ApiResponse(
            200,
            property,
            "Verification request submitted successfully"
        )
    )
})

const editPropertyDocument = asyncHandler(async (req, res) => {
    const { propertyId } = req.params
    const { documentTypes } = req.body

    const userId = req.user?._id
    const role = req.user?.role

    if (role !== "owner") {
        throw new ApiError(403, "Unauthorized")
    }

    const property = await Property.findById(propertyId)
    if (!property) {
        throw new ApiError(404, "Property not found")
    }

    if (property.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "Not your property")
    }

    if (
        property.verification.status !== "pending" &&
        property.verification.status !== "rejected"
    ) {
        throw new ApiError(
            400,
            "Documents can only be edited when verification is pending or rejected"
        )
    }

    const documentFiles = req.files?.documents || []

    if (documentFiles.length < 4) {
        throw new ApiError(400, "Minimum 4 documents are required")
    }

    // Mandatory document types (business rule, not schema rule)
    if (
        !documentTypes.includes("ownership_proof") ||
        !documentTypes.includes("government_id")
    ) {
        throw new ApiError(
            400,
            "ownership_proof and government_id are compulsory"
        )
    }

    // 🔥 Remove old documents (Cloudinary + DB replacement)
    for (const doc of property.documents) {
        if (doc.publicId) {
            await deleteFromCloudinary(doc.publicId)
        }
    }

    const newDocuments = []

    for (let i = 0; i < documentFiles.length; i++) {
        const uploaded = await uploadOnCloudinary(documentFiles[i].path)

        if (!uploaded?.secure_url) {
            throw new ApiError(500, "Document upload failed")
        }

        newDocuments.push({
            type: documentTypes[i], // enum validated by schema
            url: uploaded.secure_url,
            publicId: uploaded.public_id
        })
    }

    // Replace entire documents array
    property.documents = newDocuments

    // Re-trigger verification if previously rejected
    if (property.verification.status === "rejected") {
        property.verification.status = "pending"
        property.verification.rejectionReason = undefined
        property.verification.verifiedBy = undefined
        property.verification.verifiedAt = undefined
    }

    await property.save()

    return res.status(200).json(
        new ApiResponse(
            200,
            property,
            "Property documents updated successfully"
        )
    )
})



const deleteProperty = asyncHandler(async (req, res) => {
    const { propertyId } = req.params
    const userId = req.user?._id
    const role = req.user?.role

    if (role !== "owner") {
        throw new ApiError(403, "Unauthorized")
    }

    const property = await Property.findById(propertyId)
    if (!property) {
        throw new ApiError(404, "Property not found")
    }

    if (property.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "Not your property")
    }


    if (property.images?.length > 0) {
        await Promise.all(
            property.images.map(img =>
                cloudinary.uploader.destroy(img.publicId)
            )
        )
    }


    if (property.documents?.length > 0) {
        await Promise.all(
            property.documents.map(doc =>
                cloudinary.uploader.destroy(doc.publicId)
            )
        )
    }


    const reviews = await Review.find({ property: propertyId })

    if (reviews.length > 0) {
        await Promise.all(
            reviews.map(async (review) => {
                if (review.images?.length > 0) {
                    await Promise.all(
                        review.images.map(imgUrl => {
                            const publicId = imgUrl.split("/").pop().split(".")[0]
                            return cloudinary.uploader.destroy(publicId)
                        })
                    )
                }
                await Review.findByIdAndDelete(review._id)
            })
        )
    }


    await Enquiry.deleteMany({ property: propertyId })


    await Property.findByIdAndDelete(propertyId)


    await User.findByIdAndUpdate(userId, {
        $pull: { properties: propertyId }
    })

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Property, reviews, documents, enquiries and media deleted successfully"
        )
    )
})


const getReviews = asyncHandler(async (req, res) => {
    const { propertyId } = req.params;

    if (!propertyId) {
        throw new ApiError(400, "Property ID is required");
    }

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
        throw new ApiError(404, "Property not found");
    }

    // Fetch all reviews for the property, populate user details
    const reviews = await Review.find({ property: propertyId })
        .populate({
            path: "user",
            select: "username email profileImage" // Include what you need
        })
        .sort({ createdAt: -1 }); // latest reviews first

    return res.status(200).json(
        new ApiResponse(
            200,
            reviews,
            reviews.length ? "Reviews fetched successfully" : "No reviews found for this property"
        )
    );
});


const getPropertiesByQueries = asyncHandler(async (req, res) => {
    const {
        type,
        city,
        state,
        pincode,
        minRent,
        maxRent,
        amenities,
        minCapacity,
        maxCapacity,
        status,
        preferences,
        lat,
        lng,
        maxDistance // in km
    } = req.query;

    // Build match filters for non-geospatial fields
    const matchFilter = {};

    if (type) matchFilter.type = type;
    if (city) matchFilter['location.city'] = city;
    if (state) matchFilter['location.state'] = state;
    if (pincode) matchFilter['location.pincode'] = pincode;
    if (status) matchFilter.status = status;
    if (preferences) matchFilter.preferences = { $regex: preferences, $options: 'i' };

    if (minRent || maxRent) {
        matchFilter.rent = {};
        if (minRent) matchFilter.rent.$gte = Number(minRent);
        if (maxRent) matchFilter.rent.$lte = Number(maxRent);
    }

    if (minCapacity || maxCapacity) {
        matchFilter['capacity.total'] = {};
        if (minCapacity) matchFilter['capacity.total'].$gte = Number(minCapacity);
        if (maxCapacity) matchFilter['capacity.total'].$lte = Number(maxCapacity);
    }

    if (amenities) {
        let amenityArray = Array.isArray(amenities) ? amenities : amenities.split(',');
        matchFilter.amenities = { $all: amenityArray };
    }

    let properties;

    if (lat && lng && maxDistance) {
        // Use aggregation with $geoNear to include distance
        properties = await Property.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [Number(lng), Number(lat)] },
                    distanceField: "distanceInMeters",
                    maxDistance: Number(maxDistance) * 1000, // convert km to meters
                    spherical: true,
                    query: matchFilter
                }
            },
            { $sort: { distanceInMeters: 1, rent: 1 } } // sort by distance first, then rent
        ]);

        // Convert distance to km
        properties = properties.map(p => ({
            ...p,
            distanceInKm: (p.distanceInMeters / 1000).toFixed(2)
        }));
    } else {
        // No coordinates, normal query
        properties = await Property.find(matchFilter).sort({ rent: 1 });
    }

    return res.status(200).json(
        new ApiResponse(200, properties, "Properties fetched successfully")
    );
});


export {
    createProperty,
    updateProperty,
    getPropertyById,
    deleteProperty,
    getPropertiesByQueries,
    getReviews,
    verifyPropertyRequest,
    editPropertyDocument

}  