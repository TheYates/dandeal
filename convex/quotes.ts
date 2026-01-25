import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { quoteStatus } from "./schema";

// List all quotes (with optional status filter)
export const list = query({
  args: {
    status: v.optional(quoteStatus),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    
    if (args.status) {
      return await ctx.db
        .query("quotes")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(limit);
    }
    
    return await ctx.db
      .query("quotes")
      .order("desc")
      .take(limit);
  },
});

// Get a single quote by ID
export const get = query({
  args: { id: v.id("quotes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new quote submission
export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("quotes", {
      ...args,
      status: "new",
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update quote status
export const updateStatus = mutation({
  args: {
    id: v.id("quotes"),
    status: quoteStatus,
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

// Update quote (general)
export const update = mutation({
  args: {
    id: v.id("quotes"),
    status: v.optional(quoteStatus),
    assignedTo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete a quote
export const remove = mutation({
  args: { id: v.id("quotes") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Get count by status
export const countByStatus = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("quotes").collect();
    const total = all.length;
    const pending = all.filter((q) => q.status === "new").length;
    return { total, pending };
  },
});
