import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDb } from "../config/db.config";
import Brand from "../models/Brand";
import Category from "../models/Category";
import FeatureTemplate from "../models/FeatureTemplate";
import VehicleModel from "../models/VehicleModel";

dotenv.config();

const categorySeedData = [
  { name: "Car", slug: "car", isActive: true, sortOrder: 1 },
  { name: "Bike", slug: "bike", isActive: true, sortOrder: 2 },
  { name: "Scooter", slug: "scooter", isActive: true, sortOrder: 3 },
  { name: "EV", slug: "ev", isActive: true, sortOrder: 4 },
  { name: "Plane", slug: "plane", isActive: true, sortOrder: 5 },
  { name: "Bus", slug: "bus", isActive: true, sortOrder: 6 },
  { name: "Bicycle", slug: "bicycle", isActive: true, sortOrder: 7 },
  { name: "Truck", slug: "truck", isActive: true, sortOrder: 8 },
];

const brandSeedData = [
  {
    name: "Maruti Suzuki",
    slug: "maruti-suzuki",
    categorySlug: "car",
    sortOrder: 1,
    models: [
      {
        name: "Swift",
        slug: "swift",
        yearFrom: 2018,
        variants: [
          { name: "LXI", launchYear: 2018 },
          { name: "VXI", launchYear: 2018 },
          { name: "ZXI+", launchYear: 2021 },
        ],
      },
      {
        name: "Baleno",
        slug: "baleno",
        yearFrom: 2022,
        variants: [
          { name: "Sigma", launchYear: 2022 },
          { name: "Delta", launchYear: 2022 },
          { name: "Alpha", launchYear: 2022 },
        ],
      },
    ],
  },
  {
    name: "Hyundai",
    slug: "hyundai",
    categorySlug: "car",
    sortOrder: 2,
    models: [
      {
        name: "Creta",
        slug: "creta",
        yearFrom: 2020,
        variants: [
          { name: "E", launchYear: 2020 },
          { name: "S", launchYear: 2020 },
          { name: "SX(O)", launchYear: 2020 },
        ],
      },
      {
        name: "i20",
        slug: "i20",
        yearFrom: 2020,
        variants: [
          { name: "Magna", launchYear: 2020 },
          { name: "Sportz", launchYear: 2020 },
          { name: "Asta", launchYear: 2020 },
        ],
      },
    ],
  },
  {
    name: "Tata",
    slug: "tata",
    categorySlug: "car",
    sortOrder: 3,
    models: [
      {
        name: "Nexon",
        slug: "nexon",
        yearFrom: 2023,
        variants: [
          { name: "Smart", launchYear: 2023 },
          { name: "Pure", launchYear: 2023 },
          { name: "Fearless", launchYear: 2023 },
        ],
      },
      {
        name: "Altroz",
        slug: "altroz",
        yearFrom: 2020,
        variants: [
          { name: "XE", launchYear: 2020 },
          { name: "XM+", launchYear: 2020 },
          { name: "XZ+", launchYear: 2020 },
        ],
      },
    ],
  },
  {
    name: "Hero",
    slug: "hero",
    categorySlug: "bike",
    sortOrder: 1,
    models: [
      {
        name: "Splendor Plus",
        slug: "splendor-plus",
        yearFrom: 2019,
        variants: [
          { name: "Drum Brake", launchYear: 2019 },
          { name: "i3S", launchYear: 2020 },
        ],
      },
      {
        name: "HF Deluxe",
        slug: "hf-deluxe",
        yearFrom: 2020,
        variants: [
          { name: "Kick Start", launchYear: 2020 },
          { name: "Self Start", launchYear: 2020 },
        ],
      },
    ],
  },
  {
    name: "Bajaj",
    slug: "bajaj",
    categorySlug: "bike",
    sortOrder: 2,
    models: [
      {
        name: "Pulsar 150",
        slug: "pulsar-150",
        yearFrom: 2021,
        variants: [
          { name: "Single Disc", launchYear: 2021 },
          { name: "Twin Disc", launchYear: 2021 },
        ],
      },
      {
        name: "Platina 110",
        slug: "platina-110",
        yearFrom: 2022,
        variants: [
          { name: "Drum", launchYear: 2022 },
          { name: "ABS", launchYear: 2022 },
        ],
      },
    ],
  },
  {
    name: "Yamaha",
    slug: "yamaha",
    categorySlug: "bike",
    sortOrder: 3,
    models: [
      {
        name: "FZ-S FI",
        slug: "fz-s-fi",
        yearFrom: 2023,
        variants: [
          { name: "Standard", launchYear: 2023 },
          { name: "Deluxe", launchYear: 2023 },
        ],
      },
      {
        name: "MT-15",
        slug: "mt-15",
        yearFrom: 2024,
        variants: [
          { name: "Metallic Black", launchYear: 2024 },
          { name: "Deluxe", launchYear: 2024 },
        ],
      },
    ],
  },
  {
    name: "Honda",
    slug: "honda",
    categorySlug: "scooter",
    sortOrder: 1,
    models: [
      {
        name: "Activa 6G",
        slug: "activa-6g",
        yearFrom: 2023,
        variants: [
          { name: "Standard", launchYear: 2023 },
          { name: "DLX", launchYear: 2023 },
        ],
      },
      {
        name: "Dio 125",
        slug: "dio-125",
        yearFrom: 2023,
        variants: [
          { name: "STD", launchYear: 2023 },
          { name: "H-Smart", launchYear: 2023 },
        ],
      },
    ],
  },
  {
    name: "TVS",
    slug: "tvs",
    categorySlug: "scooter",
    sortOrder: 2,
    models: [
      {
        name: "Jupiter",
        slug: "jupiter",
        yearFrom: 2024,
        variants: [
          { name: "Drum", launchYear: 2024 },
          { name: "ZX", launchYear: 2024 },
        ],
      },
      {
        name: "NTORQ 125",
        slug: "ntorq-125",
        yearFrom: 2024,
        variants: [
          { name: "Race Edition", launchYear: 2024 },
          { name: "Super Squad", launchYear: 2024 },
        ],
      },
    ],
  },
  {
    name: "Ather",
    slug: "ather",
    categorySlug: "ev",
    sortOrder: 1,
    models: [
      {
        name: "450X",
        slug: "450x",
        yearFrom: 2024,
        variants: [
          { name: "2.9 kWh", launchYear: 2024 },
          { name: "3.7 kWh", launchYear: 2024 },
        ],
      },
      {
        name: "Rizta",
        slug: "rizta",
        yearFrom: 2024,
        variants: [
          { name: "S", launchYear: 2024 },
          { name: "Z", launchYear: 2024 },
        ],
      },
    ],
  },
  {
    name: "Ola Electric",
    slug: "ola-electric",
    categorySlug: "ev",
    sortOrder: 2,
    models: [
      {
        name: "S1 Pro",
        slug: "s1-pro",
        yearFrom: 2024,
        variants: [
          { name: "3 kWh", launchYear: 2024 },
          { name: "4 kWh", launchYear: 2024 },
        ],
      },
      {
        name: "S1 X",
        slug: "s1-x",
        yearFrom: 2024,
        variants: [
          { name: "2 kWh", launchYear: 2024 },
          { name: "3 kWh", launchYear: 2024 },
        ],
      },
    ],
  },
];

