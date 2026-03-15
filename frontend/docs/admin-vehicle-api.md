# Admin Vehicle API Reference

This document is a frontend-facing reference for the admin vehicle flow APIs available in this backend.

Base path:

```txt
/api
```

Response style:

- Most endpoints return wrapped responses in the form `{ "data": ... }`
- Resource IDs are returned as `_id`

## Catalog APIs

These endpoints are used to populate the admin vehicle creation form.

Important for frontend integration:

- The admin vehicle APIs validate `categoryId`, `brandId`, and `modelId` using Mongo `_id` values
- The frontend should always fetch catalog records from these endpoints and submit the selected `_id` values
- Sending only display names such as brand/category/model names without their IDs can cause validation failures

Recommended catalog lookup flow for admin listing:

1. Call `GET /api/categories?isActive=true`
2. After category selection, call `GET /api/brands?category=<categoryId>&isActive=true`
3. After brand selection, call `GET /api/models?brand=<brandId>&isActive=true`
4. Optionally call `GET /api/models/:modelId` to fetch variants/details for the selected model
5. Submit the selected `categoryId`, `brandId`, and `modelId` in `POST /api/admin/vehicles`

### 1. Get categories

`GET /api/categories?isActive=true`

Query params:

- `isActive`: optional, `true` or `false`

Example response:

```json
{
  "data": [
    {
      "_id": "67d3f8d4c5f2281d3ce3b101",
      "name": "Car",
      "slug": "car",
      "iconUrl": "",
      "isActive": true,
      "sortOrder": 1
    }
  ]
}
```

Notes:

- Use this API to populate the category dropdown and store the selected category `_id`
- Sorted by `sortOrder ASC, name ASC`

### 2. Get brands by category

`GET /api/brands?category=<categoryId>&isActive=true`

Query params:

- `category`: required category `_id`
- `isActive`: optional, `true` or `false`

Example response:

```json
{
  "data": [
    {
      "_id": "67d3f93ec5f2281d3ce3b123",
      "name": "Maruti Suzuki",
      "slug": "maruti-suzuki",
      "logoUrl": "",
      "isActive": true,
      "sortOrder": 1
    }
  ]
}
```

Validation error example:

```json
{
  "message": "Validation failed",
  "errors": {
    "category": "category query param is required"
  }
}
```

Notes:

- Use this API to fetch brands with their `_id` values for the selected category
- Submit the selected brand `_id` as `brandId` in the admin vehicle payload

### 3. Get models by brand

`GET /api/models?brand=<brandId>&isActive=true`

Query params:

- `brand`: required brand `_id`
- `isActive`: optional, `true` or `false`

Example response:

```json
{
  "data": [
    {
      "_id": "67d3f97bc5f2281d3ce3b145",
      "name": "Swift",
      "slug": "swift",
      "brandId": "67d3f93ec5f2281d3ce3b123",
      "categoryId": "67d3f8d4c5f2281d3ce3b101",
      "yearFrom": 2018,
      "yearTo": null,
      "isActive": true
    }
  ]
}
```

Notes:

- Use this API to fetch models with their `_id` values for the selected brand
- Submit the selected model `_id` as `modelId` in the admin vehicle payload
- The response includes `brandId` and `categoryId`, which can help the frontend keep selections consistent

### 4. Get model details

`GET /api/models/:modelId`

Example response:

```json
{
  "data": {
    "_id": "67d3f97bc5f2281d3ce3b145",
    "name": "Swift",
    "slug": "swift",
    "yearFrom": 2018,
    "yearTo": null,
    "isActive": true,
    "variants": [
      {
        "name": "VXI",
        "launchYear": 2018,
        "discontinuedYear": null
      },
      {
        "name": "ZXI+",
        "launchYear": 2021,
        "discontinuedYear": null
      }
    ]
  }
}
```

Notes:

- Use this endpoint when the frontend needs model variants or extra model metadata after a model is selected

