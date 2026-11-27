// @prometheus 0.2.0
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  type SidebarResize,
} from "@/components/ui/sidebar"

function AppShell({
  brand,
  nav,
  title,
  actions,
  footer,
  resize = "none",
  children,
  className,
}: {
  brand?: React.ReactNode
  nav: React.ReactNode
  title?: React.ReactNode
  actions?: React.ReactNode
  footer?: React.ReactNode
  resize?: SidebarResize
  children: React.ReactNode
  className?: string
}) {
  return (
    <SidebarProvider className={cn("h-svh", className)} resize={resize}>
      <Sidebar collapsible="icon">
        {resize === "none" ? null : <SidebarRail />}
        {brand ? (
          <SidebarHeader className="overflow-hidden group-data-[collapsible=icon]:hidden">
            <div className="truncate">{brand}</div>
          </SidebarHeader>
        ) : null}
        <SidebarContent>{nav}</SidebarContent>
      </Sidebar>
      <SidebarInset className="h-svh min-h-0">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
          <SidebarTrigger />
          {title ? (
            <div className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
              {title}
            </div>
          ) : (
            <div className="flex-1" />
          )}
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </header>
        <div className="flex min-h-0 flex-1 flex-col overflow-auto">{children}</div>
        {footer ? (
          <footer className="flex h-10 shrink-0 items-center border-t border-border px-4 text-sm text-muted-foreground">
            {footer}
          </footer>
        ) : null}
      </SidebarInset>
    </SidebarProvider>
  )
}

export { AppShell }
