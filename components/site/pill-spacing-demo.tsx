"use client"

import * as React from "react"
import {
  ArrowPathIcon,
  ArrowsRightLeftIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid"

import {
  PlaygroundFigure,
  PlaygroundOptions,
  PlaygroundRow,
} from "@/components/site/playground"
import { cn } from "@/lib/utils"

type DemoMode = "interactive" | "compare"
type FormulaMode = "pi" | "naive"
type ChildKind = "icon" | "label"

const SCALE = 2
const BASE_FONT_PX = 16
const BASE_LH_PX = 24
const BASE_CAP_RATIO = 0.725
const DEFAULT_PY = 8
const DEFAULT_PX = 16
const MIN_PY = 2
const MAX_PY = 20
const MIN_PX = 6
const MAX_PX = 32
const CAP_OFFSET = (BASE_LH_PX - BASE_FONT_PX * BASE_CAP_RATIO) / 2

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function roundPx(value: number) {
  return Math.round(value)
}

function computePillMetrics(
  py: number,
  px: number,
  rValue: number | null,
  formula: FormulaMode,
) {
  const pill = py + BASE_LH_PX / 2
  const r = rValue === null ? pill : clamp(rValue, 0, pill)
  const height = pill * 2
  const areaLossWidth = pill > 0 ? (r * (1 - Math.PI / 4) * r) / pill : 0
  const gap = Math.max(py, px - CAP_OFFSET)
  const iconEdge = formula === "pi" ? py - px : 0
  const textEdge = formula === "pi" ? areaLossWidth : 0
  const iconSpace = px + iconEdge
  const textSpace = px + textEdge
  const opticalSpace = textSpace - areaLossWidth
  const isConcentric = Math.abs(iconSpace - py) < 0.25

  return {
    pill,
    r,
    height,
    areaLossWidth,
    gap,
    iconEdge,
    textEdge,
    iconSpace,
    textSpace,
    opticalSpace,
    isConcentric,
  }
}

function PillCircleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="block size-full"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" fill="currentColor" r="12" />
      <path
        d="M10 8.5L16.2 12L10 15.5V8.5Z"
        fill="var(--surface-3)"
      />
    </svg>
  )
}

type MeasuredBox = {
  width: number
  height: number
  children: Partial<Record<ChildKind, { left: number; width: number }>>
}

type ActiveDrag =
  | { kind: "py"; startY: number; startValue: number }
  | { kind: "px"; startX: number; startValue: number }
  | { kind: "r"; startX: number; startY: number; startValue: number }
  | { kind: "reorder"; startX: number; moved: boolean }

type PillDiagramProps = {
  py: number
  px: number
  rLocked: boolean
  customR: number
  formula: FormulaMode
  items: readonly ChildKind[]
  showGuides: boolean
  interactive?: boolean
  selected?: ChildKind | null
  activeDrag?: ActiveDrag | null
  dragOffsetX?: number
  badgeLabel?: string
  onSelectChild?: (kind: ChildKind | null) => void
  onDeleteChild?: (kind: ChildKind) => void
  onStartDrag?: (
    event: React.PointerEvent,
    drag: ActiveDrag,
  ) => void
  onNudge?: (kind: "py" | "px" | "r", delta: number) => void
}

