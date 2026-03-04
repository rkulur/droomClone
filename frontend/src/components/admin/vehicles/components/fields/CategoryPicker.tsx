// Project router: <Routes> JSX in src/App.tsx
// Admin route: <Route path="/admin" element={canAccessAdmin ? <AdminPage /> : <Navigate to="/" replace />} />
// Admin component: src/components/admin/index.tsx

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import useSWR from "swr";
import { Button } from "../../../../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../ui/popover";
import { Skeleton } from "../../../../ui/skeleton";
import { cn } from "../../../../../lib/utils";

type Category = {
  _id?: string;
  id?: string;
  name: string;
  iconUrl?: string;
};

type CategoryPickerProps = {
  value: string;
  onChange: (id: string) => void;
};

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
};

const CategoryPicker = ({ value, onChange }: CategoryPickerProps) => {
  const [open, setOpen] = useState(false);
  const { data, error, isLoading } = useSWR("/api/categories?isActive=true", fetcher);

  const items = useMemo(() => {
    const raw = (data?.data ?? data ?? []) as Category[];
    return raw.map((item) => ({
      id: item._id ?? item.id ?? "",
      label: item.name,
      iconUrl: item.iconUrl,
    }));
  }, [data]);

  const selected = items.find((item) => item.id === value);

  if (isLoading) {
    return <Skeleton className="h-10 w-full rounded-md" />;
  }

  if (error) {
    return (
      <Button variant="outline" className="w-full justify-between" disabled type="button">
        Failed to load categories
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
          type="button"
        >
          {selected ? (
            selected.label
          ) : (
            <span className="text-muted-foreground">Select category…</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search categories…" />
          <CommandEmpty>No category found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.label}
                  onSelect={() => {
                    onChange(item.id);
                    setOpen(false);
                  }}
                >
                  {item.iconUrl ? (
                    <img src={item.iconUrl} alt={item.label} className="mr-2 h-4 w-4" />
                  ) : null}
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategoryPicker;
