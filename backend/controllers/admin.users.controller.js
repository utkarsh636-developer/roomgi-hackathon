import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"

// Get all users with filters and pagination
const getAllUsers = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 20,
        role,
        verificationStatus,
        isBlocked,
        search
    } = req.query

    const query = {}

    // Apply filters
    if (role) query.role = role
    if (verificationStatus) query["verification.status"] = verificationStatus
    if (isBlocked !== undefined) query.isBlocked = isBlocked === "true"
    if (search) {
        query.$or = [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
        ]
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [users, totalCount] = await Promise.all([
        User.find(query)
            .select("-password -refreshToken")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit)),
        User.countDocuments(query)
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                users,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalCount / parseInt(limit)),
                    totalCount,
                    limit: parseInt(limit)
                }
            },
            "Users fetched successfully"
        )
    )
})

// Get single user details by ID
const getUserById = asyncHandler(async (req, res) => {
    const { userId } = req.params

    const user = await User.findById(userId)
        .select("-password -refreshToken")
        .populate("properties", "type location rent verification isBlocked")

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    return res.status(200).json(
        new ApiResponse(200, user, "User details fetched successfully")
    )
})

// Get users pending verification
const getPendingVerifications = asyncHandler(async (req, res) => {
    const users = await User.find({
        "verification.status": "pending",
        documents: { $exists: true, $ne: [] }
    })
        .select("-password -refreshToken")
        .sort({ "documents.0.uploadedAt": 1 }) // Oldest first

    return res.status(200).json(
        new ApiResponse(
            200,
            users,
            "Pending user verifications fetched successfully"
        )
    )
})

export {
    getAllUsers,
    getUserById,
    getPendingVerifications
}
