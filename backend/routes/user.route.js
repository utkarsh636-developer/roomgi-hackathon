import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateProfile,
    getOwnerProperties,
    getUserEnquiries,
    getFavouriteProperties,
    verifyUserRequest,
    editUserDocument
} from "../controllers/user.controller.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

// Protected routes
router.use(verifyJWT)

router.route("/logout").post(logoutUser)
router.route("/current-user").get(getCurrentUser)
router.route("/update-profile").patch(
    upload.single("profileImage"),
    updateProfile
)

// Specific roles logic handled in controller
router.route("/owner/properties").get(getOwnerProperties)
router.route("/tenant/enquiries").get(getUserEnquiries)
router.route("/tenant/favourites").get(getFavouriteProperties)

// Verification
router.route("/verify-request").post(
    upload.fields([{ name: "documents", maxCount: 2 }]),
    verifyUserRequest
)
router.route("/edit-document").patch(
    upload.fields([{ name: "documents", maxCount: 2 }]),
    editUserDocument
)

export default router
