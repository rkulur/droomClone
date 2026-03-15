import { randomUUID } from "crypto";
import { Request, Response } from "express";
import mongoose from "mongoose";
import Brand from "../models/Brand";
import Category from "../models/Category";
import VehicleModel from "../models/VehicleModel";
import Vehicle from "../models/Vehicle";

type ListingImageInput = {
  url?: string;
  thumbnailUrl?: string;
  isPrimary?: boolean;
  sortOrder?: number;
  storageKey?: string;
};

type FeatureSectionInput = {
  sectionTitle?: string;
  sortOrder?: number;
  fields?: Array<{
    label?: string;
    value?: string;
    icon?: string;
    isHighlighted?: boolean;
  }>;
};

type ListingPayload = {
  title?: string;
  description?: string;
  categoryId?: string;
  brandId?: string;
  modelId?: string;
  modelName?: string;
  variant?: string;
  year?: number;
  regNumber?: string;
  price?: number;
  currency?: string;
  isNegotiable?: boolean;
  emiAvailable?: boolean;
  emiStartingFrom?: number | null;
  emiTenure?: number | null;
  emiProvider?: string;
  isPriceDropped?: boolean;
  previousPrice?: number | null;
  fuelType?: "petrol" | "diesel" | "electric" | "cng" | "hybrid" | "lpg";
  transmission?: "manual" | "automatic" | "amt" | "cvt" | "dct";
  kmsDriven?: number;
  ownership?: "1st" | "2nd" | "3rd" | "4th+";
  color?: string;
  condition?: "excellent" | "good" | "fair" | "needs-repair";
  insuranceValid?: boolean;
  insuranceExpiry?: string | null;
  rtoState?: string;
  hypothecation?: boolean;
  locationAddress?: string;
  locationCity?: string;
  locationState?: string;
  locationPincode?: string;
  locationLng?: number | null;
  locationLat?: number | null;
  images?: ListingImageInput[];
  videoUrl?: string;
  video360Url?: string;
  inspectionReportUrl?: string;
  featureSections?: FeatureSectionInput[];
  searchableFeatures?: Record<string, unknown>;
  inspected?: boolean;
  inspectedBy?: string;
  inspectionScore?: number | null;
  inspectionDate?: string | null;
  rcVerified?: boolean;
  challanClear?: boolean;
  buyerSurety?: boolean;
  sellerType?: "individual" | "dealer";
  listingPlan?: "free" | "silver" | "gold" | "platinum";
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  status?: string;
};

const FUEL_TYPES = new Set(["petrol", "diesel", "electric", "cng", "hybrid", "lpg"]);
const TRANSMISSIONS = new Set(["manual", "automatic", "amt", "cvt", "dct"]);
const OWNERSHIP_TYPES = new Set(["1st", "2nd", "3rd", "4th+"]);
const CONDITIONS = new Set(["excellent", "good", "fair", "needs-repair"]);
const SELLER_TYPES = new Set(["individual", "dealer"]);
const LISTING_PLANS = new Set(["free", "silver", "gold", "platinum"]);
const LISTING_STATUSES = new Set([
  "draft",
  "pending_review",
  "active",
  "published",
  "rejected",
  "archived",
  "sold",
  "expired",
]);

const currentYear = new Date().getFullYear();

const isObjectId = (value?: string) =>
  Boolean(value && mongoose.Types.ObjectId.isValid(value));

const asTrimmedString = (value: unknown): string | undefined =>
  typeof value === "string" ? value.trim() : undefined;

const normalizeTags = (tags: unknown): string[] => {
  if (!Array.isArray(tags)) {
    return [];
  }

  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const tag of tags) {
    if (typeof tag !== "string") {
      continue;
    }

    const value = tag.trim().toLowerCase();
    if (!value || seen.has(value)) {
      continue;
    }
    seen.add(value);
    normalized.push(value);
  }

  return normalized;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const generateVehicleSlug = (title: string) =>
  `${slugify(title) || "vehicle"}-${randomUUID().slice(0, 8)}`;

