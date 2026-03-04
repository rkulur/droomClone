// Project router: <Routes> JSX in src/App.tsx
// Admin route: <Route path="/admin" element={canAccessAdmin ? <AdminPage /> : <Navigate to="/" replace />} />
// Admin component: src/components/admin/index.tsx

import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../../../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../ui/select";
import { Textarea } from "../../../../ui/textarea";
import { useListingStore } from "../../../../../stores/useListingStore";
import FieldError from "../FieldError";
import FormSection from "../FormSection";
import { step3Schema } from "../../new/listingSchema";

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman & Nicobar",
  "Chandigarh",
  "Dadra & Nagar Haveli",
  "Daman & Diu",
  "Delhi",
  "Lakshadweep",
  "Puducherry",
];

const Step3_Location = () => {
  const setField = useListingStore((state) => state.setField);
  const locationCity = useListingStore((state) => state.locationCity);
  const locationState = useListingStore((state) => state.locationState);
  const locationPincode = useListingStore((state) => state.locationPincode);
  const locationAddress = useListingStore((state) => state.locationAddress);

  const form = useForm({
    resolver: zodResolver(step3Schema),
    mode: "onBlur",
    defaultValues: {
      locationCity,
      locationState,
      locationPincode,
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
      <FormSection
        title="Vehicle Location"
        description="Buyers see city and state. Your exact address is never shown publicly."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">City *</label>
            <Input
              placeholder="e.g. Mumbai"
              value={locationCity}
              onChange={(event) => {
                setField("locationCity", event.target.value);
                form.setValue("locationCity", event.target.value, { shouldValidate: true });
              }}
            />
            <FieldError
              message={form.formState.errors.locationCity?.message as string | undefined}
            />
          </div>

          <div>
            <label className="text-sm font-medium">State *</label>
            <Select
              value={locationState}
              onValueChange={(value) => {
                setField("locationState", value);
                form.setValue("locationState", value, { shouldValidate: true });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError
              message={form.formState.errors.locationState?.message as string | undefined}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Pincode *</label>
            <Input
              type="text"
              maxLength={6}
              placeholder="6-digit pincode"
              value={locationPincode}
              onChange={(event) => {
                const sanitized = event.target.value.replace(/\D/g, "");
                setField("locationPincode", sanitized);
                form.setValue("locationPincode", sanitized, { shouldValidate: true });
              }}
            />
            <FieldError
              message={form.formState.errors.locationPincode?.message as string | undefined}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Address (optional)</label>
            <Textarea
              rows={2}
              placeholder="Street, Locality — not shown to buyers"
              value={locationAddress}
              onChange={(event) => {
                setField("locationAddress", event.target.value);
              }}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Used only for internal location pinning.
            </p>
          </div>
        </div>
      </FormSection>

      <FormSection title="Map Pin (optional)">
        <div className="h-48 w-full rounded-md border border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-6 w-6" />
          <span>Map integration — connect Google Maps API here</span>
        </div>
      </FormSection>
    </div>
  );
};

export default Step3_Location;
