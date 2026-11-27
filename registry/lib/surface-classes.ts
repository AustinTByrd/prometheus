// @prometheus 0.2.0
/**
 * Static lookup tables for surface tokens.
 *
 * Tailwind v4's scanner only generates utilities for literal class names.
 * Template strings like `bg-surface-${level}` never emit, so the background
 * renders transparent. Keep every level written out here.
 */

export const SURFACE_BG: Record<number, string> = {
  1: "bg-surface-1",
  2: "bg-surface-2",
  3: "bg-surface-3",
  4: "bg-surface-4",
  5: "bg-surface-5",
  6: "bg-surface-6",
  7: "bg-surface-7",
  8: "bg-surface-8",
}

export const SURFACE_SHADOW: Record<number, string> = {
  1: "shadow-surface-1",
  2: "shadow-surface-2",
  3: "shadow-surface-3",
  4: "shadow-surface-4",
  5: "shadow-surface-5",
  6: "shadow-surface-6",
  7: "shadow-surface-7",
  8: "shadow-surface-8",
}

export const SURFACE_HOVER_BG: Record<number, string> = {
  1: "hover:bg-surface-1",
  2: "hover:bg-surface-2",
  3: "hover:bg-surface-3",
  4: "hover:bg-surface-4",
  5: "hover:bg-surface-5",
  6: "hover:bg-surface-6",
  7: "hover:bg-surface-7",
  8: "hover:bg-surface-8",
}

export const SURFACE_HOVER_SHADOW: Record<number, string> = {
  1: "hover:shadow-surface-1",
  2: "hover:shadow-surface-2",
  3: "hover:shadow-surface-3",
  4: "hover:shadow-surface-4",
  5: "hover:shadow-surface-5",
  6: "hover:shadow-surface-6",
  7: "hover:shadow-surface-7",
  8: "hover:shadow-surface-8",
}

function clampLevel(level: number) {
  return Math.round(Math.max(1, Math.min(8, level)))
}

export function surfaceClasses(
  bgLevel: number,
  shadowLevel: number = bgLevel
): string {
  return `${SURFACE_BG[clampLevel(bgLevel)]} ${SURFACE_SHADOW[clampLevel(shadowLevel)]}`
}

export function surfaceHoverClasses(
  bgLevel: number,
  shadowLevel: number = bgLevel
): string {
  return `${SURFACE_HOVER_BG[clampLevel(bgLevel)]} ${SURFACE_HOVER_SHADOW[clampLevel(shadowLevel)]}`
}

/** Conventional lift above the current substrate. */
export const SURFACE_OFFSET = {
  menu: 2,
  tooltip: 2,
  dialog: 4,
} as const

/** Fixed shadow weight so a menu still reads as a menu inside a dialog. */
export const SURFACE_SHADOW_LEVEL = {
  menu: 3,
  tooltip: 3,
  dialog: 5,
} as const
