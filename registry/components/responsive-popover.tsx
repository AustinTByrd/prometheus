"use client"

import type * as React from "react"

import { usePrometheus } from "@/components/prometheus-provider"
import { SimplePopover } from "@/components/simple-popover"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export function ResponsivePopover({
  trigger,
  title,
  description,
  children,
  open,
  onOpenChange,
  side = "bottom",
  align = "center",
  sideOffset = 4,
  className,
  mobileView = "drawer",
}: {
  trigger: React.ReactElement
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
  sideOffset?: number
  className?: string
  mobileView?: "drawer" | "keep"
}) {
  const { isMobile } = usePrometheus()

  if (!isMobile || mobileView === "keep") {
    return (
      <SimplePopover
        align={align}
        className={className}
        description={description}
        onOpenChange={onOpenChange}
        open={open}
        side={side}
        sideOffset={sideOffset}
        title={title}
        trigger={trigger}
      >
        {children}
      </SimplePopover>
    )
  }

  return (
    <Drawer onOpenChange={onOpenChange} open={open} showSwipeHandle>
      <DrawerTrigger render={trigger} />
      <DrawerContent className={className}>
        {title || description ? (
          <DrawerHeader>
            <DrawerTitle>{title ?? "Options"}</DrawerTitle>
            {description ? (
              <DrawerDescription>{description}</DrawerDescription>
            ) : null}
          </DrawerHeader>
        ) : (
          <DrawerTitle className="sr-only">Options</DrawerTitle>
        )}
        <div className="flex flex-col gap-3 overflow-y-auto p-4">{children}</div>
      </DrawerContent>
    </Drawer>
  )
}
