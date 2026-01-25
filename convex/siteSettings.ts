import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get site settings (returns first/only record)
export const get = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("siteSettings").first();
    return settings;
  },
});

// Update site settings (upsert pattern)
export const update = mutation({
  args: {
    // Contact Information
    phonePrimary: v.optional(v.string()),
    phoneSecondary: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    whatsappLabel: v.optional(v.string()),
    showWhatsappInHeader: v.optional(v.boolean()),
    emailPrimary: v.optional(v.string()),
    emailSupport: v.optional(v.string()),
    // Phone Display Settings
    displayPhonePrimary: v.optional(v.boolean()),
    displayPhoneSecondary: v.optional(v.boolean()),
    // Social Media Links
    facebookUrl: v.optional(v.string()),
    instagramUrl: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    twitterUrl: v.optional(v.string()),
    tiktokUrl: v.optional(v.string()),
    // Social Media Display Settings
    displayFacebook: v.optional(v.boolean()),
    displayInstagram: v.optional(v.boolean()),
    displayLinkedin: v.optional(v.boolean()),
    displayTwitter: v.optional(v.boolean()),
    displayTiktok: v.optional(v.boolean()),
    // Office Locations
    officeKumasi: v.optional(v.string()),
    officeObuasi: v.optional(v.string()),
    officeChina: v.optional(v.string()),
    // Business Hours
    businessHours: v.optional(v.string()),
    // Global Email Settings
    globalEmailEnabled: v.optional(v.boolean()),
    globalEmail: v.optional(v.string()),
    overrideIndividualEmailSettings: v.optional(v.boolean()),
    // Metadata
    updatedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("siteSettings").first();
    
    // Filter out undefined values
    const cleanUpdates: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(args)) {
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    }

    if (existing) {
      // Update existing record
      return await ctx.db.patch(existing._id, cleanUpdates);
    } else {
      // Create new record with defaults
      return await ctx.db.insert("siteSettings", {
        ...cleanUpdates,
        updatedAt: Date.now(),
      } as any);
    }
  },
});

// Initialize site settings if not exists
export const init = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("siteSettings").first();
    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("siteSettings", {
      whatsappLabel: "WhatsApp Us",
      showWhatsappInHeader: false,
      displayPhonePrimary: true,
      displayPhoneSecondary: false,
      displayFacebook: true,
      displayInstagram: true,
      displayLinkedin: true,
      displayTwitter: true,
      displayTiktok: true,
      globalEmailEnabled: false,
      overrideIndividualEmailSettings: false,
      updatedAt: Date.now(),
    });
  },
});
