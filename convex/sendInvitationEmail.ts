"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import nodemailer from "nodemailer";

// Send invitation email using Gmail SMTP
export const sendInvitationEmail = action({
  args: {
    email: v.string(),
    token: v.string(),
    role: v.string(),
    invitedByName: v.string(),
    // Optional explicit base URL for invite links (e.g. https://app.example.com)
    baseUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const emailHost = process.env.EMAIL_HOST;
    const emailPort = process.env.EMAIL_PORT;
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;
    const emailFrom = process.env.EMAIL_FROM;
    
    if (!emailHost || !emailUser || !emailPassword) {
      console.warn("Email SMTP not configured. Email not sent.");
      return {
        success: false,
        error: "Email service not configured",
      };
    }

    // Create transporter for Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: parseInt(emailPort || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });
    
    // Build the invitation URL
    // IMPORTANT: This code runs inside Convex (not your Next.js server runtime),
    // so it will only see environment variables configured in Convex.
    //
    // Prefer a server-side URL (e.g. APP_URL) and fail loudly in production
    // instead of silently falling back to localhost.
    const explicitBaseUrl = (args.baseUrl ?? "").trim().replace(/\/$/, "");

    const rawEnvBaseUrl =
      process.env.APP_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXTAUTH_URL ||
      "";

    const envBaseUrl = rawEnvBaseUrl.replace(/\/$/, "");
    const baseUrl = explicitBaseUrl || envBaseUrl;

    // Never silently send localhost links unless we're truly in a dev environment.
    if (!baseUrl) {
      // Convex doesn't reliably expose NODE_ENV, so treat missing baseUrl as a configuration error.
      throw new Error(
        "Missing base URL for invitation links. Provide args.baseUrl or configure APP_URL in Convex env vars."
      );
    }

    const inviteUrl = `${baseUrl}/accept-invite?token=${encodeURIComponent(args.token)}`;
    
    const roleName = args.role === "super_admin" ? "Super Admin" : args.role === "admin" ? "Admin" : "Viewer";

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>You're Invited to Dandeal Admin</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">You're Invited!</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hello,</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              <strong>${args.invitedByName}</strong> has invited you to join the <strong>Dandeal Admin Panel</strong> as a <strong>${roleName}</strong>.
            </p>
            
            <p style="font-size: 16px; margin-bottom: 30px;">
              Click the button below to accept your invitation and create your account:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteUrl}" 
                 style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); 
                        color: white; 
                        padding: 14px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold;
                        font-size: 16px;
                        display: inline-block;">
                Accept Invitation
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Or copy and paste this link into your browser:
            </p>
            <p style="font-size: 14px; color: #f97316; word-break: break-all;">
              ${inviteUrl}
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999; text-align: center;">
              This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Dandeal. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    const text = `
You're Invited to Dandeal Admin!

Hello,

${args.invitedByName} has invited you to join the Dandeal Admin Panel as a ${roleName}.

Click the link below to accept your invitation and create your account:
${inviteUrl}

This invitation will expire in 7 days.

If you didn't expect this invitation, you can safely ignore this email.

© ${new Date().getFullYear()} Dandeal. All rights reserved.
    `.trim();

    try {
      // Send email using Nodemailer
      const info = await transporter.sendMail({
        from: `"Dandeal Admin" <${emailFrom}>`,
        to: args.email,
        subject: "You're invited to join Dandeal Admin",
        html,
        text,
      });

      console.log("Email sent successfully:", info.messageId);

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error("Email sending error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
