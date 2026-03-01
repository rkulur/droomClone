import mongoose, { Schema } from "mongoose";

const inquirySchema = new Schema(
  {
    vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    channel: {
      type: String,
      enum: ["message", "phone", "email", "whatsapp"],
    },
    message: { type: String },
    buyerPhone: { type: String, trim: true },
    status: {
      type: String,
      enum: ["new", "replied", "negotiating", "closed", "spam"],
      default: "new",
    },
    thread: [
      {
        from: { type: String, enum: ["buyer", "seller"], required: true },
        message: { type: String, required: true },
        sentAt: { type: Date, default: Date.now },
        isRead: { type: Boolean, default: false },
      },
    ],
    leadQuality: { type: String, enum: ["hot", "warm", "cold"] },
    outcome: { type: String, enum: ["sold", "dropped"], default: null },
  },
  {
    timestamps: true,
  },
);

inquirySchema.index({ vehicle: 1, buyer: 1 });
inquirySchema.index({ seller: 1, status: 1 });

const Inquiry =
  (mongoose.models["Inquiry"] as mongoose.Model<any>) ||
  mongoose.model("Inquiry", inquirySchema);

export default Inquiry;
