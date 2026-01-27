import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        role: {
            type: String,
            enum: ["tenant", "owner", "admin"],
            default: "tenant"
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            trim: true
        },
        profileImage: {
            type: String, // cloudinary url
        },
        properties: [
            {
                type: Schema.Types.ObjectId,
                ref: "Property"
            }
        ],
        booking: [
            {
                type: Schema.Types.ObjectId,
                ref: "Booking"
            }
        ],
        /* ================= VERIFICATION ================= */
        documents: [
            {
                type: {
                    type: String,
                    enum: [
                        "aadhaar",
                        "pan_card",
                        "voter_id",
                        "driving_license",
                        "passport",
                        "other"
                    ],
                    required: true
                },
                url: {
                    type: String,
                    required: true
                },
                publicId: {
                    type: String,
                    required: true
                },
                uploadedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],

        verification: {
            status: {
                type: String,
                enum: ["pending", "approved", "rejected"],
                default: "pending",
                index: true
            },
            verifiedBy: {
                type: Schema.Types.ObjectId,
                ref: "User" // admin
            },
            verifiedAt: {
                type: Date
            },
            rejectionReason: {
                type: String
            }
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        enquiries: [
            {
                type: Schema.Types.ObjectId,
                ref: "Enquiry"
            }
        ],
        favorites: [
            {
                type: Schema.Types.ObjectId,
                ref: "Property"
            }
        ],
        reports: [
            {
                type: Schema.Types.ObjectId,
                ref: "Report"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            role: this.role,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            role: this.role,
            email: this.email,
            username: this.username,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)