// Project router: <Routes> JSX in src/App.tsx
// Admin route: <Route path="/admin" element={canAccessAdmin ? <AdminPage /> : <Navigate to="/" replace />} />
// Admin component: src/components/admin/index.tsx

import { Loader2 } from "lucide-react";
import { Button } from "../../../ui/button";

type StepNavigationProps = {
  currentStep: number;
  onBack: () => void;
  onContinue: () => void;
  isSubmitting?: boolean;
};

const StepNavigation = ({
  currentStep,
  onBack,
  onContinue,
  isSubmitting = false,
}: StepNavigationProps) => {
  const isLastStep = currentStep === 5;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <Button
          variant="outline"
          className={currentStep === 1 ? "invisible" : ""}
          onClick={onBack}
          disabled={isSubmitting}
          type="button"
        >
          {"\u2190 Back"}
        </Button>

        <span className="text-sm text-muted-foreground">Step {currentStep} of 5</span>

        <Button onClick={onContinue} disabled={isSubmitting} type="button">
          {isLastStep ? (
            isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publish Listing
              </>
            ) : (
              "Publish Listing"
            )
          ) : (
            "Continue \u2192"
          )}
        </Button>
      </div>
    </div>
  );
};

export default StepNavigation;
