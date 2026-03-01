import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "price_drop",
        "new_match",
        "inquiry_reply",
        "listing_approved",
        "listing_rejected",
        "listing_expiring",
        "review_received",
        "promo",
      ],
    },
    title: { type: String, required: true, trim: true },
    body: { type: String },
    imageUrl: { type: String, trim: true },
    ctaUrl: { type: String, trim: true },
    channels: [
      {
        type: String,
        enum: ["in_app", "push", "email", "sms"],
      },
    ],
    sentVia: [{ type: String, trim: true }],
    deliveredAt: { type: Date },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    entityType: { type: String, enum: ["vehicle", "inquiry", "review"] },
    entityId: { type: Schema.Types.ObjectId },
    expiresAt: { type: Date },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Notification =
  (mongoose.models["Notification"] as mongoose.Model<any>) ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
