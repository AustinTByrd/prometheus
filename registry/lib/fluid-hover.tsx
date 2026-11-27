// @prometheus 0.2.0
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/** Travel and fade for the highlight. */
export const fluidHover = {
  /** Milliseconds the highlight takes to glide to the next item. */
  travel: 320,
  /** Milliseconds it takes to fade in or out. */
  fade: 180,
  /** Fast start, long settle, no overshoot. */
  ease: "cubic-bezier(0.32, 0.72, 0, 1)",
} as const

export type FluidHoverRect = {
  x: number
  y: number
  width: number
  height: number
}

export type FluidHoverOptions = {
  /**
   * Light the item nearest the pointer, so gaps and padding never go dark.
   * Off, empty space puts the highlight out.
   */
  nearest?: boolean
  /** With `nearest`, which way the items run. */
  axis?: "x" | "y" | "xy"
  /** With `nearest`, a click between items goes to the lit one. */
  gapClick?: boolean
}

type FluidHoverState = {
  rect: FluidHoverRect | null
  visible: boolean
  /** False on a fresh entry, so the highlight fades in where it lands. */
  glide: boolean
}

const itemSelector = "[data-fluid-hover-item]"
const disabledSelector = ":disabled, [aria-disabled='true'], [data-disabled]"
const controlSelector =
  "a, button, input, select, textarea, [role='button'], [tabindex]"

function measure(item: HTMLElement, container: HTMLElement): FluidHoverRect {
  let x = 0
  let y = 0
  let node: HTMLElement | null = item
  while (node && node !== container && container.contains(node)) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  if (node === container) {
    return { x, y, width: item.offsetWidth, height: item.offsetHeight }
  }
  const box = item.getBoundingClientRect()
  const frame = container.getBoundingClientRect()
  return {
    x: box.left - frame.left - container.clientLeft + container.scrollLeft,
    y: box.top - frame.top - container.clientTop + container.scrollTop,
    width: box.width,
    height: box.height,
  }
}

function itemsIn(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(itemSelector),
  ).filter((item) => !item.matches(disabledSelector))
}

function nearestItem(
  container: HTMLElement,
  clientX: number,
  clientY: number,
  axis: "x" | "y" | "xy",
) {
  let best: HTMLElement | null = null
  let bestDistance = Infinity
  for (const item of itemsIn(container)) {
    const box = item.getBoundingClientRect()
    const dx = clientX - (box.left + box.width / 2)
    const dy = clientY - (box.top + box.height / 2)
    const distance =
      axis === "x"
        ? Math.abs(dx)
        : axis === "y"
          ? Math.abs(dy)
          : Math.hypot(dx, dy)
    if (distance < bestDistance) {
      best = item
      bestDistance = distance
    }
  }
  return best
}

/**
 * One highlight that glides between the items of a container.
 * Mark each click target with `data-fluid-hover-item`, spread `handlers`
 * on the container, and give it `relative isolate`.
 */
