// Project router: <Routes> JSX in src/App.tsx
// Admin route: <Route path="/admin" element={canAccessAdmin ? <AdminPage /> : <Navigate to="/" replace />} />
// Admin component: src/components/admin/index.tsx

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "../../../../ui/badge";
import { Button } from "../../../../ui/button";
import { Calendar } from "../../../../ui/calendar";
import { Checkbox } from "../../../../ui/checkbox";
import { Input } from "../../../../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../ui/select";
import { Switch } from "../../../../ui/switch";
import { cn } from "../../../../../lib/utils";
import { useListingStore } from "../../../../../stores/useListingStore";
import FieldError from "../FieldError";
import FormSection from "../FormSection";
import { step2Schema } from "../../new/listingSchema";

const rtoStates = [
  ["AP", "Andhra Pradesh"],
  ["AR", "Arunachal Pradesh"],
  ["AS", "Assam"],
  ["BR", "Bihar"],
  ["CG", "Chhattisgarh"],
  ["GA", "Goa"],
  ["GJ", "Gujarat"],
  ["HR", "Haryana"],
  ["HP", "Himachal Pradesh"],
  ["JK", "Jammu & Kashmir"],
  ["JH", "Jharkhand"],
  ["KA", "Karnataka"],
  ["KL", "Kerala"],
  ["MP", "Madhya Pradesh"],
  ["MH", "Maharashtra"],
  ["MN", "Manipur"],
  ["ML", "Meghalaya"],
  ["MZ", "Mizoram"],
  ["NL", "Nagaland"],
  ["OD", "Odisha"],
  ["PB", "Punjab"],
  ["RJ", "Rajasthan"],
  ["SK", "Sikkim"],
  ["TN", "Tamil Nadu"],
  ["TS", "Telangana"],
  ["TR", "Tripura"],
  ["UP", "Uttar Pradesh"],
  ["UK", "Uttarakhand"],
  ["WB", "West Bengal"],
  ["AN", "Andaman & Nicobar"],
  ["CH", "Chandigarh"],
  ["DN", "Dadra & Nagar Haveli"],
  ["DD", "Daman & Diu"],
  ["DL", "Delhi"],
  ["LD", "Lakshadweep"],
  ["PY", "Puducherry"],
] as const;

const conditionTiles = [
  ["excellent", "Excellent", "Like new, no visible wear"],
  ["good", "Good", "Minor scratches, fully functional"],
  ["fair", "Fair", "Some wear, mechanically sound"],
  ["needs-repair", "Needs Repair", "Has issues that need attention"],
] as const;

