import mongoose, {Schema} from "mongoose";

const bookingSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        property: {
            type: Schema.Types.ObjectId,
            ref: "Property"
        },
        checkIn: {
            type: Date,
            required: true
        },
        checkOut: {
            type: Date,
            required: true
        },
        rent: {
            type: Number,
            required: true
        },
        securityDeposit: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
)

export const Booking = mongoose.model("Booking", bookingSchema)