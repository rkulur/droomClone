import mongoose, { Schema } from "mongoose";

const promotionSchema = new Schema(
  {
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    plan: { type: String, enum: ["basic", "premium", "spotlight"] },
    pricing: {
      amount: { type: Number },
      currency: { type: String, default: "INR", trim: true },
      gst: { type: Number },
      total: { type: Number },
    },
    duration: { type: Number },
    startedAt: { type: Date },
    expiresAt: { type: Date },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled", "refunded"],
      default: "active",
    },
    payment: {
      orderId: { type: String, trim: true },
      paymentId: { type: String, trim: true },
      method: { type: String, trim: true },
      paidAt: { type: Date },
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
      },
    },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

promotionSchema.index({ seller: 1, status: 1 });
promotionSchema.index({ vehicle: 1 });
promotionSchema.index({ status: 1, expiresAt: 1 });

const Promotion =
  (mongoose.models["Promotion"] as mongoose.Model<any>) ||
  mongoose.model("Promotion", promotionSchema);

export default Promotion;
