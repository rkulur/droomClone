import mongoose, { Schema } from "mongoose";

const vehicleModelSchema = new Schema(
  {
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    variants: [
      {
        name: { type: String, required: true, trim: true },
        launchYear: { type: Number },
        discontinuedYear: { type: Number, default: null },
      },
    ],
    generationYears: {
      from: { type: Number },
      to: { type: Number, default: null },
    },
    imageUrl: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

vehicleModelSchema.index({ brand: 1, category: 1 });
vehicleModelSchema.index({ slug: 1 }, { unique: true });

const VehicleModel =
  (mongoose.models["VehicleModel"] as mongoose.Model<any>) ||
  mongoose.model("VehicleModel", vehicleModelSchema);

export default VehicleModel;