const featureTemplateDefinitions = {
  car: {
    version: 1,
    isActive: true,
    titleTemplate: "{year} {brand} {model} {variant} for sale in {city}",
    cardHighlights: ["fuelType", "transmission", "kmsDriven", "ownership"],
    sections: [
      {
        sectionTitle: "Engine & Performance",
        slug: "engine-performance",
        sortOrder: 1,
        fields: [
          {
            key: "engine_capacity_cc",
            label: "Engine Capacity",
            type: "number",
            unit: "cc",
            isRequired: true,
            isHighlighted: true,
            validation: { min: 50, max: 8000 },
          },
          {
            key: "power_bhp",
            label: "Power",
            type: "number",
            unit: "bhp",
          },
          {
            key: "torque_nm",
            label: "Torque",
            type: "number",
            unit: "Nm",
          },
        ],
      },
      {
        sectionTitle: "Body & Dimensions",
        slug: "body-dimensions",
        sortOrder: 2,
        fields: [
          {
            key: "body_type",
            label: "Body Type",
            type: "select",
            options: ["Hatchback", "Sedan", "SUV", "MUV"],
          },
          {
            key: "seating_capacity",
            label: "Seating Capacity",
            type: "number",
          },
        ],
      },
      {
        sectionTitle: "Safety",
        slug: "safety",
        sortOrder: 3,
        fields: [
          {
            key: "airbags",
            label: "Airbags",
            type: "number",
          },
          {
            key: "abs",
            label: "ABS",
            type: "boolean",
          },
          {
            key: "rear_camera",
            label: "Rear Camera",
            type: "boolean",
          },
        ],
      },
      {
        sectionTitle: "Comfort & Convenience",
        slug: "comfort-convenience",
        sortOrder: 4,
        fields: [
          {
            key: "sunroof",
            label: "Sunroof",
            type: "boolean",
          },
          {
            key: "touchscreen",
            label: "Touchscreen",
            type: "boolean",
          },
        ],
      },
    ],
  },
  bike: {
    version: 1,
    isActive: true,
    titleTemplate: "{year} {brand} {model} {variant} bike for sale in {city}",
    cardHighlights: ["mileage_kmpl", "engine_capacity_cc", "ownership"],
    sections: [
      {
        sectionTitle: "Engine & Mileage",
        slug: "engine-mileage",
        sortOrder: 1,
        fields: [
          {
            key: "engine_capacity_cc",
            label: "Engine Capacity",
            type: "number",
            unit: "cc",
          },
          {
            key: "mileage_kmpl",
            label: "Mileage",
            type: "number",
            unit: "kmpl",
          },
          {
            key: "fuel_tank_l",
            label: "Fuel Tank Capacity",
            type: "number",
            unit: "L",
          },
        ],
      },
      {
        sectionTitle: "Safety",
        slug: "bike-safety",
        sortOrder: 2,
        fields: [
          {
            key: "abs_type",
            label: "ABS Type",
            type: "select",
            options: ["Single Channel", "Dual Channel", "None"],
          },
          {
            key: "disc_brake_front",
            label: "Front Disc Brake",
            type: "boolean",
          },
        ],
      },
      {
        sectionTitle: "Features",
        slug: "bike-features",
        sortOrder: 3,
        fields: [
          {
            key: "bluetooth",
            label: "Bluetooth",
            type: "boolean",
          },
          {
            key: "navigation",
            label: "Navigation",
            type: "boolean",
          },
        ],
      },
    ],
  },
  ev: {
    version: 1,
    isActive: true,
    titleTemplate: "{year} {brand} {model} {variant} EV for sale in {city}",
    cardHighlights: ["battery_capacity_kwh", "range_km", "ownership"],
    sections: [
      {
        sectionTitle: "Battery & Range",
        slug: "battery-range",
        sortOrder: 1,
        fields: [
          {
            key: "battery_capacity_kwh",
            label: "Battery Capacity",
            type: "number",
            unit: "kWh",
          },
          {
            key: "range_km",
            label: "Range",
            type: "number",
            unit: "km",
          },
        ],
      },
      {
        sectionTitle: "Charging",
        slug: "charging",
        sortOrder: 2,
        fields: [
          {
            key: "charging_time_hr",
            label: "Charging Time",
            type: "number",
            unit: "hr",
          },
          {
            key: "fast_charging",
            label: "Fast Charging",
            type: "boolean",
          },
        ],
      },
      {
        sectionTitle: "Safety",
        slug: "ev-safety",
        sortOrder: 3,
        fields: [
          {
            key: "traction_control",
            label: "Traction Control",
            type: "boolean",
          },
          {
            key: "regenerative_braking",
            label: "Regenerative Braking",
            type: "boolean",
          },
        ],
      },
    ],
  },
} as const;

