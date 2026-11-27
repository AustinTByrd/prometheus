"use client"

import { useState } from "react"

import { TypeScaleChart } from "@/components/site/typography/type-scale-chart"
import {
  formatRatio,
  formatTracking,
  getLineHeightRatio,
  TYPE_SCALE,
  type TypeScaleMetric,
  type TypeScaleStep,
} from "@/components/site/typography/type-scale-data"
import {
  TypeScaleSpecimen,
  type TypeScaleWeight,
} from "@/components/site/typography/type-scale-specimen"
import { cn } from "@/lib/utils"

export type TypeScaleDocProps = {
  metric: TypeScaleMetric
  weight?: TypeScaleWeight
  scale?: readonly TypeScaleStep[]
  sampleOverride?: string
  className?: string
}

/** A curve beside its specimens, with hover synced between the two. */
export function TypeScaleDoc({
  metric,
  weight,
  scale = TYPE_SCALE,
  sampleOverride,
  className,
}: TypeScaleDocProps) {
  const [activeSize, setActiveSize] = useState<number | null>(null)
  const sorted = [...scale].sort((a, b) => a.size - b.size)

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col gap-8">
        <TypeScaleChart
          activeSize={activeSize}
          metric={metric}
          onActiveSizeChange={setActiveSize}
          scale={sorted}
        />
        <TypeScaleSpecimen
          activeSize={activeSize}
          metric={metric}
          onActiveSizeChange={setActiveSize}
          sampleOverride={sampleOverride}
          scale={sorted}
          weight={weight}
        />
      </div>

      {/* Screen-reader accessible tabular representation of the scale */}
      <table className="sr-only">
        <caption>Prometheus type ramp</caption>
        <thead>
          <tr>
            <th scope="col">Step</th>
            <th scope="col">Font size</th>
            <th scope="col">Line height</th>
            <th scope="col">Ratio</th>
            <th scope="col">Letter spacing</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((step) => (
            <tr key={step.step}>
              <td>{step.className}</td>
              <td>{step.size}px</td>
              <td>{step.lineHeight}px</td>
              <td>{formatRatio(getLineHeightRatio(step))}</td>
              <td>{formatTracking(step.tracking, true)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
