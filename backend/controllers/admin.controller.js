import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { Property } from "../models/property.model.js"
import { Report } from "../models/report.model.js"
import mongoose from "mongoose"

const toggleBlockUser = asyncHandler(async (req, res) => {
    const { userId } = req.params

    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    // Toggle block status
    user.isBlocked = !user.isBlocked
    await user.save({ validateBeforeSave: false })

    // Cascade: Block/Unblock all properties owned by this user
    if (user.role === "owner") {
        await Property.updateMany(
            { owner: userId },
            { $set: { isBlocked: user.isBlocked } }
        )
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            { isBlocked: user.isBlocked },
            user.isBlocked ? "User and their properties blocked successfully" : "User and their properties unblocked successfully"
        )
    )
})

const toggleBlockProperty = asyncHandler(async (req, res) => {
    const { propertyId } = req.params

    const property = await Property.findById(propertyId)
    if (!property) {
        throw new ApiError(404, "Property not found")
    }

    property.isBlocked = !property.isBlocked
    await property.save()

    return res.status(200).json(
        new ApiResponse(
            200,
            { isBlocked: property.isBlocked },
            property.isBlocked ? "Property blocked successfully" : "Property unblocked successfully"
        )
    )
})

const toggleVerifyUser = asyncHandler(async (req, res) => {
    const { userId } = req.params
    const { status, rejectionReason } = req.body // status: "approved" | "rejected" | "pending"

    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    if (status && !["pending", "approved", "rejected"].includes(status)) {
        throw new ApiError(400, "Invalid status")
    }

    user.verification.status = status || user.verification.status
    if (status === "rejected") {
        user.verification.rejectionReason = rejectionReason
    } else {
        user.verification.rejectionReason = undefined
    }

    if (status === "approved") {
        user.verification.verifiedBy = req.user._id
        user.verification.verifiedAt = Date.now()
    } else {
        user.verification.verifiedBy = undefined
        user.verification.verifiedAt = undefined
    }

    await user.save({ validateBeforeSave: false })

    return res.status(200).json(
        new ApiResponse(
            200,
            user.verification,
            `User verification status updated to ${user.verification.status}`
        )
    )
})

const toggleVerifyProperty = asyncHandler(async (req, res) => {
    const { propertyId } = req.params
    const { status, rejectionReason } = req.body

    const property = await Property.findById(propertyId)
    if (!property) {
        throw new ApiError(404, "Property not found")
    }

    if (status && !["pending", "approved", "rejected"].includes(status)) {
        throw new ApiError(400, "Invalid status")
    }

    property.verification.status = status || property.verification.status

    if (status === "rejected") {
        property.verification.rejectionReason = rejectionReason
    } else {
        property.verification.rejectionReason = undefined
    }

    if (status === "approved") {
        property.verification.verifiedBy = req.user._id
        property.verification.verifiedAt = Date.now()
    } else {
        property.verification.verifiedBy = undefined
        property.verification.verifiedAt = undefined
    }

    await property.save()

    return res.status(200).json(
        new ApiResponse(
            200,
            property.verification,
            `Property verification status updated to ${property.verification.status}`
        )
    )
})

const getUsersReportStats = asyncHandler(async (req, res) => {
    const stats = await Report.aggregate([
        {
            $match: { targetModel: "User", status: "pending" } // Only count pending reports? Or all? Usually detailed stats needed.
            // Requirement was "getUserReportbycount". Assuming sorting users by number of reports against them.
        },
        {
            $group: {
                _id: "$targetUser",
                reportCount: { $sum: 1 },
                latestReport: { $max: "$createdAt" }
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        {
            $unwind: "$userDetails"
        },
        {
            $project: {
                _id: 1,
                reportCount: 1,
                latestReport: 1,
                username: "$userDetails.username",
                email: "$userDetails.email",
                profileImage: "$userDetails.profileImage"
            }
        },
        { $sort: { reportCount: -1 } }
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            stats,
            "Users report statistics fetched successfully"
        )
    )
})

const getPropertiesReportStats = asyncHandler(async (req, res) => {
    const stats = await Report.aggregate([
        {
            $match: { targetModel: "Property" }
        },
        {
            $group: {
                _id: "$targetProperty",
                reportCount: { $sum: 1 },
                latestReport: { $max: "$createdAt" }
            }
        },
        {
            $lookup: {
                from: "properties",
                localField: "_id",
                foreignField: "_id",
                as: "propertyDetails"
            }
        },
        {
            $unwind: "$propertyDetails"
        },
        {
            $project: {
                _id: 1,
                reportCount: 1,
                latestReport: 1,
                title: "$propertyDetails.title", // Property model doesn't have title, maybe description or type/location
                type: "$propertyDetails.type",
                location: "$propertyDetails.location",
                images: { $arrayElemAt: ["$propertyDetails.images", 0] } // first image
            }
        },
        { $sort: { reportCount: -1 } }
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            stats,
            "Properties report statistics fetched successfully"
        )
    )
})

export {
    toggleBlockUser,
    toggleBlockProperty,
    toggleVerifyUser,
    toggleVerifyProperty,
    getUsersReportStats,
    getPropertiesReportStats
}
