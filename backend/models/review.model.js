import mongoose, {Schema} from "mongoose";

const reviewSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        property: {
            type: Schema.Types.ObjectId,
            ref: "Property"
        },
        rating: {
            type: Number,
            required: true
        },
        images: [
            {
                type: String
            }
        ],
        comment: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Review = mongoose.model("Review", reviewSchema)