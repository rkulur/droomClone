import type { BudgetBand, SellerBadgeType, SortOption } from "@/types/vehicle";

export const BUDGET_BANDS: BudgetBand[] = [
  { label: "Below 3 Lacs", min: 0, max: 300000 },
  { label: "3-5 Lacs", min: 300000, max: 500000 },
  { label: "5-6 Lacs", min: 500000, max: 600000 },
  { label: "6-10 Lacs", min: 600000, max: 1000000 },
  { label: "10-15 Lacs", min: 1000000, max: 1500000 },
  { label: "More than 15 Lacs", min: 1500000 },
];

export const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: "recent", label: "Most Recent" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "mileage", label: "Lowest Mileage" },
  { value: "distance", label: "Nearest First" },
];

export const BADGE_CONFIG: Record<
  SellerBadgeType,
  { label: string; color: string }
> = {
  verified: { label: "Verified Seller", color: "#00a651" },
  top_rated: { label: "Top Rated Seller", color: "#00a651" },
  buyer_surety: { label: "Buyer Surety", color: "#00a651" },
  certified: { label: "Certified", color: "#00a651" },
};

const titleCase = (value: string) =>
  value
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

const pluralize = (value: string) => {
  if (value.endsWith("y")) {
    return `${value.slice(0, -1)}ies`;
  }

  if (
    value.endsWith("s") ||
    value.endsWith("x") ||
    value.endsWith("z") ||
    value.endsWith("ch") ||
    value.endsWith("sh")
  ) {
    return `${value}es`;
  }

  return `${value}s`;
};

export const getCategoryDisplayLabel = (category: string) => {
  const normalized = category.toLowerCase().trim();
  const segments = normalized.split("-").filter(Boolean);

  if (segments.length === 0) {
    return "Vehicles";
  }

  const lastSegment = segments.at(-1) ?? "vehicle";
  const prefix = segments.slice(0, -1).map(titleCase).join(" ");

  return [prefix, titleCase(pluralize(lastSegment))].filter(Boolean).join(" ");
};

export const getUsefulLinks = (category: string) => {
  const label = getCategoryDisplayLabel(category);

  return [
    {
      label: `Budget ${label}`,
      href: `/vehicles/${category}?sort=price_asc`,
    },
    {
      label: `Recently Arrived ${label}`,
      href: `/vehicles/${category}?sort=recent`,
    },
    {
      label: `Offers on ${label}`,
      href: `/vehicles/${category}`,
    },
    {
      label: "Certified Listings",
      href: `/vehicles/${category}`,
    },
    {
      label: "Nearest to OBV",
      href: `/vehicles/${category}?sort=distance`,
    },
    {
      label: "Submit your Requirement",
      href: `/vehicles/${category}`,
    },
  ];
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);

export const normalizeSlug = (value?: string) =>
  value?.toLowerCase().trim() || "";
