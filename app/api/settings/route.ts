import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

// Enable ISR with 5 minute revalidation
export const revalidate = 300;

// Helper function to format settings for public API
function formatPublicSettings(dbSettings: any) {
  return {
    phonePrimary: dbSettings.phonePrimary,
    phoneSecondary: dbSettings.phoneSecondary,
    whatsapp: dbSettings.whatsapp,
    whatsappLabel: dbSettings.whatsappLabel ?? "WhatsApp Us",
    showWhatsappInHeader: dbSettings.showWhatsappInHeader ?? false,
    emailPrimary: dbSettings.emailPrimary,
    emailSupport: dbSettings.emailSupport,
    facebookUrl: dbSettings.facebookUrl,
    instagramUrl: dbSettings.instagramUrl,
    linkedinUrl: dbSettings.linkedinUrl,
    twitterUrl: dbSettings.twitterUrl,
    officeKumasi: dbSettings.officeKumasi,
    officeObuasi: dbSettings.officeObuasi,
    officeChina: dbSettings.officeChina,
    businessHours: dbSettings.businessHours,
  };
}

// GET - Fetch site settings (public endpoint)
export async function GET(request: NextRequest) {
  try {
    // Fetch settings (there should only be one row)
    const settings = await db.query.siteSettings.findFirst();

    const data = settings || {
      phonePrimary: "+233 25 608 8845",
      phoneSecondary: "+233 25 608 8846",
      whatsapp: "+49 15212203183",
      whatsappLabel: "WhatsApp Us",
      showWhatsappInHeader: false,
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
    };

    return NextResponse.json(
      { settings: data },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          "CDN-Cache-Control": "public, s-maxage=3600",
          Vary: "Accept-Encoding",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}
