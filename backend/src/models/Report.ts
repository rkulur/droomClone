import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema(
  {
    vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    reportedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reason: {
      type: String,
      enum: ["fake", "sold", "wrong_category", "price_fraud", "spam", "other"],
    },
    description: { type: String },
    evidence: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ["pending", "investigating", "resolved", "dismissed"],
      default: "pending",
    },
    resolvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    resolution: { type: String },
    resolvedAt: { type: Date },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

reportSchema.index({ vehicle: 1 });
reportSchema.index({ status: 1, createdAt: -1 });

const Report =
  (mongoose.models["Report"] as mongoose.Model<any>) ||
  mongoose.model("Report", reportSchema);

export default Report;
