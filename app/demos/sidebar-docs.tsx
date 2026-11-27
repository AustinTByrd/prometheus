"use client"

import * as React from "react"
import {
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  HomeIcon,
  InboxIcon,
  LockClosedIcon,
  MapIcon,
  UsersIcon,
} from "@heroicons/react/16/solid"

import {
  PlaygroundFigure,
  PlaygroundOptions,
  PlaygroundRow,
} from "@/components/site/playground"
import { Button } from "@/components/ui/button"
import {
  SIDEBAR_SNAP_RADIUS,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  sidebarSampleWeights,
  sidebarWidthDensity,
  useSidebar,
} from "@/components/ui/sidebar"

const MODES = [
  { value: "learn", label: "Learn" },
  { value: "fixed", label: "Fixed" },
] as const

type Mode = (typeof MODES)[number]["value"]

const NAV: {
  label: string
  icon: React.ComponentType
  badge?: React.ReactNode
}[] = [
  { label: "Overview", icon: HomeIcon },
  { label: "Inbox", icon: InboxIcon, badge: "24" },
  { label: "Q4 roadmap and launch planning", icon: MapIcon },
  {
    label: "Customer feedback triage",
    icon: ChatBubbleLeftRightIcon,
    badge: "8",
  },
  {
    label: "Leadership offsite notes",
    icon: UsersIcon,
    badge: <LockClosedIcon aria-label="Private" />,
  },
  { label: "Engineering onboarding guide", icon: BookOpenIcon },
]

const CHART_HEIGHT = 104
const CHART_TOP = 26
const CHART_BASE = 84
const CURVE_DURATION = 360

function useTweenedValues(target: number[]) {
  const [values, setValues] = React.useState(target)
  const valuesRef = React.useRef(target)

  React.useEffect(() => {
    const from =
      valuesRef.current.length === target.length
        ? valuesRef.current
        : target.map(() => 0)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      valuesRef.current = target
      setValues(target)
      return
    }

    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / CURVE_DURATION)
      const eased = 1 - Math.pow(1 - progress, 4)
      const next = target.map(
        (value, index) => from[index] + (value - from[index]) * eased
      )
      valuesRef.current = next
      setValues(next)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target])

  return values
}

