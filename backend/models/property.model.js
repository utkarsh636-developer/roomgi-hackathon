import mongoose, {Schema} from "mongoose";

const propertySchema = new Schema(
    {
        type: {
            type: String,
            enum: ["flat","PG","hostel"],
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
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
        amenities: [
            {
                type: String
            }
        ],
        images: [
            {
                type: String
            }
        ],
        occupancy: {
            type: Number,
            required: true
        },
        occupied: {
            type: Number,
            required: true
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review"
            }
        ],
        description: {
            type: String,
            required: true
        },
        isVerified_byUser: {
            type: Boolean,
            default: false
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        preferences: [
            {
                type: String
            }
        ],
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active"
        },
        
    },
    {
        timestamps: true
    }
)
    
export const Property = mongoose.model("Property", propertySchema)