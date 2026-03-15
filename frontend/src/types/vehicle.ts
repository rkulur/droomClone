export type SortOption =
  | "recent"
  | "price_asc"
  | "price_desc"
  | "mileage"
  | "distance";

export type SellerBadgeType =
  | "verified"
  | "top_rated"
  | "buyer_surety"
  | "certified";

export interface VehicleListing {
  id: string;
  title: string;
  price: number;
  images: string[];
  imageCount?: number;
  videoCount?: number;
  location: {
    city: string;
    state?: string;
  };
  category: string;
  subcategory?: string;
  brand?: string;
  condition: "used" | "new";
  fuelType?: string;
  transmission?: string;
  mileage?: number;
  year?: number;
  emiFrom?: number | null;
  sellerBadges?: SellerBadgeType[];
  postedAt?: string;
}

export interface ListingFilters {
  condition?: "used" | "new";
  city?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

export interface BudgetBand {
  label: string;
  min: number;
  max?: number;
}

export interface ListingFilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface ListingApiResponse {
  data: VehicleListing[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters?: {
    availableSubcategories?: ListingFilterOption[];
    availableCities?: ListingFilterOption[];
    availableBrands?: ListingFilterOption[];
    priceRange?: {
      min: number;
      max: number;
    };
  };
}
