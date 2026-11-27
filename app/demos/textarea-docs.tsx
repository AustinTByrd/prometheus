"use client"

import * as React from "react"

import {
  PlaygroundFigure,
  PlaygroundOptions,
  PlaygroundRow,
  PlaygroundStage,
} from "@/components/site/playground"
import { Textarea } from "@/components/ui/textarea"

const GROWTH = [
  { value: "2-6", label: "rows 2 · maxRows 6" },
  { value: "3-12", label: "rows 3 · maxRows 12" },
  { value: "1-4", label: "rows 1 · maxRows 4" },
] as const

type Growth = (typeof GROWTH)[number]["value"]

const STARTER =
  "The field starts at rows and grows one line at a time as the text wraps. Past maxRows it holds its height and scrolls."

export function TextareaGrowDemo() {
  const [growth, setGrowth] = React.useState<Growth>("2-6")
  const [rows, maxRows] = growth.split("-").map(Number)

  return (
    <>
      <PlaygroundFigure code={`<Textarea maxRows={${maxRows}} placeholder="Write a message" rows={${rows}} />`}>
        <PlaygroundStage>
          <div className="w-full max-w-sm">
            <Textarea
              aria-label="Message"
              defaultValue={STARTER}
              key={growth}
              maxRows={maxRows}
              placeholder="Write a message"
              rows={rows}
            />
          </div>
        </PlaygroundStage>
        <PlaygroundRow>
          <PlaygroundOptions label="Growth" onValueChange={setGrowth} options={GROWTH} value={growth} />
        </PlaygroundRow>
      </PlaygroundFigure>
    </>
  )
}

const FOOTERS = [
  { value: "characters", label: "Characters" },
  { value: "words", label: "Words" },
  { value: "handle", label: "Grab handle" },
] as const

type Footer = (typeof FOOTERS)[number]["value"]

const FOOTER_CODE: Record<Footer, string> = {
  characters: `<Textarea count="characters" maxLength={160} placeholder="A line or two about you" />`,
  words: `<Textarea count="words" maxWords={50} placeholder="Describe the issue" />`,
  handle: `<Textarea maxRows={12} placeholder="Paste the release notes" resizable rows={3} />`,
}

export function TextareaFooterDemo() {
  const [footer, setFooter] = React.useState<Footer>("characters")

  return (
    <>
      <PlaygroundFigure code={FOOTER_CODE[footer]}>
        <PlaygroundStage>
          <div className="w-full max-w-sm">
            {footer === "characters" ? (
              <Textarea
                aria-label="Bio"
                key="Bio"
                count="characters"
                defaultValue="Designer and engineer. Building calm software."
                maxLength={160}
                placeholder="A line or two about you"
              />
            ) : footer === "words" ? (
              <Textarea
                aria-label="Issue"
                key="Issue"
                count="words"
                defaultValue="The export button stays disabled after I pick a date range."
                maxWords={50}
                placeholder="Describe the issue"
              />
            ) : (
              <Textarea
                aria-label="Release notes"
                key="Release notes"
                defaultValue="Drag the bottom edge to make room. The height moves a line at a time."
                maxRows={12}
                placeholder="Paste the release notes"
                resizable
                rows={3}
              />
            )}
          </div>
        </PlaygroundStage>
        <PlaygroundRow>
          <PlaygroundOptions label="Footer" onValueChange={setFooter} options={FOOTERS} value={footer} />
        </PlaygroundRow>
      </PlaygroundFigure>
    </>
  )
}

const SIZES = [
  { value: "sm", label: "sm" },
  { value: "default", label: "default" },
  { value: "lg", label: "lg" },
] as const

type Size = (typeof SIZES)[number]["value"]

export function TextareaSizeDemo() {
  const [size, setSize] = React.useState<Size>("default")

  return (
    <>
      <PlaygroundFigure code={`<Textarea placeholder="What could be better?" size="${size}" />`}>
        <PlaygroundStage>
          <div className="w-full max-w-sm">
            <Textarea aria-label="Feedback" placeholder="What could be better?" size={size} />
          </div>
        </PlaygroundStage>
        <PlaygroundRow>
          <PlaygroundOptions label="Size" onValueChange={setSize} options={SIZES} value={size} />
        </PlaygroundRow>
      </PlaygroundFigure>
    </>
  )
}

const STATES = [
  { value: "rest", label: "Rest" },
  { value: "invalid", label: "Invalid" },
  { value: "readonly", label: "Read-only" },
  { value: "disabled", label: "Disabled" },
] as const

type TextareaStateName = (typeof STATES)[number]["value"]

const STATE_PROPS: Record<TextareaStateName, React.ComponentProps<typeof Textarea>> = {
  rest: {},
  invalid: { invalid: true },
  readonly: { readOnly: true },
  disabled: { disabled: true },
}

const STATE_CODE: Record<TextareaStateName, string> = {
  rest: `<Textarea defaultValue="Leave it at the door." />`,
  invalid: `<Textarea aria-describedby="note-error" defaultValue="Leave it at the door." invalid />`,
  readonly: `<Textarea defaultValue="Leave it at the door." readOnly />`,
  disabled: `<Textarea defaultValue="Leave it at the door." disabled />`,
}

export function TextareaStateDemo() {
  const [state, setState] = React.useState<TextareaStateName>("invalid")

  return (
    <>
      <PlaygroundFigure code={STATE_CODE[state]}>
        <PlaygroundStage>
          <div className="flex w-full max-w-sm flex-col gap-2">
            <Textarea
              aria-describedby={state === "invalid" ? "textarea-state-error" : undefined}
              aria-label="Delivery note"
              defaultValue="Leave it at the door."
              key={state}
              rows={2}
              {...STATE_PROPS[state]}
            />
            {state === "invalid" ? (
              <p className="text-sm text-destructive" id="textarea-state-error">
                Add a gate code so the courier can get in.
              </p>
            ) : null}
          </div>
        </PlaygroundStage>
        <PlaygroundRow>
          <PlaygroundOptions label="State" onValueChange={setState} options={STATES} value={state} />
        </PlaygroundRow>
      </PlaygroundFigure>
    </>
  )
}
