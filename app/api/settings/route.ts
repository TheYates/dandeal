import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch site settings (public endpoint)
export async function GET() {
  try {
    // Fetch settings (there should only be one row)
    const settings = await db.query.siteSettings.findFirst();

    if (!settings) {
      // Return default values if no settings exist
      return NextResponse.json({
        settings: {
          phonePrimary: "+233 25 608 8845",
          phoneSecondary: "+233 25 608 8846",
          whatsapp: "+49 15212203183",
          emailPrimary: "info@dandealimportation.com",
          emailSupport: "support@dandealimportation.com",
          facebookUrl: "",
          instagramUrl: "",
          linkedinUrl: "",
          twitterUrl: "",
          officeKumasi: "Santasi",
          officeObuasi: "Mangoase",
          officeChina: "Guangzhou",
          businessHours: "Monday - Friday: 9:00 AM - 6:00 PM",
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

