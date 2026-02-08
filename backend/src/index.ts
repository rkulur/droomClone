import express from "express";
import { userRouter } from "./routes";
import dotenv from "dotenv";
import { connectDb } from "./config/db.config";

dotenv.config();

const app = express();
const PORT = 3000;

connectDb().catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
})

app.use(express.json());

app.use("/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
