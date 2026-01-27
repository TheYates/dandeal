import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

// GET global email settings
export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await convex.query(api.siteSettings.get, {});

    return NextResponse.json({
      enabled: Boolean(settings?.globalEmailEnabled || false),
      globalEmail: settings?.globalEmail || "",
      overrideIndividualSettings: Boolean(settings?.overrideIndividualEmailSettings || false),
    });
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
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { enabled, globalEmail, overrideIndividualSettings } = body;

    await convex.mutation(api.siteSettings.update, {
      globalEmailEnabled: Boolean(enabled),
      globalEmail: String(globalEmail ?? ""),
      overrideIndividualEmailSettings: Boolean(overrideIndividualSettings),
      updatedBy: session.user.email,
    });

    return NextResponse.json({
      enabled: Boolean(enabled),
      globalEmail: String(globalEmail ?? ""),
      overrideIndividualSettings: Boolean(overrideIndividualSettings),
    });
  } catch (error) {
    console.error("Error updating global email settings:", error);
    return NextResponse.json(
      { error: "Failed to update global email settings" },
      { status: 500 }
    );
  }
}
