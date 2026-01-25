import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// List all testimonials
export const list = query({
  args: {
    activeOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let results = await ctx.db.query("testimonials").collect();

    if (args.activeOnly) {
      results = results.filter((t) => t.isActive);
    }

    // Sort by order
    return results.sort((a, b) => {
      const orderA = parseInt(a.order || "0", 10);
      const orderB = parseInt(b.order || "0", 10);
      return orderA - orderB;
    });
  },
});

// Get a single testimonial by ID
export const get = query({
  args: { id: v.id("testimonials") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new testimonial
export const create = mutation({
  args: {
    clientName: v.string(),
    clientTitle: v.optional(v.string()),
    clientCompany: v.optional(v.string()),
    content: v.string(),
    rating: v.optional(v.string()),
    image: v.optional(v.string()),
    order: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("testimonials", {
      ...args,
      rating: args.rating ?? "5",
      order: args.order ?? "0",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update testimonial
export const update = mutation({
  args: {
    id: v.id("testimonials"),
    clientName: v.optional(v.string()),
    clientTitle: v.optional(v.string()),
    clientCompany: v.optional(v.string()),
    content: v.optional(v.string()),
    rating: v.optional(v.string()),
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

// Delete testimonial
export const remove = mutation({
  args: { id: v.id("testimonials") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Get counts
export const counts = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("testimonials").collect();
    const total = all.length;
    const published = all.filter((t) => t.isActive).length;
    return { total, published };
  },
});
