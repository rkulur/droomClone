import { LayoutGrid, Rows3 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS } from "@/constants/vehicleListing";
import type { SortOption } from "@/types/vehicle";

interface SortBarProps {
  activeSort: SortOption;
  resultCount: number;
  onChange: (sort: SortOption) => void;
}

const SortBar = ({ activeSort, resultCount, onChange }: SortBarProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-500">
        {resultCount.toLocaleString("en-IN")} results
      </p>
      <div className="flex items-center gap-3 self-end sm:self-auto">
        <span className="text-sm text-gray-500">Sort By:</span>
        <Select value={activeSort} onValueChange={(value) => onChange(value as SortOption)}>
          <SelectTrigger className="min-w-44 bg-white">
            <SelectValue placeholder="Most Recent" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          type="button"
          aria-label="Grid view"
          className="flex size-9 items-center justify-center rounded-md border border-primary bg-primary/10 text-primary"
        >
          <LayoutGrid className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Compact view"
          className="flex size-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-400"
        >
          <Rows3 className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default SortBar;
