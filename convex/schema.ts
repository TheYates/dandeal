import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Enum validators
export const consultationStatus = v.union(
  v.literal("new"),
  v.literal("contacted"),
  v.literal("in_progress"),
  v.literal("completed"),
  v.literal("cancelled")
);

export const quoteStatus = v.union(
  v.literal("new"),
  v.literal("quoted"),
  v.literal("accepted"),
  v.literal("declined"),
  v.literal("completed")
);

export const contactStatus = v.union(
  v.literal("new"),
  v.literal("read"),
  v.literal("responded"),
  v.literal("archived")
);

export const adminRole = v.union(
  v.literal("super_admin"),
  v.literal("admin"),
  v.literal("viewer")
);

export const dropdownType = v.union(
  v.literal("services"),
  v.literal("shipping_methods"),
  v.literal("cargo_types")
);

export const invitationStatus = v.union(
  v.literal("pending"),
  v.literal("accepted"),
  v.literal("expired"),
  v.literal("revoked")
);

export default defineSchema({
  // Admin invitations
  invitations: defineTable({
    email: v.string(),
    token: v.string(),
    role: adminRole,
    invitedBy: v.string(), // Admin user ID who sent the invite
    invitedByName: v.string(), // Name of the admin who invited
    status: invitationStatus,
    expiresAt: v.number(),
    acceptedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_token", ["token"])
    .index("by_status", ["status"]),

  // Consultation submissions
  consultations: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    service: v.string(),
    message: v.optional(v.string()),
    status: consultationStatus,
    assignedTo: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  // Quote submissions
  quotes: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  // Contact submissions
  contacts: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
    status: contactStatus,
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  // Admin users
  adminUsers: defineTable({
    email: v.string(),
    password: v.string(), // Hashed password
    name: v.string(),
    role: adminRole,
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"]),

  // Dropdown options
  dropdownOptions: defineTable({
    type: dropdownType,
    label: v.string(),
    value: v.string(),
    order: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_type_active", ["type", "isActive"]),

  // Partners
  partners: defineTable({
    name: v.string(),
    icon: v.optional(v.string()), // Deprecated
    image: v.optional(v.string()), // Image URL
    order: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_active", ["isActive"]),

  // Site settings (single document pattern)
  siteSettings: defineTable({
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
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
  }),

  // Testimonials
  testimonials: defineTable({
    clientName: v.string(),
    clientTitle: v.optional(v.string()),
    clientCompany: v.optional(v.string()),
    content: v.string(),
    rating: v.optional(v.string()),
    image: v.optional(v.string()),
    order: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_active", ["isActive"]),

  // Email notification settings
  emailNotificationSettings: defineTable({
    formType: v.string(), // 'quote', 'consultation', 'contact'
    recipientEmails: v.string(), // JSON array stored as text
    enabled: v.boolean(),
    subjectTemplate: v.optional(v.string()),
    includeFormData: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_formType", ["formType"]),

  // Email logs
  emailLogs: defineTable({
    formType: v.string(),
    submissionId: v.optional(v.string()), // Reference to form submission
    recipientEmail: v.string(),
    subject: v.string(),
    status: v.string(), // 'sent', 'failed', 'pending'
    errorMessage: v.optional(v.string()),
    sentAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_formType", ["formType"])
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),
});
