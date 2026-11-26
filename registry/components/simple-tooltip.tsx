"use client"

import type * as React from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function SimpleTooltip({
  children,
  content,
  side = "top",
  align = "center",
  sideOffset = 4,
  delay,
  className,
}: {
  children: React.ReactElement
  content: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
  sideOffset?: number
  delay?: number
  className?: string
}) {
  const isDisabled = Boolean(
    (children.props as { disabled?: boolean } | null)?.disabled
  )

  return (
    <Tooltip>
      {isDisabled ? (
        <TooltipTrigger
          delay={delay}
          render={<span className="inline-flex cursor-not-allowed" tabIndex={0} />}
        >
          {children}
        </TooltipTrigger>
      ) : (
        <TooltipTrigger delay={delay} render={children} />
      )}
      <TooltipContent
        align={align}
        className={className}
        side={side}
        sideOffset={sideOffset}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  )
}
