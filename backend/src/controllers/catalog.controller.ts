import { Request, Response } from "express";
import mongoose from "mongoose";
import Brand from "../models/Brand";
import Category from "../models/Category";
import FeatureTemplate from "../models/FeatureTemplate";
import VehicleModel from "../models/VehicleModel";

const parseBooleanQuery = (value: unknown): boolean | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
};

const asTrimmedString = (value: unknown): string | undefined =>
  typeof value === "string" ? value.trim() : undefined;

const isObjectId = (value: unknown): value is string =>
  typeof value === "string" && mongoose.Types.ObjectId.isValid(value);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const serializeCategory = (category: any) => ({
  _id: String(category._id),
  name: category.name,
  slug: category.slug,
  iconUrl: category.iconUrl ?? "",
  isActive: category.isActive,
  sortOrder: category.sortOrder ?? 0,
});

const serializeBrand = (brand: any) => ({
  _id: String(brand._id),
  name: brand.name,
  slug: brand.slug,
  logoUrl: brand.logoUrl ?? "",
  isActive: brand.isActive,
  sortOrder: brand.sortOrder ?? 0,
  categories: Array.isArray(brand.categories) ? brand.categories.map((id: any) => String(id)) : [],
});

const serializeModel = (model: any) => ({
  _id: String(model._id),
  name: model.name,
  slug: model.slug,
  brandId: model.brand ? String(model.brand) : "",
  categoryId: model.category ? String(model.category) : "",
  yearFrom: model.generationYears?.from ?? null,
  yearTo: model.generationYears?.to ?? null,
  isActive: model.isActive,
  variants: Array.isArray(model.variants)
    ? [...model.variants]
        .sort((a, b) => {
          const yearDelta =
            (a.launchYear ?? Number.MAX_SAFE_INTEGER) -
            (b.launchYear ?? Number.MAX_SAFE_INTEGER);
          if (yearDelta !== 0) {
            return yearDelta;
          }
          return a.name.localeCompare(b.name);
        })
        .map((variant) => ({
          name: variant.name,
          launchYear: variant.launchYear ?? null,
          discontinuedYear: variant.discontinuedYear ?? null,
        }))
    : [],
});

const normalizeVariants = (
  variants: unknown,
): { variants: Array<{ name: string; launchYear?: number; discontinuedYear?: number | null }>; error?: string } => {
  if (!Array.isArray(variants)) {
    return { variants: [] as Array<{ name: string; launchYear?: number; discontinuedYear?: number | null }> };
  }

  const seenNames = new Set<string>();
  const normalized: Array<{ name: string; launchYear?: number; discontinuedYear?: number | null }> = [];

  for (const variant of variants) {
    if (typeof variant !== "object" || variant === null) {
      continue;
    }

    const name = asTrimmedString((variant as { name?: string }).name);
    if (!name) {
      continue;
    }

    const key = name.toLowerCase();
    if (seenNames.has(key)) {
      return { error: "Variant names must be unique within a model", variants: [] };
    }

    seenNames.add(key);
    normalized.push({
      name,
      launchYear:
        typeof (variant as { launchYear?: unknown }).launchYear === "number"
          ? ((variant as { launchYear: number }).launchYear)
          : undefined,
      discontinuedYear:
        typeof (variant as { discontinuedYear?: unknown }).discontinuedYear === "number"
          ? ((variant as { discontinuedYear: number }).discontinuedYear)
          : null,
    });
  }

  normalized.sort((a, b) => {
    const yearDelta = (a.launchYear ?? Number.MAX_SAFE_INTEGER) - (b.launchYear ?? Number.MAX_SAFE_INTEGER);
    if (yearDelta !== 0) {
      return yearDelta;
    }
    return a.name.localeCompare(b.name);
  });

  return { variants: normalized };
};

