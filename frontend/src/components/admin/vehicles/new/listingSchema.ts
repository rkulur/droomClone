// Project router: <Routes> JSX in src/App.tsx
// Admin route: <Route path="/admin" element={canAccessAdmin ? <AdminPage /> : <Navigate to="/" replace />} />
// Admin component: src/components/admin/index.tsx

import { z } from "zod";

export const step1Schema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(100),
  categoryId: z.string().min(1, "Select a category"),
  brandId: z.string().min(1, "Select a brand"),
  modelId: z.string().min(1, "Select a model"),
  variant: z.string().optional(),
  year: z
    .number({ error: "Enter a year" })
    .min(1980)
    .max(new Date().getFullYear() + 1),
  regNumber: z.string().optional(),
  description: z
    .string()
    .min(30, "Write at least 30 characters")
    .max(2000)
    .optional(),
});

export const step2Schema = z.object({
  price: z
    .number({ error: "Enter a price" })
    .min(1000, "Minimum price is ₹1,000"),
  isNegotiable: z.boolean(),
  fuelType: z.enum(["petrol", "diesel", "electric", "cng", "hybrid", "lpg"], {
    error: "Select fuel type",
  }),
  transmission: z.enum(["manual", "automatic", "amt", "cvt", "dct"], {
    error: "Select transmission",
  }),
  kmsDriven: z.number().min(0),
  ownership: z.enum(["1st", "2nd", "3rd", "4th+"], {
    error: "Select ownership",
  }),
  condition: z.enum(["excellent", "good", "fair", "needs-repair"], {
    error: "Select condition",
  }),
  color: z.string().min(1, "Enter a color"),
  rtoState: z.string().min(2, "Select registered state"),
});

export const step3Schema = z.object({
  locationCity: z.string().min(2, "City is required"),
  locationState: z.string().min(2, "State is required"),
  locationPincode: z
    .string()
    .regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
});

export const step4Schema = z.object({
  images: z.array(z.object({ url: z.string() })).min(1, "Upload at least one photo"),
});

export const step5Schema = z.object({
  featureSections: z.array(z.any()).optional(),
  tags: z.array(z.string()).max(15).optional(),
});

export const fullListingSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
  ...step4Schema.shape,
  ...step5Schema.shape,
});

export type FullListingData = z.infer<typeof fullListingSchema>;
