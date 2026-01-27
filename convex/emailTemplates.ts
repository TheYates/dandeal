// Email template functions for different form types (Convex-side)
// Keep this file free of Next.js dependencies so it can run inside Convex actions.

export type FormType = "quote" | "consultation" | "contact";

interface EmailTemplateData {
  [key: string]: string | number | boolean | undefined | null;
}

const BRAND_COLOR = "#ea580c";
const BRAND_NAME = "Dandeal Logistics & Importation";

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

export function getEmailTemplate(
  formType: FormType,
  data: EmailTemplateData
): { subject: string; html: string; text: string } {
  const name =
    data.name || `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim();

  const base = {
    heading:
      formType === "quote"
        ? "New Quote Request"
        : formType === "consultation"
          ? "New Consultation Request"
          : "New Contact Message",
    subject:
      formType === "quote"
        ? `New Quote Request from ${data.firstName ?? ""} ${data.lastName ?? ""}`.trim()
        : formType === "consultation"
          ? `New Consultation Request from ${name}`.trim()
          : `New Contact Message from ${name}`.trim(),
  };

  const fields: Array<[string, unknown]> =
    formType === "quote"
      ? [
          ["Name", name],
          ["Email", data.email],
          ["Phone", data.phone],
          ["Origin", data.origin],
          ["Destination", data.destination],
          ["Shipping Method", data.shippingMethod],
          ["Cargo Type", data.cargoType],
          ["Weight", data.weight ?? "Not specified"],
          ["Preferred Date", data.preferredDate ?? "Not specified"],
          ["Notes", data.notes ?? "None"],
        ]
      : formType === "consultation"
        ? [
            ["Name", name],
            ["Email", data.email],
            ["Phone", data.phone],
            ["Service", data.service],
            ["Message", data.message ?? ""],
          ]
        : [
            ["Name", name],
            ["Email", data.email],
            ["Phone", data.phone ?? "Not provided"],
            ["Subject", data.subject],
            ["Message", data.message],
          ];

  const text = [
    base.heading,
    "",
    ...fields.map(([k, v]) => `${k}: ${String(v ?? "")}`),
  ].join("\n");

  const rows = fields
    .map(
      ([k, v]) => `
        <tr>
          <td style="padding: 8px 0; font-weight: 600; width: 140px; vertical-align: top;">${escapeHtml(k)}:</td>
          <td style="padding: 8px 0;">${escapeHtml(v)}</td>
        </tr>`
    )
    .join("\n");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(base.heading)}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827; margin: 0; padding: 0;">
        <div style="max-width: 640px; margin: 0 auto; padding: 24px;">
          <div style="background: ${BRAND_COLOR}; color: white; padding: 18px 20px; border-radius: 10px 10px 0 0;">
            <div style="font-size: 18px; font-weight: 700;">${escapeHtml(BRAND_NAME)}</div>
            <div style="opacity: 0.95; margin-top: 4px;">${escapeHtml(base.heading)}</div>
          </div>

          <div style="border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; padding: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              ${rows}
            </table>
          </div>

          <div style="margin-top: 14px; font-size: 12px; color: #6b7280;">
            Sent automatically from ${escapeHtml(BRAND_NAME)}.
          </div>
        </div>
      </body>
    </html>
  `.trim();

  return { subject: base.subject || base.heading, html, text };
}
