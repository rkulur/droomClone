// Project router: <Routes> JSX in src/App.tsx
// Admin route: <Route path="/admin" element={canAccessAdmin ? <AdminPage /> : <Navigate to="/" replace />} />
// Admin component: src/components/admin/index.tsx

import { Check } from "lucide-react";

const steps = [
  "Identity",
  "Pricing & Specs",
  "Location",
  "Photos & Media",
  "Features & Submit",
];

type StepIndicatorProps = {
  currentStep: number;
};

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-start">
      {steps.map((label, index) => {
        const stepIndex = index + 1;
        const isComplete = stepIndex < currentStep;
        const isCurrent = stepIndex === currentStep;

        return (
          <div key={label} className="flex items-start flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                  isComplete
                    ? "bg-primary text-primary-foreground border-primary"
                    : isCurrent
                      ? "bg-background text-primary border-primary"
                      : "bg-background text-muted-foreground border-muted-foreground/30"
                }`}
              >
                {isComplete ? <Check size={14} /> : stepIndex}
              </div>
              <span
                className={`text-xs mt-1.5 text-center max-w-[60px] leading-tight ${
                  isCurrent ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <div
                className={`flex-1 h-px mt-4 ${
                  isComplete ? "bg-primary" : "bg-border"
                }`}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
