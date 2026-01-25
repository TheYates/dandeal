"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuotesTable } from "@/components/admin/tables/quotes-table";
import { ConsultationsTable } from "@/components/admin/tables/consultations-table";
import { ContactsTable } from "@/components/admin/tables/contacts-table";
import { DropdownManagementAccordion } from "@/components/admin/management/dropdown-management-accordion";
import { UserManagement } from "@/components/admin/tables/user-management";
import { PartnersGalleryView } from "@/components/admin/management/partners-gallery-view";
import { SettingsManagement } from "@/components/admin/management/settings-management";
import { TestimonialsManagement } from "@/components/admin/management/testimonials-management";
import { EmailManagement } from "@/components/admin/management/email-management";
import { InvitationManagement } from "@/components/admin/management/invitation-management";
import { ModeToggle } from "@/components/ui/modetoggle";
import { LogOut, Settings, Users, Mail, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<string>("quotes");

  const userRole = session?.user?.role as "super_admin" | "admin" | "viewer" | undefined;
  const canManageInvitations = userRole === "super_admin" || userRole === "admin";

  // Load saved tab from localStorage on mount
  useEffect(() => {
    const savedTab = localStorage.getItem("dashboard-active-tab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  // Save tab to localStorage (Convex handles data fetching automatically)
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem("dashboard-active-tab", value);
  };
  return (
    <div className="min-h-screen ">
      {/* Header */}
      <header className="border-b border-slate-200 sticky top-0 z-50 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-2xl font-bold truncate">
              Dandeal Manager
            </h1>
            <p className="text-xs sm:text-sm hidden sm:block">
              Manage quotes and consultation requests
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ModeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="gap-1 sm:gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          {/* Tabs wrapper with horizontal scroll on mobile */}
          <div className="w-full overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="inline-flex lg:grid w-full lg:max-w-7xl lg:grid-cols-9 h-auto p-1 min-w-max lg:min-w-0">
              <TabsTrigger value="quotes" className="whitespace-nowrap">
                <span className="hidden sm:inline">Quote Requests</span>
                <span className="sm:hidden">Quotes</span>
              </TabsTrigger>
              <TabsTrigger value="consultations" className="whitespace-nowrap">
                <span className="hidden sm:inline">Consultations</span>
                <span className="sm:hidden">Consult</span>
              </TabsTrigger>
              <TabsTrigger value="contacts" className="whitespace-nowrap">
                <span className="hidden sm:inline">Contact Messages</span>
                <span className="sm:hidden">Contacts</span>
              </TabsTrigger>
              <TabsTrigger value="dropdowns" className="whitespace-nowrap">
                Dropdowns
              </TabsTrigger>
              {/* <TabsTrigger value="partners" className="whitespace-nowrap">
                Partners
              </TabsTrigger> */}
              <TabsTrigger value="testimonials" className="whitespace-nowrap">
                Testimonials
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="gap-1 sm:gap-2 whitespace-nowrap"
              >
                <Users className="w-4 h-4" />
                Users
              </TabsTrigger>
              {canManageInvitations && (
                <TabsTrigger
                  value="invitations"
                  className="gap-1 sm:gap-2 whitespace-nowrap"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Invitations</span>
                </TabsTrigger>
              )}
              <TabsTrigger
                value="email"
                className="gap-1 sm:gap-2 whitespace-nowrap"
              >
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">Email</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="gap-1 sm:gap-2 whitespace-nowrap"
              >
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="quotes" className="mt-6">
            <QuotesTable />
          </TabsContent>

          <TabsContent value="consultations" className="mt-6">
            <ConsultationsTable />
          </TabsContent>

          <TabsContent value="contacts" className="mt-6">
            <ContactsTable />
          </TabsContent>

          <TabsContent value="dropdowns" className="mt-6">
            <DropdownManagementAccordion />
          </TabsContent>

          <TabsContent value="partners" className="mt-6">
            <PartnersGalleryView />
          </TabsContent>

          <TabsContent value="testimonials" className="mt-6">
            <TestimonialsManagement />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>

          {canManageInvitations && (
            <TabsContent value="invitations" className="mt-6">
              <InvitationManagement />
            </TabsContent>
          )}

          <TabsContent value="email" className="mt-6">
            <EmailManagement />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <SettingsManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
