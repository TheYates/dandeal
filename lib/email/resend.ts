import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn(
    "RESEND_API_KEY is not set. Email notifications will not be sent."
  );
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(
  to: string | string[],
  subject: string,
  html: string,
  text?: string
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not configured. Email not sent.");
      return {
        success: false,
        error: "RESEND_API_KEY not configured",
        id: null,
      };
    }

    const result = await resend.emails.send({
      from: "Dandeal <noreply@dandeal.com>",
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text: text || html,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return {
        success: false,
        error: result.error.message,
        id: null,
      };
    }

    return {
      success: true,
      error: null,
      id: result.data?.id || null,
    };
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      id: null,
    };
  }
}