export const createCategory = async (req: Request, res: Response) => {
  const name = asTrimmedString(req.body.name);
  const slug = asTrimmedString(req.body.slug) ?? (name ? slugify(name) : "");

  if (!name) {
    return res.status(400).json({
      message: "Validation failed",
      errors: { name: "name is required" },
    });
  }

  if (!slug) {
    return res.status(400).json({
      message: "Validation failed",
      errors: { slug: "slug could not be generated" },
    });
  }

  const existingCategory = await Category.findOne({
    $or: [{ slug }, { name: new RegExp(`^${escapeRegex(name)}$`, "i") }],
  })
    .select("_id")
    .lean();

  if (existingCategory) {
    return res.status(409).json({
      message: "Category already exists",
      errors: { slug: "A category with this name or slug already exists" },
    });
  }

  const category = await Category.create({
    name,
    slug,
    iconUrl: asTrimmedString(req.body.iconUrl),
    bannerUrl: asTrimmedString(req.body.bannerUrl),
    description: asTrimmedString(req.body.description),
    sortOrder: typeof req.body.sortOrder === "number" ? req.body.sortOrder : 0,
    isActive: typeof req.body.isActive === "boolean" ? req.body.isActive : true,
    metaTitle: asTrimmedString(req.body.metaTitle),
    metaDescription: asTrimmedString(req.body.metaDescription),
  });

  return res.status(201).json({
    data: serializeCategory(category),
    message: "Category created successfully",
  });
};

export const createBrand = async (req: Request, res: Response) => {
  const categoryId = req.body.categoryId;
  const name = asTrimmedString(req.body.name);
  const slug = asTrimmedString(req.body.slug) ?? (name ? slugify(name) : "");

  const errors: Record<string, string> = {};

  if (!isObjectId(categoryId)) {
    errors.categoryId = "Valid categoryId is required";
  }
  if (!name) {
    errors.name = "name is required";
  }
  if (!slug) {
    errors.slug = "slug could not be generated";
  }

  if (Object.keys(errors).length) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  const category = await Category.findById(categoryId).select("_id").lean();

  if (!category) {
    return res.status(404).json({
      message: "Category not found",
      errors: { categoryId: "Invalid categoryId" },
    });
  }

  const existingBrand = await Brand.findOne({
    $or: [{ slug }, { name: new RegExp(`^${escapeRegex(name!)}$`, "i") }],
  });

  if (existingBrand) {
    const alreadyLinked = existingBrand.categories.some(
      (existingCategoryId: mongoose.Types.ObjectId) =>
        String(existingCategoryId) === String(category._id),
    );

    if (alreadyLinked) {
      return res.status(409).json({
        message: "Brand already exists in this category",
        errors: { slug: "A brand with this name or slug already exists for the selected category" },
      });
    }

    existingBrand.categories.push(category._id as mongoose.Types.ObjectId);
    if (typeof req.body.isActive === "boolean") {
      existingBrand.isActive = req.body.isActive;
    }
    if (typeof req.body.sortOrder === "number") {
      existingBrand.sortOrder = req.body.sortOrder;
    }
    existingBrand.logoUrl = asTrimmedString(req.body.logoUrl) ?? existingBrand.logoUrl;
    existingBrand.coverImageUrl =
      asTrimmedString(req.body.coverImageUrl) ?? existingBrand.coverImageUrl;
    existingBrand.description = asTrimmedString(req.body.description) ?? existingBrand.description;
    existingBrand.country = asTrimmedString(req.body.country) ?? existingBrand.country;
    existingBrand.website = asTrimmedString(req.body.website) ?? existingBrand.website;
    if (typeof req.body.isPopular === "boolean") {
      existingBrand.isPopular = req.body.isPopular;
    }
    await existingBrand.save();

    return res.status(200).json({
      data: serializeBrand(existingBrand),
      message: "Brand linked to category successfully",
    });
  }

  const brand = await Brand.create({
    name,
    slug,
    logoUrl: asTrimmedString(req.body.logoUrl),
    coverImageUrl: asTrimmedString(req.body.coverImageUrl),
    description: asTrimmedString(req.body.description),
    country: asTrimmedString(req.body.country),
    website: asTrimmedString(req.body.website),
    categories: [category._id],
    isActive: typeof req.body.isActive === "boolean" ? req.body.isActive : true,
    isPopular: typeof req.body.isPopular === "boolean" ? req.body.isPopular : false,
    sortOrder: typeof req.body.sortOrder === "number" ? req.body.sortOrder : 0,
  });

  return res.status(201).json({
    data: serializeBrand(brand),
    message: "Brand created successfully",
  });
};

