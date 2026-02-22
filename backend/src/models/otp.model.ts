import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema(
  {
    email: { type: String, required: true },
    phoneNumber: { type: String },
    otpHash: { type: String, required: true },
    expiresIn: { type: Date, required: true },
  },
  {
    timestamps: true,
  },
);

otpSchema.index({ expiresIn: 1 }, { expireAfterSeconds: 0 });

export type OtpType = mongoose.InferSchemaType<typeof otpSchema>;
export const OtpModel = mongoose.model("Otp", otpSchema);
