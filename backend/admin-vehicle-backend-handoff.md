# Admin Vehicle Backend Handoff

This document is for the backend Codex that will implement the APIs required by the admin vehicle listing flow in the frontend.

## Goal

Build the backend needed for the admin vehicle creation flow used by the frontend at:

- `src/components/admin/vehicles/new/AddVehiclePage.tsx`
- `src/components/admin/vehicles/components/steps/Step1_Identity.tsx`
- `src/components/admin/vehicles/components/steps/Step2_PricingSpecs.tsx`
- `src/components/admin/vehicles/components/steps/Step3_Location.tsx`
- `src/components/admin/vehicles/components/steps/Step4_Media.tsx`
- `src/components/admin/vehicles/components/steps/Step5_Features.tsx`

The frontend currently expects these read endpoints:

- `GET /api/categories?isActive=true`
- `GET /api/brands?category=<categoryId>&isActive=true`
- `GET /api/models?brand=<brandId>&isActive=true`
- `GET /api/models/:modelId`
- `GET /api/feature-templates?category=<categoryId>`

The frontend does not yet call a real publish API, but the backend should also implement:

- `POST /api/admin/vehicles`
- `GET /api/admin/vehicles/:id`
- `PATCH /api/admin/vehicles/:id`
- `POST /api/admin/uploads/images`
- `POST /api/admin/uploads/reports`

## Important frontend assumptions

The frontend is currently tolerant of two response styles:

1. Wrapped: `{ "data": ... }`
2. Direct: the resource itself or an array directly

To keep things consistent, prefer the wrapped format:

```json
{
  "data": ...
}
```

The frontend reads IDs using:

- `_id` first
- `id` second

Recommendation: always return `_id` as a string.

## Data the frontend collects

The full listing draft shape in the frontend is effectively:

```ts
type ListingDraft = {
  title: string;
  description: string;
  categoryId: string;
  brandId: string;
  modelId: string;
  modelName: string;
  variant: string;
  year: number | null;
  regNumber: string;

  price: number | null;
  currency: string;
  isNegotiable: boolean;
  emiAvailable: boolean;
  emiStartingFrom: number | null;
  emiTenure: number | null;
  emiProvider: string;
  isPriceDropped: boolean;
  previousPrice: number | null;

  fuelType: string;
  transmission: string;
  kmsDriven: number | null;
  ownership: string;
  color: string;
  condition: string;
  insuranceValid: boolean;
  insuranceExpiry: string | null;
  rtoState: string;
  hypothecation: boolean;

  locationAddress: string;
  locationCity: string;
  locationState: string;
  locationPincode: string;
  locationLng: number | null;
  locationLat: number | null;

  images: {
    url: string;
    thumbnailUrl: string;
    isPrimary: boolean;
    sortOrder: number;
  }[];
  videoUrl: string;
  video360Url: string;
  inspectionReportUrl: string;

  featureSections: {
    sectionTitle: string;
    sortOrder: number;
    fields: {
      label: string;
      value: string;
      icon: string;
      isHighlighted: boolean;
    }[];
  }[];
  searchableFeatures: Record<string, unknown>;

  inspected: boolean;
  inspectedBy: string;
  inspectionScore: number | null;
  inspectionDate: string | null;
  rcVerified: boolean;
  challanClear: boolean;
  buyerSurety: boolean;
  sellerType: "individual" | "dealer";
  listingPlan: "free" | "silver" | "gold" | "platinum";
  tags: string[];
  metaTitle: string;
  metaDescription: string;
};
```

## Recommended collections / tables

Implement at least these resources:

1. `vehicle_categories`
2. `vehicle_brands`
3. `vehicle_models`
4. `vehicle_feature_templates`
5. `vehicle_listings`
6. `vehicle_media_uploads` or use your existing media storage system

If using MongoDB, the names above can map to Mongoose models. If using SQL, make them tables with foreign keys.

## Schema design

### 1. Vehicle Category

Purpose: top-level catalog used in Step 1.

Suggested fields:

