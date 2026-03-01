import mongoose, { Schema } from "mongoose";

const vehicleViewSchema = new Schema({
  vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", default: null },
  sessionId: { type: String, trim: true },
  source: {
    type: String,
    enum: ["organic", "ad", "social", "referral", "direct"],
  },
  referrer: { type: String, trim: true },
  device: { type: String, enum: ["mobile", "tablet", "desktop"] },
  ipAddress: { type: String, trim: true },
  userAgent: { type: String },
  viewedAt: { type: Date, default: Date.now },
});

vehicleViewSchema.index({ vehicle: 1, viewedAt: -1 });
vehicleViewSchema.index({ viewedAt: 1 }, { expireAfterSeconds: 7776000 });

const VehicleView =
  (mongoose.models["VehicleView"] as mongoose.Model<any>) ||
  mongoose.model("VehicleView", vehicleViewSchema);

export default VehicleView;
