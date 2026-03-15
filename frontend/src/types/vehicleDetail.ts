import type { SellerBadgeType, VehicleListing } from "@/types/vehicle"

export interface VehicleInfo {
  registrationYear: number
  make: string
  model: string
  trim?: string
  kmsDriven?: number
  numberOfOwners?: number
  transmission?: string
  fuelType?: string
  bodyType?: string
  registrationState?: string
  location?: string
}

export interface SpecField {
  label: string
  value: string
}

export interface SpecSection {
  key: string
  title: string
  fields: SpecField[]
  defaultOpen?: boolean
}

export interface FeatureItem {
  label: string
  available: boolean
}

export interface FeatureGroup {
  groupTitle: string
  features: FeatureItem[]
}

export interface ReviewBreakdownItem {
  stars: number
  count: number
}

export interface ReviewItem {
  id: string
  author: string
  rating: number
  comment: string
  date: string
}

export interface ReviewData {
  averageRating: number
  totalReviews: number
  breakdown: ReviewBreakdownItem[]
  reviews: ReviewItem[]
}

export interface VehicleDetail extends VehicleListing {
  trim?: string
  bodyType?: string
  numberOfOwners?: number
  registrationState?: string
  engineDisplacement?: number
  images: string[]
  imageCount: number
  description: string
  vehicleInfo: VehicleInfo
  optionsAndFeatures?: FeatureGroup[]
  technicalSpecs?: SpecSection[]
  ratingsAndReviews?: ReviewData
}

export interface RawVehicleMedia {
  url?: string
  thumbnailUrl?: string
  isPrimary?: boolean
  sortOrder?: number
}

export interface RawFeatureSectionField {
  label?: string
  value?: string | number | boolean | null
  icon?: string
  isHighlighted?: boolean
}

export interface RawFeatureSection {
  sectionTitle?: string
  sortOrder?: number
  fields?: RawFeatureSectionField[]
}

export interface RawVehicleDetailResponse {
  _id?: string
  id?: string
  title?: string
  price?: number
  images?: Array<string | RawVehicleMedia>
  imageCount?: number
  category?: string
  categoryName?: string
  categoryNameSnapshot?: string
  subcategory?: string
  brand?: string
  brandName?: string
  brandNameSnapshot?: string
  condition?: string
  description?: string
  fuelType?: string
  transmission?: string
  mileage?: number
  year?: number
  emiFrom?: number | null
  emiStartingFrom?: number | null
  sellerBadges?: SellerBadgeType[]
  postedAt?: string
  createdAt?: string
  location?: {
    city?: string
    state?: string
  }
  locationCity?: string
  locationState?: string
  model?: string
  modelName?: string
  modelNameSnapshot?: string
  variant?: string
  trim?: string
  kmsDriven?: number
  ownership?: string
  rtoState?: string
  searchableFeatures?: Record<string, unknown>
  featureSections?: RawFeatureSection[]
  technicalSpecs?: SpecSection[]
  optionsAndFeatures?: FeatureGroup[]
  ratingsAndReviews?: ReviewData
  vehicleInfo?: Partial<VehicleInfo>
  bodyType?: string
  engineDisplacement?: number
  inspectionScore?: number | null
}
