"use client"

import * as React from "react"
import type { CSSProperties } from "react"

import {
  PlaygroundFigure,
  PlaygroundRow,
  PlaygroundStage,
} from "@/components/site/playground"
import { Slider } from "@/components/ui/slider"
import { breakpoints } from "@/lib/breakpoints"
import { dropCapClass, typeRamp, type TypeStep } from "@/lib/typography"
import { cn } from "@/lib/utils"

function PreviewWell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl bg-background text-foreground shadow-surface-3",
        className
      )}
    >
      {children}
    </div>
  )
}

const BACKGROUNDS = [
  { label: "bg-background", className: "bg-background" },
  { label: "bg-card", className: "bg-card" },
  { label: "bg-popover", className: "bg-popover" },
  { label: "bg-secondary", className: "bg-secondary" },
  { label: "bg-muted", className: "bg-muted" },
  { label: "bg-accent", className: "bg-accent" },
  { label: "bg-primary", className: "bg-primary" },
  { label: "bg-destructive", className: "bg-destructive" },
  { label: "bg-surface-1", className: "bg-surface-1" },
  { label: "bg-surface-3", className: "bg-surface-3" },
  { label: "bg-surface-5", className: "bg-surface-5" },
] as const

const FOREGROUNDS = [
  {
    label: "text-foreground",
    className: "text-foreground",
    sample: "Important copy",
  },
  {
    label: "text-muted-foreground",
    className: "text-muted-foreground",
    sample: "Supporting text",
  },
  {
    label: "text-primary",
    className: "text-primary",
    sample: "Umber emphasis",
  },
  {
    label: "text-destructive",
    className: "text-destructive",
    sample: "Error and danger",
  },
] as const

const BOUNDARIES = [
  {
    label: "--primary",
    className: "bg-primary shadow-surface-2",
  },
  {
    label: "--ring",
    className: "bg-surface-3 ring-3 ring-ring",
  },
  {
    label: "--border",
    className: "border border-border bg-surface-3",
  },
  {
    label: "--input",
    className: "border border-input bg-surface-3",
  },
] as const

export function FoundationsBackgrounds() {
  return (
    <PreviewWell className="p-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {BACKGROUNDS.map((token) => (
          <div className="flex min-w-0 flex-col gap-2" key={token.label}>
            <div
              className={cn(
                "h-12 rounded-xl shadow-surface-2",
                token.className
              )}
            />
            <span className="truncate font-mono text-xs text-muted-foreground">
              {token.label}
            </span>
          </div>
        ))}
      </div>
    </PreviewWell>
  )
}

export function FoundationsForegrounds() {
  return (
    <PreviewWell className="flex flex-col gap-3 p-6">
      {FOREGROUNDS.map((token) => (
        <div className="flex items-baseline gap-3" key={token.label}>
          <span className={cn("text-sm font-medium", token.className)}>
            Aa · {token.sample}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {token.label}
          </span>
        </div>
      ))}
    </PreviewWell>
  )
}

export function FoundationsAccentBoundaries() {
  return (
    <PreviewWell className="p-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {BOUNDARIES.map((token) => (
          <div className="flex min-w-0 flex-col gap-2" key={token.label}>
            <div className={cn("h-12 rounded-xl", token.className)} />
            <span className="truncate font-mono text-xs text-muted-foreground">
              {token.label}
            </span>
          </div>
        ))}
      </div>
    </PreviewWell>
  )
}

const SPACE_STEPS = [4, 8, 12, 16, 24, 32] as const

const RADIUS_STEPS = [
  { label: "xs", className: "rounded-xs", size: "6px" },
  { label: "sm", className: "rounded-sm", size: "8px" },
  { label: "md", className: "rounded-md", size: "10px" },
  { label: "lg", className: "rounded-lg", size: "12px" },
  { label: "xl", className: "rounded-xl", size: "14px" },
  { label: "2xl", className: "rounded-2xl", size: "18px" },
] as const

const CONTROL_SIZES = [
  { label: "sm", className: "h-7 text-[0.8rem]", size: "28px" },
  { label: "default", className: "h-8 text-sm", size: "32px" },
  { label: "lg", className: "h-9 text-sm", size: "36px" },
] as const

function remPx(rem: string) {
  return Math.round(parseFloat(rem) * 16)
}

export function FoundationsTypeRamp() {
  return (
    <PreviewWell className="flex flex-col gap-4 p-6">
      {(Object.entries(typeRamp) as [TypeStep, (typeof typeRamp)[TypeStep]][]).map(
        ([name, step]) => (
          <div
            className="grid grid-cols-[4rem_1fr] items-baseline gap-x-4 gap-y-0.5 sm:grid-cols-[4rem_1fr_auto]"
            key={name}
          >
            <span className="font-mono text-xs text-muted-foreground">{name}</span>
            <p
              className={cn(
                "min-w-0 truncate",
                step.display ? "font-display" : "font-normal",
                step.className
              )}
            >
              The quick brown fox
            </p>
            <span className="col-start-2 text-sm text-muted-foreground">
              {step.role}
            </span>
            <span className="hidden font-mono text-xs text-muted-foreground tabular-nums sm:col-start-3 sm:row-span-2 sm:row-start-1 sm:block sm:self-center">
              {remPx(step.size)} / {remPx(step.lineHeight)}
            </span>
          </div>
        )
      )}
    </PreviewWell>
  )
}

