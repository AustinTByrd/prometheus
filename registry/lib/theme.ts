/**
 * Portable Prometheus theme extensions.
 *
 * Values live in this item’s `cssVars` (installed into the consumer CSS).
 * `--hover` / `--hover-light` derive from the host `--foreground` so Fluid Hover
 * and controls adopt the consumer palette without this app’s globals.css.
 */
export const themeTokens = {
  hover: "bg-hover",
  hoverLight: "bg-hover-light",
  active: "bg-active",
  selected: "bg-selected",
} as const
