// @prometheus 0.2.0
import type { CSSProperties } from "react"

/**
 * Ordered so any three neighbours stay apart under protanopia,
 * deuteranopia and tritanopia. Past six series, encode with more than color.
 */
export const chartPalette = [
  "blue",
  "sand",
  "terracotta",
  "plum",
  "sage",
  "amber",
] as const

export type ChartColor = (typeof chartPalette)[number]

export const isChartColor = (color: string): color is ChartColor =>
  (chartPalette as readonly string[]).includes(color)

/**
 * Pastel fills, strokes, hovers, and soft tags for charts and badges.
 * Apply as a class on the element that sets `--bc-*` (or an ancestor).
 */
export const chartTokens =
  "[--bc-grid:#00000012] [--bc-ease:cubic-bezier(.3,.9,.4,1)] [--bc-ease-out:cubic-bezier(.22,1,.36,1)] [--bc-blue:#9ec0ea] [--bc-blue-edge:#6b97ce] [--bc-blue-hover:#87addd] [--bc-blue-edge-hover:#3e6da5] [--bc-blue-tag:#9ec0ea2e] [--bc-blue-text:#255184] [--bc-sand:#ece2a0] [--bc-sand-edge:#c6b85c] [--bc-sand-hover:#dace82] [--bc-sand-edge-hover:#9c8c1e] [--bc-sand-tag:#ece2a02e] [--bc-sand-text:#5b5001] [--bc-terracotta:#e39a79] [--bc-terracotta-edge:#c7693b] [--bc-terracotta-hover:#d6845e] [--bc-terracotta-edge-hover:#9a3d00] [--bc-terracotta-tag:#e39a792e] [--bc-terracotta-text:#843300] [--bc-plum:#b393cf] [--bc-plum-edge:#9065b3] [--bc-plum-hover:#a37ec2] [--bc-plum-edge-hover:#693a8b] [--bc-plum-tag:#b393cf2e] [--bc-plum-text:#643785] [--bc-sage:#b2e3cc] [--bc-sage-edge:#7abda0] [--bc-sage-hover:#99d1b7] [--bc-sage-edge-hover:#4a9274] [--bc-sage-tag:#b2e3cc2e] [--bc-sage-text:#125e44] [--bc-amber:#f4bf73] [--bc-amber-edge:#d59100] [--bc-amber-hover:#e6aa4e] [--bc-amber-edge-hover:#9e6b04] [--bc-amber-tag:#f4bf732e] [--bc-amber-text:#6c4701] dark:[--bc-grid:#ffffff14] dark:[--bc-blue:#9bc1ef4d] dark:[--bc-blue-edge:#9bc1efa6] dark:[--bc-blue-hover:#9bc1ef80] dark:[--bc-blue-edge-hover:#9bc1ef] dark:[--bc-blue-tag:#9bc1ef1a] dark:[--bc-blue-text:#9bc1ef] dark:[--bc-sand:#ede2994d] dark:[--bc-sand-edge:#ede299a6] dark:[--bc-sand-hover:#ede29980] dark:[--bc-sand-edge-hover:#ede299] dark:[--bc-sand-tag:#ede2991a] dark:[--bc-sand-text:#ede299] dark:[--bc-terracotta:#f9a7824d] dark:[--bc-terracotta-edge:#f9a782a6] dark:[--bc-terracotta-hover:#f9a78280] dark:[--bc-terracotta-edge-hover:#f9a782] dark:[--bc-terracotta-tag:#f9a7821a] dark:[--bc-terracotta-text:#f9a782] dark:[--bc-plum:#d0acf04d] dark:[--bc-plum-edge:#d0acf0a6] dark:[--bc-plum-hover:#d0acf080] dark:[--bc-plum-edge-hover:#d0acf0] dark:[--bc-plum-tag:#d0acf01a] dark:[--bc-plum-text:#d0acf0] dark:[--bc-sage:#aee4cb4d] dark:[--bc-sage-edge:#aee4cba6] dark:[--bc-sage-hover:#aee4cb80] dark:[--bc-sage-edge-hover:#aee4cb] dark:[--bc-sage-tag:#aee4cb1a] dark:[--bc-sage-text:#aee4cb] dark:[--bc-amber:#f8be684d] dark:[--bc-amber-edge:#f8be68a6] dark:[--bc-amber-hover:#f8be6880] dark:[--bc-amber-edge-hover:#f8be68] dark:[--bc-amber-tag:#f8be681a] dark:[--bc-amber-text:#f8be68]"

/**
 * Soft tag wash over an opaque surface fill. Pair with `SURFACE_BG[useSurface()]`
 * so the tint composites against the local surface, not whatever sits behind.
 */
export const chartTagWash =
  "relative overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-(--bar-tag)"

/** Maps a palette name or CSS color onto the `--bar-*` aliases charts and badges use. */
export function chartColorVars(
  color: ChartColor | (string & {}) | undefined,
  index = 0,
): CSSProperties {
  if (!color || isChartColor(color)) {
    const name = color ?? chartPalette[index % chartPalette.length]
    return {
      "--bar": `var(--bc-${name})`,
      "--bar-edge": `var(--bc-${name}-edge)`,
      "--bar-hover": `var(--bc-${name}-hover)`,
      "--bar-edge-hover": `var(--bc-${name}-edge-hover)`,
      "--bar-tag": `var(--bc-${name}-tag)`,
      "--bar-text": `var(--bc-${name}-text)`,
    } as CSSProperties
  }
  const shade = (amount: number) =>
    `color-mix(in oklab, ${color}, black ${amount}%)`
  return {
    "--bar": color,
    "--bar-edge": shade(15),
    "--bar-hover": shade(12),
    "--bar-edge-hover": shade(35),
    "--bar-tag": `color-mix(in oklab, ${color} 12%, transparent)`,
    "--bar-text": shade(55),
  } as CSSProperties
}
