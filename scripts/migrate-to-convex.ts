/**
 * Migration Script: Neon PostgreSQL (Drizzle) -> Convex
 * 
 * This script exports data from your existing Neon database and imports it into Convex.
 * 
 * Usage:
 *   1. Make sure your .env.local has DATABASE_URL (Neon) and CONVEX_URL set
 *   2. Run: bunx tsx scripts/migrate-to-convex.ts
 */

import { config } from "dotenv";
import postgres from "postgres";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

// Load environment variables
config({ path: ".env.local" });

const DATABASE_URL = process.env.DATABASE_URL;
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set in .env.local");
  process.exit(1);
}

if (!CONVEX_URL) {
  console.error("❌ NEXT_PUBLIC_CONVEX_URL is not set in .env.local");
  process.exit(1);
}

// Initialize clients
const sql = postgres(DATABASE_URL);
const convex = new ConvexHttpClient(CONVEX_URL);

async function migrateConsultations() {
  console.log("📦 Migrating consultations...");
  const data = await sql`SELECT * FROM consultation_submissions`;
  
  if (data.length === 0) {
    console.log("   No consultations to migrate");
    return;
  }

  const formatted = data.map((row: any) => ({
    name: row.name,
    email: row.email,
    phone: row.phone,
    service: row.service,
    message: row.message || undefined,
    status: row.status,
    assignedTo: row.assigned_to || undefined,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  }));

  const result = await convex.mutation(api.migrations.importConsultations, { data: formatted });
  console.log(`   ✅ Imported ${result.imported} consultations`);
}

async function migrateQuotes() {
  console.log("📦 Migrating quotes...");
  const data = await sql`SELECT * FROM quote_submissions`;
  
  if (data.length === 0) {
    console.log("   No quotes to migrate");
    return;
  }

  const formatted = data.map((row: any) => ({
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    origin: row.origin,
    destination: row.destination,
    shippingMethod: row.shipping_method,
    cargoType: row.cargo_type,
    weight: row.weight || undefined,
    preferredDate: row.preferred_date || undefined,
    notes: row.notes || undefined,
    status: row.status,
    assignedTo: row.assigned_to || undefined,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  }));

  const result = await convex.mutation(api.migrations.importQuotes, { data: formatted });
  console.log(`   ✅ Imported ${result.imported} quotes`);
}

async function migrateContacts() {
  console.log("📦 Migrating contacts...");
  const data = await sql`SELECT * FROM contact_submissions`;
  
  if (data.length === 0) {
    console.log("   No contacts to migrate");
    return;
  }

  const formatted = data.map((row: any) => ({
    name: row.name,
    email: row.email,
    phone: row.phone || undefined,
    subject: row.subject,
    message: row.message,
    status: row.status,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  }));

  const result = await convex.mutation(api.migrations.importContacts, { data: formatted });
  console.log(`   ✅ Imported ${result.imported} contacts`);
}

async function migrateAdminUsers() {
  console.log("📦 Migrating admin users...");
  const data = await sql`SELECT * FROM admin_users`;
  
  if (data.length === 0) {
    console.log("   No admin users to migrate");
    return;
  }

  const formatted = data.map((row: any) => ({
    email: row.email,
    password: row.password,
    name: row.name,
    role: row.role,
    isActive: row.is_active,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  }));

  const result = await convex.mutation(api.migrations.importAdminUsers, { data: formatted });
  console.log(`   ✅ Imported ${result.imported} admin users`);
}

async function migrateDropdownOptions() {
  console.log("📦 Migrating dropdown options...");
  const data = await sql`SELECT * FROM dropdown_options`;
  
  if (data.length === 0) {
    console.log("   No dropdown options to migrate");
    return;
  }

  const formatted = data.map((row: any) => ({
    type: row.type,
    label: row.label,
    value: row.value,
    order: row.order || undefined,
    isActive: row.is_active,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  }));

  const result = await convex.mutation(api.migrations.importDropdownOptions, { data: formatted });
  console.log(`   ✅ Imported ${result.imported} dropdown options`);
}

