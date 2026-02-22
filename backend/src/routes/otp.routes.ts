import { Router } from "express";
import { sendOtp, verifyOtp } from "../controllers/otp.controller";

const router = Router();

router.post("/", sendOtp);
router.post("/verify", verifyOtp);

export { router };
