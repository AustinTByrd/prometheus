"use client"

import * as React from "react"

import {
  PlaygroundFigure,
  PlaygroundStage,
} from "@/components/site/playground"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel } from "@/components/ui/field"

export function CheckboxDemo() {
  const [accepted, setAccepted] = React.useState(false)
  const [partial, setPartial] = React.useState(true)

  return (
    <>
      <PlaygroundFigure code={`<Field orientation="horizontal">
  <Checkbox id="terms" checked={accepted} onCheckedChange={setAccepted} />
  <FieldLabel htmlFor="terms">Accept terms and conditions</FieldLabel>
</Field>`}>
        <PlaygroundStage className="flex-col items-start gap-4">
          <Field orientation="horizontal">
            <Checkbox
              checked={accepted}
              id="terms"
              onCheckedChange={setAccepted}
            />
            <FieldLabel htmlFor="terms">Accept terms and conditions</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              checked={false}
              id="partial"
              indeterminate={partial}
              onCheckedChange={(next) => {
                setPartial(false)
                if (next) setAccepted(true)
              }}
            />
            <FieldLabel htmlFor="partial">Some selected</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox disabled id="disabled" />
            <FieldLabel htmlFor="disabled">Disabled</FieldLabel>
          </Field>
        </PlaygroundStage>
      </PlaygroundFigure>
    </>
  )
}
