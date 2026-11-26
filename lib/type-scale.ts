export type TypeScaleGroup = "Small" | "Body" | "Headings" | "Display"

export type TypeScaleMetric = "lineHeight" | "tracking"

export type TypeScaleStep = {
  /** Font size in pixels. */
  size: number
  /** Line height in pixels. */
  lineHeight: number
  /** Letter spacing in em units. */
  tracking: number
  /** Typographic role grouping shown beneath the chart axis. */
  group: TypeScaleGroup
  /** Default specimen string rendered at this step. */
  sample: string
  /** Font weight used when rendering the specimen. */
  weight: 400 | 500 | 600
  /** CSS custom property prefix (e.g. "type-16"). */
  token: string
}

export const PROMETHEUS_TYPE_SCALE: readonly TypeScaleStep[] = [
  {
    size: 12,
    lineHeight: 16,
    tracking: 0.02,
    group: "Small",
    sample: "Last synced 4 minutes ago",
    weight: 400,
    token: "type-12",
  },
  {
    size: 14,
    lineHeight: 20,
    tracking: 0,
    group: "Body",
    sample: "Results load as you type, with no spinner.",
    weight: 400,
    token: "type-14",
  },
  {
    size: 16,
    lineHeight: 24,
    tracking: 0,
    group: "Body",
    sample: "Each client gets a nudge before the due date.",
    weight: 400,
    token: "type-16",
  },
  {
    size: 18,
    lineHeight: 28,
    tracking: 0,
    group: "Body",
    sample: "Search is four times faster in this release",
    weight: 400,
    token: "type-18",
  },
  {
    size: 24,
    lineHeight: 32,
    tracking: -0.01,
    group: "Headings",
    sample: "What changed in March",
    weight: 500,
    token: "type-24",
  },
  {
    size: 32,
    lineHeight: 36,
    tracking: -0.02,
    group: "Headings",
    sample: "Release notes for March",
    weight: 500,
    token: "type-32",
  },
  {
    size: 40,
    lineHeight: 44,
    tracking: -0.025,
    group: "Display",
    sample: "Search, rebuilt",
    weight: 600,
    token: "type-40",
  },
  {
    size: 48,
    lineHeight: 48,
    tracking: -0.03,
    group: "Display",
    sample: "Paid on time",
    weight: 600,
    token: "type-48",
  },
  {
    size: 64,
    lineHeight: 64,
    tracking: -0.035,
    group: "Display",
    sample: "Invoices",
    weight: 600,
    token: "type-64",
  },
] as const

export function getLineHeightRatio(step: Pick<TypeScaleStep, "size" | "lineHeight">) {
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

export function formatTypeScaleCss(scale: readonly TypeScaleStep[] = PROMETHEUS_TYPE_SCALE) {
  const declarations = scale.flatMap((step) => [
    `  --${step.token}-size: ${step.size}px;`,
    `  --${step.token}-leading: ${step.lineHeight}px;`,
    `  --${step.token}-tracking: ${step.tracking === 0 ? "0em" : `${step.tracking}em`};`,
  ])

  return `:root {\n${declarations.join("\n")}\n}`
}
