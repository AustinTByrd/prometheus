"use client"

import * as React from "react"

import {
  PlaygroundFigure,
  PlaygroundOptions,
  PlaygroundRow,
} from "@/components/site/playground"
import { TypeScaleDoc } from "@/components/site/typography/type-scale-doc"
import type { TypeScaleWeight } from "@/components/site/typography/type-scale-specimen"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type View = "lineHeight" | "tracking"

const VIEW_OPTIONS = [
  { value: "lineHeight", label: "Line height" },
  { value: "tracking", label: "Letter spacing" },
] as const

const WEIGHT_OPTIONS = [
  { value: "regular", label: "Regular" },
  { value: "medium", label: "Medium" },
] as const

export function TypeScalePlayground() {
  const [view, setView] = React.useState<View>("lineHeight")
  const [weight, setWeight] = React.useState<TypeScaleWeight>("regular")
  const [sample, setSample] = React.useState("")

  return (
    <PlaygroundFigure>
      <div className="flex flex-col gap-10 p-4 sm:p-8">
        <TypeScaleDoc metric={view} sampleOverride={sample} weight={weight} />
      </div>
      <PlaygroundRow label="show">
        <PlaygroundOptions
          label="Metric"
          onValueChange={setView}
          options={VIEW_OPTIONS}
          value={view}
        />
      </PlaygroundRow>
      <PlaygroundRow label="weight">
        <PlaygroundOptions
          label="Body weight"
          onValueChange={setWeight}
          options={WEIGHT_OPTIONS}
          value={weight}
        />
      </PlaygroundRow>
      <PlaygroundRow label="sample">
        <Input
          aria-label="Custom sample text"
          onChange={(event) => setSample(event.target.value)}
          placeholder="Type to set every row to your own text"
          value={sample}
        />
        <Button
          disabled={!sample}
          onClick={() => setSample("")}
          size="sm"
          variant="ghost"
        >
          Reset
        </Button>
      </PlaygroundRow>
    </PlaygroundFigure>
  )
}
