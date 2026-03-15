import mongoose, { Schema } from "mongoose";

const vehicleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    slug: { type: String, required: true, unique: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    categoryNameSnapshot: { type: String, trim: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    brandNameSnapshot: { type: String, trim: true },
    model: { type: Schema.Types.ObjectId, ref: "VehicleModel", required: true },
    modelName: { type: String, trim: true },
    modelNameSnapshot: { type: String, trim: true },
    variant: { type: String, trim: true },
    year: { type: Number, required: true },
    regNumber: { type: String, trim: true },

    price: { type: Number, required: true },
    currency: { type: String, default: "INR", trim: true },
    isNegotiable: { type: Boolean, default: false },
    emi: {
      available: { type: Boolean, default: false },
      startingFrom: { type: Number },
      tenure: { type: Number },
      provider: { type: String, trim: true },
    },
    isPriceDropped: { type: Boolean, default: false },
    previousPrice: { type: Number },

    fuelType: {
      type: String,
      enum: ["petrol", "diesel", "electric", "cng", "hybrid", "lpg"],
    },
    transmission: {
      type: String,
      enum: ["manual", "automatic", "amt", "cvt", "dct"],
    },
    kmsDriven: { type: Number },
    ownership: { type: String, enum: ["1st", "2nd", "3rd", "4th+"] },
    color: { type: String, trim: true },
    condition: {
      type: String,
      enum: ["excellent", "good", "fair", "needs-repair"],
    },
    insuranceValid: { type: Boolean },
    insuranceExpiry: { type: Date },
    rtoState: { type: String, trim: true },
    hypothecation: { type: Boolean },

    location: {
      address: { type: String, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      pincode: { type: String, trim: true },
      geo: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          validate: {
            validator: (coords: number[]) => coords.length === 2,
            message: "Geo coordinates must be [longitude, latitude]",
          },
        },
      },
    },

    seller: { type: Schema.Types.ObjectId, ref: "User" },
    sellerType: { type: String, enum: ["individual", "dealer"] },
    isVerifiedSeller: { type: Boolean, default: false },
    buyerSurety: { type: Boolean, default: false },
    submittedByAdminId: { type: Schema.Types.ObjectId, ref: "User" },

    images: [
      {
        url: { type: String, required: true, trim: true },
        thumbnailUrl: { type: String, trim: true },
        isPrimary: { type: Boolean, default: false },
        sortOrder: { type: Number, default: 0 },
        storageKey: { type: String, trim: true },
      },
    ],
    videoUrl: { type: String, trim: true },
    video360Url: { type: String, trim: true },
    inspectionReportUrl: { type: String, trim: true },

    featureSections: [
      {
        sectionTitle: { type: String, required: true, trim: true },
        sortOrder: { type: Number, default: 0 },
        fields: [
          {
            label: { type: String, required: true, trim: true },
            value: { type: String, required: true },
            icon: { type: String, trim: true },
            isHighlighted: { type: Boolean, default: false },
          },
        ],
      },
    ],
    searchableFeatures: { type: Schema.Types.Mixed, default: {} },

    inspected: { type: Boolean, default: false },
    inspectedBy: { type: String, trim: true },
    inspectionScore: { type: Number, min: 0, max: 100 },
    inspectionDate: { type: Date },
    rcVerified: { type: Boolean, default: false },
    challanClear: { type: Boolean, default: false },

    status: {
      type: String,
      enum: [
        "draft",
        "pending_review",
        "active",
        "published",
        "sold",
        "expired",
        "rejected",
        "archived",
      ],
      default: "draft",
    },
    rejectionReason: { type: String },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    expiresAt: { type: Date },
    soldAt: { type: Date },
    soldTo: { type: Schema.Types.ObjectId, ref: "User" },

    isFeatured: { type: Boolean, default: false },
    isBoosted: { type: Boolean, default: false },
    boostExpiresAt: { type: Date },
    boostTier: {
      type: String,
      enum: ["basic", "premium", "spotlight"],
      default: null,
    },
    listingPlan: {
      type: String,
      enum: ["free", "silver", "gold", "platinum"],
      default: "free",
    },

    stats: {
      views: { type: Number, default: 0 },
      uniqueViews: { type: Number, default: 0 },
      favorites: { type: Number, default: 0 },
      inquiries: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      phoneReveals: { type: Number, default: 0 },
    },

    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
  },
);

vehicleSchema.index({ "location.geo": "2dsphere" });
vehicleSchema.index({ status: 1, category: 1, createdAt: -1 });
vehicleSchema.index({ seller: 1, status: 1 });
vehicleSchema.index({ brand: 1, model: 1 });
vehicleSchema.index({ price: 1 });
vehicleSchema.index({ "searchableFeatures.fuelType": 1 });
vehicleSchema.index({ isFeatured: 1, isBoosted: 1, boostExpiresAt: 1 });
vehicleSchema.index({ status: 1, expiresAt: 1 });
vehicleSchema.index({ title: "text", description: "text", tags: "text" });

const Vehicle =
  (mongoose.models["Vehicle"] as mongoose.Model<any>) ||
  mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
