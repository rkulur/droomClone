import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Filter, Search } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ListingApiResponse, ListingFilters } from "@/types/vehicle";

interface VehicleFiltersProps {
  category: string;
  activeFilters: ListingFilters;
  activeSubcategory?: string;
  filterMetadata?: ListingApiResponse["filters"] | null;
  onChange: (delta: Partial<ListingFilters>) => void;
  onReset: () => void;
  onSubcategoryChange: (subcategory?: string) => void;
}

const FilterPanel = ({
  category,
  activeFilters,
  activeSubcategory,
  filterMetadata,
  onChange,
  onReset,
  onSubcategoryChange,
}: VehicleFiltersProps) => {
  const [citySearch, setCitySearch] = useState("");
  const [conditionOpen, setConditionOpen] = useState(true);
  const [subcategoryOpen, setSubcategoryOpen] = useState(true);
  const [locationOpen, setLocationOpen] = useState(true);

  const filteredCities = useMemo(() => {
    const cities = filterMetadata?.availableCities ?? [];
    const normalized = citySearch.toLowerCase().trim();

    if (!normalized) {
      return cities;
    }

    return cities.filter((city) => city.label.toLowerCase().includes(normalized));
  }, [citySearch, filterMetadata?.availableCities]);

  const categoryLabel = category.endsWith("y")
    ? `${category.slice(0, -1)}ies`
    : `${category}s`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-base font-medium text-gray-800">
          <Filter className="size-4 text-primary" />
          Filters
        </div>
        <button type="button" onClick={onReset} className="text-sm text-primary hover:underline">
          Reset All
        </button>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white">
        <button
          type="button"
          onClick={() => setConditionOpen((open) => !open)}
          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-800"
        >
          Condition
          {conditionOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>
        {conditionOpen ? (
          <div className="flex gap-3 px-4 pb-4">
            {(["used", "new"] as const).map((condition) => {
              const isActive = activeFilters.condition === condition;

              return (
                <button
                  key={condition}
                  type="button"
                  onClick={() =>
                    onChange({
                      condition: isActive ? undefined : condition,
                      page: 1,
                    })
                  }
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm capitalize transition-colors",
                    isActive
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300 bg-white text-gray-700",
                  )}
                >
                  {condition}
                </button>
              );
            })}
          </div>
        ) : null}
      </section>

      {filterMetadata?.availableSubcategories?.length ? (
        <section className="rounded-xl border border-gray-200 bg-white">
          <button
            type="button"
            onClick={() => setSubcategoryOpen((open) => !open)}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-800"
          >
            Category
            {subcategoryOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
          {subcategoryOpen ? (
            <div className="space-y-3 px-4 pb-4">
              {filterMetadata.availableSubcategories.map((option) => {
                const optionValue = option.value || undefined;
                const isActive = (activeSubcategory || undefined) === optionValue;

                return (
                  <label key={`${option.label}-${option.value}`} className="flex items-center gap-3 text-sm">
                    <Checkbox
                      checked={isActive}
                      onCheckedChange={(checked) => {
                        if (!checked) {
                          onSubcategoryChange(undefined);
                          return;
                        }

                        onSubcategoryChange(optionValue);
                      }}
                    />
                    <span className="flex-1 text-gray-700">
                      {option.label || `All ${categoryLabel}`}
                    </span>
                    <span className="text-xs text-gray-400">
                      {option.count?.toLocaleString("en-IN") ?? ""}
                    </span>
                  </label>
                );
              })}
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-xl border border-gray-200 bg-white">
        <button
          type="button"
          onClick={() => setLocationOpen((open) => !open)}
          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-800"
        >
          Location
          {locationOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>
        {locationOpen ? (
          <div className="space-y-3 px-4 pb-4">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={citySearch}
                onChange={(event) => setCitySearch(event.target.value)}
                placeholder="Search city"
                className="pl-9"
              />
            </div>
            <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
              {filteredCities.map((city) => {
                const isActive = activeFilters.city === city.value;

                return (
                  <label key={city.value} className="flex items-center gap-3 text-sm">
                    <Checkbox
                      checked={isActive}
                      onCheckedChange={(checked) =>
                        onChange({
                          city: checked ? city.value : undefined,
                          page: 1,
                        })
                      }
                    />
                    <span className="flex-1 text-gray-700">{city.label}</span>
                    <span className="text-xs text-gray-400">
                      {city.count?.toLocaleString("en-IN") ?? ""}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
};

const VehicleFilters = (props: VehicleFiltersProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
        >
          <Filter className="size-4" />
          Filters
        </button>
      </div>

      <div className="hidden md:block">
        <FilterPanel {...props} />
      </div>

      <Dialog open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <DialogContent className="top-0 left-0 h-screen max-w-sm translate-x-0 translate-y-0 rounded-none border-r p-6">
          <DialogTitle className="sr-only">Vehicle filters</DialogTitle>
          <FilterPanel {...props} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VehicleFilters;
