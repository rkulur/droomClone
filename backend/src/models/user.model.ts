import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: { type: String, unique: true, sparse: true, trim: true },
    role: {
      type: String,
      enum: ["user", "dealer", "admin"],
      default: "user",
    },
    avatarUrl: { type: String, trim: true },
    isEmailVerified: { type: Boolean, default: true },
    isPhoneVerified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },
    lastLoginAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

export type UserType = mongoose.InferSchemaType<typeof userSchema>;
export const UserModel = mongoose.model("User", userSchema);
