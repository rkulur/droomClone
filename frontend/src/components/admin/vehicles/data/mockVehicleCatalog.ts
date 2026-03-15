export type MockCategory = {
  id: string;
  name: string;
  iconUrl?: string;
};

export type MockBrand = {
  id: string;
  categoryId: string;
  name: string;
  logoUrl?: string;
};

export type MockVariant = {
  name: string;
  launchYear?: number;
};

export type MockModel = {
  id: string;
  brandId: string;
  name: string;
  yearFrom?: number;
  yearTo?: number | null;
  variants: MockVariant[];
};

export const mockVehicleCategories: MockCategory[] = [
  { id: "car", name: "Car" },
  { id: "bike", name: "Bike" },
  { id: "scooter", name: "Scooter" },
  { id: "ev", name: "EV" },
  { id: "plane", name: "Plane" },
  { id: "bus", name: "Bus" },
  { id: "bicycle", name: "Bicycle" },
  { id: "truck", name: "Truck" },
];

export const mockVehicleBrands: MockBrand[] = [
  { id: "maruti-suzuki", categoryId: "car", name: "Maruti Suzuki" },
  { id: "hyundai", categoryId: "car", name: "Hyundai" },
  { id: "tata", categoryId: "car", name: "Tata" },
  { id: "hero", categoryId: "bike", name: "Hero" },
  { id: "bajaj", categoryId: "bike", name: "Bajaj" },
  { id: "yamaha", categoryId: "bike", name: "Yamaha" },
  { id: "honda-scooter", categoryId: "scooter", name: "Honda" },
  { id: "tvs-scooter", categoryId: "scooter", name: "TVS" },
  { id: "ather", categoryId: "ev", name: "Ather" },
  { id: "ola-electric", categoryId: "ev", name: "Ola Electric" },
  { id: "boeing", categoryId: "plane", name: "Boeing" },
  { id: "airbus", categoryId: "plane", name: "Airbus" },
  { id: "tata-bus", categoryId: "bus", name: "Tata Motors" },
  { id: "ashok-leyland", categoryId: "bus", name: "Ashok Leyland" },
  { id: "hero-cycle", categoryId: "bicycle", name: "Hero Cycles" },
  { id: "firefox", categoryId: "bicycle", name: "Firefox" },
  { id: "eicher", categoryId: "truck", name: "Eicher" },
  { id: "bharatbenz", categoryId: "truck", name: "BharatBenz" },
];

