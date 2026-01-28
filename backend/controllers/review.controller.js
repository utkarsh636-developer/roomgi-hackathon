import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review } from "../models/review.model.js";
import { Property } from "../models/property.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { cloudinary , extractPublicId} from "../utils/cloudinary.js";

const createReview = asyncHandler(async (req, res) => {
    const { propertyId, rating, comment } = req.body
    const userId = req.user?._id
    const role = req.user?.role

    if (role !== "tenant") {
        throw new ApiError(403, "Unauthorized")
    }

    if (!rating || rating < 1 || rating > 5) {
        throw new ApiError(400, "Rating must be between 1 and 5")
    }

    const property = await Property.findById(propertyId)
    if (!property) {
        throw new ApiError(404, "Property not found")
    }

    /* ================= IMAGE VALIDATION ================= */

    const imageFiles = req.files?.images || []
    if (imageFiles.length > 2) {
        throw new ApiError(400, "Maximum 2 images allowed for a review")
    }

    const uploadedImages = []
    for (const file of imageFiles) {
        const uploaded = await uploadOnCloudinary(file.path)
        if (!uploaded?.secure_url) {
            throw new ApiError(500, "Image upload failed")
        }
        uploadedImages.push(uploaded.secure_url)
    }

    /* ================= CREATE REVIEW ================= */

    const review = await Review.create({
        property: propertyId,
        user: userId,
        rating,
        comment,
        images: uploadedImages
    })

    /* ================= LINK REVIEW ================= */

    property.reviews.push(review._id)
    await property.save()

    /* ================= UPDATE RATING SCORE ================= */

    const ratingStats = await Review.aggregate([
        { $match: { property: property._id } },
        {
            $group: {
                _id: "$property",
                avgRating: { $avg: "$rating" }
            }
        }
    ])

    const avgRating = ratingStats.length
        ? Number(ratingStats[0].avgRating.toFixed(1))
        : 0

    await Property.findByIdAndUpdate(propertyId, {
        ratingScore: avgRating
    })

    return res.status(201).json(
        new ApiResponse(
            201,
            review,
            "Review added successfully and rating updated"
        )
    )
})

const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params
    const userId = req.user?._id
    const role = req.user?.role

    if (role !== "tenant") {
        throw new ApiError(403, "Unauthorized")
    }

    const review = await Review.findById(reviewId)
    if (!review) {
        throw new ApiError(404, "Review not found")
    }

    if (review.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only delete your own reviews")
    }

    const propertyId = review.property

    /* ================= REMOVE REVIEW FROM PROPERTY ================= */

    await Property.findByIdAndUpdate(propertyId, {
        $pull: { reviews: review._id }
    })

    /* ================= DELETE REVIEW IMAGES ================= */

    if (review.images?.length) {
        await Promise.all(
            review.images.map((imgUrl) => {
                const publicId = imgUrl.split("/").pop().split(".")[0]
                return cloudinary.uploader.destroy(publicId)
            })
        )
    }

    /* ================= DELETE REVIEW ================= */

    await Review.findByIdAndDelete(reviewId)

    /* ================= RECALCULATE RATING ================= */

    const ratingStats = await Review.aggregate([
        { $match: { property: propertyId } },
        {
            $group: {
                _id: "$property",
                avgRating: { $avg: "$rating" }
            }
        }
    ])

    const avgRating = ratingStats.length
        ? Number(ratingStats[0].avgRating.toFixed(1))
        : 0

    await Property.findByIdAndUpdate(propertyId, {
        ratingScore: avgRating
    })

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Review deleted and property rating updated"
        )
    )
})
const updateReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params
    const userId = req.user?._id
    const role = req.user?.role

    if (role !== "tenant") {
        throw new ApiError(403, "Unauthorized")
    }

    const review = await Review.findById(reviewId)
    if (!review) {
        throw new ApiError(404, "Review not found")
    }

    if (review.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only update your own reviews")
    }

    const { rating, comment } = req.body
    const imageFiles = req.files?.images || []

    if (
        rating === undefined &&
        comment === undefined &&
        imageFiles.length === 0
    ) {
        throw new ApiError(400, "Nothing to update")
    }

    const ratingChanged = rating !== undefined && rating !== review.rating

    /* ================= UPDATE FIELDS ================= */

    if (rating !== undefined) review.rating = rating
    if (comment !== undefined) review.comment = comment

    /* ================= HANDLE IMAGES ================= */

    if (imageFiles.length > 0) {
        if (imageFiles.length > 2) {
            throw new ApiError(400, "Maximum 2 images allowed")
        }

        // Delete old images
        if (review.images?.length) {
            await Promise.all(
                review.images.map((imgUrl) => {
                    const publicId = extractPublicId(imgUrl)
                    return cloudinary.uploader.destroy(publicId)
                })
            )
        }

        // Upload new images
        const uploadedImages = []
        for (const file of imageFiles) {
            const uploaded = await uploadOnCloudinary(file.path)
            if (!uploaded?.secure_url) {
                throw new ApiError(500, "Image upload failed")
            }
            uploadedImages.push(uploaded.secure_url)
        }

        review.images = uploadedImages
    }

    await review.save()

    /* ================= RECALCULATE RATING ================= */

    if (ratingChanged) {
        const ratingStats = await Review.aggregate([
            { $match: { property: review.property } },
            {
                $group: {
                    _id: "$property",
                    avgRating: { $avg: "$rating" }
                }
            }
        ])

        const avgRating = ratingStats.length
            ? Number(ratingStats[0].avgRating.toFixed(1))
            : 0

        await Property.findByIdAndUpdate(review.property, {
            ratingScore: avgRating
        })
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            review,
            "Review updated successfully"
        )
    )
})

const getReviewsByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const role = req.user?.role;

    if (role !== "tenant") throw new ApiError(403, "Unauthorized");

    const reviews = await Review.find({ user: userId });

    return res.status(200).json(
        new ApiResponse(200, reviews, "Reviews fetched successfully")
    );
});

export {
    createReview,
    deleteReview,
    updateReview,
    getReviewsByUserId
}
