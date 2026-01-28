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

/**
 * POST /api/users/register
 * Register a new user
 * 
 * Request Body (JSON):
 * {
 *   "username": "string (required)",
 *   "email": "string (required)",
 *   "password": "string (required)",
 *   "phoneNumber": "string (required)",
 *   "role": "string (optional, default: 'tenant', values: 'tenant' | 'owner')"
 * }
 * 
 * Response: User object with accessToken and refreshToken
 */
router.route("/register").post(registerUser)

/**
 * POST /api/users/login
 * Login existing user
 * 
 * Request Body (JSON):
 * {
 *   "email": "string (required)",
 *   "password": "string (required)"
 * }
 * 
 * Response: User object with accessToken and refreshToken
 */
router.route("/login").post(loginUser)

// ==================== PROTECTED ROUTES (Require Authentication) ====================
router.use(verifyJWT)

/**
 * POST /api/users/logout
 * Logout current user
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Request Body: None
 * 
 * Response: Success message
 */
router.route("/logout").post(logoutUser)

/**
 * GET /api/users/current-user
 * Get current logged-in user details
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Response: User object with all details
 */
router.route("/current-user").get(getCurrentUser)

/**
 * PATCH /api/users/update-profile
 * Update user profile
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Request Body (multipart/form-data):
 * {
 *   "username": "string (optional)",
 *   "password": "string (optional)",
 *   "phoneNumber": "string (optional)",
 *   "profileImage": "file (optional, single image file)"
 * }
 * 
 * Response: Updated user object
 */
router.route("/update-profile").patch(
    upload.single("profileImage"),
    updateProfile
)

/**
 * GET /api/users/owner/properties
 * Get all properties owned by the current owner
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: owner
 * 
 * Response: Array of property objects
 */
router.route("/owner/properties").get(getOwnerProperties)

/**
 * GET /api/users/tenant/enquiries
 * Get all enquiries made by the current tenant
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Response: Array of enquiry objects
 */
router.route("/tenant/enquiries").get(getUserEnquiries)

/**
 * GET /api/users/tenant/favourites
 * Get all favourite properties of the current tenant
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: tenant
 * 
 * Response: Array of property objects
 */
router.route("/tenant/favourites").get(getFavouriteProperties)

/**
 * POST /api/users/verify-request
 * Submit verification request with documents
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Request Body (multipart/form-data):
 * {
 *   "documents": "file[] (required, minimum 2 files, maximum 2 files)",
 *   "documentTypes": "string[] (required, must match number of documents)"
 * }
 * 
 * Note: documentTypes should be an array with same length as documents
 * 
 * Response: Updated user object with verification status
 */
router.route("/verify-request").post(
    upload.fields([{ name: "documents", maxCount: 2 }]),
    verifyUserRequest
)

/**
 * PATCH /api/users/edit-document
 * Edit/Replace verification documents (only when status is pending or rejected)
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Request Body (multipart/form-data):
 * {
 *   "documents": "file[] (required, minimum 2 files, maximum 2 files)",
 *   "documentTypes": "string[] (required, must match number of documents)"
 * }
 * 
 * Response: Updated user object with new documents
 */
router.route("/edit-document").patch(
    upload.fields([{ name: "documents", maxCount: 2 }]),
    editUserDocument
)

export default router
