import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Report } from "../models/report.model.js"

// Get all reports with filters and pagination
const getAllReports = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 20,
        status,
        targetModel
    } = req.query

    const query = {}

    // Apply filters
    if (status) query.status = status
    if (targetModel) query.targetModel = targetModel

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [reports, totalCount] = await Promise.all([
        Report.find(query)
            .populate("reporter", "username email profileImage")
            .populate("targetUser", "username email profileImage")
            .populate("targetProperty", "type location images")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit)),
        Report.countDocuments(query)
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                reports,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalCount / parseInt(limit)),
                    totalCount,
                    limit: parseInt(limit)
                }
            },
            "Reports fetched successfully"
        )
    )
})

// Get single report details
const getReportById = asyncHandler(async (req, res) => {
    const { reportId } = req.params

    const report = await Report.findById(reportId)
        .populate("reporter", "username email profileImage phoneNumber")
        .populate("targetUser", "username email profileImage verification isBlocked")
        .populate("targetProperty", "type location rent images verification isBlocked owner")

    if (!report) {
        throw new ApiError(404, "Report not found")
    }

    return res.status(200).json(
        new ApiResponse(200, report, "Report details fetched successfully")
    )
})

// Update report status
const updateReportStatus = asyncHandler(async (req, res) => {
    const { reportId } = req.params
    const { status } = req.body // "resolved" | "dismissed"

    if (!["resolved", "dismissed"].includes(status)) {
        throw new ApiError(400, "Invalid status. Must be 'resolved' or 'dismissed'")
    }

    const report = await Report.findById(reportId)
    if (!report) {
        throw new ApiError(404, "Report not found")
    }

    report.status = status
    await report.save()

    return res.status(200).json(
        new ApiResponse(200, report, `Report marked as ${status}`)
    )
})

export {
    getAllReports,
    getReportById,
    updateReportStatus
}
