import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET global email settings
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
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
    // Check authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
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
          updatedBy: user.email,
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
          updatedBy: user.email,
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