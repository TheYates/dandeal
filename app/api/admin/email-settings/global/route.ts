import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// GET global email settings
export async function GET(request: NextRequest) {
  try {
    // Check authentication with NextAuth
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get global email settings from site settings
    const settings = await db.query.siteSettings.findFirst();
    
    const globalSettings = {
      enabled: settings?.globalEmailEnabled || false,
      globalEmail: settings?.globalEmail || "",
      overrideIndividualSettings: settings?.overrideIndividualEmailSettings || false,
    };

    return NextResponse.json(globalSettings);
  } catch (error) {
    console.error("Error fetching global email settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch global email settings" },
      { status: 500 }
    );
  }
}

// PATCH update global email settings
export async function PATCH(request: NextRequest) {
  try {
    // Check authentication with NextAuth
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { enabled, globalEmail, overrideIndividualSettings } = body;

    // Check if site settings exists
    const existingSettings = await db.query.siteSettings.findFirst();
    
    if (existingSettings) {
      // Update existing settings
      await db
        .update(siteSettings)
        .set({
          globalEmailEnabled: enabled,
          globalEmail: globalEmail,
          overrideIndividualEmailSettings: overrideIndividualSettings,
          updatedAt: new Date(),
          updatedBy: session.user.email,
        })
        .where(eq(siteSettings.id, existingSettings.id));
    } else {
      // Insert new settings
      await db
        .insert(siteSettings)
        .values({
          globalEmailEnabled: enabled,
          globalEmail: globalEmail,
          overrideIndividualEmailSettings: overrideIndividualSettings,
          updatedBy: session.user.email,
        });
    }

    return NextResponse.json({
      enabled,
      globalEmail,
      overrideIndividualSettings,
    });
  } catch (error) {
    console.error("Error updating global email settings:", error);
    return NextResponse.json(
      { error: "Failed to update global email settings" },
      { status: 500 }
    );
  }
}