"use client"

import type * as React from "react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function SimpleDialog({
  trigger,
  title,
  description,
  children,
  footer,
  open,
  onOpenChange,
  showCloseButton = true,
  className,
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
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger render={trigger} /> : null}
      <DialogContent className={className} showCloseButton={showCloseButton}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        {children}
        {footer ? <DialogFooter>{footer}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  )
}

export function SimpleDialogClose({
  children,
  ...props
}: React.ComponentProps<typeof DialogClose>) {
  return <DialogClose {...props}>{children}</DialogClose>
}
