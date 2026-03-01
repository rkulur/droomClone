import mongoose, { Schema } from "mongoose";

const featureTemplateSchema = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      unique: true,
    },
    version: { type: Number, default: 1 },
    sections: [
      {
        sectionTitle: { type: String, required: true, trim: true },
        slug: { type: String, required: true, trim: true },
        sortOrder: { type: Number, default: 0 },
        fields: [
          {
            key: { type: String, required: true, trim: true },
            label: { type: String, required: true, trim: true },
            type: {
              type: String,
              enum: ["string", "number", "boolean", "select", "multiselect", "range"],
              required: true,
            },
            unit: { type: String, trim: true },
            options: [{ type: String, trim: true }],
            isRequired: { type: Boolean, default: false },
            isFilterable: { type: Boolean, default: false },
            isSearchable: { type: Boolean, default: false },
            isHighlighted: { type: Boolean, default: false },
            sortOrderInFilter: { type: Number },
            helpText: { type: String },
            icon: { type: String, trim: true },
            validation: {
              min: { type: Number },
              max: { type: Number },
              pattern: { type: String },
            },
          },
        ],
      },
    ],
    cardHighlights: {
      type: [{ type: String, trim: true }],
      validate: {
        validator: (values: string[]) => values.length <= 6,
        message: "cardHighlights can contain a maximum of 6 items",
      },
      default: [],
    },
    titleTemplate: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

featureTemplateSchema.index({ category: 1 }, { unique: true });

const FeatureTemplate =
  (mongoose.models["FeatureTemplate"] as mongoose.Model<any>) ||
  mongoose.model("FeatureTemplate", featureTemplateSchema);

export default FeatureTemplate;
