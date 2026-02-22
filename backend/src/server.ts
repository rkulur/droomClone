import dotenv from "dotenv";
import { app } from "./app";
import { connectDb } from "./config/db.config";
import { initOAuth2Client } from "./config/oAuth";

dotenv.config();

const PORT = 3000;

export const oAuth2Client = initOAuth2Client();

connectDb().catch((err) => {
  console.error("Failed to connect to the database:", err);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