const normalizeImages = (
  images: unknown,
): { images: ListingImageInput[]; error?: string } => {
  if (!Array.isArray(images)) {
    return { images: [], error: "At least one image is required" };
  }

  const normalized = images
    .filter((image): image is ListingImageInput => typeof image === "object" && image !== null)
    .map((image, index) => ({
      url: asTrimmedString(image.url) ?? "",
      thumbnailUrl: asTrimmedString(image.thumbnailUrl) ?? "",
      isPrimary: Boolean(image.isPrimary),
      sortOrder:
        typeof image.sortOrder === "number" && Number.isFinite(image.sortOrder)
          ? image.sortOrder
          : index,
      storageKey: asTrimmedString(image.storageKey),
    }))
    .filter((image) => image.url);

  if (!normalized.length) {
    return { images: [], error: "At least one image is required" };
  }

  normalized.sort((a, b) => a.sortOrder - b.sortOrder || a.url.localeCompare(b.url));

  const sortOrders = new Set<number>();
  const duplicateSortOrder = normalized.some((image) => {
    if (sortOrders.has(image.sortOrder)) {
      return true;
    }
    sortOrders.add(image.sortOrder);
    return false;
  });

  const reindexed = duplicateSortOrder
    ? normalized.map((image, index) => ({ ...image, sortOrder: index }))
    : normalized;

  const primaryIndex = reindexed.findIndex((image) => image.isPrimary);
  const withPrimary = reindexed.map((image, index) => ({
    ...image,
    isPrimary: primaryIndex === -1 ? index === 0 : index === primaryIndex,
  }));

  return { images: withPrimary };
};

const normalizeFeatureSections = (sections: unknown) => {
  if (!Array.isArray(sections)) {
    return [];
  }

  return sections
    .filter((section): section is FeatureSectionInput => typeof section === "object" && section !== null)
    .map((section, index) => ({
      sectionTitle: asTrimmedString(section.sectionTitle) ?? "",
      sortOrder:
        typeof section.sortOrder === "number" && Number.isFinite(section.sortOrder)
          ? section.sortOrder
          : index,
      fields: Array.isArray(section.fields)
        ? section.fields
            .filter((field) => typeof field === "object" && field !== null)
            .map((field) => ({
              label: asTrimmedString(field.label) ?? "",
              value: asTrimmedString(field.value) ?? "",
              icon: asTrimmedString(field.icon) ?? "",
              isHighlighted: Boolean(field.isHighlighted),
            }))
            .filter((field) => field.label && field.value)
        : [],
    }))
    .filter((section) => section.sectionTitle);
};

