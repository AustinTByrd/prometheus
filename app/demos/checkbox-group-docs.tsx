"use client"

import * as React from "react"

import {
  PlaygroundFigure,
  PlaygroundStage,
} from "@/components/site/playground"
import {
  CheckboxGroup,
  CheckboxItem,
} from "@/components/ui/checkbox-group"

const items = ["Apples", "Bananas", "Cherries", "Dates", "Elderberries"]

export function CheckboxGroupDemo() {
  const [checked, setChecked] = React.useState<Set<number>>(new Set([0, 1]))

  const toggle = (index: number) => {
    setChecked((previous) => {
      const next = new Set(previous)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <>
      <PlaygroundFigure code={`const [checked, setChecked] = useState(new Set([0, 1]))

<CheckboxGroup checkedIndices={checked}>
  {items.map((label, index) => (
    <CheckboxItem
      key={label}
      index={index}
      label={label}
      checked={checked.has(index)}
      onToggle={() => toggle(index)}
    />
  ))}
</CheckboxGroup>`}>
        <PlaygroundStage>
          <CheckboxGroup checkedIndices={checked}>
            {items.map((label, index) => (
              <CheckboxItem
                checked={checked.has(index)}
                index={index}
                key={label}
                label={label}
                onToggle={() => toggle(index)}
              />
            ))}
          </CheckboxGroup>
        </PlaygroundStage>
      </PlaygroundFigure>
    </>
  )
}
