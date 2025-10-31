import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/resend";
import { getEmailTemplate } from "@/lib/email/templates";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formType, testEmail } = body;

    if (!formType || !testEmail) {
      return NextResponse.json(
        { error: "Missing formType or testEmail" },
        { status: 400 }
      );
    }

    // Create sample data for the test email
    const sampleData: Record<string, any> = {
      quote: {
        firstName: "John",
        lastName: "Doe",
        email: testEmail,
        phone: "+1234567890",
        origin: "New York",
        destination: "Los Angeles",
        shippingMethod: "Air",
        cargoType: "Electronics",
        weight: "100 kg",
        preferredDate: new Date().toISOString().split("T")[0],
        notes: "This is a test email",
      },
      consultation: {
        name: "Jane Smith",
        email: testEmail,
        phone: "+1234567890",
        service: "Freight Forwarding",
        message: "This is a test consultation email",
      },
      contact: {
        name: "Bob Johnson",
        email: testEmail,
        phone: "+1234567890",
        subject: "Test Contact Message",
        message: "This is a test contact email",
      },
    };

    const data = sampleData[formType] || sampleData.quote;

    // Get email template
    const { subject, html, text } = getEmailTemplate(
      formType as "quote" | "consultation" | "contact",
      data,
      true
    );

    // Send test email
    const result = await sendEmail(testEmail, subject, html, text);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully",
        emailId: result.id,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending test email:", error);
    return NextResponse.json(
      { error: "Failed to send test email" },
      { status: 500 }
    );
  }
}