const serializeVehicle = (vehicle: any) => ({
  _id: String(vehicle._id),
  title: vehicle.title,
  description: vehicle.description ?? "",
  categoryId: vehicle.category ? String(vehicle.category) : "",
  categoryName: vehicle.categoryNameSnapshot ?? "",
  brandId: vehicle.brand ? String(vehicle.brand) : "",
  brandName: vehicle.brandNameSnapshot ?? "",
  modelId: vehicle.model ? String(vehicle.model) : "",
  modelName: vehicle.modelNameSnapshot ?? vehicle.modelName ?? "",
  variant: vehicle.variant ?? "",
  year: vehicle.year ?? null,
  regNumber: vehicle.regNumber ?? "",
  price: vehicle.price ?? null,
  currency: vehicle.currency ?? "INR",
  isNegotiable: Boolean(vehicle.isNegotiable),
  emiAvailable: Boolean(vehicle.emi?.available),
  emiStartingFrom: vehicle.emi?.startingFrom ?? null,
  emiTenure: vehicle.emi?.tenure ?? null,
  emiProvider: vehicle.emi?.provider ?? "",
  isPriceDropped: Boolean(vehicle.isPriceDropped),
  previousPrice: vehicle.previousPrice ?? null,
  fuelType: vehicle.fuelType ?? "",
  transmission: vehicle.transmission ?? "",
  kmsDriven: vehicle.kmsDriven ?? null,
  ownership: vehicle.ownership ?? "",
  color: vehicle.color ?? "",
  condition: vehicle.condition ?? "",
  insuranceValid: Boolean(vehicle.insuranceValid),
  insuranceExpiry: vehicle.insuranceExpiry ? new Date(vehicle.insuranceExpiry).toISOString() : null,
  rtoState: vehicle.rtoState ?? "",
  hypothecation: Boolean(vehicle.hypothecation),
  locationAddress: vehicle.location?.address ?? "",
  locationCity: vehicle.location?.city ?? "",
  locationState: vehicle.location?.state ?? "",
  locationPincode: vehicle.location?.pincode ?? "",
  locationLng:
    Array.isArray(vehicle.location?.geo?.coordinates) && vehicle.location.geo.coordinates.length === 2
      ? vehicle.location.geo.coordinates[0]
      : null,
  locationLat:
    Array.isArray(vehicle.location?.geo?.coordinates) && vehicle.location.geo.coordinates.length === 2
      ? vehicle.location.geo.coordinates[1]
      : null,
  images: Array.isArray(vehicle.images)
    ? [...vehicle.images]
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        .map((image) => ({
          url: image.url,
          thumbnailUrl: image.thumbnailUrl ?? "",
          isPrimary: Boolean(image.isPrimary),
          sortOrder: image.sortOrder ?? 0,
          storageKey: image.storageKey ?? "",
        }))
    : [],
  videoUrl: vehicle.videoUrl ?? "",
  video360Url: vehicle.video360Url ?? "",
  inspectionReportUrl: vehicle.inspectionReportUrl ?? "",
  featureSections: Array.isArray(vehicle.featureSections)
    ? [...vehicle.featureSections]
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        .map((section) => ({
          sectionTitle: section.sectionTitle,
          sortOrder: section.sortOrder ?? 0,
          fields: Array.isArray(section.fields)
            ? section.fields.map((field: any) => ({
                label: field.label,
                value: field.value,
                icon: field.icon ?? "",
                isHighlighted: Boolean(field.isHighlighted),
              }))
            : [],
        }))
    : [],
  searchableFeatures: vehicle.searchableFeatures ?? {},
  inspected: Boolean(vehicle.inspected),
  inspectedBy: vehicle.inspectedBy ?? "",
  inspectionScore: vehicle.inspectionScore ?? null,
  inspectionDate: vehicle.inspectionDate ? new Date(vehicle.inspectionDate).toISOString() : null,
  rcVerified: Boolean(vehicle.rcVerified),
  challanClear: Boolean(vehicle.challanClear),
  buyerSurety: Boolean(vehicle.buyerSurety),
  sellerType: vehicle.sellerType ?? "individual",
  listingPlan: vehicle.listingPlan ?? "free",
  tags: Array.isArray(vehicle.tags) ? vehicle.tags : [],
  metaTitle: vehicle.metaTitle ?? "",
  metaDescription: vehicle.metaDescription ?? "",
  status: vehicle.status,
  submittedByAdminId: vehicle.submittedByAdminId ? String(vehicle.submittedByAdminId) : null,
  createdAt: vehicle.createdAt ? new Date(vehicle.createdAt).toISOString() : null,
  updatedAt: vehicle.updatedAt ? new Date(vehicle.updatedAt).toISOString() : null,
});