```ts
type VehicleCategory = {
  _id: string;
  name: string;
  slug: string;
  iconUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};
```

Constraints:

- `name` unique
- `slug` unique
- `isActive` indexed
- `sortOrder` indexed

### 2. Vehicle Brand

Purpose: category-specific brand picker in Step 1.

Suggested fields:

```ts
type VehicleBrand = {
  _id: string;
  categoryId: string;
  name: string;
  slug: string;
  logoUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};
```

Constraints:

- index on `categoryId`
- unique compound index on `categoryId + slug`
- `isActive` indexed

### 3. Vehicle Model

Purpose: brand-specific model picker and variant source.

Suggested fields:

```ts
type VehicleVariant = {
  name: string;
  launchYear?: number;
  isActive?: boolean;
  sortOrder?: number;
};

type VehicleModel = {
  _id: string;
  brandId: string;
  name: string;
  slug: string;
  yearFrom?: number;
  yearTo?: number | null;
  variants: VehicleVariant[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};
```

Constraints:

- index on `brandId`
- unique compound index on `brandId + slug`
- `variants.name` should be unique within a model

### 4. Vehicle Feature Template

Purpose: Step 5 dynamic form fields based on category.

Suggested fields:

```ts
type FeatureField = {
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
  sortOrder?: number;
};

type FeatureTemplateSection = {
  sectionTitle: string;
  sortOrder: number;
  fields: FeatureField[];
};

type VehicleFeatureTemplate = {
  _id: string;
  categoryId: string;
  sections: FeatureTemplateSection[];
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
};
```

Important:

- `key` must be stable and API-safe, for example `engine_capacity_cc`, `body_type`, `abs`, `battery_range_km`
- frontend stores actual values in `searchableFeatures[key]`
- `sections` should be returned sorted by `sortOrder`
- `fields` inside each section should also be returned sorted by `sortOrder` if you store it

### 5. Vehicle Listing

Purpose: the actual listing created from the admin flow.

Suggested fields:

```ts
type VehicleListing = {
  _id: string;

  title: string;
  description?: string;

  categoryId: string;
  categoryNameSnapshot: string;
  brandId: string;
  brandNameSnapshot: string;
  modelId: string;
  modelNameSnapshot: string;
  variant?: string;
  year: number;
  regNumber?: string;

  price: number;
  currency: string;
  isNegotiable: boolean;
  emiAvailable: boolean;
  emiStartingFrom?: number | null;
  emiTenure?: number | null;
  emiProvider?: string;
  isPriceDropped: boolean;
  previousPrice?: number | null;

  fuelType: "petrol" | "diesel" | "electric" | "cng" | "hybrid" | "lpg";
  transmission: "manual" | "automatic" | "amt" | "cvt" | "dct";
  kmsDriven: number;
  ownership: "1st" | "2nd" | "3rd" | "4th+";
  color: string;
  condition: "excellent" | "good" | "fair" | "needs-repair";
  insuranceValid: boolean;
  insuranceExpiry?: string | null;
  rtoState: string;
  hypothecation: boolean;

  locationAddress?: string;
  locationCity: string;
  locationState: string;
  locationPincode: string;
  locationLng?: number | null;
  locationLat?: number | null;

  images: {
    url: string;
    thumbnailUrl: string;
    isPrimary: boolean;
    sortOrder: number;
    storageKey?: string;
  }[];
  videoUrl?: string;
  video360Url?: string;
  inspectionReportUrl?: string;

  searchableFeatures: Record<string, unknown>;

  inspected: boolean;
  inspectedBy?: string;
  inspectionScore?: number | null;
  inspectionDate?: string | null;
  rcVerified: boolean;
  challanClear: boolean;
  buyerSurety: boolean;
  sellerType: "individual" | "dealer";
  listingPlan: "free" | "silver" | "gold" | "platinum";
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;

  status: "draft" | "pending_review" | "published" | "rejected" | "archived";
  submittedByAdminId?: string;
  createdAt: string;
  updatedAt: string;
};
```

Recommendation:

