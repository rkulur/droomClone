import { Router } from "express";
import {
  createBrand,
  createCategory,
  createModel,
  getBrands,
  getCategories,
  getFeatureTemplates,
  getModelDetails,
  getModels,
} from "../controllers/catalog.controller";

const router = Router();

router.post("/admin/categories", createCategory);
router.post("/admin/brands", createBrand);
router.post("/admin/models", createModel);
router.get("/categories", getCategories);
router.get("/brands", getBrands);
router.get("/models", getModels);
router.get("/models/:modelId", getModelDetails);
router.get("/feature-templates", getFeatureTemplates);

export { router };
