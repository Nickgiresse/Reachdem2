import * as React from "react"
import {
  Users,
  UserCheck,
  MessageSquare,
  BarChart3,
  Settings,
  Shield,
  Database,
  Activity,
  PieChart,
  Folder,
  Mail,
  Calendar,
  Globe,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  type NavMainItem = {
    title: string
    url: string
    icon?: "Users" | "UserCheck" | "MessageSquare" | "BarChart3" | "Settings" | "Shield" | "Database" | "Activity" | "PieChart" | "Folder" | "Mail" | "Calendar" | "Globe"
    isActive?: boolean
    items?: { title: string; url: string }[]
  }

  const data: {
    user: { name: string; email: string; avatar: string }
    teams: { name: string; logo: "MessageSquareDot" | "House" | "Command"; plan: string }[]
    navMain: NavMainItem[]
  } = {
    user: {
      name: "Administrateur",
      email: "admin@reachdem.co",
      avatar: "/avatars/admin.jpg",
    },
    teams: [
      {
        name: "ReachDem Admin",
        logo: "MessageSquareDot",
        plan: "Administration",
      },
    ],
    navMain: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: "BarChart3",
        isActive: true,
      },
      {
        title: "Utilisateurs",
        url: "/admin/users",
        icon: "Users",
      },
      {
        title: "Contacts",
        url: "/admin/contacts",
        icon: "UserCheck",
      },
      {
        title: "Groupes",
        url: "/admin/groups",
        icon: "Folder",
      },
      {
        title: "Projets",
        url: "/admin/projects",
        icon: "Database",
      },
      {
        title: "Campagnes",
        url: "/admin/campaigns",
        icon: "MessageSquare",
      },
      {
        title: "Messages",
        url: "/admin/messages",
        icon: "Mail",
      },
      {
        title: "Paramètres",
        url: "/admin/settings",
        icon: "Settings",
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
