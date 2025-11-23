import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emailNotificationSettings, emailLogs, siteSettings } from "@/lib/db/schema";
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

    // Check for global email settings first
    const globalSettings = await db.query.siteSettings.findFirst();
    let recipientEmails: string[] = [];

    if (globalSettings?.globalEmailEnabled && globalSettings.globalEmail) {
      // Use global email settings
      recipientEmails = [globalSettings.globalEmail];
      
      // If override is enabled, skip individual settings check
      if (globalSettings.overrideIndividualEmailSettings) {
        console.log(`Using global email override for form type: ${type}`);
      } else {
        // Add individual recipients if not overriding
        const settings = await db.query.emailNotificationSettings.findFirst({
          where: eq(emailNotificationSettings.formType, type),
        });

        if (settings && settings.enabled) {
          try {
            const individualEmails = JSON.parse(settings.recipientEmails || "[]");
            recipientEmails = [...recipientEmails, ...individualEmails];
          } catch (e) {
            console.error("Failed to parse individual recipient emails:", e);
          }
        }
      }
    } else {
      // Use individual form type settings
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
      try {
        recipientEmails = JSON.parse(settings.recipientEmails || "[]");
      } catch (e) {
        console.error("Failed to parse recipient emails:", e);
        recipientEmails = [];
      }
    }

    // Remove duplicates and filter out empty emails
    recipientEmails = [...new Set(recipientEmails.filter(email => email.trim()))];

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