### 5. Get feature template by category

`GET /api/feature-templates?category=<categoryId>`

Query params:

- `category`: required category `_id`

Example response:

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
          "options": [],
          "isRequired": true,
          "isHighlighted": true,
          "helpText": "Enter the engine displacement",
          "validation": {
            "min": 50,
            "max": 8000
          }
        }
      ]
    }
  ]
}
```

Notes:

- If no active template exists for the category, `data` is an empty array

## Admin Vehicle APIs

These endpoints support create, edit, and fetch flows for admin listings.

### 6. Create vehicle listing

`POST /api/admin/vehicles`

Content type:

```txt
application/json
```

Request body:

```json
{
  "title": "2021 Maruti Swift VXI - First Owner",
  "description": "Well maintained car with service history",
  "categoryId": "67d3f8d4c5f2281d3ce3b101",
  "brandId": "67d3f93ec5f2281d3ce3b123",
  "modelId": "67d3f97bc5f2281d3ce3b145",
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
      "url": "http://localhost:3000/uploads/images/example.jpg",
      "thumbnailUrl": "http://localhost:3000/uploads/images/example.jpg",
      "isPrimary": true,
      "sortOrder": 0,
      "storageKey": "images/example.jpg"
    }
  ],
  "videoUrl": "",
  "video360Url": "",
  "inspectionReportUrl": "",
  "featureSections": [
    {
      "sectionTitle": "Engine & Performance",
      "sortOrder": 1,
      "fields": [
        {
          "label": "Engine Capacity",
          "value": "1197",
          "icon": "",
          "isHighlighted": true
        }
      ]
    }
  ],
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

Success response:

```json
{
  "data": {
    "_id": "67d40a8bc5f2281d3ce3b222",
    "status": "pending_review",
    "title": "2021 Maruti Swift VXI - First Owner"
  },
  "message": "Vehicle listing created successfully"
}
```

Validation error example:

```json
{
  "message": "Validation failed",
  "errors": {
    "brandId": "Brand does not belong to selected category",
    "images": "At least one image is required"
  }
}
```

Backend normalization:

- `regNumber` is uppercased
- exactly one image is marked as primary
- duplicate image sort orders are normalized
- `tags` are trimmed, lowercased, and deduplicated
- `status` defaults to `pending_review`
- if `emiAvailable` is `false`, EMI detail fields are cleared
- if `inspected` is `false`, inspection detail fields are cleared
- if `insuranceValid` is `false`, `insuranceExpiry` is cleared

### 7. Get admin vehicle by id

`GET /api/admin/vehicles/:id`

Success response:

```json
{
  "data": {
    "_id": "67d40a8bc5f2281d3ce3b222",
    "title": "2021 Maruti Swift VXI - First Owner",
    "description": "Well maintained car with service history",
    "categoryId": "67d3f8d4c5f2281d3ce3b101",
    "categoryName": "Car",
    "brandId": "67d3f93ec5f2281d3ce3b123",
    "brandName": "Maruti Suzuki",
    "modelId": "67d3f97bc5f2281d3ce3b145",
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
        "url": "http://localhost:3000/uploads/images/example.jpg",
        "thumbnailUrl": "http://localhost:3000/uploads/images/example.jpg",
        "isPrimary": true,
        "sortOrder": 0,
        "storageKey": "images/example.jpg"
      }
    ],
    "videoUrl": "",
    "video360Url": "",
    "inspectionReportUrl": "",
    "featureSections": [],
    "searchableFeatures": {},
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
    "metaDescription": "First-owner 2021 Maruti Swift VXI in Mumbai with service history and clean condition.",
    "status": "pending_review",
    "submittedByAdminId": null,
    "createdAt": "2026-03-15T12:00:00.000Z",
    "updatedAt": "2026-03-15T12:00:00.000Z"
  }
}
```

### 8. Update admin vehicle

`PATCH /api/admin/vehicles/:id`