async function seed(): Promise<void> {
  try {
    await connectDb();

    const categoryMap = new Map<string, any>();
    for (const categoryData of categorySeedData) {
      const category = await Category.findOneAndUpdate(
        { slug: categoryData.slug },
        { $set: categoryData },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );
      categoryMap.set(categoryData.slug, category);
    }

    let brandCount = 0;
    let modelCount = 0;

    for (const brandData of brandSeedData) {
      const category = categoryMap.get(brandData.categorySlug);

      if (!category) {
        throw new Error(`Missing seeded category for slug ${brandData.categorySlug}`);
      }

      const brand = await Brand.findOneAndUpdate(
        { slug: brandData.slug },
        {
          $set: {
            name: brandData.name,
            slug: brandData.slug,
            sortOrder: brandData.sortOrder,
            isActive: true,
          },
          $addToSet: {
            categories: category._id,
          },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );
      brandCount += 1;

      for (const modelData of brandData.models) {
        await VehicleModel.findOneAndUpdate(
          { slug: modelData.slug },
          {
            $set: {
              brand: brand._id,
              category: category._id,
              name: modelData.name,
              slug: modelData.slug,
              variants: modelData.variants,
              generationYears: {
                from: modelData.yearFrom,
                to: null,
              },
              isActive: true,
            },
          },
          { new: true, upsert: true, setDefaultsOnInsert: true },
        );
        modelCount += 1;
      }
    }

    for (const [categorySlug, templateData] of Object.entries(featureTemplateDefinitions)) {
      const category = categoryMap.get(categorySlug);
      if (!category) {
        continue;
      }

      await FeatureTemplate.findOneAndUpdate(
        { category: category._id },
        {
          $set: {
            ...templateData,
            category: category._id,
          },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );
    }

    console.log(
      `Seeded/updated ${categoryMap.size} categories, ${brandCount} brands, ${modelCount} models, and ${Object.keys(featureTemplateDefinitions).length} feature templates`,
    );

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

void seed();
