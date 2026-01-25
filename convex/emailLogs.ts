import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// List email logs (with optional filters)
export const list = query({
  args: {
    formType: v.optional(v.string()),
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;
    let results;

    if (args.formType) {
      results = await ctx.db
        .query("emailLogs")
        .withIndex("by_formType", (q) => q.eq("formType", args.formType!))
        .order("desc")
        .take(limit);
    } else if (args.status) {
      results = await ctx.db
        .query("emailLogs")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(limit);
    } else {
      results = await ctx.db
        .query("emailLogs")
        .order("desc")
        .take(limit);
    }

    return results;
  },
});

// Get a single email log by ID
export const get = query({
  args: { id: v.id("emailLogs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new email log
export const create = mutation({
  args: {
    formType: v.string(),
    submissionId: v.optional(v.string()),
    recipientEmail: v.string(),
    subject: v.string(),
    status: v.string(),
    errorMessage: v.optional(v.string()),
    sentAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("emailLogs", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Update email log status
export const updateStatus = mutation({
  args: {
    id: v.id("emailLogs"),
    status: v.string(),
    errorMessage: v.optional(v.string()),
    sentAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Filter out undefined values
    const cleanUpdates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    }

    return await ctx.db.patch(id, cleanUpdates);
  },
});

// Delete email log
export const remove = mutation({
  args: { id: v.id("emailLogs") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Get email log stats
export const stats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("emailLogs").collect();
    return {
      total: all.length,
      sent: all.filter((l) => l.status === "sent").length,
      failed: all.filter((l) => l.status === "failed").length,
      pending: all.filter((l) => l.status === "pending").length,
    };
  },
});
