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

// Apply admin verification middleware to all routes
router.use(verifyJWT, verifyAdmin)

router.route("/users/:userId/block").patch(toggleBlockUser)
router.route("/users/:userId/verify").patch(toggleVerifyUser)

router.route("/properties/:propertyId/block").patch(toggleBlockProperty)
router.route("/properties/:propertyId/verify").patch(toggleVerifyProperty)

router.route("/stats/reports/users").get(getUsersReportStats)
router.route("/stats/reports/properties").get(getPropertiesReportStats)

export default router
