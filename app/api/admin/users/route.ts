import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Helper function to check if user is super admin
async function checkSuperAdminRole(userId: string) {
  const admin = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.supabaseUserId, userId),
  });

  if (!admin || !admin.isActive || admin.role !== "super_admin") {
    return false;
  }

  return true;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isSuperAdmin = await checkSuperAdminRole(user.id);
    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: "Forbidden - Super admin access required" },
        { status: 403 }
      );
    }

    const users = await db.query.adminUsers.findMany({
      orderBy: (adminUsers, { desc }) => [desc(adminUsers.createdAt)],
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin users" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isSuperAdmin = await checkSuperAdminRole(user.id);
    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: "Forbidden - Super admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 });
    }

    // Add updated timestamp
    updates.updatedAt = new Date();

    const [updated] = await db
      .update(adminUsers)
      .set(updates)
      .where(eq(adminUsers.id, id))
      .returning();

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("Error updating admin user:", error);
    return NextResponse.json(
      { error: "Failed to update admin user" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isSuperAdmin = await checkSuperAdminRole(user.id);
    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: "Forbidden - Super admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, password, name, role, sendEmail = true } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create user in Supabase Auth using Admin API
    const adminClient = createAdminClient();
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: !sendEmail, // Auto-confirm if not sending email
      user_metadata: {
        name,
      },
    });

    if (authError || !authData.user) {
      console.error("Error creating auth user:", authError);
      return NextResponse.json(
        { error: authError?.message || "Failed to create user" },
        { status: 400 }
      );
    }

    // Add user to admin_users table
    const [newAdmin] = await db
      .insert(adminUsers)
      .values({
        supabaseUserId: authData.user.id,
        email,
        name,
        role,
        isActive: !sendEmail, // Only active if auto-confirmed
      })
      .returning();

    // Send confirmation email if requested
    if (sendEmail) {
      const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite`;
      const { error: emailError } = await adminClient.auth.admin.inviteUserByEmail(email, {
        redirectTo: redirectUrl,
        data: {
          name,
          role,
        },
      });

      if (emailError) {
        console.error("Error sending invite email:", emailError);
        // Don't fail the whole request if email fails
      }

      return NextResponse.json({ 
        success: true, 
        user: newAdmin,
        message: "User created and confirmation email sent"
      });
    }

    return NextResponse.json({ 
      success: true, 
      user: newAdmin,
      message: "User created and activated"
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isSuperAdmin = await checkSuperAdminRole(user.id);
    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: "Forbidden - Super admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 });
    }

    // Get the admin user to find their Supabase auth ID
    const adminUser = await db.query.adminUsers.findFirst({
      where: eq(adminUsers.id, userId),
    });

    if (!adminUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent deleting yourself
    if (adminUser.supabaseUserId === user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Delete from admin_users table
    await db.delete(adminUsers).where(eq(adminUsers.id, userId));

    // Delete from Supabase Auth
    const adminClient = createAdminClient();
    const { error: authError } = await adminClient.auth.admin.deleteUser(
      adminUser.supabaseUserId
    );

    if (authError) {
      console.error("Error deleting auth user:", authError);
      // User deleted from admin_users but not from auth - that's okay
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting admin user:", error);
    return NextResponse.json(
      { error: "Failed to delete admin user" },
      { status: 500 }
    );
  }
}
