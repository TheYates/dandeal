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

export const adminRoleEnum = pgEnum("admin_role", [
  "super_admin",
  "admin",
  "viewer",
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

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  role: adminRoleEnum("role").notNull().default("viewer"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
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
