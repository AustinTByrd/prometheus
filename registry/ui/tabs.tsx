// @prometheus 0.2.0
"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useElevatedLevel } from "@/lib/elevated"
import { spring } from "@/lib/springs"
import { SURFACE_BG } from "@/lib/surface-classes"
import { cn } from "@/lib/utils"

/** Steps above the substrate, matching the default Button lift. */
const DEFAULT_LIFT = 2

export type TabsSize = "sm" | "default" | "lg"

type TabRect = {
  left: number
  top: number
  width: number
  height: number
}

const PILL_TAB_EDGE_CLASSES =
  "rounded-(--pill-r) px-(--pill-px) [&>*]:[--pill-edge:calc(var(--pill-r)_*_(1_-_pi_/_4)_*_var(--pill-r)_/_var(--pill))] [&>svg]:[--pill-edge:calc(var(--pill-py)_-_var(--pill-px))] [&>[data-icon]]:[--pill-edge:calc(var(--pill-py)_-_var(--pill-px))] [&>:first-child]:ms-(--pill-edge) [&>:last-child:not([data-tab-collapsible])]:me-(--pill-edge)"

const SIZE_CONFIG: Record<
  TabsSize,
  {
    control: string
    pillVars: string
    gap: string
    text: string
    icon: string
    labelMargin: number
    iconEdgePx: number
    textEdgePx: number
  }
> = {
  sm: {
    control: "h-7",
    pillVars:
      "[--pill-py:7px] [--pill-px:10px] [--pill:14px] [--pill-r:var(--pill)]",
    gap: "gap-1.5",
    text: "text-[0.8rem]",
    icon: "size-3.5",
    labelMargin: 6,
    iconEdgePx: -3,
    textEdgePx: 14 * (1 - Math.PI / 4),
  },
  default: {
    control: "h-8",
    pillVars:
      "[--pill-py:8px] [--pill-px:10px] [--pill:16px] [--pill-r:var(--pill)]",
    gap: "gap-1.5",
    text: "text-sm",
    icon: "size-4",
    labelMargin: 6,
    iconEdgePx: -2,
    textEdgePx: 16 * (1 - Math.PI / 4),
  },
  lg: {
    control: "h-9",
    pillVars:
      "[--pill-py:10px] [--pill-px:11px] [--pill:18px] [--pill-r:var(--pill)]",
    gap: "gap-2",
    text: "text-sm",
    icon: "size-4",
    labelMargin: 8,
    iconEdgePx: -1,
    textEdgePx: 18 * (1 - Math.PI / 4),
  },
}

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

function measureOffset(element: HTMLElement, container: HTMLElement): TabRect {
  let top = element.offsetTop
  let left = element.offsetLeft
  let ancestor = element.offsetParent as HTMLElement | null
  while (ancestor && ancestor !== container && container.contains(ancestor)) {
    top += ancestor.offsetTop + ancestor.clientTop
    left += ancestor.offsetLeft + ancestor.clientLeft
    ancestor = ancestor.offsetParent as HTMLElement | null
  }
  return {
    left,
    top,
    width: element.offsetWidth,
    height: element.offsetHeight,
  }
}

