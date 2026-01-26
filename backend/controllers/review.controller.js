import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review } from "../models/review.model.js";
import { Property } from "../models/property.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { cloudinary } from "../utils/cloudinary.js";

const createReview = asyncHandler(async (req, res) => {
    const { propertyId, rating, comment } = req.body;
    const userId = req.user?._id;
    const role = req.user?.role;

    if (role !== "tenant") throw new ApiError(403, "Unauthorized");

    // Ensure property exists
    const property = await Property.findById(propertyId);
    if (!property) throw new ApiError(404, "Property not found");

    // Validate images
    const imageFiles = req.files?.images || [];
    if (imageFiles.length > 2) {
        throw new ApiError(400, "Maximum 2 images allowed for a review");
    }

    // Upload images to Cloudinary
    const uploadedImages = [];
    for (const file of imageFiles) {
        const uploaded = await uploadOnCloudinary(file.buffer);
        if (!uploaded?.secure_url) throw new ApiError(500, "Image upload failed");
        uploadedImages.push({
            url: uploaded.secure_url,
            publicId: uploaded.public_id
        });
    }

    // Create the review
    const review = await Review.create({
        property: propertyId,
        user: userId,
        rating,
        comment,
        images: uploadedImages.map(img => img.url) // only store URLs
    });

    // Add review ID to property's reviews array
    property.reviews.push(review._id);
    await property.save();

    return res.status(201).json(
        new ApiResponse(
            201,
            review,
            "Review added successfully and linked to property"
        )
    );
});

const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user?._id;
    const role = req.user?.role;

    if (role !== "tenant") throw new ApiError(403, "Unauthorized");

    const review = await Review.findById(reviewId);
    if (!review) throw new ApiError(404, "Review not found");

    if (review.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only delete your own reviews");
    }

    // Remove review ID from property's reviews array
    await Property.findByIdAndUpdate(review.property, {
        $pull: { reviews: review._id }
    });

    // Delete images from Cloudinary if needed
    if (review.images && review.images.length > 0) {
        await Promise.all(
            review.images.map(async (imgUrl) => {
                const publicId = imgUrl.split("/").pop().split(".")[0]; // simple extraction, works if no folder
                await cloudinary.uploader.destroy(publicId);
            })
        );
    }

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Review deleted successfully and removed from property")
    );
});

const updateReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user?._id;
    const role = req.user?.role;

    if (role !== "tenant") throw new ApiError(403, "Unauthorized");

    const review = await Review.findById(reviewId);
    if (!review) throw new ApiError(404, "Review not found");

    if (review.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only update your own reviews");
    }

    const { rating, comment } = req.body;
    const imageFiles = req.files?.images || [];

    if (!rating && !comment && imageFiles.length === 0) {
        throw new ApiError(400, "Nothing to update");
    }

    // Update rating and comment if provided
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    // Handle images if new files provided
    if (imageFiles.length > 0) {
        if (imageFiles.length > 2) throw new ApiError(400, "Maximum 2 images allowed");

        // Delete old images from Cloudinary
        if (review.images && review.images.length > 0) {
            await Promise.all(
                review.images.map(async (imgUrl) => {
                    const publicId = imgUrl.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(publicId);
                })
            );
        }

        // Upload new images
        const uploadedImages = [];
        for (const file of imageFiles) {
            const uploaded = await uploadOnCloudinary(file.buffer);
            if (!uploaded?.secure_url) throw new ApiError(500, "Image upload failed");
            uploadedImages.push(uploaded.secure_url);
        }

        review.images = uploadedImages;
    }

    await review.save();

    return res.status(200).json(
        new ApiResponse(200, review, "Review updated successfully")
    );
});

const getReviewsByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const role = req.user?.role;

    if (role !== "tenant") throw new ApiError(403, "Unauthorized");

    const reviews = await Review.find({ user: userId });

    return res.status(200).json(
        new ApiResponse(200, reviews, "Reviews fetched successfully")
    );
});