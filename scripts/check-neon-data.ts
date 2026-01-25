/**
 * Check data in Neon database before migration
 */

import { config } from "dotenv";
import postgres from "postgres";

config({ path: ".env.local" });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set");
  process.exit(1);
}

const sql = postgres(DATABASE_URL);

async function checkTables() {
  console.log("🔍 Checking Neon database...\n");

  const tables = [
    "admin_users",
    "consultation_submissions",
    "quote_submissions",
    "contact_submissions",
    "dropdown_options",
    "partners",
    "testimonials",
    "site_settings",
    "email_notification_settings",
    "email_logs",
  ];

  for (const table of tables) {
    try {
      const result = await sql.unsafe(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`✅ ${table}: ${result[0].count} rows`);
    } catch (e: any) {
      console.log(`❌ ${table}: ${e.message}`);
    }
  }

  await sql.end();
}

checkTables();
