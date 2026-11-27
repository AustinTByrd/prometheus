// @prometheus 0.2.0
"use client"

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react"

import { cn } from "@/lib/utils"
import { SurfaceProvider, useSurface } from "@/lib/surface-context"
import { surfaceClasses } from "@/lib/surface-classes"
import {
  OVERLAY_CORNERS,
  cornersCssRadius,
  useCornerRef,
  type CornerSize,
  type SmoothCornerOptions,
} from "@/lib/smooth-corners"

export function useElevatedLevel(offset: number) {
  const substrate = useSurface()
  return Math.min(substrate + offset, 8)
}

interface ElevatedProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Steps above the current substrate.
   *
   * The panel's own level becomes `min(substrate + offset, 8)` and is
   * re-provided to descendants, so nested overlays keep climbing.
   *
   * Conventional offsets:
   * 2 — dropdown / popover / select menu / tooltip
   * 4 — dialog / modal / drawer / sheet
   */
  offset: number
  /**
   * Override for the shadow level. Defaults to the computed surface level.
   *
   * Pass a fixed value when the component should keep a constant shadow
   * regardless of depth — e.g. a dropdown always reads as shadow-surface-3
   * whether it opens on the page or inside a dialog.
   */
  shadowLevel?: number
  /**
   * Lisse smooth-corner config. Defaults to panel (`xl` / 16px, squircle, smoothing 1).
   * Pass a preset key (`"lg"`, `"xl"`, …) or a full `SmoothCornerOptions` object.
   */
  corners?: SmoothCornerOptions | CornerSize
  children?: ReactNode
}

const Elevated = forwardRef<HTMLDivElement, ElevatedProps>(
  (
    {
      offset,
      shadowLevel,
      corners = OVERLAY_CORNERS.panel,
      className,
      style,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const level = useElevatedLevel(offset)
    const ref = useCornerRef(corners, forwardedRef)

    return (
      <SurfaceProvider value={level}>
        <div
          ref={ref}
          className={cn(surfaceClasses(level, shadowLevel ?? level), className)}
          {...props}
          style={{ borderRadius: cornersCssRadius(corners), ...style }}
        >
          {children}
        </div>
      </SurfaceProvider>
    )
  }
)
Elevated.displayName = "Elevated"

export { Elevated }
export type { ElevatedProps }
