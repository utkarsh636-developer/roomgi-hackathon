import { Router } from "express"
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js"
import {
    toggleBlockUser,
    toggleBlockProperty,
    toggleVerifyUser,
    toggleVerifyProperty,
    getUsersReportStats,
    getPropertiesReportStats
} from "../controllers/admin.controller.js"

const router = Router()

// ==================== ADMIN ONLY ROUTES (Require Authentication + Admin Role) ====================
router.use(verifyJWT, verifyAdmin)

/**
 * PATCH /api/admin/users/:userId/block
 * Toggle block/unblock status of a user
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: admin
 * 
 * URL Parameters:
 *   userId: string (MongoDB ObjectId)
 * 
 * Request Body: None
 * 
 * Note: This will also block/unblock all properties owned by the user if they are an owner
 * 
 * Response: { isBlocked: boolean }
 */
router.route("/users/:userId/block").patch(toggleBlockUser)

/**
 * PATCH /api/admin/users/:userId/verify
 * Update user verification status
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: admin
 * 
 * URL Parameters:
 *   userId: string (MongoDB ObjectId)
 * 
 * Request Body (JSON):
 * {
 *   "status": "string (required, values: pending | approved | rejected)",
 *   "rejectionReason": "string (required if status is 'rejected')"
 * }
 * 
 * Response: Updated verification object
 */
router.route("/users/:userId/verify").patch(toggleVerifyUser)

/**
 * PATCH /api/admin/properties/:propertyId/block
 * Toggle block/unblock status of a property
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: admin
 * 
 * URL Parameters:
 *   propertyId: string (MongoDB ObjectId)
 * 
 * Request Body: None
 * 
 * Response: { isBlocked: boolean }
 */
router.route("/properties/:propertyId/block").patch(toggleBlockProperty)

/**
 * PATCH /api/admin/properties/:propertyId/verify
 * Update property verification status
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: admin
 * 
 * URL Parameters:
 *   propertyId: string (MongoDB ObjectId)
 * 
 * Request Body (JSON):
 * {
 *   "status": "string (required, values: pending | approved | rejected)",
 *   "rejectionReason": "string (required if status is 'rejected')"
 * }
 * 
 * Response: Updated verification object
 */
router.route("/properties/:propertyId/verify").patch(toggleVerifyProperty)

/**
 * GET /api/admin/stats/reports/users
 * Get statistics of users sorted by number of reports
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: admin
 * 
 * Response: Array of user report statistics with user details
 */
router.route("/stats/reports/users").get(getUsersReportStats)

/**
 * GET /api/admin/stats/reports/properties
 * Get statistics of properties sorted by number of reports
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: admin
 * 
 * Response: Array of property report statistics with property details
 */
router.route("/stats/reports/properties").get(getPropertiesReportStats)

export default router
