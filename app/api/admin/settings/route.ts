import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

// Helper function to convert Convex settings to the admin API response format
function formatSettingsResponse(settings: any) {
  return {
    phonePrimary: settings?.phonePrimary ?? null,
    phoneSecondary: settings?.phoneSecondary ?? null,
    whatsapp: settings?.whatsapp ?? null,
    whatsappLabel: settings?.whatsappLabel ?? "WhatsApp Us",
    showWhatsappInHeader: settings?.showWhatsappInHeader ?? false,
    emailPrimary: settings?.emailPrimary ?? null,
    emailSupport: settings?.emailSupport ?? null,
    displayPhonePrimary: settings?.displayPhonePrimary ?? true,
    displayPhoneSecondary: settings?.displayPhoneSecondary ?? false,
    facebookUrl: settings?.facebookUrl ?? "",
    instagramUrl: settings?.instagramUrl ?? "",
    linkedinUrl: settings?.linkedinUrl ?? "",
    twitterUrl: settings?.twitterUrl ?? "",
    tiktokUrl: settings?.tiktokUrl ?? "",
    displayFacebook: settings?.displayFacebook ?? true,
    displayInstagram: settings?.displayInstagram ?? true,
    displayLinkedin: settings?.displayLinkedin ?? true,
    displayTwitter: settings?.displayTwitter ?? true,
    displayTiktok: settings?.displayTiktok ?? true,
    officeLocations: [
      {
        city: settings?.officeKumasi ?? "",
        region: "Kumasi",
        country: "Ghana",
      },
      {
        city: settings?.officeObuasi ?? "",
        region: "Obuasi - Ashanti Region",
        country: "Ghana",
      },
      {
        city: settings?.officeChina ?? "",
        region: "China Office",
        country: "China",
      },
    ],
    businessHours: settings?.businessHours ?? "",
  };
}

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await convex.query(api.siteSettings.get, {});

    if (!settings) {
      // Keep previous defaults
      return NextResponse.json({
        settings: {
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
          officeLocations: [
            { city: "Santasi", region: "Kumasi", country: "Ghana" },
            {
              city: "Mangoase",
              region: "Obuasi - Ashanti Region",
              country: "Ghana",
            },
            { city: "Guangzhou", region: "China Office", country: "China" },
          ],
          businessHours: "Monday - Friday: 9:00 AM - 6:00 PM",
        },
      });
    }

    return NextResponse.json({ settings: formatSettingsResponse(settings) });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { updates } = body;

    if (!updates) {
      return NextResponse.json({ error: "Updates are required" }, { status: 400 });
    }

    // Convert officeLocations array back to individual fields
    const dbUpdates: Record<string, unknown> = { ...updates };
    if (Array.isArray(updates.officeLocations)) {
      dbUpdates.officeKumasi = updates.officeLocations[0]?.city || "";
      dbUpdates.officeObuasi = updates.officeLocations[1]?.city || "";
      dbUpdates.officeChina = updates.officeLocations[2]?.city || "";
      delete dbUpdates.officeLocations;
    }

    await convex.mutation(api.siteSettings.update, {
      ...(dbUpdates as any),
      updatedBy: session.user.email,
    });

    const refreshed = await convex.query(api.siteSettings.get, {});

    return NextResponse.json({
      message: "Settings updated successfully",
      settings: formatSettingsResponse(refreshed),
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
