"use client"

import {  Frame, PieChart, Map, FolderDot, Contact, Users2, Folder, Megaphone, MessageSquare, CheckCircle } from "lucide-react"
import Link from "next/link"


import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
 
  SidebarMenuButton,
  SidebarMenuItem,

} from "@/components/ui/sidebar"

const ICONS = {
  Frame,
  PieChart,
  Map,
  FolderDot,
  Contact,
  Users2,
  Folder,
  Megaphone,
  MessageSquare,
  CheckCircle,
} as const

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: keyof typeof ICONS
  }[]
}) {


  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>SMS</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link href={item.url} className="hover:bg-[#FB953C] hover:text-black">
                {(() => { const Icon = ICONS[item.icon]; return <Icon /> })()}
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </SidebarMenuItem>
        ))}
        {/* <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>Mores</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
      </SidebarMenu>
    </SidebarGroup>
  )
}