export const mockVehicleModels: MockModel[] = [
  {
    id: "swift",
    brandId: "maruti-suzuki",
    name: "Swift",
    yearFrom: 2018,
    yearTo: null,
    variants: [
      { name: "LXI", launchYear: 2018 },
      { name: "VXI", launchYear: 2018 },
      { name: "ZXI+", launchYear: 2021 },
    ],
  },
  {
    id: "baleno",
    brandId: "maruti-suzuki",
    name: "Baleno",
    yearFrom: 2022,
    yearTo: null,
    variants: [
      { name: "Sigma", launchYear: 2022 },
      { name: "Delta", launchYear: 2022 },
      { name: "Alpha", launchYear: 2022 },
    ],
  },
  {
    id: "creta",
    brandId: "hyundai",
    name: "Creta",
    yearFrom: 2020,
    yearTo: null,
    variants: [
      { name: "EX", launchYear: 2020 },
      { name: "S(O)", launchYear: 2022 },
      { name: "SX(O)", launchYear: 2024 },
    ],
  },
  {
    id: "i20",
    brandId: "hyundai",
    name: "i20",
    yearFrom: 2020,
    yearTo: null,
    variants: [
      { name: "Magna", launchYear: 2020 },
      { name: "Sportz", launchYear: 2020 },
      { name: "Asta", launchYear: 2021 },
    ],
  },
  {
    id: "nexon",
    brandId: "tata",
    name: "Nexon",
    yearFrom: 2020,
    yearTo: null,
    variants: [
      { name: "Smart", launchYear: 2023 },
      { name: "Pure", launchYear: 2023 },
      { name: "Creative+", launchYear: 2024 },
    ],
  },
  {
    id: "altroz",
    brandId: "tata",
    name: "Altroz",
    yearFrom: 2020,
    yearTo: null,
    variants: [
      { name: "XE", launchYear: 2020 },
      { name: "XM+", launchYear: 2021 },
      { name: "XZ", launchYear: 2022 },
    ],
  },
  {
    id: "splendor-plus",
    brandId: "hero",
    name: "Splendor Plus",
    yearFrom: 2019,
    yearTo: null,
    variants: [
      { name: "Drum Brake", launchYear: 2019 },
      { name: "i3S", launchYear: 2021 },
      { name: "XTEC", launchYear: 2022 },
    ],
  },
  {
    id: "hf-deluxe",
    brandId: "hero",
    name: "HF Deluxe",
    yearFrom: 2020,
    yearTo: null,
    variants: [
      { name: "Kick Start", launchYear: 2020 },
      { name: "Self Start", launchYear: 2021 },
    ],
  },
  {
    id: "pulsar-150",
    brandId: "bajaj",
    name: "Pulsar 150",
    yearFrom: 2018,
    yearTo: null,
    variants: [
      { name: "Single Disc", launchYear: 2018 },
      { name: "Twin Disc", launchYear: 2019 },
    ],
  },
  {
    id: "platina-110",
    brandId: "bajaj",
    name: "Platina 110",
    yearFrom: 2020,
    yearTo: null,
    variants: [
      { name: "Drum", launchYear: 2020 },
      { name: "ABS", launchYear: 2022 },
    ],
  },
  {
    id: "fz-s",
    brandId: "yamaha",
    name: "FZ-S FI",
    yearFrom: 2021,
    yearTo: null,
    variants: [
      { name: "Standard", launchYear: 2021 },
      { name: "Deluxe", launchYear: 2023 },
    ],
  },
  {
    id: "mt-15",
    brandId: "yamaha",
    name: "MT-15",
    yearFrom: 2019,
    yearTo: null,
    variants: [
      { name: "Standard", launchYear: 2019 },
      { name: "V2 Deluxe", launchYear: 2022 },
    ],
  },
  {
    id: "activa-6g",
    brandId: "honda-scooter",
    name: "Activa 6G",
    yearFrom: 2020,
    yearTo: null,
    variants: [
      { name: "Standard", launchYear: 2020 },
      { name: "Deluxe", launchYear: 2021 },
    ],
  },
  {
    id: "dio-125",
    brandId: "honda-scooter",
    name: "Dio 125",
    yearFrom: 2023,
    yearTo: null,
    variants: [
      { name: "Standard", launchYear: 2023 },
      { name: "Smart", launchYear: 2023 },
    ],
  },
  {
    id: "jupiter",
    brandId: "tvs-scooter",
    name: "Jupiter",
    yearFrom: 2021,
    yearTo: null,
    variants: [
      { name: "Drum", launchYear: 2021 },
      { name: "ZX Disc", launchYear: 2022 },
    ],
  },
  {
    id: "ntorq-125",
    brandId: "tvs-scooter",
    name: "NTORQ 125",
    yearFrom: 2020,
    yearTo: null,
    variants: [
      { name: "Race Edition", launchYear: 2020 },
      { name: "XT", launchYear: 2022 },
    ],
  },
  {
    id: "450x",
    brandId: "ather",
    name: "450X",
    yearFrom: 2020,
    yearTo: null,
    variants: [
      { name: "2.9 kWh", launchYear: 2023 },
      { name: "3.7 kWh", launchYear: 2024 },
    ],
  },
  {
    id: "rizta",
    brandId: "ather",
    name: "Rizta",
    yearFrom: 2024,
    yearTo: null,
    variants: [
      { name: "S", launchYear: 2024 },
      { name: "Z", launchYear: 2024 },
    ],
  },
  {
    id: "s1-pro",
    brandId: "ola-electric",
    name: "S1 Pro",
    yearFrom: 2022,
    yearTo: null,
    variants: [
      { name: "3 kWh", launchYear: 2022 },
      { name: "4 kWh", launchYear: 2024 },
    ],
  },
  {
    id: "s1-x",
    brandId: "ola-electric",
    name: "S1 X",
    yearFrom: 2023,
    yearTo: null,
    variants: [
      { name: "2 kWh", launchYear: 2023 },
      { name: "3 kWh+", launchYear: 2024 },
    ],
  },
  {
    id: "737-max",
    brandId: "boeing",
    name: "737 MAX",
    yearFrom: 2017,
    yearTo: null,
    variants: [
      { name: "8", launchYear: 2017 },
      { name: "9", launchYear: 2018 },
    ],
  },
  {
    id: "787-dreamliner",
    brandId: "boeing",
    name: "787 Dreamliner",
    yearFrom: 2011,
    yearTo: null,
    variants: [
      { name: "-8", launchYear: 2011 },
      { name: "-9", launchYear: 2014 },
    ],
  },
  {
    id: "a320neo",
    brandId: "airbus",
    name: "A320neo",
    yearFrom: 2016,
    yearTo: null,
    variants: [
      { name: "Passenger", launchYear: 2016 },
      { name: "Corporate Jet", launchYear: 2018 },
    ],
  },
  {
    id: "a350",
    brandId: "airbus",
    name: "A350",
    yearFrom: 2015,
    yearTo: null,
    variants: [
      { name: "-900", launchYear: 2015 },
      { name: "-1000", launchYear: 2018 },
    ],
  },
  {
    id: "starbus",
    brandId: "tata-bus",
    name: "Starbus",
    yearFrom: 2020,
    yearTo: null,
    variants: [
      { name: "City", launchYear: 2020 },
      { name: "School", launchYear: 2021 },
    ],
  },
  {
    id: "staff-bus",
    brandId: "ashok-leyland",
    name: "Staff Bus",
    yearFrom: 2019,
    yearTo: null,
    variants: [
      { name: "Standard", launchYear: 2019 },
      { name: "XL", launchYear: 2022 },
    ],
  },
  {
    id: "hero-sprint",
    brandId: "hero-cycle",
    name: "Sprint",
    yearFrom: 2021,
    yearTo: null,
    variants: [
      { name: "26T", launchYear: 2021 },
      { name: "29T", launchYear: 2022 },
    ],
  },
  {
    id: "firefox-bad-attitude",
    brandId: "firefox",
    name: "Bad Attitude",
    yearFrom: 2022,
    yearTo: null,
    variants: [
      { name: "27.5", launchYear: 2022 },
      { name: "29", launchYear: 2023 },
    ],
  },
  {
    id: "pro-2049",
    brandId: "eicher",
    name: "Pro 2049",
    yearFrom: 2021,
    yearTo: null,
    variants: [
      { name: "CBC", launchYear: 2021 },
      { name: "Cab", launchYear: 2022 },
    ],
  },
  {
    id: "bharatbenz-2823r",
    brandId: "bharatbenz",
    name: "2823R",
    yearFrom: 2020,
    yearTo: null,
    variants: [
      { name: "6x4", launchYear: 2020 },
      { name: "Rock Body", launchYear: 2021 },
    ],
  },
];

export const getMockBrandsByCategory = (categoryId: string) =>
  mockVehicleBrands.filter((brand) => brand.categoryId === categoryId);

export const getMockModelsByBrand = (brandId: string) =>
  mockVehicleModels.filter((model) => model.brandId === brandId);

export const getMockModelById = (modelId: string) =>
  mockVehicleModels.find((model) => model.id === modelId);
