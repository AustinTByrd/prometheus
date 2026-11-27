// @prometheus 0.2.0
"use client"

import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

import {
  chartColorVars,
  chartTagWash,
  chartTokens,
  type ChartColor,
} from "@/lib/chart-palette"
import { SURFACE_BG } from "@/lib/surface-classes"
import { useSurface } from "@/lib/surface-context"

const neutralVars = {
  "--bar-tag": "color-mix(in oklab, var(--foreground) 8%, transparent)",
  "--bar-text": "var(--muted-foreground)",
} as const

const sizeClasses = {
  default:
    "gap-1 px-2 py-0.5 text-xs [&_svg]:size-3",
  lg: "gap-1.5 px-2.5 py-1 text-sm [&_svg]:size-3.5",
} as const

export type BadgeProps = ComponentProps<"span"> & {
  /**
   * A Data Foundations palette name, or any CSS color.
   * Omit for the neutral muted look.
   */
  color?: ChartColor | (string & {})
  /** `lg` is one step up for denser labels and titles. */
  size?: keyof typeof sizeClasses
}

function Badge({
  className,
  color,
  size = "default",
  style,
  ...props
}: BadgeProps) {
  const level = useSurface()
  const vars = color == null ? neutralVars : chartColorVars(color)

  return (
    <span
      className={cn(
        chartTokens,
        SURFACE_BG[level],
        chartTagWash,
        "inline-flex w-fit shrink-0 items-center justify-center rounded-full leading-none font-normal whitespace-nowrap text-(--bar-text) [&_svg]:pointer-events-none [&_svg]:relative [&_svg]:shrink-0",
        sizeClasses[size],
        className,
      )}
      data-slot="badge"
      style={{ ...vars, ...style }}
      {...props}
    />
  )
}

export { Badge }
export type { ChartColor }
