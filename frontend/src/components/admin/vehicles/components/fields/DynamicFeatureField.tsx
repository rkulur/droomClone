// Project router: <Routes> JSX in src/App.tsx
// Admin route: <Route path="/admin" element={canAccessAdmin ? <AdminPage /> : <Navigate to="/" replace />} />
// Admin component: src/components/admin/index.tsx

import { Badge } from "../../../../ui/badge";
import { Checkbox } from "../../../../ui/checkbox";
import { Input } from "../../../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../ui/select";
import { Switch } from "../../../../ui/switch";


type DynamicField = {
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

type DynamicFeatureFieldProps = {
  field: DynamicField;
  value: unknown;
  onChange: (key: string, value: unknown) => void;
};

const DynamicFeatureField = ({ field, value, onChange }: DynamicFeatureFieldProps) => {
  const selectedValues = Array.isArray(value) ? (value as string[]) : [];

  return (
    <div className="grid gap-1.5">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">
          {field.label}
          {field.isRequired ? <span className="text-destructive">*</span> : null}
        </label>
        {field.isHighlighted ? (
          <Badge variant="outline" className="text-xs px-1.5 py-0">
            Shown on card
          </Badge>
        ) : null}
      </div>

      {field.type === "string" ? (
        <div className="flex">
          <Input
            type="text"
            value={typeof value === "string" ? value : ""}
            onChange={(event) => onChange(field.key, event.target.value)}
            className={field.unit ? "rounded-r-none" : ""}
          />
          {field.unit ? (
            <span className="flex items-center px-3 bg-muted border border-l-0 border-input rounded-r-md text-sm text-muted-foreground">
              {field.unit}
            </span>
          ) : null}
        </div>
      ) : null}

      {field.type === "number" ? (
        <div className="flex">
          <Input
            type="number"
            min={field.validation?.min}
            max={field.validation?.max}
            value={typeof value === "number" ? value : ""}
            onChange={(event) => {
              const parsed = Number.parseFloat(event.target.value);
              onChange(field.key, Number.isNaN(parsed) ? null : parsed);
            }}
            className={field.unit ? "rounded-r-none" : ""}
          />
          {field.unit ? (
            <span className="flex items-center px-3 bg-muted border border-l-0 border-input rounded-r-md text-sm text-muted-foreground">
              {field.unit}
            </span>
          ) : null}
        </div>
      ) : null}

      {field.type === "boolean" ? (
        <div className="flex items-center gap-2 h-10">
          <Switch checked={Boolean(value)} onCheckedChange={(v) => onChange(field.key, v)} />
          <span className="text-sm text-muted-foreground">{value ? "Yes" : "No"}</span>
        </div>
      ) : null}

      {field.type === "select" ? (
        <Select
          value={typeof value === "string" ? value : ""}
          onValueChange={(v) => onChange(field.key, v)}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select ${field.label}`} />
          </SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}

      {field.type === "multiselect" ? (
        <div className="flex flex-wrap gap-3">
          {(field.options ?? []).map((option) => {
            const checked = selectedValues.includes(option);
            return (
              <label key={option} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(next) => {
                    if (next) {
                      onChange(field.key, [...selectedValues, option]);
                    } else {
                      onChange(
                        field.key,
                        selectedValues.filter((item) => item !== option)
                      );
                    }
                  }}
                />
                {option}
              </label>
            );
          })}
        </div>
      ) : null}

      {field.type === "range" ? (
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={typeof value === "object" && value && "min" in value ? (value as { min?: number }).min ?? "" : ""}
            onChange={(event) => {
              const parsed = Number.parseFloat(event.target.value);
              const current = (typeof value === "object" && value ? value : {}) as {
                min?: number;
                max?: number;
              };
              onChange(field.key, {
                ...current,
                min: Number.isNaN(parsed) ? undefined : parsed,
              });
            }}
          />
          <Input
            type="number"
            placeholder="Max"
            value={typeof value === "object" && value && "max" in value ? (value as { max?: number }).max ?? "" : ""}
            onChange={(event) => {
              const parsed = Number.parseFloat(event.target.value);
              const current = (typeof value === "object" && value ? value : {}) as {
                min?: number;
                max?: number;
              };
              onChange(field.key, {
                ...current,
                max: Number.isNaN(parsed) ? undefined : parsed,
              });
            }}
          />
          {field.unit ? (
            <span className="flex items-center px-3 bg-muted border border-input rounded-md text-sm text-muted-foreground">
              {field.unit}
            </span>
          ) : null}
        </div>
      ) : null}

      {field.helpText ? <p className="text-xs text-muted-foreground">{field.helpText}</p> : null}
    </div>
  );
};

export default DynamicFeatureField;