async function migratePartners() {
  console.log("📦 Migrating partners...");
  const data = await sql`SELECT * FROM partners`;
  
  if (data.length === 0) {
    console.log("   No partners to migrate");
    return;
  }

  const formatted = data.map((row: any) => ({
    name: row.name,
    icon: row.icon || undefined,
    image: row.image || undefined,
    order: row.order || undefined,
    isActive: row.is_active,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  }));

  const result = await convex.mutation(api.migrations.importPartners, { data: formatted });
  console.log(`   ✅ Imported ${result.imported} partners`);
}

async function migrateTestimonials() {
  console.log("📦 Migrating testimonials...");
  const data = await sql`SELECT * FROM testimonials`;
  
  if (data.length === 0) {
    console.log("   No testimonials to migrate");
    return;
  }

  const formatted = data.map((row: any) => ({
    clientName: row.client_name,
    clientTitle: row.client_title || undefined,
    clientCompany: row.client_company || undefined,
    content: row.content,
    rating: row.rating || undefined,
    image: row.image || undefined,
    order: row.order || undefined,
    isActive: row.is_active,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  }));

  const result = await convex.mutation(api.migrations.importTestimonials, { data: formatted });
  console.log(`   ✅ Imported ${result.imported} testimonials`);
}

async function migrateSiteSettings() {
  console.log("📦 Migrating site settings...");
  const data = await sql`SELECT * FROM site_settings LIMIT 1`;
  
  if (data.length === 0) {
    console.log("   No site settings to migrate");
    return;
  }

  const row = data[0] as any;
  const formatted = {
    phonePrimary: row.phone_primary || undefined,
    phoneSecondary: row.phone_secondary || undefined,
    whatsapp: row.whatsapp || undefined,
    whatsappLabel: row.whatsapp_label || undefined,
    showWhatsappInHeader: row.show_whatsapp_in_header ?? undefined,
    emailPrimary: row.email_primary || undefined,
    emailSupport: row.email_support || undefined,
    displayPhonePrimary: row.display_phone_primary ?? undefined,
    displayPhoneSecondary: row.display_phone_secondary ?? undefined,
    facebookUrl: row.facebook_url || undefined,
    instagramUrl: row.instagram_url || undefined,
    linkedinUrl: row.linkedin_url || undefined,
    twitterUrl: row.twitter_url || undefined,
    tiktokUrl: row.tiktok_url || undefined,
    displayFacebook: row.display_facebook ?? undefined,
    displayInstagram: row.display_instagram ?? undefined,
    displayLinkedin: row.display_linkedin ?? undefined,
    displayTwitter: row.display_twitter ?? undefined,
    displayTiktok: row.display_tiktok ?? undefined,
    officeKumasi: row.office_kumasi || undefined,
    officeObuasi: row.office_obuasi || undefined,
    officeChina: row.office_china || undefined,
    businessHours: row.business_hours || undefined,
    globalEmailEnabled: row.global_email_enabled ?? undefined,
    globalEmail: row.global_email || undefined,
    overrideIndividualEmailSettings: row.override_individual_email_settings ?? undefined,
    updatedBy: row.updated_by || undefined,
  };

  const result = await convex.mutation(api.migrations.importSiteSettings, { data: formatted });
  console.log(`   ✅ Imported ${result.imported} site settings`);
}

async function migrateEmailSettings() {
  console.log("📦 Migrating email notification settings...");
  const data = await sql`SELECT * FROM email_notification_settings`;
  
  if (data.length === 0) {
    console.log("   No email settings to migrate");
    return;
  }

  const formatted = data.map((row: any) => ({
    formType: row.form_type,
    recipientEmails: row.recipient_emails,
    enabled: row.enabled,
    subjectTemplate: row.subject_template || undefined,
    includeFormData: row.include_form_data,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  }));

  const result = await convex.mutation(api.migrations.importEmailSettings, { data: formatted });
  console.log(`   ✅ Imported ${result.imported} email settings`);
}

async function main() {
  console.log("🚀 Starting migration from Neon PostgreSQL to Convex...\n");
  
  try {
    await migrateAdminUsers();
    await migrateConsultations();
    await migrateQuotes();
    await migrateContacts();
    await migrateDropdownOptions();
    await migratePartners();
    await migrateTestimonials();
    await migrateSiteSettings();
    await migrateEmailSettings();
    
    console.log("\n✅ Migration completed successfully!");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
