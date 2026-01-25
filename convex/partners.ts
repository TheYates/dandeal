import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// List all partners
export const list = query({
  args: {
    activeOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let results = await ctx.db.query("partners").collect();

    if (args.activeOnly) {
      results = results.filter((p) => p.isActive);
    }

    // Sort by order
    return results.sort((a, b) => {
      const orderA = parseInt(a.order || "0", 10);
      const orderB = parseInt(b.order || "0", 10);
      return orderA - orderB;
    });
  },
});

// Get a single partner by ID
export const get = query({
  args: { id: v.id("partners") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new partner
export const create = mutation({
  args: {
    name: v.string(),
    icon: v.optional(v.string()),
    image: v.optional(v.string()),
    order: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("partners", {
      ...args,
      order: args.order ?? "0",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update partner
export const update = mutation({
  args: {
    id: v.id("partners"),
    name: v.optional(v.string()),
    icon: v.optional(v.string()),
    image: v.optional(v.string()),
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

// Delete partner
export const remove = mutation({
  args: { id: v.id("partners") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
