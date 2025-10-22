import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Check if user is an admin
  const admin = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.supabaseUserId, user.id),
  });

  if (!admin || !admin.isActive) {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
