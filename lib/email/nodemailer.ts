import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendEmail(
  to: string | string[],
  subject: string,
  html: string,
  text?: string
) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn("Email credentials not configured. Email not sent.");
      return {
        success: false,
        error: "Email credentials not configured",
        id: null,
      };
    }

    const result = await transporter.sendMail({
      from: `Dandeal <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text: text || html,
    });

    return {
      success: true,
      error: null,
      id: result.messageId,
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
