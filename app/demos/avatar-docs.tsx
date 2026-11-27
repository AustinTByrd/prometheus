"use client"

import * as React from "react"
import { CpuChipIcon, SparklesIcon } from "@heroicons/react/16/solid"

import {
  PlaygroundFigure,
  PlaygroundOptions,
  PlaygroundRow,
  PlaygroundStage,
} from "@/components/site/playground"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarStack,
  type AvatarSize,
  type AvatarStackHover,
  type AvatarStackTopmost,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

function portrait(
  bgStart: string,
  bgEnd: string,
  accent: string,
  skin: string,
  hair: string
) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${bgStart}"/>
        <stop offset="100%" stop-color="${bgEnd}"/>
      </linearGradient>
    </defs>
    <rect width="96" height="96" fill="url(#g)"/>
    <circle cx="48" cy="92" r="34" fill="${accent}"/>
    <circle cx="48" cy="40" r="19" fill="${hair}"/>
    <circle cx="48" cy="44" r="15.5" fill="${skin}"/>
    <path d="M31 41c2-11 10-16 17-16s15 5 17 16c-5-4-11-6-17-6s-12 2-17 6z" fill="${hair}"/>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const PEOPLE: readonly { name: string; src?: string }[] = [
  { name: "Ada Lovelace", src: portrait("#f59e0b", "#ea580c", "#1c1917", "#fde2c4", "#292524") },
  { name: "Grace Hopper", src: portrait("#0ea5e9", "#2563eb", "#0f172a", "#f5d0b5", "#334155") },
  { name: "Alan Turing", src: portrait("#10b981", "#0d9488", "#064e3b", "#f8d9c0", "#451a03") },
  { name: "Margaret Hamilton", src: portrait("#8b5cf6", "#6d28d9", "#1e1b4b", "#fbdcc4", "#1c1917") },
  { name: "Donald Knuth", src: portrait("#ec4899", "#db2777", "#500724", "#f3cfa9", "#57534e") },
  { name: "Barbara Liskov" },
  { name: "Edsger Dijkstra" },
]

type Backdrop = "surface" | "gradient" | "checker" | "stripes"

// Busy backdrops prove the cutouts are real transparency, not painted rings.
const BACKDROPS: Record<Backdrop, React.CSSProperties> = {
  surface: {},
  gradient: {
    backgroundImage:
      "radial-gradient(circle at 18% 22%, #fb923c 0%, transparent 48%), radial-gradient(circle at 82% 28%, #38bdf8 0%, transparent 46%), radial-gradient(circle at 52% 85%, #a855f7 0%, transparent 52%), linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)",
  },
  checker: {
    backgroundColor: "#e2e8f0",
    backgroundImage:
      "linear-gradient(45deg, #64748b 25%, transparent 25%), linear-gradient(-45deg, #64748b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #64748b 75%), linear-gradient(-45deg, transparent 75%, #64748b 75%)",
    backgroundSize: "16px 16px",
    backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
  },
  stripes: {
    backgroundImage:
      "repeating-linear-gradient(135deg, #f97316 0px, #f97316 8px, #0ea5e9 8px, #0ea5e9 16px, #10b981 16px, #10b981 24px)",
  },
}

const BACKDROP_OPTIONS = [
  { value: "surface", label: "Surface" },
  { value: "gradient", label: "Gradient" },
  { value: "checker", label: "Checker" },
  { value: "stripes", label: "Stripes" },
] as const

const TOPMOST_OPTIONS = [
  { value: "right", label: "right" },
  { value: "left", label: "left" },
] as const

const MAX_OPTIONS = [
  { value: "3", label: "max 3" },
  { value: "4", label: "max 4" },
  { value: "5", label: "max 5" },
  { value: "all", label: "All" },
] as const

const HOVER_OPTIONS = [
  { value: "none", label: "none" },
  { value: "lift", label: "lift" },
  { value: "expand", label: "expand" },
] as const

const DEFAULT_SIZE = 44

function round(value: number) {
  return Math.round(value * 10) / 10
}

