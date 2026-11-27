"use client"

import {
  formatRatio,
  formatTracking,
  getLineHeightRatio,
  TYPE_SCALE,
  type TypeScaleMetric,
  type TypeScaleStep,
} from "@/components/site/typography/type-scale-data"
import { cn } from "@/lib/utils"

export type TypeScaleWeight = "regular" | "medium"

const WEIGHT_VALUE: Record<TypeScaleWeight, number> = {
  regular: 400,
  medium: 500,
}

export type TypeScaleSpecimenProps = {
  metric: TypeScaleMetric
  /** Weight for body-font steps. Display steps keep the heading font's weight. */
  weight?: TypeScaleWeight
  scale?: readonly TypeScaleStep[]
  sampleOverride?: string
  activeSize?: number | null
  onActiveSizeChange?: (size: number | null) => void
  className?: string
}

/**
 * One row per step, set at its exact size, line height, and tracking. Display
 * steps use `font-display` (the heading font), so they follow the "Heading
 * font" setting. Every other step inherits the body font.
 */
export function TypeScaleSpecimen({
  metric,
  weight = "regular",
  scale = TYPE_SCALE,
  sampleOverride,
  activeSize = null,
  onActiveSizeChange,
  className,
}: TypeScaleSpecimenProps) {
  const sorted = [...scale].sort((a, b) => a.size - b.size)
  const customSample = sampleOverride?.trim()

  return (
    <div className={cn("flex w-full flex-col gap-2.5", className)}>
      {sorted.map((step) => {
        const ratio = formatRatio(getLineHeightRatio(step))
        const trackingLabel = formatTracking(step.tracking, true)
        const isActive = activeSize === step.size
        const text = customSample ? customSample : step.sample

        return (
          <div
            className="flex min-w-0 items-baseline gap-3 sm:gap-4"
            key={step.step}
            onMouseEnter={() => onActiveSizeChange?.(step.size)}
            onMouseLeave={() => onActiveSizeChange?.(null)}
          >
            <div
              className={cn(
                "flex w-[5.75rem] shrink-0 items-baseline justify-end gap-1.5 font-mono text-xs tabular-nums transition-colors sm:w-[6.75rem] sm:gap-2",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {metric === "lineHeight" ? (
                <>
                  <span>
                    {step.size} / {step.lineHeight}
                  </span>
                  <span className="font-semibold text-foreground">{ratio}</span>
                </>
              ) : (
                <>
                  <span>{step.size}px</span>
                  <span className="font-semibold text-foreground">
                    {trackingLabel}
                  </span>
                </>
              )}
            </div>

            <div
              className={cn(
                "min-w-0 flex-1 overflow-x-clip rounded-[2px] px-2 transition-colors",
                isActive ? "bg-foreground/[0.09]" : "bg-foreground/[0.045]"
              )}
            >
              <p
                className={cn(
                  "whitespace-nowrap text-foreground",
                  step.display && "font-display"
                )}
                style={{
                  ...(step.display
                    ? null
                    : { fontWeight: WEIGHT_VALUE[weight] }),
                  fontSize: `${step.size}px`,
                  lineHeight: `${step.lineHeight}px`,
                  letterSpacing: `${step.tracking}em`,
                }}
              >
                {text}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
