// @prometheus 0.2.0
"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import {
  FluidHoverHighlight,
  fluidHoverTargetHasFill,
  useFluidHover,
} from "@/lib/fluid-hover"
import { usePrometheus } from "@/components/prometheus-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { SkeletonBox } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Bars3Icon } from "@heroicons/react/16/solid"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "15rem"
const SIDEBAR_WIDTH_MOBILE = "15rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"
const SIDEBAR_RESIZE_STORAGE_KEY = "sidebar_resize"
const SIDEBAR_RESIZE_CLICK_SLOP = 3
const SIDEBAR_RESIZE_OVERDRAG = 0.15

const SIDEBAR_LEARN_SAMPLE_LIMIT = 40
const SIDEBAR_LEARN_MIN_SAMPLES = 3
const SIDEBAR_LEARN_HALF_LIFE = 8
const SIDEBAR_LEARN_BANDWIDTH = 12
const SIDEBAR_SNAP_RADIUS = 16
const SIDEBAR_SNAP_RELOCK = 24
const SIDEBAR_SNAP_UNLOCK_SPEED = 0.05
const SIDEBAR_SNAP_UNLOCK_DWELL = 180

type SidebarResize = "none" | "fixed" | "learn"

type SidebarResizeDrag = {
  width: number
  snapped: boolean
}

type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
  resize: SidebarResize
  width: number
  minWidth: number
  maxWidth: number
  samples: number[]
  preferredWidth: number | null
  drag: SidebarResizeDrag | null
  startResize: (event: React.PointerEvent<HTMLElement>) => boolean
  resetResize: () => void
}

function sidebarSampleWeights(count: number) {
  const weights = Array.from({ length: count }, (_, index) =>
    Math.pow(0.5, (count - 1 - index) / SIDEBAR_LEARN_HALF_LIFE),
  )
  const total = weights.reduce((sum, weight) => sum + weight, 0)
  return weights.map((weight) => weight / total)
}

function sidebarWidthDensity(
  samples: number[],
  minWidth: number,
  maxWidth: number,
  step = 1,
) {
  const weights = sidebarSampleWeights(samples.length)
  const points: { width: number; density: number }[] = []
  for (let width = minWidth; width <= maxWidth; width += step) {
    let density = 0
    samples.forEach((sample, index) => {
      const distance = (width - sample) / SIDEBAR_LEARN_BANDWIDTH
      density += weights[index] * Math.exp(-0.5 * distance * distance)
    })
    points.push({ width, density })
  }
  return points
}

function learnedSidebarWidth(
  samples: number[],
  minWidth: number,
  maxWidth: number,
) {
  if (samples.length < SIDEBAR_LEARN_MIN_SAMPLES) return null
  let peak: { width: number; density: number } | null = null
  for (const point of sidebarWidthDensity(samples, minWidth, maxWidth)) {
    if (!peak || point.density > peak.density) peak = point
  }
  return peak?.width ?? null
}

