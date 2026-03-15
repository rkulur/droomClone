// Project router: <Routes> JSX in src/App.tsx
// Admin route: <Route path="/admin" element={canAccessAdmin ? <AdminPage /> : <Navigate to="/" replace />} />
// Admin component: src/components/admin/index.tsx

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Switch } from "../../../ui/switch";
import { Separator } from "../../../ui/separator";
import StepIndicator from "../components/StepIndicator";
import StepNavigation from "../components/StepNavigation";
import Step1_Identity from "../components/steps/Step1_Identity";
import Step2_PricingSpecs from "../components/steps/Step2_PricingSpecs";
import Step3_Location from "../components/steps/Step3_Location";
import Step4_Media from "../components/steps/Step4_Media";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
} from "./listingSchema";
import { useListingStore } from "../../../../stores/useListingStore";
import Step5_Features from "../components/steps/Step5_Features";
import {
  createVehicleListing,
  getErrorMessage,
  type CreateVehiclePayload,
} from "../api/client";
import {
  buildTestingListingDraft,
  TEMP_PREFILL_ENABLED,
} from "./testingPrefill";
import type { ListingDraft } from "../../../../stores/useListingStore";

type StepSchema =
  | typeof step1Schema
  | typeof step2Schema
  | typeof step3Schema
  | typeof step4Schema
  | typeof step5Schema;

const AddVehiclePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTestingPrefillEnabled, setIsTestingPrefillEnabled] = useState(false);
  const previousDraftRef = useRef<ListingDraft | null>(null);
  const currentStep = useListingStore((state) => state.currentStep);
  const setStep = useListingStore((state) => state.setStep);
  const resetDraft = useListingStore((state) => state.resetDraft);
  const replaceDraft = useListingStore((state) => state.replaceDraft);

  const activeSchema = useMemo<StepSchema>(() => {
    if (currentStep === 1) {
      return step1Schema;
    }

    if (currentStep === 2) {
      return step2Schema;
    }

    if (currentStep === 3) {
      return step3Schema;
    }

    if (currentStep === 4) {
      return step4Schema;
    }

    return step5Schema;
  }, [currentStep]);

  const handleBack = () => {
    if (isSubmitting) {
      return;
    }
    setStep(currentStep - 1);
  };

  const handleContinue = () => {
    if (currentStep < 5) {
      const validation = activeSchema.safeParse(useListingStore.getState());

      if (!validation.success) {
        window.dispatchEvent(new CustomEvent("listing-step-validate"));
        return;
      }

      setStep(currentStep + 1);
      return;
    }

    window.dispatchEvent(new CustomEvent("listing-publish"));
  };

  const handleTestingPrefillToggle = (checked: boolean) => {
    setIsTestingPrefillEnabled(checked);

    if (checked) {
      previousDraftRef.current = useListingStore.getState();
      replaceDraft(buildTestingListingDraft(currentStep));
      return;
    }

    if (previousDraftRef.current) {
      replaceDraft(previousDraftRef.current);
      previousDraftRef.current = null;
      return;
    }

    resetDraft();
  };

  useEffect(() => {
    const isFeatureValueEmpty = (value: unknown): boolean => {
      if (value === null || value === undefined || value === "") {
        return true;
      }

      if (Array.isArray(value)) {
        return value.length === 0;
      }

      if (typeof value === "object") {
        return Object.values(value as Record<string, unknown>).every((item) =>
          isFeatureValueEmpty(item),
        );
      }

      return false;
    };

    const formatFeatureValue = (value: unknown) => {
      if (typeof value === "boolean") {
        return value ? "Yes" : "No";
      }

      if (Array.isArray(value)) {
        return value.join(", ");
      }

      if (typeof value === "object" && value) {
        const rangeValue = value as { min?: number; max?: number };
        if (rangeValue.min !== undefined || rangeValue.max !== undefined) {
          return `${rangeValue.min ?? ""}${rangeValue.min !== undefined || rangeValue.max !== undefined ? " - " : ""}${rangeValue.max ?? ""}`.trim();
        }
      }

      return String(value);
    };

    const buildPayload = (): CreateVehiclePayload => {
      const draft = useListingStore.getState();
      const hasGeoCoordinates =
        typeof draft.locationLng === "number" &&
        Number.isFinite(draft.locationLng) &&
        typeof draft.locationLat === "number" &&
        Number.isFinite(draft.locationLat);
      const featureSections = draft.featureSections
        .map((section) => ({
          sectionTitle: section.sectionTitle,
          sortOrder: section.sortOrder,
          fields: section.fields
            .map((field) => {
              const rawValue =
                field.key && field.key in draft.searchableFeatures
                  ? draft.searchableFeatures[field.key]
                  : field.value;

              if (isFeatureValueEmpty(rawValue)) {
                return null;
              }

              return {
                label: field.label,
                value: formatFeatureValue(rawValue),
                icon: field.icon,
                isHighlighted: field.isHighlighted,
              };
            })
            .filter(
              (field): field is NonNullable<typeof field> => field !== null,
            ),
        }))
        .filter((section) => section.fields.length > 0);

      const searchableFeatures = Object.fromEntries(
        Object.entries(draft.searchableFeatures).filter(
          ([, value]) => !isFeatureValueEmpty(value),
        ),
      );

      return {
        title: draft.title,
        description: draft.description,
        categoryId: draft.categoryId,
        brandId: draft.brandId,
        modelId: draft.modelId,
        modelName: draft.modelName,
        variant: draft.variant,
        year: draft.year,
        regNumber: draft.regNumber,
        price: draft.price,
        currency: draft.currency,
        isNegotiable: draft.isNegotiable,
        emiAvailable: draft.emiAvailable,
        emiStartingFrom: draft.emiStartingFrom,
        emiTenure: draft.emiTenure,
        emiProvider: draft.emiProvider,
        isPriceDropped: draft.isPriceDropped,
        previousPrice: draft.previousPrice,
        fuelType: draft.fuelType,
        transmission: draft.transmission,
        kmsDriven: draft.kmsDriven,
        ownership: draft.ownership,
        color: draft.color,
        condition: draft.condition,
        insuranceValid: draft.insuranceValid,
        insuranceExpiry: draft.insuranceExpiry,
        rtoState: draft.rtoState,
        hypothecation: draft.hypothecation,
        locationAddress: draft.locationAddress,
        locationCity: draft.locationCity,
        locationState: draft.locationState,
        locationPincode: draft.locationPincode,
        // ...(hasGeoCoordinates
        //   ? {
        //       locationLng: draft.locationLng as number,
        //       locationLat: draft.locationLat as number,
        //     }
        //   : {}),
        locationLng: (draft.locationLng as number) || 0,
        locationLat: (draft.locationLat as number) || 0,
        images: draft.images.map((image) => ({
          url: image.url,
          thumbnailUrl: image.thumbnailUrl,
          isPrimary: image.isPrimary,
          sortOrder: image.sortOrder,
          storageKey: image.storageKey,
        })),
        videoUrl: draft.videoUrl,
        video360Url: draft.video360Url,
        inspectionReportUrl: draft.inspectionReportUrl,
        featureSections,
        searchableFeatures,
        inspected: draft.inspected,
        inspectedBy: draft.inspectedBy,
        inspectionScore: draft.inspectionScore,
        inspectionDate: draft.inspectionDate,
        rcVerified: draft.rcVerified,
        challanClear: draft.challanClear,
        buyerSurety: draft.buyerSurety,
        sellerType: draft.sellerType,
        listingPlan: draft.listingPlan,
        tags: draft.tags,
        metaTitle: draft.metaTitle,
        metaDescription: draft.metaDescription,
      };
    };

    const completePublish = (message: string) => {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        // resetDraft();
        toast.success(message);
        // navigate("/admin");
      }, 800);
    };

    const handlePublish = async () => {
      try {
        await createVehicleListing(buildPayload());
        completePublish("Vehicle listing published successfully");
      } catch (error) {
        toast.error(
          getErrorMessage(error, "Failed to publish vehicle listing"),
        );
        completePublish("Vehicle listing saved in mock mode");
      }
    };

    window.addEventListener("listing-publish", handlePublish);
    return () => {
      window.removeEventListener("listing-publish", handlePublish);
    };
  }, [navigate]);

  return (
    <div className="max-w-3xl mx-auto px-4 pt-8 pb-32">
      <h1 className="text-2xl font-bold text-foreground">List Your Vehicle</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Complete all steps to publish your listing.
      </p>
      {TEMP_PREFILL_ENABLED ? (
        <div className="mt-4 flex items-center justify-between rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3">
          <div>
            <p className="text-sm font-medium">Temporary testing prefill</p>
            <p className="text-xs text-muted-foreground">
              Toggle on to auto-fill the entire listing with mock data.
            </p>
          </div>
          <Switch
            checked={isTestingPrefillEnabled}
            onCheckedChange={handleTestingPrefillToggle}
            aria-label="Toggle temporary vehicle listing prefill"
          />
        </div>
      ) : null}
      <Separator className="my-6" />
      <StepIndicator currentStep={currentStep} />

      <div className="mt-8">
        {currentStep === 1 ? <Step1_Identity /> : null}
        {currentStep === 2 ? <Step2_PricingSpecs /> : null}
        {currentStep === 3 ? <Step3_Location /> : null}
        {currentStep === 4 ? <Step4_Media /> : null}
        {currentStep === 5 ? <Step5_Features /> : null}
      </div>

      <StepNavigation
        currentStep={currentStep}
        onBack={isSubmitting ? () => {} : handleBack}
        onContinue={handleContinue}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AddVehiclePage;
