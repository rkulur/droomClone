import { useMemo } from "react"
import useSWR from "swr"
import { ApiError, fetchJson } from "@/components/admin/vehicles/api/client"
import type {
  FeatureGroup,
  RawFeatureSection,
  RawVehicleMedia,
  RawVehicleDetailResponse,
  ReviewData,
  SpecSection,
  VehicleDetail,
  VehicleInfo,
} from "@/types/vehicleDetail"

const titleCase = (value: string) =>
  value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ")

const normalizeCondition = (value?: string): "used" | "new" => {
  const normalized = value?.toLowerCase().trim()
  return normalized === "new" ? "new" : "used"
}

const normalizeTransmission = (value?: string) =>
  value ? titleCase(value) : undefined

const normalizeFuelType = (value?: string) =>
  value ? titleCase(value) : undefined

const parseOwnershipCount = (ownership?: string) => {
  if (!ownership) {
    return undefined
  }

  const match = ownership.match(/\d+/)
  return match ? Number(match[0]) : undefined
}

const getImageUrl = (image: string | RawVehicleMedia) => {
  if (typeof image === "string") {
    return image
  }

  return image.url ?? image.thumbnailUrl ?? ""
}

const buildVehicleInfo = (vehicle: RawVehicleDetailResponse): VehicleInfo => {
  const info = vehicle.vehicleInfo ?? {}
  const registrationYear = info.registrationYear ?? vehicle.year ?? 0
  const make = info.make ?? vehicle.brand ?? vehicle.brandName ?? vehicle.brandNameSnapshot ?? ""
  const model = info.model ?? vehicle.model ?? vehicle.modelName ?? vehicle.modelNameSnapshot ?? ""
  const trim = info.trim ?? vehicle.trim ?? vehicle.variant
  const kmsDriven = info.kmsDriven ?? vehicle.kmsDriven ?? vehicle.mileage
  const numberOfOwners = info.numberOfOwners ?? parseOwnershipCount(vehicle.ownership)
  const transmission = info.transmission ?? normalizeTransmission(vehicle.transmission)
  const fuelType = info.fuelType ?? normalizeFuelType(vehicle.fuelType)
  const bodyType =
    info.bodyType ??
    (typeof vehicle.searchableFeatures?.body_type === "string"
      ? titleCase(vehicle.searchableFeatures.body_type)
      : vehicle.bodyType)
  const registrationState = info.registrationState ?? vehicle.rtoState
  const location =
    info.location ??
    vehicle.location?.city ??
    vehicle.locationCity ??
    undefined

  return {
    registrationYear,
    make,
    model,
    trim,
    kmsDriven,
    numberOfOwners,
    transmission,
    fuelType,
    bodyType,
    registrationState,
    location,
  }
}

const buildFeatureGroups = (
  groups?: FeatureGroup[],
  featureSections?: RawFeatureSection[],
): FeatureGroup[] | undefined => {
  if (groups?.length) {
    return groups
  }

  if (!featureSections?.length) {
    return undefined
  }

  return featureSections
    .filter((group) => group.sectionTitle && group.fields?.length)
    .map((group) => ({
      groupTitle: group.sectionTitle ?? "Features",
      features: (group.fields ?? [])
        .filter((field) => field.label)
        .map((field) => ({
          label: field.label ?? "",
          available:
            typeof field.value === "boolean"
              ? field.value
              : String(field.value ?? "").toLowerCase() !== "false" &&
                String(field.value ?? "").toLowerCase() !== "no" &&
                String(field.value ?? "").toLowerCase() !== "n/a" &&
                String(field.value ?? "").trim() !== "",
        })),
    }))
}

const buildRatings = (
  ratingsAndReviews?: ReviewData,
  inspectionScore?: number | null,
): ReviewData | undefined => {
  if (ratingsAndReviews) {
    return ratingsAndReviews
  }

  if (typeof inspectionScore !== "number") {
    return undefined
  }

  return {
    averageRating: Number((inspectionScore / 20).toFixed(1)),
    totalReviews: 0,
    breakdown: [],
    reviews: [],
  }
}

