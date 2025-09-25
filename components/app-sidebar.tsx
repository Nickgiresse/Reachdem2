import * as React from "react"
import {

  Frame,

  PieChart,

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

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  type NavMainItem = {
    title: string
    url: string
    icon?: "House" | "User" | "Boxes" | "Settings"
    isActive?: boolean
    items?: { title: string; url: string }[]
  }

  type ProjectItem = {
    name: string
    url: string
    icon: "Frame" | "PieChart" | "Map"
  }

  const data: {
    user: { name: string; email: string; avatar: string }
    teams: { name: string; logo: "MessageSquareDot" | "House" | "Command"; plan: string }[]
    navMain: NavMainItem[]
    projects: ProjectItem[]
    plateform: { name: string; url: string; icon: object }[]
  } = {
    user: {
      name: session?.user?.name ?? session?.user?.email ?? "Utilisateur",
      email: session?.user?.email ?? "inconnu@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Reachdem",
        logo: "MessageSquareDot",
        plan: "Dashboard",
      },
      {
        name: "Acme Corp.",
        logo: "House",
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: "Command",
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Accueil",
        url: "/dashboard",
        icon: "House",
        isActive: true,
      },
      {
        title: "Contacts",
        url: "/dashboard/contact",
        icon: "User",
      },
      {
        title: "Groupes",
        url: "/dashboard/groupe",
        icon: "Boxes",
      },
      {
        title: "Settings",
        url: "/dashboard/setting",
        icon: "Settings",
      },
    ],
    projects: [
      {
        name: "Projets",
        url: "/dashboard/projet",
        icon: "Frame",
      },
      {
        name: "Campagnes",
        url: "/dashboard/campagne",
        icon: "PieChart",
      },
      {
        name: "Historiques",
        url: "/dashboard/historique",
        icon: "Map",
      },
      {
        name: "Facturation",
        url: "/dashboard/facturation",
        icon: "Map",
      },
    ],
    plateform: [
      {
        name: "Aide",
        url: "/dashboard/aide",
        icon: Frame,
      },
      {
        name: "A propos",
        url: "/dashboard/a-propos",
        icon: PieChart,
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
