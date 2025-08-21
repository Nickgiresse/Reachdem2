"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
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

// This is sample data.
const data = {
  user: {
    name: "Nick giresse",
    email: "kamdemnick12@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Reachdem",
      logo: GalleryVerticalEnd,
      plan: "Dashboard",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Accueil",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      
      
    },
    {
      title: "Contacts",
      url: "#",
      icon: Bot,
     
    },
    {
      title: "Groupes",
      url: "#",
      icon: BookOpen,
     
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
     
    },
  ],
  projects: [
    {
      name: "Projets",
      url: "#",
      icon: Frame,
    },
    {
      name: "Campagnes",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Historiques",
      url: "#",
      icon: Map,
    },
    {
      name: "Facturation",
      url: "#",
      icon: Map,
    },
  ],
  plateform: [
    {
      name: "Aide",
      url: "#",
      icon: Frame,
    },
    {
      name: "A propos",
      url: "#",
      icon: PieChart,
    },
   
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