- store both IDs and snapshot names
- snapshot names protect listings if catalog labels change later
- keep `searchableFeatures` as flexible JSON

## Endpoint contract

### 1. Get categories

`GET /api/categories?isActive=true`

Response:

```json
{
  "data": [
    {
      "_id": "car",
      "name": "Car",
      "iconUrl": "https://cdn.example.com/icons/car.svg"
    }
  ]
}
```

Requirements:

- if `isActive=true`, return only active categories
- default sort by `sortOrder ASC, name ASC`

### 2. Get brands by category

`GET /api/brands?category=<categoryId>&isActive=true`

Response:

```json
{
  "data": [
    {
      "_id": "maruti-suzuki",
      "name": "Maruti Suzuki",
      "logoUrl": "https://cdn.example.com/brands/maruti.png"
    }
  ]
}
```

Requirements:

- `category` query param required
- validate that the category exists
- return only brands linked to that category

### 3. Get models by brand

`GET /api/models?brand=<brandId>&isActive=true`

Response:

```json
{
  "data": [
    {
      "_id": "swift",
      "name": "Swift",
      "yearFrom": 2018,
      "yearTo": null
    }
  ]
}
```

Requirements:

- `brand` query param required
- validate that the brand exists

### 4. Get model details

`GET /api/models/:modelId`

Response:

```json
{
  "data": {
    "_id": "swift",
    "name": "Swift",
    "yearFrom": 2018,
    "yearTo": null,
    "variants": [
      {
        "name": "VXI",
        "launchYear": 2018
      },
      {
        "name": "ZXI+",
        "launchYear": 2021
      }
    ]
  }
}
```

Requirements:

- include `variants`
- variants should already be sorted in the response

### 5. Get feature templates by category

`GET /api/feature-templates?category=<categoryId>`

Response:

```json
{
  "data": [
    {
      "sectionTitle": "Engine & Performance",
      "sortOrder": 1,
      "fields": [
        {
          "key": "engine_capacity_cc",
          "label": "Engine Capacity",
          "type": "number",
          "unit": "cc",
          "isRequired": true,
          "isHighlighted": true,
          "helpText": "Enter the engine displacement",
          "validation": {
            "min": 50,
            "max": 8000
          }
        },
        {
          "key": "body_type",
          "label": "Body Type",
          "type": "select",
          "options": ["Hatchback", "Sedan", "SUV", "MUV"]
        }
      ]
    }
  ]
}
```

Requirements:

- `category` query param required
- if no template exists for a category, return empty array
- only return active template

## Endpoints to add for actual admin submission

These are not yet wired in the frontend, but should be implemented now so the frontend can connect to them next.

### 6. Create listing

`POST /api/admin/vehicles`

Use this endpoint when the admin clicks Publish Listing.

Suggested request body:

```json
{
  "title": "2021 Maruti Swift VXI - First Owner",
  "description": "Well maintained car with service history",
  "categoryId": "car",
  "brandId": "maruti-suzuki",
  "modelId": "swift",
  "modelName": "Swift",
  "variant": "VXI",
  "year": 2021,
  "regNumber": "MH02AB1234",
  "price": 550000,
  "currency": "INR",
  "isNegotiable": true,
  "emiAvailable": false,
  "emiStartingFrom": null,
  "emiTenure": null,
  "emiProvider": "",
  "isPriceDropped": false,
  "previousPrice": null,
  "fuelType": "petrol",
  "transmission": "manual",
  "kmsDriven": 32000,
  "ownership": "1st",
  "color": "White",
  "condition": "good",
  "insuranceValid": true,
  "insuranceExpiry": "2027-02-28T00:00:00.000Z",
  "rtoState": "MH",
  "hypothecation": false,
  "locationAddress": "Andheri West",
  "locationCity": "Mumbai",
  "locationState": "Maharashtra",
  "locationPincode": "400058",
  "locationLng": 72.8347,
  "locationLat": 19.1364,
  "images": [
    {
      "url": "https://cdn.example.com/vehicles/1.jpg",
      "thumbnailUrl": "https://cdn.example.com/vehicles/thumbs/1.jpg",
      "isPrimary": true,
      "sortOrder": 0
    }
  ],
  "videoUrl": "",
  "video360Url": "",
  "inspectionReportUrl": "",
  "searchableFeatures": {
    "engine_capacity_cc": 1197,
    "body_type": "Hatchback",
    "airbags": 2,
    "abs": true
  },
  "inspected": true,
  "inspectedBy": "Internal QA",
  "inspectionScore": 88,
  "inspectionDate": "2026-03-15T00:00:00.000Z",
  "rcVerified": true,
  "challanClear": true,
  "buyerSurety": false,
  "sellerType": "individual",
  "listingPlan": "free",
  "tags": ["first-owner", "service-history"],
  "metaTitle": "2021 Maruti Swift VXI used car for sale in Mumbai",
  "metaDescription": "First-owner 2021 Maruti Swift VXI in Mumbai with service history and clean condition."
}
```

