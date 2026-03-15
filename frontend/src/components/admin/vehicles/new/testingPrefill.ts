import type { ListingDraft } from "../../../../stores/useListingStore";

export const TEMP_PREFILL_ENABLED = false;

export const buildTestingListingDraft = (
  currentStep: number,
): ListingDraft => ({
  title: "2021 Maruti Suzuki Swift VXI - Single Owner, Well Maintained",
  description:
    "Single-owner Swift VXI in excellent condition with regular service history, cold AC, reverse camera, recent tyres, and no accidental damage. Ideal city car with clean paperwork and immediate transfer available.",
  categoryId: "car",
  brandId: "maruti-suzuki",
  modelId: "swift",
  modelName: "Swift",
  variant: "VXI",
  year: 2021,
  regNumber: "MH 02 AB 1234",

  price: 625000,
  currency: "INR",
  isNegotiable: true,
  emiAvailable: true,
  emiStartingFrom: 12499,
  emiTenure: 48,
  emiProvider: "HDFC Bank",
  isPriceDropped: true,
  previousPrice: 655000,

  fuelType: "petrol",
  transmission: "manual",
  kmsDriven: 34210,
  ownership: "1st",
  color: "Pearl White",
  condition: "excellent",
  insuranceValid: true,
  insuranceExpiry: "2026-11-30T00:00:00.000Z",
  rtoState: "MH",
  hypothecation: false,

  locationAddress: "Bandra Kurla Complex, near Jio World Drive",
  locationCity: "Mumbai",
  locationState: "Maharashtra",
  locationPincode: "400051",
  locationLng: 72.8686,
  locationLat: 19.0607,

  images: [
    {
      url: "/vite.svg",
      thumbnailUrl: "/vite.svg",
      isPrimary: true,
      sortOrder: 0,
      storageKey: "temporary-testing-image",
    },
  ],
  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  video360Url: "https://example.com/listings/swift-360",
  inspectionReportUrl: "https://example.com/listings/swift-report.pdf",

  featureSections: [],
  searchableFeatures: {
    bodyType: "Hatchback",
    seats: 5,
    airbags: 2,
    abs: true,
    bluetooth: true,
  },

  inspected: true,
  inspectedBy: "Droom QA Garage",
  inspectionScore: 91,
  inspectionDate: "2026-02-20T00:00:00.000Z",
  rcVerified: true,
  challanClear: true,
  buyerSurety: true,
  sellerType: "individual",
  listingPlan: "gold",
  tags: ["single-owner", "service-history", "insured", "well-maintained"],
  metaTitle: "2021 Maruti Suzuki Swift VXI used car for sale in Mumbai",
  metaDescription:
    "Well-maintained 2021 Maruti Suzuki Swift VXI available in Mumbai with service history, insurance, and clean documents.",

  currentStep,
});
