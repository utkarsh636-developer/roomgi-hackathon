import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema(
    {
        reporter: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        targetModel: {
            type: String,
            required: true,
            enum: ["Property", "User"]
        },
        targetUser: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        targetProperty: {
            type: Schema.Types.ObjectId,
            ref: "Property"
        },
        reason: {
            type: String, // Short reason e.g., "Spam", "Fake", "Harassment"
            required: true
        },
        message: {
            type: String, // Detailed explanation
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "resolved", "dismissed"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

export const Report = mongoose.model("Report", reportSchema);
