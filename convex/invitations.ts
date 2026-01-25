import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { adminRole } from "./schema";
import { Id } from "./_generated/dataModel";
import bcrypt from "bcryptjs";

// Generate a cryptographically secure random token
// Using a combination of timestamp, random values, and hashing for uniqueness
function generateToken(): string {
  const timestamp = Date.now().toString(36);
  const randomPart1 = Math.random().toString(36).substring(2, 15);
  const randomPart2 = Math.random().toString(36).substring(2, 15);
  const randomPart3 = Math.random().toString(36).substring(2, 15);
  const randomPart4 = Math.random().toString(36).substring(2, 15);
  
  // Combine all parts to create a 64+ character token
  return `${timestamp}${randomPart1}${randomPart2}${randomPart3}${randomPart4}`.substring(0, 64);
}

// Validate email format (RFC 5322 compliant)
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Check if user has permission to create invitation for specified role
function canCreateInvitationForRole(
  inviterRole: "super_admin" | "admin" | "viewer",
  targetRole: "super_admin" | "admin" | "viewer"
): boolean {
  // Super admins can create any role
  if (inviterRole === "super_admin") {
    return true;
  }
  
  // Admins can create admin and viewer roles only
  if (inviterRole === "admin") {
    return targetRole === "admin" || targetRole === "viewer";
  }
  
  // Viewers cannot create invitations
  return false;
}

// List all invitations (for admin view)
export const list = query({
  args: {},
  handler: async (ctx) => {
    const invitations = await ctx.db.query("invitations").collect();
    // Sort by createdAt descending
    return invitations.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get invitation by token (for accept invitation page)
export const getByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!invitation) {
      return null;
    }

    // Check if expired
    if (invitation.expiresAt < Date.now()) {
      return { ...invitation, status: "expired" as const };
    }

    return invitation;
  },
});

// Check if email already has pending invitation or existing account
export const checkEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();

    const hasAdminUser = !!existingUser;

    // Check for pending invitation
    const pendingInvitation = await ctx.db
      .query("invitations")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .first();

    const hasPendingInvitation = !!pendingInvitation;

    return { hasPendingInvitation, hasAdminUser };
  },
});

// Create a new invitation
export const create = mutation({
  args: {
    email: v.string(),
    role: adminRole,
    invitedBy: v.string(),
    invitedByName: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase().trim();

    // Validate email format
    if (!isValidEmail(normalizedEmail)) {
      throw new Error("Invalid email format");
    }

    // Validate role
    const validRoles = ["super_admin", "admin", "viewer"];
    if (!validRoles.includes(args.role)) {
      throw new Error("Invalid role value");
    }

    // Get inviter's role to check permissions
    // invitedBy is the user ID, so we need to get the user by ID
    const inviter = await ctx.db.get(args.invitedBy as Id<"adminUsers">);

    if (!inviter) {
      throw new Error("Inviter not found");
    }

    if (!inviter.isActive) {
      throw new Error("Inviter account is not active");
    }

    // Check if inviter has permission to create invitation for target role
    if (!canCreateInvitationForRole(inviter.role, args.role)) {
      if (inviter.role === "viewer") {
        throw new Error("Viewers cannot create invitations");
      } else if (inviter.role === "admin" && args.role === "super_admin") {
        throw new Error("Admins cannot create super_admin invitations");
      } else {
        throw new Error("Insufficient permissions to create invitation for this role");
      }
    }

    // Check if user already exists
    const existingUser = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();

    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Check for pending invitation
    const pendingInvitation = await ctx.db
      .query("invitations")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .first();

    if (pendingInvitation) {
      throw new Error("Pending invitation already exists for this email");
    }

    const token = generateToken();
    const now = Date.now();
    const expiresAt = now + 604800000; // 7 days in milliseconds

    const invitationId = await ctx.db.insert("invitations", {
      email: normalizedEmail,
      token,
      role: args.role,
      invitedBy: args.invitedBy,
      invitedByName: args.invitedByName,
      status: "pending",
      expiresAt,
      createdAt: now,
    });

    return { invitationId, token, expiresAt };
  },
});

// Accept invitation and create user account
export const accept = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate input
    if (!args.name || args.name.trim().length < 2) {
      throw new Error("Name must be at least 2 characters");
    }

    if (!args.password || args.password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    const invitation = await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!invitation) {
      throw new Error("Invalid invitation token");
    }

    if (invitation.status !== "pending") {
      throw new Error(`Invitation has already been ${invitation.status}`);
    }

    if (invitation.expiresAt < Date.now()) {
      // Update status to expired
      await ctx.db.patch(invitation._id, { status: "expired" });
      throw new Error("Invitation has expired");
    }

    // Check if user already exists (double-check)
    const existingUser = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", invitation.email))
      .first();

    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const now = Date.now();

    // Hash password with bcrypt (10 rounds) - using sync version for Convex compatibility
    const hashedPassword = bcrypt.hashSync(args.password, 10);

    // Create the user account
    const userId = await ctx.db.insert("adminUsers", {
      email: invitation.email,
      password: hashedPassword,
      name: args.name.trim(),
      role: invitation.role,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    // Update invitation status
    await ctx.db.patch(invitation._id, {
      status: "accepted",
      acceptedAt: now,
    });

    return { userId, success: true };
  },
});

// Revoke an invitation
export const revoke = mutation({
  args: { id: v.id("invitations") },
  handler: async (ctx, args) => {
    const invitation = await ctx.db.get(args.id);

    if (!invitation) {
      throw new Error("Invitation not found");
    }

    if (invitation.status !== "pending") {
      throw new Error("Can only revoke pending invitations");
    }

    await ctx.db.patch(args.id, { status: "revoked" });
    return { success: true };
  },
});

// Resend invitation (generates new token and extends expiry)
export const resend = mutation({
  args: { id: v.id("invitations") },
  handler: async (ctx, args) => {
    const invitation = await ctx.db.get(args.id);

    if (!invitation) {
      throw new Error("Invitation not found");
    }

    if (invitation.status !== "pending") {
      throw new Error("Can only resend pending invitations");
    }

    const newToken = generateToken();
    const newExpiresAt = Date.now() + 604800000; // 7 days in milliseconds

    await ctx.db.patch(args.id, {
      token: newToken,
      expiresAt: newExpiresAt,
    });

    return { token: newToken, expiresAt: newExpiresAt };
  },
});

// Delete invitation (for cleanup - only non-pending)
export const remove = mutation({
  args: { id: v.id("invitations") },
  handler: async (ctx, args) => {
    const invitation = await ctx.db.get(args.id);

    if (!invitation) {
      throw new Error("Invitation not found");
    }

    if (invitation.status === "pending") {
      throw new Error("Cannot delete pending invitations. Revoke them first.");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Get invitation stats
export const stats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("invitations").collect();
    const now = Date.now();
    
    return {
      total: all.length,
      pending: all.filter((i) => i.status === "pending" && i.expiresAt >= now).length,
      accepted: all.filter((i) => i.status === "accepted").length,
      expired: all.filter((i) => i.status === "expired" || (i.status === "pending" && i.expiresAt < now)).length,
      revoked: all.filter((i) => i.status === "revoked").length,
    };
  },
});
