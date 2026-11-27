"use client"

import { useId } from "react"

import {
  formatRatio,
  formatTracking,
  getLineHeightRatio,
  TYPE_SCALE,
  type TypeScaleGroup,
  type TypeScaleMetric,
  type TypeScaleStep,
} from "@/components/site/typography/type-scale-data"
import { cn } from "@/lib/utils"

type ChartPoint = {
  step: TypeScaleStep
  value: number
  formatted: string
  x: number
  y: number
}

type LabelPlacement = {
  key: string
  text: string
  x: number
  y: number
  anchor: "start" | "middle" | "end"
  sizes: number[]
}

const VIEW_WIDTH = 560
const VIEW_HEIGHT = 382
const PLOT_LEFT = 42
const PLOT_RIGHT = 538
const PLOT_TOP = 58
const PLOT_BOTTOM = 312
const PLOT_WIDTH = PLOT_RIGHT - PLOT_LEFT
const PLOT_HEIGHT = PLOT_BOTTOM - PLOT_TOP

function buildMonotoneSpline(points: ChartPoint[]) {
  const n = points.length
  if (n === 0) return { solidPath: "", extrapolationPath: "" }
  if (n === 1) {
    return {
      solidPath: `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`,
      extrapolationPath: "",
    }
  }

  const h: number[] = []
  const d: number[] = []
  for (let i = 0; i < n - 1; i++) {
    const dx = points[i + 1].x - points[i].x
    h.push(dx)
    d.push(dx === 0 ? 0 : (points[i + 1].y - points[i].y) / dx)
  }

  // Steffen-weighted Fritsch-Carlson tangents for unevenly spaced x values.
  const m = new Array<number>(n).fill(0)
  m[0] = d[0]
  m[n - 1] = d[n - 2]

  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] === 0 || d[i] === 0 || d[i - 1] * d[i] < 0) {
      m[i] = 0
    } else {
      const w1 = 2 * h[i] + h[i - 1]
      const w2 = h[i] + 2 * h[i - 1]
      m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i])
    }
  }

  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0
      m[i + 1] = 0
      continue
    }
    const alpha = m[i] / d[i]
    const beta = m[i + 1] / d[i]
    const norm = Math.hypot(alpha, beta)
    if (norm > 3) {
      const scale = 3 / norm
      m[i] = scale * alpha * d[i]
      m[i + 1] = scale * beta * d[i]
    }
  }

  let solidPath = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`
  for (let i = 0; i < n - 1; i++) {
    const dx = h[i]
    const c1x = points[i].x + dx / 3
    const c1y = points[i].y + (m[i] * dx) / 3
    const c2x = points[i + 1].x - dx / 3
    const c2y = points[i + 1].y - (m[i + 1] * dx) / 3
    solidPath += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${points[i + 1].x.toFixed(2)} ${points[i + 1].y.toFixed(2)}`
  }

  const last = points[n - 1]
  const lastSlope = m[n - 1]
  const extrapDx = Math.max(24, PLOT_RIGHT - last.x - 4)
  const extrapEndX = last.x + extrapDx
  const extrapEndY = Math.min(
    PLOT_BOTTOM - 8,
    Math.max(PLOT_TOP + 8, last.y + lastSlope * extrapDx * 0.72)
  )
  const c1x = last.x + extrapDx / 3
  const c1y = last.y + (lastSlope * extrapDx) / 3
  const c2x = extrapEndX - extrapDx / 3
  const c2y = extrapEndY

  const extrapolationPath = `M ${last.x.toFixed(2)} ${last.y.toFixed(2)} C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${extrapEndX.toFixed(2)} ${extrapEndY.toFixed(2)}`

  return { solidPath, extrapolationPath }
}

