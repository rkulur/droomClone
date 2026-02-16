import express from "express";
import { captchaRouter, otpRouter, userRouter } from "./routes";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/user", userRouter);
app.use("/captcha", captchaRouter);
app.use("/otp", otpRouter);

export { app };
