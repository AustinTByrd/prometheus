"use client"

import type * as React from "react"

import { SimpleTooltip } from "@/components/simple-tooltip"

export function ConditionalTooltip({
  children,
  content,
  condition,
  side = "top",
  align = "center",
  sideOffset = 4,
  delay,
  className,
}: {
  children: React.ReactElement
  content?: React.ReactNode
  condition?: boolean
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
  sideOffset?: number
  delay?: number
  className?: string
}) {
  if (!condition || content == null || content === false || content === "") {
    return children
  }

  return (
    <SimpleTooltip
      align={align}
      className={className}
      content={content}
      delay={delay}
      side={side}
      sideOffset={sideOffset}
    >
      {children}
    </SimpleTooltip>
  )
}
