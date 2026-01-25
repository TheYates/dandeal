import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { dropdownType } from "./schema";

// List all dropdown options (with optional type filter)
export const list = query({
  args: {
    type: v.optional(dropdownType),
    activeOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let results;
    
    if (args.type) {
      results = await ctx.db
        .query("dropdownOptions")
        .withIndex("by_type", (q) => q.eq("type", args.type!))
        .collect();
    } else {
      results = await ctx.db.query("dropdownOptions").collect();
    }

    if (args.activeOnly) {
      results = results.filter((opt) => opt.isActive);
    }

    // Sort by order
    return results.sort((a, b) => {
      const orderA = parseInt(a.order || "0", 10);
      const orderB = parseInt(b.order || "0", 10);
      return orderA - orderB;
    });
  },
});

// List grouped by type
export const listGrouped = query({
  args: { activeOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let results = await ctx.db.query("dropdownOptions").collect();

    if (args.activeOnly) {
      results = results.filter((opt) => opt.isActive);
    }

    // Sort by order
    results.sort((a, b) => {
      const orderA = parseInt(a.order || "0", 10);
      const orderB = parseInt(b.order || "0", 10);
      return orderA - orderB;
    });

    // Group by type
    const grouped = {
      services: results.filter((opt) => opt.type === "services"),
      shipping_methods: results.filter((opt) => opt.type === "shipping_methods"),
      cargo_types: results.filter((opt) => opt.type === "cargo_types"),
    };

    return grouped;
  },
});

// Get a single dropdown option by ID
export const get = query({
  args: { id: v.id("dropdownOptions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new dropdown option
export const create = mutation({
  args: {
    type: dropdownType,
    label: v.string(),
    value: v.string(),
    order: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("dropdownOptions", {
      ...args,
      order: args.order ?? "0",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update dropdown option
export const update = mutation({
  args: {
    id: v.id("dropdownOptions"),
    label: v.optional(v.string()),
    value: v.optional(v.string()),
    order: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
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

// Delete dropdown option
export const remove = mutation({
  args: { id: v.id("dropdownOptions") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