const Step2_PricingSpecs = () => {
  const setField = useListingStore((state) => state.setField);

  const price = useListingStore((state) => state.price);
  const isNegotiable = useListingStore((state) => state.isNegotiable);
  const emiAvailable = useListingStore((state) => state.emiAvailable);
  const emiStartingFrom = useListingStore((state) => state.emiStartingFrom);
  const emiTenure = useListingStore((state) => state.emiTenure);
  const emiProvider = useListingStore((state) => state.emiProvider);
  const fuelType = useListingStore((state) => state.fuelType);
  const transmission = useListingStore((state) => state.transmission);
  const kmsDriven = useListingStore((state) => state.kmsDriven);
  const ownership = useListingStore((state) => state.ownership);
  const color = useListingStore((state) => state.color);
  const rtoState = useListingStore((state) => state.rtoState);
  const condition = useListingStore((state) => state.condition);
  const insuranceValid = useListingStore((state) => state.insuranceValid);
  const insuranceExpiry = useListingStore((state) => state.insuranceExpiry);
  const hypothecation = useListingStore((state) => state.hypothecation);

  const form = useForm({
    resolver: zodResolver(step2Schema),
    mode: "onBlur",
    defaultValues: {
      price,
      isNegotiable,
      fuelType,
      transmission,
      kmsDriven,
      ownership,
      condition,
      color,
      rtoState,
    },
  });

  useEffect(() => {
    const handler = () => {
      void form.trigger();
    };

    window.addEventListener("listing-step-validate", handler);
    return () => {
      window.removeEventListener("listing-step-validate", handler);
    };
  }, [form]);

  return (
    <div>
      <FormSection title="Pricing">
        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium">Asking Price *</label>
            <div className="flex">
              <span className="flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md text-sm text-muted-foreground">
                ₹
              </span>
              <Input
                type="number"
                className="rounded-l-none"
                placeholder="e.g. 550000"
                value={price ?? ""}
                onChange={(event) => {
                  const parsed = Number.parseInt(event.target.value, 10);
                  const nextValue = Number.isNaN(parsed) ? null : parsed;
                  setField("price", nextValue);
                  form.setValue("price", nextValue, { shouldValidate: true });
                }}
              />
            </div>
            {price && price > 0 ? (
              <p className="text-sm text-muted-foreground mt-1">₹ {price.toLocaleString("en-IN")}</p>
            ) : null}
            <FieldError message={form.formState.errors.price?.message as string | undefined} />
          </div>

          <div className="flex items-center gap-3 py-2">
            <Checkbox
              id="isNegotiable"
              checked={isNegotiable}
              onCheckedChange={(checked) => {
                const next = Boolean(checked);
                setField("isNegotiable", next);
                form.setValue("isNegotiable", next, { shouldValidate: true });
              }}
            />
            <label htmlFor="isNegotiable" className="text-sm font-medium">
              Is Negotiable
            </label>
            {isNegotiable ? <Badge variant="secondary">Negotiable</Badge> : null}
          </div>

          <div>
            <div className="flex items-center gap-3 py-2">
              <Checkbox
                id="emiAvailable"
                checked={emiAvailable}
                onCheckedChange={(checked) => {
                  const next = Boolean(checked);
                  setField("emiAvailable", next);
                }}
              />
              <label htmlFor="emiAvailable" className="text-sm font-medium">
                EMI Available
              </label>
            </div>

            {emiAvailable ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-border">
                <div>
                  <label className="text-sm font-medium">Monthly EMI from</label>
                  <div className="flex">
                    <span className="flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md text-sm text-muted-foreground">
                      ₹
                    </span>
                    <Input
                      type="number"
                      className="rounded-l-none"
                      value={emiStartingFrom ?? ""}
                      onChange={(event) => {
                        const parsed = Number.parseInt(event.target.value, 10);
                        setField("emiStartingFrom", Number.isNaN(parsed) ? null : parsed);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Tenure</label>
                  <div className="flex">
                    <Input
                      type="number"
                      className="rounded-r-none"
                      value={emiTenure ?? ""}
                      onChange={(event) => {
                        const parsed = Number.parseInt(event.target.value, 10);
                        setField("emiTenure", Number.isNaN(parsed) ? null : parsed);
                      }}
                    />
                    <span className="flex items-center px-3 bg-muted border border-l-0 border-input rounded-r-md text-sm text-muted-foreground">
                      mo.
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Financer</label>
                  <Input
                    placeholder="e.g. HDFC, Bajaj Finance"
                    value={emiProvider}
                    onChange={(event) => setField("emiProvider", event.target.value)}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </FormSection>

      <FormSection title="Vehicle Specifications">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Fuel Type *</label>
            <Select
              value={fuelType}
              onValueChange={(value) => {
                setField("fuelType", value);
                form.setValue("fuelType", value, { shouldValidate: true });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="petrol">Petrol</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="cng">CNG/LPG</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="lpg">LPG</SelectItem>
              </SelectContent>
            </Select>
            <FieldError message={form.formState.errors.fuelType?.message as string | undefined} />
          </div>

          <div>
            <label className="text-sm font-medium">Transmission *</label>
            <Select
              value={transmission}
              onValueChange={(value) => {
                setField("transmission", value);
                form.setValue("transmission", value, { shouldValidate: true });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transmission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="automatic">Automatic</SelectItem>
                <SelectItem value="amt">AMT</SelectItem>
                <SelectItem value="cvt">CVT</SelectItem>
                <SelectItem value="dct">DCT</SelectItem>
              </SelectContent>
            </Select>
            <FieldError
              message={form.formState.errors.transmission?.message as string | undefined}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Odometer Reading *</label>
            <div className="flex">
              <Input
                type="number"
                className="rounded-r-none"
                value={kmsDriven ?? ""}
                onChange={(event) => {
                  const parsed = Number.parseInt(event.target.value, 10);
                  const nextValue = Number.isNaN(parsed) ? null : parsed;
                  setField("kmsDriven", nextValue);
                  form.setValue("kmsDriven", nextValue, { shouldValidate: true });
                }}
              />
              <span className="flex items-center px-3 bg-muted border border-l-0 border-input rounded-r-md text-sm text-muted-foreground">
                km
              </span>
            </div>
            <FieldError message={form.formState.errors.kmsDriven?.message as string | undefined} />
          </div>

          <div>
            <label className="text-sm font-medium">Ownership *</label>
            <Select
              value={ownership}
              onValueChange={(value) => {
                setField("ownership", value);
                form.setValue("ownership", value, { shouldValidate: true });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ownership" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1st">1st Owner</SelectItem>
                <SelectItem value="2nd">2nd Owner</SelectItem>
                <SelectItem value="3rd">3rd Owner</SelectItem>
                <SelectItem value="4th+">4th Owner or more</SelectItem>
              </SelectContent>
            </Select>
            <FieldError message={form.formState.errors.ownership?.message as string | undefined} />
          </div>

          <div>
            <label className="text-sm font-medium">Color *</label>
            <Input
              placeholder="e.g. Polar White, Pearl Red"
              value={color}
              onChange={(event) => {
                setField("color", event.target.value);
                form.setValue("color", event.target.value, { shouldValidate: true });
              }}
            />
            <FieldError message={form.formState.errors.color?.message as string | undefined} />
          </div>

          <div>
            <label className="text-sm font-medium">Registered State *</label>
            <Select
              value={rtoState}
              onValueChange={(value) => {
                setField("rtoState", value);
                form.setValue("rtoState", value, { shouldValidate: true });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select registered state" />
              </SelectTrigger>
              <SelectContent>
                {rtoStates.map(([code, name]) => (
                  <SelectItem key={code} value={code}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={form.formState.errors.rtoState?.message as string | undefined} />
          </div>
        </div>
      </FormSection>

      <FormSection title="Condition & Documents">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            {conditionTiles.map(([value, title, desc]) => (
              <label
                key={value}
                className={cn(
                  "flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-colors",
                  condition === value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/40"
                )}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name="condition"
                  value={value}
                  checked={condition === value}
                  onChange={() => {
                    setField("condition", value);
                    form.setValue("condition", value, { shouldValidate: true });
                  }}
                />
                <span className="text-sm font-medium">{title}</span>
                <span className="text-xs text-muted-foreground mt-0.5">{desc}</span>
              </label>
            ))}
          </div>
          <FieldError message={form.formState.errors.condition?.message as string | undefined} />

          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <div>
              <p className="text-sm font-medium">Insurance valid</p>
              <p className="text-xs text-muted-foreground">Add expiry date if active</p>
            </div>
            <Switch
              checked={insuranceValid}
              onCheckedChange={(checked) => {
                setField("insuranceValid", checked);
                if (!checked) {
                  setField("insuranceExpiry", null);
                }
              }}
            />
          </div>

          {insuranceValid ? (
            <div className="mt-2">
              <label className="text-sm font-medium">Insurance Expiry</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal" type="button">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {insuranceExpiry
                      ? format(new Date(insuranceExpiry), "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={insuranceExpiry ? new Date(insuranceExpiry) : undefined}
                    onSelect={(date) => {
                      setField("insuranceExpiry", date ? date.toISOString() : null);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          ) : null}

          <div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="hypothecation"
                checked={hypothecation}
                onCheckedChange={(checked) => setField("hypothecation", Boolean(checked))}
              />
              <label htmlFor="hypothecation" className="text-sm font-medium">
                Active bank loan / hypothecation on this vehicle
              </label>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Check if the vehicle has an outstanding loan against it.
            </p>
          </div>
        </div>
      </FormSection>
    </div>
  );
};

export default Step2_PricingSpecs;
