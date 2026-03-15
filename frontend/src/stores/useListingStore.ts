// Project router: <Routes> JSX in src/App.tsx
// Admin route: <Route path="/admin" element={canAccessAdmin ? <AdminPage /> : <Navigate to="/" replace />} />
// Admin component: src/components/admin/index.tsx

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ListingImage {
  url: string;
  thumbnailUrl: string;
  isPrimary: boolean;
  sortOrder: number;
  storageKey?: string;
}

export interface ListingFeatureField {
  key?: string;
  label: string;
  value: string;
  icon: string;
  isHighlighted: boolean;
}

export interface ListingFeatureSection {
  sectionTitle: string;
  sortOrder: number;
  fields: ListingFeatureField[];
}

export interface ListingDraft {
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
  locationLng: number | null;
  locationLat: number | null;

  images: ListingImage[];
  videoUrl: string;
  video360Url: string;
  inspectionReportUrl: string;

  featureSections: ListingFeatureSection[];
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

  currentStep: number;
}

type ListingStore = ListingDraft & {
  setField: <K extends keyof ListingDraft>(key: K, value: ListingDraft[K]) => void;
  replaceDraft: (draft: ListingDraft) => void;
  addImage: (img: Omit<ListingImage, "sortOrder"> & { sortOrder?: number }) => void;
  removeImage: (index: number) => void;
  setPrimaryImage: (index: number) => void;
  reorderImages: (from: number, to: number) => void;
  setFeatureSections: (sections: ListingFeatureSection[]) => void;
  setSearchableFeature: (key: string, value: unknown) => void;
  setStep: (n: number) => void;
  resetDraft: () => void;
};

const initialDraft: ListingDraft = {
  title: "",
  description: "",
  categoryId: "",
  brandId: "",
  modelId: "",
  modelName: "",
  variant: "",
  year: null,
  regNumber: "",

  price: null,
  currency: "INR",
  isNegotiable: false,
  emiAvailable: false,
  emiStartingFrom: null,
  emiTenure: null,
  emiProvider: "",
  isPriceDropped: false,
  previousPrice: null,

  fuelType: "",
  transmission: "",
  kmsDriven: null,
  ownership: "",
  color: "",
  condition: "",
  insuranceValid: false,
  insuranceExpiry: null,
  rtoState: "",
  hypothecation: false,

  locationAddress: "",
  locationCity: "",
  locationState: "",
  locationPincode: "",
  locationLng: null,
  locationLat: null,

  images: [],
  videoUrl: "",
  video360Url: "",
  inspectionReportUrl: "",

  featureSections: [],
  searchableFeatures: {},

  inspected: false,
  inspectedBy: "",
  inspectionScore: null,
  inspectionDate: null,
  rcVerified: false,
  challanClear: false,
  buyerSurety: false,
  sellerType: "individual",
  listingPlan: "free",
  tags: [],
  metaTitle: "",
  metaDescription: "",

  currentStep: 1,
};

const withSortOrder = (images: ListingImage[]) =>
  images.map((image, index) => ({
    ...image,
    sortOrder: index,
  }));

export const useListingStore = create<ListingStore>()(
  persist(
    (set) => ({
      ...initialDraft,
      setField: (key, value) => set(() => ({ [key]: value }) as Pick<ListingDraft, typeof key>),
      replaceDraft: (draft) => set(() => ({ ...draft })),
      addImage: (img) =>
        set((state) => {
          if (state.images.length >= 20) {
            return state;
          }

          const nextImages = [
            ...state.images,
            {
              ...img,
              sortOrder: state.images.length,
              isPrimary: state.images.length === 0 ? true : img.isPrimary,
            },
          ];

          return {
            images: withSortOrder(nextImages),
          };
        }),
      removeImage: (index) =>
        set((state) => {
          const nextImages = state.images.filter((_, i) => i !== index);

          if (nextImages.length > 0 && !nextImages.some((img) => img.isPrimary)) {
            nextImages[0] = { ...nextImages[0], isPrimary: true };
          }

          return {
            images: withSortOrder(nextImages),
          };
        }),
      setPrimaryImage: (index) =>
        set((state) => ({
          images: state.images.map((img, i) => ({
            ...img,
            isPrimary: i === index,
          })),
        })),
      reorderImages: (from, to) =>
        set((state) => {
          if (
            from < 0 ||
            to < 0 ||
            from >= state.images.length ||
            to >= state.images.length ||
            from === to
          ) {
            return state;
          }

          const nextImages = [...state.images];
          [nextImages[from], nextImages[to]] = [nextImages[to], nextImages[from]];

          return {
            images: withSortOrder(nextImages),
          };
        }),
      setFeatureSections: (sections) => set(() => ({ featureSections: sections })),
      setSearchableFeature: (key, value) =>
        set((state) => ({
          searchableFeatures: {
            ...state.searchableFeatures,
            [key]: value,
          },
        })),
      setStep: (n) =>
        set(() => ({
          currentStep: Math.min(5, Math.max(1, n)),
        })),
      resetDraft: () => {
        localStorage.removeItem("listing-draft");
        set(() => ({ ...initialDraft }));
      },
    }),
    {
      name: "listing-draft",
    }
  )
);
