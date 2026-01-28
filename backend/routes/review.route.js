import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import {
    createReview,
    deleteReview,
    updateReview,
    getReviewsByUserId
} from "../controllers/review.controller.js"

const router = Router()

// ==================== PROTECTED ROUTES (All review routes require authentication) ====================
router.use(verifyJWT)

/**
 * GET /api/reviews/user/:userId
 * Get all reviews written by a specific user
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: tenant
 * 
 * URL Parameters:
 *   userId: string (MongoDB ObjectId)
 * 
 * Response: Array of review objects
 */
router.route("/user/:userId").get(getReviewsByUserId)

/**
 * POST /api/reviews/add
 * Create a new review for a property
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: tenant
 * 
 * Request Body (multipart/form-data):
 * {
 *   "propertyId": "string (required, MongoDB ObjectId)",
 *   "rating": "number (required, 1-5)",
 *   "comment": "string (optional)",
 *   "images": "file[] (optional, maximum 2 image files)"
 * }
 * 
 * Note: This will automatically update the property's average rating score
 * 
 * Response: Created review object
 */
router.route("/add").post(
    upload.fields([{ name: "images", maxCount: 2 }]),
    createReview
)

/**
 * DELETE /api/reviews/:reviewId
 * Delete a review
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: tenant (must be review author)
 * 
 * URL Parameters:
 *   reviewId: string (MongoDB ObjectId)
 * 
 * Note: This will recalculate the property's average rating score
 * 
 * Response: Success message
 */
router.route("/:reviewId")
    .delete(deleteReview)
    /**
     * PATCH /api/reviews/:reviewId
     * Update an existing review
     * 
     * Headers:
     *   Authorization: Bearer <accessToken>
     * 
     * Role Required: tenant (must be review author)
     * 
     * URL Parameters:
     *   reviewId: string (MongoDB ObjectId)
     * 
     * Request Body (multipart/form-data):
     * {
     *   "rating": "number (optional, 1-5)",
     *   "comment": "string (optional)",
     *   "images": "file[] (optional, maximum 2 image files, replaces old images)"
     * }
     * 
     * Note: If rating is changed, property's average rating will be recalculated
     * 
     * Response: Updated review object
     */
    .patch(
        upload.fields([{ name: "images", maxCount: 2 }]),
        updateReview
    )

export default router
