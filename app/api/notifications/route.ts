import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { type, submission } = await request.json();

    const adminEmails = process.env.ADMIN_NOTIFICATION_EMAILS?.split(",") || [];
    const fromEmail =
      process.env.NOTIFICATION_EMAIL_FROM || "notifications@dandeal.com";

    if (adminEmails.length === 0) {
      console.warn("No admin emails configured for notifications");
      return NextResponse.json({
        success: true,
        message: "No recipients configured",
      });
    }

    let subject = "";
    let html = "";

    if (type === "consultation") {
      subject = `New Consultation Request from ${submission.name}`;
      html = `
        <h2>New Consultation Request</h2>
        <p><strong>Name:</strong> ${submission.name}</p>
        <p><strong>Email:</strong> ${submission.email}</p>
        <p><strong>Phone:</strong> ${submission.phone}</p>
        <p><strong>Service:</strong> ${submission.service}</p>
        <p><strong>Message:</strong> ${submission.message || "N/A"}</p>
        <p><strong>Submitted:</strong> ${new Date(
          submission.createdAt
        ).toLocaleString()}</p>
        <br />
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/consultations/${
        submission.id
      }" 
           style="background-color: #ea580c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View in Dashboard
        </a>
      `;
    } else if (type === "quote") {
      subject = `New Quote Request from ${submission.firstName} ${submission.lastName}`;
      html = `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${submission.firstName} ${
        submission.lastName
      }</p>
        <p><strong>Email:</strong> ${submission.email}</p>
        <p><strong>Phone:</strong> ${submission.phone}</p>
        <p><strong>Origin:</strong> ${submission.origin}</p>
        <p><strong>Destination:</strong> ${submission.destination}</p>
        <p><strong>Shipping Method:</strong> ${submission.shippingMethod}</p>
        <p><strong>Cargo Type:</strong> ${submission.cargoType}</p>
        <p><strong>Weight/Volume:</strong> ${submission.weight || "N/A"}</p>
        <p><strong>Preferred Date:</strong> ${
          submission.preferredDate || "N/A"
        }</p>
        <p><strong>Notes:</strong> ${submission.notes || "N/A"}</p>
        <p><strong>Submitted:</strong> ${new Date(
          submission.createdAt
        ).toLocaleString()}</p>
        <br />
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/quotes/${
        submission.id
      }" 
           style="background-color: #ea580c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View in Dashboard
        </a>
      `;
    }

    // Send email to all admin emails
    await resend.emails.send({
      from: fromEmail,
      to: adminEmails,
      subject,
      html,
    });

    return NextResponse.json({ success: true, message: "Notification sent" });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
