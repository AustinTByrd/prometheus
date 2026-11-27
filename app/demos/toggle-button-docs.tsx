"use client"

import * as React from "react"
import {
  BoldIcon,
  ItalicIcon,
  StarIcon,
  UnderlineIcon,
} from "@heroicons/react/16/solid"

import {
  PlaygroundFigure,
  PlaygroundOptions,
  PlaygroundRow,
  PlaygroundStage,
} from "@/components/site/playground"
import {
  ToggleButton,
  ToggleButtonGroup,
} from "@/components/ui/toggle-button"

export function ToggleButtonStateDemo() {
  const [pressed, setPressed] = React.useState(true)

  return (
    <>
      <PlaygroundFigure code={`const [starred, setStarred] = useState(false)

<ToggleButton pressed={starred} onPressedChange={setStarred}>
  <StarIcon data-icon="inline-start" />
  {starred ? "Starred" : "Star"}
</ToggleButton>`}>
        <PlaygroundStage>
          <ToggleButton>Wrap lines</ToggleButton>
          <ToggleButton defaultPressed>Show grid</ToggleButton>
          <ToggleButton onPressedChange={setPressed} pressed={pressed}>
            <StarIcon data-icon="inline-start" />
            {pressed ? "Starred" : "Star"}
          </ToggleButton>
          <ToggleButton disabled>Disabled</ToggleButton>
        </PlaygroundStage>
      </PlaygroundFigure>
    </>
  )
}

const SIZES = [
  { value: "xs", label: "xs · 24px" },
  { value: "sm", label: "sm · 28px" },
  { value: "default", label: "default · 32px" },
  { value: "lg", label: "lg · 36px" },
] as const

type Size = (typeof SIZES)[number]["value"]

const ICON_SIZE = {
  xs: "icon-xs",
  sm: "icon-sm",
  default: "icon",
  lg: "icon-lg",
} as const satisfies Record<Size, string>

export function ToggleButtonSizeDemo() {
  const [size, setSize] = React.useState<Size>("default")
  const prop = size === "default" ? "" : ` size="${size}"`

  return (
    <>
      <PlaygroundFigure code={`<ToggleButton${prop} defaultPressed>Weekly</ToggleButton>
<ToggleButton size="${ICON_SIZE[size]}" aria-label="Favorite">
  <StarIcon />
</ToggleButton>`}>
        <PlaygroundStage>
          <ToggleButton defaultPressed size={size}>
            Weekly
          </ToggleButton>
          <ToggleButton aria-label="Favorite" size={ICON_SIZE[size]}>
            <StarIcon />
          </ToggleButton>
        </PlaygroundStage>
        <PlaygroundRow>
          <PlaygroundOptions
            label="Size"
            options={SIZES}
            value={size}
            onValueChange={setSize}
          />
        </PlaygroundRow>
      </PlaygroundFigure>
    </>
  )
}

export function ToggleButtonGroupDemo() {
  const [range, setRange] = React.useState<string[]>(["week"])
  const [marks, setMarks] = React.useState<string[]>(["bold"])

  return (
    <>
      <PlaygroundFigure code={`<ToggleButtonGroup aria-label="Range" value={range} onValueChange={setRange}>
  <ToggleButton value="day">Day</ToggleButton>
  <ToggleButton value="week">Week</ToggleButton>
  <ToggleButton value="month">Month</ToggleButton>
</ToggleButtonGroup>

<ToggleButtonGroup aria-label="Text style" multiple value={marks} onValueChange={setMarks}>
  <ToggleButton value="bold" size="icon" aria-label="Bold">
    <BoldIcon />
  </ToggleButton>
  …
</ToggleButtonGroup>`}>
        <PlaygroundStage>
          <ToggleButtonGroup
            aria-label="Range"
            onValueChange={setRange}
            value={range}
          >
            <ToggleButton value="day">Day</ToggleButton>
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            aria-label="Text style"
            multiple
            onValueChange={setMarks}
            value={marks}
          >
            <ToggleButton aria-label="Bold" size="icon" value="bold">
              <BoldIcon />
            </ToggleButton>
            <ToggleButton aria-label="Italic" size="icon" value="italic">
              <ItalicIcon />
            </ToggleButton>
            <ToggleButton aria-label="Underline" size="icon" value="underline">
              <UnderlineIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </PlaygroundStage>
      </PlaygroundFigure>
    </>
  )
}
