import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emailNotificationSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Initialize email notification settings for all form types
 * This endpoint creates default email settings if they don't exist
 * 
 * Usage: POST /api/admin/email-settings/init
 * Body: { recipientEmail: "email@example.com" }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipientEmail } = body;

    if (!recipientEmail) {
      return NextResponse.json(
        { error: "recipientEmail is required" },
        { status: 400 }
      );
    }

    const formTypes = ["quote", "consultation", "contact"];
    const results = [];

    for (const formType of formTypes) {
      // Check if settings already exist
      const existing = await db.query.emailNotificationSettings.findFirst({
        where: eq(emailNotificationSettings.formType, formType),
      });

      if (existing) {
        // Update existing settings to add the recipient email if not already there
        const currentEmails = JSON.parse(existing.recipientEmails || "[]");
        if (!currentEmails.includes(recipientEmail)) {
          currentEmails.push(recipientEmail);
        }

        const updated = await db
          .update(emailNotificationSettings)
          .set({
            recipientEmails: JSON.stringify(currentEmails),
            enabled: true,
            updatedAt: new Date(),
          })
          .where(eq(emailNotificationSettings.formType, formType))
          .returning();

        results.push({
          formType,
          status: "updated",
          recipientEmails: currentEmails,
        });
      } else {
        // Create new settings
        const inserted = await db
          .insert(emailNotificationSettings)
          .values({
            formType,
            recipientEmails: JSON.stringify([recipientEmail]),
            enabled: true,
            includeFormData: true,
          })
          .returning();

        results.push({
          formType,
          status: "created",
          recipientEmails: [recipientEmail],
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Email notification settings initialized",
      results,
    });
  } catch (error) {
    console.error("Error initializing email settings:", error);
    return NextResponse.json(
      { error: "Failed to initialize email settings" },
      { status: 500 }
    );
  }
}

