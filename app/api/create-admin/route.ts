import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

/**
 * API route to create an initial admin user.
 * This should be disabled or protected in production!
 *
 * Usage: POST /api/create-admin
 * Body: { "email": "admin@example.com", "password": "yourpassword", "name": "Admin Name" }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const id = await convex.mutation(api.adminUsers.create, {
        email,
        password: hashedPassword,
        name,
        role: "super_admin",
      });

      const user = await convex.query(api.adminUsers.get, { id: id as any });

      return NextResponse.json({
        success: true,
        message: "Admin user created successfully",
        user: {
          id: user?._id ? String(user._id) : String(id),
          email: user?.email ?? email,
          name: user?.name ?? name,
          role: user?.role ?? "super_admin",
        },
      });
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
  } catch (error: any) {
    console.error("Error creating admin user:", error);
    return NextResponse.json({ error: "Failed to create admin user" }, { status: 500 });
  }
}
