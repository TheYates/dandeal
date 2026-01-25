/**
 * Initialize Convex with default data
 * 
 * Usage: bunx tsx scripts/init-convex-data.ts
 */

import { config } from "dotenv";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import bcrypt from "bcryptjs";

// Load environment variables
config({ path: ".env.local" });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error("❌ NEXT_PUBLIC_CONVEX_URL is not set in .env.local");
  process.exit(1);
}

const convex = new ConvexHttpClient(CONVEX_URL);

async function initDropdownOptions() {
  console.log("📦 Initializing dropdown options...");
  
  const dropdowns = [
    // Services
    { type: "services" as const, label: "Shipping", value: "shipping" },
    { type: "services" as const, label: "Logistics", value: "logistics" },
    { type: "services" as const, label: "Import", value: "import" },
    { type: "services" as const, label: "Export", value: "export" },
    { type: "services" as const, label: "International Procurement", value: "international_procurement" },
    { type: "services" as const, label: "Customs Clearance", value: "customs_clearance" },
    { type: "services" as const, label: "Warehousing", value: "warehousing" },
    
    // Shipping Methods
    { type: "shipping_methods" as const, label: "Land Transport", value: "land_transport" },
    { type: "shipping_methods" as const, label: "Air Freight", value: "air_freight" },
    { type: "shipping_methods" as const, label: "Sea Freight", value: "sea_freight" },
    { type: "shipping_methods" as const, label: "Multimodal", value: "multimodal" },
    { type: "shipping_methods" as const, label: "Rail Transport", value: "rail_transport" },
    
    // Cargo Types
    { type: "cargo_types" as const, label: "General Cargo", value: "general_cargo" },
    { type: "cargo_types" as const, label: "Vehicles", value: "vehicles" },
    { type: "cargo_types" as const, label: "Electronics", value: "electronics" },
    { type: "cargo_types" as const, label: "Machinery", value: "machinery" },
    { type: "cargo_types" as const, label: "Perishables", value: "perishables" },
    { type: "cargo_types" as const, label: "Hazardous Materials", value: "hazardous" },
  ];

  for (const dropdown of dropdowns) {
    try {
      await convex.mutation(api.dropdownOptions.create, dropdown);
    } catch (error) {
      // Ignore duplicates
    }
  }
  
  console.log(`   ✅ Created ${dropdowns.length} dropdown options`);
}

async function initSiteSettings() {
  console.log("📦 Initializing site settings...");
  
  try {
    await convex.mutation(api.siteSettings.init, {});
    console.log("   ✅ Site settings initialized");
  } catch (error) {
    console.log("   ℹ️  Site settings already exist");
  }
}

async function initEmailSettings() {
  console.log("📦 Initializing email notification settings...");
  
  try {
    const result = await convex.mutation(api.emailSettings.init, {});
    console.log(`   ✅ Email settings initialized for ${result.length} form types`);
  } catch (error) {
    console.log("   ℹ️  Email settings already exist");
  }
}

async function createAdminUser() {
  console.log("📦 Creating default admin user...");
  
  // Default admin credentials - CHANGE THESE!
  const adminEmail = "admin@dandeal.com";
  const adminPassword = "admin123"; // Change this immediately after first login!
  const adminName = "Admin User";
  
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await convex.mutation(api.adminUsers.create, {
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: "super_admin",
    });
    
    console.log(`   ✅ Admin user created:`);
    console.log(`      Email: ${adminEmail}`);
    console.log(`      Password: ${adminPassword}`);
    console.log(`      ⚠️  CHANGE THIS PASSWORD IMMEDIATELY!`);
  } catch (error: any) {
    if (error.message?.includes("already exists")) {
      console.log("   ℹ️  Admin user already exists");
    } else {
      throw error;
    }
  }
}

async function main() {
  console.log("🚀 Initializing Convex with default data...\n");
  
  try {
    await initDropdownOptions();
    await initSiteSettings();
    await initEmailSettings();
    await createAdminUser();
    
    console.log("\n✅ Initialization completed successfully!");
    console.log("\nYou can now:");
    console.log("1. Run `bun dev` to start the development server");
    console.log("2. Log in with the admin credentials above");
    console.log("3. Change the admin password immediately!");
  } catch (error) {
    console.error("\n❌ Initialization failed:", error);
    process.exit(1);
  }
}

main();
