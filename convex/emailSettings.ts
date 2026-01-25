import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// List all email notification settings
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("emailNotificationSettings").collect();
  },
});

// Get email settings by form type
export const getByFormType = query({
  args: { formType: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("emailNotificationSettings")
      .withIndex("by_formType", (q) => q.eq("formType", args.formType))
      .first();
  },
});

// Get a single email setting by ID
export const get = query({
  args: { id: v.id("emailNotificationSettings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create or update email notification settings (upsert by formType)
export const upsert = mutation({
  args: {
    formType: v.string(),
    recipientEmails: v.optional(v.string()),
    enabled: v.optional(v.boolean()),
    subjectTemplate: v.optional(v.string()),
    includeFormData: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("emailNotificationSettings")
      .withIndex("by_formType", (q) => q.eq("formType", args.formType))
      .first();

    const now = Date.now();

    if (existing) {
      // Update existing
      const updates: Record<string, unknown> = { updatedAt: now };
      if (args.recipientEmails !== undefined) updates.recipientEmails = args.recipientEmails;
      if (args.enabled !== undefined) updates.enabled = args.enabled;
      if (args.subjectTemplate !== undefined) updates.subjectTemplate = args.subjectTemplate;
      if (args.includeFormData !== undefined) updates.includeFormData = args.includeFormData;

      await ctx.db.patch(existing._id, updates);
      return existing._id;
    } else {
      // Create new
      return await ctx.db.insert("emailNotificationSettings", {
        formType: args.formType,
        recipientEmails: args.recipientEmails ?? "[]",
        enabled: args.enabled ?? true,
        subjectTemplate: args.subjectTemplate,
        includeFormData: args.includeFormData ?? true,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Update email settings
export const update = mutation({
  args: {
    id: v.id("emailNotificationSettings"),
    recipientEmails: v.optional(v.string()),
    enabled: v.optional(v.boolean()),
    subjectTemplate: v.optional(v.string()),
    includeFormData: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Filter out undefined values
    const cleanUpdates: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    }

    return await ctx.db.patch(id, cleanUpdates);
  },
});

// Initialize default email settings for all form types
export const init = mutation({
  args: {},
  handler: async (ctx) => {
    const formTypes = ["quote", "consultation", "contact"];
    const now = Date.now();
    const results = [];

    for (const formType of formTypes) {
      const existing = await ctx.db
        .query("emailNotificationSettings")
        .withIndex("by_formType", (q) => q.eq("formType", formType))
        .first();

      if (!existing) {
        const id = await ctx.db.insert("emailNotificationSettings", {
          formType,
          recipientEmails: "[]",
          enabled: true,
          includeFormData: true,
          createdAt: now,
          updatedAt: now,
        });
        results.push({ formType, id, created: true });
      } else {
        results.push({ formType, id: existing._id, created: false });
      }
    }

    return results;
  },
});

// Delete email settings
export const remove = mutation({
  args: { id: v.id("emailNotificationSettings") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
