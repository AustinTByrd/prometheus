"use client"

import {
  formatRatio,
  formatTracking,
  getLineHeightRatio,
  PROMETHEUS_TYPE_SCALE,
  type TypeScaleMetric,
  type TypeScaleStep,
} from "@/lib/type-scale"
import { cn } from "@/lib/utils"

export type TypeScaleSpecimenProps = {
  metric: TypeScaleMetric
  scale?: readonly TypeScaleStep[]
  sampleOverride?: string
  activeSize?: number | null
  onActiveSizeChange?: (size: number | null) => void
  className?: string
}

export function TypeScaleSpecimen({
  metric,
  scale = PROMETHEUS_TYPE_SCALE,
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
            key={step.size}
            onMouseEnter={() => onActiveSizeChange?.(step.size)}
            onMouseLeave={() => onActiveSizeChange?.(null)}
          >
            <div
              className={cn(
                "flex w-[5.75rem] shrink-0 items-baseline justify-end gap-1.5 text-xs tabular-nums transition-colors sm:w-[6.75rem] sm:gap-2",
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
                className="whitespace-nowrap text-foreground"
                style={{
                  fontSize: `${step.size}px`,
                  lineHeight: `${step.lineHeight}px`,
                  letterSpacing: `${step.tracking}em`,
                  fontWeight: step.weight,
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
