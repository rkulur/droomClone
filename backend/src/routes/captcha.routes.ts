import { Router } from "express";
import { getCaptcha } from "../controllers/captcha.controller";

const router = Router();

router.get("/", getCaptcha);

export { router };
