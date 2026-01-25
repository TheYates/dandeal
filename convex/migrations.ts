import { v } from "convex/values";
import { mutation, internalMutation } from "./_generated/server";
import { consultationStatus, quoteStatus, contactStatus, adminRole, dropdownType } from "./schema";

// Migration helper: Import consultations from old database
export const importConsultations = mutation({
  args: {
    data: v.array(
      v.object({
        name: v.string(),
        email: v.string(),
        phone: v.string(),
        service: v.string(),
        message: v.optional(v.string()),
        status: consultationStatus,
        assignedTo: v.optional(v.string()),
        createdAt: v.string(), // ISO string from old DB
        updatedAt: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const results = [];
    for (const item of args.data) {
      const id = await ctx.db.insert("consultations", {
        name: item.name,
        email: item.email,
        phone: item.phone,
        service: item.service,
        message: item.message,
        status: item.status,
        assignedTo: item.assignedTo,
        createdAt: new Date(item.createdAt).getTime(),
        updatedAt: new Date(item.updatedAt).getTime(),
      });
      results.push(id);
    }
    return { imported: results.length };
  },
});

// Migration helper: Import quotes from old database
export const importQuotes = mutation({
  args: {
    data: v.array(
      v.object({
        firstName: v.string(),
        lastName: v.string(),
        email: v.string(),
        phone: v.string(),
        origin: v.string(),
        destination: v.string(),
        shippingMethod: v.string(),
        cargoType: v.string(),
        weight: v.optional(v.string()),
        preferredDate: v.optional(v.string()),
        notes: v.optional(v.string()),
        status: quoteStatus,
        assignedTo: v.optional(v.string()),
        createdAt: v.string(),
        updatedAt: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const results = [];
    for (const item of args.data) {
      const id = await ctx.db.insert("quotes", {
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        phone: item.phone,
        origin: item.origin,
        destination: item.destination,
        shippingMethod: item.shippingMethod,
        cargoType: item.cargoType,
        weight: item.weight,
        preferredDate: item.preferredDate,
        notes: item.notes,
        status: item.status,
        assignedTo: item.assignedTo,
        createdAt: new Date(item.createdAt).getTime(),
        updatedAt: new Date(item.updatedAt).getTime(),
      });
      results.push(id);
    }
    return { imported: results.length };
  },
});

// Migration helper: Import contacts from old database
export const importContacts = mutation({
  args: {
    data: v.array(
      v.object({
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        subject: v.string(),
        message: v.string(),
        status: contactStatus,
        createdAt: v.string(),
        updatedAt: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const results = [];
    for (const item of args.data) {
      const id = await ctx.db.insert("contacts", {
        name: item.name,
        email: item.email,
        phone: item.phone,
        subject: item.subject,
        message: item.message,
        status: item.status,
        createdAt: new Date(item.createdAt).getTime(),
        updatedAt: new Date(item.updatedAt).getTime(),
      });
      results.push(id);
    }
    return { imported: results.length };
  },
});

// Migration helper: Import admin users from old database
export const importAdminUsers = mutation({
  args: {
    data: v.array(
      v.object({
        email: v.string(),
        password: v.string(),
        name: v.string(),
        role: adminRole,
        isActive: v.boolean(),
        createdAt: v.string(),
        updatedAt: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const results = [];
    for (const item of args.data) {
      // Check if email already exists
      const existing = await ctx.db
        .query("adminUsers")
        .withIndex("by_email", (q) => q.eq("email", item.email))
        .first();
      
      if (!existing) {
        const id = await ctx.db.insert("adminUsers", {
          email: item.email,
          password: item.password,
          name: item.name,
          role: item.role,
          isActive: item.isActive,
          createdAt: new Date(item.createdAt).getTime(),
          updatedAt: new Date(item.updatedAt).getTime(),
        });
        results.push(id);
      }
    }
    return { imported: results.length };
  },
});

// Migration helper: Import dropdown options from old database
export const importDropdownOptions = mutation({
  args: {
    data: v.array(
      v.object({
        type: dropdownType,
        label: v.string(),
        value: v.string(),
        order: v.optional(v.string()),
        isActive: v.boolean(),
        createdAt: v.string(),
        updatedAt: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const results = [];
    for (const item of args.data) {
      const id = await ctx.db.insert("dropdownOptions", {
        type: item.type,
        label: item.label,
        value: item.value,
        order: item.order ?? "0",
        isActive: item.isActive,
        createdAt: new Date(item.createdAt).getTime(),
        updatedAt: new Date(item.updatedAt).getTime(),
      });
      results.push(id);
    }
    return { imported: results.length };
  },
});

// Migration helper: Import partners from old database
export const importPartners = mutation({
  args: {
    data: v.array(
      v.object({
        name: v.string(),
        icon: v.optional(v.string()),
        image: v.optional(v.string()),
        order: v.optional(v.string()),
        isActive: v.boolean(),
        createdAt: v.string(),
        updatedAt: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const results = [];
    for (const item of args.data) {
      const id = await ctx.db.insert("partners", {
        name: item.name,
        icon: item.icon,
        image: item.image,
        order: item.order ?? "0",
        isActive: item.isActive,
        createdAt: new Date(item.createdAt).getTime(),
        updatedAt: new Date(item.updatedAt).getTime(),
      });
      results.push(id);
    }
    return { imported: results.length };
  },
});

// Migration helper: Import testimonials from old database
export const importTestimonials = mutation({
  args: {
    data: v.array(
      v.object({
        clientName: v.string(),
        clientTitle: v.optional(v.string()),
        clientCompany: v.optional(v.string()),
        content: v.string(),
        rating: v.optional(v.string()),
        image: v.optional(v.string()),
        order: v.optional(v.string()),
        isActive: v.boolean(),
        createdAt: v.string(),
        updatedAt: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const results = [];
    for (const item of args.data) {
      const id = await ctx.db.insert("testimonials", {
        clientName: item.clientName,
        clientTitle: item.clientTitle,
        clientCompany: item.clientCompany,
        content: item.content,
        rating: item.rating ?? "5",
        image: item.image,
        order: item.order ?? "0",
        isActive: item.isActive,
        createdAt: new Date(item.createdAt).getTime(),
        updatedAt: new Date(item.updatedAt).getTime(),
      });
      results.push(id);
    }
    return { imported: results.length };
  },
});

// Migration helper: Import site settings from old database
export const importSiteSettings = mutation({
  args: {
    data: v.object({
      phonePrimary: v.optional(v.string()),
      phoneSecondary: v.optional(v.string()),
      whatsapp: v.optional(v.string()),
      whatsappLabel: v.optional(v.string()),
      showWhatsappInHeader: v.optional(v.boolean()),
      emailPrimary: v.optional(v.string()),
      emailSupport: v.optional(v.string()),
      displayPhonePrimary: v.optional(v.boolean()),
      displayPhoneSecondary: v.optional(v.boolean()),
      facebookUrl: v.optional(v.string()),
      instagramUrl: v.optional(v.string()),
      linkedinUrl: v.optional(v.string()),
      twitterUrl: v.optional(v.string()),
      tiktokUrl: v.optional(v.string()),
      displayFacebook: v.optional(v.boolean()),
      displayInstagram: v.optional(v.boolean()),
      displayLinkedin: v.optional(v.boolean()),
      displayTwitter: v.optional(v.boolean()),
      displayTiktok: v.optional(v.boolean()),
      officeKumasi: v.optional(v.string()),
      officeObuasi: v.optional(v.string()),
      officeChina: v.optional(v.string()),
      businessHours: v.optional(v.string()),
      globalEmailEnabled: v.optional(v.boolean()),
      globalEmail: v.optional(v.string()),
      overrideIndividualEmailSettings: v.optional(v.boolean()),
      updatedBy: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    // Check if settings already exist
    const existing = await ctx.db.query("siteSettings").first();
    if (existing) {
      return { imported: 0, message: "Site settings already exist" };
    }

    await ctx.db.insert("siteSettings", {
      ...args.data,
      updatedAt: Date.now(),
    });
    return { imported: 1 };
  },
});

// Migration helper: Import email notification settings from old database
export const importEmailSettings = mutation({
  args: {
    data: v.array(
      v.object({
        formType: v.string(),
        recipientEmails: v.string(),
        enabled: v.boolean(),
        subjectTemplate: v.optional(v.string()),
        includeFormData: v.boolean(),
        createdAt: v.string(),
        updatedAt: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const results = [];
    for (const item of args.data) {
      // Check if formType already exists
      const existing = await ctx.db
        .query("emailNotificationSettings")
        .withIndex("by_formType", (q) => q.eq("formType", item.formType))
        .first();
      
      if (!existing) {
        const id = await ctx.db.insert("emailNotificationSettings", {
          formType: item.formType,
          recipientEmails: item.recipientEmails,
          enabled: item.enabled,
          subjectTemplate: item.subjectTemplate,
          includeFormData: item.includeFormData,
          createdAt: new Date(item.createdAt).getTime(),
          updatedAt: new Date(item.updatedAt).getTime(),
        });
        results.push(id);
      }
    }
    return { imported: results.length };
  },
});

// Clear all data (use with caution!)
export const clearAllData = mutation({
  args: { confirmPhrase: v.string() },
  handler: async (ctx, args) => {
    if (args.confirmPhrase !== "DELETE_ALL_DATA") {
      throw new Error("Invalid confirmation phrase");
    }

    const tables = [
      "consultations",
      "quotes", 
      "contacts",
      "adminUsers",
      "dropdownOptions",
      "partners",
      "testimonials",
      "siteSettings",
      "emailNotificationSettings",
      "emailLogs",
    ] as const;

    const results: Record<string, number> = {};

    for (const table of tables) {
      const docs = await ctx.db.query(table).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }
      results[table] = docs.length;
    }

    return { deleted: results };
  },
});