function PillDiagram({
  py,
  px,
  rLocked,
  customR,
  formula,
  items,
  showGuides,
  interactive = false,
  selected = null,
  activeDrag = null,
  dragOffsetX = 0,
  badgeLabel,
  onSelectChild,
  onDeleteChild,
  onStartDrag,
  onNudge,
}: PillDiagramProps) {
  const pillRef = React.useRef<HTMLDivElement>(null)
  const iconRef = React.useRef<HTMLSpanElement>(null)
  const labelRef = React.useRef<HTMLSpanElement>(null)
  const [measured, setMeasured] = React.useState<MeasuredBox | null>(null)

  const metrics = computePillMetrics(
    py,
    px,
    rLocked ? null : customR,
    formula,
  )

  const measure = React.useCallback(() => {
    const pillEl = pillRef.current
    if (!pillEl) return
    const pillRect = pillEl.getBoundingClientRect()
    const next: MeasuredBox = {
      width: pillRect.width,
      height: pillRect.height,
      children: {},
    }
    if (iconRef.current) {
      const r = iconRef.current.getBoundingClientRect()
      next.children.icon = {
        left: r.left - pillRect.left - dragOffsetX,
        width: r.width,
      }
    }
    if (labelRef.current) {
      const r = labelRef.current.getBoundingClientRect()
      next.children.label = {
        left: r.left - pillRect.left,
        width: r.width,
      }
    }
    setMeasured(next)
  }, [dragOffsetX])

  React.useLayoutEffect(() => {
    measure()
    const pillEl = pillRef.current
    if (!pillEl || typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver(measure)
    ro.observe(pillEl)
    return () => ro.disconnect()
  }, [measure, py, px, rLocked, customR, formula, items])

  const first = items[0]
  const last = items[items.length - 1]
  const hasBoth = items.length === 2

  const scaledPy = py * SCALE
  const scaledPx = px * SCALE
  const scaledPill = metrics.pill * SCALE
  const scaledR = metrics.r * SCALE
  const scaledAreaLoss = metrics.areaLossWidth * SCALE
  const scaledGap = metrics.gap * SCALE

  const pillW = measured?.width ?? 0
  const pillH = measured?.height ?? metrics.height * SCALE
  const isPi = formula === "pi"

  const statusGood = isPi
  const statusColor = statusGood
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-rose-600 dark:text-rose-400"
  const guideStrokeGood = "#10b981"
  const guideStrokeBad = "#e11d48"
  const guideStroke = statusGood ? guideStrokeGood : guideStrokeBad
  const lostFill = statusGood
    ? "rgba(245, 158, 11, 0.28)"
    : "rgba(225, 29, 72, 0.24)"
  const lostStroke = statusGood
    ? "rgba(217, 119, 6, 0.65)"
    : "rgba(225, 29, 72, 0.65)"

  const firstBox = first ? measured?.children[first] : undefined
  const lastBox = last ? measured?.children[last] : undefined
  const leftSpacePx = first === "icon" ? metrics.iconSpace : metrics.textSpace
  const rightSpacePx = last === "icon" ? metrics.iconSpace : metrics.textSpace

  const leftSpaceScreen = firstBox ? firstBox.left : leftSpacePx * SCALE
  const rightSpaceScreen = lastBox
    ? pillW - (lastBox.left + lastBox.width)
    : rightSpacePx * SCALE
  const gapStartScreen = firstBox ? firstBox.left + firstBox.width : 0
  const gapEndScreen = lastBox ? lastBox.left : 0

  const iconCenterScreenX =
    measured?.children.icon != null
      ? measured.children.icon.left + measured.children.icon.width / 2
      : null
  const iconIsFirst = first === "icon"
  const iconIsLast = last === "icon"
  const capCenterX =
    iconIsFirst && iconIsLast
      ? pillW / 2
      : iconIsFirst
        ? scaledPill
        : pillW - scaledPill

  const handleInset = clamp(scaledR * 0.42, 10, scaledPill * 0.6)

  const pillCssVars = {
    "--py": `${scaledPy}px`,
    "--px": `${scaledPx}px`,
    "--pill": "calc(var(--py) + 0.5lh)",
    "--r": rLocked ? "var(--pill)" : `${scaledR}px`,
    fontSize: `${BASE_FONT_PX * SCALE}px`,
    lineHeight: `${BASE_LH_PX * SCALE}px`,
    padding: "var(--py) var(--px)",
    gap: `${scaledGap}px`,
    borderRadius:
      formula === "naive" ? "999px" : "var(--r)",
  } as React.CSSProperties

  const getChildStyle = (kind: ChildKind, index: number): React.CSSProperties => {
    const isFirstChild = index === 0
    const isLastChild = index === items.length - 1
    const edgeExpr =
      formula === "naive"
        ? "0px"
        : kind === "icon"
          ? "calc(var(--py) - var(--px))"
          : "calc(var(--r) * (1 - pi / 4) * var(--r) / var(--pill))"

    return {
      ["--edge" as string]: edgeExpr,
      marginInlineStart: isFirstChild ? "var(--edge)" : undefined,
      marginInlineEnd: isLastChild ? "var(--edge)" : undefined,
      width: kind === "icon" ? "1lh" : undefined,
      height: kind === "icon" ? "1lh" : undefined,
      transform:
        kind === "icon" && dragOffsetX !== 0
          ? `translateX(${dragOffsetX}px)`
          : undefined,
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Top annotation row */}
      <div className="mb-3 flex min-h-7 w-full flex-col items-center justify-center gap-1.5 text-xs">
        {badgeLabel ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-medium",
              statusGood
                ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
                : "bg-rose-500/12 text-rose-700 dark:text-rose-300",
            )}
          >
            {statusGood ? (
              <CheckIcon className="size-3.5" />
            ) : (
              <XMarkIcon className="size-3.5" />
            )}
            {badgeLabel}
          </span>
        ) : null}

        {showGuides ? (
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-mono text-[11px]">
            {items.includes("icon") ? (
              <span className={cn("inline-flex items-center gap-1", statusColor)}>
                {metrics.isConcentric ? (
                  <>
                    <CheckIcon className="size-3" />
                    Concentric · {roundPx(py)} all around
                  </>
                ) : (
                  <>
                    <XMarkIcon className="size-3" />
                    Off-center ({roundPx(metrics.iconSpace)} vs {roundPx(py)})
                  </>
                )}
              </span>
            ) : null}

            {items.includes("label") ? (
              <span className={cn("inline-flex items-center gap-1", statusColor)}>
                {statusGood ? (
                  <>
                    <CheckIcon className="size-3" />
                    Optical space {roundPx(metrics.opticalSpace)}
                  </>
                ) : (
                  <>
                    <XMarkIcon className="size-3" />
                    Optical space {roundPx(metrics.opticalSpace)}, not{" "}
                    {roundPx(px)}
                  </>
                )}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Main pill + SVG overlay wrapper */}
      <div className="relative my-5 inline-flex items-center justify-center">
        {/* Live drag readout tooltip */}
        {interactive && activeDrag && activeDrag.kind !== "reorder" ? (
          <div className="pointer-events-none absolute -top-9 left-1/2 z-30 -translate-x-1/2 rounded-full bg-foreground px-2.5 py-0.5 font-mono text-[11px] font-medium whitespace-nowrap text-background shadow-sm">
            {activeDrag.kind === "py" && `--py: ${roundPx(py)}px`}
            {activeDrag.kind === "px" && `--px: ${roundPx(px)}px`}
            {activeDrag.kind === "r" &&
              (rLocked
                ? `--r: var(--pill) (${roundPx(metrics.pill)}px)`
                : `--r: ${roundPx(metrics.r)}px`)}
          </div>
        ) : null}

        {/* The real CSS-driven pill button */}
        <div
          ref={pillRef}
          className={cn(
            "relative inline-flex items-center justify-center bg-surface-3 font-medium whitespace-nowrap text-foreground shadow-[inset_0_1px_0_0_rgb(255_255_255/0.08),0_0_0_1px_var(--border),0_6px_16px_-6px_hsl(0_0%_0%/14%)] select-none",
            !activeDrag && "transition-[border-radius] duration-150",
          )}
          style={pillCssVars}
          onClick={(event) => {
            if (!interactive) return
            if (event.target === event.currentTarget) {
              onSelectChild?.(null)
            }
          }}
        >
          {items.map((kind, index) => {
            const isSelected = interactive && selected === kind
            const canDelete = items.length > 1

            if (kind === "icon") {
              return (
                <span
                  key="icon"
                  ref={iconRef}
                  data-demo-child="icon"
                  role={interactive ? "button" : undefined}
                  tabIndex={interactive ? 0 : undefined}
                  aria-label={
                    interactive
                      ? "Icon element. Click to select, drag to reorder, or press Delete to remove."
                      : undefined
                  }
                  className={cn(
                    "relative z-10 inline-flex shrink-0 items-center justify-center rounded-full text-foreground outline-none",
                    interactive &&
                      "cursor-grab active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-sky-500",
                    isSelected &&
                      "ring-2 ring-sky-500 ring-offset-2 ring-offset-surface-3",
                    activeDrag?.kind === "reorder" && "z-30 opacity-90",
                  )}
                  style={getChildStyle("icon", index)}
                  onPointerDown={(event) => {
                    if (!interactive) return
                    event.stopPropagation()
                    onStartDrag?.(event, {
                      kind: "reorder",
                      startX: event.clientX,
                      moved: false,
                    })
                  }}
                  onClick={(event) => {
                    if (!interactive) return
                    event.stopPropagation()
                  }}
                  onKeyDown={(event) => {
                    if (!interactive) return
                    if (
                      (event.key === "Delete" || event.key === "Backspace") &&
                      canDelete
                    ) {
                      event.preventDefault()
                      onDeleteChild?.("icon")
                    }
                  }}
                >
                  <PillCircleIcon />
                  {isSelected && canDelete ? (
                    <button
                      type="button"
                      aria-label="Remove icon"
                      className="absolute -top-3.5 -right-3.5 z-40 inline-flex size-5 cursor-pointer items-center justify-center rounded-full bg-sky-500 text-white shadow-sm hover:bg-sky-600"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteChild?.("icon")
                      }}
                    >
                      <XMarkIcon className="size-3" />
                    </button>
                  ) : null}
                </span>
              )
            }

            return (
              <span
                key="label"
                ref={labelRef}
                data-demo-child="label"
                role={interactive ? "button" : undefined}
                tabIndex={interactive ? 0 : undefined}
                aria-label={
                  interactive
                    ? "Text label. Click to select or press Delete to remove."
                    : undefined
                }
                className={cn(
                  "relative z-10 inline-flex items-center rounded-[4px] outline-none",
                  interactive &&
                    "cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-500",
                  isSelected &&
                    "ring-2 ring-sky-500 ring-offset-2 ring-offset-surface-3",
                )}
                style={getChildStyle("label", index)}
                onClick={(event) => {
                  if (!interactive) return
                  event.stopPropagation()
                  onSelectChild?.(selected === "label" ? null : "label")
                }}
                onKeyDown={(event) => {
                  if (!interactive) return
                  if (
                    (event.key === "Delete" || event.key === "Backspace") &&
                    canDelete
                  ) {
                    event.preventDefault()
                    onDeleteChild?.("label")
                  }
                }}
              >
                Button
                {isSelected && canDelete ? (
                  <button
                    type="button"
                    aria-label="Remove label"
                    className="absolute -top-3.5 -right-3.5 z-40 inline-flex size-5 cursor-pointer items-center justify-center rounded-full bg-sky-500 text-white shadow-sm hover:bg-sky-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteChild?.("label")
                    }}
                  >
                    <XMarkIcon className="size-3" />
                  </button>
                ) : null}
              </span>
            )
          })}
        </div>

        {/* Precision SVG geometry overlays */}
        {showGuides && pillW > 0 && pillH > 0 ? (
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 z-20 overflow-visible"
            height={pillH}
            width={pillW}
          >
            {/* Outer bounding rectangle corner ticks to show area lost to curve */}
            {first === "label" && scaledR > 0.5 ? (
              <g>
                {/* Top-left corner lost to curve */}
                <path
                  d={`M 0 ${scaledR} L 0 0 L ${scaledR} 0 A ${scaledR} ${scaledR} 0 0 0 0 ${scaledR} Z`}
                  fill={lostFill}
                  stroke={lostStroke}
                  strokeWidth="1"
                />
                {/* Bottom-left corner lost to curve */}
                <path
                  d={`M ${scaledR} ${pillH} L 0 ${pillH} L 0 ${pillH - scaledR} A ${scaledR} ${scaledR} 0 0 0 ${scaledR} ${pillH} Z`}
                  fill={lostFill}
                  stroke={lostStroke}
                  strokeWidth="1"
                />
                {/* Optical space dotted line on left */}
                <line
                  stroke={guideStroke}
                  strokeDasharray="3 3"
                  strokeWidth="1.5"
                  x1={scaledAreaLoss}
                  x2={scaledAreaLoss}
                  y1={-6}
                  y2={pillH + 6}
                />
                <text
                  className="font-mono text-[10px] font-medium"
                  fill={guideStroke}
                  textAnchor="middle"
                  x={scaledAreaLoss + (leftSpaceScreen - scaledAreaLoss) / 2}
                  y={-10}
                >
                  avg {roundPx(metrics.opticalSpace)}
                </text>
              </g>
            ) : null}

            {last === "label" && scaledR > 0.5 ? (
              <g>
                {/* Top-right corner lost to curve */}
                <path
                  d={`M ${pillW - scaledR} 0 L ${pillW} 0 L ${pillW} ${scaledR} A ${scaledR} ${scaledR} 0 0 0 ${pillW - scaledR} 0 Z`}
                  fill={lostFill}
                  stroke={lostStroke}
                  strokeWidth="1"
                />
                {/* Bottom-right corner lost to curve */}
                <path
                  d={`M ${pillW} ${pillH - scaledR} L ${pillW} ${pillH} L ${pillW - scaledR} ${pillH} A ${scaledR} ${scaledR} 0 0 0 ${pillW} ${pillH - scaledR} Z`}
                  fill={lostFill}
                  stroke={lostStroke}
                  strokeWidth="1"
                />
                {/* Optical space dotted line on right */}
                <line
                  stroke={guideStroke}
                  strokeDasharray="3 3"
                  strokeWidth="1.5"
                  x1={pillW - scaledAreaLoss}
                  x2={pillW - scaledAreaLoss}
                  y1={-6}
                  y2={pillH + 6}
                />
                <text
                  className="font-mono text-[10px] font-medium"
                  fill={guideStroke}
                  textAnchor="middle"
                  x={
                    pillW -
                    rightSpaceScreen +
                    (rightSpaceScreen - scaledAreaLoss) / 2
                  }
                  y={-10}
                >
                  avg {roundPx(metrics.opticalSpace)}
                </text>
              </g>
            ) : null}

            {/* Dotted concentric circle on icon cap */}
            {items.includes("icon") && iconCenterScreenX != null ? (
              <g>
                {/* Outer cap circle centered on the round end */}
                <circle
                  cx={capCenterX}
                  cy={pillH / 2}
                  fill="none"
                  r={Math.max(2, pillH / 2 - 1)}
                  stroke={guideStroke}
                  strokeDasharray="3 3"
                  strokeOpacity="0.85"
                  strokeWidth="1.5"
                />
                {/* Inner concentric ring centered on the icon */}
                <circle
                  cx={iconCenterScreenX}
                  cy={pillH / 2}
                  fill="none"
                  r={
                    (measured?.children.icon?.width ?? BASE_LH_PX * SCALE) / 2 +
                    Math.max(2, scaledPy / 2)
                  }
                  stroke={guideStroke}
                  strokeDasharray="2 3"
                  strokeOpacity={metrics.isConcentric ? "0.7" : "0.95"}
                  strokeWidth="1.25"
                />
                {/* Center crosshair when off-center to highlight mismatch */}
                {!metrics.isConcentric ? (
                  <>
                    <circle
                      cx={capCenterX}
                      cy={pillH / 2}
                      fill={guideStrokeBad}
                      r="2.5"
                    />
                    <circle
                      cx={iconCenterScreenX}
                      cy={pillH / 2}
                      fill="none"
                      r="2.5"
                      stroke={guideStrokeBad}
                      strokeWidth="1.5"
                    />
                    <line
                      stroke={guideStrokeBad}
                      strokeWidth="1.5"
                      x1={capCenterX}
                      x2={iconCenterScreenX}
                      y1={pillH / 2}
                      y2={pillH / 2}
                    />
                  </>
                ) : null}
              </g>
            ) : null}

            {/* Bottom dimension brackets (e.g. 8 | 10 | 20) */}
            <g transform={`translate(0, ${pillH + 14})`}>
              {/* Left edge bracket */}
              {leftSpaceScreen > 2 ? (
                <DimensionBracket
                  color={
                    first === "icon"
                      ? metrics.isConcentric
                        ? guideStrokeGood
                        : guideStrokeBad
                      : guideStroke
                  }
                  label={`${roundPx(leftSpacePx)}`}
                  x1={0}
                  x2={leftSpaceScreen}
                />
              ) : null}

              {/* Gap bracket when both icon and label are present */}
              {hasBoth && gapEndScreen > gapStartScreen + 2 ? (
                <DimensionBracket
                  color="var(--muted-foreground)"
                  label={`${roundPx(metrics.gap)}`}
                  x1={gapStartScreen}
                  x2={gapEndScreen}
                />
              ) : null}

              {/* Right edge bracket */}
              {rightSpaceScreen > 2 ? (
                <DimensionBracket
                  color={
                    last === "icon"
                      ? metrics.isConcentric
                        ? guideStrokeGood
                        : guideStrokeBad
                      : guideStroke
                  }
                  label={`${roundPx(rightSpacePx)}`}
                  x1={pillW - rightSpaceScreen}
                  x2={pillW}
                />
              ) : null}
            </g>
          </svg>
        ) : null}

        {/* Interactive direct-manipulation drag handles */}
        {interactive ? (
          <>
            {/* Top edge handle → --py */}
            <div
              role="slider"
              tabIndex={0}
              aria-label="Vertical padding (--py)"
              aria-valuemin={MIN_PY}
              aria-valuemax={MAX_PY}
              aria-valuenow={roundPx(py)}
              title="Drag vertically to adjust --py"
              className="group/py absolute -top-2.5 inset-x-7 z-30 flex h-5 cursor-ns-resize items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-full"
              onPointerDown={(event) => {
                event.stopPropagation()
                onStartDrag?.(event, {
                  kind: "py",
                  startY: event.clientY,
                  startValue: py,
                })
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowUp") {
                  event.preventDefault()
                  onNudge?.("py", 1)
                } else if (event.key === "ArrowDown") {
                  event.preventDefault()
                  onNudge?.("py", -1)
                }
              }}
            >
              <span
                className={cn(
                  "h-1 w-10 rounded-full transition-all duration-150",
                  activeDrag?.kind === "py"
                    ? "w-14 bg-sky-500"
                    : "bg-sky-500/45 group-hover/py:w-14 group-hover/py:bg-sky-500",
                )}
              />
            </div>

            {/* Right edge handle → --px */}
            <div
              role="slider"
              tabIndex={0}
              aria-label="Horizontal padding (--px)"
              aria-valuemin={MIN_PX}
              aria-valuemax={MAX_PX}
              aria-valuenow={roundPx(px)}
              title="Drag horizontally to adjust --px"
              className="group/px absolute inset-y-4 -right-2.5 z-30 flex w-5 cursor-ew-resize items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-full"
              onPointerDown={(event) => {
                event.stopPropagation()
                onStartDrag?.(event, {
                  kind: "px",
                  startX: event.clientX,
                  startValue: px,
                })
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") {
                  event.preventDefault()
                  onNudge?.("px", 1)
                } else if (event.key === "ArrowLeft") {
                  event.preventDefault()
                  onNudge?.("px", -1)
                }
              }}
            >
              <span
                className={cn(
                  "h-7 w-1 rounded-full transition-all duration-150",
                  activeDrag?.kind === "px"
                    ? "h-10 bg-sky-500"
                    : "bg-sky-500/45 group-hover/px:h-10 group-hover/px:bg-sky-500",
                )}
              />
            </div>

            {/* Corner radius dot handle → --r (when in π mode) */}
            {formula === "pi" ? (
              <div
                role="slider"
                tabIndex={0}
                aria-label="Border radius (--r)"
                aria-valuemin={0}
                aria-valuemax={roundPx(metrics.pill)}
                aria-valuenow={roundPx(metrics.r)}
                title="Drag diagonally to adjust border-radius (--r)"
                className="group/r absolute z-30 flex size-6 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                style={{
                  left: handleInset,
                  top: handleInset,
                }}
                onPointerDown={(event) => {
                  event.stopPropagation()
                  onStartDrag?.(event, {
                    kind: "r",
                    startX: event.clientX,
                    startY: event.clientY,
                    startValue: metrics.r,
                  })
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                    event.preventDefault()
                    onNudge?.("r", 1)
                  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                    event.preventDefault()
                    onNudge?.("r", -1)
                  }
                }}
              >
                <span
                  className={cn(
                    "size-2.5 rounded-full border-2 border-sky-500 bg-surface-3 shadow-xs transition-transform duration-150",
                    activeDrag?.kind === "r"
                      ? "scale-125 bg-sky-500"
                      : "group-hover/r:scale-125",
                  )}
                />
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      {/* Spacer for bottom dimension brackets */}
      <div className="h-7" />
    </div>
  )
}

