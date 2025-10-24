"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuotesTable } from "@/components/quotes-table";
import { ConsultationsTable } from "@/components/consultations-table";
import { ContactsTable } from "@/components/contacts-table";
import { DropdownManagementAccordion } from "@/components/dropdown-management-accordion";
import { UserManagement } from "@/components/user-management";
import { PartnersManagement } from "@/components/partners-management";
import { SettingsManagement } from "@/components/settings-management";
import { ModeToggle } from "@/components/ui/modetoggle";
import { LogOut, Settings, Users } from "lucide-react";

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  return (
    <div className="min-h-screen ">
      {/* Header */}
      <header className=" border-b border-slate-200  sticky top-0 z-50 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold ">Dandeal Manager</h1>
            <p className="text-sm ">Manage quotes and consultation requests</p>
          </div>
          <div className="flex items-center gap-3">
            <ModeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="quotes" className="w-full">
          <TabsList className="grid w-full max-w-7xl grid-cols-7">
            <TabsTrigger value="quotes">Quote Requests</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="contacts">Contact Messages</TabsTrigger>
            <TabsTrigger value="dropdowns">Dropdowns</TabsTrigger>
            <TabsTrigger value="partners">Partners</TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

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
            <PartnersManagement />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <SettingsManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
