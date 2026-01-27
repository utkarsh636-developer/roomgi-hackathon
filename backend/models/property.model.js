import mongoose, { Schema } from "mongoose";
import { AMENITIES } from "../utils/constants.js";



import mongoose, { Schema } from "mongoose";

const propertySchema = new Schema(
  {
    /* ================= BASIC INFO ================= */

    type: {
      type: String,
      enum: ["flat", "PG", "hostel"],
      required: true,
      index: true
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    /* ================= LOCATION ================= */

    location: {
      addressLine: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true,
        index: true
      },
      state: {
        type: String,
        required: true
      },
      pincode: {
        type: String,
        required: true
      },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point"
        },
        coordinates: {
          type: [Number], // [lng, lat]
          required: true,
          index: "2dsphere"
        }
      }
    },

    /* ================= PRICING ================= */

    rent: {
      type: Number,
      required: true,
      index: true
    },

    securityDeposit: {
      type: Number,
      required: true
    },

    /* ================= FEATURES ================= */

    amenities: [
      {
        type: String,
        enum: AMENITIES,
        index: true
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

    preferences: {
      type: String
    },

    /* ================= REVIEWS ================= */

    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review"
      }
    ],

    ratingScore: {
      type: Number,
      default: 0,
      index: true
    },

    /* ================= VERIFICATION ================= */

    documents: [
      {
        type: {
          type: String,
          enum: [
            "ownership_proof",
            "rent_agreement",
            "electricity_bill",
            "water_bill",
            "property_tax_receipt",
            "government_id",
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

    /* ================= MODERATION ================= */

    isBlocked: {
      type: Boolean,
      default: false,
      index: true
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

