// Project router: <Routes> JSX in src/App.tsx
// Admin route: <Route path="/admin" element={canAccessAdmin ? <AdminPage /> : <Navigate to="/" replace />} />
// Admin component: src/components/admin/index.tsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Separator } from "../../../ui/separator";
import StepIndicator from "../components/StepIndicator";
import StepNavigation from "../components/StepNavigation";
import Step1_Identity from "../components/steps/Step1_Identity";
import Step2_PricingSpecs from "../components/steps/Step2_PricingSpecs";
import Step3_Location from "../components/steps/Step3_Location";
import Step4_Media from "../components/steps/Step4_Media";
import Step5_Features from "../components/steps/Step5_Features";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
} from "./listingSchema";
import { useListingStore } from "../../../../stores/useListingStore";
import { submitListing } from "../../../../lib/listingApi";

type StepSchema = typeof step1Schema;

const AddVehiclePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentStep = useListingStore((state) => state.currentStep);
  const setStep = useListingStore((state) => state.setStep);
  const resetDraft = useListingStore((state) => state.resetDraft);

  const draftSnapshot = useListingStore((state) => state);

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
      const validation = activeSchema.safeParse(draftSnapshot);

      if (!validation.success) {
        window.dispatchEvent(new CustomEvent("listing-step-validate"));
        return;
      }

      setStep(currentStep + 1);
      return;
    }

    window.dispatchEvent(new CustomEvent("listing-publish"));
  };

  useEffect(() => {
    const handlePublish = async () => {
      setIsSubmitting(true);
      try {
        const payload = useListingStore.getState() as unknown as Record<string, unknown>;
        const { id } = await submitListing(payload);
        resetDraft();
        navigate(`/admin/vehicles/${id}`);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to submit listing";
        toast.error(message);
      } finally {
        setIsSubmitting(false);
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
