import mongoose from "mongoose";

export async function connectDb() {
  const uri = process.env.MONGODB_URL;
  if (!uri) {
    throw new Error("MONGODB_URL environment variable is not set");
  }
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
}
