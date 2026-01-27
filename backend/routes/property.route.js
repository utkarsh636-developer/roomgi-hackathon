import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import {
    createProperty,
    updateProperty,
    getPropertyById,
    deleteProperty,
    getPropertiesByQueries,
    getReviews,
    verifyPropertyRequest,
    editPropertyDocument
} from "../controllers/property.controller.js"

const router = Router()

// Public search/get routes (no login required for viewing lists? Assume yes for queries, maybe not for details if contact info is hidden. 
// Standard practice: search is public, specific details *might* be protected or public. 
// getPropertyById logic didn't check auth, so it's public.)
router.route("/search").get(getPropertiesByQueries)
router.route("/:propertyId").get(getPropertyById)
router.route("/:propertyId/reviews").get(getReviews)


// Protected routes
router.use(verifyJWT)

router.route("/add").post(
    upload.fields([{ name: "images", maxCount: 4 }]),
    createProperty
)

router.route("/:propertyId")
    .patch(
        upload.fields([{ name: "images", maxCount: 4 }]),
        updateProperty
    )
    .delete(deleteProperty)

router.route("/:propertyId/verify-request").post(
    upload.fields([{ name: "documents", maxCount: 4 }]),
    verifyPropertyRequest
)

router.route("/:propertyId/edit-document").patch(
    upload.fields([{ name: "documents", maxCount: 4 }]),
    editPropertyDocument
)

export default router
