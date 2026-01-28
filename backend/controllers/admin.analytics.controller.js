import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { Property } from "../models/property.model.js"
import { Report } from "../models/report.model.js"

// Get dashboard overview statistics
const getDashboardStats = asyncHandler(async (req, res) => {
    const [
        totalUsers,
        totalProperties,
        pendingUserVerifications,
        pendingPropertyVerifications,
        activeReports,
        blockedUsers,
        blockedProperties
    ] = await Promise.all([
        User.countDocuments(),
        Property.countDocuments(),
        User.countDocuments({ "verification.status": "pending" }),
        Property.countDocuments({ "verification.status": "pending" }),
        Report.countDocuments({ status: "pending" }),
        User.countDocuments({ isBlocked: true }),
        Property.countDocuments({ isBlocked: true })
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalUsers,
                totalProperties,
                pendingUserVerifications,
                pendingPropertyVerifications,
                activeReports,
                blockedUsers,
                blockedProperties
            },
            "Dashboard statistics fetched successfully"
        )
    )
})

// Get user analytics (registration trends, role distribution)
const getUserAnalytics = asyncHandler(async (req, res) => {
    // Role distribution
    const roleDistribution = await User.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ])

    // Verification status distribution
    const verificationDistribution = await User.aggregate([
        {
            $group: {
                _id: "$verification.status",
                count: { $sum: 1 }
            }
        }
    ])

    // User growth over last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const userGrowth = await User.aggregate([
        {
            $match: {
                createdAt: { $gte: thirtyDaysAgo }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                roleDistribution,
                verificationDistribution,
                userGrowth
            },
            "User analytics fetched successfully"
        )
    )
})

// Get property analytics
const getPropertyAnalytics = asyncHandler(async (req, res) => {
    // Property type distribution
    const typeDistribution = await Property.aggregate([
        {
            $group: {
                _id: "$type",
                count: { $sum: 1 }
            }
        }
    ])

    // Verification status distribution
    const verificationDistribution = await Property.aggregate([
        {
            $group: {
                _id: "$verification.status",
                count: { $sum: 1 }
            }
        }
    ])

    // City distribution (top 10 cities)
    const cityDistribution = await Property.aggregate([
        {
            $group: {
                _id: "$location.city",
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ])

    // Property growth over last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const propertyGrowth = await Property.aggregate([
        {
            $match: {
                createdAt: { $gte: thirtyDaysAgo }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                typeDistribution,
                verificationDistribution,
                cityDistribution,
                propertyGrowth
            },
            "Property analytics fetched successfully"
        )
    )
})

// Get report analytics
const getReportAnalytics = asyncHandler(async (req, res) => {
    // Report status distribution
    const statusDistribution = await Report.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ])

    // Report target distribution
    const targetDistribution = await Report.aggregate([
        {
            $group: {
                _id: "$targetModel",
                count: { $sum: 1 }
            }
        }
    ])

    // Report reason distribution
    const reasonDistribution = await Report.aggregate([
        {
            $group: {
                _id: "$reason",
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                statusDistribution,
                targetDistribution,
                reasonDistribution
            },
            "Report analytics fetched successfully"
        )
    )
})

export {
    getDashboardStats,
    getUserAnalytics,
    getPropertyAnalytics,
    getReportAnalytics
}
