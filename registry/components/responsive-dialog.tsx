"use client"

import type * as React from "react"

import { usePrometheus } from "@/components/prometheus-provider"
import { SimpleDialog } from "@/components/simple-dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export function ResponsiveDialog({
  trigger,
  title,
  description,
  children,
  footer,
  open,
  onOpenChange,
  className,
  mobileView = "drawer",
}: {
  trigger?: React.ReactElement
  title: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  mobileView?: "drawer" | "keep"
}) {
  const { isMobile } = usePrometheus()

  if (!isMobile || mobileView === "keep") {
    return (
      <SimpleDialog
        className={className}
        description={description}
        footer={footer}
        onOpenChange={onOpenChange}
        open={open}
        title={title}
        trigger={trigger}
      >
        {children}
      </SimpleDialog>
    )
  }

  return (
    <Drawer onOpenChange={onOpenChange} open={open} showSwipeHandle>
      {trigger ? <DrawerTrigger render={trigger} /> : null}
      <DrawerContent className={className}>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description ? (
            <DrawerDescription>{description}</DrawerDescription>
          ) : null}
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto p-4">{children}</div>
        {footer ? <DrawerFooter>{footer}</DrawerFooter> : null}
      </DrawerContent>
    </Drawer>
  )
}
