import mongoose, { Schema } from "mongoose";

const pricingSnapshotSchema = new Schema(
  {
    vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    price: { type: Number, required: true },
    changedBy: { type: String, enum: ["seller", "admin", "system"] },
    reason: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

pricingSnapshotSchema.index({ vehicle: 1, createdAt: -1 });

const PricingSnapshot =
  (mongoose.models["PricingSnapshot"] as mongoose.Model<any>) ||
  mongoose.model("PricingSnapshot", pricingSnapshotSchema);

export default PricingSnapshot;
