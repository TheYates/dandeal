import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/nodemailer";
import { getEmailTemplate } from "@/lib/email/templates";
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

export async function POST(request: NextRequest) {
  try {
    const { type, submission } = await request.json();

    if (!type || !submission) {
      return NextResponse.json({ error: "Missing type or submission" }, { status: 400 });
    }

    const normalizedType = String(type).toLowerCase();
    if (!["quote", "consultation", "contact"].includes(normalizedType)) {
      return NextResponse.json(
        { error: `Unsupported notification type: ${type}` },
        { status: 400 }
      );
    }

    const parseEmailList = (value: unknown): string[] => {
      if (typeof value !== "string") return [];
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
      } catch {
        return [];
      }
    };

    const normalizeEmails = (emails: string[]): string[] => {
      const isValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      return [...new Set(emails.map((e) => e.trim()).filter((e) => e && isValid(e)))];
    };

    // Convex-only settings resolution
    const convexGlobalSettings = await convex.query(api.siteSettings.get, {});

    const globalEnabled = Boolean(convexGlobalSettings?.globalEmailEnabled);
    const rawGlobalEmail = String(convexGlobalSettings?.globalEmail ?? "");
    const overrideIndividuals = Boolean(
      convexGlobalSettings?.overrideIndividualEmailSettings
    );

    let recipientEmails: string[] = [];

    // Support a single address or a comma/semicolon separated list.
    const globalEmails = rawGlobalEmail
      .split(/[;,]/g)
      .map((e) => e.trim())
      .filter(Boolean);

    if (globalEnabled && globalEmails.length > 0) {
      recipientEmails = globalEmails;

      if (!overrideIndividuals) {
        const perForm = await convex.query(api.emailSettings.getByFormType, {
          formType: normalizedType,
        });
        if (perForm?.enabled) {
          recipientEmails = recipientEmails.concat(parseEmailList(perForm.recipientEmails));
        }
      }
    } else {
      const perForm = await convex.query(api.emailSettings.getByFormType, {
        formType: normalizedType,
      });

      if (!perForm || !perForm.enabled) {
        return NextResponse.json({
          success: true,
          message: "Notifications disabled for this form type",
        });
      }

      recipientEmails = parseEmailList(perForm.recipientEmails);
    }

    recipientEmails = normalizeEmails(recipientEmails);

    if (recipientEmails.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No recipients configured",
      });
    }

    // Get email template
    const emailData = {
      ...submission,
      name: submission.name || `${submission.firstName ?? ""} ${submission.lastName ?? ""}`.trim(),
    };

    const { subject, html, text } = getEmailTemplate(
      normalizedType as "quote" | "consultation" | "contact",
      emailData,
      true
    );

    // Send emails + log results in Convex
    const results = await Promise.all(
      recipientEmails.map(async (email) => {
        const result = await sendEmail(email, subject, html, text);

        await convex
          .mutation(api.emailLogs.create, {
            formType: normalizedType,
            submissionId: submission?.id ? String(submission.id) : undefined,
            recipientEmail: email,
            subject,
            status: result.success ? "sent" : "failed",
            errorMessage: result.error || undefined,
            sentAt: result.success ? Date.now() : undefined,
          })
          .catch((err) => console.error("Failed to log email:", err));

        return result;
      })
    );

    const successCount = results.filter((r) => r.success).length;

    return NextResponse.json({
      success: true,
      message: `Emails sent to ${successCount}/${recipientEmails.length} recipients`,
      details: results,
    });
  } catch (error) {
    console.error("Error processing notification:", error);
    return NextResponse.json({ error: "Failed to process notification" }, { status: 500 });
  }
}