Suggested success response:

```json
{
  "data": {
    "_id": "veh_123",
    "status": "pending_review",
    "title": "2021 Maruti Swift VXI - First Owner"
  },
  "message": "Vehicle listing created successfully"
}
```

Backend behavior:

- validate all foreign keys
- derive and store category/brand/model snapshot names
- ensure one and only one primary image
- normalize `tags`
- normalize `regNumber` to uppercase
- set default status to `pending_review`

### 7. Get listing details

`GET /api/admin/vehicles/:id`

Purpose:

- edit screen later
- review dashboard

### 8. Update listing

`PATCH /api/admin/vehicles/:id`

Purpose:

- draft editing
- admin corrections
- moderation workflows

### 9. Image upload endpoint

`POST /api/admin/uploads/images`

Purpose:

- replace current frontend `URL.createObjectURL` temporary behavior

Suggested request:

- multipart form-data
- field name `files`

Suggested response:

```json
{
  "data": [
    {
      "url": "https://cdn.example.com/vehicles/1.jpg",
      "thumbnailUrl": "https://cdn.example.com/vehicles/thumbs/1.jpg",
      "storageKey": "vehicles/1.jpg"
    }
  ]
}
```

Requirements:

- allow JPEG and PNG
- max size 10 MB per image
- max 20 files per listing on the frontend side

### 10. Inspection report upload endpoint

`POST /api/admin/uploads/reports`

Purpose:

- upload PDF or image report instead of storing a blob URL

Suggested response:

```json
{
  "data": {
    "url": "https://cdn.example.com/reports/report-1.pdf",
    "storageKey": "reports/report-1.pdf"
  }
}
```

## Validation rules the backend should enforce

Match the frontend as closely as possible, but backend validation is the source of truth.

### Required validation

- `title`: 10 to 100 chars
- `categoryId`: required
- `brandId`: required
- `modelId`: required
- `year`: required, min 1980, max current year + 1
- `price`: required, min 1000
- `fuelType`: one of `petrol`, `diesel`, `electric`, `cng`, `hybrid`, `lpg`
- `transmission`: one of `manual`, `automatic`, `amt`, `cvt`, `dct`
- `kmsDriven`: required, min 0
- `ownership`: one of `1st`, `2nd`, `3rd`, `4th+`
- `condition`: one of `excellent`, `good`, `fair`, `needs-repair`
- `color`: required
- `rtoState`: required
- `locationCity`: required
- `locationState`: required
- `locationPincode`: exactly 6 digits
- `images`: at least 1 item
- `tags`: max 15

### Cross-field validation

- `brandId` must belong to `categoryId`
- `modelId` must belong to `brandId`
- if `variant` is provided and the chosen model has predefined variants, verify it exists
- if `emiAvailable = false`, clear `emiStartingFrom`, `emiTenure`, `emiProvider`
- if `inspected = false`, `inspectedBy`, `inspectionScore`, and `inspectionDate` may be null/empty
- if `insuranceValid = false`, `insuranceExpiry` may be null

### Media validation

- exactly one primary image after normalization
- sort images by `sortOrder`
- reject duplicate sort orders or normalize them

