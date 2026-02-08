import dotenv from "dotenv";
import { connectDb } from "./config/db.config";
import { app } from "./app";


dotenv.config();

const PORT = 3000;

connectDb().catch((err) => {
  console.error("Failed to connect to the database:", err);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
