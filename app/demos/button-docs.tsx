"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  PlusIcon,
} from "@heroicons/react/16/solid"

import {
  PlaygroundFigure,
  PlaygroundOptions,
  PlaygroundRow,
  PlaygroundStage,
} from "@/components/site/playground"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

const VARIANTS = [
  { value: "default", label: "Default" },
  { value: "primary", label: "Primary" },
  { value: "outlined", label: "Outlined" },
  { value: "ghost", label: "Ghost" },
  { value: "destructive", label: "Destructive" },
  { value: "link", label: "Link" },
] as const

type Variant = (typeof VARIANTS)[number]["value"]

export function ButtonVariantDemo() {
  const [variant, setVariant] = React.useState<Variant>("default")
  const prop = variant === "default" ? "" : ` variant="${variant}"`

  return (
    <>
      <PlaygroundFigure code={`<Button${prop}>Continue</Button>`}>
        <PlaygroundStage>
          <Button variant={variant}>Continue</Button>
        </PlaygroundStage>
        <PlaygroundRow>
          <PlaygroundOptions
            label="Variant"
            options={VARIANTS}
            value={variant}
            onValueChange={setVariant}
          />
        </PlaygroundRow>
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

export function ButtonSizeDemo() {
  const [size, setSize] = React.useState<Size>("default")
  const prop = size === "default" ? "" : ` size="${size}"`

  return (
    <>
      <PlaygroundFigure code={`<Button${prop}>Cancel</Button>
<Button${prop} variant="primary">Continue</Button>
<Button size="${ICON_SIZE[size]}" aria-label="Add">
  <PlusIcon />
</Button>`}>
        <PlaygroundStage>
          <Button size={size}>Cancel</Button>
          <Button size={size} variant="primary">
            Continue
          </Button>
          <Button aria-label="Add" size={ICON_SIZE[size]}>
            <PlusIcon />
          </Button>
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

const SHAPES = [
  { value: "square", label: "Default" },
  { value: "pill", label: "Pill" },
] as const

type Shape = (typeof SHAPES)[number]["value"]

export function ButtonPillDemo() {
  const [shape, setShape] = React.useState<Shape>("pill")
  const [size, setSize] = React.useState<Size>("default")
  const pill = shape === "pill"
  const sizeProp = size === "default" ? "" : ` size="${size}"`
  const pillProp = pill ? " pill" : ""

  return (
    <>
      <PlaygroundFigure code={`<Button${pillProp}${sizeProp}>Cancel</Button>
<Button${pillProp}${sizeProp} variant="primary">
  Continue
  <ArrowRightIcon data-icon="inline-end" />
</Button>
<Button${pillProp} size="${ICON_SIZE[size]}" aria-label="Add">
  <PlusIcon />
</Button>`}>
        <PlaygroundStage>
          <Button pill={pill} size={size}>
            Cancel
          </Button>
          <Button pill={pill} size={size} variant="primary">
            Continue
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
          <Button aria-label="Add" pill={pill} size={ICON_SIZE[size]}>
            <PlusIcon />
          </Button>
        </PlaygroundStage>
        <PlaygroundRow>
          <PlaygroundOptions
            label="Shape"
            options={SHAPES}
            value={shape}
            onValueChange={setShape}
          />
        </PlaygroundRow>
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

const ICON_PLACEMENTS = [
  { value: "only", label: "Icon only" },
  { value: "start", label: "Start" },
  { value: "end", label: "End" },
] as const

type IconPlacement = (typeof ICON_PLACEMENTS)[number]["value"]

const ICON_CODE: Record<IconPlacement, string> = {
  start: `<Button>
  <PlusIcon data-icon="inline-start" />
  New project
</Button>`,
  end: `<Button>
  New project
  <ArrowRightIcon data-icon="inline-end" />
</Button>`,
  only: `<Button size="icon" aria-label="New project">
  <PlusIcon />
</Button>`,
}

export function ButtonIconDemo() {
  const [placement, setPlacement] = React.useState<IconPlacement>("only")

  return (
    <>
      <PlaygroundFigure code={ICON_CODE[placement]}>
        <PlaygroundStage>
          {placement === "only" ? (
            <Button aria-label="New project" size="icon">
              <PlusIcon />
            </Button>
          ) : (
            <Button>
              {placement === "start" ? (
                <PlusIcon data-icon="inline-start" />
              ) : null}
              New project
              {placement === "end" ? (
                <ArrowRightIcon data-icon="inline-end" />
              ) : null}
            </Button>
          )}
        </PlaygroundStage>
        <PlaygroundRow>
          <PlaygroundOptions
            label="Icon"
            options={ICON_PLACEMENTS}
            value={placement}
            onValueChange={setPlacement}
          />
        </PlaygroundRow>
      </PlaygroundFigure>
    </>
  )
}

const STATES = [
  { value: "rest", label: "Rest" },
  { value: "disabled", label: "Disabled" },
  { value: "loading", label: "Loading" },
] as const

type State = (typeof STATES)[number]["value"]

const STATE_CODE: Record<State, string> = {
  rest: `<Button>Save changes</Button>`,
  disabled: `<Button disabled>Save changes</Button>`,
  loading: `<Button disabled>
  <Spinner data-icon="inline-start" />
  Saving
</Button>`,
}

export function ButtonStateDemo() {
  const [state, setState] = React.useState<State>("rest")

  return (
    <>
      <PlaygroundFigure code={STATE_CODE[state]}>
        <PlaygroundStage>
          <Button disabled={state !== "rest"}>
            {state === "loading" ? (
              <>
                <Spinner data-icon="inline-start" />
                Saving
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </PlaygroundStage>
        <PlaygroundRow>
          <PlaygroundOptions
            label="State"
            options={STATES}
            value={state}
            onValueChange={setState}
          />
        </PlaygroundRow>
      </PlaygroundFigure>
    </>
  )
}

export function ButtonLinkDemo() {
  return (
    <PlaygroundFigure>
      <PlaygroundStage>
        <Button nativeButton={false} render={<Link href="/foundations" />}>
          Read the foundations
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
        <Button
          nativeButton={false}
          render={<a href="https://base-ui.com" rel="noreferrer" target="_blank" />}
          variant="link"
        >
          Base UI docs
          <ArrowUpRightIcon data-icon="inline-end" />
        </Button>
      </PlaygroundStage>
    </PlaygroundFigure>
  )
}