function readSidebarResize(storageKey: string) {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? "null")
    if (!stored || typeof stored.width !== "number") return null
    return {
      width: stored.width as number,
      samples: Array.isArray(stored.samples)
        ? (stored.samples as unknown[]).filter(
            (sample): sample is number => typeof sample === "number",
          )
        : [],
    }
  } catch {
    return null
  }
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  resize = "none",
  defaultWidth = 240,
  minWidth = 200,
  maxWidth = 480,
  storageKey = SIDEBAR_RESIZE_STORAGE_KEY,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  resize?: SidebarResize
  defaultWidth?: number
  minWidth?: number
  maxWidth?: number
  storageKey?: string
}) {
  const { isMobile } = usePrometheus()
  const [openMobile, setOpenMobile] = React.useState(false)

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open],
  )

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar])

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed"

  const [width, setWidth] = React.useState(defaultWidth)
  const [samples, setSamples] = React.useState<number[]>([])
  const [drag, setDrag] = React.useState<SidebarResizeDrag | null>(null)

  React.useLayoutEffect(() => {
    if (resize !== "learn") return
    const stored = readSidebarResize(storageKey)
    if (!stored) return
    setWidth(Math.min(Math.max(stored.width, minWidth), maxWidth))
    setSamples(stored.samples.slice(-SIDEBAR_LEARN_SAMPLE_LIMIT))
  }, [resize, storageKey, minWidth, maxWidth])

  const preferredWidth = React.useMemo(
    () =>
      resize === "learn"
        ? learnedSidebarWidth(samples, minWidth, maxWidth)
        : null,
    [resize, samples, minWidth, maxWidth],
  )

  const commitWidth = React.useCallback(
    (next: number) => {
      const nextSamples = [...samples, next].slice(-SIDEBAR_LEARN_SAMPLE_LIMIT)
      setWidth(next)
      setSamples(nextSamples)
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({ width: next, samples: nextSamples }),
        )
      } catch {}
    },
    [samples, storageKey],
  )

  const resetResize = React.useCallback(() => {
    setWidth(defaultWidth)
    setSamples([])
    try {
      localStorage.removeItem(storageKey)
    } catch {}
  }, [defaultWidth, storageKey])

  const startResize = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (resize === "none" || isMobile || event.button !== 0) return false

      const handle = event.currentTarget
      const sidebar = handle.closest<HTMLElement>("[data-slot=sidebar]")
      const direction = sidebar?.dataset.side === "right" ? -1 : 1
      const collapsedWidth =
        sidebar?.dataset.collapsibleMode === "icon"
          ? parseFloat(SIDEBAR_WIDTH_ICON) * 16
          : 0
      const startWidth = open ? width : collapsedWidth
      const startX = event.clientX
      const ceiling = resize === "fixed" ? width : maxWidth

      let current: SidebarResizeDrag | null = null
      let unlocked = false
      let slowSince: number | null = null
      let lastX = startX
      let lastTime = event.timeStamp
      let speed = Infinity

      const onMove = (moveEvent: PointerEvent) => {
        const offset = (moveEvent.clientX - startX) * direction
        if (!current && Math.abs(offset) < SIDEBAR_RESIZE_CLICK_SLOP) return

        const elapsed = Math.max(1, moveEvent.timeStamp - lastTime)
        const velocity = Math.abs(moveEvent.clientX - lastX) / elapsed
        speed = speed === Infinity ? velocity : speed * 0.6 + velocity * 0.4
        lastX = moveEvent.clientX
        lastTime = moveEvent.timeStamp

        const raw = startWidth + offset
        let next =
          raw > ceiling
            ? ceiling + (raw - ceiling) * SIDEBAR_RESIZE_OVERDRAG
            : Math.max(0, raw)
        let snapped = false

        if (preferredWidth !== null && next >= minWidth && !moveEvent.altKey) {
          const distance = Math.abs(next - preferredWidth)
          if (distance > SIDEBAR_SNAP_RELOCK) {
            unlocked = false
            slowSince = null
          } else if (distance <= SIDEBAR_SNAP_RADIUS && !unlocked) {
            if (speed < SIDEBAR_SNAP_UNLOCK_SPEED) {
              slowSince ??= moveEvent.timeStamp
              if (moveEvent.timeStamp - slowSince >= SIDEBAR_SNAP_UNLOCK_DWELL) {
                unlocked = true
              }
            } else {
              slowSince = null
            }
            if (!unlocked) {
              next = preferredWidth
              snapped = true
            }
          }
        }

        current = { width: next, snapped }
        setDrag(current)
      }

      const onEnd = () => {
        handle.removeEventListener("pointermove", onMove)
        handle.removeEventListener("pointerup", onEnd)
        handle.removeEventListener("pointercancel", onEnd)
        document.body.style.removeProperty("cursor")
        document.body.style.removeProperty("user-select")
        if (!current) return

        const released = current.width
        setDrag(null)
        if (resize === "fixed") {
          setOpen(released >= width / 2)
        } else if (released < minWidth * 0.6) {
          setOpen(false)
        } else {
          commitWidth(
            Math.round(Math.min(Math.max(released, minWidth), maxWidth)),
          )
          setOpen(true)
        }
      }

      handle.setPointerCapture(event.pointerId)
      handle.addEventListener("pointermove", onMove)
      handle.addEventListener("pointerup", onEnd)
      handle.addEventListener("pointercancel", onEnd)
      document.body.style.cursor = "ew-resize"
      document.body.style.userSelect = "none"
      return true
    },
    [
      resize,
      isMobile,
      open,
      width,
      minWidth,
      maxWidth,
      preferredWidth,
      setOpen,
      commitWidth,
    ],
  )

  const floorWidth = resize === "fixed" ? width : minWidth
  const renderedWidth = drag ? Math.max(drag.width, floorWidth) : width

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      resize,
      width,
      minWidth,
      maxWidth,
      samples,
      preferredWidth,
      drag,
      startResize,
      resetResize,
    }),
    [
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      resize,
      width,
      minWidth,
      maxWidth,
      samples,
      preferredWidth,
      drag,
      startResize,
      resetResize,
    ],
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        data-resizing={drag ? "" : undefined}
        style={
          {
            "--sidebar-width":
              resize === "none" ? SIDEBAR_WIDTH : `${renderedWidth}px`,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  dir,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
}) {
  const {
    isMobile,
    state,
    openMobile,
    setOpenMobile,
    resize,
    width,
    minWidth,
    drag,
  } = useSidebar()
  const visualState = drag ? "expanded" : state
  const floorWidth = resize === "fixed" ? width : minWidth
  const dragOffset = drag ? Math.min(0, drag.width - floorWidth) : 0

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground",
          className,
        )}
        style={style}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          dir={dir}
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          showCloseButton={false}
          className="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              ...style,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      className="group peer hidden text-sidebar-foreground md:block"
      data-state={visualState}
      data-collapsible={visualState === "collapsed" ? collapsible : ""}
      data-collapsible-mode={collapsible}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        style={drag ? { width: Math.max(0, drag.width) } : undefined}
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear group-data-resizing/sidebar-wrapper:transition-none",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
        )}
      />
      <div
        data-slot="sidebar-container"
        data-side={side}
        style={drag ? { ...style, [side]: dragOffset } : style}
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear group-data-resizing/sidebar-wrapper:transition-none data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="flex size-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon-sm"
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <Bars3Icon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