Content type:

```txt
application/json
```

Request body:

- Supports the same fields used by `POST /api/admin/vehicles`
- Partial updates are accepted
- The backend merges the payload with the current record and revalidates the final listing state

Success response:

```json
{
  "data": {
    "_id": "67d40a8bc5f2281d3ce3b222",
    "title": "2021 Maruti Swift VXI - Updated",
    "status": "pending_review"
  },
  "message": "Vehicle listing updated successfully"
}
```

Note:

- The actual `data` object returned by update is the full listing payload, not a short summary

## Upload APIs

These endpoints support media upload before creating or updating a listing.

Uploaded files are served from:

```txt
/uploads/<storageKey>
```

### 9. Upload listing images

`POST /api/admin/uploads/images`

Content type:

```txt
multipart/form-data
```

Form fields:

- `files`: one or more files

Constraints:

- allowed types: `image/jpeg`, `image/png`
- max size: `10 MB` per file
- max count: `20` files

Success response:

```json
{
  "data": [
    {
      "url": "http://localhost:3000/uploads/images/1742040000000-uuid.jpg",
      "thumbnailUrl": "http://localhost:3000/uploads/images/1742040000000-uuid.jpg",
      "storageKey": "images/1742040000000-uuid.jpg"
    }
  ]
}
```

Validation error example:

```json
{
  "message": "Validation failed",
  "errors": {
    "files": "Only JPEG and PNG images are allowed"
  }
}
```

### 10. Upload inspection report

`POST /api/admin/uploads/reports`

Content type:

```txt
multipart/form-data
```

Form fields:

- `files`: single file

Constraints:

- allowed types: `application/pdf`, `image/jpeg`, `image/png`

Success response:

```json
{
  "data": {
    "url": "http://localhost:3000/uploads/reports/1742040000000-uuid.pdf",
    "storageKey": "reports/1742040000000-uuid.pdf"
  }
}
```

## Validation Rules

The backend validates these fields when creating or updating a vehicle:

- `title`: required, 10 to 100 characters
- `categoryId`: required valid Mongo ObjectId
- `brandId`: required valid Mongo ObjectId
- `modelId`: required valid Mongo ObjectId
- `year`: required, min `1980`, max `current year + 1`
- `price`: required, min `1000`
- `fuelType`: one of `petrol`, `diesel`, `electric`, `cng`, `hybrid`, `lpg`
- `transmission`: one of `manual`, `automatic`, `amt`, `cvt`, `dct`
- `kmsDriven`: required, min `0`
- `ownership`: one of `1st`, `2nd`, `3rd`, `4th+`
- `condition`: one of `excellent`, `good`, `fair`, `needs-repair`
- `color`: required
- `rtoState`: required
- `locationCity`: required
- `locationState`: required
- `locationPincode`: exactly 6 digits
- `images`: at least 1 image
- `tags`: max 15

Cross-field validation:

- `brandId` must belong to `categoryId`
- `modelId` must belong to `brandId`
- `modelId` must belong to `categoryId`
- if `variant` is provided and the model has variants, it must match one of them

## Current Auth Behavior

At the moment, these admin APIs are mounted without auth middleware in the backend.

That means the frontend can call them directly right now, but if admin auth is added later, the most likely pattern will be:

```txt
Authorization: Bearer <access-token>
```

## Suggested Frontend Call Order

1. Call `GET /api/categories?isActive=true`
2. After category selection, call `GET /api/brands?category=<categoryId>&isActive=true`
3. After brand selection, call `GET /api/models?brand=<brandId>&isActive=true`
4. After model selection, call `GET /api/models/:modelId`
5. After category selection, call `GET /api/feature-templates?category=<categoryId>`
6. Upload media using the upload endpoints
7. Submit the final payload to `POST /api/admin/vehicles`
8. Use `GET /api/admin/vehicles/:id` or `PATCH /api/admin/vehicles/:id` for edit flows
