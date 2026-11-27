"use client"

import * as React from "react"
import { EyeIcon, EyeSlashIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid"

import {
  PlaygroundFigure,
  PlaygroundOptions,
  PlaygroundRow,
  PlaygroundStage,
} from "@/components/site/playground"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const SLOTS = [
  { value: "icon", label: "Icon" },
  { value: "text", label: "Text" },
  { value: "action", label: "Action" },
] as const

type Slot = (typeof SLOTS)[number]["value"]

const SLOT_CODE: Record<Slot, string> = {
  icon: `<Input aria-label="Search" placeholder="Search" start={<MagnifyingGlassIcon />} type="search" />`,
  text: `<Input
  aria-label="Price"
  end="USD"
  inputMode="decimal"
  placeholder="0.00"
  start="$"
/>`,
  action: `<Input
  aria-label="Password"
  end={
    <Button
      aria-label={shown ? "Hide password" : "Show password"}
      onClick={() => setShown(!shown)}
      size="icon-xs"
      variant="ghost"
    >
      {shown ? <EyeSlashIcon /> : <EyeIcon />}
    </Button>
  }
  type={shown ? "text" : "password"}
/>`,
}

function PasswordInput() {
  const [shown, setShown] = React.useState(false)

  return (
    <Input
      aria-label="Password"
      autoComplete="current-password"
      className="pr-1"
      defaultValue="correct horse"
      end={
        <Button
          aria-label={shown ? "Hide password" : "Show password"}
          onClick={() => setShown((current) => !current)}
          size="icon-xs"
          variant="ghost"
        >
          {shown ? <EyeSlashIcon /> : <EyeIcon />}
        </Button>
      }
      type={shown ? "text" : "password"}
    />
  )
}

export function InputSlotDemo() {
  const [slot, setSlot] = React.useState<Slot>("icon")

  return (
    <>
      <PlaygroundFigure code={SLOT_CODE[slot]}>
        <PlaygroundStage>
          <div className="w-full max-w-xs">
            {slot === "icon" ? (
              <Input aria-label="Search" placeholder="Search" start={<MagnifyingGlassIcon />} type="search" />
            ) : slot === "text" ? (
              <Input aria-label="Price" end="USD" inputMode="decimal" placeholder="0.00" start="$" />
            ) : (
              <PasswordInput />
            )}
          </div>
        </PlaygroundStage>
        <PlaygroundRow>
          <PlaygroundOptions label="Slot" onValueChange={setSlot} options={SLOTS} value={slot} />
        </PlaygroundRow>
      </PlaygroundFigure>
    </>
  )
}

const LABELS = [
  { value: "on", label: "Label" },
  { value: "off", label: "No label" },
] as const

const ASIDES = [
  { value: "none", label: "None" },
  { value: "Optional", label: "Optional" },
  { value: "Required", label: "Required" },
] as const

type LabelMode = (typeof LABELS)[number]["value"]
type Aside = (typeof ASIDES)[number]["value"]

export function InputLabelDemo() {
  const [labelMode, setLabelMode] = React.useState<LabelMode>("on")
  const [aside, setAside] = React.useState<Aside>("Optional")
  const labelProp = labelMode === "on" ? `\n  label="Email"` : `\n  aria-label="Email"`
  const asideProp = aside === "none" ? "" : `\n  labelAside="${aside}"`

  return (
    <>
      <PlaygroundFigure code={`<Input${labelProp}${asideProp}
  placeholder="you@example.com"
  type="email"
/>`}>
        <PlaygroundStage>
          <div className="w-full max-w-xs">
            <Input
              aria-label={labelMode === "off" ? "Email" : undefined}
              label={labelMode === "on" ? "Email" : undefined}
              labelAside={aside === "none" ? undefined : aside}
              placeholder="you@example.com"
              type="email"
            />
          </div>
        </PlaygroundStage>
        <PlaygroundRow>
          <PlaygroundOptions label="Label" onValueChange={setLabelMode} options={LABELS} value={labelMode} />
        </PlaygroundRow>
        <PlaygroundRow>
          <PlaygroundOptions label="Aside" onValueChange={setAside} options={ASIDES} value={aside} />
        </PlaygroundRow>
      </PlaygroundFigure>
    </>
  )
}

const SIZES = [
  { value: "sm", label: "sm · 28px" },
  { value: "default", label: "default · 32px" },
  { value: "lg", label: "lg · 36px" },
] as const

type Size = (typeof SIZES)[number]["value"]

export function InputSizeDemo() {
  const [size, setSize] = React.useState<Size>("default")

  return (
    <>
      <PlaygroundFigure code={`<Input size="${size}" type="email" placeholder="you@example.com" />
<Button size="${size}" variant="primary">Subscribe</Button>`}>
        <PlaygroundStage>
          <div className="flex w-full max-w-sm items-center gap-2">
            <Input aria-label="Email" placeholder="you@example.com" size={size} type="email" />
            <Button size={size} variant="primary">
              Subscribe
            </Button>
          </div>
        </PlaygroundStage>
        <PlaygroundRow>
          <PlaygroundOptions label="Size" onValueChange={setSize} options={SIZES} value={size} />
        </PlaygroundRow>
      </PlaygroundFigure>
    </>
  )
}

const VARIANTS = [
  { value: "default", label: "Default" },
  { value: "filled", label: "Filled" },
] as const

type Variant = (typeof VARIANTS)[number]["value"]

export function InputVariantDemo() {
  const [variant, setVariant] = React.useState<Variant>("filled")

  return (
    <>
      <PlaygroundFigure code={`<Input variant="${variant}" type="email" placeholder="you@example.com" />`}>
        <PlaygroundStage>
          <div className="w-full max-w-xs">
            <Input
              aria-label="Email"
              placeholder="you@example.com"
              type="email"
              variant={variant}
            />
          </div>
        </PlaygroundStage>
        <PlaygroundRow>
          <PlaygroundOptions
            label="Variant"
            onValueChange={setVariant}
            options={VARIANTS}
            value={variant}
          />
        </PlaygroundRow>
      </PlaygroundFigure>
    </>
  )
}

const STATES = [
  { value: "rest", label: "Rest" },
  { value: "invalid", label: "Invalid" },
  { value: "pending", label: "Pending" },
  { value: "readonly", label: "Read-only" },
  { value: "disabled", label: "Disabled" },
] as const

type InputStateName = (typeof STATES)[number]["value"]

const STATE_PROPS: Record<InputStateName, React.ComponentProps<typeof Input>> = {
  rest: {},
  invalid: { invalid: true },
  pending: { pending: true },
  readonly: { readOnly: true },
  disabled: { disabled: true },
}

const STATE_CODE: Record<InputStateName, string> = {
  rest: `<Input defaultValue="ada" />`,
  invalid: `<Input aria-describedby="username-error" defaultValue="ada" invalid />`,
  pending: `<Input defaultValue="ada" pending />`,
  readonly: `<Input defaultValue="ada" readOnly />`,
  disabled: `<Input defaultValue="ada" disabled />`,
}

export function InputStateDemo() {
  const [state, setState] = React.useState<InputStateName>("invalid")

  return (
    <>
      <PlaygroundFigure code={STATE_CODE[state]}>
        <PlaygroundStage>
          <div className="flex w-full max-w-xs flex-col gap-2">
            <Input
              aria-describedby={state === "invalid" ? "state-demo-error" : undefined}
              aria-label="Username"
              defaultValue="ada"
              key={state}
              {...STATE_PROPS[state]}
            />
            {state === "invalid" ? (
              <p className="text-sm text-destructive" id="state-demo-error">
                ada is taken. Try another.
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