export function AvatarPlaygroundDemo() {
  const [sizePx, setSizePx] = React.useState(DEFAULT_SIZE)
  const [overlap, setOverlap] = React.useState<number | null>(null)
  const [gap, setGap] = React.useState<number | null>(null)
  const [nudge, setNudge] = React.useState<number | null>(null)
  const [topmost, setTopmost] = React.useState<AvatarStackTopmost>("right")
  const [hover, setHover] = React.useState<AvatarStackHover>("lift")
  const [max, setMax] = React.useState<"3" | "4" | "5" | "all">("4")
  const [backdrop, setBackdrop] = React.useState<Backdrop>("gradient")

  const derivedOverlap = round(sizePx * 0.3)
  const derivedGap = round(sizePx / 16)
  const effectiveOverlap = overlap ?? derivedOverlap
  const effectiveGap = gap ?? derivedGap
  const derivedNudge = round((effectiveOverlap + effectiveGap) * 0.3)
  const effectiveNudge = nudge ?? derivedNudge
  const maxCount = max === "all" ? undefined : Number(max)

  const customized =
    sizePx !== DEFAULT_SIZE ||
    overlap !== null ||
    gap !== null ||
    nudge !== null

  const style = {
    "--avatar-size": `${sizePx}px`,
    ...(overlap !== null && { "--avatar-overlap": `${overlap}px` }),
    ...(gap !== null && { "--avatar-gap": `${gap}px` }),
    ...(nudge !== null && { "--avatar-nudge": `${nudge}px` }),
  } as React.CSSProperties

  const vars = [
    `"--avatar-size": "${sizePx}px"`,
    overlap !== null && `"--avatar-overlap": "${overlap}px"`,
    gap !== null && `"--avatar-gap": "${gap}px"`,
    nudge !== null && `"--avatar-nudge": "${nudge}px"`,
  ].filter(Boolean)

  const code = `<AvatarStack
  topmost="${topmost}"${maxCount !== undefined ? `\n  max={${maxCount}}` : ""}
  hover="${hover}"
  style={{ ${vars.join(", ")} }}
>
  {people.map((p) => (
    <Avatar key={p.name} name={p.name} src={p.src} />
  ))}
</AvatarStack>`

  return (
    <PlaygroundFigure code={code}>
      <div
        className="flex min-h-48 flex-col items-center justify-center gap-5 px-6 py-10"
        style={BACKDROPS[backdrop]}
      >
        <AvatarStack
          hover={hover}
          label="Project contributors"
          max={maxCount}
          style={style}
          topmost={topmost}
        >
          {PEOPLE.map((person) => (
            <Avatar key={person.name} name={person.name} src={person.src} />
          ))}
        </AvatarStack>
        <AvatarStack
          hover={hover}
          label="Initials contributors"
          max={maxCount}
          style={style}
          topmost={topmost}
        >
          {PEOPLE.map((person) => (
            <Avatar key={person.name} name={person.name} />
          ))}
        </AvatarStack>
      </div>
      <div className="grid gap-3 border-t border-border p-3 sm:grid-cols-2">
        <Slider
          formatValue={(v) => `${v}px`}
          label="--avatar-size"
          max={64}
          min={20}
          onChange={(v) => setSizePx(v as number)}
          step={1}
          value={sizePx}
        />
        <Slider
          formatValue={(v) => `${v}px`}
          label="--avatar-overlap"
          max={Math.round(sizePx * 0.6)}
          min={0}
          onChange={(v) => setOverlap(v as number)}
          step={0.5}
          value={effectiveOverlap}
        />
        <Slider
          formatValue={(v) => `${v}px`}
          label="--avatar-gap"
          max={12}
          min={0}
          onChange={(v) => setGap(v as number)}
          step={0.5}
          value={effectiveGap}
        />
        <Slider
          formatValue={(v) => `${v}px`}
          label="--avatar-nudge"
          max={20}
          min={0}
          onChange={(v) => setNudge(v as number)}
          step={0.5}
          value={effectiveNudge}
        />
      </div>
      <PlaygroundRow label="topmost">
        <PlaygroundOptions
          label="Topmost avatar"
          onValueChange={setTopmost}
          options={TOPMOST_OPTIONS}
          value={topmost}
        />
      </PlaygroundRow>
      <PlaygroundRow label="max">
        <PlaygroundOptions
          label="Overflow limit"
          onValueChange={setMax}
          options={MAX_OPTIONS}
          value={max}
        />
      </PlaygroundRow>
      <PlaygroundRow label="hover">
        <PlaygroundOptions
          label="Hover effect"
          onValueChange={setHover}
          options={HOVER_OPTIONS}
          value={hover}
        />
      </PlaygroundRow>
      <PlaygroundRow label="backdrop">
        <PlaygroundOptions
          label="Backdrop behind the stack"
          onValueChange={setBackdrop}
          options={BACKDROP_OPTIONS}
          value={backdrop}
        />
        <Button
          disabled={!customized}
          onClick={() => {
            setSizePx(DEFAULT_SIZE)
            setOverlap(null)
            setGap(null)
            setNudge(null)
          }}
          size="sm"
          variant="ghost"
        >
          Reset
        </Button>
      </PlaygroundRow>
    </PlaygroundFigure>
  )
}

const SIZE_PRESETS: readonly { preset: AvatarSize; px: number }[] = [
  { preset: "xs", px: 24 },
  { preset: "sm", px: 28 },
  { preset: "md", px: 32 },
  { preset: "lg", px: 40 },
  { preset: "xl", px: 48 },
]

