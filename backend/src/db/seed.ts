import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./index";
import Category from "../models/Category";
import FeatureTemplate from "../models/FeatureTemplate";

dotenv.config();

const categorySeedData = [
  { name: "Car", slug: "car", isActive: true, sortOrder: 1 },
  { name: "Bike", slug: "bike", isActive: true, sortOrder: 2 },
  { name: "Scooter", slug: "scooter", isActive: true, sortOrder: 3 },
  { name: "Electric", slug: "electric", isActive: true, sortOrder: 4 },
  { name: "Truck", slug: "truck", isActive: true, sortOrder: 5 },
  { name: "Tractor", slug: "tractor", isActive: true, sortOrder: 6 },
];

async function seed(): Promise<void> {
  try {
    await connectDB();

    const slugs = categorySeedData.map((item) => item.slug);

    await Category.deleteMany({ slug: { $in: slugs } });
    await FeatureTemplate.deleteMany({});

    const categories = await Category.insertMany(categorySeedData);

    const carCategory = categories.find((category) => category.slug === "car");

    if (!carCategory) {
      throw new Error("Car category not found after seeding categories");
    }

    const templates = await FeatureTemplate.insertMany([
      {
        category: carCategory._id,
        version: 1,
        isActive: true,
        titleTemplate: "{year} {brand} {model} {variant} for sale in {city}",
        cardHighlights: ["fuelType", "transmission", "kmsDriven", "ownership"],
        sections: [
          {
            sectionTitle: "Engine & Performance",
            slug: "engine",
            sortOrder: 1,
            fields: [
              {
                key: "engineDisplacement",
                label: "Engine Displacement",
                type: "number",
                unit: "cc",
                isFilterable: false,
                isHighlighted: false,
              },
              {
                key: "maxPower",
                label: "Max Power",
                type: "string",
                unit: "bhp",
                isFilterable: false,
                isHighlighted: false,
              },
              {
                key: "fuelType",
                label: "Fuel Type",
                type: "select",
                options: ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"],
                isFilterable: true,
                isHighlighted: true,
              },
              {
                key: "transmission",
                label: "Transmission",
                type: "select",
                options: ["Manual", "Automatic", "AMT", "CVT", "DCT"],
                isFilterable: true,
                isHighlighted: true,
              },
              {
                key: "mileage",
                label: "Mileage",
                type: "number",
                unit: "km/l",
                isFilterable: false,
                isHighlighted: true,
              },
            ],
          },
          {
            sectionTitle: "Comfort & Convenience",
            slug: "comfort",
            sortOrder: 2,
            fields: [
              {
                key: "airbags",
                label: "Number of Airbags",
                type: "number",
                isFilterable: false,
                isHighlighted: false,
              },
              {
                key: "sunroof",
                label: "Sunroof",
                type: "boolean",
                isFilterable: true,
                isHighlighted: false,
              },
              {
                key: "cruiseControl",
                label: "Cruise Control",
                type: "boolean",
                isFilterable: false,
                isHighlighted: false,
              },
              {
                key: "androidAuto",
                label: "Android Auto",
                type: "boolean",
                isFilterable: false,
                isHighlighted: false,
              },
            ],
          },
        ],
      },
    ]);

    console.log(
      `Seeded: ${categories.length} categories, ${templates.length} feature template(s)`,
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
