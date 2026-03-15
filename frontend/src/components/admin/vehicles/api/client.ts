import axios, { type AxiosRequestConfig } from "axios";
import axiosInstance from "../../../../api/axios";
import { adminVehicleApi } from "./endpoints";

type ApiEnvelope<T> = {
  data?: T;
  message?: string;
  errors?: Record<string, string> | string[];
};

type ListingImagePayload = {
  url: string;
  thumbnailUrl: string;
  isPrimary: boolean;
  sortOrder: number;
  storageKey?: string;
};

type ListingFeaturePayload = {
  label: string;
  value: string;
  icon: string;
  isHighlighted: boolean;
};

type ListingFeatureSectionPayload = {
  sectionTitle: string;
  sortOrder: number;
  fields: ListingFeaturePayload[];
};

export type CreateVehiclePayload = {
  title: string;
  description: string;
  categoryId: string;
  brandId: string;
  modelId: string;
  modelName: string;
  variant: string;
  year: number | null;
  regNumber: string;
  price: number | null;
  currency: string;
  isNegotiable: boolean;
  emiAvailable: boolean;
  emiStartingFrom: number | null;
  emiTenure: number | null;
  emiProvider: string;
  isPriceDropped: boolean;
  previousPrice: number | null;
  fuelType: string;
  transmission: string;
  kmsDriven: number | null;
  ownership: string;
  color: string;
  condition: string;
  insuranceValid: boolean;
  insuranceExpiry: string | null;
  rtoState: string;
  hypothecation: boolean;
  locationAddress: string;
  locationCity: string;
  locationState: string;
  locationPincode: string;
  locationLng?: number;
  locationLat?: number;
  images: ListingImagePayload[];
  videoUrl: string;
  video360Url: string;
  inspectionReportUrl: string;
  featureSections: ListingFeatureSectionPayload[];
  searchableFeatures: Record<string, unknown>;
  inspected: boolean;
  inspectedBy: string;
  inspectionScore: number | null;
  inspectionDate: string | null;
  rcVerified: boolean;
  challanClear: boolean;
  buyerSurety: boolean;
  sellerType: "individual" | "dealer";
  listingPlan: "free" | "silver" | "gold" | "platinum";
  tags: string[];
  metaTitle: string;
  metaDescription: string;
};

export class ApiError extends Error {
  status: number;
  details: string[];

  constructor(message: string, status: number, details: string[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const normalizeErrors = (
  errors?: ApiEnvelope<unknown>["errors"],
): string[] => {
  if (!errors) {
    return [];
  }

  if (Array.isArray(errors)) {
    return errors.filter(Boolean);
  }

  return Object.values(errors).filter(Boolean);
};

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError) {
    return error.details.length > 0
      ? `${error.message}: ${error.details.join(", ")}`
      : error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export const fetchJson = async <T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> => {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;

  const headers =
    init?.headers instanceof Headers
      ? Object.fromEntries(init.headers.entries())
      : Array.isArray(init?.headers)
        ? Object.fromEntries(init.headers)
        : init?.headers;

  const config: AxiosRequestConfig = {
    url,
    method: init?.method,
    data: init?.body,
    headers,
    signal: init?.signal ?? undefined,
  };

  try {
    const response = await axiosInstance.request<ApiEnvelope<T> | T>(config);
    const body = response.data;

    if (
      body &&
      typeof body === "object" &&
      "data" in body
    ) {
      return (body.data ?? body) as T;
    }

    return body as T;
  } catch (error) {
    if (axios.isAxiosError<ApiEnvelope<unknown>>(error)) {
      throw new ApiError(
        error.response?.data?.message ?? error.message ?? "Request failed",
        error.response?.status ?? 0,
        normalizeErrors(error.response?.data?.errors),
      );
    }

    throw new ApiError(
      error instanceof Error ? error.message : "Request failed",
      0,
    );
  }
};

export const createVehicleListing = (payload: CreateVehiclePayload) =>
  fetchJson<{ _id: string; status: string; title: string }>(
    adminVehicleApi.vehicles,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

export const uploadListingImages = (
  files: File[],
) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  return fetchJson<
    Array<{ url: string; thumbnailUrl: string; storageKey: string }>
  >(adminVehicleApi.uploadImages, {
    method: "POST",
    body: formData,
  });
};

export const uploadInspectionReport = (file: File) => {
  const formData = new FormData();
  formData.append("files", file);

  return fetchJson<{ url: string; storageKey: string }>(
    adminVehicleApi.uploadReports,
    {
      method: "POST",
      body: formData,
    },
  );
};
