// Project router: <Routes> JSX in src/App.tsx
// Admin route: <Route path="/admin" element={canAccessAdmin ? <AdminPage /> : <Navigate to="/" replace />} />
// Admin component: src/components/admin/index.tsx

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import useSWR from "swr";
import { toast } from "sonner";
import { Button } from "../../../../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../../ui/command";
import { Input } from "../../../../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../ui/popover";
import { Skeleton } from "../../../../ui/skeleton";
import { cn } from "../../../../../lib/utils";
import { fetchJson, getErrorMessage } from "../../api/client";
import { adminVehicleApi } from "../../api/endpoints";
import { getMockModelById } from "../../data/mockVehicleCatalog";

type Variant = {
  name: string;
  launchYear?: number;
};

type VariantPickerProps = {
  value: string;
  onChange: (name: string) => void;
  modelId: string;
  disabled: boolean;
};

const VariantPicker = ({ value, onChange, modelId, disabled }: VariantPickerProps) => {
  const [open, setOpen] = useState(false);
  const { data, error, isLoading } = useSWR(
    modelId ? adminVehicleApi.modelDetails(modelId) : null,
    fetchJson<{ variants?: Variant[] }>
  );

  useEffect(() => {
    if (!error) {
      return;
    }

    toast.error(getErrorMessage(error, "Failed to fetch model details"));
  }, [error]);

  const variants = useMemo(() => {
    const raw = ((data ?? getMockModelById(modelId))?.variants ?? []) as Variant[];
    return raw;
  }, [data, modelId]);

  if (!modelId) {
    return (
      <Input
        placeholder="e.g. VXI, ZXI+"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled
      />
    );
  }

  if (isLoading) {
    return <Skeleton className="h-10 w-full rounded-md" />;
  }

  if (variants.length === 0) {
    return (
      <Input
        placeholder="e.g. VXI, ZXI+"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
          type="button"
        >
          {value ? value : <span className="text-muted-foreground">Select variant…</span>}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search variants…" />
          <CommandEmpty>{error ? "Using mock variants." : "No variant found."}</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {variants.map((item) => (
                <CommandItem
                  key={`${item.name}-${item.launchYear ?? "na"}`}
                  value={item.name}
                  onSelect={() => {
                    onChange(item.name);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.launchYear ?? "-"}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default VariantPicker;
