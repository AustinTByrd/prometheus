"use client"

import * as React from "react"

import {
  PlaygroundFigure,
  PlaygroundStage,
} from "@/components/site/playground"
import { Slider } from "@/components/ui/slider"

const qualityLabels = ["Draft", "Standard", "High", "Ultra", "Lossless"]

function SliderPreview({
  children,
  code,
}: {
  children: React.ReactNode
  code: string
}) {
  return (
    <>
      <PlaygroundFigure code={code}>
        <PlaygroundStage className="w-full justify-start px-8">
          <div className="flex w-full max-w-sm flex-col gap-6">{children}</div>
        </PlaygroundStage>
      </PlaygroundFigure>
    </>
  )
}

export function SliderCompactDemo() {
  const [value, setValue] = React.useState(25)

  return (
    <SliderPreview code={`<Slider size="compact" value={${value}} onChange={setValue} />`}>
      <Slider
        size="compact"
        value={value}
        onChange={(v) => setValue(v as number)}
      />
    </SliderPreview>
  )
}

export function SliderRangeDemo() {
  const [range, setRange] = React.useState<[number, number]>([25, 75])

  return (
    <SliderPreview
      code={`<Slider value={[${range[0]}, ${range[1]}]} onChange={setRange} />`}
    >
      <Slider
        value={range}
        onChange={(v) => setRange(v as [number, number])}
      />
    </SliderPreview>
  )
}

export function SliderStepsDemo() {
  const [stepped, setStepped] = React.useState(50)
  const [stepped10, setStepped10] = React.useState(50)

  return (
    <SliderPreview
      code={`<Slider value={value} onChange={setValue} step={25} showSteps />
<Slider value={value} onChange={setValue} step={10} showSteps />`}
    >
      <Slider
        value={stepped}
        onChange={(v) => setStepped(v as number)}
        step={25}
        showSteps
      />
      <Slider
        value={stepped10}
        onChange={(v) => setStepped10(v as number)}
        step={10}
        showSteps
      />
    </SliderPreview>
  )
}

export function SliderNonUniformDemo() {
  const [rating, setRating] = React.useState(0.7)

  return (
    <SliderPreview
      code={`<Slider
  value={rating}
  onChange={setRating}
  steps={[0.1, 0.5, 0.7, 1.1, 1.3]}
  showSteps
  label="Rating"
  formatValue={(v) => \`\${v} A\`}
/>`}
    >
      <Slider
        value={rating}
        onChange={(v) => setRating(v as number)}
        steps={[0.1, 0.5, 0.7, 1.1, 1.3]}
        showSteps
        label="Rating"
        formatValue={(v) => `${v} A`}
      />
    </SliderPreview>
  )
}

export function SliderValueDisplayDemo() {
  const [left, setLeft] = React.useState(40)
  const [right, setRight] = React.useState(60)
  const [tooltip, setTooltip] = React.useState(50)

  return (
    <SliderPreview
      code={`<Slider value={value} onChange={setValue} valuePosition="left" label="Volume" />
<Slider value={value} onChange={setValue} valuePosition="right" label="Volume" />
<Slider value={value} onChange={setValue} valuePosition="tooltip" />`}
    >
      <Slider
        value={left}
        onChange={(v) => setLeft(v as number)}
        valuePosition="left"
        label="Volume"
      />
      <Slider
        value={right}
        onChange={(v) => setRight(v as number)}
        valuePosition="right"
        label="Volume"
      />
      <Slider
        value={tooltip}
        onChange={(v) => setTooltip(v as number)}
        valuePosition="tooltip"
      />
    </SliderPreview>
  )
}

export function SliderFormatDemo() {
  const [formatted, setFormatted] = React.useState(75)

  return (
    <SliderPreview
      code={`<Slider
  size="compact"
  value={value}
  onChange={setValue}
  formatValue={(v) => \`\${v}%\`}
  label="Opacity"
/>`}
    >
      <Slider
        size="compact"
        value={formatted}
        onChange={(v) => setFormatted(v as number)}
        formatValue={(v) => `${v}%`}
        label="Opacity"
      />
    </SliderPreview>
  )
}

export function SliderDisabledDemo() {
  return (
    <SliderPreview
      code={`<Slider size="compact" value={50} onChange={() => {}} disabled />`}
    >
      <Slider size="compact" value={50} onChange={() => {}} disabled />
    </SliderPreview>
  )
}

export function SliderDefaultDemo() {
  const [roundness, setRoundness] = React.useState(2)

  return (
    <SliderPreview
      code={`<Slider
  label="Roundness"
  value={${roundness}}
  onChange={setRoundness}
  min={0}
  max={4}
/>`}
    >
      <Slider
        size="default"
        label="Roundness"
        value={roundness}
        onChange={(v) => setRoundness(v as number)}
        min={0}
        max={4}
      />
    </SliderPreview>
  )
}

export function SliderScrubberDemo() {
  const [volume, setVolume] = React.useState(50)

  return (
    <SliderPreview
      code={`<Slider
  variant="scrubber"
  label="Volume"
  value={${volume}}
  onChange={setVolume}
  formatValue={(v) => \`\${v}%\`}
/>`}
    >
      <Slider
        size="default"
        variant="scrubber"
        label="Volume"
        value={volume}
        onChange={(v) => setVolume(v as number)}
        min={0}
        max={100}
        formatValue={(v) => `${v}%`}
      />
    </SliderPreview>
  )
}

export function SliderDefaultFormatDemo() {
  const [quality, setQuality] = React.useState(2)

  return (
    <SliderPreview
      code={`<Slider
  label="Quality"
  value={${quality}}
  onChange={setQuality}
  min={0}
  max={4}
  formatValue={(v) => qualityLabels[v]}
/>`}
    >
      <Slider
        size="default"
        label="Quality"
        value={quality}
        onChange={(v) => setQuality(v as number)}
        min={0}
        max={4}
        formatValue={(v) => qualityLabels[v]}
      />
    </SliderPreview>
  )
}

export function SliderDefaultDisabledDemo() {
  return (
    <SliderPreview
      code={`<Slider label="Roundness" value={2} onChange={() => {}} min={0} max={4} disabled />`}
    >
      <Slider
        size="default"
        label="Roundness"
        value={2}
        onChange={() => {}}
        min={0}
        max={4}
        disabled
      />
    </SliderPreview>
  )
}
