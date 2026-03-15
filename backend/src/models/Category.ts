import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    iconUrl: { type: String, trim: true },
    bannerUrl: { type: String, trim: true },
    description: { type: String },
    parentCategory: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    totalListings: { type: Number, default: 0 },
    totalSold: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

categorySchema.index({ isActive: 1, sortOrder: 1 });
categorySchema.index({ parentCategory: 1 });

const Category =
  (mongoose.models["Category"] as mongoose.Model<any>) ||
  mongoose.model("Category", categorySchema);

export default Category;