const buildVehicleInput = async (
  payload: ListingPayload,
  existingVehicle?: any,
  authUser?: Request["authUser"],
) => {
  const errors: Record<string, string> = {};

  if (!isObjectId(payload.categoryId)) {
    errors.categoryId = "Valid categoryId is required";
  }
  if (!isObjectId(payload.brandId)) {
    errors.brandId = "Valid brandId is required";
  }
  if (!isObjectId(payload.modelId)) {
    errors.modelId = "Valid modelId is required";
  }

  const [category, brand, model] = await Promise.all([
    isObjectId(payload.categoryId) ? Category.findById(payload.categoryId).lean() : null,
    isObjectId(payload.brandId) ? Brand.findById(payload.brandId).lean() : null,
    isObjectId(payload.modelId) ? VehicleModel.findById(payload.modelId).lean() : null,
  ]);

  if (payload.categoryId && !category) {
    errors.categoryId = "Category not found";
  }
  if (payload.brandId && !brand) {
    errors.brandId = "Brand not found";
  }
  if (payload.modelId && !model) {
    errors.modelId = "Model not found";
  }

  if (
    category &&
    brand &&
    (!Array.isArray(brand.categories) ||
      !brand.categories.some(
        (categoryRef: mongoose.Types.ObjectId) => String(categoryRef) === String(category._id),
      ))
  ) {
    errors.brandId = "Brand does not belong to selected category";
  }

  if (brand && model && String(model.brand) !== String(brand._id)) {
    errors.modelId = "Model does not belong to selected brand";
  }

  if (category && model && String(model.category) !== String(category._id)) {
    errors.modelId = "Model does not belong to selected category";
  }

  const title = asTrimmedString(payload.title) ?? "";
  if (title.length < 10 || title.length > 100) {
    errors.title = "Title must be between 10 and 100 characters";
  }

  if (typeof payload.year !== "number" || payload.year < 1980 || payload.year > currentYear + 1) {
    errors.year = `Year must be between 1980 and ${currentYear + 1}`;
  }

  if (typeof payload.price !== "number" || payload.price < 1000) {
    errors.price = "Price must be at least 1000";
  }

  if (!payload.fuelType || !FUEL_TYPES.has(payload.fuelType)) {
    errors.fuelType = "Invalid fuelType";
  }

  if (!payload.transmission || !TRANSMISSIONS.has(payload.transmission)) {
    errors.transmission = "Invalid transmission";
  }

  if (typeof payload.kmsDriven !== "number" || payload.kmsDriven < 0) {
    errors.kmsDriven = "kmsDriven must be 0 or greater";
  }

  if (!payload.ownership || !OWNERSHIP_TYPES.has(payload.ownership)) {
    errors.ownership = "Invalid ownership";
  }

  if (!payload.condition || !CONDITIONS.has(payload.condition)) {
    errors.condition = "Invalid condition";
  }

  if (!asTrimmedString(payload.color)) {
    errors.color = "Color is required";
  }

  if (!asTrimmedString(payload.rtoState)) {
    errors.rtoState = "rtoState is required";
  }

  if (!asTrimmedString(payload.locationCity)) {
    errors.locationCity = "locationCity is required";
  }

  if (!asTrimmedString(payload.locationState)) {
    errors.locationState = "locationState is required";
  }

  if (!/^\d{6}$/.test(asTrimmedString(payload.locationPincode) ?? "")) {
    errors.locationPincode = "locationPincode must be exactly 6 digits";
  }

  const tags = normalizeTags(payload.tags);
  if (tags.length > 15) {
    errors.tags = "A maximum of 15 tags is allowed";
  }

  const normalizedImages = normalizeImages(payload.images);
  if (normalizedImages.error) {
    errors.images = normalizedImages.error;
  }

  if (
    payload.variant &&
    model &&
    Array.isArray(model.variants) &&
    model.variants.length > 0 &&
    !model.variants.some(
      (variant: any) => variant.name.toLowerCase() === payload.variant?.trim().toLowerCase(),
    )
  ) {
    errors.variant = "Variant does not exist for the selected model";
  }

  const inspected = Boolean(payload.inspected);
  const insuranceValid = Boolean(payload.insuranceValid);
  const emiAvailable = Boolean(payload.emiAvailable);

  if (
    payload.inspectionScore !== undefined &&
    payload.inspectionScore !== null &&
    (payload.inspectionScore < 0 || payload.inspectionScore > 100)
  ) {
    errors.inspectionScore = "inspectionScore must be between 0 and 100";
  }

  if (payload.sellerType && !SELLER_TYPES.has(payload.sellerType)) {
    errors.sellerType = "Invalid sellerType";
  }

  if (payload.listingPlan && !LISTING_PLANS.has(payload.listingPlan)) {
    errors.listingPlan = "Invalid listingPlan";
  }

  if (payload.status && !LISTING_STATUSES.has(payload.status)) {
    errors.status = "Invalid status";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const featureSections = normalizeFeatureSections(payload.featureSections);
  const locationCoordinates =
    typeof payload.locationLng === "number" &&
    Number.isFinite(payload.locationLng) &&
    typeof payload.locationLat === "number" &&
    Number.isFinite(payload.locationLat)
      ? [payload.locationLng, payload.locationLat]
      : undefined;

  return {
    vehicleInput: {
      title,
      description: asTrimmedString(payload.description),
      slug: existingVehicle?.slug ?? generateVehicleSlug(title),
      category: category!._id,
      categoryNameSnapshot: category!.name,
      brand: brand!._id,
      brandNameSnapshot: brand!.name,
      model: model!._id,
      modelName: asTrimmedString(payload.modelName) ?? model!.name,
      modelNameSnapshot: model!.name,
      variant: asTrimmedString(payload.variant),
      year: payload.year,
      regNumber: asTrimmedString(payload.regNumber)?.toUpperCase(),
      price: payload.price,
      currency: asTrimmedString(payload.currency) ?? "INR",
      isNegotiable: Boolean(payload.isNegotiable),
      emi: {
        available: emiAvailable,
        startingFrom: emiAvailable ? payload.emiStartingFrom ?? null : null,
        tenure: emiAvailable ? payload.emiTenure ?? null : null,
        provider: emiAvailable ? asTrimmedString(payload.emiProvider) ?? "" : "",
      },
      isPriceDropped: Boolean(payload.isPriceDropped),
      previousPrice: payload.isPriceDropped ? payload.previousPrice ?? null : null,
      fuelType: payload.fuelType,
      transmission: payload.transmission,
      kmsDriven: payload.kmsDriven,
      ownership: payload.ownership,
      color: asTrimmedString(payload.color),
      condition: payload.condition,
      insuranceValid,
      insuranceExpiry: insuranceValid && payload.insuranceExpiry ? new Date(payload.insuranceExpiry) : null,
      rtoState: asTrimmedString(payload.rtoState),
      hypothecation: Boolean(payload.hypothecation),
      location: {
        address: asTrimmedString(payload.locationAddress),
        city: asTrimmedString(payload.locationCity),
        state: asTrimmedString(payload.locationState),
        pincode: asTrimmedString(payload.locationPincode),
        geo: locationCoordinates
          ? {
              type: "Point" as const,
              coordinates: locationCoordinates,
            }
          : undefined,
      },
      images: normalizedImages.images,
      videoUrl: asTrimmedString(payload.videoUrl),
      video360Url: asTrimmedString(payload.video360Url),
      inspectionReportUrl: asTrimmedString(payload.inspectionReportUrl),
      featureSections,
      searchableFeatures:
        payload.searchableFeatures && typeof payload.searchableFeatures === "object"
          ? payload.searchableFeatures
          : {},
      inspected,
      inspectedBy: inspected ? asTrimmedString(payload.inspectedBy) : undefined,
      inspectionScore: inspected ? payload.inspectionScore ?? null : null,
      inspectionDate:
        inspected && payload.inspectionDate ? new Date(payload.inspectionDate) : null,
      rcVerified: Boolean(payload.rcVerified),
      challanClear: Boolean(payload.challanClear),
      buyerSurety: Boolean(payload.buyerSurety),
      sellerType: payload.sellerType ?? existingVehicle?.sellerType ?? "individual",
      listingPlan: payload.listingPlan ?? existingVehicle?.listingPlan ?? "free",
      tags,
      metaTitle: asTrimmedString(payload.metaTitle),
      metaDescription: asTrimmedString(payload.metaDescription),
      status: payload.status ?? existingVehicle?.status ?? "pending_review",
      submittedByAdminId: authUser?.role === "admin" ? authUser.sub : existingVehicle?.submittedByAdminId,
    },
  };
};

export const createAdminVehicle = async (req: Request, res: Response) => {
  const payload = req.body as ListingPayload;
  const result = await buildVehicleInput(payload, undefined, req.authUser);

  if ("errors" in result) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.errors,
    });
  }

  const vehicle = await Vehicle.create(result.vehicleInput);

  return res.status(201).json({
    data: {
      _id: String(vehicle._id),
      status: vehicle.status,
      title: vehicle.title,
    },
    message: "Vehicle listing created successfully",
  });
};

