import { BUDGET_BANDS } from "@/constants/vehicleListing";
import { cn } from "@/lib/utils";
import type { BudgetBand } from "@/types/vehicle";

interface ShopByBudgetProps {
  activeBand?: BudgetBand;
  onChange: (band: BudgetBand | null) => void;
}

const ShopByBudget = ({ activeBand, onChange }: ShopByBudgetProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-[#f4f6f8] p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-white text-xl shadow-sm">
          <span aria-hidden="true">💰</span>
        </div>
        <h2 className="text-2xl font-medium text-gray-900">Shop By Budget</h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {BUDGET_BANDS.map((band) => {
          const isActive =
            activeBand?.min === band.min && activeBand?.max === band.max;

          return (
            <button
              key={band.label}
              type="button"
              onClick={() => onChange(isActive ? null : band)}
              className={cn(
                "rounded-md border px-4 py-2 text-sm transition-colors",
                isActive
                  ? "border-primary bg-primary text-white"
                  : "border-gray-300 bg-white text-gray-800 hover:border-primary/50",
              )}
            >
              {band.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ShopByBudget;
