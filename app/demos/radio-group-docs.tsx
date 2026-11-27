"use client"

import * as React from "react"

import {
  PlaygroundFigure,
  PlaygroundStage,
} from "@/components/site/playground"
import { RadioGroup, RadioItem } from "@/components/ui/radio-group"

const options = ["Option A", "Option B", "Option C", "Option D"]

export function RadioGroupDemo() {
  const [selected, setSelected] = React.useState(1)

  return (
    <>
      <PlaygroundFigure code={`const [selected, setSelected] = useState(1)

<RadioGroup selectedIndex={selected}>
  {options.map((label, index) => (
    <RadioItem
      key={label}
      index={index}
      label={label}
      selected={selected === index}
      onSelect={() => setSelected(index)}
    />
  ))}
</RadioGroup>`}>
        <PlaygroundStage>
          <RadioGroup selectedIndex={selected}>
            {options.map((label, index) => (
              <RadioItem
                index={index}
                key={label}
                label={label}
                onSelect={() => setSelected(index)}
                selected={selected === index}
              />
            ))}
          </RadioGroup>
        </PlaygroundStage>
      </PlaygroundFigure>
    </>
  )
}
