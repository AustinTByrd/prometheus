// @prometheus 0.2.0
"use client"

import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
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

type RadioGroupContextValue = {
  activeIndex: number | null
  selectedIndex: number | null
  selectedValue?: string
  onValueChange?: (value: string) => void
  hasSelection: boolean
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null,
)

function useRadioGroup() {
  const context = React.useContext(RadioGroupContext)
  if (!context) {
    throw new Error("RadioItem must be used within a RadioGroup")
  }
  return context
}

function RadioGroup({
  children,
  selectedIndex,
  value,
  onValueChange,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "onSelect"> & {
  selectedIndex?: number
  value?: string
  onValueChange?: (value: string) => void
}) {
  const hover = useFluidHover<HTMLDivElement>({ nearest: true, axis: "y" })
  const [rects, setRects] = React.useState<ItemRect[]>([])

  const childValues = React.Children.toArray(children)
    .filter(React.isValidElement)
    .map((child) => (child.props as { value?: string }).value)

  const resolvedSelectedIndex =
    value !== undefined
      ? childValues.findIndex((childValue) => childValue === value)
      : (selectedIndex ?? -1)

  const hasSelection =
    resolvedSelectedIndex >= 0 ||
    React.Children.toArray(children)
      .filter(React.isValidElement)
      .some((child) => (child.props as { selected?: boolean }).selected === true)

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

  const selectedRect =
    resolvedSelectedIndex >= 0 ? rects[resolvedSelectedIndex] : null

  const content = (
    <div
      className={cn(
        "relative isolate flex w-72 max-w-full flex-col select-none",
        className,
      )}
      data-slot="radio-group"
      ref={hover.ref}
      role="radiogroup"
      {...hover.handlers}
      onKeyDown={(event) => {
        const items = Array.from(
          hover.ref.current?.querySelectorAll<HTMLElement>(
            "[data-fluid-hover-item]",
          ) ?? [],
        )
        const current = items.indexOf(event.target as HTMLElement)
        if (current === -1) return
        const preventBaseUI = (
          event as unknown as { preventBaseUIHandler?: () => void }
        ).preventBaseUIHandler
        if (
          ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(
            event.key,
          )
        ) {
          event.preventDefault()
          preventBaseUI?.()
          const next = ["ArrowDown", "ArrowRight"].includes(event.key)
            ? (current + 1) % items.length
            : (current - 1 + items.length) % items.length
          if (items[next]) {
            focusItem(items[next], { focusVisible: true })
            items[next].click()
          }
        } else if (event.key === "Home") {
          event.preventDefault()
          preventBaseUI?.()
          if (items[0]) {
            focusItem(items[0], { focusVisible: true })
            items[0].click()
          }
        } else if (event.key === "End") {
          event.preventDefault()
          preventBaseUI?.()
          const last = items[items.length - 1]
          if (last) {
            focusItem(last, { focusVisible: true })
            last.click()
          }
        }
      }}
      {...props}
    >
      {selectedRect ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-0 bg-muted motion-safe:transition-[top,left,width,height] motion-safe:duration-(--duration-fast) motion-safe:ease-(--ease-standard)"
          style={{
            top: selectedRect.top,
            left: selectedRect.left,
            width: selectedRect.width,
            height: selectedRect.height,
            borderRadius: SELECTION_RADIUS,
          }}
        />
      ) : null}
      <FluidHoverHighlight
        hover={hover}
        onFill={
          activeIndex !== null && activeIndex === resolvedSelectedIndex
        }
      />
      {children}
    </div>
  )

  const contextValue: RadioGroupContextValue = {
    activeIndex,
    selectedIndex: resolvedSelectedIndex >= 0 ? resolvedSelectedIndex : null,
    selectedValue: value,
    onValueChange,
    hasSelection,
  }

  if (value !== undefined) {
    return (
      <RadioGroupContext.Provider value={contextValue}>
        <RadioGroupPrimitive
          onValueChange={(next) => onValueChange?.(next as string)}
          render={content}
          value={value}
        />
      </RadioGroupContext.Provider>
    )
  }

  return (
    <RadioGroupContext.Provider value={contextValue}>
      {content}
    </RadioGroupContext.Provider>
  )
}

function RadioGlyph({
  selected,
  active,
}: {
  selected: boolean
  active: boolean
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative flex size-4 origin-center shrink-0 items-center justify-center rounded-full border-[1.5px] border-solid transition-[border-color,background-color,scale] duration-80 ease-(--ease-standard) motion-safe:group-active/radio-item:scale-[0.85]",
        selected
          ? "border-transparent bg-foreground"
          : "border-black/20 bg-transparent mix-blend-color-burn dark:border-white/20 dark:mix-blend-plus-lighter",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full transition-opacity duration-80",
          selected
            ? "bg-background opacity-100"
            : active
              ? "bg-foreground opacity-20"
              : "opacity-0",
        )}
      />
    </span>
  )
}

function RadioItem({
  label,
  index,
  selected,
  onSelect,
  value,
  className,
  ref: forwardedRef,
  ...props
}: Omit<React.ComponentProps<"div">, "onSelect"> & {
  label: string
  index: number
  selected?: boolean
  onSelect?: () => void
  value?: string
}) {
  const {
    activeIndex,
    selectedIndex,
    selectedValue,
    onValueChange,
    hasSelection,
  } = useRadioGroup()
  const active = activeIndex === index
  const isSelected =
    value !== undefined && selectedValue !== undefined
      ? selectedValue === value
      : (selected ?? selectedIndex === index)
  const handleSelect = () => {
    if (value !== undefined) onValueChange?.(value)
    onSelect?.()
  }

  return (
    <div
      ref={forwardedRef}
      aria-checked={isSelected}
      aria-label={label}
      className={cn(
        "group/radio-item relative z-10 flex h-8 cursor-pointer items-center gap-2 rounded-sm px-2 text-sm font-medium text-muted-foreground outline-hidden transition-[background-color,color] duration-(--duration-fast) ease-(--ease-standard) hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
        (isSelected || active) && "text-foreground",
        className,
      )}
      data-fluid-hover-item=""
      data-slot="radio-item"
      onClick={handleSelect}
      onKeyDown={(event) => {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault()
          handleSelect()
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
      role="radio"
      tabIndex={isSelected ? 0 : !hasSelection && index === 0 ? 0 : -1}
      {...props}
    >
      <RadioGlyph active={active} selected={isSelected} />
      <span className="min-w-0">{label}</span>
      {value !== undefined ? (
        <RadioPrimitive.Root
          aria-hidden
          className="pointer-events-none absolute size-0 overflow-hidden opacity-0"
          tabIndex={-1}
          value={value}
        />
      ) : null}
    </div>
  )
}

export { RadioGroup, RadioItem }
