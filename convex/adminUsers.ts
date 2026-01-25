import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { adminRole } from "./schema";

// List all admin users
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("adminUsers").collect();
  },
});

// Get admin user by ID
export const get = query({
  args: { id: v.id("adminUsers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get admin user by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Create a new admin user
export const create = mutation({
  args: {
    email: v.string(),
    password: v.string(), // Should be pre-hashed
    name: v.string(),
    role: v.optional(adminRole),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existing) {
      throw new Error("Email already exists");
    }

    const now = Date.now();
    return await ctx.db.insert("adminUsers", {
      email: args.email,
      password: args.password,
      name: args.name,
      role: args.role ?? "viewer",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update admin user
export const update = mutation({
  args: {
    id: v.id("adminUsers"),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    role: v.optional(adminRole),
    isActive: v.optional(v.boolean()),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // If email is being changed, check it doesn't exist
    if (updates.email) {
      const existing = await ctx.db
        .query("adminUsers")
        .withIndex("by_email", (q) => q.eq("email", updates.email!))
        .first();
      
      if (existing && existing._id !== id) {
        throw new Error("Email already exists");
      }
    }

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

// Delete admin user
export const remove = mutation({
  args: { id: v.id("adminUsers") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Verify admin credentials (for auth)
export const verifyCredentials = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (!user || !user.isActive) {
      return null;
    }

    return user;
  },
});
