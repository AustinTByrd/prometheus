"use client"

import { useId, useState, type KeyboardEvent } from "react"

import { TypeScaleChart } from "@/components/typography/type-scale-chart"
import { TypeScaleSpecimen } from "@/components/typography/type-scale-specimen"
import {
  formatRatio,
  formatTracking,
  getLineHeightRatio,
  PROMETHEUS_TYPE_SCALE,
  type TypeScaleMetric,
  type TypeScaleStep,
} from "@/lib/type-scale"
import { cn } from "@/lib/utils"

const METRIC_TABS: readonly { value: TypeScaleMetric; label: string }[] = [
  { value: "lineHeight", label: "Line height" },
  { value: "tracking", label: "Letter spacing" },
]

export type TypeScaleDocProps = {
  scale?: readonly TypeScaleStep[]
  defaultMetric?: TypeScaleMetric
  metric?: TypeScaleMetric
  onMetricChange?: (metric: TypeScaleMetric) => void
  sampleOverride?: string
  showTabs?: boolean
  className?: string
}

export function TypeScaleDoc({
  scale = PROMETHEUS_TYPE_SCALE,
  defaultMetric = "lineHeight",
  metric: controlledMetric,
  onMetricChange,
  sampleOverride,
  showTabs = true,
  className,
}: TypeScaleDocProps) {
  const [uncontrolledMetric, setUncontrolledMetric] =
    useState<TypeScaleMetric>(defaultMetric)
  const [activeSize, setActiveSize] = useState<number | null>(null)
  const tabBaseId = useId()

  const activeMetric = controlledMetric ?? uncontrolledMetric
  const setMetric = (next: TypeScaleMetric) => {
    if (controlledMetric === undefined) {
      setUncontrolledMetric(next)
    }
    onMetricChange?.(next)
  }

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight" &&
      event.key !== "Home" &&
      event.key !== "End"
    ) {
      return
    }
    event.preventDefault()
    const currentIndex = METRIC_TABS.findIndex((t) => t.value === activeMetric)
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? METRIC_TABS.length - 1
          : event.key === "ArrowRight"
            ? (currentIndex + 1) % METRIC_TABS.length
            : (currentIndex - 1 + METRIC_TABS.length) % METRIC_TABS.length

    const nextTab = METRIC_TABS[nextIndex]
    setMetric(nextTab.value)
    document.getElementById(`${tabBaseId}-tab-${nextTab.value}`)?.focus()
  }

  const sorted = [...scale].sort((a, b) => a.size - b.size)

  return (
    <section
      aria-label="Typography scale"
      className={cn(
        "flex flex-col gap-6 rounded-xl border bg-card p-4 sm:p-8",
        className
      )}
    >
      {showTabs ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            aria-label="Typography scale metric"
            className="inline-flex items-center gap-1 rounded-lg bg-muted p-1"
            role="tablist"
          >
            {METRIC_TABS.map((tab) => {
              const selected = activeMetric === tab.value
              return (
                <button
                  aria-controls={`${tabBaseId}-panel`}
                  aria-selected={selected}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  id={`${tabBaseId}-tab-${tab.value}`}
                  key={tab.value}
                  onClick={() => setMetric(tab.value)}
                  onKeyDown={handleTabKeyDown}
                  role="tab"
                  tabIndex={selected ? 0 : -1}
                  type="button"
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            {activeMetric === "lineHeight"
              ? "Row bands match exact CSS line-height."
              : "Tighter tracking as display sizes grow."}
          </p>
        </div>
      ) : null}

      <div
        aria-labelledby={
          showTabs ? `${tabBaseId}-tab-${activeMetric}` : undefined
        }
        className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-12"
        id={`${tabBaseId}-panel`}
        role={showTabs ? "tabpanel" : undefined}
      >
        <TypeScaleChart
          activeSize={activeSize}
          metric={activeMetric}
          onActiveSizeChange={setActiveSize}
          scale={sorted}
        />
        <TypeScaleSpecimen
          activeSize={activeSize}
          metric={activeMetric}
          onActiveSizeChange={setActiveSize}
          sampleOverride={sampleOverride}
          scale={sorted}
        />
      </div>

      {/* Screen-reader accessible tabular representation of the scale */}
      <table className="sr-only">
        <caption>Prometheus typography scale values</caption>
        <thead>
          <tr>
            <th scope="col">Group</th>
            <th scope="col">Font size</th>
            <th scope="col">Line height</th>
            <th scope="col">Ratio</th>
            <th scope="col">Letter spacing</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((step) => (
            <tr key={step.size}>
              <td>{step.group}</td>
              <td>{step.size}px</td>
              <td>{step.lineHeight}px</td>
              <td>{formatRatio(getLineHeightRatio(step))}</td>
              <td>{formatTracking(step.tracking, true)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
