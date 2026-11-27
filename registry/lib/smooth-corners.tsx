// @prometheus 0.2.0
"use client"

import {
  useCallback,
  useMemo,
  useState,
  type Ref,
  type RefCallback,
  type RefObject,
} from "react"
import { cornerOptionsToBorderRadius } from "@lisse/core"
import {
  SmoothCorners,
  useSmoothCorners,
  type CornerConfig,
  type SmoothCornerOptions,
  type UseEffectsOptions,
} from "@lisse/react"

/** Prometheus default: Lisse squircle at full smoothing. */
export const SQUIRCLE = {
  curve: "squircle",
  smoothing: 1,
} as const satisfies Pick<CornerConfig, "curve" | "smoothing">

function corner(radius: number): CornerConfig {
  return { radius, ...SQUIRCLE }
}

/**
 * Radius presets aligned to Prometheus `--radius*` tokens
 * (`--radius: 0.75rem` → lg = 12px).
 *
 * Always Lisse squircle with smoothing `1`.
 */
export const CORNERS = {
  xs: corner(6),
  sm: corner(8),
  md: corner(10),
  lg: corner(12),
  xl: corner(14),
  "2xl": corner(18),
} as const satisfies Record<string, CornerConfig>

export type CornerSize = keyof typeof CORNERS

/** Conventional sizes used by Prometheus overlays. */
export const OVERLAY_CORNERS = {
  menu: CORNERS.lg,
  tooltip: CORNERS.sm,
  dialog: CORNERS.xl,
  panel: CORNERS.xl,
} as const

export type EdgeSide = "top" | "right" | "bottom" | "left"

function resolveCorner(value: number | CornerConfig): number | CornerConfig {
  if (typeof value === "number") {
    return value === 0 ? 0 : corner(value)
  }
  return {
    ...SQUIRCLE,
    ...value,
    curve: value.curve ?? SQUIRCLE.curve,
    smoothing: value.smoothing ?? SQUIRCLE.smoothing,
  }
}

/** Apply squircle + smoothing 1 unless the caller overrides them. */
export function resolveCorners(
  options: SmoothCornerOptions | CornerSize
): SmoothCornerOptions {
  if (typeof options === "string") return CORNERS[options]
  if ("radius" in options) {
    return resolveCorner(options) as CornerConfig
  }
  return {
    topLeft:
      options.topLeft !== undefined ? resolveCorner(options.topLeft) : undefined,
    topRight:
      options.topRight !== undefined
        ? resolveCorner(options.topRight)
        : undefined,
    bottomRight:
      options.bottomRight !== undefined
        ? resolveCorner(options.bottomRight)
        : undefined,
    bottomLeft:
      options.bottomLeft !== undefined
        ? resolveCorner(options.bottomLeft)
        : undefined,
  }
}

/**
 * CSS `border-radius` that approximates a Lisse preset for SSR / first paint.
 * Lisse clears the inline value once the clip-path is ready; keep
 * `[data-slot=smooth-corners][data-state=ready] { border-radius: 0 }` so a
 * later React render can't put the fallback back and square the squircle.
 */
export function cornersCssRadius(
  corners: SmoothCornerOptions | CornerSize = OVERLAY_CORNERS.panel
): string {
  return cornerOptionsToBorderRadius(resolveCorners(corners))
}

/**
 * Round only the free edge of a sheet/drawer that docks to the viewport.
 * e.g. `side="right"` → smooth top-left + bottom-left.
 */
export function edgeCorners(
  side: EdgeSide,
  size: CornerConfig | CornerSize | number = OVERLAY_CORNERS.dialog
): SmoothCornerOptions {
  const cornerValue: number | CornerConfig =
    typeof size === "string"
      ? CORNERS[size]
      : typeof size === "number"
        ? corner(size)
        : resolveCorner(size)
  const flat = 0
  switch (side) {
    case "top":
      return {
        topLeft: flat,
        topRight: flat,
        bottomRight: cornerValue,
        bottomLeft: cornerValue,
      }
    case "right":
      return {
        topLeft: cornerValue,
        topRight: flat,
        bottomRight: flat,
        bottomLeft: cornerValue,
      }
    case "bottom":
      return {
        topLeft: cornerValue,
        topRight: cornerValue,
        bottomRight: flat,
        bottomLeft: flat,
      }
    case "left":
      return {
        topLeft: flat,
        topRight: cornerValue,
        bottomRight: cornerValue,
        bottomLeft: flat,
      }
  }
}

export function composeRefs<T>(
  ...refs: Array<Ref<T> | undefined>
): RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (!ref) continue
      if (typeof ref === "function") {
        ref(node)
      } else {
        ref.current = node
      }
    }
  }
}

function cornersKey(corners: SmoothCornerOptions | CornerSize): string {
  return typeof corners === "string" ? corners : JSON.stringify(corners)
}

/**
 * Apply Lisse smooth corners to an existing element.
 *
 * Prefer this over `<SmoothCorners>` for Base UI popups and any element that
 * must stay the direct layout / focus target.
 */
export function useCorners(
  ref: RefObject<HTMLElement | null>,
  corners: SmoothCornerOptions | CornerSize = OVERLAY_CORNERS.panel,
  effectsOptions?: UseEffectsOptions
) {
  const key = cornersKey(corners)
  const resolved = useMemo(() => resolveCorners(corners), [key, corners])
  const fallbackBorderRadius = useMemo(
    () => cornerOptionsToBorderRadius(resolved),
    [resolved]
  )
  useSmoothCorners(ref, resolved, {
    ...effectsOptions,
    fallbackBorderRadius:
      effectsOptions?.fallbackBorderRadius ?? fallbackBorderRadius,
  })
}

/**
 * Local ref + optional forwarded ref, already wired to `useCorners`.
 * Drop `ref` onto the target element. Also set `style.borderRadius` to
 * `cornersCssRadius(...)` during render so SSR / first paint aren't square.
 */
export function useCornerRef<T extends HTMLElement>(
  corners: SmoothCornerOptions | CornerSize = OVERLAY_CORNERS.panel,
  forwardedRef?: Ref<T>,
  effectsOptions?: UseEffectsOptions
) {
  // Popups mount their element after the component, so Lisse has to re-attach
  // whenever the node changes. A fresh ref object per node triggers that.
  const [node, setNode] = useState<T | null>(null)
  const nodeRef = useMemo(() => ({ current: node }), [node])
  const key = cornersKey(corners)
  const fallbackBorderRadius = useMemo(
    () => cornersCssRadius(corners),
    [key, corners]
  )
  useCorners(nodeRef, corners, effectsOptions)
  const ref = useCallback(
    (el: T | null) => {
      // Approximate radius until clip-path lands (cleared when data-state=ready).
      if (el) el.style.borderRadius = fallbackBorderRadius
      setNode(el)
      if (!forwardedRef) return
      if (typeof forwardedRef === "function") {
        forwardedRef(el)
      } else {
        forwardedRef.current = el
      }
    },
    [forwardedRef, fallbackBorderRadius]
  )
  return ref
}

export { SmoothCorners, useSmoothCorners }
export type { CornerConfig, SmoothCornerOptions, UseEffectsOptions }
