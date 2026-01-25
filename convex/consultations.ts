import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { consultationStatus } from "./schema";

// List all consultations (with optional status filter)
export const list = query({
  args: {
    status: v.optional(consultationStatus),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    
    if (args.status) {
      return await ctx.db
        .query("consultations")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(limit);
    }
    
    return await ctx.db
      .query("consultations")
      .order("desc")
      .take(limit);
  },
});

// Get a single consultation by ID
export const get = query({
  args: { id: v.id("consultations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new consultation submission
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    service: v.string(),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("consultations", {
      ...args,
      status: "new",
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update consultation status
export const updateStatus = mutation({
  args: {
    id: v.id("consultations"),
    status: consultationStatus,
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

// Update consultation (general)
export const update = mutation({
  args: {
    id: v.id("consultations"),
    status: v.optional(consultationStatus),
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

// Delete a consultation
export const remove = mutation({
  args: { id: v.id("consultations") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Get count by status
export const countByStatus = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("consultations").collect();
    const total = all.length;
    const pending = all.filter((c) => c.status === "new").length;
    return { total, pending };
  },
});
