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

router.use(verifyJWT)

router.route("/user/:userId").get(getReviewsByUserId)

router.route("/add").post(
    upload.fields([{ name: "images", maxCount: 2 }]),
    createReview
)

router.route("/:reviewId")
    .delete(deleteReview)
    .patch(
        upload.fields([{ name: "images", maxCount: 2 }]),
        updateReview
    )

export default router
