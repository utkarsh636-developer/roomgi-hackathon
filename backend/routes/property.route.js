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

/**
 * GET /api/properties/search
 * Search and filter properties (Public - No authentication required)
 * 
 * Query Parameters (all optional):
 * {
 *   "type": "string (hostel | pg | flat)",
 *   "city": "string",
 *   "state": "string",
 *   "pincode": "string",
 *   "minRent": "number",
 *   "maxRent": "number",
 *   "amenities": "string or string[] (comma-separated or array)",
 *   "minCapacity": "number",
 *   "maxCapacity": "number",
 *   "status": "string (available | occupied)",
 *   "preferences": "string (search in preferences field)",
 *   "lat": "number (latitude for geo search)",
 *   "lng": "number (longitude for geo search)",
 *   "maxDistance": "number (in km, requires lat & lng)"
 * }
 * 
 * Response: Array of property objects (with distance if geo search)
 */
router.route("/search").get(getPropertiesByQueries)

/**
 * GET /api/properties/:propertyId
 * Get single property details by ID (Public - No authentication required)
 * 
 * URL Parameters:
 *   propertyId: string (MongoDB ObjectId)
 * 
 * Response: Property object with all details
 */
router.route("/:propertyId").get(getPropertyById)

/**
 * GET /api/properties/:propertyId/reviews
 * Get all reviews for a specific property (Public - No authentication required)
 * 
 * URL Parameters:
 *   propertyId: string (MongoDB ObjectId)
 * 
 * Response: Array of review objects with populated user details
 */
router.route("/:propertyId/reviews").get(getReviews)

// ==================== PROTECTED ROUTES (Require Authentication) ====================
router.use(verifyJWT)

/**
 * POST /api/properties/add
 * Create a new property listing
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: owner
 * 
 * Request Body (multipart/form-data):
 * {
 *   "type": "string (required, values: hostel | pg | flat)",
 *   "address": "string (required)",
 *   "city": "string (required)",
 *   "state": "string (required)",
 *   "pincode": "string (required)",
 *   "coordinates.lng": "number (required, longitude)",
 *   "coordinates.lat": "number (required, latitude)",
 *   "rent": "number (required)",
 *   "securityDeposit": "number (required)",
 *   "capacity.total": "number (required)",
 *   "amenities": "string[] (optional, valid values from AMENITIES constant)",
 *   "description": "string (optional)",
 *   "preferences": "string (optional)",
 *   "images": "file[] (required, minimum 1, maximum 4 image files)"
 * }
 * 
 * Response: Created property object
 */
router.route("/add").post(
    upload.fields([{ name: "images", maxCount: 4 }]),
    createProperty
)

/**
 * PATCH /api/properties/:propertyId
 * Update existing property
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: owner (must be property owner)
 * 
 * URL Parameters:
 *   propertyId: string (MongoDB ObjectId)
 * 
 * Request Body (multipart/form-data):
 * {
 *   "type": "string (hostel | pg | flat)",
 *   "address": "string",
 *   "city": "string",
 *   "state": "string",
 *   "pincode": "string",
 *   "rent": "number",
 *   "securityDeposit": "number",
 *   "amenities": "string[]",
 *   "capacity": "object { total: number }",
 *   "description": "string",
 *   "preferences": "string",
 *   "coordinates": "object { lng: number, lat: number }",
 *   "images": "file[] (required, minimum 1, maximum 4 image files)"
 * }
 * 
 * Note: All old images will be replaced with new ones
 * 
 * Response: Updated property object
 */
router.route("/:propertyId")
    .patch(
        upload.fields([{ name: "images", maxCount: 4 }]),
        updateProperty
    )
    /**
     * DELETE /api/properties/:propertyId
     * Delete property and all associated data
     * 
     * Headers:
     *   Authorization: Bearer <accessToken>
     * 
     * Role Required: owner (must be property owner)
     * 
     * URL Parameters:
     *   propertyId: string (MongoDB ObjectId)
     * 
     * Note: This will delete property, all reviews, enquiries, and media files
     * 
     * Response: Success message
     */
    .delete(deleteProperty)

/**
 * POST /api/properties/:propertyId/verify-request
 * Submit property verification request with documents
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: owner (must be property owner)
 * 
 * URL Parameters:
 *   propertyId: string (MongoDB ObjectId)
 * 
 * Request Body (multipart/form-data):
 * {
 *   "documents": "file[] (required, minimum 4 files, maximum 4 files)",
 *   "documentTypes": "string[] (required, must include 'ownership_proof' and 'government_id')"
 * }
 * 
 * Note: ownership_proof and government_id are mandatory document types
 * 
 * Response: Updated property object with verification status
 */
router.route("/:propertyId/verify-request").post(
    upload.fields([{ name: "documents", maxCount: 4 }]),
    verifyPropertyRequest
)

/**
 * PATCH /api/properties/:propertyId/edit-document
 * Edit/Replace property verification documents
 * 
 * Headers:
 *   Authorization: Bearer <accessToken>
 * 
 * Role Required: owner (must be property owner)
 * 
 * URL Parameters:
 *   propertyId: string (MongoDB ObjectId)
 * 
 * Request Body (multipart/form-data):
 * {
 *   "documents": "file[] (required, minimum 4 files, maximum 4 files)",
 *   "documentTypes": "string[] (required, must include 'ownership_proof' and 'government_id')"
 * }
 * 
 * Note: Can only edit when verification status is pending or rejected
 * 
 * Response: Updated property object with new documents
 */
router.route("/:propertyId/edit-document").patch(
    upload.fields([{ name: "documents", maxCount: 4 }]),
    editPropertyDocument
)

export default router
