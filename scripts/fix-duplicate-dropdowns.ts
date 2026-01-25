/**
 * Find and remove duplicate dropdown options in Convex
 */

import { config } from "dotenv";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

config({ path: ".env.local" });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error("❌ NEXT_PUBLIC_CONVEX_URL is not set");
  process.exit(1);
}

const convex = new ConvexHttpClient(CONVEX_URL);

async function findAndFixDuplicates() {
  console.log("🔍 Checking for duplicate dropdown options...\n");

  // Get all dropdown options
  const options = await convex.query(api.dropdownOptions.list, {});
  
  // Group by type and value
  const seen = new Map<string, any[]>();
  
  for (const option of options) {
    const key = `${option.type}:${option.value}`;
    if (!seen.has(key)) {
      seen.set(key, []);
    }
    seen.get(key)!.push(option);
  }

  // Find duplicates
  const duplicates: any[] = [];
  for (const [key, items] of seen) {
    if (items.length > 1) {
      console.log(`⚠️  Duplicate found: ${key}`);
      // Keep the first one, mark rest as duplicates
      for (let i = 1; i < items.length; i++) {
        duplicates.push(items[i]);
      }
    }
  }

  if (duplicates.length === 0) {
    console.log("✅ No duplicates found!");
    return;
  }

  console.log(`\n📦 Removing ${duplicates.length} duplicate(s)...`);

  for (const dup of duplicates) {
    try {
      await convex.mutation(api.dropdownOptions.remove, { id: dup._id });
      console.log(`   Removed: ${dup.type} - ${dup.label}`);
    } catch (error) {
      console.error(`   Error removing ${dup._id}:`, error);
    }
  }

  console.log("\n✅ Duplicates removed!");
}

findAndFixDuplicates();
