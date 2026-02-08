import express from "express";
import { captchaRouter, otpRouter, userRouter } from "./routes";
const app = express();

app.use(express.json());

app.use("/user", userRouter);
app.use("/captcha", captchaRouter);
app.use("/otp", otpRouter);

export { app };
