import mongoose, { Schema } from "mongoose";

const brandSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    logoUrl: { type: String, trim: true },
    coverImageUrl: { type: String, trim: true },
    description: { type: String },
    country: { type: String, trim: true },
    website: { type: String, trim: true },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    isActive: { type: Boolean, default: true },
    isPopular: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    totalListings: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

brandSchema.index({ categories: 1, isPopular: 1 });

const Brand =
  (mongoose.models["Brand"] as mongoose.Model<any>) ||
  mongoose.model("Brand", brandSchema);

export default Brand;
