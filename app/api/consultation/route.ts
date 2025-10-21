import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { consultationSubmissions } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, service, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !service) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert into database
    const [submission] = await db
      .insert(consultationSubmissions)
      .values({
        name,
        email,
        phone,
        service,
        message: message || null,
      })
      .returning();

    // Send notification email (non-blocking)
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "consultation",
        submission,
      }),
    }).catch((error) => console.error("Email notification failed:", error));

    return NextResponse.json(
      {
        success: true,
        message: "Consultation request submitted successfully",
        id: submission.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting consultation:", error);
    return NextResponse.json(
      { error: "Failed to submit consultation request" },
      { status: 500 }
    );
  }
}
