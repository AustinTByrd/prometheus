// @prometheus 0.2.0

/**
 * Viewport widths. Theme variables `--breakpoint-*` are the same widths in
 * rem (a 16px root). Below `md`, usePrometheus().isMobile is true.
 */
export const breakpoints = {
  sm: {
    px: 640,
    rem: "40rem",
    role: "Stacked controls become a row.",
  },
  md: {
    px: 768,
    rem: "48rem",
    role: "App frame. Below this, the sidebar is a sheet.",
  },
  lg: {
    px: 1024,
    rem: "64rem",
    role: "A side navigation fits beside the page.",
  },
  xl: {
    px: 1280,
    rem: "80rem",
    role: "A second rail fits beside the page.",
  },
} as const

export type Breakpoint = keyof typeof breakpoints
