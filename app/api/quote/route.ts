import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { quoteSubmissions } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
  try {
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
