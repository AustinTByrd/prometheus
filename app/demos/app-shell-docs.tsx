"use client"

import { Cog6ToothIcon, InboxIcon, PlusIcon, UsersIcon } from "@heroicons/react/16/solid"

import { AppShell } from "@/components/ui/app-shell"
import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const NAV = [
  { label: "Orders", icon: InboxIcon, active: true },
  { label: "Customers", icon: UsersIcon, active: false },
  { label: "Settings", icon: Cog6ToothIcon, active: false },
] as const

export function AppShellDemo({ className }: { className?: string }) {
  return (
    <AppShell
      resize="learn"
      actions={
        <Button size="sm">
          <PlusIcon data-icon="inline-start" />
          New order
        </Button>
      }
      brand={<span className="text-sm font-medium">Northwind</span>}
      className={className}
      footer="Northwind"
      nav={
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton isActive={item.active} tooltip={item.label}>
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      }
      title="Orders"
    >
      <div className="flex flex-col gap-2 p-6">
        <p className="text-sm text-muted-foreground">
          Open orders for the week. The frame stays put while this region
          scrolls.
        </p>
      </div>
    </AppShell>
  )
}