## Suggested admin auth / authorization

Protect all write endpoints and ideally all catalog mutation endpoints with admin auth.

Recommended:

- `GET` public or admin-only depending on your product rules
- `POST/PATCH/DELETE` admin-only

If you already have auth middleware, reuse it and expose the admin user ID to the listing record as `submittedByAdminId`.

## Recommended implementation order

1. Create schemas/models for category, brand, model, feature template, listing.
2. Seed initial category, brand, model, and variant data.
3. Implement read endpoints:
   - `GET /api/categories`
   - `GET /api/brands`
   - `GET /api/models`
   - `GET /api/models/:modelId`
   - `GET /api/feature-templates`
4. Seed feature templates for at least the categories currently used by admins.
5. Implement upload endpoints for images and reports.
6. Implement `POST /api/admin/vehicles`.
7. Implement `GET /api/admin/vehicles/:id` and `PATCH /api/admin/vehicles/:id`.
8. Add tests for validation, relationship constraints, and response shape.

## Seed data recommendation

To match the frontend mock catalog quickly, seed at least:

- Categories:
  - `car`
  - `bike`
  - `scooter`
  - `ev`
  - `plane`
  - `bus`
  - `bicycle`
  - `truck`
- Brands/models/variants similar to the mock catalog already added in frontend:
  - Maruti Suzuki -> Swift, Baleno
  - Hyundai -> Creta, i20
  - Tata -> Nexon, Altroz
  - Hero -> Splendor Plus, HF Deluxe
  - Bajaj -> Pulsar 150, Platina 110
  - Yamaha -> FZ-S FI, MT-15
  - Honda -> Activa 6G, Dio 125
  - TVS -> Jupiter, NTORQ 125
  - Ather -> 450X, Rizta
  - Ola Electric -> S1 Pro, S1 X

## Feature template examples

### Car category template

Use sections like:

- Engine & Performance
- Body & Dimensions
- Safety
- Comfort & Convenience

Example keys:

- `engine_capacity_cc`
- `power_bhp`
- `torque_nm`
- `body_type`
- `seating_capacity`
- `airbags`
- `abs`
- `sunroof`
- `touchscreen`
- `rear_camera`

### Bike category template

Use sections like:

- Engine & Mileage
- Safety
- Features

Example keys:

- `engine_capacity_cc`
- `mileage_kmpl`
- `fuel_tank_l`
- `abs_type`
- `disc_brake_front`
- `bluetooth`
- `navigation`

### EV category template

Use sections like:

- Battery & Range
- Charging
- Safety

Example keys:

- `battery_capacity_kwh`
- `claimed_range_km`
- `fast_charging`
- `charging_time_hours`
- `top_speed_kmph`

## Recommended error format

Use a stable API error shape:

```json
{
  "message": "Validation failed",
  "errors": {
    "brandId": "Brand does not belong to selected category",
    "images": "At least one image is required"
  }
}
```

## Notes for the backend Codex

- Do not change the response field names expected by the frontend.
- Return `_id` for catalog resources and listings.
- Keep `variants` embedded inside the model details response.
- Keep `feature-templates` response as an array of sections, not as a nested object, because the frontend currently expects an array.
- Make sure query params are supported exactly as used in the frontend:
  - `category`
  - `brand`
  - `isActive`
- Prefer stable slugs/IDs for seeded catalog records.
- If your backend already has a generic media service, reuse it instead of inventing a new storage layer.

## Nice-to-have additions

- admin endpoints for creating/updating categories, brands, models, and feature templates
- slug generation utilities
- searchable admin listing table with filters by status/category/brand/model
- soft delete support for catalog items and listings
- audit log for admin listing changes

## Minimum done criteria

This backend work is complete when:

1. The frontend can fetch categories, brands, models, variants, and feature templates from real APIs.
2. The frontend can upload listing media to the backend instead of using blob URLs.
3. The frontend can submit a listing to `POST /api/admin/vehicles`.
4. The backend validates catalog relationships and required listing fields.
5. The backend stores a real listing record and returns its ID and status.
