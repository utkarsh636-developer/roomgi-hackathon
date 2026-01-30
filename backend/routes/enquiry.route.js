import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    createEnquiry,
    deleteEnquiry,
    getEnquiryById,
    getEnquiryByTenantId,
    getEnquiryByOwnerId,
    acceptEnquiry,
    rejectEnquiry,
    updateEnquiry
} from "../controllers/enquiry.controller.js"

const router = Router()

// ==================== PROTECTED ROUTES (All enquiry routes require authentication) ====================
router.use(verifyJWT)

/**
 * POST /api/enquiries/create
 * Create a new enquiry for a property
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Request Body (JSON):
 * {
 *   "propertyId": "string (required, MongoDB ObjectId)",
 *   "message": "string (required)",
 *   "name": "string (required)",
 *   "email": "string (required)",
 *   "phone": "string (required)"
 * }
 * 
 * Note: Cannot enquire about your own property
 * 
 * Response: Created enquiry object
 */
router.route("/create").post(createEnquiry)

/**
 * GET /api/enquiries/tenant
 * Get all enquiries made by the current tenant
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Response: Array of enquiry objects with populated property details
 */
router.route("/tenant").get(getEnquiryByTenantId)

/**
 * GET /api/enquiries/owner
 * Get all enquiries for properties owned by the current owner
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: owner
 * 
 * Response: Array of enquiry objects with populated property and user details
 */
router.route("/owner").get(getEnquiryByOwnerId)

/**
 * GET /api/enquiries/:enquiryId
 * Get single enquiry details by ID
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * URL Parameters:
 *   enquiryId: string (MongoDB ObjectId)
 * 
 * Note: Only accessible by enquiry creator or property owner
 * 
 * Response: Enquiry object with populated property and user details
 */
router.route("/:enquiryId")
    .get(getEnquiryById)
    /**
     * DELETE /api/enquiries/:enquiryId
     * Delete an enquiry
     * 
     * Headers:
     *   Authorization: Bearer <accessToken>
     * 
     * URL Parameters:
     *   enquiryId: string (MongoDB ObjectId)
     * 
     * Note: Can be deleted by enquiry creator or property owner
     * 
     * Response: Success message
     */
    .delete(deleteEnquiry)
    /**
     * PATCH /api/enquiries/:enquiryId
     * Update an enquiry
     * 
     * Headers:
     *   Authorization: Bearer <accessToken>
     * 
     * URL Parameters:
     *   enquiryId: string (MongoDB ObjectId)
     * 
     * Request Body (JSON):
     * {
     *   "message": "string (required)"
     * }
     * 
     * Note: Only accessible by enquiry creator (tenant)
     * 
     * Response: Updated enquiry object
     */
    .patch(updateEnquiry)

/**
 * PATCH /api/enquiries/:enquiryId/accept
 * Accept an enquiry and send reply
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: owner (must be property owner)
 * 
 * URL Parameters:
 *   enquiryId: string (MongoDB ObjectId)
 * 
 * Request Body (JSON):
 * {
 *   "reply": "string (required)"
 * }
 * 
 * Note: Changes enquiry status to 'contacted'
 * 
 * Response: Updated enquiry object
 */
router.route("/:enquiryId/accept").patch(acceptEnquiry)

/**
 * PATCH /api/enquiries/:enquiryId/reject
 * Reject an enquiry
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: owner (must be property owner)
 * 
 * URL Parameters:
 *   enquiryId: string (MongoDB ObjectId)
 * 
 * Request Body: None
 * 
 * Note: Changes enquiry status to 'rejected'
 * 
 * Response: Updated enquiry object
 */
router.route("/:enquiryId/reject").patch(rejectEnquiry)

export default router