export function FoundationsProse() {
  return (
    <PreviewWell className="p-6">
      <div className="prose">
        <h2>A section title</h2>
        <p>
          Body copy sits on the base step, inside a 65 character measure.
          Titles use Geist Serif.
        </p>
        <p>
          A second paragraph follows, with a <a href="#prose">link</a> and{" "}
          <strong>medium emphasis</strong>.
        </p>
        <ul>
          <li>Lists use the same measure.</li>
          <li>Items stay one idea each.</li>
        </ul>
      </div>
    </PreviewWell>
  )
}

export function FoundationsDropCap() {
  const [lines, setLines] = React.useState(2)

  return (
    <PlaygroundFigure>
      <PlaygroundStage className="items-stretch justify-start">
        <div
          className={cn("prose w-full", dropCapClass())}
          style={{ "--drop-cap-lines": lines } as CSSProperties}
        >
          <p>
            Once the page settles, the opening letter sinks in Geist Serif so
            the paragraph reads like a chapter start. Drag the slider below to
            change how many body lines tall the cap is — default is two, and
            you can take it as high as five. The measure stays on the prose
            step, so the sunk letter keeps its proportions against the text
            beside it while the rest of the copy wraps underneath. Later lines
            keep flowing at the base size with no extra emphasis, which is how
            a long opening stays readable when the cap is tall. Use this when a
            section needs a clear beginning without turning the whole block
            into a display title.
          </p>
        </div>
      </PlaygroundStage>
      <PlaygroundRow>
        <Slider
          className="w-full min-w-0"
          label="2"
          max={5}
          min={2}
          size="default"
          step={1}
          value={lines}
          onChange={(value) => {
            if (typeof value === "number") setLines(value)
          }}
        />
      </PlaygroundRow>
    </PlaygroundFigure>
  )
}

export function FoundationsBreakpoints() {
  const widest = breakpoints.xl.px

  return (
    <PreviewWell className="flex flex-col gap-4 p-6">
      {(
        Object.entries(breakpoints) as [
          keyof typeof breakpoints,
          (typeof breakpoints)[keyof typeof breakpoints],
        ][]
      ).map(([name, step]) => (
        <div className="grid grid-cols-[2.5rem_1fr] items-center gap-x-3 gap-y-1" key={name}>
          <span className="font-mono text-xs text-muted-foreground">{name}</span>
          <span className="h-2 overflow-hidden rounded-full bg-foreground/10">
            <span
              className="block h-2 rounded-full bg-foreground/40"
              style={{ width: `${(step.px / widest) * 100}%` }}
            />
          </span>
          <span className="col-start-2 text-sm text-muted-foreground">
            {step.rem} · {step.px}px. {step.role}
          </span>
        </div>
      ))}
    </PreviewWell>
  )
}

export function FoundationsSpacing() {
  return (
    <PreviewWell className="flex flex-wrap items-end gap-4 p-6">
      {SPACE_STEPS.map((px) => (
        <div className="flex flex-col items-center gap-2" key={px}>
          <div
            className="bg-foreground/20"
            style={{ width: px, height: px }}
          />
          <span className="font-mono text-xs text-muted-foreground">{px}</span>
        </div>
      ))}
    </PreviewWell>
  )
}

export function FoundationsControlSizes() {
  return (
    <PreviewWell className="flex flex-col gap-3 p-6">
      {CONTROL_SIZES.map((size) => (
        <div className="flex items-center gap-3" key={size.label}>
          <span
            className={cn(
              "inline-flex items-center rounded-sm bg-secondary px-2.5 font-medium text-secondary-foreground",
              size.className
            )}
          >
            {size.label}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {size.size}
          </span>
        </div>
      ))}
    </PreviewWell>
  )
}

export function FoundationsRadius() {
  return (
    <PreviewWell className="flex flex-wrap items-end gap-4 p-6">
      {RADIUS_STEPS.map((step) => (
        <div className="flex flex-col items-center gap-2" key={step.label}>
          <div
            className={cn(
              "size-14 bg-secondary shadow-surface-2",
              step.className
            )}
          />
          <span className="font-mono text-xs text-muted-foreground">
            {step.label} · {step.size}
          </span>
        </div>
      ))}
    </PreviewWell>
  )
}

export function FoundationsFocus() {
  return (
    <PreviewWell className="flex flex-wrap items-center gap-3 p-6">
      <span className="inline-flex h-8 items-center rounded-sm border border-border bg-background px-2.5 text-sm font-medium">
        Rest
      </span>
      <span className="inline-flex h-8 items-center rounded-sm border border-ring bg-background px-2.5 text-sm font-medium outline-none ring-3 ring-ring/50">
        Focus
      </span>
    </PreviewWell>
  )
}
