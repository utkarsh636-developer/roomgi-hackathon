import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    createEnquiry,
    deleteEnquiry,
    getEnquiryById,
    getEnquiryByTenantId,
    getEnquiryByOwnerId,
    acceptEnquiry,
    rejectEnquiry
} from "../controllers/enquiry.controller.js"

const router = Router()

router.use(verifyJWT) // All enquiry routes require login

router.route("/create").post(createEnquiry)
router.route("/tenant").get(getEnquiryByTenantId)
router.route("/owner").get(getEnquiryByOwnerId)

router.route("/:enquiryId")
    .get(getEnquiryById)
    .delete(deleteEnquiry)

router.route("/:enquiryId/accept").patch(acceptEnquiry)
router.route("/:enquiryId/reject").patch(rejectEnquiry)

export default router