function WidthChart() {
  const {
    resize,
    samples,
    preferredWidth,
    drag,
    width,
    open,
    minWidth,
    maxWidth,
  } = useSidebar()
  const ref = React.useRef<HTMLDivElement>(null)
  const [chartWidth, setChartWidth] = React.useState(0)

  React.useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new ResizeObserver(([entry]) =>
      setChartWidth(entry.contentRect.width)
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const x = (value: number) => Math.min(Math.max(value, 0), chartWidth)
  const current = drag ? drag.width : open ? width : null
  const points = React.useMemo(
    () =>
      resize === "learn"
        ? sidebarWidthDensity(samples, minWidth, maxWidth, 2)
        : [],
    [resize, samples, minWidth, maxWidth]
  )
  const densities = useTweenedValues(
    React.useMemo(() => points.map((point) => point.density), [points])
  )
  const curve = densities.some((density) => density > 0.002)
    ? points
        .map((point, index) => {
          const y =
            CHART_BASE - (densities[index] ?? 0) * (CHART_BASE - CHART_TOP)
          return `${index ? "L" : "M"}${x(point.width).toFixed(1)},${y.toFixed(1)}`
        })
        .join("")
    : ""
  const weights = sidebarSampleWeights(samples.length)
  const target = resize === "fixed" ? width : preferredWidth
  const bounds = resize === "fixed" ? [width / 2] : [minWidth, maxWidth]

  return (
    <div
      aria-hidden
      className="h-(--chart-height) border-b border-border text-foreground"
      ref={ref}
      style={{ "--chart-height": `${CHART_HEIGHT}px` } as React.CSSProperties}
    >
      {chartWidth ? (
        <svg
          className="overflow-visible"
          height={CHART_HEIGHT}
          width={chartWidth}
        >
          {target !== null ? (
            <g
              className="transition-transform duration-(--duration-standard) ease-(--ease-standard) motion-reduce:transition-none"
              style={{ transform: `translateX(${x(target)}px)` }}
            >
              <rect
                className={
                  drag?.snapped
                    ? "fill-foreground/14 transition-[fill] duration-(--duration-instant)"
                    : "fill-foreground/6 transition-[fill] duration-(--duration-instant)"
                }
                height={CHART_BASE - CHART_TOP + 6}
                rx={3}
                width={resize === "fixed" ? 4 : SIDEBAR_SNAP_RADIUS * 2}
                x={resize === "fixed" ? -2 : -SIDEBAR_SNAP_RADIUS}
                y={CHART_TOP - 6}
              />
              <text
                className="fill-foreground text-xs font-medium tabular-nums"
                textAnchor="middle"
                x={0}
                y={CHART_TOP - 11}
              >
                {target}px
              </text>
            </g>
          ) : null}
          {bounds.map((bound) => (
            <g key={bound}>
              <line
                className="stroke-muted-foreground/60"
                strokeDasharray="2 3"
                x1={x(bound)}
                x2={x(bound)}
                y1={CHART_TOP}
                y2={CHART_BASE}
              />
              <text
                className="fill-muted-foreground text-[10px] tabular-nums"
                textAnchor="middle"
                x={x(bound)}
                y={CHART_HEIGHT - 4}
              >
                {resize === "fixed" ? "hides" : `${bound}px`}
              </text>
            </g>
          ))}
          {curve ? (
            <>
              <path
                className="fill-foreground/5"
                d={`${curve}L${x(maxWidth)},${CHART_BASE}L${x(minWidth)},${CHART_BASE}Z`}
              />
              <path
                className="fill-none stroke-foreground"
                d={curve}
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
            </>
          ) : null}
          <line
            className="stroke-border"
            x1={0}
            x2={chartWidth}
            y1={CHART_BASE}
            y2={CHART_BASE}
          />
          {samples.map((sample, index) => (
            <line
              className="stroke-foreground"
              key={index}
              strokeOpacity={
                0.15 + (weights[index] / weights[weights.length - 1]) * 0.85
              }
              x1={x(sample)}
              x2={x(sample)}
              y1={CHART_BASE + 2}
              y2={CHART_BASE + 8}
            />
          ))}
          {current !== null ? (
            <line
              className="stroke-primary"
              strokeWidth={1.5}
              x1={x(current)}
              x2={x(current)}
              y1={CHART_TOP - 6}
              y2={CHART_HEIGHT}
            />
          ) : null}
        </svg>
      ) : null}
    </div>
  )
}

function ResizeStatus() {
  const { resize, samples, preferredWidth, drag, width, open, resetResize } =
    useSidebar()

  const live = drag ? Math.round(drag.width) : open ? width : 0
  const message =
    resize === "fixed"
      ? `Drag the edge in past ${width / 2}px to hide it. Drag it out to open at ${width}px.`
      : preferredWidth === null
        ? `Drag the edge and let go. ${3 - samples.length} more to learn a width.`
        : drag?.snapped
          ? `Snapped to ${preferredWidth}px. Slow down to place it precisely.`
          : `Learned ${preferredWidth}px from ${samples.length} widths.`

  return (
    <div className="flex flex-col items-start gap-3 p-4">
      <p className="text-2xl font-medium text-foreground tabular-nums">
        {live}px
      </p>
      <p className="max-w-56 text-sm text-muted-foreground">{message}</p>
      {resize === "learn" ? (
        <Button
          disabled={!samples.length}
          onClick={resetResize}
          size="sm"
          variant="outlined"
        >
          Reset history
        </Button>
      ) : null}
    </div>
  )
}

export function SidebarResizeDemo() {
  const [mode, setMode] = React.useState<Mode>("learn")

  return (
    <>
      <PlaygroundFigure code={`<SidebarProvider resize="${mode}">
  <Sidebar>
    {/* … */}
    <SidebarRail />
  </Sidebar>
  <SidebarInset>{/* … */}</SidebarInset>
</SidebarProvider>`}>
        <SidebarProvider
          className="min-h-0 flex-col"
          defaultWidth={220}
          key={mode}
          maxWidth={340}
          minWidth={180}
          resize={mode}
          storageKey="prometheus-docs-sidebar-resize"
        >
          <WidthChart />
          <div className="relative flex h-80 transform-gpu overflow-hidden">
            <Sidebar className="h-full">
              <SidebarHeader className="px-4 pt-4 text-sm font-medium">
                Acme
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarMenu>
                    {NAV.map((item) => (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton isActive={item.label === "Overview"}>
                          <item.icon />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                        {item.badge ? (
                          <SidebarMenuBadge className="text-muted-foreground [&_svg]:size-3.5">
                            {item.badge}
                          </SidebarMenuBadge>
                        ) : null}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroup>
              </SidebarContent>
              <SidebarRail />
            </Sidebar>
            <SidebarInset className="min-h-0 min-w-0 border-l border-border">
              <header className="flex h-12 shrink-0 items-center border-b border-border px-3">
                <SidebarTrigger />
              </header>
              <ResizeStatus />
            </SidebarInset>
          </div>
        </SidebarProvider>
        <PlaygroundRow>
          <PlaygroundOptions
            label="Resize"
            options={MODES}
            value={mode}
            onValueChange={setMode}
          />
        </PlaygroundRow>
      </PlaygroundFigure>
    </>
  )
}
