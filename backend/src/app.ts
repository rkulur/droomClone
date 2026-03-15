import express from "express";
import path from "path";
import {
  adminVehicleRouter,
  captchaRouter,
  catalogRouter,
  otpRouter,
  userRouter,
} from "./routes";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/uploads", express.static(path.join("/tmp", "droom-admin-uploads")));
app.use("/user", userRouter);
app.use("/captcha", captchaRouter);
app.use("/otp", otpRouter);
app.use("/api", catalogRouter);
app.use("/api", adminVehicleRouter);

export { app };
