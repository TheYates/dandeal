import {
  pgTable,
  text,
  timestamp,
  uuid,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";

// Enums
export const consultationStatusEnum = pgEnum("consultation_status", [
  "new",
  "contacted",
  "in_progress",
  "completed",
  "cancelled",
]);

export const quoteStatusEnum = pgEnum("quote_status", [
  "new",
  "quoted",
  "accepted",
  "declined",
  "completed",
]);

export const contactStatusEnum = pgEnum("contact_status", [
  "new",
  "read",
  "responded",
  "archived",
]);

export const adminRoleEnum = pgEnum("admin_role", [
  "super_admin",
  "admin",
  "viewer",
]);

export const dropdownTypeEnum = pgEnum("dropdown_type", [
  "services",
  "shipping_methods",
  "cargo_types",
]);

// Tables
export const consultationSubmissions = pgTable("consultation_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  service: text("service").notNull(),
  message: text("message"),
  status: consultationStatusEnum("status").notNull().default("new"),
  assignedTo: text("assigned_to"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const quoteSubmissions = pgTable("quote_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  shippingMethod: text("shipping_method").notNull(),
  cargoType: text("cargo_type").notNull(),
  weight: text("weight"),
  preferredDate: text("preferred_date"),
  notes: text("notes"),
  status: quoteStatusEnum("status").notNull().default("new"),
  assignedTo: text("assigned_to"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: contactStatusEnum("status").notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  supabaseUserId: text("supabase_user_id").notNull().unique(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  role: adminRoleEnum("role").notNull().default("viewer"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const dropdownOptions = pgTable("dropdown_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: dropdownTypeEnum("type").notNull(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  order: text("order").default("0"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const partners = pgTable("partners", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  icon: text("icon"), // Deprecated - kept for backwards compatibility
  image: text("image"), // New field for image URL
  order: text("order").default("0"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Contact Information
  phonePrimary: text("phone_primary"),
  phoneSecondary: text("phone_secondary"),
  whatsapp: text("whatsapp"),
  emailPrimary: text("email_primary"),
  emailSupport: text("email_support"),
  // Social Media Links
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  // Office Locations
  officeKumasi: text("office_kumasi"),
  officeObuasi: text("office_obuasi"),
  officeChina: text("office_china"),
  // Business Hours
  businessHours: text("business_hours"),
  // Metadata
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  updatedBy: text("updated_by"),
});

// Types
export type ConsultationSubmission =
  typeof consultationSubmissions.$inferSelect;
export type NewConsultationSubmission =
  typeof consultationSubmissions.$inferInsert;

export type QuoteSubmission = typeof quoteSubmissions.$inferSelect;
export type NewQuoteSubmission = typeof quoteSubmissions.$inferInsert;

export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;

export type DropdownOption = typeof dropdownOptions.$inferSelect;
export type NewDropdownOption = typeof dropdownOptions.$inferInsert;

export type Partner = typeof partners.$inferSelect;
export type NewPartner = typeof partners.$inferInsert;

export type SiteSettings = typeof siteSettings.$inferSelect;
export type NewSiteSettings = typeof siteSettings.$inferInsert;
