import { Router } from "express"
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js"
import {
    createReport,
    getAllReports,
    getReportById,
    changeReportStatus,
    deleteReport
} from "../controllers/report.controller.js"

const router = Router()

// ==================== PROTECTED ROUTES (All report routes require authentication) ====================
router.use(verifyJWT)

/**
 * POST /api/reports/create
 * Create a new report against a user or property
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Request Body (JSON):
 * {
 *   "targetModel": "string (required, values: User | Property)",
 *   "targetId": "string (required, MongoDB ObjectId of user or property)",
 *   "reason": "string (required)",
 *   "message": "string (required)"
 * }
 * 
 * Response: Created report object
 */
router.route("/create").post(createReport)

// ==================== ADMIN ONLY ROUTES ====================

/**
 * GET /api/reports/all
 * Get all reports (optionally filtered by status)
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: admin
 * 
 * Query Parameters (optional):
 * {
 *   "status": "string (pending | resolved | dismissed)"
 * }
 * 
 * Response: Array of report objects with populated reporter, targetUser, and targetProperty
 */
router.route("/all").get(verifyAdmin, getAllReports)

/**
 * GET /api/reports/:reportId
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
 * Response: Report object with populated details
 */
router.route("/:reportId")
    .get(verifyAdmin, getReportById)
    /**
     * DELETE /api/reports/:reportId
     * Delete a report
     * 
     * Headers:
     *   Authorization: Bearer <accessToken>
     * 
     * Role Required: admin
     * 
     * URL Parameters:
     *   reportId: string (MongoDB ObjectId)
     * 
     * Note: This will also remove the report reference from the target user/property
     * 
     * Response: Success message
     */
    .delete(verifyAdmin, deleteReport)

/**
 * PATCH /api/reports/:reportId/status
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
 *   "status": "string (required, values: pending | resolved | dismissed)"
 * }
 * 
 * Response: Updated report object
 */
router.route("/:reportId/status").patch(verifyAdmin, changeReportStatus)

export default router
