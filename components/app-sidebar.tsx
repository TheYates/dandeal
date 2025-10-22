"use client"

import * as React from "react"
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Settings,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

// Dandeal branding
const navMainItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Consultations",
    url: "/admin/consultations",
    icon: MessageSquare,
  },
  {
    title: "Quotes",
    url: "/admin/quotes",
    icon: FileText,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
]

const defaultUser = {
  name: "Admin User",
  email: "admin@dandeal.com",
  avatar: "/avatars/admin.jpg",
}

export function AppSidebar({ user = defaultUser, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-600 text-white font-bold">
            D
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">Dandeal</span>
            <span className="text-xs text-gray-500">Admin</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMainItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

