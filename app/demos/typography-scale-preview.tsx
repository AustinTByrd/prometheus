"use client"

import { useState } from "react"
import { RotateCcwIcon } from "lucide-react"

import { Button } from "@/components/button"
import { TypeScaleDoc } from "@/components/typography/type-scale-doc"
import { Input } from "@/components/ui/input"
import { PROMETHEUS_TYPE_SCALE, type TypeScaleMetric } from "@/lib/type-scale"

export function TypographyScalePreview() {
  const [metric, setMetric] = useState<TypeScaleMetric>("lineHeight")
  const [showBoth, setShowBoth] = useState(false)
  const [sampleOverride, setSampleOverride] = useState("")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2 sm:max-w-sm">
          <label className="sr-only" htmlFor="type-scale-sample-input">
            Custom sample text
          </label>
          <Input
            id="type-scale-sample-input"
            onChange={(event) => setSampleOverride(event.target.value)}
            placeholder="Override sample text across all sizes..."
            value={sampleOverride}
          />
          {sampleOverride ? (
            <Button
              aria-label="Reset sample text"
              icon={RotateCcwIcon}
              onClick={() => setSampleOverride("")}
              size="sm"
              variant="ghost"
            >
              Reset
            </Button>
          ) : null}
        </div>
        <Button
          aria-pressed={showBoth}
          onClick={() => setShowBoth((prev) => !prev)}
          size="sm"
          variant="outline"
        >
          {showBoth ? "Tabbed view" : "Show both views"}
        </Button>
      </div>

      {showBoth ? (
        <div className="flex flex-col gap-6">
          <TypeScaleDoc
            metric="lineHeight"
            sampleOverride={sampleOverride}
            scale={PROMETHEUS_TYPE_SCALE}
            showTabs={false}
          />
          <TypeScaleDoc
            metric="tracking"
            sampleOverride={sampleOverride}
            scale={PROMETHEUS_TYPE_SCALE}
            showTabs={false}
          />
        </div>
      ) : (
        <TypeScaleDoc
          metric={metric}
          onMetricChange={setMetric}
          sampleOverride={sampleOverride}
          scale={PROMETHEUS_TYPE_SCALE}
        />
      )}
    </div>
  )
}
