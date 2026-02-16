import { Router } from "express";
import {
  captchaVerification,
  getCaptcha,
} from "../controllers/captcha.controller";

const router = Router();

router.get("/", getCaptcha);
router.post("/verify", captchaVerification);

export { router };
