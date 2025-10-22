import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
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
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user is an admin
  const admin = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.clerkUserId, userId),
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
