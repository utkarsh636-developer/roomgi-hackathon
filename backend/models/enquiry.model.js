import mongoose, {Schema} from "mongoose";

const enquirySchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        property: {
            type: Schema.Types.ObjectId,
            ref: "Property"
        },
        message: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "contacted", "rejected"],
            default: "pending"
        },
        reply: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
)
export const Enquiry = mongoose.model("Enquiry", enquirySchema)