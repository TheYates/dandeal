import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// GET - Fetch site settings
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

// PATCH - Update site settings
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { updates } = body;

    if (!updates) {
      return NextResponse.json(
        { error: "Updates are required" },
        { status: 400 }
      );
    }

    // Check if settings exist
    const existing = await db.query.siteSettings.findFirst();

    let result;
    if (existing) {
      // Update existing settings
      result = await db
        .update(siteSettings)
        .set({
          ...updates,
          updatedAt: new Date(),
          updatedBy: user.email,
        })
        .where(eq(siteSettings.id, existing.id))
        .returning();
    } else {
      // Create new settings
      result = await db
        .insert(siteSettings)
        .values({
          ...updates,
          updatedBy: user.email,
        })
        .returning();
    }

    return NextResponse.json({
      message: "Settings updated successfully",
      settings: result[0],
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

