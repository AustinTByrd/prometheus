// @prometheus 0.2.0
"use client"

import * as React from "react"
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

const PILL_EDGE_CLASSES =
  "[&>*]:[--pill-edge:calc(var(--pill-r)_*_(1_-_pi_/_4)_*_var(--pill-r)_/_var(--pill))] [&>svg]:[--pill-edge:calc(var(--pill-py)_-_var(--pill-px))] [&>[data-icon]]:[--pill-edge:calc(var(--pill-py)_-_var(--pill-px))] [&>:first-child]:ms-(--pill-edge) [&>:last-child]:me-(--pill-edge)"

const sizeClasses = {
  default:
    "gap-1 [--pill-py:0.25rem] [--pill-px:0.5rem] [--pill:calc(var(--pill-py)_+_0.5lh)] [--pill-r:var(--pill)] py-(--pill-py) px-(--pill-px) rounded-(--pill-r) text-xs/3 [&_svg]:size-3",
  lg: "gap-1.5 [--pill-py:0.4375rem] [--pill-px:0.625rem] [--pill:calc(var(--pill-py)_+_0.5lh)] [--pill-r:var(--pill)] py-(--pill-py) px-(--pill-px) rounded-(--pill-r) text-sm/3.5 [&_svg]:size-3.5",
} as const

function flattenPillNodes(
  node: React.ReactNode,
  out: React.ReactNode[],
): void {
  if (node == null || typeof node === "boolean") return
  if (Array.isArray(node)) {
    for (const item of node) flattenPillNodes(item, out)
    return
  }
  if (React.isValidElement(node) && node.type === React.Fragment) {
    flattenPillNodes(
      (node.props as { children?: React.ReactNode }).children,
      out,
    )
    return
  }
  out.push(node)
}

function normalizePillChildren(children: React.ReactNode): React.ReactNode {
  const flat: React.ReactNode[] = []
  flattenPillNodes(children, flat)

  const result: React.ReactNode[] = []
  let textBuffer: (string | number)[] = []

  const flushText = () => {
    if (textBuffer.length === 0) return
    const trimmed = textBuffer.join("").trim()
    textBuffer = []
    if (!trimmed) return
    result.push(
      <span data-slot="pill-label" key={`pill-label-${result.length}`}>
        {trimmed}
      </span>,
    )
  }

  for (const item of flat) {
    if (typeof item === "string" || typeof item === "number") {
      textBuffer.push(item)
    } else {
      flushText()
      result.push(item)
    }
  }
  flushText()

  return result
}

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
  children,
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
        "inline-flex w-fit shrink-0 items-center justify-center leading-none font-normal whitespace-nowrap text-(--bar-text) [&_svg]:pointer-events-none [&_svg]:relative [&_svg]:shrink-0",
        sizeClasses[size],
        PILL_EDGE_CLASSES,
        className,
      )}
      data-slot="badge"
      style={{ ...vars, ...style }}
      {...props}
    >
      {children == null ? children : normalizePillChildren(children)}
    </span>
  )
}

export { Badge }
export type { ChartColor }
