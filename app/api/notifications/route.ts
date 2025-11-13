import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emailNotificationSettings, emailLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/email/nodemailer";
import { getEmailTemplate } from "@/lib/email/templates";

export async function POST(request: NextRequest) {
  try {
    const { type, submission } = await request.json();

    if (!type || !submission) {
      return NextResponse.json(
        { error: "Missing type or submission" },
        { status: 400 }
      );
    }

    // Get email settings for this form type
    const settings = await db.query.emailNotificationSettings.findFirst({
      where: eq(emailNotificationSettings.formType, type),
    });

    if (!settings || !settings.enabled) {
      console.warn(`Email notifications disabled for form type: ${type}`);
      return NextResponse.json({
        success: true,
        message: "Notifications disabled for this form type",
      });
    }

    // Parse recipient emails
    let recipientEmails: string[] = [];
    try {
      recipientEmails = JSON.parse(settings.recipientEmails || "[]");
    } catch (e) {
      console.error("Failed to parse recipient emails:", e);
      recipientEmails = [];
    }

    if (recipientEmails.length === 0) {
      console.warn(`No recipient emails configured for form type: ${type}`);
      return NextResponse.json({
        success: true,
        message: "No recipients configured",
      });
    }

    // Get email template
    const emailData = {
      ...submission,
      name: submission.name || `${submission.firstName} ${submission.lastName}`,
    };

    const { subject, html, text } = getEmailTemplate(
      type as "quote" | "consultation" | "contact",
      emailData,
      true
    );

    // Send emails to all recipients
    const emailPromises = recipientEmails.map(async (email) => {
      const result = await sendEmail(email, subject, html, text);

      // Log the email attempt
      await db
        .insert(emailLogs)
        .values({
          formType: type,
          submissionId: submission.id,
          recipientEmail: email,
          subject,
          status: result.success ? "sent" : "failed",
          errorMessage: result.error || null,
          sentAt: result.success ? new Date() : null,
        })
        .catch((err) => console.error("Failed to log email:", err));

      return result;
    });

    const results = await Promise.all(emailPromises);
    const successCount = results.filter((r) => r.success).length;

    return NextResponse.json({
      success: true,
      message: `Emails sent to ${successCount}/${recipientEmails.length} recipients`,
      details: results,
    });
  } catch (error) {
    console.error("Error processing notification:", error);
    return NextResponse.json(
      { error: "Failed to process notification" },
      { status: 500 }
    );
  }
}
