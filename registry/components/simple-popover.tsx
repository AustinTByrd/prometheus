"use client"

import type * as React from "react"

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

export function SimplePopover({
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
}) {
  return (
    <Popover onOpenChange={onOpenChange} open={open}>
      <PopoverTrigger render={trigger} />
      <PopoverContent
        align={align}
        className={className}
        side={side}
        sideOffset={sideOffset}
      >
        {title || description ? (
          <PopoverHeader>
            {title ? <PopoverTitle>{title}</PopoverTitle> : null}
            {description ? (
              <PopoverDescription>{description}</PopoverDescription>
            ) : null}
          </PopoverHeader>
        ) : null}
        {children}
      </PopoverContent>
    </Popover>
  )
}
