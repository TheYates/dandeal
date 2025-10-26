import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/db/schema";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, RATE_LIMITS.FORM_SUBMISSION);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: "Too many requests. Please try again later.",
          retryAfter: rateLimitResult.reset,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.reset.toString(),
            "Retry-After": (rateLimitResult.reset - Math.floor(Date.now() / 1000)).toString(),
          },
        }
      );
    }

    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert into database
    const [submission] = await db
      .insert(contactSubmissions)
      .values({
        name,
        email,
        phone: phone || null,
        subject,
        message,
      })
      .returning();

    // Send notification email (non-blocking)
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "contact",
        submission,
      }),
    }).catch((error) => console.error("Email notification failed:", error));

    return NextResponse.json(
      {
        success: true,
        message: "Contact message submitted successfully",
        id: submission.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting contact message:", error);
    return NextResponse.json(
      { error: "Failed to submit contact message" },
      { status: 500 }
    );
  }
}