export const getAdminVehicle = async (req: Request, res: Response) => {
  const vehicle = await Vehicle.findById(req.params.id).lean();

  if (!vehicle) {
    return res.status(404).json({ message: "Vehicle listing not found" });
  }

  return res.status(200).json({ data: serializeVehicle(vehicle) });
};

export const updateAdminVehicle = async (req: Request, res: Response) => {
  const existingVehicle = await Vehicle.findById(req.params.id);

  if (!existingVehicle) {
    return res.status(404).json({ message: "Vehicle listing not found" });
  }

  const mergedPayload: ListingPayload = {
    title: req.body.title ?? existingVehicle.title,
    description: req.body.description ?? existingVehicle.description,
    categoryId: req.body.categoryId ?? String(existingVehicle.category),
    brandId: req.body.brandId ?? String(existingVehicle.brand),
    modelId: req.body.modelId ?? String(existingVehicle.model),
    modelName: req.body.modelName ?? existingVehicle.modelNameSnapshot ?? existingVehicle.modelName,
    variant: req.body.variant ?? existingVehicle.variant,
    year: req.body.year ?? existingVehicle.year,
    regNumber: req.body.regNumber ?? existingVehicle.regNumber,
    price: req.body.price ?? existingVehicle.price,
    currency: req.body.currency ?? existingVehicle.currency,
    isNegotiable: req.body.isNegotiable ?? existingVehicle.isNegotiable,
    emiAvailable: req.body.emiAvailable ?? existingVehicle.emi?.available,
    emiStartingFrom: req.body.emiStartingFrom ?? existingVehicle.emi?.startingFrom,
    emiTenure: req.body.emiTenure ?? existingVehicle.emi?.tenure,
    emiProvider: req.body.emiProvider ?? existingVehicle.emi?.provider,
    isPriceDropped: req.body.isPriceDropped ?? existingVehicle.isPriceDropped,
    previousPrice: req.body.previousPrice ?? existingVehicle.previousPrice,
    fuelType: req.body.fuelType ?? existingVehicle.fuelType,
    transmission: req.body.transmission ?? existingVehicle.transmission,
    kmsDriven: req.body.kmsDriven ?? existingVehicle.kmsDriven,
    ownership: req.body.ownership ?? existingVehicle.ownership,
    color: req.body.color ?? existingVehicle.color,
    condition: req.body.condition ?? existingVehicle.condition,
    insuranceValid: req.body.insuranceValid ?? existingVehicle.insuranceValid,
    insuranceExpiry:
      req.body.insuranceExpiry ??
      (existingVehicle.insuranceExpiry ? existingVehicle.insuranceExpiry.toISOString() : null),
    rtoState: req.body.rtoState ?? existingVehicle.rtoState,
    hypothecation: req.body.hypothecation ?? existingVehicle.hypothecation,
    locationAddress: req.body.locationAddress ?? existingVehicle.location?.address,
    locationCity: req.body.locationCity ?? existingVehicle.location?.city,
    locationState: req.body.locationState ?? existingVehicle.location?.state,
    locationPincode: req.body.locationPincode ?? existingVehicle.location?.pincode,
    locationLng:
      req.body.locationLng ??
      (existingVehicle.location?.geo?.coordinates?.length === 2
        ? existingVehicle.location.geo.coordinates[0]
        : null),
    locationLat:
      req.body.locationLat ??
      (existingVehicle.location?.geo?.coordinates?.length === 2
        ? existingVehicle.location.geo.coordinates[1]
        : null),
    images: req.body.images ?? existingVehicle.images,
    videoUrl: req.body.videoUrl ?? existingVehicle.videoUrl,
    video360Url: req.body.video360Url ?? existingVehicle.video360Url,
    inspectionReportUrl: req.body.inspectionReportUrl ?? existingVehicle.inspectionReportUrl,
    featureSections: req.body.featureSections ?? existingVehicle.featureSections,
    searchableFeatures: req.body.searchableFeatures ?? existingVehicle.searchableFeatures,
    inspected: req.body.inspected ?? existingVehicle.inspected,
    inspectedBy: req.body.inspectedBy ?? existingVehicle.inspectedBy,
    inspectionScore: req.body.inspectionScore ?? existingVehicle.inspectionScore,
    inspectionDate:
      req.body.inspectionDate ??
      (existingVehicle.inspectionDate ? existingVehicle.inspectionDate.toISOString() : null),
    rcVerified: req.body.rcVerified ?? existingVehicle.rcVerified,
    challanClear: req.body.challanClear ?? existingVehicle.challanClear,
    buyerSurety: req.body.buyerSurety ?? existingVehicle.buyerSurety,
    sellerType: req.body.sellerType ?? existingVehicle.sellerType,
    listingPlan: req.body.listingPlan ?? existingVehicle.listingPlan,
    tags: req.body.tags ?? existingVehicle.tags,
    metaTitle: req.body.metaTitle ?? existingVehicle.metaTitle,
    metaDescription: req.body.metaDescription ?? existingVehicle.metaDescription,
    status: req.body.status ?? existingVehicle.status,
  };

  const result = await buildVehicleInput(mergedPayload, existingVehicle, req.authUser);

  if ("errors" in result) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.errors,
    });
  }

  existingVehicle.set(result.vehicleInput);
  await existingVehicle.save();

  return res.status(200).json({
    data: serializeVehicle(existingVehicle.toObject()),
    message: "Vehicle listing updated successfully",
  });
};
