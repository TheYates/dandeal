"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { anyApi } from "convex/server";

// NOTE: We intentionally use `anyApi` for ctx.runQuery/runMutation inside this module.
// Using the typed `api` object here can create a self-referential type dependency
// during codegen/typechecking because this file itself contributes to the generated API.
const api = anyApi;
import nodemailer from "nodemailer";
import { getEmailTemplate, type FormType } from "./emailTemplates";

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

async function resolveRecipientEmails(ctx: any, formType: FormType): Promise<string[]> {
  const settings = await ctx.runQuery(api.siteSettings.get, {});

  const globalEnabled = Boolean(settings?.globalEmailEnabled);
  const rawGlobalEmail = String(settings?.globalEmail ?? "");
  const overrideIndividuals = Boolean(settings?.overrideIndividualEmailSettings);

  let recipientEmails: string[] = [];

  const globalEmails = rawGlobalEmail
    .split(/[;,]/g)
    .map((e: string) => e.trim())
    .filter(Boolean);

  if (globalEnabled && globalEmails.length > 0) {
    recipientEmails = globalEmails;

    if (!overrideIndividuals) {
      const perForm = await ctx.runQuery(api.emailSettings.getByFormType, {
        formType,
      });
      if (perForm?.enabled) {
        recipientEmails = recipientEmails.concat(parseEmailList(perForm.recipientEmails));
      }
    }
  } else {
    const perForm = await ctx.runQuery(api.emailSettings.getByFormType, { formType });
    if (!perForm || !perForm.enabled) {
      return [];
    }
    recipientEmails = parseEmailList(perForm.recipientEmails);
  }

  return normalizeEmails(recipientEmails);
}

function getTransporter() {
  const emailHost = process.env.EMAIL_HOST;
  const emailPort = process.env.EMAIL_PORT;
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  if (!emailHost || !emailUser || !emailPassword) {
    return null;
  }

  return nodemailer.createTransport({
    host: emailHost,
    port: parseInt(emailPort || "587"),
    secure: false,
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });
}

async function sendNotificationEmails(ctx: any, formType: FormType, submission: any) {
  const recipients = await resolveRecipientEmails(ctx, formType);
  if (recipients.length === 0) {
    console.warn(`[Convex Notifications] No recipients configured for ${formType}`);
    return;
  }

  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[Convex Notifications] SMTP not configured. Emails not sent.");
    // Still log failures so admin sees why nothing went out.
    await Promise.all(
      recipients.map((email) =>
        ctx.runMutation(api.emailLogs.create, {
          formType,
          submissionId: submission?._id ? String(submission._id) : undefined,
          recipientEmail: email,
          subject: `Notification (${formType})`,
          status: "failed",
          errorMessage: "Email service not configured (missing EMAIL_HOST/EMAIL_USER/EMAIL_PASSWORD)",
        })
      )
    );
    return;
  }

  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  const emailData = {
    ...submission,
    name: submission?.name || `${submission?.firstName ?? ""} ${submission?.lastName ?? ""}`.trim(),
  };

  const { subject, html, text } = getEmailTemplate(formType, emailData);

  await Promise.all(
    recipients.map(async (email) => {
      let status: "sent" | "failed" = "sent";
      let errorMessage: string | undefined;
      let sentAt: number | undefined;

      try {
        const info = await transporter.sendMail({
          from: `Dandeal <${from}>`,
          to: email,
          subject,
          html,
          text,
        });
        sentAt = Date.now();
        console.log(`[Convex Notifications] Sent ${formType} notification to ${email}:`, info.messageId);
      } catch (err) {
        status = "failed";
        errorMessage = err instanceof Error ? err.message : "Unknown error";
        console.error(`[Convex Notifications] Failed sending to ${email}:`, err);
      }

      await ctx
        .runMutation(api.emailLogs.create, {
          formType,
          submissionId: submission?._id ? String(submission._id) : undefined,
          recipientEmail: email,
          subject,
          status,
          errorMessage,
          sentAt,
        })
        .catch((logErr: unknown) => console.error("Failed to log email:", logErr));
    })
  );
}

// Public actions used by the website forms.
// They create the submission in Convex then send notification emails.

export const submitQuote = action({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    origin: v.string(),
    destination: v.string(),
    shippingMethod: v.string(),
    cargoType: v.string(),
    weight: v.optional(v.string()),
    preferredDate: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.runMutation(api.quotes.create, args);
    const submission = await ctx.runQuery(api.quotes.get, { id });
    await sendNotificationEmails(ctx, "quote", submission);
    return id;
  },
});

export const submitConsultation = action({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    service: v.string(),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.runMutation(api.consultations.create, args);
    const submission = await ctx.runQuery(api.consultations.get, { id });
    await sendNotificationEmails(ctx, "consultation", submission);
    return id;
  },
});

export const submitContact = action({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.runMutation(api.contacts.create, args);
    const submission = await ctx.runQuery(api.contacts.get, { id });
    await sendNotificationEmails(ctx, "contact", submission);
    return id;
  },
});
