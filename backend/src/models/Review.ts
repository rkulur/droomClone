import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["seller", "vehicle", "platform"],
      required: true,
    },
    vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", default: null },
    seller: { type: Schema.Types.ObjectId, ref: "User", default: null },
    reviewer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true },
    comment: { type: String },
    sellerRatings: {
      communication: { type: Number, min: 1, max: 5 },
      accuracy: { type: Number, min: 1, max: 5 },
      reliability: { type: Number, min: 1, max: 5 },
    },
    isVerifiedPurchase: { type: Boolean, default: false },
    helpfulVotes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

reviewSchema.index({ seller: 1, status: 1 });
reviewSchema.index({ vehicle: 1, status: 1 });
reviewSchema.index({ reviewer: 1 });

const Review =
  (mongoose.models["Review"] as mongoose.Model<any>) ||
  mongoose.model("Review", reviewSchema);

export default Review;
