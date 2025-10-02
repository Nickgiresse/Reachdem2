"use client"

import { Boxes, House, Settings, User, Shield, Users } from "lucide-react"
import Link from "next/link"

import {
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,

} from "@/components/ui/sidebar"

const ICONS = {
  House,
  User,
  Boxes,
  Settings,
  Shield,
  Users,
} as const

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: keyof typeof ICONS
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Tableau de bord</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url} className="hover:bg-[#FB953C] hover:text-black">
                {item.icon && (() => { const Icon = ICONS[item.icon!]; return <Icon /> })()}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