function computeLabelPlacements(points: ChartPoint[]): LabelPlacement[] {
  const placements: LabelPlacement[] = []
  let i = 0

  while (i < points.length) {
    // Collapse consecutive tightly spaced identical values (e.g. 14/16/18 at 0em)
    // into a single centered label above the plateau to avoid overlapping text.
    let j = i
    while (
      j + 1 < points.length &&
      points[j + 1].formatted === points[i].formatted &&
      points[j + 1].x - points[j].x < 28
    ) {
      j++
    }

    if (j > i) {
      const midX = (points[i].x + points[j].x) / 2
      const minY = Math.min(...points.slice(i, j + 1).map((p) => p.y))
      placements.push({
        key: `${points[i].step.size}-${points[j].step.size}`,
        text: points[i].formatted,
        x: midX,
        y: minY - 11,
        anchor: "middle",
        sizes: points.slice(i, j + 1).map((p) => p.step.size),
      })
      i = j + 1
      continue
    }

    const pt = points[i]
    const prev = i > 0 ? points[i - 1] : null
    const next = i < points.length - 1 ? points[i + 1] : null

    const dxNext = next ? next.x - pt.x : Infinity
    const dxPrev = prev ? pt.x - prev.x : Infinity

    let dx = 0
    let dy = -11
    let anchor: "start" | "middle" | "end" = "middle"

    // Rising steeply toward a nearby point on the right: place label on the outer left side.
    if (next && dxNext < 28 && next.y < pt.y - 8) {
      anchor = "end"
      dx = -8
      dy = prev ? -4 : 4
    }
    // Descending steeply from a point on the left: place label on the outer right side.
    else if (prev && dxPrev < 52 && prev.y < pt.y - 26) {
      anchor = "start"
      dx = 8
      dy = -8
    }

    placements.push({
      key: `${pt.step.size}`,
      text: pt.formatted,
      x: pt.x + dx,
      y: pt.y + dy,
      anchor,
      sizes: [pt.step.size],
    })

    i++
  }

  return placements
}

type GroupSpan = {
  group: TypeScaleGroup
  x1: number
  x2: number
  cx: number
  single: boolean
}

function computeGroupSpans(points: ChartPoint[]): GroupSpan[] {
  const spans: GroupSpan[] = []
  for (const pt of points) {
    const last = spans[spans.length - 1]
    if (last && last.group === pt.step.group) {
      last.x2 = pt.x
      last.cx = (last.x1 + last.x2) / 2
      last.single = false
    } else {
      spans.push({
        group: pt.step.group,
        x1: pt.x,
        x2: pt.x,
        cx: pt.x,
        single: true,
      })
    }
  }
  return spans
}

export type TypeScaleChartProps = {
  metric: TypeScaleMetric
  scale?: readonly TypeScaleStep[]
  activeSize?: number | null
  onActiveSizeChange?: (size: number | null) => void
  className?: string
}

