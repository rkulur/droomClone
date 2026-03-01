import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String },
    role: {
      type: String,
      enum: ["buyer", "seller", "dealer", "admin"],
      default: "buyer",
    },
    sellerProfile: {
      businessName: { type: String, trim: true },
      gstNumber: { type: String, trim: true },
      panNumber: { type: String, trim: true },
      dealershipLicenseUrl: { type: String, trim: true },
      verificationStatus: {
        type: String,
        enum: ["unverified", "pending", "verified", "rejected"],
        default: "unverified",
      },
      verifiedAt: { type: Date },
      verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
      totalListings: { type: Number, default: 0 },
      totalSold: { type: Number, default: 0 },
      avgRating: { type: Number, default: 0 },
      reviewCount: { type: Number, default: 0 },
    },
    buyerSuretyEligible: { type: Boolean, default: false },
    kycStatus: {
      type: String,
      enum: ["none", "pending", "verified"],
      default: "none",
    },
    kycDocuments: [
      {
        type: {
          type: String,
          enum: ["aadhaar", "pan", "dl"],
          required: true,
        },
        url: { type: String, required: true, trim: true },
        verifiedAt: { type: Date },
      },
    ],
    profileImage: { type: String, trim: true },
    coverImage: { type: String, trim: true },
    bio: { type: String },
    savedSearches: [
      {
        name: { type: String, required: true, trim: true },
        filters: { type: Schema.Types.Mixed, default: {} },
        alertEnabled: { type: Boolean, default: false },
        lastNotifiedAt: { type: Date },
      },
    ],
    preferredCities: [{ type: String, trim: true }],
    preferredCategories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    isActive: { type: Boolean, default: true },
    isBanned: { type: Boolean, default: false },
    banReason: { type: String },
    lastLoginAt: { type: Date },
    loginHistory: [
      {
        ip: { type: String },
        userAgent: { type: String },
        at: { type: Date },
      },
    ],
    passwordResetToken: { type: String },
    passwordResetExpiry: { type: Date },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    phoneVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date },
    googleId: { type: String },
    facebookId: { type: String },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true });
userSchema.index({ role: 1, "sellerProfile.verificationStatus": 1 });

const User =
  (mongoose.models["User"] as mongoose.Model<any>) ||
  mongoose.model("User", userSchema);

export default User;
