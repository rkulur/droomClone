// Project router: <Routes> JSX in src/App.tsx
// Admin route: <Route path="/admin" element={canAccessAdmin ? <AdminPage /> : <Navigate to="/" replace />} />
// Admin component: src/components/admin/index.tsx

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import useSWR from "swr";
import { Button } from "../../../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover";
import { Skeleton } from "../../../ui/skeleton";
import { cn } from "../../../../lib/utils";

type Model = {
  _id?: string;
  id?: string;
  name: string;
  yearFrom?: number;
  yearTo?: number | null;
};

type ModelPickerProps = {
  value: string;
  onChange: (id: string, name: string) => void;
  brandId: string;
  disabled: boolean;
};

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch models");
  }
  return response.json();
};

const ModelPicker = ({ value, onChange, brandId, disabled }: ModelPickerProps) => {
  const [open, setOpen] = useState(false);
  const { data, error, isLoading } = useSWR(
    brandId ? `/api/models?brand=${brandId}&isActive=true` : null,
    fetcher
  );

  const items = useMemo(() => {
    const raw = (data?.data ?? data ?? []) as Model[];
    return raw.map((item) => ({
      id: item._id ?? item.id ?? "",
      label: item.name,
      from: item.yearFrom,
      to: item.yearTo,
    }));
  }, [data]);

  const selected = items.find((item) => item.id === value);

  if (!brandId) {
    return (
      <Button variant="outline" className="w-full justify-between" disabled type="button">
        Select a brand first
      </Button>
    );
  }

  if (isLoading) {
    return <Skeleton className="h-10 w-full rounded-md" />;
  }

  if (error) {
    return (
      <Button variant="outline" className="w-full justify-between" disabled type="button">
        Failed to load models
      </Button>
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
          {selected ? selected.label : <span className="text-muted-foreground">Select model…</span>}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search models…" />
          <CommandEmpty>No model found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.label}
                  onSelect={() => {
                    onChange(item.id, item.label);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.from ?? "-"}-{item.to ?? "present"}
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

export default ModelPicker;
