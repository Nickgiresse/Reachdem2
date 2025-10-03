import * as React from "react"
import {
  Shield,
  Users,
  UserCheck,
  FolderOpen,
  MessageSquare,
  BarChart3,
  Settings,
  Home,
  Contact,
  Users2,
  Folder,
  Megaphone,
  History,
  CreditCard,
  HelpCircle,
  Info,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export async function AppAdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  type NavMainItem = {
    title: string
    url: string
    icon?: "Shield" | "Users" | "UserCheck" | "Settings"
    isActive?: boolean
    items?: { title: string; url: string }[]
  }

  type ProjectItem = {
    name: string
    url: string
    icon: "FolderOpen" | "MessageSquare" | "BarChart3" | "Contact" | "Users2" | "Folder" | "Megaphone" | "History" | "CreditCard"
  }

  const data: {
    user: { name: string; email: string; avatar: string }
    teams: { name: string; logo: "MessageSquareDot" | "House" | "Command"; plan: string }[]
    navMain: NavMainItem[]
    projects: ProjectItem[]
    plateform: { name: string; url: string; icon: object }[]
  } = {
    user: {
      name: "Administrateur",
      email: session?.user?.email ?? "admin@reachdem.co",
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
        icon: "Shield",
        isActive: true,
      },
      {
        title: "Utilisateurs",
        url: "/admin/users",
        icon: "Users",
      },
      {
        title: "Paramètres",
        url: "/admin/settings",
        icon: "Settings",
      },
    ],
    projects: [
      {
        name: "Contacts",
        url: "/admin/contacts",
        icon: "Contact",
      },
      {
        name: "Groupes",
        url: "/admin/groups",
        icon: "Users2",
      },
      {
        name: "Projets",
        url: "/admin/projects",
        icon: "Folder",
      },
      {
        name: "Activation Projets",
        url: "/admin/projects/activate",
        icon: "CheckCircle",
      },
      {
        name: "Campagnes",
        url: "/admin/campaigns",
        icon: "Megaphone",
      },
      {
        name: "Messages",
        url: "/admin/messages",
        icon: "MessageSquare",
      },
    ],
    plateform: [
      {
        name: "Aide",
        url: "/admin/help",
        icon: HelpCircle,
      },
      {
        name: "À propos",
        url: "/admin/about",
        icon: Info,
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
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
