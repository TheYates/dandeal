import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, role } = body;

    console.log("Invite email request received:", { name, email, role });

    if (!name || !email || !role) {
      console.error("Missing required fields:", { name, email, role });
      return NextResponse.json(
        { error: "Missing required fields: name, email, role" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.query.adminUsers.findFirst({
      where: eq(adminUsers.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Create user in Supabase Auth using Admin API
    const adminClient = createAdminClient();

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-12);

    console.log("Creating Supabase user with email:", email);

    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: false, // Require email confirmation
      user_metadata: {
        name,
      },
    });

    if (authError) {
      console.error("Error creating auth user:", authError);
      return NextResponse.json(
        { error: `Failed to create user: ${authError.message}` },
        { status: 400 }
      );
    }

    if (!authData?.user) {
      console.error("No user data returned from Supabase");
      return NextResponse.json(
        { error: "Failed to create user - no user data returned" },
        { status: 400 }
      );
    }

    console.log("Supabase user created successfully:", authData.user.id);

    // Add user to admin_users table
    // Map role to enum values (admin -> admin, viewer -> viewer)
    const roleEnum = role.toLowerCase() === "admin" ? "admin" : "viewer";

    console.log("Inserting user into database with role:", roleEnum);

    let newAdmin;
    try {
      const result = await db
        .insert(adminUsers)
        .values({
          supabaseUserId: authData.user.id,
          email,
          name,
          role: roleEnum as "admin" | "viewer",
          isActive: false, // Not active until email is confirmed
        })
        .returning();

      newAdmin = result[0];
      console.log("User inserted successfully:", newAdmin.id);
    } catch (dbError) {
      console.error("Error inserting user into database:", dbError);
      // Delete the Supabase user if database insert fails
      await adminClient.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: `Failed to save user to database: ${dbError instanceof Error ? dbError.message : "Unknown error"}` },
        { status: 400 }
      );
    }

    // Send invitation email
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/invite`;

    console.log("Sending invitation email to:", email, "with redirect URL:", redirectUrl);

    const { error: emailError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      redirectTo: redirectUrl,
      data: {
        name,
        role,
        requirePasswordChange: true,
      },
    });

    if (emailError) {
      console.error("Error sending invite email:", emailError);
      return NextResponse.json(
        {
          success: false,
          message: "User created but failed to send invitation email",
          error: emailError.message
        },
        { status: 500 }
      );
    }

    console.log("Invitation email sent successfully to:", email);

    return NextResponse.json({
      success: true,
      user: newAdmin,
      message: "User created and invitation email sent successfully",
    });
  } catch (error) {
    console.error("Error in send-invite-email:", error);
    return NextResponse.json(
      { error: "Failed to send invitation email" },
      { status: 500 }
    );
  }
}

