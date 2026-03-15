import { Router } from "express";
import {
  createAdminVehicle,
  getAdminVehicle,
  updateAdminVehicle,
} from "../controllers/adminVehicle.controller";
import { uploadImages, uploadReport } from "../controllers/upload.controller";

const router = Router();

router.post("/admin/vehicles", createAdminVehicle);
router.get("/admin/vehicles/:id", getAdminVehicle);
router.patch("/admin/vehicles/:id", updateAdminVehicle);
router.post("/admin/uploads/images", uploadImages);
router.post("/admin/uploads/reports", uploadReport);

export { router };