export const createModel = async (req: Request, res: Response) => {
  const categoryId = req.body.categoryId;
  const brandId = req.body.brandId;
  const name = asTrimmedString(req.body.name);
  const slug = asTrimmedString(req.body.slug) ?? (name ? slugify(name) : "");
  const errors: Record<string, string> = {};

  if (!isObjectId(categoryId)) {
    errors.categoryId = "Valid categoryId is required";
  }
  if (!isObjectId(brandId)) {
    errors.brandId = "Valid brandId is required";
  }
  if (!name) {
    errors.name = "name is required";
  }
  if (!slug) {
    errors.slug = "slug could not be generated";
  }

  const normalizedVariants = normalizeVariants(req.body.variants);
  if (normalizedVariants.error) {
    errors.variants = normalizedVariants.error;
  }

  if (Object.keys(errors).length) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  const [category, brand] = await Promise.all([
    Category.findById(categoryId).select("_id").lean(),
    Brand.findById(brandId).select("_id categories").lean(),
  ]);

  if (!category) {
    return res.status(404).json({
      message: "Category not found",
      errors: { categoryId: "Invalid categoryId" },
    });
  }

  if (!brand) {
    return res.status(404).json({
      message: "Brand not found",
      errors: { brandId: "Invalid brandId" },
    });
  }

  if (
    !Array.isArray(brand.categories) ||
    !brand.categories.some((brandCategoryId: mongoose.Types.ObjectId) => String(brandCategoryId) === String(category._id))
  ) {
    return res.status(400).json({
      message: "Validation failed",
      errors: { brandId: "Brand does not belong to selected category" },
    });
  }

  const duplicateModel = await VehicleModel.findOne({
    $or: [
      { slug },
      {
        brand: brand._id,
        category: category._id,
        name: new RegExp(`^${escapeRegex(name!)}$`, "i"),
      },
    ],
  })
    .select("_id")
    .lean();

  if (duplicateModel) {
    return res.status(409).json({
      message: "Model already exists",
      errors: { slug: "A model with this name or slug already exists for the selected brand" },
    });
  }

  const yearFrom = typeof req.body.yearFrom === "number" ? req.body.yearFrom : undefined;
  const yearTo =
    typeof req.body.yearTo === "number" ? req.body.yearTo : req.body.yearTo === null ? null : undefined;

  const model = await VehicleModel.create({
    brand: brand._id,
    category: category._id,
    name,
    slug,
    variants: normalizedVariants.variants,
    generationYears: {
      from: yearFrom,
      to: yearTo ?? null,
    },
    imageUrl: asTrimmedString(req.body.imageUrl),
    isActive: typeof req.body.isActive === "boolean" ? req.body.isActive : true,
  });

  return res.status(201).json({
    data: serializeModel(model),
    message: "Model created successfully",
  });
};

export const getCategories = async (req: Request, res: Response) => {
  const isActive = parseBooleanQuery(req.query.isActive);
  const filter = typeof isActive === "boolean" ? { isActive } : {};

  const categories = await Category.find(filter)
    .sort({ sortOrder: 1, name: 1 })
    .select("_id name slug iconUrl isActive sortOrder")
    .lean();

  return res.status(200).json({
    data: categories.map(serializeCategory),
  });
};

export const getBrands = async (req: Request, res: Response) => {
  const categoryId = req.query.category;

  if (typeof categoryId !== "string" || !categoryId.trim()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: { category: "category query param is required" },
    });
  }

  const category = await Category.findById(categoryId).select("_id").lean();

  if (!category) {
    return res.status(404).json({
      message: "Category not found",
      errors: { category: "Invalid category" },
    });
  }

  const isActive = parseBooleanQuery(req.query.isActive);
  const filter: Record<string, unknown> = { categories: category._id };

  if (typeof isActive === "boolean") {
    filter.isActive = isActive;
  }

  const brands = await Brand.find(filter)
    .sort({ sortOrder: 1, name: 1 })
    .select("_id name slug logoUrl isActive sortOrder")
    .lean();

  return res.status(200).json({
    data: brands.map(serializeBrand),
  });
};