export function AvatarSizesDemo() {
  return (
    <PlaygroundFigure
      code={`<Avatar size="lg" name="Ada Lovelace" src={ada} />

{/* Or size a whole subtree: every avatar inside inherits it. */}
<div className="[--avatar-size:56px]">
  <Avatar name="Grace Hopper" status="online" />
</div>`}
    >
      <PlaygroundStage className="items-end gap-6">
        {SIZE_PRESETS.map(({ preset, px }) => (
          <div className="flex flex-col items-center gap-2" key={preset}>
            <div className="flex items-center gap-2">
              <Avatar name={PEOPLE[0].name} size={preset} src={PEOPLE[0].src} />
              <Avatar name={PEOPLE[0].name} size={preset} />
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {preset} · {px}px
            </span>
          </div>
        ))}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 [--avatar-size:56px]">
            <Avatar name={PEOPLE[1].name} src={PEOPLE[1].src} status="online" />
            <Avatar name={PEOPLE[1].name} status="away" />
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            inherited 56px
          </span>
        </div>
      </PlaygroundStage>
    </PlaygroundFigure>
  )
}

export function AvatarFallbacksDemo() {
  return (
    <PlaygroundFigure
      code={`<Avatar name="Ada Lovelace" src={ada} />
<Avatar name="Broken Image" src="/missing.png" />   {/* falls back to initials */}
<Avatar fallback="LT" aria-label="Luke Tracy" />
<Avatar icon={SparklesIcon} aria-label="Assistant" />
<Avatar aria-label="Anonymous user" />

<Avatar>
  <AvatarImage alt="Alan Turing" src={turing} />
  <AvatarFallback>AT</AvatarFallback>
</Avatar>`}
    >
      <PlaygroundStage className="[--avatar-size:40px]">
        <Avatar name={PEOPLE[0].name} src={PEOPLE[0].src} />
        <Avatar name="Broken Image" src="/this-avatar-does-not-exist.png" />
        <Avatar aria-label="Luke Tracy" fallback="LT" />
        <Avatar aria-label="Assistant" icon={SparklesIcon} />
        <Avatar aria-label="Bot" icon={CpuChipIcon} />
        <Avatar aria-label="Anonymous user" />
        <Avatar>
          <AvatarImage alt={PEOPLE[2].name} src={PEOPLE[2].src} />
          <AvatarFallback>AT</AvatarFallback>
        </Avatar>
      </PlaygroundStage>
    </PlaygroundFigure>
  )
}

export function AvatarShapeStatusDemo() {
  return (
    <PlaygroundFigure
      code={`<Avatar name="Ada Lovelace" src={ada} status="online" />
<Avatar name="Grace Hopper" src={grace} shape="square" status="away" />
<Avatar name="Alan Turing" shape="square" status="busy" />
<Avatar name="Margaret Hamilton" status="offline" />`}
    >
      <PlaygroundStage className="[--avatar-size:40px]">
        <Avatar
          name={PEOPLE[0].name}
          shape="circle"
          src={PEOPLE[0].src}
          status="online"
        />
        <Avatar
          name={PEOPLE[1].name}
          shape="square"
          src={PEOPLE[1].src}
          status="away"
        />
        <Avatar name="Alan Turing" shape="square" status="busy" />
        <Avatar name="Margaret Hamilton" status="offline" />
      </PlaygroundStage>
    </PlaygroundFigure>
  )
}

export function AvatarTopmostDemo() {
  return (
    <PlaygroundFigure
      code={`<AvatarStack max={4} size="lg" topmost="right">…</AvatarStack>
<AvatarStack max={4} size="lg" topmost="left">…</AvatarStack>`}
    >
      <div className="grid sm:grid-cols-2">
        {(["right", "left"] as const).map((side) => (
          <div
            className="flex flex-col gap-4 px-6 py-8"
            key={side}
            style={BACKDROPS[side === "right" ? "gradient" : "checker"]}
          >
            <span className="w-fit rounded-md bg-black/60 px-2 py-0.5 font-mono text-xs text-white">
              topmost=&quot;{side}&quot;
            </span>
            <AvatarStack label={`${side} topmost team`} max={4} size="lg" topmost={side}>
              {PEOPLE.map((person) => (
                <Avatar key={person.name} name={person.name} src={person.src} />
              ))}
            </AvatarStack>
            <AvatarStack label={`${side} topmost initials`} max={4} size="lg" topmost={side}>
              {PEOPLE.map((person) => (
                <Avatar key={person.name} name={person.name} />
              ))}
            </AvatarStack>
          </div>
        ))}
      </div>
    </PlaygroundFigure>
  )
}