function SidebarRail({
  className,
  onClick,
  onPointerDown,
  ...props
}: React.ComponentProps<"button">) {
  const { toggleSidebar, resize, open, drag, startResize } = useSidebar()
  const travel = React.useRef(0)

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      data-resizable={resize === "none" ? undefined : ""}
      data-dragging={drag ? "" : undefined}
      data-snapped={drag?.snapped ? "" : undefined}
      aria-label={resize === "none" ? "Toggle Sidebar" : "Resize Sidebar"}
      aria-expanded={open}
      tabIndex={-1}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        travel.current = 0
        if (event.defaultPrevented || !startResize(event)) return
        const handle = event.currentTarget
        const startX = event.clientX
        const onMove = (moveEvent: PointerEvent) => {
          travel.current = Math.max(
            travel.current,
            Math.abs(moveEvent.clientX - startX),
          )
        }
        handle.addEventListener("pointermove", onMove)
        handle.addEventListener(
          "lostpointercapture",
          () => handle.removeEventListener("pointermove", onMove),
          { once: true },
        )
      }}
      onClick={(event) => {
        onClick?.(event)
        const dragged = travel.current >= SIDEBAR_RESIZE_CLICK_SLOP
        travel.current = 0
        if (event.defaultPrevented || dragged) return
        toggleSidebar()
      }}
      title={resize === "none" ? "Toggle Sidebar" : undefined}
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] after:transition-colors hover:after:bg-sidebar-border sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "data-resizable:cursor-ew-resize! data-dragging:after:bg-sidebar-border data-snapped:after:bg-sidebar-primary",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className,
      )}
      {...props}
    />
  )
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className,
      )}
      {...props}
    />
  )
}

function SidebarInput({
  className,
  variant = "filled",
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("w-full", className)}
      variant={variant}
      {...props}
    />
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
}

function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props}
    />
  )
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "no-scrollbar flex min-h-0 flex-1 flex-col gap-6 overflow-auto py-2 group-data-[collapsible=icon]:overflow-hidden",
        className,
      )}
      {...props}
    />
  )
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col px-2", className)}
      {...props}
    />
  )
}

function SidebarGroupLabel({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div"> & React.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "flex h-5 shrink-0 items-start rounded-sm text-xs text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-5 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "sidebar-group-label",
      sidebar: "group-label",
    },
  })
}

function SidebarGroupAction({
  className,
  render,
  ...props
}: useRender.ComponentProps<"button"> & React.ComponentProps<"button">) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(
          "absolute top-0 right-2 flex aspect-square w-5 items-center justify-center rounded-sm p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 hover:bg-hover hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "sidebar-group-action",
      sidebar: "group-action",
    },
  })
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  )
}

