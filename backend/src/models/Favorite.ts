import mongoose, { Schema } from "mongoose";

const favoriteSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    notifyOnPriceDrop: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

favoriteSchema.index({ user: 1, vehicle: 1 }, { unique: true });
favoriteSchema.index({ vehicle: 1 });

const Favorite =
  (mongoose.models["Favorite"] as mongoose.Model<any>) ||
  mongoose.model("Favorite", favoriteSchema);

export default Favorite;
