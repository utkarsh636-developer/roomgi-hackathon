import mongoose, { Schema } from "mongoose";
import { AMENITIES } from "../utils/constants.js";



const propertySchema = new Schema(
  {
    type: {
      type: String,
      enum: ["flat", "PG", "hostel"],
      required: true,
      index: true
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    location: {
      addressLine: { type: String, required: true },
      city: { type: String, required: true, index: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      coordinates: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true } // [lng, lat]
      }
    },

    rent: {
      type: Number,
      required: true,
      index: true
    },

    securityDeposit: {
      type: Number,
      required: true
    },

    amenities: [
      {
        type: String,
        enum: AMENITIES,
        required: true
      }
    ],

    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true }
      }
    ],

    capacity: {
      total: { type: Number, required: true },
      occupied: { type: Number, default: 0 }
    },

    description: {
      type: String,
      required: true
    },

    preferences: { type: String },

    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review"
      }
    ],

    isVerifiedByAdmin: {
      type: Boolean,
      default: false
    },

    isBlocked: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Add 2dsphere index for geospatial queries
propertySchema.index({ "location.coordinates": "2dsphere" });

export const Property = mongoose.model("Property", propertySchema);

