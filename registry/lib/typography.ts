// @prometheus 0.2.0

/**
 * Type ramp. Each step is a size, a line-height, and tracking.
 * Theme variables `--text-*` match these values. The ramp ends at 5xl.
 */
export const typeRamp = {
  xs: {
    className: "text-xs",
    size: "0.75rem",
    lineHeight: "1rem",
    tracking: "0.02em",
    display: false,
    role: "Meta and captions.",
  },
  sm: {
    className: "text-sm",
    size: "0.875rem",
    lineHeight: "1.25rem",
    tracking: "0.01em",
    display: false,
    role: "Default UI and controls.",
  },
  base: {
    className: "text-base",
    size: "1rem",
    lineHeight: "1.5rem",
    tracking: "0em",
    display: false,
    role: "Reading and prose.",
  },
  lg: {
    className: "text-lg",
    size: "1.125rem",
    lineHeight: "1.75rem",
    tracking: "-0.01em",
    display: false,
    role: "Leads and large UI.",
  },
  xl: {
    className: "text-xl",
    size: "1.25rem",
    lineHeight: "1.75rem",
    tracking: "-0.02em",
    display: true,
    role: "Small titles.",
  },
  "2xl": {
    className: "text-2xl",
    size: "1.5rem",
    lineHeight: "2rem",
    tracking: "-0.025em",
    display: true,
    role: "Section titles.",
  },
  "3xl": {
    className: "text-3xl",
    size: "1.875rem",
    lineHeight: "2.25rem",
    tracking: "-0.03em",
    display: true,
    role: "Page titles.",
  },
  "4xl": {
    className: "text-4xl",
    size: "2.25rem",
    lineHeight: "2.75rem",
    tracking: "-0.03em",
    display: true,
    role: "Display titles.",
  },
  "5xl": {
    className: "text-5xl",
    size: "3rem",
    lineHeight: "3.5rem",
    tracking: "-0.035em",
    display: true,
    role: "Rare, large display.",
  },
} as const

export type TypeStep = keyof typeof typeRamp

/**
 * Drop cap. Put on a paragraph, or on a `prose` root so the first paragraph’s
 * opening letter sinks in Geist Serif. Default and minimum are two lines; use
 * `drop-cap-3` or `drop-cap-4` for taller caps. Or set `--drop-cap-lines` on a
 * `drop-cap` element for a custom height (clamped to at least 2 in CSS).
 */
export const dropCap = "drop-cap" as const

export type DropCapLines = 2 | 3 | 4

/** Class for a drop cap of `lines` body lines tall (default 2; minimum 2). */
export function dropCapClass(lines: DropCapLines = 2) {
  return lines === 2 ? dropCap : (`drop-cap-${lines}` as const)
}
