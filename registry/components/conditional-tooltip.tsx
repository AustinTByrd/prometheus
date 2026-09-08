"use client"

import type * as React from "react"

import { SimpleTooltip } from "@/components/simple-tooltip"

export function ConditionalTooltip({
  children,
  content,
  condition,
  side = "top",
}: {
  children: React.ReactElement
  content?: React.ReactNode
  condition?: boolean
  side?: "top" | "bottom" | "left" | "right"
}) {
  if (!condition || content == null || content === false || content === "") {
    return children
  }

  return (
    <SimpleTooltip content={content} side={side}>
      {children}
    </SimpleTooltip>
  )
}
