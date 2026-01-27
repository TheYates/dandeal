import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import bcrypt from "bcryptjs";

async function checkSuperAdminRole(email: string) {
  const admin = await convex.query(api.adminUsers.getByEmail, { email });
  return Boolean(admin && admin.isActive && admin.role === "super_admin");
}

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isSuperAdmin = await checkSuperAdminRole(session.user.email);
    if (!isSuperAdmin) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const users = await convex.query(api.adminUsers.list, {});
    // Keep latest-first ordering similar to old route
    users.sort((a: any, b: any) => (b.createdAt ?? 0) - (a.createdAt ?? 0));

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json({ error: "Failed to fetch admin users" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isSuperAdmin = await checkSuperAdminRole(session.user.email);
    if (!isSuperAdmin) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await request.json();
    const { id, updates } = body as { id?: string; updates?: Record<string, unknown> };

    if (!id) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 });
    }

    await convex.mutation(api.adminUsers.update, {
      id: id as any,
      ...(updates as any),
    });

    const user = await convex.query(api.adminUsers.get, { id: id as any });
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error updating admin user:", error);
    return NextResponse.json({ error: "Failed to update admin user" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isSuperAdmin = await checkSuperAdminRole(session.user.email);
    if (!isSuperAdmin) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await request.json();
    const { email, password, name, role } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const id = await convex.mutation(api.adminUsers.create, {
        email,
        password: hashedPassword,
        name,
        role,
      });

      const user = await convex.query(api.adminUsers.get, { id: id as any });
      return NextResponse.json(
        { success: true, user, message: "User created successfully" },
        { status: 201 }
      );
    } catch (err: any) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.toLowerCase().includes("exists")) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 }
        );
      }
      throw err;
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json({ error: "Failed to create admin user" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isSuperAdmin = await checkSuperAdminRole(session.user.email);
    if (!isSuperAdmin) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 });
    }

    const user = await convex.query(api.adminUsers.get, { id: userId as any });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.email === session.user.email) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    await convex.mutation(api.adminUsers.remove, { id: userId as any });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting admin user:", error);
    return NextResponse.json({ error: "Failed to delete admin user" }, { status: 500 });
  }
}
