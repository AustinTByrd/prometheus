// @prometheus 0.2.0

/**
 * Variable-font weight tokens for `fontVariationSettings`. Pairs `wght` with
 * `opsz` so weight changes keep advance width nearly constant (Inter-style).
 */
export const fontWeights = {
  normal: "'wght' 400, 'opsz' 14",
  semibold: "'wght' 550, 'opsz' 18",
  bold: "'wght' 700, 'opsz' 25",
} as const