export function useFluidHover<T extends HTMLElement = HTMLElement>({
  nearest = false,
  axis = "y",
  gapClick = true,
}: FluidHoverOptions = {}) {
  const ref = React.useRef<T>(null)
  const active = React.useRef<HTMLElement | null>(null)
  const [state, setState] = React.useState<FluidHoverState>({
    rect: null,
    visible: false,
    glide: false,
  })

  const light = React.useCallback((item: HTMLElement | null) => {
    const container = ref.current
    const previous = active.current
    if (!container || item === previous) return
    previous?.removeAttribute("data-fluid-hover-active")
    active.current = item
    if (!item) {
      setState((current) => ({ ...current, visible: false }))
      return
    }
    item.setAttribute("data-fluid-hover-active", "")
    setState({
      rect: measure(item, container),
      visible: true,
      glide: previous !== null,
    })
  }, [])

  const pick = React.useCallback(
    (target: EventTarget | null, clientX: number, clientY: number) => {
      const container = ref.current
      if (!container) return null
      const item =
        target instanceof Element
          ? target.closest<HTMLElement>(itemSelector)
          : null
      if (item && container.contains(item) && !item.matches(disabledSelector)) {
        return item
      }
      return nearest ? nearestItem(container, clientX, clientY, axis) : null
    },
    [axis, nearest],
  )

  React.useEffect(() => {
    const container = ref.current
    if (!container || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(() => {
      const item = active.current
      if (!item) return
      setState((current) => ({
        ...current,
        rect: measure(item, container),
        glide: false,
      }))
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const handlers = React.useMemo(
    () => ({
      onPointerMove: (event: React.PointerEvent) => {
        if (event.pointerType !== "mouse") return
        light(pick(event.target, event.clientX, event.clientY))
      },
      onPointerLeave: (event: React.PointerEvent) => {
        if (event.pointerType !== "mouse") return
        light(null)
      },
      onFocus: (event: React.FocusEvent) => {
        const item = (event.target as Element).closest<HTMLElement>(
          itemSelector,
        )
        if (item?.matches(":focus-visible")) light(item)
      },
      onBlur: (event: React.FocusEvent) => {
        if (!ref.current?.contains(event.relatedTarget as Node | null)) {
          light(null)
        }
      },
      onClick: (event: React.MouseEvent) => {
        if (!nearest || !gapClick || !active.current) return
        const target = event.target as Element
        if (target.closest(itemSelector) || target.closest(controlSelector)) {
          return
        }
        active.current.click()
      },
    }),
    [gapClick, light, nearest, pick],
  )

  return { ref, handlers, ...state, light }
}

export type FluidHover = ReturnType<typeof useFluidHover>

export type FluidHoverHighlightProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  "children"
> & {
  hover: FluidHover
  /** Pull the highlight in from the item's edges, in pixels. */
  inset?: number | { x?: number; y?: number }
  /** Use `li` inside a list. */
  as?: "div" | "li" | "span"
  /**
   * Light hover (4%) when the row already has a fill. Default is Dark hover
   * (8%) for empty surfaces.
   */
  onFill?: boolean
}

/** Render first inside the container. Radius and color go in `className`. */
export function FluidHoverHighlight({
  hover,
  inset = 0,
  as: Tag = "div",
  className,
  style,
  onFill = false,
  ...props
}: FluidHoverHighlightProps) {
  const { rect, visible, glide } = hover
  const insetX = typeof inset === "number" ? inset : (inset.x ?? 0)
  const insetY = typeof inset === "number" ? inset : (inset.y ?? 0)
  return (
    <Tag
      aria-hidden="true"
      data-slot="fluid-hover-highlight"
      data-visible={visible && rect ? "" : undefined}
      className={cn(
        "pointer-events-none absolute z-[1] rounded-sm opacity-0 data-visible:opacity-100",
        onFill ? "bg-hover-light" : "bg-hover",
        glide
          ? "motion-safe:transition-[top,left,width,height,opacity,border-radius,background-color] motion-safe:duration-(--duration-fast) motion-safe:ease-(--ease-standard)"
          : "motion-safe:transition-[opacity,border-radius,background-color] motion-safe:duration-(--duration-fast) motion-safe:ease-(--ease-standard)",
        className,
      )}
      style={{
        top: rect ? rect.y + insetY : 0,
        left: rect ? rect.x + insetX : 0,
        width: rect ? rect.width - insetX * 2 : 0,
        height: rect ? rect.height - insetY * 2 : 0,
        ...style,
      }}
      {...props}
    />
  )
}

/** True when the lit Fluid Hover item already carries a fill (selected/active). */
export function fluidHoverTargetHasFill(
  container: HTMLElement | null,
): boolean {
  const item = container?.querySelector<HTMLElement>("[data-fluid-hover-active]")
  if (!item) return false
  return (
    item.getAttribute("aria-current") === "page" ||
    item.getAttribute("aria-checked") === "true" ||
    item.hasAttribute("data-active")
  )
}
