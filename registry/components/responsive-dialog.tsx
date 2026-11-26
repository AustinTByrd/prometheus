"use client"

import * as React from "react"

import { usePrometheus } from "@/components/prometheus-provider"
import { SimpleDialog, SimpleDialogClose } from "@/components/simple-dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const ResponsiveDialogContext = React.createContext<{ isDrawer: boolean }>({
  isDrawer: false,
})

export function ResponsiveDialog({
  trigger,
  title,
  description,
  children,
  footer,
  open,
  onOpenChange,
  showCloseButton = true,
  className,
  mobileView = "drawer",
}: {
  trigger?: React.ReactElement
  title: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  showCloseButton?: boolean
  className?: string
  mobileView?: "drawer" | "keep"
}) {
  const { isMobile } = usePrometheus()
  const isDrawer = isMobile && mobileView !== "keep"

  const contextValue = React.useMemo(() => ({ isDrawer }), [isDrawer])

  if (!isDrawer) {
    return (
      <ResponsiveDialogContext.Provider value={contextValue}>
        <SimpleDialog
          className={className}
          description={description}
          footer={footer}
          onOpenChange={onOpenChange}
          open={open}
          showCloseButton={showCloseButton}
          title={title}
          trigger={trigger}
        >
          {children}
        </SimpleDialog>
      </ResponsiveDialogContext.Provider>
    )
  }

  return (
    <ResponsiveDialogContext.Provider value={contextValue}>
      <Drawer onOpenChange={onOpenChange} open={open} showSwipeHandle>
        {trigger ? <DrawerTrigger render={trigger} /> : null}
        <DrawerContent className={className}>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            {description ? (
              <DrawerDescription>{description}</DrawerDescription>
            ) : null}
          </DrawerHeader>
          {children ? (
            <div className="flex flex-col gap-4 overflow-y-auto p-4">
              {children}
            </div>
          ) : null}
          {footer ? <DrawerFooter>{footer}</DrawerFooter> : null}
        </DrawerContent>
      </Drawer>
    </ResponsiveDialogContext.Provider>
  )
}

export function ResponsiveDialogClose({
  render,
  children,
}: {
  render?: React.ReactElement
  children?: React.ReactNode
}) {
  const { isDrawer } = React.useContext(ResponsiveDialogContext)

  if (isDrawer) {
    return <DrawerClose render={render}>{children}</DrawerClose>
  }

  return <SimpleDialogClose render={render}>{children}</SimpleDialogClose>
}
