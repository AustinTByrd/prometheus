// @prometheus 0.2.0
"use client"

import * as React from "react"
import { CheckboxGlyph } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { FluidHoverHighlight, useFluidHover } from "@/lib/fluid-hover"

type FocusOpts = FocusOptions & { focusVisible?: boolean }

function focusItem(el: HTMLElement, opts?: FocusOpts) {
  el.focus(opts)
}

type ItemRect = { top: number; left: number; width: number; height: number }

const SELECTION_RADIUS = "var(--radius-sm)"

function measureItems(container: HTMLElement): ItemRect[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>("[data-fluid-hover-item]"),
  ).map((item) => ({
    top: item.offsetTop,
    left: item.offsetLeft,
    width: item.offsetWidth,
    height: item.offsetHeight,
  }))
}

type CheckboxGroupContextValue = {
  activeIndex: number | null
}

const CheckboxGroupContext =
  React.createContext<CheckboxGroupContextValue | null>(null)

function useCheckboxGroup() {
  const context = React.useContext(CheckboxGroupContext)
  if (!context) {
    throw new Error("CheckboxItem must be used within a CheckboxGroup")
  }
  return context
}

function CheckboxGroup({
  children,
  checkedIndices,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  /** Checked row indices. The group needs the whole set to merge contiguous rows. */
  checkedIndices: Set<number>
}) {
  const hover = useFluidHover<HTMLDivElement>({ nearest: true, axis: "y" })
  const [rects, setRects] = React.useState<ItemRect[]>([])
  const checkedList = React.useMemo(
    () => [...checkedIndices].sort((a, b) => a - b),
    [checkedIndices],
  )

  const measure = React.useCallback(() => {
    if (!hover.ref.current) return
    setRects(measureItems(hover.ref.current))
  }, [hover.ref])

  React.useLayoutEffect(() => {
    measure()
    const container = hover.ref.current
    if (!container || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    for (const item of container.querySelectorAll("[data-fluid-hover-item]")) {
      observer.observe(item)
    }
    return () => observer.disconnect()
  }, [measure, hover.ref, children])

  const activeIndex = React.useMemo(() => {
    if (!hover.rect || rects.length === 0) return null
    const mid = hover.rect.y + hover.rect.height / 2
    let nearest = 0
    let best = Infinity
    rects.forEach((rect, index) => {
      const distance = Math.abs(rect.top + rect.height / 2 - mid)
      if (distance < best) {
        best = distance
        nearest = index
      }
    })
    return hover.visible ? nearest : null
  }, [hover.rect, hover.visible, rects])

  return (
    <CheckboxGroupContext.Provider value={{ activeIndex }}>
      <div
        className={cn(
          "relative isolate flex w-72 max-w-full flex-col select-none",
          className,
        )}
        data-slot="checkbox-group"
        ref={hover.ref}
        role="group"
        {...hover.handlers}
        onKeyDown={(event) => {
          const items = Array.from(
            hover.ref.current?.querySelectorAll<HTMLElement>(
              "[data-fluid-hover-item]",
            ) ?? [],
          )
          const current = items.indexOf(event.target as HTMLElement)
          if (current === -1) return
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault()
            const next =
              event.key === "ArrowDown"
                ? (current + 1) % items.length
                : (current - 1 + items.length) % items.length
            if (items[next]) focusItem(items[next], { focusVisible: true })
          } else if (event.key === "Home") {
            event.preventDefault()
            if (items[0]) focusItem(items[0], { focusVisible: true })
          } else if (event.key === "End") {
            event.preventDefault()
            const last = items[items.length - 1]
            if (last) focusItem(last, { focusVisible: true })
          }
        }}
        {...props}
      >
        {checkedList.map((index) => {
          const rect = rects[index]
          if (!rect) return null
          const joinsAbove =
            checkedIndices.has(index - 1) || activeIndex === index - 1
          const joinsBelow =
            checkedIndices.has(index + 1) || activeIndex === index + 1
          return (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute z-0 bg-muted motion-safe:transition-[border-radius,top,left,width,height] motion-safe:duration-(--duration-fast) motion-safe:ease-(--ease-standard)"
              key={index}
              style={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                borderTopLeftRadius: joinsAbove ? 0 : SELECTION_RADIUS,
                borderTopRightRadius: joinsAbove ? 0 : SELECTION_RADIUS,
                borderBottomLeftRadius: joinsBelow ? 0 : SELECTION_RADIUS,
                borderBottomRightRadius: joinsBelow ? 0 : SELECTION_RADIUS,
              }}
            />
          )
        })}
        <FluidHoverHighlight
          className="rounded-none"
          hover={hover}
          onFill={activeIndex !== null && checkedIndices.has(activeIndex)}
          style={{
            borderTopLeftRadius:
              activeIndex !== null && checkedIndices.has(activeIndex - 1)
                ? 0
                : SELECTION_RADIUS,
            borderTopRightRadius:
              activeIndex !== null && checkedIndices.has(activeIndex - 1)
                ? 0
                : SELECTION_RADIUS,
            borderBottomLeftRadius:
              activeIndex !== null && checkedIndices.has(activeIndex + 1)
                ? 0
                : SELECTION_RADIUS,
            borderBottomRightRadius:
              activeIndex !== null && checkedIndices.has(activeIndex + 1)
                ? 0
                : SELECTION_RADIUS,
          }}
        />
        {children}
      </div>
    </CheckboxGroupContext.Provider>
  )
}

function CheckboxItem({
  label,
  index,
  checked,
  onToggle,
  className,
  ref: forwardedRef,
  ...props
}: Omit<React.ComponentProps<"div">, "onToggle"> & {
  label: string
  index: number
  checked: boolean
  onToggle: () => void
}) {
  const { activeIndex } = useCheckboxGroup()
  const active = activeIndex === index

  return (
      <div
        ref={forwardedRef}
        aria-checked={checked}
        aria-label={label}
        className={cn(
          "group/checkbox-item relative z-10 flex h-8 cursor-pointer items-center gap-2 rounded-sm px-2 text-sm font-medium text-muted-foreground outline-hidden transition-[background-color,color] duration-(--duration-fast) ease-(--ease-standard) hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
          (checked || active) && "text-foreground",
          className,
        )}
        data-fluid-hover-item=""
        data-slot="checkbox-item"
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault()
            onToggle()
          }
        }}
        onMouseDown={(event) => {
          const interactive = (event.target as HTMLElement).closest(
            'button:not([tabindex="-1"]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          )
          if (interactive && interactive !== event.currentTarget) return
          event.preventDefault()
          focusItem(event.currentTarget, {
            preventScroll: true,
            focusVisible: false,
          })
        }}
        role="checkbox"
        tabIndex={0}
        {...props}
      >
        <CheckboxGlyph
          checked={checked}
          className="motion-safe:group-active/checkbox-item:scale-[0.85]"
          preview={active}
        />
        <span className="min-w-0">{label}</span>
      </div>
  )
}

export { CheckboxGroup, CheckboxItem }
