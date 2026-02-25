import { Router } from "express";
import { sendOtp, verifyOtp } from "../controllers/otp.controller";
import { sendLoginOtp } from "../controllers/captcha.controller";

const router = Router();

router.post("/", sendOtp);
router.post("/verify", verifyOtp);
router.post("/send-login-otp", sendLoginOtp);

export { router };
