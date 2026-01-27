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

router.use(verifyJWT)

// Publicly accessible for logged-in users to report
router.route("/create").post(createReport)

// Admin only routes
router.route("/all").get(verifyAdmin, getAllReports)
router.route("/:reportId")
    .get(verifyAdmin, getReportById)
    .delete(verifyAdmin, deleteReport)

router.route("/:reportId/status").patch(verifyAdmin, changeReportStatus)

export default router