interface TabsContextValue {
  registerTab: (index: number, element: HTMLElement | null) => void
  selectedIndex: number
  idPrefix: string | undefined
  activeLabel: boolean
  size: TabsSize
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabs() {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error("TabsItem must be used within Tabs")
  return ctx
}

export interface TabsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  children: React.ReactNode
  /** Index of the currently selected tab. */
  selectedIndex: number
  /** Called when a tab is selected. */
  onSelect: (index: number) => void
  /** Prefix for ARIA IDs linking tabs to external TabsPanel elements. */
  idPrefix?: string
  /** When true, only the selected tab shows its text label. Requires icons on tabs. */
  activeLabel?: boolean
  /** Control height, matching Button sizes. */
  size?: TabsSize
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      children,
      selectedIndex,
      onSelect,
      idPrefix,
      activeLabel = false,
      size = "default",
      className,
      ...props
    },
    ref,
  ) => {
    const level = useElevatedLevel(DEFAULT_LIFT)
    const reduceMotion = useReducedMotion() ?? false

    const containerRef = React.useRef<HTMLDivElement | null>(null)
    const tabElementsRef = React.useRef(new Map<number, HTMLElement>())
    const tabRectsRef = React.useRef<TabRect[]>([])
    const tabObserverRef = React.useRef<ResizeObserver | null>(null)

    const [tabRects, setTabRects] = React.useState<TabRect[]>([])
    const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null)

    const measureTabs = React.useCallback(() => {
      const container = containerRef.current
      if (!container) return
      const next: TabRect[] = []
      let complete = true
      tabElementsRef.current.forEach((element, index) => {
        const hasLayout =
          element.offsetParent !== null ||
          element.offsetWidth > 0 ||
          element.offsetHeight > 0
        if (!hasLayout) {
          complete = false
          return
        }
        next[index] = measureOffset(element, container)
      })
      if (!complete) return

      const prev = tabRectsRef.current
      let changed = prev.length !== next.length
      for (let i = 0; !changed && i < next.length; i++) {
        const p = prev[i]
        const n = next[i]
        if (p === n) continue
        changed =
          !p ||
          !n ||
          p.left !== n.left ||
          p.top !== n.top ||
          p.width !== n.width ||
          p.height !== n.height
      }
      if (changed) {
        tabRectsRef.current = next
        setTabRects(next)
      }
    }, [])

    const measureTabsRef = React.useRef(measureTabs)
    useIsoLayoutEffect(() => {
      measureTabsRef.current = measureTabs
    })

    const registerTab = React.useCallback(
      (index: number, element: HTMLElement | null) => {
        if (
          tabObserverRef.current === null &&
          typeof ResizeObserver !== "undefined"
        ) {
          tabObserverRef.current = new ResizeObserver(() =>
            measureTabsRef.current(),
          )
        }
        const previous = tabElementsRef.current.get(index)
        if (previous && previous !== element) {
          tabObserverRef.current?.unobserve(previous)
        }
        if (element) {
          tabElementsRef.current.set(index, element)
          tabObserverRef.current?.observe(element)
        } else {
          tabElementsRef.current.delete(index)
        }
        measureTabsRef.current()
      },
      [],
    )

    React.useEffect(() => {
      const container = containerRef.current
      if (!container || typeof ResizeObserver === "undefined") return
      const ro = new ResizeObserver(() => measureTabsRef.current())
      ro.observe(container)
      return () => ro.disconnect()
    }, [])

    React.useEffect(
      () => () => {
        tabObserverRef.current?.disconnect()
        tabObserverRef.current = null
      },
      [],
    )

    const tabCount = React.Children.count(children)
    useIsoLayoutEffect(() => {
      measureTabs()
    }, [measureTabs, tabCount, size])

    const selectedRect = tabRects[selectedIndex]
    const focusRect = focusedIndex !== null ? tabRects[focusedIndex] : null

    const selectedTransition = reduceMotion
      ? { duration: 0, opacity: { duration: 0.08 } }
      : { ...spring.moderate, opacity: { duration: 0.08 } }

    const fastTransition = reduceMotion
      ? { duration: 0, opacity: { duration: 0.08 } }
      : { ...spring.fast, opacity: { duration: 0.08 } }

    return (
      <TabsContext.Provider
        value={{
          registerTab,
          selectedIndex,
          idPrefix,
          activeLabel,
          size,
        }}
      >
        <TabsPrimitive.Root
          value={selectedIndex}
          onValueChange={(value) => {
            if (typeof value === "number") onSelect(value)
          }}
          render={
            <TabsPrimitive.List
              activateOnFocus={false}
              data-slot="tabs"
              ref={(node: HTMLDivElement | null) => {
                containerRef.current = node
                if (typeof ref === "function") ref(node)
                else if (ref) ref.current = node
              }}
              onFocus={(e: React.FocusEvent<HTMLDivElement>) => {
                const indexAttr = (e.target as HTMLElement)
                  .closest("[data-tab-index]")
                  ?.getAttribute("data-tab-index")
                if (indexAttr != null) {
                  const idx = Number(indexAttr)
                  const isFocusVisible = (e.target as HTMLElement).matches(
                    ":focus-visible",
                  )
                  if (isFocusVisible) {
                    setFocusedIndex(idx)
                  } else {
                    setFocusedIndex(null)
                  }
                }
              }}
              onBlur={(e: React.FocusEvent<HTMLDivElement>) => {
                if (
                  containerRef.current?.contains(
                    e.relatedTarget as Node | null,
                  )
                ) {
                  return
                }
                setFocusedIndex(null)
              }}
              className={cn(
                // Negative margins + matching padding give the 2px-outset focus
                // ring and the selected pill's drop shadow room inside
                // overflow-x-auto without clipping.
                "relative flex w-fit max-w-[calc(100%+12px)] items-center gap-0.5 overflow-x-auto -mx-1.5 px-1.5 -my-1.5 py-1.5 select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                className,
              )}
              {...props}
            >
              {/* Selected pill — default Button surface & shadow, fully rounded */}
              {selectedRect && (
                <motion.div
                  aria-hidden="true"
                  data-slot="tabs-indicator"
                  className={cn(
                    "pointer-events-none absolute rounded-full shadow-[inset_0_1px_0_0_rgb(255_255_255/0.08),0_0_0_0.5px_hsl(0_0%_0%/10%),0_4px_1px_-2px_hsl(0_0%_0%/8%)]",
                    SURFACE_BG[level],
                  )}
                  initial={false}
                  animate={{
                    left: selectedRect.left,
                    top: selectedRect.top,
                    width: selectedRect.width,
                    height: selectedRect.height,
                    opacity: 1,
                  }}
                  transition={selectedTransition}
                />
              )}

              {/* Focus ring — 2px outset pill ring for keyboard focus */}
              <AnimatePresence>
                {focusRect && (
                  <motion.div
                    aria-hidden="true"
                    data-slot="tabs-focus-ring"
                    className="pointer-events-none absolute z-20 rounded-full border border-ring ring-3 ring-ring/50"
                    initial={{
                      left: focusRect.left - 2,
                      top: focusRect.top - 2,
                      width: focusRect.width + 4,
                      height: focusRect.height + 4,
                      opacity: 0,
                    }}
                    animate={{
                      left: focusRect.left - 2,
                      top: focusRect.top - 2,
                      width: focusRect.width + 4,
                      height: focusRect.height + 4,
                      opacity: 1,
                    }}
                    exit={{ opacity: 0, transition: spring.fast.exit }}
                    transition={fastTransition}
                  />
                )}
              </AnimatePresence>

              {children}
            </TabsPrimitive.List>
          }
        />
      </TabsContext.Provider>
    )
  },
)
Tabs.displayName = "Tabs"

