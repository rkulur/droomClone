import { useMemo } from "react";
import useSWR from "swr";
import { fetchJson } from "@/components/admin/vehicles/api/client";
import type { ListingApiResponse, ListingFilters, VehicleListing } from "@/types/vehicle";

const normalizeListing = (listing: Partial<VehicleListing> & { _id?: string }): VehicleListing => ({
  id: listing.id ?? listing._id ?? "",
  title: listing.title ?? "Untitled Vehicle",
  price: Number(listing.price ?? 0),
  images: Array.isArray(listing.images) ? listing.images : [],
  imageCount: listing.imageCount,
  videoCount: listing.videoCount,
  location: {
    city: listing.location?.city ?? "",
    state: listing.location?.state,
  },
  category: listing.category ?? "",
  subcategory: listing.subcategory,
  brand: listing.brand,
  condition: listing.condition === "new" ? "new" : "used",
  fuelType: listing.fuelType,
  transmission: listing.transmission,
  mileage: listing.mileage,
  year: listing.year,
  emiFrom: listing.emiFrom ?? null,
  sellerBadges: listing.sellerBadges,
  postedAt: listing.postedAt,
});

const buildQueryString = (
  category: string,
  subcategory: string | undefined,
  filters: ListingFilters,
) => {
  const params = new URLSearchParams();

  params.set("category", category);

  if (subcategory) {
    params.set("subcategory", subcategory);
  }

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  if (!params.has("sort")) {
    params.set("sort", "recent");
  }

  if (!params.has("page")) {
    params.set("page", "1");
  }

  if (!params.has("limit")) {
    params.set("limit", "20");
  }

  return params.toString();
};

const fetchVehicleListings = async (url: string): Promise<ListingApiResponse> => {
  const response = await fetchJson<ListingApiResponse>(url);

  return {
    ...response,
    data: Array.isArray(response.data)
      ? response.data.map((listing) => normalizeListing(listing))
      : [],
  };
};

export function useVehicleListings(
  category: string,
  subcategory: string | undefined,
  filters: ListingFilters,
): {
  listings: VehicleListing[];
  pagination: ListingApiResponse["pagination"] | null;
  filterMetadata: ListingApiResponse["filters"] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const queryString = useMemo(
    () => buildQueryString(category, subcategory, filters),
    [category, subcategory, filters],
  );

  const shouldFetch = Boolean(category);
  const { data, error, isLoading, mutate } = useSWR<ListingApiResponse, Error>(
    shouldFetch ? `/api/vehicles?${queryString}` : null,
    fetchVehicleListings,
  );

  return {
    listings: data?.data ?? [],
    pagination: data?.pagination ?? null,
    filterMetadata: data?.filters ?? null,
    isLoading,
    error: error ?? null,
    refetch: () => {
      void mutate();
    },
  };
}