export const getModels = async (req: Request, res: Response) => {
  const brandId = req.query.brand;

  if (typeof brandId !== "string" || !brandId.trim()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: { brand: "brand query param is required" },
    });
  }

  const brand = await Brand.findById(brandId).select("_id").lean();

  if (!brand) {
    return res.status(404).json({
      message: "Brand not found",
      errors: { brand: "Invalid brand" },
    });
  }

  const isActive = parseBooleanQuery(req.query.isActive);
  const filter: Record<string, unknown> = { brand: brand._id };

  if (typeof isActive === "boolean") {
    filter.isActive = isActive;
  }

  const models = await VehicleModel.find(filter)
    .sort({ name: 1, createdAt: 1 })
    .select("_id name slug generationYears isActive")
    .lean();

  return res.status(200).json({
    data: models.map((model) => ({
      _id: String(model._id),
      name: model.name,
      slug: model.slug,
      yearFrom: model.generationYears?.from ?? null,
      yearTo: model.generationYears?.to ?? null,
      isActive: model.isActive,
    })),
  });
};

export const getModelDetails = async (req: Request, res: Response) => {
  const { modelId } = req.params;

  const model = await VehicleModel.findById(modelId)
    .select("_id name slug generationYears variants isActive")
    .lean();

  if (!model) {
    return res.status(404).json({
      message: "Model not found",
    });
  }

  const variants = [...(model.variants ?? [])].sort((a, b) => {
    const yearDelta = (a.launchYear ?? Number.MAX_SAFE_INTEGER) - (b.launchYear ?? Number.MAX_SAFE_INTEGER);
    if (yearDelta !== 0) {
      return yearDelta;
    }
    return a.name.localeCompare(b.name);
  });

  return res.status(200).json({
    data: {
      _id: String(model._id),
      name: model.name,
      slug: model.slug,
      yearFrom: model.generationYears?.from ?? null,
      yearTo: model.generationYears?.to ?? null,
      isActive: model.isActive,
      variants: variants.map((variant) => ({
        name: variant.name,
        launchYear: variant.launchYear ?? null,
        discontinuedYear: variant.discontinuedYear ?? null,
      })),
    },
  });
};

export const getFeatureTemplates = async (req: Request, res: Response) => {
  const categoryId = req.query.category;

  if (typeof categoryId !== "string" || !categoryId.trim()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: { category: "category query param is required" },
    });
  }

  const category = await Category.findById(categoryId).select("_id").lean();

  if (!category) {
    return res.status(404).json({
      message: "Category not found",
      errors: { category: "Invalid category" },
    });
  }

  const template = await FeatureTemplate.findOne({
    category: category._id,
    isActive: true,
  })
    .select("sections")
    .lean();

  const sections = [...(template?.sections ?? [])]
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((section) => ({
      sectionTitle: section.sectionTitle,
      sortOrder: section.sortOrder ?? 0,
      fields: [...(section.fields ?? [])]
        .sort((a, b) => {
          const left = a.sortOrderInFilter ?? Number.MAX_SAFE_INTEGER;
          const right = b.sortOrderInFilter ?? Number.MAX_SAFE_INTEGER;
          if (left !== right) {
            return left - right;
          }
          return a.label.localeCompare(b.label);
        })
        .map((field) => ({
          key: field.key,
          label: field.label,
          type: field.type,
          unit: field.unit,
          options: field.options ?? [],
          isRequired: field.isRequired ?? false,
          isHighlighted: field.isHighlighted ?? false,
          helpText: field.helpText,
          validation: field.validation ?? {},
        })),
    }));

  return res.status(200).json({ data: sections });
};