export type TabsIcon =
  | React.ComponentType<React.SVGProps<SVGSVGElement>>
  | React.ReactNode

export interface TabsItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Icon component (e.g. from @heroicons/react/16/solid) or element. */
  icon?: TabsIcon
  /** Text label for the tab. */
  label: string
  /** Zero-based position index within the tab list. */
  index: number
}

function renderTabIcon(
  icon: TabsIcon | undefined,
  className: string,
): React.ReactNode {
  if (!icon) return null
  if (React.isValidElement(icon)) {
    return React.cloneElement(
      icon as React.ReactElement<{ className?: string }>,
      {
        className: cn(
          className,
          (icon.props as { className?: string }).className,
        ),
      },
    )
  }
  if (
    typeof icon === "function" ||
    (typeof icon === "object" && "$$typeof" in icon)
  ) {
    const Icon = icon as React.ComponentType<React.SVGProps<SVGSVGElement>>
    return <Icon aria-hidden="true" className={className} />
  }
  return icon
}

const TabsItem = React.forwardRef<HTMLButtonElement, TabsItemProps>(
  ({ icon, label, index, disabled, className, ...props }, ref) => {
    const internalRef = React.useRef<HTMLButtonElement | null>(null)
    const reduceMotion = useReducedMotion() ?? false

    // Measure the label's true layout width so activeLabel expansion animates
    // to a concrete pixel target rather than framer's visual "auto".
    const [labelWidth, setLabelWidth] = React.useState<number | null>(null)
    const labelRoRef = React.useRef<ResizeObserver | null>(null)
    const measureLabel = React.useCallback((el: HTMLSpanElement | null) => {
      labelRoRef.current?.disconnect()
      labelRoRef.current = null
      if (!el) return
      const update = () => setLabelWidth(el.offsetWidth)
      update()
      if (typeof ResizeObserver !== "undefined") {
        labelRoRef.current = new ResizeObserver(update)
        labelRoRef.current.observe(el)
      }
    }, [])

    React.useEffect(
      () => () => {
        labelRoRef.current?.disconnect()
        labelRoRef.current = null
      },
      [],
    )

    const { registerTab, selectedIndex, idPrefix, activeLabel, size } = useTabs()
    const sizeClasses = SIZE_CONFIG[size]

    useIsoLayoutEffect(() => {
      registerTab(index, internalRef.current)
      return () => registerTab(index, null)
    }, [index, registerTab])

    const isSelected = selectedIndex === index
    // An unselected tab takes the selected tab's text color on hover or
    // keyboard focus. The pill only moves on click.
    const tabTextClassName = isSelected
      ? "text-foreground"
      : "text-muted-foreground group-hover/tab:text-foreground group-focus-visible/tab:text-foreground"
    const hasIcon = icon != null
    const collapseLabel = activeLabel && hasIcon
    const showLabel = !collapseLabel || isSelected

    const labelContent = (
      <span
        ref={measureLabel}
        className={cn(
          "whitespace-nowrap font-medium transition-colors duration-(--duration-instant) ease-(--ease-standard)",
          sizeClasses.text,
          tabTextClassName,
        )}
      >
        {label}
      </span>
    )

    const expandTransition = reduceMotion
      ? { duration: 0, opacity: { duration: 0.06 } }
      : { ...spring.fast, opacity: { duration: 0.06 } }

    return (
      <TabsPrimitive.Tab
        ref={(node: HTMLElement | null) => {
          const button = node as HTMLButtonElement | null
          internalRef.current = button
          if (typeof ref === "function") ref(button)
          else if (ref) ref.current = button
        }}
        value={index}
        disabled={disabled}
        data-slot="tabs-item"
        data-tab-index={index}
        id={idPrefix ? `${idPrefix}-tab-${index}` : undefined}
        aria-controls={idPrefix ? `${idPrefix}-panel-${index}` : undefined}
        aria-label={collapseLabel && !showLabel ? label : undefined}
        className={cn(
          "group/tab relative z-10 inline-flex shrink-0 cursor-pointer items-center justify-center border-none bg-transparent outline-none whitespace-nowrap select-none disabled:pointer-events-none disabled:opacity-50",
          sizeClasses.control,
          sizeClasses.pillVars,
          PILL_TAB_EDGE_CLASSES,
          !collapseLabel && sizeClasses.gap,
          className,
        )}
        {...props}
      >
        {renderTabIcon(
          icon,
          cn(
            "shrink-0 transition-colors duration-(--duration-instant) ease-(--ease-standard)",
            sizeClasses.icon,
            tabTextClassName,
          ),
        )}
        {collapseLabel ? (
          <AnimatePresence initial={false}>
            {showLabel && (
              <motion.span
                key="label"
                data-tab-collapsible=""
                className="overflow-hidden"
                style={labelWidth == null ? { width: "auto" } : undefined}
                initial={{
                  width: 0,
                  opacity: 0,
                  marginLeft: 0,
                  marginRight: sizeClasses.iconEdgePx,
                }}
                animate={{
                  ...(labelWidth != null ? { width: labelWidth } : null),
                  opacity: 1,
                  marginLeft: sizeClasses.labelMargin,
                  marginRight: sizeClasses.textEdgePx,
                }}
                exit={{
                  width: 0,
                  opacity: 0,
                  marginLeft: 0,
                  marginRight: sizeClasses.iconEdgePx,
                }}
                transition={expandTransition}
              >
                {labelContent}
              </motion.span>
            )}
          </AnimatePresence>
        ) : (
          labelContent
        )}
      </TabsPrimitive.Tab>
    )
  },
)
TabsItem.displayName = "TabsItem"

export interface TabsPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Zero-based index of this panel. */
  index: number
  /** Currently selected tab index. */
  selectedIndex: number
  /** Must match the Tabs idPrefix. */
  idPrefix: string
  children: React.ReactNode
}

const TabsPanel = React.forwardRef<HTMLDivElement, TabsPanelProps>(
  ({ index, selectedIndex, idPrefix, children, className, ...props }, ref) => {
    const isSelected = selectedIndex === index

    return (
      <div
        ref={ref}
        data-slot="tabs-panel"
        id={`${idPrefix}-panel-${index}`}
        role="tabpanel"
        aria-labelledby={`${idPrefix}-tab-${index}`}
        hidden={!isSelected}
        tabIndex={-1}
        className={cn("outline-none", className)}
        {...props}
      >
        {isSelected && children}
      </div>
    )
  },
)
TabsPanel.displayName = "TabsPanel"

export { Tabs, TabsItem, TabsPanel }
export default Tabs
