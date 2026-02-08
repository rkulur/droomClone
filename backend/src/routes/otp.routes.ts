import { Router } from "express";
import { getOtp } from "../controllers/otp.controller";

const router = Router();

router.get("/", getOtp);

export { router };
