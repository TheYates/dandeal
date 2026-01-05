import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

/**
 * API route to create an initial admin user
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

    // Create the admin user
    const [newUser] = await db
      .insert(adminUsers)
      .values({
        email,
        password: hashedPassword,
        name,
        role: "super_admin",
        isActive: true,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error("Error creating admin user:", error);
    
    if (error.code === "23505") {
      // Unique constraint violation
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 }
    );
  }
}
