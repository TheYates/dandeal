"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuotesTable } from "@/components/quotes-table"
import { ConsultationsTable } from "@/components/consultations-table"
import { DropdownManagement } from "@/components/dropdown-management"
import { UserManagement } from "@/components/user-management"
import { ModeToggle } from "@/components/ui/modetoggle"
import { LogOut, Settings } from "lucide-react"

interface DropdownOption {
  id: string
  value: string
}

interface DashboardProps {
  onLogout: () => void
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [shippingMethods, setShippingMethods] = useState<DropdownOption[]>([
    { id: "1", value: "Land Transport" },
    { id: "2", value: "Air Freight" },
    { id: "3", value: "Sea Freight" },
    { id: "4", value: "Multimodal" },
  ])

  const [services, setServices] = useState<DropdownOption[]>([
    { id: "1", value: "Shipping" },
    { id: "2", value: "Logistics" },
    { id: "3", value: "Import" },
    { id: "4", value: "Export" },
    { id: "5", value: "International Procurement" },
    { id: "6", value: "Customs Clearance" },
    { id: "7", value: "Warehousing" },
  ])

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <header className=" border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold ">Submissions Manager</h1>
            <p className="text-sm ">Manage quotes and consultation requests</p>
          </div>
          <div className="flex items-center gap-3">
            <ModeToggle />
            <Button variant="outline" size="sm" onClick={onLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="quotes" className="w-full">
          <TabsList className="grid w-full max-w-3xl grid-cols-4">
            <TabsTrigger value="quotes">Quote Requests</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="dropdowns">Dropdowns</TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Settings className="w-4 h-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quotes" className="mt-6">
            <QuotesTable />
          </TabsContent>

          <TabsContent value="consultations" className="mt-6">
            <ConsultationsTable />
          </TabsContent>

          <TabsContent value="dropdowns" className="mt-6 space-y-6">
            <DropdownManagement
              title="Shipping Methods"
              description="Manage the shipping method options available in the quote form"
              options={shippingMethods}
              onOptionsChange={setShippingMethods}
            />
            <DropdownManagement
              title="Services"
              description="Manage the service options available in the consultation form"
              options={services}
              onOptionsChange={setServices}
            />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