function DimensionBracket({
  x1,
  x2,
  label,
  color,
}: {
  x1: number
  x2: number
  label: string
  color: string
}) {
  const mid = (x1 + x2) / 2
  return (
    <g>
      <line stroke={color} strokeOpacity="0.7" strokeWidth="1" x1={x1} x2={x1} y1={-4} y2={4} />
      <line stroke={color} strokeOpacity="0.7" strokeWidth="1" x1={x2} x2={x2} y1={-4} y2={4} />
      <line stroke={color} strokeOpacity="0.7" strokeWidth="1" x1={x1} x2={x2} y1={0} y2={0} />
      <text
        className="font-mono text-[11px] font-medium tabular-nums"
        fill={color}
        textAnchor="middle"
        x={mid}
        y={15}
      >
        {label}
      </text>
    </g>
  )
}

const MODE_OPTIONS = [
  { value: "interactive", label: "Interactive" },
  { value: "compare", label: "Wrong vs Right" },
] as const

const FORMULA_OPTIONS = [
  { value: "pi", label: "π formula" },
  { value: "naive", label: "Naive (999px)" },
] as const

export function PillSpacingDemo() {
  const [mode, setMode] = React.useState<DemoMode>("interactive")
  const [formula, setFormula] = React.useState<FormulaMode>("pi")
  const [py, setPy] = React.useState(DEFAULT_PY)
  const [px, setPx] = React.useState(DEFAULT_PX)
  const [rLocked, setRLocked] = React.useState(true)
  const [customR, setCustomR] = React.useState(DEFAULT_PY + BASE_LH_PX / 2)
  const [items, setItems] = React.useState<ChildKind[]>(["icon", "label"])
  const [showGuides, setShowGuides] = React.useState(true)
  const [selected, setSelected] = React.useState<ChildKind | null>(null)
  const [activeDrag, setActiveDrag] = React.useState<ActiveDrag | null>(null)
  const [dragOffsetX, setDragOffsetX] = React.useState(0)

  const metrics = computePillMetrics(
    py,
    px,
    rLocked ? null : customR,
    formula,
  )

  const deleteChild = React.useCallback((kind: ChildKind) => {
    setItems((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((item) => item !== kind)
    })
    setSelected(null)
  }, [])

  const toggleChild = React.useCallback((kind: ChildKind) => {
    setItems((prev) => {
      if (prev.includes(kind)) {
        if (prev.length <= 1) return prev
        return prev.filter((item) => item !== kind)
      }
      return kind === "icon" ? ["icon", ...prev] : [...prev, "label"]
    })
    setSelected(null)
  }, [])

  const swapOrder = React.useCallback(() => {
    setItems((prev) => (prev.length === 2 ? [prev[1], prev[0]] : prev))
  }, [])

  const resetAll = React.useCallback(() => {
    setFormula("pi")
    setPy(DEFAULT_PY)
    setPx(DEFAULT_PX)
    setRLocked(true)
    setCustomR(DEFAULT_PY + BASE_LH_PX / 2)
    setItems(["icon", "label"])
    setSelected(null)
    setShowGuides(true)
  }, [])

  // Keyboard Delete/Backspace when an element is selected
  React.useEffect(() => {
    if (!selected || mode !== "interactive") return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault()
        deleteChild(selected)
      } else if (event.key === "Escape") {
        setSelected(null)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [selected, mode, deleteChild])

  // Global pointer listeners while dragging any handle or reordering icon
  React.useEffect(() => {
    if (!activeDrag) return

    const onPointerMove = (event: PointerEvent) => {
      if (activeDrag.kind === "py") {
        const delta = (activeDrag.startY - event.clientY) / SCALE
        const nextPy = clamp(
          Math.round(activeDrag.startValue + delta),
          MIN_PY,
          MAX_PY,
        )
        setPy(nextPy)
        const nextPill = nextPy + BASE_LH_PX / 2
        if (!rLocked) {
          setCustomR((prev) => clamp(prev, 0, nextPill))
        }
      } else if (activeDrag.kind === "px") {
        const delta = (event.clientX - activeDrag.startX) / SCALE
        setPx(clamp(Math.round(activeDrag.startValue + delta), MIN_PX, MAX_PX))
      } else if (activeDrag.kind === "r") {
        const delta =
          (event.clientX - activeDrag.startX + (event.clientY - activeDrag.startY)) /
          (SCALE * 1.4)
        const maxR = py + BASE_LH_PX / 2
        const nextR = clamp(Math.round(activeDrag.startValue + delta), 0, maxR)
        if (nextR >= maxR) {
          setRLocked(true)
          setCustomR(maxR)
        } else {
          setRLocked(false)
          setCustomR(nextR)
        }
      } else if (activeDrag.kind === "reorder") {
        const dx = event.clientX - activeDrag.startX
        if (Math.abs(dx) > 5) {
          if (!activeDrag.moved) {
            setActiveDrag({ ...activeDrag, moved: true })
          }
          setDragOffsetX(clamp(dx, -140, 140))
          if (items.length === 2) {
            const iconAtStart = items[0] === "icon"
            if (iconAtStart && dx > 52) {
              setItems(["label", "icon"])
              setActiveDrag({
                kind: "reorder",
                startX: event.clientX,
                moved: true,
              })
              setDragOffsetX(0)
            } else if (!iconAtStart && dx < -52) {
              setItems(["icon", "label"])
              setActiveDrag({
                kind: "reorder",
                startX: event.clientX,
                moved: true,
              })
              setDragOffsetX(0)
            }
          }
        }
      }
    }

    const onPointerUp = () => {
      if (activeDrag.kind === "reorder" && !activeDrag.moved) {
        setSelected((prev) => (prev === "icon" ? null : "icon"))
      }
      setActiveDrag(null)
      setDragOffsetX(0)
    }

    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
    }
  }, [activeDrag, items, py, rLocked])

  const handleStartDrag = React.useCallback(
    (event: React.PointerEvent, drag: ActiveDrag) => {
      event.preventDefault()
      setActiveDrag(drag)
    },
    [],
  )

  const handleNudge = React.useCallback(
    (kind: "py" | "px" | "r", delta: number) => {
      if (kind === "py") {
        setPy((prev) => {
          const next = clamp(prev + delta, MIN_PY, MAX_PY)
          const nextPill = next + BASE_LH_PX / 2
          if (!rLocked) setCustomR((rPrev) => clamp(rPrev, 0, nextPill))
          return next
        })
      } else if (kind === "px") {
        setPx((prev) => clamp(prev + delta, MIN_PX, MAX_PX))
      } else {
        const maxR = py + BASE_LH_PX / 2
        const currentR = rLocked ? maxR : customR
        const nextR = clamp(currentR + delta, 0, maxR)
        if (nextR >= maxR) {
          setRLocked(true)
          setCustomR(maxR)
        } else {
          setRLocked(false)
          setCustomR(nextR)
        }
      }
    },
    [customR, py, rLocked],
  )

  const cssCode = React.useMemo(() => {
    const rLine = rLocked
      ? "  --r: var(--pill);"
      : `  --r: ${roundPx(metrics.r)}px;`
    if (mode === "interactive" && formula === "naive") {
      return `/* Naive pill button — round ends steal space & push icon off-center */
button {
  padding: ${roundPx(py)}px ${roundPx(px)}px;
  gap: ${roundPx(metrics.gap)}px;
  border-radius: 999px;
}`
    }
    return `button {
  --py: ${roundPx(py)}px;
  --px: ${roundPx(px)}px;
  --pill: calc(var(--py) + 0.5lh);
${rLine}
  padding: var(--py) var(--px);
  gap: max(var(--py), var(--px) - (1lh - 1cap) / 2);
  border-radius: var(--r);
}
button > :first-child { margin-inline-start: var(--edge); }
button > :last-child { margin-inline-end: var(--edge); }

.icon {
  width: 1lh; height: 1lh;
  --edge: calc(var(--py) - var(--px));
}
.label {
  --edge: calc(var(--r) * (1 - pi / 4) * var(--r) / var(--pill));
}`
  }, [formula, metrics.gap, metrics.r, mode, px, py, rLocked])

  const isDirty =
    formula !== "pi" ||
    py !== DEFAULT_PY ||
    px !== DEFAULT_PX ||
    !rLocked ||
    items.length !== 2 ||
    items[0] !== "icon"

  return (
    <PlaygroundFigure code={cssCode}>
      {/* Interactive or Compare stage */}
      <div
        className="relative flex min-h-68 flex-col items-center justify-center px-6 py-8"
        onClick={() => setSelected(null)}
      >
        {mode === "interactive" ? (
          <>
            <PillDiagram
              activeDrag={activeDrag}
              customR={customR}
              dragOffsetX={dragOffsetX}
              formula={formula}
              interactive
              items={items}
              px={px}
              py={py}
              rLocked={rLocked}
              selected={selected}
              showGuides={showGuides}
              onDeleteChild={deleteChild}
              onNudge={handleNudge}
              onSelectChild={setSelected}
              onStartDrag={handleStartDrag}
            />
            <p className="mt-1 text-center text-xs text-muted-foreground">
              {selected ? (
                <>
                  Selected{" "}
                  <span className="font-mono text-foreground">{selected}</span>
                  {" · "}
                  Press <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">Delete</kbd> to remove
                </>
              ) : (
                "Drag top edge (--py), right edge (--px), corner dot (--r), drag icon L↔R to reorder, or click icon/text + Delete."
              )}
            </p>
          </>
        ) : (
          <div className="flex w-full flex-col items-center justify-center gap-6 py-2">
            <PillDiagram
              badgeLabel="Naive · border-radius: 999px"
              customR={customR}
              formula="naive"
              items={items}
              px={px}
              py={py}
              rLocked={true}
              showGuides={showGuides}
            />
            <div className="h-px w-full max-w-sm bg-border" />
            <PillDiagram
              badgeLabel="π formula · --r: var(--pill)"
              customR={customR}
              formula="pi"
              items={items}
              px={px}
              py={py}
              rLocked={rLocked}
              showGuides={showGuides}
            />
          </div>
        )}
      </div>

      {/* View & formula controls */}
      <PlaygroundRow>
        <PlaygroundOptions
          label="View"
          options={MODE_OPTIONS}
          value={mode}
          onValueChange={setMode}
        />
      </PlaygroundRow>

      {mode === "interactive" ? (
        <PlaygroundRow>
          <PlaygroundOptions
            label="Formula"
            options={FORMULA_OPTIONS}
            value={formula}
            onValueChange={setFormula}
          />
        </PlaygroundRow>
      ) : null}

      {/* Element composition + quick controls */}
      <PlaygroundRow className="flex-wrap justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            className={cn(
              "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-sm border px-2.5 text-xs font-medium transition-colors",
              items.includes("icon")
                ? "border-border bg-surface-3 text-foreground"
                : "border-transparent bg-transparent text-muted-foreground hover:bg-hover hover:text-foreground",
            )}
            disabled={items.length === 1 && items[0] === "icon"}
            onClick={() => toggleChild("icon")}
          >
            Icon
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-sm border px-2.5 text-xs font-medium transition-colors",
              items.includes("label")
                ? "border-border bg-surface-3 text-foreground"
                : "border-transparent bg-transparent text-muted-foreground hover:bg-hover hover:text-foreground",
            )}
            disabled={items.length === 1 && items[0] === "label"}
            onClick={() => toggleChild("label")}
          >
            Label
          </button>
          <button
            type="button"
            className="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-sm border border-transparent px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-hover hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
            disabled={items.length < 2}
            onClick={swapOrder}
          >
            <ArrowsRightLeftIcon className="size-3.5" />
            Swap
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-sm border px-2.5 text-xs font-medium transition-colors",
              showGuides
                ? "border-border bg-surface-3 text-foreground"
                : "border-transparent bg-transparent text-muted-foreground hover:bg-hover hover:text-foreground",
            )}
            onClick={() => setShowGuides((prev) => !prev)}
          >
            Guides
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground tabular-nums">
          <span>py {roundPx(py)}</span>
          <span>·</span>
          <span>px {roundPx(px)}</span>
          <span>·</span>
          <span>
            r {rLocked ? `pill (${roundPx(metrics.pill)})` : roundPx(metrics.r)}
          </span>
          {isDirty ? (
            <button
              type="button"
              className="ml-1 inline-flex h-7 cursor-pointer items-center gap-1 rounded-sm px-2 font-sans text-xs font-medium text-muted-foreground hover:bg-hover hover:text-foreground"
              onClick={resetAll}
            >
              <ArrowPathIcon className="size-3.5" />
              Reset
            </button>
          ) : null}
        </div>
      </PlaygroundRow>
    </PlaygroundFigure>
  )
}