export function TypeScaleChart({
  metric,
  scale = TYPE_SCALE,
  activeSize = null,
  onActiveSizeChange,
  className,
}: TypeScaleChartProps) {
  const titleId = useId()
  const descId = useId()

  const sorted = [...scale].sort((a, b) => a.size - b.size)
  if (sorted.length === 0) return null

  const minSize = sorted[0].size
  const maxSize = sorted[sorted.length - 1].size
  const xDomainMin = Math.max(0, minSize - 6)
  const xDomainMax = maxSize + 7
  const xSpan = Math.max(1, xDomainMax - xDomainMin)

  const xPos = (size: number) =>
    PLOT_LEFT + ((size - xDomainMin) / xSpan) * PLOT_WIDTH

  const values = sorted.map((step) =>
    metric === "lineHeight" ? getLineHeightRatio(step) : step.tracking
  )
  const dataMin = Math.min(...values)
  const dataMax = Math.max(...values)

  const yDomain =
    metric === "lineHeight"
      ? {
          min: Math.min(0.84, dataMin - 0.14),
          max: Math.max(1.64, dataMax + 0.08),
          ticks: [
            { value: 1.5, label: "1.5" },
            { value: 1.0, label: "1.0" },
          ],
          caption: "Line height ÷ font size",
          title: "Line height ratio curve across font sizes",
        }
      : {
          min: Math.min(-0.052, dataMin - 0.015),
          max: Math.max(0.028, dataMax + 0.008),
          ticks: [
            { value: 0, label: "0" },
            { value: -0.04, label: "-0.04" },
          ],
          caption: "Letter spacing, em",
          title: "Letter spacing curve across font sizes",
        }

  const ySpan = Math.max(0.001, yDomain.max - yDomain.min)
  const yPos = (val: number) =>
    PLOT_TOP + ((yDomain.max - val) / ySpan) * PLOT_HEIGHT

  const points: ChartPoint[] = sorted.map((step, index) => {
    const value = values[index]
    return {
      step,
      value,
      formatted:
        metric === "lineHeight"
          ? formatRatio(value)
          : formatTracking(value, false),
      x: xPos(step.size),
      y: yPos(value),
    }
  })

  const { solidPath, extrapolationPath } = buildMonotoneSpline(points)
  const labels = computeLabelPlacements(points)
  const groups = computeGroupSpans(points)
  const activeGroup =
    points.find((pt) => pt.step.size === activeSize)?.step.group ?? null

  const summary = points
    .map((pt) =>
      metric === "lineHeight"
        ? `${pt.step.size}px: ${pt.step.lineHeight}px (${pt.formatted})`
        : `${pt.step.size}px: ${formatTracking(pt.value, true)}`
    )
    .join("; ")

  const bracketY = PLOT_BOTTOM + 35

  return (
    <div className={cn("w-full", className)}>
      <svg
        aria-describedby={descId}
        aria-labelledby={titleId}
        className="pointer-events-none h-auto w-full select-none overflow-visible text-foreground"
        role="img"
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      >
        <title id={titleId}>{yDomain.title}</title>
        <desc id={descId}>
          {yDomain.caption} from {minSize}px to {maxSize}px. {summary}.
        </desc>

        {/* Top-left axis caption */}
        <text
          className="fill-muted-foreground text-[11.5px]"
          x={PLOT_LEFT}
          y={20}
        >
          {yDomain.caption}
        </text>

        {/* Faint dashed horizontal reference gridlines */}
        {yDomain.ticks.map((tick) => {
          const y = yPos(tick.value)
          return (
            <g key={tick.label}>
              <line
                className="stroke-foreground/15"
                strokeDasharray="3 4"
                strokeWidth={1}
                x1={PLOT_LEFT}
                x2={PLOT_RIGHT}
                y1={y}
                y2={y}
              />
              <text
                className="fill-muted-foreground text-[10.5px] tabular-nums"
                dominantBaseline="middle"
                textAnchor="end"
                x={PLOT_LEFT - 8}
                y={y}
              >
                {tick.label}
              </text>
            </g>
          )
        })}

        {/* Thin vertical drop lines from each point to the x-axis */}
        {points.map((pt) => {
          const isActive = activeSize === pt.step.size
          return (
            <line
              className={cn(
                "transition-colors",
                isActive ? "stroke-foreground/45" : "stroke-foreground/12"
              )}
              key={`drop-${pt.step.size}`}
              strokeWidth={isActive ? 1.25 : 1}
              x1={pt.x}
              x2={pt.x}
              y1={pt.y + 3.5}
              y2={PLOT_BOTTOM}
            />
          )
        })}

        {/* Full-height hover columns: each spans halfway to its neighbours */}
        {onActiveSizeChange
          ? points.map((pt, index) => {
              const prev = points[index - 1]
              const next = points[index + 1]
              const left = prev ? (prev.x + pt.x) / 2 : PLOT_LEFT - 12
              const right = next ? (pt.x + next.x) / 2 : PLOT_RIGHT + 12
              return (
                <rect
                  fill="transparent"
                  height={VIEW_HEIGHT - PLOT_TOP + 12}
                  className="pointer-events-auto cursor-pointer"
                  key={`hit-${pt.step.size}`}
                  onMouseEnter={() => onActiveSizeChange(pt.step.size)}
                  onMouseLeave={() => onActiveSizeChange(null)}
                  width={right - left}
                  x={left}
                  y={PLOT_TOP - 12}
                />
              )
            })
          : null}

        {/* X-axis baseline */}
        <line
          className="stroke-foreground/25"
          strokeWidth={1}
          x1={PLOT_LEFT}
          x2={PLOT_RIGHT}
          y1={PLOT_BOTTOM}
          y2={PLOT_BOTTOM}
        />

        {/* Smooth monotone spline curve */}
        <path
          className="stroke-foreground/85"
          d={solidPath}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
        />

        {/* Dashed extrapolation past the largest font size */}
        {extrapolationPath ? (
          <path
            className="stroke-foreground/45"
            d={extrapolationPath}
            fill="none"
            strokeDasharray="4 4"
            strokeLinecap="round"
            strokeWidth={1.5}
          />
        ) : null}

        {/* Point value labels */}
        {labels.map((label) => {
          const isActive =
            activeSize !== null && label.sizes.includes(activeSize)
          return (
            <text
              className={cn(
                "text-[10.5px] tabular-nums transition-colors",
                isActive
                  ? "fill-foreground font-semibold"
                  : "fill-foreground/75 font-medium"
              )}
              key={`val-${label.key}`}
              textAnchor={label.anchor}
              x={label.x}
              y={label.y}
            >
              {label.text}
            </text>
          )
        })}

        {/* Hollow data points */}
        {points.map((pt) => {
          const isActive = activeSize === pt.step.size
          return (
            <g
              className="pointer-events-auto cursor-pointer outline-none"
              key={`pt-${pt.step.size}`}
              onBlur={() => onActiveSizeChange?.(null)}
              onFocus={() => onActiveSizeChange?.(pt.step.size)}
              onMouseEnter={() => onActiveSizeChange?.(pt.step.size)}
              onMouseLeave={() => onActiveSizeChange?.(null)}
              tabIndex={onActiveSizeChange ? 0 : undefined}
            >
              {onActiveSizeChange ? (
                <circle cx={pt.x} cy={pt.y} fill="transparent" r={11} />
              ) : null}
              <circle
                className={cn(
                  "fill-card transition-[r,stroke-width]",
                  isActive ? "stroke-foreground" : "stroke-foreground/85"
                )}
                cx={pt.x}
                cy={pt.y}
                r={isActive ? 4.25 : 3.25}
                strokeWidth={isActive ? 2 : 1.65}
              />
            </g>
          )
        })}

        {/* X-axis tick numbers */}
        {points.map((pt) => {
          const isActive = activeSize === pt.step.size
          return (
            <text
              className={cn(
                "text-[10.5px] tabular-nums transition-colors",
                isActive
                  ? "fill-foreground font-semibold"
                  : "fill-muted-foreground"
              )}
              key={`tick-${pt.step.size}`}
              textAnchor="middle"
              x={pt.x}
              y={PLOT_BOTTOM + 18}
            >
              {pt.step.size}
            </text>
          )
        })}

        {/* X-axis unit */}
        <text
          className="fill-muted-foreground/80 text-[10.5px]"
          textAnchor="end"
          x={PLOT_RIGHT}
          y={PLOT_BOTTOM + 18}
        >
          px
        </text>

        {/* Bracketed group labels below the x-axis */}
        {groups.map((span) => {
          const isGroupActive = activeGroup === span.group
          const bracketClass = isGroupActive
            ? "stroke-foreground/60"
            : "stroke-foreground/25"
          return (
          <g key={span.group}>
            {span.single ? (
              <path
                className={cn("transition-colors", bracketClass)}
                d={`M ${span.x1.toFixed(2)} ${(bracketY - 4).toFixed(2)} V ${bracketY.toFixed(2)}`}
                fill="none"
                strokeWidth={1}
              />
            ) : (
              <path
                className={cn("transition-colors", bracketClass)}
                d={`M ${span.x1.toFixed(2)} ${(bracketY - 4).toFixed(2)} V ${bracketY.toFixed(2)} H ${span.x2.toFixed(2)} V ${(bracketY - 4).toFixed(2)}`}
                fill="none"
                strokeWidth={1}
              />
            )}
            <text
              className={cn(
                "text-[10.5px] transition-colors",
                isGroupActive
                  ? "fill-foreground font-semibold"
                  : "fill-muted-foreground"
              )}
              textAnchor="middle"
              x={span.cx}
              y={bracketY + 15}
            >
              {span.group}
            </text>
          </g>
          )
        })}
      </svg>
    </div>
  )
}
