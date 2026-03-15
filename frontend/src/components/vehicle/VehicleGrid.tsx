import { useEffect, useState } from "react";
import { Link } from "react-router";
import { SearchX } from "lucide-react";
import ShopByBudget from "@/components/vehicle/ShopByBudget";
import VehicleCard from "@/components/vehicle/VehicleCard";
import VehicleCardSkeleton from "@/components/vehicle/VehicleCardSkeleton";
import { Button } from "@/components/ui/button";
import type { BudgetBand, VehicleListing } from "@/types/vehicle";

interface VehicleGridProps {
  listings: VehicleListing[];
  category: string;
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  activeBudgetBand?: BudgetBand;
  onBudgetChange: (band: BudgetBand | null) => void;
  onResetFilters: () => void;
}

const getInsertionIndex = (width: number) => {
  if (width >= 1024) {
    return 2;
  }

  if (width >= 640) {
    return 1;
  }

  return 0;
};

const VehicleGrid = ({
  listings,
  category,
  isLoading,
  error,
  onRetry,
  activeBudgetBand,
  onBudgetChange,
  onResetFilters,
}: VehicleGridProps) => {
  const [insertionIndex, setInsertionIndex] = useState(() =>
    typeof window === "undefined" ? 2 : getInsertionIndex(window.innerWidth),
  );

  useEffect(() => {
    const onResize = () => {
      setInsertionIndex(getInsertionIndex(window.innerWidth));
    };

    onResize();
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <VehicleCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-base font-medium text-red-700">{error.message || "Unable to load vehicles."}</p>
        <Button className="mt-4" onClick={onRetry}>
          Try Again
        </Button>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <SearchX className="mx-auto size-10 text-gray-300" />
        <p className="mt-4 text-lg font-medium text-gray-800">No vehicles found for this filter</p>
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-2 text-sm text-primary hover:underline"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {listings.flatMap((listing, index) => {
        const elements = [
          <VehicleCard key={listing.id} listing={listing} category={category} />,
        ];

        if (index === insertionIndex) {
          elements.push(
            <div key="budget" className="sm:col-span-2 lg:col-span-3">
              <ShopByBudget activeBand={activeBudgetBand} onChange={onBudgetChange} />
            </div>,
          );
        }

        return elements;
      })}
      <div className="sm:col-span-2 lg:col-span-3 text-right text-xs text-gray-400">
        <Link to={`/vehicles/${category}`} className="hover:text-primary hover:underline">
          Browse all {category}
        </Link>
      </div>
    </div>
  );
};

export default VehicleGrid;
