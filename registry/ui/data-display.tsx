// @prometheus 0.2.0
"use client"

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react"
import { cn } from "cn"
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend as RechartsLegend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  type BarShapeProps,
  type LegendPayload,
  type TooltipContentProps,
} from "recharts"

import {
  chartColorVars,
  chartPalette,
  chartTagWash,
  chartTokens,
  isChartColor,
  type ChartColor,
} from "@/lib/chart-palette"
import { Elevated } from "@/lib/elevated"
import { SURFACE_BG } from "@/lib/surface-classes"
import { useSurface } from "@/lib/surface-context"

export { chartPalette, type ChartColor }

function useLanded(ref: RefObject<Element | null>) {
  const [landed, setLanded] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      setLanded(true)
      return
    }
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      observer.disconnect()
      setLanded(true)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  return landed
}

const pill =
  "[--pill-py:0.125rem] [--pill-px:0.5rem] [--pill:calc(var(--pill-py)_+_0.5lh)] [--pill-r:var(--pill)] rounded-(--pill-r) py-(--pill-py) px-[calc(var(--pill-px)_+_var(--pill-r)_*_(1_-_pi_/_4)_*_var(--pill-r)_/_var(--pill))] text-xs leading-none whitespace-nowrap"

// ---------------------------------------------------------------------------
// Composable Recharts primitives (ChartConfig, ChartContainer, ChartCard,
// ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent)
// ---------------------------------------------------------------------------

export type ChartConfig = Record<
  string,
  {
    label?: ReactNode
    icon?: ComponentType<{ className?: string }>
    /** A Prometheus palette name (`"blue"`, `"sand"`, …) or any CSS color. */
    color?: ChartColor | (string & {})
    theme?: Record<"light" | "dark", string>
  }
>

type ChartContextValue = {
  config: ChartConfig
}

const ChartContext = createContext<ChartContextValue | null>(null)

export function useChart() {
  const context = useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }
  return context
}

function resolveConfigColor(color: string): string {
  return isChartColor(color) ? `var(--bc-${color})` : color
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorEntries = Object.entries(config).filter(
    ([, item]) => item.theme || item.color,
  )
  if (!colorEntries.length) return null

  const css = (["light", "dark"] as const)
    .map((mode) => {
      const prefix = mode === "dark" ? ".dark " : ""
      const decls = colorEntries
        .map(([key, item]) => {
          const value = item.theme?.[mode] ?? item.color
          if (!value) return null
          return `  --color-${key}: ${resolveConfigColor(value)};`
        })
        .filter(Boolean)
        .join("\n")
      return `${prefix}[data-chart="${id}"] {\n${decls}\n}`
    })
    .join("\n")

  return <style dangerouslySetInnerHTML={{ __html: css }} />
}

export type ChartContainerProps = ComponentProps<"div"> & {
  config?: ChartConfig
  children: ComponentProps<typeof ResponsiveContainer>["children"]
}

/**
 * Responsive Recharts wrapper that injects Prometheus `--bc-*` tokens,
 * resolves `ChartConfig` entries to `--color-<key>` variables, and applies
 * Prometheus chart typography and hairline defaults.
 */
