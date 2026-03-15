// Project router: <Routes> JSX in src/App.tsx
// Admin route: <Route path="/admin" element={canAccessAdmin ? <AdminPage /> : <Navigate to="/" replace />} />
// Admin component: src/components/admin/index.tsx

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";
import { Input } from "../../../../ui/input";
import { Textarea } from "../../../../ui/textarea";
import { useListingStore } from "../../../../../stores/useListingStore";
import FieldError from "../FieldError";
import FormSection from "../FormSection";
import BrandPicker from "../fields/BrandPicker";
import CategoryPicker from "../fields/CategoryPicker";
import ModelPicker from "../fields/ModelPicker";
import VariantPicker from "../fields/VariantPicker";
import { fetchJson } from "../../api/client";
import { adminVehicleApi } from "../../api/endpoints";
import { step1Schema } from "../../new/listingSchema";

type Step1Values = z.input<typeof step1Schema>;
type CatalogItem = {
  _id?: string;
  id?: string;
  name: string;
};

const Step1_Identity = () => {
  const title = useListingStore((state) => state.title);
  const description = useListingStore((state) => state.description);
  const categoryId = useListingStore((state) => state.categoryId);
  const brandId = useListingStore((state) => state.brandId);
  const modelId = useListingStore((state) => state.modelId);
  const modelName = useListingStore((state) => state.modelName);
  const variant = useListingStore((state) => state.variant);
  const year = useListingStore((state) => state.year);
  const regNumber = useListingStore((state) => state.regNumber);
  const setField = useListingStore((state) => state.setField);

  const form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    mode: "onBlur",
    defaultValues: {
      title,
      description,
      categoryId,
      brandId,
      modelId,
      variant,
      year: year ?? undefined,
      regNumber,
    },
  });

  const { data: categories = [] } = useSWR(
    adminVehicleApi.categories,
    fetchJson<CatalogItem[]>,
  );
  const { data: brands = [] } = useSWR(
    categoryId ? adminVehicleApi.brands(categoryId) : null,
    fetchJson<CatalogItem[]>,
  );
  const { data: models = [] } = useSWR(
    brandId ? adminVehicleApi.models(brandId) : null,
    fetchJson<CatalogItem[]>,
  );

  useEffect(() => {
    form.setValue("title", title, { shouldDirty: false });
    form.setValue("description", description, { shouldDirty: false });
    form.setValue("categoryId", categoryId, { shouldDirty: false });
    form.setValue("brandId", brandId, { shouldDirty: false });
    form.setValue("modelId", modelId, { shouldDirty: false });
    form.setValue("variant", variant, { shouldDirty: false });
    form.setValue("year", (year ?? undefined) as Step1Values["year"], {
      shouldDirty: false,
    });
    form.setValue("regNumber", regNumber, { shouldDirty: false });
  }, [brandId, categoryId, description, form, modelId, regNumber, title, variant, year]);

  useEffect(() => {
    if (!categoryId) {
      return;
    }

    const hasCategory = categories.some(
      (item) => (item._id ?? item.id ?? "") === categoryId,
    );

    if (hasCategory) {
      return;
    }

    setField("categoryId", "");
    setField("brandId", "");
    setField("modelId", "");
    setField("modelName", "");
    setField("variant", "");
    form.setValue("categoryId", "", { shouldValidate: true });
    form.setValue("brandId", "");
    form.setValue("modelId", "");
    form.setValue("variant", "");
  }, [categories, categoryId, form, setField]);

  useEffect(() => {
    if (!brandId) {
      return;
    }

    const hasBrand = brands.some(
      (item) => (item._id ?? item.id ?? "") === brandId,
    );

    if (hasBrand) {
      return;
    }

    setField("brandId", "");
    setField("modelId", "");
    setField("modelName", "");
    setField("variant", "");
    form.setValue("brandId", "", { shouldValidate: true });
    form.setValue("modelId", "");
    form.setValue("variant", "");
  }, [brandId, brands, form, setField]);

  useEffect(() => {
    if (!modelId) {
      return;
    }

    const selectedModel = models.find(
      (item) => (item._id ?? item.id ?? "") === modelId,
    );

    if (selectedModel) {
      if (modelName !== selectedModel.name) {
        setField("modelName", selectedModel.name);
      }
      return;
    }

    setField("modelId", "");
    setField("modelName", "");
    setField("variant", "");
    form.setValue("modelId", "", { shouldValidate: true });
    form.setValue("variant", "");
  }, [form, modelId, modelName, models, setField]);

  useEffect(() => {
    const handler = () => {
      void form.trigger();
    };

    window.addEventListener("listing-step-validate", handler);
    return () => {
      window.removeEventListener("listing-step-validate", handler);
    };
  }, [form]);

  const currentYear = new Date().getFullYear() + 1;

  return (
    <div>
      <FormSection
        title="Vehicle Identity"
        description="Start by identifying what you are selling."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Vehicle Category *</label>
            <CategoryPicker
              value={categoryId}
              onChange={(id) => {
                setField("categoryId", id);
                setField("brandId", "");
                setField("modelId", "");
                setField("modelName", "");
                setField("variant", "");
                form.setValue("categoryId", id, { shouldValidate: true });
                form.setValue("brandId", "");
                form.setValue("modelId", "");
                form.setValue("variant", "");
              }}
            />
            <FieldError message={form.formState.errors.categoryId?.message} />
          </div>

          <div>
            <label className="text-sm font-medium">Brand *</label>
            <BrandPicker
              value={brandId}
              onChange={(id) => {
                setField("brandId", id);
                setField("modelId", "");
                setField("modelName", "");
                setField("variant", "");
                form.setValue("brandId", id, { shouldValidate: true });
                form.setValue("modelId", "");
                form.setValue("variant", "");
              }}
              categoryId={categoryId}
              disabled={!categoryId}
            />
            <FieldError message={form.formState.errors.brandId?.message} />
          </div>

          <div>
            <label className="text-sm font-medium">Model *</label>
            <ModelPicker
              value={modelId}
              onChange={(id, name) => {
                setField("modelId", id);
                setField("modelName", name);
                setField("variant", "");
                form.setValue("modelId", id, { shouldValidate: true });
                form.setValue("variant", "");
              }}
              brandId={brandId}
              disabled={!brandId}
            />
            <FieldError message={form.formState.errors.modelId?.message} />
          </div>

          <div>
            <label className="text-sm font-medium">Variant</label>
            <VariantPicker
              value={variant}
              onChange={(value) => {
                setField("variant", value);
                form.setValue("variant", value);
              }}
              modelId={modelId}
              disabled={!modelId}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Registration" description="Basic vehicle details.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Year of Manufacture *</label>
            <Input
              type="number"
              min="1980"
              max={currentYear}
              placeholder="e.g. 2021"
              value={year ?? ""}
              onChange={(event) => {
                const parsed = Number.parseInt(event.target.value, 10);
                const nextValue = Number.isNaN(parsed) ? null : parsed;
                setField("year", nextValue);
                form.setValue(
                  "year",
                  (nextValue ?? undefined) as Step1Values["year"],
                  {
                    shouldValidate: true,
                  },
                );
              }}
            />
            <FieldError message={form.formState.errors.year?.message} />
          </div>

          <div>
            <label className="text-sm font-medium">Registration Number</label>
            <Input
              placeholder="e.g. MH 02 AB 1234"
              className="uppercase"
              value={regNumber}
              onChange={(event) => {
                const next = event.target.value.toUpperCase();
                setField("regNumber", next);
                form.setValue("regNumber", next);
              }}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Masked publicly — only last 4 digits shown to buyers.
            </p>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Listing Copy"
        description="Write a clear title and description to attract buyers."
      >
        <div className="grid gap-4">
          <div>
            <div className="flex justify-between items-baseline">
              <label className="text-sm font-medium">Listing Title *</label>
              <span className="text-xs text-muted-foreground">{title.length}/100</span>
            </div>
            <Input
              maxLength={100}
              placeholder="e.g. 2021 Maruti Swift VXI — First Owner, Well Maintained"
              value={title}
              onChange={(event) => {
                const next = event.target.value;
                setField("title", next);
                form.setValue("title", next, { shouldValidate: true });
              }}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Include year, brand, model, variant, and condition for best results.
            </p>
            <FieldError message={form.formState.errors.title?.message} />
          </div>

          <div>
            <div className="flex justify-between items-baseline">
              <label className="text-sm font-medium">Description</label>
              <span className="text-xs text-muted-foreground">{description.length}/2000</span>
            </div>
            <Textarea
              rows={5}
              maxLength={2000}
              placeholder="Describe condition, service history, reason for selling, and known issues."
              value={description}
              onChange={(event) => {
                const next = event.target.value;
                setField("description", next);
                form.setValue("description", next, { shouldValidate: true });
              }}
            />
            <FieldError message={form.formState.errors.description?.message} />
          </div>
        </div>
      </FormSection>
    </div>
  );
};

export default Step1_Identity;
