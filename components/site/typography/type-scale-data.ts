import { typeRamp, type TypeStep } from "@/lib/typography"

export type TypeScaleGroup = "Small" | "Body" | "Headings" | "Display"

export type TypeScaleMetric = "lineHeight" | "tracking"

export type TypeScaleStep = {
  /** Ramp key, e.g. "base". */
  step: TypeStep
  /** Tailwind class, e.g. "text-base". */
  className: string
  /** Font size in pixels. */
  size: number
  /** Line height in pixels. */
  lineHeight: number
  /** Letter spacing in em. */
  tracking: number
  /** Role grouping shown beneath the chart axis. */
  group: TypeScaleGroup
  /** Default specimen string rendered at this step. */
  sample: string
  /** Display steps render in the heading font (`font-display`). */
  display: boolean
  /** What the step is for. */
  role: string
}

const GROUPS: Record<TypeStep, TypeScaleGroup> = {
  xs: "Small",
  sm: "Body",
  base: "Body",
  lg: "Body",
  xl: "Headings",
  "2xl": "Headings",
  "3xl": "Headings",
  "4xl": "Display",
  "5xl": "Display",
}

const SAMPLES: Record<TypeStep, string> = {
  xs: "Last synced 4 minutes ago",
  sm: "Results load as you type, with no spinner.",
  base: "Each client gets a nudge before the due date.",
  lg: "Search is four times faster in this release",
  xl: "What changed in March",
  "2xl": "Release notes for March",
  "3xl": "Search, rebuilt",
  "4xl": "Paid on time",
  "5xl": "Invoices",
}

const REM = 16

const remToPx = (value: string) => Number.parseFloat(value) * REM
const emToNumber = (value: string) => Number.parseFloat(value)

/**
 * The scale the docs chart. Derived from `typeRamp` in `@/lib/typography`, the
 * same ramp that backs the `--text-*` tokens, so this page can never drift from
 * what ships.
 */
export const TYPE_SCALE: readonly TypeScaleStep[] = (
  Object.entries(typeRamp) as [TypeStep, (typeof typeRamp)[TypeStep]][]
).map(([step, value]) => ({
  step,
  className: value.className,
  size: remToPx(value.size),
  lineHeight: remToPx(value.lineHeight),
  tracking: emToNumber(value.tracking),
  group: GROUPS[step],
  sample: SAMPLES[step],
  display: value.display,
  role: value.role,
}))

export function getLineHeightRatio(
  step: Pick<TypeScaleStep, "size" | "lineHeight">
) {
  return step.lineHeight / step.size
}

export function formatRatio(ratio: number) {
  return ratio.toFixed(2)
}

export function formatTracking(em: number, withUnit = false) {
  if (em === 0) return withUnit ? "0em" : "0"
  const trimmed = Number(em.toFixed(3)).toString()
  const signed = em > 0 ? `+${trimmed}` : trimmed
  return withUnit ? `${signed}em` : signed
}

/** The theme tokens for the ramp, as they appear in `app/globals.css`. */
export function formatTypeScaleCss() {
  const declarations = (
    Object.entries(typeRamp) as [TypeStep, (typeof typeRamp)[TypeStep]][]
  ).flatMap(([step, value]) => [
    `  --text-${step}: ${value.size};`,
    `  --text-${step}--line-height: ${value.lineHeight};`,
    `  --text-${step}--letter-spacing: ${value.tracking};`,
  ])

  return `@theme {\n${declarations.join("\n")}\n}`
}