export function ChartContainer({
  id,
  className,
  children,
  config = {},
  ...props
}: ChartContainerProps) {
  const uniqueId = useId()
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`
  const contextValue = useMemo(() => ({ config }), [config])

  return (
    <ChartContext.Provider value={contextValue}>
      <div
        className={cn(
          chartTokens,
          "relative w-full min-w-0 select-none text-xs",
          "[&_.recharts-wrapper]:!overflow-visible [&_.recharts-surface]:overflow-visible",
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-axis-tick_text]:text-xs [&_.recharts-cartesian-axis-tick_text]:tabular-nums",
          "[&_.recharts-cartesian-grid_line]:stroke-(--bc-grid)",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-(--bc-grid)",
          "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-foreground/[0.04]",
          "[&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none [&_.recharts-wrapper]:outline-none",
          className,
        )}
        data-chart={chartId}
        data-slot="chart"
        {...props}
      >
        <ChartStyle config={config} id={chartId} />
        <ResponsiveContainer height="100%" minWidth={0} width="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

export const ChartTooltip = RechartsTooltip

export type ChartTooltipContentProps = Partial<
  TooltipContentProps<number | string, string>
> &
  ComponentProps<"div"> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
    labelFormatter?: (label: ReactNode, payload: unknown[]) => ReactNode
    formatter?: (
      value: number | string,
      name: string,
      item: unknown,
      index: number,
    ) => ReactNode
  }

export function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  formatter,
  nameKey,
  labelKey,
}: ChartTooltipContentProps) {
  const context = useContext(ChartContext)
  const config = context?.config ?? {}

  if (!active || !payload?.length) return null

  const first = payload[0]
  const resolvedLabelKey = labelKey ?? String(first?.dataKey ?? first?.name ?? "")
  const labelConfig = config[resolvedLabelKey]
  const heading = !hideLabel
    ? labelFormatter
      ? labelFormatter(label, [...payload])
      : (labelConfig?.label ?? label)
    : null

  return (
    <div
      className={cn(
        "grid min-w-32 items-start gap-1.5 rounded-xl border border-border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-sm",
        className,
      )}
      data-slot="chart-tooltip-content"
    >
      {heading ? (
        <div className="font-medium text-foreground">{heading}</div>
      ) : null}
      <div className="grid gap-1">
        {payload.map((item, index) => {
          const key = String(nameKey ? item.payload?.[nameKey] : (item.name ?? item.dataKey ?? "value"))
          const itemConfig = config[key] ?? config[String(item.dataKey ?? "")]
          const itemColor =
            (item.payload as { fill?: string } | undefined)?.fill ??
            item.color ??
            (itemConfig?.color ? resolveConfigColor(itemConfig.color) : "var(--foreground)")
          const displayLabel = itemConfig?.label ?? item.name ?? key
          const rawValue = item.value

          return (
            <div
              className="flex items-center justify-between gap-3"
              key={`${key}-${index}`}
            >
              <div className="flex items-center gap-1.5 text-muted-foreground">
                {!hideIndicator ? (
                  itemConfig?.icon ? (
                    <itemConfig.icon className="size-3 text-muted-foreground" />
                  ) : (
                    <span
                      className={cn(
                        "shrink-0 rounded-[2px]",
                        indicator === "dot" && "size-2 rounded-full",
                        indicator === "line" && "h-2.5 w-0.5",
                        indicator === "dashed" &&
                          "h-2.5 w-0 border-l border-dashed bg-transparent",
                      )}
                      style={
                        indicator === "dashed"
                          ? { borderColor: itemColor }
                          : { backgroundColor: itemColor }
                      }
                    />
                  )
                ) : null}
                <span>{displayLabel}</span>
              </div>
              {rawValue != null ? (
                <span className="font-medium text-foreground tabular-nums">
                  {formatter
                    ? formatter(rawValue as number | string, String(displayLabel), item, index)
                    : typeof rawValue === "number"
                      ? rawValue.toLocaleString()
                      : String(rawValue)}
                </span>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const ChartLegend = RechartsLegend

export type ChartLegendContentProps = ComponentProps<"ul"> & {
  payload?: readonly LegendPayload[]
  nameKey?: string
}

export function ChartLegendContent({
  className,
  payload,
  nameKey,
  ...props
}: ChartLegendContentProps) {
  const context = useContext(ChartContext)
  const config = context?.config ?? {}
  const level = useSurface()

  if (!payload?.length) return null

  return (
    <ul
      aria-label="Key"
      className={cn(
        chartTokens,
        "m-0 flex list-none flex-wrap gap-2 p-0 pt-3",
        className,
      )}
      data-slot="chart-legend-content"
      role="list"
      {...props}
    >
      {payload.map((item, index) => {
        const key = String(nameKey ?? item.dataKey ?? item.value ?? index)
        const itemConfig = config[key]
        const color = itemConfig?.color ?? item.color
        return (
          <li
            className={cn(
              pill,
              SURFACE_BG[level],
              chartTagWash,
              "text-(--bar-text)",
            )}
            key={`${key}-${index}`}
            style={chartColorVars(color, index)}
          >
            {itemConfig?.label ?? item.value}
          </li>
        )
      })}
    </ul>
  )
}

export type ChartCardProps = Omit<ComponentProps<"div">, "title"> & {
  title: ReactNode
  /** Muted tail of the title, like "· Odyssey". */
  detail?: ReactNode
  /** Secondary line under the title — a short summary or actionable insight. */
  totals?: ReactNode
}

/**
 * Elevated Prometheus card shell for any custom Recharts composition.
 * Provides scroll-in `data-landed` tracking, `@container/chart` queries,
 * `chartTokens`, title/detail header, and optional insight line.
 */
export function ChartCard({
  title,
  detail,
  totals,
  className,
  children,
  ...props
}: ChartCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const landed = useLanded(ref)

  return (
    <div
      className={cn(
        chartTokens,
        "group/chart @container/chart flex min-w-0 flex-col text-foreground",
        className,
      )}
      data-landed={landed}
      data-slot="chart-card"
      ref={ref}
      {...props}
    >
      <Elevated
        className="flex min-w-0 flex-1 flex-col rounded-2xl p-[clamp(14px,1.6vw,22px)]"
        offset={1}
      >
        <h3 className="text-base font-medium text-balance">
          {title}
          {detail ? (
            <span className="font-normal text-muted-foreground"> {detail}</span>
          ) : null}
        </h3>
        {totals ? (
          <p className="mt-1.5 text-sm text-pretty text-muted-foreground">
            {totals}
          </p>
        ) : null}
        {children}
      </Elevated>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ChartKey
// ---------------------------------------------------------------------------

export type ChartSeries = {
  key: string
  label: ReactNode
  /** Shorter name for totals and titles. */
  short?: string
  /** A palette color or any CSS color. Defaults follow `chartPalette`. */
  color?: ChartColor | (string & {})
}

export function ChartKey({
  series,
  className,
  ...props
}: ComponentProps<"ul"> & { series: ChartSeries[] }) {
  const level = useSurface()

  return (
    <ul
      aria-label="Key"
      className={cn(
        chartTokens,
        "m-0 flex list-none flex-wrap gap-2 p-0",
        className,
      )}
      data-slot="chart-key"
      role="list"
      {...props}
    >
      {series.map((item, index) => (
        <li
          className={cn(
            pill,
            SURFACE_BG[level],
            chartTagWash,
            "text-(--bar-text)",
          )}
          key={item.key}
          style={chartColorVars(item.color, index)}
        >
          {item.label}
        </li>
      ))}
    </ul>
  )
}

// ---------------------------------------------------------------------------
// Shared data & scale helpers for BarChart and LineChart
// ---------------------------------------------------------------------------

export type BarValue =
  | number
  | null
  | {
      value: number
      /** Hatched, for a value that only partly counts. */
      partial?: boolean
      /** Added to the bar title and the screen reader table. */
      note?: string
    }

export type BarDatum = {
  label: string
  value: BarValue
  /** A palette color or any CSS color. Defaults follow `chartPalette` by index. */
  color?: ChartColor | (string & {})
}

function readBar(value: BarValue | undefined) {
  if (value == null) return null
  return typeof value === "number" ? { value } : value
}

const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
})

const formatCompact = (value: number) => compact.format(value)

function axisScale(peak: number) {
  if (peak <= 0) return { step: 1, top: 1 }
  const power = 10 ** Math.floor(Math.log10(peak))
  const step =
    [1, 2, 5, 10]
      .map((multiple) => multiple * power)
      .find((size) => Math.floor(peak / size) + 1 <= 6) ?? 10 * power
  return { step, top: (Math.floor(peak / step) + 1) * step }
}

function parseTooltipIndex(
  index: number | string | null | undefined,
): number | null {
  if (typeof index === "number") return Number.isFinite(index) ? index : null
  if (typeof index === "string" && index.trim() !== "") {
    const parsed = Number(index)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

type CategoryTickProps = {
  x?: number
  y?: number
  payload?: { value: string }
}

function CategoryXAxisTick({ x = 0, y = 0, payload }: CategoryTickProps) {
  if (!payload) return null
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        className="fill-muted-foreground text-xs leading-none @max-[36rem]/chart:text-[10.5px]"
        dy={12}
        textAnchor="middle"
      >
        {payload.value}
      </text>
    </g>
  )
}

// ---------------------------------------------------------------------------
// BarChart (Recharts-powered, Prometheus styling)
// ---------------------------------------------------------------------------

export type BarChartProps = Omit<ComponentProps<"div">, "title"> & {
  title: ReactNode
  /** Muted tail of the title, like "· Odyssey". */
  detail?: ReactNode
  data: BarDatum[]
  format?: (value: number) => string
  formatTick?: (value: number) => string
  /** Top of the axis. Defaults to one step over the tallest bar. */
  max?: number
  /**
   * Secondary line under the title — a short summary or actionable insight.
   * Omit to hide it.
   */
  totals?: ReactNode
  /** Caption for the screen reader table. */
  caption: string
  /** Header for the category column in the screen reader table. */
  categoryLabel?: string
  /** Header for the value column in the screen reader table. */
  valueLabel?: string
}

type NormalizedBarRow = {
  label: string
  value: number | null
  partial?: boolean
  note?: string
  color?: ChartColor | (string & {})
  index: number
}

export function BarChart({
  title,
  detail,
  data,
  format = formatCompact,
  formatTick = formatCompact,
  max,
  totals,
  caption,
  categoryLabel = "Category",
  valueLabel = "Value",
  className,
  ...props
}: BarChartProps) {
  const uid = useId().replace(/:/g, "")
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const barTopsRef = useRef<Record<number, { x: number; y: number }>>({})

  const rows: NormalizedBarRow[] = useMemo(
    () =>
      data.map((item, index) => {
        const bar = readBar(item.value)
        return {
          label: item.label,
          value: bar ? bar.value : null,
          partial: bar?.partial,
          note: bar?.note,
          color: item.color,
          index,
        }
      }),
    [data],
  )

  const peak = Math.max(0, ...rows.map((row) => row.value ?? 0))
  const { step, top } = axisScale(peak)
  const axisTop = max ?? top
  const ticks = Array.from(
    { length: Math.round(axisTop / step) + 1 },
    (_, index) => index * step,
  ).filter((tick) => tick <= axisTop)
  const stagger = Math.min(220, 1100 / Math.max(data.length, 1))

  return (
    <ChartCard
      className={className}
      data-slot="bar-chart"
      detail={detail}
      title={title}
      totals={totals}
      {...props}
    >
      <div
        aria-hidden="true"
        className="mt-8 [--axis-w:40px] [--plot-h:clamp(170px,18vw,230px)] @max-[26rem]/chart:[--axis-w:34px] @max-[26rem]/chart:[--plot-h:160px]"
      >
        <ChartContainer className="h-[calc(var(--plot-h)+26px)]">
          <RechartsBarChart
            barCategoryGap="16.67%"
            data={rows}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            onMouseLeave={() => setActiveIndex(null)}
            onMouseMove={(state) => {
              setActiveIndex(parseTooltipIndex(state.activeTooltipIndex))
            }}
          >
            <defs>
              {rows.map((row) =>
                row.partial ? (
                  <pattern
                    height={6}
                    id={`hatch-${uid}-${row.index}`}
                    key={row.index}
                    patternTransform="rotate(-45)"
                    patternUnits="userSpaceOnUse"
                    style={chartColorVars(row.color, row.index)}
                    width={6}
                  >
                    <line
                      stroke="var(--bar-edge)"
                      strokeWidth={1}
                      x1={0}
                      x2={0}
                      y1={0}
                      y2={6}
                    />
                  </pattern>
                ) : null,
              )}
            </defs>
            <CartesianGrid
              horizontal
              stroke="var(--bc-grid)"
              vertical
              verticalCoordinatesGenerator={({ offset }) => {
                const count = Math.max(data.length, 1)
                const stepWidth = offset.width / count
                return Array.from(
                  { length: count + 1 },
                  (_, index) => offset.left + index * stepWidth,
                )
              }}
            />
            <YAxis
              axisLine={false}
              domain={[0, axisTop]}
              tickFormatter={formatTick}
              tickLine={false}
              tickMargin={8}
              ticks={ticks}
              width={40}
            />
            <XAxis
              axisLine={false}
              dataKey="label"
              height={26}
              interval={0}
              tick={<CategoryXAxisTick />}
              tickLine={false}
            />
            <RechartsTooltip
              allowEscapeViewBox={{ x: true, y: true }}
              content={(tooltipProps) => {
                if (!tooltipProps.active || !tooltipProps.payload?.length) {
                  return null
                }
                const entry = tooltipProps.payload[0]
                const row = entry?.payload as NormalizedBarRow | undefined
                if (!row || row.value == null) return null
                const coords = barTopsRef.current[row.index]
                const x = coords?.x ?? tooltipProps.coordinate?.x ?? 0
                const y = coords?.y ?? tooltipProps.coordinate?.y ?? 0
                return (
                  <span
                    className={cn(
                      pill,
                      "pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full bg-(--bar-tag) text-(--bar-text) opacity-100 blur-none scale-100 [transition:opacity_400ms_var(--bc-ease-out),filter_400ms_var(--bc-ease-out),scale_400ms_var(--bc-ease-out)] starting:scale-95 starting:opacity-0 starting:blur-[2px]",
                    )}
                    key={row.index}
                    style={{
                      ...chartColorVars(row.color, row.index),
                      left: x,
                      top: y - 6,
                    }}
                  >
                    {format(row.value)}
                  </span>
                )
              }}
              cursor={false}
              isAnimationActive={false}
              position={{ x: 0, y: 0 }}
              wrapperStyle={{
                pointerEvents: "none",
                left: 0,
                top: 0,
                transform: "none",
                visibility: "visible",
              }}
            />
            <Bar
              dataKey="value"
              isAnimationActive={false}
              maxBarSize={48}
              shape={(shapeProps: BarShapeProps) => {
                const row = shapeProps.payload as NormalizedBarRow | undefined
                const index = row?.index ?? shapeProps.index ?? 0
                if (!row || row.value == null) return null

                const rawX = Number(shapeProps.x ?? 0)
                const rawY = Number(shapeProps.y ?? 0)
                const rawW = Number(shapeProps.width ?? 0)
                const rawH = Number(shapeProps.height ?? 0)

                const barW = Math.max(rawW, 10)
                const barX = rawX - (barW - rawW) / 2
                const barH = Math.max(rawH, 0)
                const barY = rawY

                barTopsRef.current[index] = { x: barX + barW / 2, y: barY }

                const isActive = shapeProps.isActive || activeIndex === index
                const colorVars = chartColorVars(row.color, index)
                const strokePath =
                  barH > 0
                    ? `M ${barX + 0.5} ${barY + barH} L ${barX + 0.5} ${barY + 0.5} L ${barX + barW - 0.5} ${barY + 0.5} L ${barX + barW - 0.5} ${barY + barH}`
                    : ""

                return (
                  <g
                    className="motion-safe:[transition:opacity_600ms_var(--bc-ease-out)] motion-safe:group-data-[landed=false]/chart:opacity-0"
                    style={
                      {
                        ...colorVars,
                        transitionDelay: `${index * stagger}ms`,
                      } as CSSProperties
                    }
                  >
                    <title>
                      {`${row.label}: ${format(row.value)}${row.note ? `, ${row.note}` : ""}`}
                    </title>
                    <rect
                      className="[transition:fill_200ms_var(--bc-ease)]"
                      fill={isActive ? "var(--bar-hover)" : "var(--bar)"}
                      height={barH}
                      width={barW}
                      x={barX}
                      y={barY}
                    />
                    {row.partial && barH > 0 ? (
                      <rect
                        fill={`url(#hatch-${uid}-${index})`}
                        height={barH}
                        pointerEvents="none"
                        width={barW}
                        x={barX}
                        y={barY}
                      />
                    ) : null}
                    {strokePath ? (
                      <path
                        className="[transition:stroke_200ms_var(--bc-ease)]"
                        d={strokePath}
                        fill="none"
                        stroke={
                          isActive
                            ? "var(--bar-edge-hover)"
                            : "var(--bar-edge)"
                        }
                        strokeWidth={1}
                      />
                    ) : null}
                  </g>
                )
              }}
            />
          </RechartsBarChart>
        </ChartContainer>
      </div>
      <table className="sr-only">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">{categoryLabel}</th>
            <th scope="col">{valueLabel}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const bar = readBar(item.value)
            return (
              <tr key={item.label}>
                <th scope="row">{item.label}</th>
                <td>
                  {bar
                    ? `${format(bar.value)}${bar.note ? `, ${bar.note}` : ""}`
                    : "no value"}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </ChartCard>
  )
}

