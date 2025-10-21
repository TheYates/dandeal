import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  // Get the body
  const payload = await request.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as any;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;
    const name =
      `${first_name || ""} ${last_name || ""}`.trim() || "Admin User";

    try {
      // Create admin user with viewer role by default
      await db.insert(adminUsers).values({
        clerkUserId: id,
        email,
        name,
        role: "viewer",
        isActive: true,
      });

      console.log(`Admin user created: ${email}`);
    } catch (error) {
      console.error("Error creating admin user:", error);
    }
  } else if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;
    const name =
      `${first_name || ""} ${last_name || ""}`.trim() || "Admin User";

    try {
      await db
        .update(adminUsers)
        .set({
          email,
          name,
          updatedAt: new Date(),
        })
        .where(eq(adminUsers.clerkUserId, id));

      console.log(`Admin user updated: ${email}`);
    } catch (error) {
      console.error("Error updating admin user:", error);
    }
  } else if (eventType === "user.deleted") {
    const { id } = evt.data;

    try {
      // Soft delete by setting isActive to false
      await db
        .update(adminUsers)
        .set({
          isActive: false,
          updatedAt: new Date(),
        })
        .where(eq(adminUsers.clerkUserId, id));

      console.log(`Admin user deactivated: ${id}`);
    } catch (error) {
      console.error("Error deactivating admin user:", error);
    }
  }

  return NextResponse.json({ success: true });
}
