import { NextRequest, NextResponse } from "next/server";
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

// Enable ISR with 5 minute revalidation
export const revalidate = 300;

const defaultSettings = {
  phonePrimary: "+233 25 608 8845",
  phoneSecondary: "+233 25 608 8846",
  whatsapp: "+49 15212203183",
  whatsappLabel: "WhatsApp Us",
  showWhatsappInHeader: false,
  emailPrimary: "info@dandealimportation.com",
  emailSupport: "support@dandealimportation.com",
  displayPhonePrimary: true,
  displayPhoneSecondary: false,
  facebookUrl: "",
  instagramUrl: "",
  linkedinUrl: "",
  twitterUrl: "",
  tiktokUrl: "",
  displayFacebook: true,
  displayInstagram: true,
  displayLinkedin: true,
  displayTwitter: true,
  displayTiktok: true,
  officeKumasi: "Santasi",
  officeObuasi: "Mangoase",
  officeChina: "Guangzhou",
  businessHours: "Monday - Friday: 9:00 AM - 6:00 PM",
};

function formatPublicSettings(settings: any) {
  return {
    phonePrimary: settings.phonePrimary ?? null,
    phoneSecondary: settings.phoneSecondary ?? null,
    whatsapp: settings.whatsapp ?? null,
    whatsappLabel: settings.whatsappLabel ?? "WhatsApp Us",
    showWhatsappInHeader: settings.showWhatsappInHeader ?? false,
    emailPrimary: settings.emailPrimary ?? null,
    emailSupport: settings.emailSupport ?? null,
    displayPhonePrimary: settings.displayPhonePrimary ?? true,
    displayPhoneSecondary: settings.displayPhoneSecondary ?? false,
    facebookUrl: settings.facebookUrl ?? "",
    instagramUrl: settings.instagramUrl ?? "",
    linkedinUrl: settings.linkedinUrl ?? "",
    twitterUrl: settings.twitterUrl ?? "",
    tiktokUrl: settings.tiktokUrl ?? "",
    displayFacebook: settings.displayFacebook ?? true,
    displayInstagram: settings.displayInstagram ?? true,
    displayLinkedin: settings.displayLinkedin ?? true,
    displayTwitter: settings.displayTwitter ?? true,
    displayTiktok: settings.displayTiktok ?? true,
    officeKumasi: settings.officeKumasi ?? "",
    officeObuasi: settings.officeObuasi ?? "",
    officeChina: settings.officeChina ?? "",
    businessHours: settings.businessHours ?? "",
  };
}

// GET - Fetch site settings (public endpoint)
export async function GET(_request: NextRequest) {
  try {
    const settings = await convex.query(api.siteSettings.get, {});
    const data = settings ? formatPublicSettings(settings) : defaultSettings;

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
    // Keep the public site functional even if Convex is temporarily unavailable.
    return NextResponse.json(
      { settings: defaultSettings },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          Vary: "Accept-Encoding",
        },
      }
    );
  }
}
