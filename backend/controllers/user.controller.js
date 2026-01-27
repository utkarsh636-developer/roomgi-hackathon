import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")

        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})


const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, role, phoneNumber } = req.body

    if (!username || !email || !password || !phoneNumber) {
        throw new ApiError(400, "All required fields must be provided")
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
        throw new ApiError(409, "User already exists")
    }

    const user = await User.create({
        username,
        email,
        password,
        role,
        phoneNumber
    })

    const { accessToken, refreshToken } =
        await generateAccessAndRefereshTokens(user._id)

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    }

    return res
        .status(201)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                201,
                {
                    user: {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        phoneNumber: user.phoneNumber
                    }
                },
                "User registered successfully"
            )
        )
})
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required")
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(401, "Invalid credentials")
    }

    const isPasswordMatched = await user.isPasswordCorrect(password)
    if (!isPasswordMatched) {
        throw new ApiError(401, "Invalid credentials")
    }

    const { accessToken, refreshToken } =
        await generateAccessAndRefereshTokens(user._id)

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        phoneNumber: user.phoneNumber
                    }
                },
                "User logged in successfully"
            )
        )
})


const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    if (!userId) {
        throw new ApiError(401, "Unauthorized")
    }

    await User.findByIdAndUpdate(
        userId,
        { $unset: { refreshToken: 1 } }
    )

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    }

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out successfully"
            )
        )
})
const getCurrentUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            req.user,
            "User fetched successfully"
        )
    )
})

const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    if (!userId) {
        throw new ApiError(401, "Unauthorized")
    }

    const { username, password, phoneNumber } = req.body
    const profilePicture = req.file?.path

    if (!username && !password && !profilePicture && !phoneNumber) {
        throw new ApiError(400, "Nothing to update")
    }

    const updateData = {}

    if (username) updateData.username = username

    if (password) {
        updateData.password = password
    }

    if (phoneNumber) updateData.phoneNumber = phoneNumber

    let oldAvatarUrl

    if (profilePicture) {
        const avatar = await uploadOnCloudinary(profilePicture)
        if (!avatar?.url) {
            throw new ApiError(400, "Avatar upload failed")
        }

        const user = await User.findById(userId).select("profileImage")
        oldAvatarUrl = user?.profileImage

        updateData.profileImage = avatar.url
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
    ).select("-password")

    if (!updatedUser) {
        throw new ApiError(404, "User not found")
    }

    if (oldAvatarUrl) {
        const publicId = extractPublicId(oldAvatarUrl)
        await cloudinary.uploader.destroy(publicId)
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedUser,
            "Profile updated successfully"
        )
    )
})

const getOwnerProperties = asyncHandler(async (req, res) => {
    const user = req.user

    if (!user || user.role !== "owner") {
        throw new ApiError(403, "Unauthorized")
    }

    const properties = await Property.find({ owner: user._id })
        .sort({ createdAt: -1 })

    return res.status(200).json(
        new ApiResponse(
            200,
            properties,
            "Properties fetched successfully"
        )
    )
})

const getUserEnquiries = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    const user = await User.findById(userId)
        .populate({
            path: "enquiries",
            options: { sort: { createdAt: -1 } }
        })

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            user.enquiries || [],
            "Enquiries fetched successfully"
        )
    )
})

const getFavouriteProperties = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    const role = req.user?.role
    if (role !== "tenant") {
        throw new ApiError(403, "Unauthorized")
    }
    const user = await User.findById(userId)
        .populate({
            path: "favourites",
            options: { sort: { createdAt: -1 } }
        })

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            user.favourites || [],
            "Favourite properties fetched successfully"
        )
    )
})

const verifyUser = asyncHandler(async (req, res) => {
    // will complete later
})

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateProfile,
    getOwnerProperties,
    getUserEnquiries,
    getFavouriteProperties
}