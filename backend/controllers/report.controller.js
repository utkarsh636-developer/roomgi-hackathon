import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Report } from "../models/report.model.js";
import { User } from "../models/user.model.js";
import { Property } from "../models/property.model.js";

const createReport = asyncHandler(async (req, res) => {
    const { targetModel, targetId, reason, message } = req.body;
    const userId = req.user?._id;

    if (!targetModel || !targetId || !reason || !message) {
        throw new ApiError(400, "All fields are required");
    }

    if (!["Property", "User"].includes(targetModel)) {
        throw new ApiError(400, "Invalid target model");
    }

    const reportData = {
        reporter: userId,
        targetModel,
        reason,
        message,
        status: "pending"
    };

    if (targetModel === "User") {
        const targetUser = await User.findById(targetId);
        if (!targetUser) {
            throw new ApiError(404, "Target user not found");
        }
        reportData.targetUser = targetId;

        const report = await Report.create(reportData);

        // Push report to target user's reports array
        await User.findByIdAndUpdate(targetId, {
            $push: { reports: report._id }
        });

        return res.status(201).json(
            new ApiResponse(201, report, "User reported successfully")
        );

    } else if (targetModel === "Property") {
        const targetProperty = await Property.findById(targetId);
        if (!targetProperty) {
            throw new ApiError(404, "Target property not found");
        }
        reportData.targetProperty = targetId;

        const report = await Report.create(reportData);

        // Push report to target property's reports array
        await Property.findByIdAndUpdate(targetId, {
            $push: { reports: report._id }
        });

        return res.status(201).json(
            new ApiResponse(201, report, "Property reported successfully")
        );
    }
});

const getAllReports = asyncHandler(async (req, res) => {
    const role = req.user?.role;
    if (role !== "admin") {
        throw new ApiError(403, "Unauthorized");
    }

    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const reports = await Report.find(filter)
        .populate("reporter", "username email profileImage")
        .populate("targetUser", "username email profileImage")
        .populate("targetProperty", "location images type")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, reports, "All reports fetched successfully")
    );
});

const getReportById = asyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const role = req.user?.role;

    if (role !== "admin") {
        throw new ApiError(403, "Unauthorized");
    }

    const report = await Report.findById(reportId)
        .populate("reporter", "username email profileImage")
        .populate("targetUser", "username email profileImage")
        .populate("targetProperty", "location images type");

    if (!report) {
        throw new ApiError(404, "Report not found");
    }

    return res.status(200).json(
        new ApiResponse(200, report, "Report fetched successfully")
    );
});

const changeReportStatus = asyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const { status } = req.body;
    const role = req.user?.role;

    if (role !== "admin") {
        throw new ApiError(403, "Unauthorized");
    }

    if (!["pending", "resolved", "dismissed"].includes(status)) {
        throw new ApiError(400, "Invalid status");
    }

    const report = await Report.findByIdAndUpdate(
        reportId,
        { status },
        { new: true }
    );

    if (!report) {
        throw new ApiError(404, "Report not found");
    }

    return res.status(200).json(
        new ApiResponse(200, report, "Report status updated successfully")
    );
});

const deleteReport = asyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const role = req.user?.role;

    if (role !== "admin") {
        throw new ApiError(403, "Unauthorized");
    }

    const report = await Report.findById(reportId);
    if (!report) {
        throw new ApiError(404, "Report not found");
    }

    if (report.targetModel === "User") {
        await User.findByIdAndUpdate(report.targetUser, {
            $pull: { reports: reportId }
        });
    } else if (report.targetModel === "Property") {
        await Property.findByIdAndUpdate(report.targetProperty, {
            $pull: { reports: reportId }
        });
    }

    await Report.findByIdAndDelete(reportId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Report deleted successfully")
    );
});

export {
    createReport,
    getAllReports,
    getReportById,
    changeReportStatus,
    deleteReport
};
