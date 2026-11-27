// @prometheus 0.2.0

/** Durations in milliseconds. */
export const duration = {
  /** Reduced-motion fades. */
  instant: 120,
  /** Small state changes, and a placeholder leaving. */
  fast: 160,
  /** Exits. Quicker than an entrance. */
  exit: 180,
  /** Content arriving, panels, menus. */
  standard: 240,
  /** Rare, introductory reveals. */
  considered: 480,
} as const

/** CSS easing functions. */
export const ease = {
  /** Elements arriving. Soft settle, no overshoot. */
  enter: "cubic-bezier(0.16, 1, 0.3, 1)",
  /** Default for color, opacity, and small fades. */
  standard: "cubic-bezier(0.22, 1, 0.36, 1)",
  /** Elements leaving. Accelerates away. */
  exit: "cubic-bezier(0.7, 0, 0.84, 0)",
} as const

/**
 * Height and layout. Visual duration 0.4s, bounce 0.
 * Critically damped, so the value never passes the target.
 */
export const spring = {
  smooth: { visualDuration: 0.4, bounce: 0 },
} as const

/** How far arriving content rises, in pixels. */
export const rise = 4

const HEIGHT_ROOT = (2 * Math.PI) / (spring.smooth.visualDuration * 1.2)
const HEIGHT_STIFFNESS = HEIGHT_ROOT * HEIGHT_ROOT
/** Radians per millisecond. Bounce 0 keeps this critically damped. */
const HEIGHT_OMEGA = Math.sqrt(HEIGHT_STIFFNESS) / 1000

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Critically damped height spring (`spring.smooth`).
 * `stop` cancels the frame without calling `onComplete`.
 */
export function springHeight(
  from: number,
  to: number,
  onFrame: (value: number) => void,
  onComplete: () => void
) {
  const delta = to - from
  const rest = Math.abs(delta) < 5 ? 0.005 : 0.5
  const started = performance.now()
  let raf = 0
  let stopped = false

  const tick = (now: number) => {
    if (stopped) return
    const t = now - started
    const value =
      to - Math.exp(-HEIGHT_OMEGA * t) * (delta + HEIGHT_OMEGA * delta * t)
    if (Math.abs(to - value) <= rest || t > 800) {
      onFrame(to)
      onComplete()
      return
    }
    onFrame(value)
    raf = requestAnimationFrame(tick)
  }

  raf = requestAnimationFrame(tick)
  return {
    stop() {
      stopped = true
      cancelAnimationFrame(raf)
    },
  }
}
