import { Router } from "express";
import { getOtp, verifyOtp } from "../controllers/otp.controller";

const router = Router();

router.post("/", getOtp);
router.post("/verify", verifyOtp)

export { router };