function SidebarMenu({
  className,
  children,
  ...props
}: React.ComponentProps<"ul">) {
  const hover = useFluidHover<HTMLUListElement>({ nearest: true })

  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn(
        "relative isolate flex w-full min-w-0 flex-col gap-0",
        className,
      )}
      {...mergeProps<"ul">(hover.handlers, props)}
      ref={hover.ref}
    >
      <FluidHoverHighlight
        as="li"
        hover={hover}
        onFill={fluidHoverTargetHasFill(hover.ref.current)}
      />
      {children}
    </ul>
  )
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  )
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button group/menu-button flex w-full cursor-pointer items-center gap-2 overflow-hidden rounded-sm p-2 text-left text-sm font-medium text-muted-foreground ring-sidebar-ring outline-hidden transition-[width,height,padding,background-color,color,scale] duration-(--duration-fast) ease-(--ease-standard) group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-has-data-[sidebar=menu-badge]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:text-sidebar-accent-foreground focus-visible:ring-2 motion-safe:active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground data-active:hover:bg-sidebar-accent [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate",
  {
    variants: {
      variant: {
        default: "",
        outline:
          "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:shadow-[0_0_0_1px_var(--sidebar-accent)]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function SidebarMenuButton({
  render,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: useRender.ComponentProps<"button"> &
  React.ComponentProps<"button"> & {
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>) {
  const { isMobile, state } = useSidebar()
  const comp = useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(sidebarMenuButtonVariants({ variant, size }), className),
        "data-fluid-hover-item": "",
      } as React.ComponentProps<"button">,
      props,
    ),
    render: !tooltip ? render : <TooltipTrigger render={render} />,
    state: {
      slot: "sidebar-menu-button",
      sidebar: "menu-button",
      size,
      active: isActive,
    },
  })

  if (!tooltip) {
    return comp
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    }
  }

  return (
    <Tooltip>
      {comp}
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltip}
      />
    </Tooltip>
  )
}

function SidebarMenuAction({
  className,
  render,
  showOnHover = false,
  ...props
}: useRender.ComponentProps<"button"> &
  React.ComponentProps<"button"> & {
    showOnHover?: boolean
  }) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(
          "absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-sm p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 after:absolute after:-inset-2 hover:bg-hover hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
          showOnHover &&
            "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-active/menu-button:text-sidebar-accent-foreground aria-expanded:opacity-100 md:opacity-0",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "sidebar-menu-action",
      sidebar: "menu-action",
    },
  })
}

function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-sm px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 peer-data-active/menu-button:text-sidebar-accent-foreground",
        className,
      )}
      {...props}
    />
  )
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean
}) {
  // Random width between 50 to 90%.
  const [width] = React.useState(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  })

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-sm px-2", className)}
      {...props}
    >
      {showIcon && (
        <SkeletonBox
          className="shrink-0"
          height={16}
          radius="var(--radius-sm)"
          width={16}
        />
      )}
      <SkeletonBox height={16} width={width} />
    </div>
  )
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5 group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  )
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  )
}

function SidebarMenuSubButton({
  render,
  size = "md",
  isActive = false,
  className,
  ...props
}: useRender.ComponentProps<"a"> &
  React.ComponentProps<"a"> & {
    size?: "sm" | "md"
    isActive?: boolean
  }) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          "flex h-7 min-w-0 -translate-x-px cursor-pointer items-center gap-2 overflow-hidden rounded-sm px-2 font-medium text-muted-foreground ring-sidebar-ring outline-hidden transition-[background-color,color,scale] duration-(--duration-fast) ease-(--ease-standard) group-data-[collapsible=icon]:hidden hover:text-sidebar-accent-foreground focus-visible:ring-2 motion-safe:active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[size=md]:text-sm data-[size=sm]:text-xs data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground data-active:hover:bg-sidebar-accent [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
          className,
        ),
        "data-fluid-hover-item": "",
      } as React.ComponentProps<"a">,
      props,
    ),
    render,
    state: {
      slot: "sidebar-menu-sub-button",
      sidebar: "menu-sub-button",
      size,
      active: isActive,
    },
  })
}

export type { SidebarResize }

export {
  SIDEBAR_SNAP_RADIUS,
  learnedSidebarWidth,
  sidebarSampleWeights,
  sidebarWidthDensity,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
