export const adminVehicleApi = {
  categories: "/api/categories?isActive=true",
  brands: (categoryId: string) => `/api/brands?category=${categoryId}&isActive=true`,
  models: (brandId: string) => `/api/models?brand=${brandId}&isActive=true`,
  modelDetails: (modelId: string) => `/api/models/${modelId}`,
  featureTemplates: (categoryId: string) => `/api/feature-templates?category=${categoryId}`,
  vehicles: "/api/admin/vehicles",
  vehicleById: (vehicleId: string) => `/api/admin/vehicles/${vehicleId}`,
  uploadImages: "/api/admin/uploads/images",
  uploadReports: "/api/admin/uploads/reports",
};
