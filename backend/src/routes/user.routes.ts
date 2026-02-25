import { Router } from "express";
import { getMyProfile, loginUser, registerUser } from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", requireAuth, getMyProfile);

export { router };
