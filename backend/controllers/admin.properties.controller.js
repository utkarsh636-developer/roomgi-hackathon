import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Property } from "../models/property.model.js"

// Get all properties with filters and pagination
const getAllProperties = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 20,
        type,
        verificationStatus,
        isBlocked,
        city,
        search
    } = req.query

    const query = {}

    // Apply filters
    if (type) query.type = type
    if (verificationStatus) query["verification.status"] = verificationStatus
    if (isBlocked !== undefined) query.isBlocked = isBlocked === "true"
    if (city) query["location.city"] = { $regex: city, $options: "i" }
    if (search) {
        query.$or = [
            { description: { $regex: search, $options: "i" } },
            { "location.addressLine": { $regex: search, $options: "i" } }
        ]
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [properties, totalCount] = await Promise.all([
        Property.find(query)
            .populate("owner", "username email profileImage")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit)),
        Property.countDocuments(query)
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                properties,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalCount / parseInt(limit)),
                    totalCount,
                    limit: parseInt(limit)
                }
            },
            "Properties fetched successfully"
        )
    )
})

// Get single property details by ID
const getPropertyById = asyncHandler(async (req, res) => {
    const { propertyId } = req.params

    const property = await Property.findById(propertyId)
        .populate("owner", "username email phoneNumber profileImage verification")
        .populate("reviews")

    if (!property) {
        throw new ApiError(404, "Property not found")
    }

    return res.status(200).json(
        new ApiResponse(200, property, "Property details fetched successfully")
    )
})

// Get properties pending verification
const getPendingVerifications = asyncHandler(async (req, res) => {
    const properties = await Property.find({
        "verification.status": "pending",
        documents: { $exists: true, $ne: [] }
    })
        .populate("owner", "username email profileImage")
        .sort({ "documents.0.uploadedAt": 1 }) // Oldest first

    return res.status(200).json(
        new ApiResponse(
            200,
            properties,
            "Pending property verifications fetched successfully"
        )
    )
})

export {
    getAllProperties,
    getPropertyById,
    getPendingVerifications
}
