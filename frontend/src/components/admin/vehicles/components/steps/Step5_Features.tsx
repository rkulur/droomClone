// Project router: <Routes> JSX in src/App.tsx
// Admin route: <Route path="/admin" element={canAccessAdmin ? <AdminPage /> : <Navigate to="/" replace />} />
// Admin component: src/components/admin/index.tsx

import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect } from "react";
import useSWR from "swr";
import DynamicFeatureField from "../fields/DynamicFeatureField";
import FormSection from "../FormSection";
import TagInput from "../fields/TagInput";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../ui/card";
import { Button } from "../../../../ui/button";
import { Textarea } from "../../../../ui/textarea";
import { Input } from "../../../../ui/input";
import { Switch } from "../../../../ui/switch";
import { Checkbox } from "../../../../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../ui/popover";
import { Calendar } from "../../../../ui/calendar";
import { Skeleton } from "../../../../ui/skeleton";
import { cn } from "../../../../../lib/utils";
import { useListingStore } from "../../../../../stores/useListingStore";

type FeatureTemplateField = {
  key: string;
  label: string;
  type: "string" | "number" | "boolean" | "select" | "multiselect" | "range";
  unit?: string;
  options?: string[];
  isRequired?: boolean;
  isHighlighted?: boolean;
  helpText?: string;
  validation?: {
    min?: number;
    max?: number;
  };
};

type FeatureTemplateSection = {
  sectionTitle: string;
  sortOrder: number;
  fields: FeatureTemplateField[];
};

const listingPlanTiles = [
  ["free", "Basic - 10 photos"],
  ["silver", "More visibility - 15 photos"],
  ["gold", "Featured - 20 photos"],
  ["platinum", "Spotlight - all features"],
] as const;

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch feature templates");
  }
  return response.json();
};