// ---------------------------------------------------------------------------
// LineChart (Recharts-powered, Prometheus styling)
// ---------------------------------------------------------------------------

export type LineDatum = {
  label: string
  value: BarValue
}

export type LineChartProps = Omit<ComponentProps<"div">, "title"> & {
  title: ReactNode
  /** Muted tail of the title, like "· by book". */
  detail?: ReactNode
  data: LineDatum[]
  format?: (value: number) => string
  formatTick?: (value: number) => string
  /** Top of the axis. Defaults to one step over the peak. */
  max?: number
  /**
   * Secondary line under the title — a short summary or actionable insight.
   * Omit to hide it.
   */
  totals?: ReactNode
  /** Caption for the screen reader table. */
  caption: string
  /** Header for the category column in the screen reader table. */
  categoryLabel?: string
  /** Header for the value column in the screen reader table. */
  valueLabel?: string
}

type NormalizedLineRow = {
  label: string
  value: number | null
  note?: string
  index: number
}

const lineStrokeColor =
  "color-mix(in oklab, var(--foreground) 80%, var(--background))"

export function LineChart({
  title,
  detail,
  data,
  format = formatCompact,
  formatTick = formatCompact,
  max,
  totals,
  caption,
  categoryLabel = "Category",
  valueLabel = "Value",
  className,
  ...props
}: LineChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const dotCoordsRef = useRef<Record<number, { x: number; y: number }>>({})

  const rows: NormalizedLineRow[] = useMemo(
    () =>
      data.map((item, index) => {
        const point = readBar(item.value)
        return {
          label: item.label,
          value: point ? point.value : null,
          note: point?.note,
          index,
        }
      }),
    [data],
  )

  const peak = Math.max(0, ...rows.map((row) => row.value ?? 0))
  const { step, top } = axisScale(peak)
  const axisTop = max ?? top
  const ticks = Array.from(
    { length: Math.round(axisTop / step) + 1 },
    (_, index) => index * step,
  ).filter((tick) => tick <= axisTop)
  const stagger = Math.min(220, 1100 / Math.max(data.length, 1))

  return (
    <ChartCard
      className={className}
      data-slot="line-chart"
      detail={detail}
      title={title}
      totals={totals}
      {...props}
    >
      <div
        aria-hidden="true"
        className="mt-8 [--axis-w:40px] [--plot-h:clamp(170px,18vw,230px)] @max-[26rem]/chart:[--axis-w:34px] @max-[26rem]/chart:[--plot-h:160px]"
      >
        <ChartContainer className="h-[calc(var(--plot-h)+26px)] [&_.recharts-area-area]:motion-safe:[transition:opacity_600ms_var(--bc-ease-out)] [&_.recharts-area-area]:motion-safe:group-data-[landed=false]/chart:opacity-0 [&_.recharts-area-curve]:motion-safe:[transition:opacity_600ms_var(--bc-ease-out)] [&_.recharts-area-curve]:motion-safe:group-data-[landed=false]/chart:opacity-0">
          <RechartsAreaChart
            data={rows}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            onMouseLeave={() => setActiveIndex(null)}
            onMouseMove={(state) => {
              setActiveIndex(parseTooltipIndex(state.activeTooltipIndex))
            }}
          >
            <CartesianGrid
              horizontal
              stroke="var(--bc-grid)"
              vertical
              verticalCoordinatesGenerator={({ offset }) => [
                offset.left,
                offset.left + offset.width,
              ]}
            />
            <YAxis
              axisLine={false}
              domain={[0, axisTop]}
              tickFormatter={formatTick}
              tickLine={false}
              tickMargin={8}
              ticks={ticks}
              width={40}
            />
            <XAxis
              axisLine={false}
              dataKey="label"
              height={26}
              interval={0}
              padding={{ left: 0, right: 0 }}
              tick={<CategoryXAxisTick />}
              tickLine={false}
            />
            <RechartsTooltip
              allowEscapeViewBox={{ x: true, y: true }}
              content={(tooltipProps) => {
                if (!tooltipProps.active || !tooltipProps.payload?.length) {
                  return null
                }
                const entry = tooltipProps.payload[0]
                const row = entry?.payload as NormalizedLineRow | undefined
                if (!row || row.value == null) return null
                const coords = dotCoordsRef.current[row.index]
                const x = coords?.x ?? tooltipProps.coordinate?.x ?? 0
                const y = coords?.y ?? tooltipProps.coordinate?.y ?? 0
                return (
                  <span
                    className={cn(
                      pill,
                      "pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full bg-foreground text-background opacity-100 blur-none scale-100 [transition:opacity_400ms_var(--bc-ease-out),filter_400ms_var(--bc-ease-out),scale_400ms_var(--bc-ease-out)] starting:scale-95 starting:opacity-0 starting:blur-[2px]",
                    )}
                    key={row.index}
                    style={{
                      left: x,
                      top: y - 10,
                    }}
                  >
                    {format(row.value)}
                  </span>
                )
              }}
              cursor={false}
              isAnimationActive={false}
              position={{ x: 0, y: 0 }}
              wrapperStyle={{
                pointerEvents: "none",
                left: 0,
                top: 0,
                transform: "none",
                visibility: "visible",
              }}
            />
            <Area
              activeDot={false}
              connectNulls={false}
              dataKey="value"
              dot={(dotProps) => {
                const { cx, cy, index, payload } = dotProps
                const row = payload as NormalizedLineRow | undefined
                if (
                  cx == null ||
                  cy == null ||
                  !row ||
                  row.value == null
                ) {
                  return <g key={`empty-${index}`} />
                }
                dotCoordsRef.current[row.index] = { x: cx, y: cy }
                const isActive = activeIndex === row.index
                return (
                  <g
                    className="motion-safe:[transition:opacity_600ms_var(--bc-ease-out)] motion-safe:group-data-[landed=false]/chart:opacity-0"
                    key={row.label}
                    style={{ transitionDelay: `${row.index * stagger}ms` }}
                  >
                    <title>
                      {`${row.label}: ${format(row.value)}${row.note ? `, ${row.note}` : ""}`}
                    </title>
                    <circle
                      className="[transition:fill_200ms_var(--bc-ease),transform_200ms_var(--bc-ease)]"
                      cx={cx}
                      cy={cy}
                      fill={isActive ? "#ffffff" : lineStrokeColor}
                      r={4}
                      style={{
                        transformBox: "fill-box",
                        transformOrigin: "center",
                        transform: isActive ? "scale(1.25)" : "scale(1)",
                      }}
                    />
                  </g>
                )
              }}
              fill="var(--foreground)"
              fillOpacity={0.1}
              isAnimationActive={false}
              stroke={lineStrokeColor}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              type="linear"
            />
          </RechartsAreaChart>
        </ChartContainer>
      </div>
      <table className="sr-only">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">{categoryLabel}</th>
            <th scope="col">{valueLabel}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const point = readBar(item.value)
            return (
              <tr key={item.label}>
                <th scope="row">{item.label}</th>
                <td>
                  {point
                    ? `${format(point.value)}${point.note ? `, ${point.note}` : ""}`
                    : "no value"}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </ChartCard>
  )
}

export function ChartGrid({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div className="@container/charts" data-slot="chart-grid">
      <div
        className={cn(
          "grid gap-[clamp(10px,1.3vw,18px)] @min-[52rem]/charts:grid-cols-2",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}
