import { NextRequest, NextResponse } from "next/server";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

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
            "Retry-After": (
              rateLimitResult.reset - Math.floor(Date.now() / 1000)
            ).toString(),
          },
        }
      );
    }

    const body = await request.json();
    const { name, email, phone, service, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !service) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Insert into Convex
    const submissionId = await convex.mutation(api.consultations.create, {
      name,
      email,
      phone,
      service,
      message: message || undefined,
    });

    // Send notification email (non-blocking)
    fetch(new URL("/api/notifications", request.url), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "consultation",
        submission: { id: String(submissionId), name, email, phone, service, message },
      }),
    }).catch((error) => console.error("Email notification failed:", error));

    return NextResponse.json(
      {
        success: true,
        message: "Consultation request submitted successfully",
        id: String(submissionId),
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