const buildTechnicalSpecs = (
  technicalSpecs?: SpecSection[],
  searchableFeatures?: Record<string, unknown>,
): SpecSection[] | undefined => {
  if (technicalSpecs?.length) {
    return technicalSpecs
  }

  if (!searchableFeatures || Object.keys(searchableFeatures).length === 0) {
    return undefined
  }

  return [
    {
      key: "specifications",
      title: "Specifications",
      fields: Object.entries(searchableFeatures).map(([key, value]) => ({
        label: titleCase(key),
        value:
          typeof value === "string"
            ? value
            : typeof value === "number"
              ? value.toString()
              : typeof value === "boolean"
                ? value
                  ? "Yes"
                  : "No"
                : "N/A",
      })),
    },
  ]
}

const normalizeVehicleDetail = (vehicle: RawVehicleDetailResponse): VehicleDetail => {
  const images = (vehicle.images ?? []).map((image) => getImageUrl(image)).filter(Boolean)
  const vehicleInfo = buildVehicleInfo(vehicle)
  const brand = vehicle.brand ?? vehicle.brandName ?? vehicle.brandNameSnapshot ?? vehicleInfo.make
  const model = vehicle.model ?? vehicle.modelName ?? vehicle.modelNameSnapshot ?? vehicleInfo.model

  return {
    id: vehicle.id ?? vehicle._id ?? "",
    title: vehicle.title ?? "Untitled Vehicle",
    price: Number(vehicle.price ?? 0),
    images,
    imageCount: vehicle.imageCount ?? images.length,
    location: {
      city: vehicle.location?.city ?? vehicle.locationCity ?? vehicleInfo.location ?? "",
      state: vehicle.location?.state ?? vehicle.locationState,
    },
    category: vehicle.category ?? vehicle.categoryNameSnapshot?.toLowerCase() ?? "",
    subcategory: vehicle.subcategory,
    brand,
    condition: normalizeCondition(vehicle.condition),
    fuelType: normalizeFuelType(vehicle.fuelType) ?? vehicleInfo.fuelType,
    transmission: normalizeTransmission(vehicle.transmission) ?? vehicleInfo.transmission,
    mileage: vehicle.kmsDriven ?? vehicle.mileage,
    year: vehicle.year,
    emiFrom: vehicle.emiFrom ?? vehicle.emiStartingFrom ?? null,
    sellerBadges: vehicle.sellerBadges,
    postedAt: vehicle.postedAt ?? vehicle.createdAt,
    trim: vehicle.trim ?? vehicle.variant ?? vehicleInfo.trim,
    bodyType: vehicle.bodyType ?? vehicleInfo.bodyType,
    numberOfOwners: vehicleInfo.numberOfOwners,
    registrationState: vehicleInfo.registrationState,
    engineDisplacement:
      vehicle.engineDisplacement ??
      (typeof vehicle.searchableFeatures?.engine_capacity_cc === "number"
        ? vehicle.searchableFeatures.engine_capacity_cc
        : undefined),
    description: vehicle.description ?? "",
    vehicleInfo: {
      ...vehicleInfo,
      model,
      make: brand,
    },
    optionsAndFeatures: buildFeatureGroups(vehicle.optionsAndFeatures, vehicle.featureSections),
    technicalSpecs: buildTechnicalSpecs(vehicle.technicalSpecs, vehicle.searchableFeatures),
    ratingsAndReviews: buildRatings(vehicle.ratingsAndReviews, vehicle.inspectionScore),
  }
}

const fetchVehicleDetail = async (url: string): Promise<VehicleDetail> => {
  const response = await fetchJson<RawVehicleDetailResponse>(url)
  return normalizeVehicleDetail(response)
}

export function useVehicleDetail(id: string): {
  vehicle: VehicleDetail | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
  notFound: boolean
} {
  const key = useMemo(() => (id ? `/api/vehicles/${id}` : null), [id])
  const { data, error, isLoading, mutate } = useSWR<VehicleDetail, Error>(key, fetchVehicleDetail)

  return {
    vehicle: data ?? null,
    isLoading,
    error: error ?? null,
    refetch: () => {
      void mutate()
    },
    notFound: error instanceof ApiError && error.status === 404,
  }
}
