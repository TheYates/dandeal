import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

// Verify admin user exists and is active (for NextAuth integration)
export const verifyAdmin = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user || !user.isActive) {
      return null;
    }

    // Return user without password for security
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
    };
  },
});

// Get admin user with password hash (for credential verification)
export const getAdminWithPassword = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user || !user.isActive) {
      return null;
    }

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      password: user.password,
      isActive: user.isActive,
    };
  },
});

// Check if a user has admin access (used for protecting routes)
export const checkAdminRole = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!admin || !admin.isActive) {
      return { authorized: false, role: null };
    }

    return {
      authorized: true,
      role: admin.role,
      canEdit: admin.role === "super_admin" || admin.role === "admin",
      canDelete: admin.role === "super_admin",
    };
  },
});
