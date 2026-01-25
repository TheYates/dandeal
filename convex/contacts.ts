import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { contactStatus } from "./schema";

// List all contacts (with optional status filter)
export const list = query({
  args: {
    status: v.optional(contactStatus),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    
    if (args.status) {
      return await ctx.db
        .query("contacts")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(limit);
    }
    
    return await ctx.db
      .query("contacts")
      .order("desc")
      .take(limit);
  },
});

// Get a single contact by ID
export const get = query({
  args: { id: v.id("contacts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new contact submission
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("contacts", {
      ...args,
      status: "new",
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update contact status
export const updateStatus = mutation({
  args: {
    id: v.id("contacts"),
    status: contactStatus,
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

// Update contact (general)
export const update = mutation({
  args: {
    id: v.id("contacts"),
    status: v.optional(contactStatus),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete a contact
export const remove = mutation({
  args: { id: v.id("contacts") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Get count by status
export const countByStatus = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("contacts").collect();
    const total = all.length;
    const unread = all.filter((c) => c.status === "new").length;
    return { total, unread };
  },
});
