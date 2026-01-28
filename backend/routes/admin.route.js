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
import {
    getDashboardStats,
    getUserAnalytics,
    getPropertyAnalytics,
    getReportAnalytics
} from "../controllers/admin.analytics.controller.js"
import {
    getAllUsers,
    getUserById,
    getPendingVerifications as getPendingUserVerifications
} from "../controllers/admin.users.controller.js"
import {
    getAllProperties,
    getPropertyById as getAdminPropertyById,
    getPendingVerifications as getPendingPropertyVerifications
} from "../controllers/admin.properties.controller.js"
import {
    getAllReports,
    getReportById,
    updateReportStatus
} from "../controllers/admin.reports.controller.js"


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

// ==================== DASHBOARD & ANALYTICS ROUTES ====================

/**
 * GET /api/admin/dashboard/stats
 * Get dashboard overview statistics
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: admin
 * 
 * Response: Dashboard statistics object with counts
 */
router.route("/dashboard/stats").get(getDashboardStats)

/**
 * GET /api/admin/analytics/users
 * Get user analytics (role distribution, verification status, growth trends)
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: admin
 * 
 * Response: User analytics data
 */
router.route("/analytics/users").get(getUserAnalytics)

/**
 * GET /api/admin/analytics/properties
 * Get property analytics (type distribution, city distribution, growth trends)
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: admin
 * 
 * Response: Property analytics data
 */
router.route("/analytics/properties").get(getPropertyAnalytics)

/**
 * GET /api/admin/analytics/reports
 * Get report analytics (status distribution, target distribution, reason distribution)
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: admin
 * 
 * Response: Report analytics data
 */
router.route("/analytics/reports").get(getReportAnalytics)

// ==================== USER MANAGEMENT ROUTES ====================

/**
 * GET /api/admin/users
 * Get all users with filters and pagination
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: admin
 * 
 * Query Parameters:
 *   page: number (default: 1)
 *   limit: number (default: 20)
 *   role: string (tenant | owner | admin)
 *   verificationStatus: string (pending | approved | rejected)
 *   isBlocked: boolean
 *   search: string (search in username/email)
 * 
 * Response: Paginated users list
 */
router.route("/users").get(getAllUsers)

/**
 * GET /api/admin/users/pending-verifications
 * Get users pending verification
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: admin
 * 
 * Response: Array of users with pending verification
 */
router.route("/users/pending-verifications").get(getPendingUserVerifications)

/**
 * GET /api/admin/users/:userId
 * Get single user details by ID
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: admin
 * 
 * URL Parameters:
 *   userId: string (MongoDB ObjectId)
 * 
 * Response: User object with populated properties
 */
router.route("/users/:userId").get(getUserById)

// ==================== PROPERTY MANAGEMENT ROUTES ====================

/**
 * GET /api/admin/properties
 * Get all properties with filters and pagination
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: admin
 * 
 * Query Parameters:
 *   page: number (default: 1)
 *   limit: number (default: 20)
 *   type: string (flat | PG | hostel)
 *   verificationStatus: string (pending | approved | rejected)
 *   isBlocked: boolean
 *   city: string
 *   search: string (search in description/address)
 * 
 * Response: Paginated properties list
 */
router.route("/properties").get(getAllProperties)

/**
 * GET /api/admin/properties/pending-verifications
 * Get properties pending verification
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: admin
 * 
 * Response: Array of properties with pending verification
 */
router.route("/properties/pending-verifications").get(getPendingPropertyVerifications)

/**
 * GET /api/admin/properties/:propertyId
 * Get single property details by ID
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: admin
 * 
 * URL Parameters:
 *   propertyId: string (MongoDB ObjectId)
 * 
 * Response: Property object with populated owner and reviews
 */
router.route("/properties/:propertyId").get(getAdminPropertyById)

// ==================== REPORT MANAGEMENT ROUTES ====================

/**
 * GET /api/admin/reports
 * Get all reports with filters and pagination
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: admin
 * 
 * Query Parameters:
 *   page: number (default: 1)
 *   limit: number (default: 20)
 *   status: string (pending | resolved | dismissed)
 *   targetModel: string (User | Property)
 * 
 * Response: Paginated reports list
 */
router.route("/reports").get(getAllReports)

/**
 * GET /api/admin/reports/:reportId
 * Get single report details by ID
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: admin
 * 
 * URL Parameters:
 *   reportId: string (MongoDB ObjectId)
 * 
 * Response: Report object with populated reporter and target
 */
router.route("/reports/:reportId").get(getReportById)

/**
 * PATCH /api/admin/reports/:reportId/status
 * Update report status
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: admin
 * 
 * URL Parameters:
 *   reportId: string (MongoDB ObjectId)
 * 
 * Request Body (JSON):
 * {
 *   "status": "string (required, values: resolved | dismissed)"
 * }
 * 
 * Response: Updated report object
 */
router.route("/reports/:reportId/status").patch(updateReportStatus)

export default router