const Step5_Features = () => {
  const categoryId = useListingStore((state) => state.categoryId);
  const categoryLabel = useListingStore((state) => state.categoryId);
  const brandLabel = useListingStore((state) => state.brandId);
  const modelLabel = useListingStore((state) => state.modelName);
  const year = useListingStore((state) => state.year);
  const price = useListingStore((state) => state.price);
  const locationCity = useListingStore((state) => state.locationCity);
  const locationState = useListingStore((state) => state.locationState);

  const featureSections = useListingStore((state) => state.featureSections);
  const searchableFeatures = useListingStore((state) => state.searchableFeatures);
  const inspected = useListingStore((state) => state.inspected);
  const inspectedBy = useListingStore((state) => state.inspectedBy);
  const inspectionScore = useListingStore((state) => state.inspectionScore);
  const inspectionDate = useListingStore((state) => state.inspectionDate);
  const rcVerified = useListingStore((state) => state.rcVerified);
  const challanClear = useListingStore((state) => state.challanClear);
  const buyerSurety = useListingStore((state) => state.buyerSurety);
  const listingPlan = useListingStore((state) => state.listingPlan);
  const tags = useListingStore((state) => state.tags);
  const metaTitle = useListingStore((state) => state.metaTitle);
  const metaDescription = useListingStore((state) => state.metaDescription);

  const setField = useListingStore((state) => state.setField);
  const setFeatureSections = useListingStore((state) => state.setFeatureSections);
  const setSearchableFeature = useListingStore((state) => state.setSearchableFeature);

  const { data, isLoading } = useSWR(
    categoryId ? `/api/feature-templates?category=${categoryId}` : null,
    fetcher
  );

  useEffect(() => {
    const templateSections = (data?.data ?? data ?? []) as FeatureTemplateSection[];
    if (templateSections.length > 0 && featureSections.length === 0) {
      setFeatureSections(
        templateSections.map((section) => ({
          sectionTitle: section.sectionTitle,
          sortOrder: section.sortOrder,
          fields: section.fields.map((field) => ({
            label: field.label,
            value: "",
            icon: "",
            isHighlighted: Boolean(field.isHighlighted),
          })),
        }))
      );
    }
  }, [data, featureSections.length, setFeatureSections]);

  const templateSections = (data?.data ?? data ?? []) as FeatureTemplateSection[];

  if (!categoryId) {
    return (
      <FormSection title="Features">
        <p className="text-sm text-muted-foreground">Go back to Step 1 and choose a category first.</p>
      </FormSection>
    );
  }

  return (
    <div>
      {isLoading ? (
        <FormSection title="Loading feature templates">
          <div className="grid gap-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </FormSection>
      ) : (
        templateSections.map((section) => (
          <FormSection key={section.sectionTitle} title={section.sectionTitle}>
            <div className="grid gap-4 sm:grid-cols-2">
              {section.fields.map((field) => (
                <DynamicFeatureField
                  key={field.key}
                  field={field}
                  value={searchableFeatures[field.key]}
                  onChange={setSearchableFeature}
                />
              ))}
            </div>
          </FormSection>
        ))
      )}

      <FormSection title="Trust & Certifications">
        <div className="grid gap-4">
          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <div>
              <p className="text-sm font-medium">Inspected</p>
            </div>
            <Switch checked={inspected} onCheckedChange={(checked) => setField("inspected", checked)} />
          </div>

          {inspected ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 sm:col-span-2">
              <div>
                <label className="text-sm font-medium">Inspected By</label>
                <Input value={inspectedBy} onChange={(event) => setField("inspectedBy", event.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Score</label>
                <div className="flex">
                  <Input
                    type="number"
                    className="rounded-r-none"
                    value={inspectionScore ?? ""}
                    onChange={(event) => {
                      const parsed = Number.parseInt(event.target.value, 10);
                      setField("inspectionScore", Number.isNaN(parsed) ? null : parsed);
                    }}
                  />
                  <span className="flex items-center px-3 bg-muted border border-l-0 border-input rounded-r-md text-sm text-muted-foreground">
                    /100
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" type="button" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {inspectionDate ? format(new Date(inspectionDate), "PPP") : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={inspectionDate ? new Date(inspectionDate) : undefined}
                      onSelect={(date) => setField("inspectionDate", date ? date.toISOString() : null)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          ) : null}

          <div className="flex items-center gap-3">
            <Checkbox checked={rcVerified} onCheckedChange={(checked) => setField("rcVerified", Boolean(checked))} />
            <label className="text-sm">Registration Certificate Verified</label>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox checked={challanClear} onCheckedChange={(checked) => setField("challanClear", Boolean(checked))} />
            <label className="text-sm">No Pending Traffic Challans</label>
          </div>

          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <div>
              <p className="text-sm font-medium">Offer Buyer Surety Protection</p>
              <p className="text-xs text-muted-foreground">Eligible sellers only. Shows a trust badge.</p>
            </div>
            <Switch checked={buyerSurety} onCheckedChange={(checked) => setField("buyerSurety", checked)} />
          </div>
        </div>
      </FormSection>

      <FormSection title="Listing Settings">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {listingPlanTiles.map(([value, desc]) => (
              <label
                key={value}
                className={cn(
                  "flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-colors",
                  listingPlan === value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/40"
                )}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name="listingPlan"
                  value={value}
                  checked={listingPlan === value}
                  onChange={() => setField("listingPlan", value)}
                />
                <span className="text-sm font-medium capitalize">{value}</span>
                <span className="text-xs text-muted-foreground mt-0.5">{desc}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="text-sm font-medium">Tags</label>
            <TagInput
              value={tags}
              onChange={(next) => setField("tags", next)}
              placeholder="e.g. sunroof, company-owned"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Add up to 15 keywords. Press Enter or comma to add.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-baseline">
              <label className="text-sm font-medium">SEO Title</label>
              <span className="text-xs text-muted-foreground">{metaTitle.length}/70</span>
            </div>
            <Input
              maxLength={70}
              value={metaTitle}
              onChange={(event) => setField("metaTitle", event.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-baseline">
              <label className="text-sm font-medium">SEO Description</label>
              <span className="text-xs text-muted-foreground">{metaDescription.length}/160</span>
            </div>
            <Textarea
              rows={2}
              maxLength={160}
              value={metaDescription}
              onChange={(event) => setField("metaDescription", event.target.value)}
            />
          </div>
        </div>
      </FormSection>

      <Card className="bg-muted/50 border border-dashed mt-6">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Ready to publish?</CardTitle>
          <CardDescription>Reviewed before going live - usually within 2 hours.</CardDescription>
        </CardHeader>
        <CardContent>
          {[
            ["Category", categoryLabel],
            ["Brand", brandLabel],
            ["Model", modelLabel],
            ["Year", year ? String(year) : ""],
            ["Price", price ? `₹ ${price.toLocaleString("en-IN")}` : ""],
            ["Location", `${locationCity}${locationCity && locationState ? ", " : ""}${locationState}`],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium">{value || "—"}</span>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button
            size="lg"
            className="w-full"
            onClick={() => window.dispatchEvent(new CustomEvent("listing-publish"))}
          >
            <Loader2 className="mr-2 h-4 w-4 hidden animate-spin" />
            Publish Listing
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Step5_Features;
