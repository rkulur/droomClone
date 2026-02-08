import express from "express";
import { captchaRouter, userRouter } from "./routes";

const app = express();

app.use(express.json());

app.use("/user", userRouter);
app.use("/captcha", captchaRouter);

export { app };
