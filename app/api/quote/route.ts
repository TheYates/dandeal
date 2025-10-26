import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { quoteSubmissions } from "@/lib/db/schema";
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
    const {
      firstName,
      lastName,
      email,
      phone,
      origin,
      destination,
      shippingMethod,
      cargoType,
      weight,
      date,
      notes,
    } = body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !origin ||
      !destination ||
      !shippingMethod ||
      !cargoType
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert into database
    const [submission] = await db
      .insert(quoteSubmissions)
      .values({
        firstName,
        lastName,
        email,
        phone,
        origin,
        destination,
        shippingMethod,
        cargoType,
        weight: weight || null,
        preferredDate: date || null,
        notes: notes || null,
      })
      .returning();

    // Send notification email (non-blocking)
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "quote",
        submission,
      }),
    }).catch((error) => console.error("Email notification failed:", error));

    return NextResponse.json(
      {
        success: true,
        message: "Quote request submitted successfully",
        id: submission.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting quote:", error);
    return NextResponse.json(
      { error: "Failed to submit quote request" },
      { status: 500 }
    );
  }
}
