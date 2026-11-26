"use client"

import * as React from "react"
import { BotIcon, RotateCcwIcon, SparklesIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarStack,
  type AvatarSize,
  type AvatarStackHover,
  type AvatarStackTopmost,
} from "@/components/avatar"
import { Button } from "@/components/button"
import { cn } from "@/lib/utils"

function makePortraitDataUri(
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

const DEMO_PEOPLE = [
  {
    name: "Ada Lovelace",
    src: makePortraitDataUri("#f59e0b", "#ea580c", "#1c1917", "#fde2c4", "#292524"),
  },
  {
    name: "Grace Hopper",
    src: makePortraitDataUri("#0ea5e9", "#2563eb", "#0f172a", "#f5d0b5", "#334155"),
  },
  {
    name: "Alan Turing",
    src: makePortraitDataUri("#10b981", "#0d9488", "#064e3b", "#f8d9c0", "#451a03"),
  },
  {
    name: "Margaret Hamilton",
    src: makePortraitDataUri("#8b5cf6", "#6d28d9", "#1e1b4b", "#fbdcc4", "#1c1917"),
  },
  {
    name: "Donald Knuth",
    src: makePortraitDataUri("#ec4899", "#db2777", "#500724", "#f3cfa9", "#57534e"),
  },
  {
    name: "Barbara Liskov",
    src: undefined,
  },
  {
    name: "Edsger Dijkstra",
    src: undefined,
  },
] as const

type BackdropKind = "card" | "gradient" | "checkerboard" | "stripes"

const BACKDROP_STYLES: Record<BackdropKind, React.CSSProperties> = {
  card: {},
  gradient: {
    backgroundImage:
      "radial-gradient(circle at 18% 22%, #fb923c 0%, transparent 48%), radial-gradient(circle at 82% 28%, #38bdf8 0%, transparent 46%), radial-gradient(circle at 52% 85%, #a855f7 0%, transparent 52%), linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)",
  },
  checkerboard: {
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

const SIZE_PRESETS: readonly { preset: AvatarSize; px: number }[] = [
  { preset: "xs", px: 24 },
  { preset: "sm", px: 28 },
  { preset: "md", px: 32 },
  { preset: "lg", px: 40 },
  { preset: "xl", px: 48 },
]

function SegmentedButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:text-foreground"
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}

export function AvatarDemo() {
  const [sizePx, setSizePx] = React.useState(44)
  const [customOverlap, setCustomOverlap] = React.useState<number | null>(null)
  const [customGap, setCustomGap] = React.useState<number | null>(null)
  const [customNudge, setCustomNudge] = React.useState<number | null>(null)
  const [topmost, setTopmost] = React.useState<AvatarStackTopmost>("right")
  const [hover, setHover] = React.useState<AvatarStackHover>("lift")
  const [maxCount, setMaxCount] = React.useState<number | undefined>(4)
  const [backdrop, setBackdrop] = React.useState<BackdropKind>("gradient")

  const derivedOverlap = Math.round(sizePx * 0.3 * 10) / 10
  const derivedGap = Math.round((sizePx / 16) * 10) / 10
  const effectiveOverlap = customOverlap ?? derivedOverlap
  const effectiveGap = customGap ?? derivedGap
  const derivedNudge =
    Math.round((effectiveOverlap + effectiveGap) * 0.3 * 10) / 10

  const stackStyle: React.CSSProperties = {
    ["--avatar-size" as string]: `${sizePx}px`,
    ...(customOverlap !== null
      ? { ["--avatar-overlap" as string]: `${customOverlap}px` }
      : {}),
    ...(customGap !== null
      ? { ["--avatar-gap" as string]: `${customGap}px` }
      : {}),
    ...(customNudge !== null
      ? { ["--avatar-nudge" as string]: `${customNudge}px` }
      : {}),
  }

  const hasCustomVars =
    sizePx !== 44 ||
    customOverlap !== null ||
    customGap !== null ||
    customNudge !== null

  return (
    <div className="flex w-full flex-col gap-10">
      {/* 1. Interactive Playground */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold tracking-tight">
              Interactive stack &amp; CSS variables
            </h3>
            <p className="text-xs text-muted-foreground">
              Change only{" "}
              <code className="font-mono text-foreground">--avatar-size</code>{" "}
              to scale boxes, initials, counts, overlaps, gaps, and cutout masks
              together — or override individual variables.
            </p>
          </div>
          {hasCustomVars ? (
            <Button
              icon={RotateCcwIcon}
              onClick={() => {
                setSizePx(44)
                setCustomOverlap(null)
                setCustomGap(null)
                setCustomNudge(null)
              }}
              size="xs"
              variant="ghost"
            >
              Reset vars
            </Button>
          ) : null}
        </div>

        <div
          className={cn(
            "flex min-h-40 flex-col items-center justify-center gap-5 rounded-xl border p-6 transition-colors",
            backdrop === "card" ? "bg-muted/40" : ""
          )}
          style={BACKDROP_STYLES[backdrop]}
        >
          <AvatarStack
            hover={hover}
            label="Project contributors"
            max={maxCount}
            style={stackStyle}
            topmost={topmost}
          >
            {DEMO_PEOPLE.map((person) => (
              <Avatar
                alt={person.name}
                key={person.name}
                name={person.name}
                src={person.src}
              />
            ))}
          </AvatarStack>

          <AvatarStack
            hover={hover}
            label="Initials contributors"
            max={maxCount}
            style={stackStyle}
            topmost={topmost}
          >
            {DEMO_PEOPLE.map((person) => (
              <Avatar key={person.name} name={person.name} />
            ))}
          </AvatarStack>
        </div>

        <div className="grid gap-4 rounded-xl border bg-background/60 p-4 sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5 text-xs">
              <span className="flex items-center justify-between">
                <span className="font-mono text-foreground">--avatar-size</span>
                <span className="font-mono text-muted-foreground">
                  {sizePx}px
                </span>
              </span>
              <input
                aria-label="Avatar size in pixels"
                className="accent-primary"
                max={64}
                min={20}
                onChange={(event) => setSizePx(Number(event.target.value))}
                type="range"
                value={sizePx}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-xs">
              <span className="flex items-center justify-between">
                <span className="font-mono text-foreground">
                  --avatar-overlap
                </span>
                <span className="flex items-center gap-2 font-mono text-muted-foreground">
                  {customOverlap !== null
                    ? `${customOverlap}px`
                    : `auto (${derivedOverlap}px)`}
                  {customOverlap !== null ? (
                    <button
                      className="text-[11px] text-primary underline underline-offset-2"
                      onClick={() => setCustomOverlap(null)}
                      type="button"
                    >
                      auto
                    </button>
                  ) : null}
                </span>
              </span>
              <input
                aria-label="Avatar overlap in pixels"
                className="accent-primary"
                max={Math.round(sizePx * 0.6)}
                min={0}
                onChange={(event) =>
                  setCustomOverlap(Number(event.target.value))
                }
                type="range"
                value={effectiveOverlap}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-xs">
              <span className="flex items-center justify-between">
                <span className="font-mono text-foreground">--avatar-gap</span>
                <span className="flex items-center gap-2 font-mono text-muted-foreground">
                  {customGap !== null
                    ? `${customGap}px`
                    : `auto (${derivedGap}px)`}
                  {customGap !== null ? (
                    <button
                      className="text-[11px] text-primary underline underline-offset-2"
                      onClick={() => setCustomGap(null)}
                      type="button"
                    >
                      auto
                    </button>
                  ) : null}
                </span>
              </span>
              <input
                aria-label="Avatar cutout gap in pixels"
                className="accent-primary"
                max={10}
                min={0}
                onChange={(event) => setCustomGap(Number(event.target.value))}
                step={0.5}
                type="range"
                value={effectiveGap}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-xs">
              <span className="flex items-center justify-between">
                <span className="font-mono text-foreground">
                  --avatar-nudge
                </span>
                <span className="flex items-center gap-2 font-mono text-muted-foreground">
                  {customNudge !== null
                    ? `${customNudge}px`
                    : `auto (${derivedNudge}px)`}
                  {customNudge !== null ? (
                    <button
                      className="text-[11px] text-primary underline underline-offset-2"
                      onClick={() => setCustomNudge(null)}
                      type="button"
                    >
                      auto
                    </button>
                  ) : null}
                </span>
              </span>
              <input
                aria-label="Initials nudge in pixels"
                className="accent-primary"
                max={14}
                min={0}
                onChange={(event) => setCustomNudge(Number(event.target.value))}
                step={0.5}
                type="range"
                value={customNudge ?? derivedNudge}
              />
            </label>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                topmost
              </span>
              <div className="inline-flex w-fit rounded-lg border bg-card p-0.5">
                <SegmentedButton
                  active={topmost === "right"}
                  onClick={() => setTopmost("right")}
                >
                  right (default)
                </SegmentedButton>
                <SegmentedButton
                  active={topmost === "left"}
                  onClick={() => setTopmost("left")}
                >
                  left
                </SegmentedButton>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                max overflow
              </span>
              <div className="inline-flex w-fit rounded-lg border bg-card p-0.5">
                {([3, 4, 5, undefined] as const).map((value) => (
                  <SegmentedButton
                    active={maxCount === value}
                    key={String(value)}
                    onClick={() => setMaxCount(value)}
                  >
                    {value === undefined ? "All" : `max=${value}`}
                  </SegmentedButton>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                hover (motion-safe)
              </span>
              <div className="inline-flex w-fit rounded-lg border bg-card p-0.5">
                {(["none", "lift", "expand"] as const).map((mode) => (
                  <SegmentedButton
                    active={hover === mode}
                    key={mode}
                    onClick={() => setHover(mode)}
                  >
                    {mode}
                  </SegmentedButton>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                background (transparency proof)
              </span>
              <div className="inline-flex flex-wrap rounded-lg border bg-card p-0.5">
                {(
                  [
                    ["card", "Card"],
                    ["gradient", "Gradient"],
                    ["checkerboard", "Checker"],
                    ["stripes", "Stripes"],
                  ] as const
                ).map(([kind, text]) => (
                  <SegmentedButton
                    active={backdrop === kind}
                    key={kind}
                    onClick={() => setBackdrop(kind)}
                  >
                    {text}
                  </SegmentedButton>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Size Presets & Inherited --avatar-size */}
      <section className="flex flex-col gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            Sizes (<code className="font-mono">xs</code>–
            <code className="font-mono">xl</code> &amp;{" "}
            <code className="font-mono">--avatar-size</code>)
          </h3>
          <p className="text-xs text-muted-foreground">
            Presets only set{" "}
            <code className="font-mono text-foreground">--avatar-size</code>.
            Setting it on a parent container sizes every avatar inside.
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-5 rounded-xl border bg-background/60 p-5">
          {SIZE_PRESETS.map(({ preset, px }) => (
            <div className="flex flex-col items-center gap-2" key={preset}>
              <div className="flex items-center gap-2">
                <Avatar
                  name={DEMO_PEOPLE[0].name}
                  size={preset}
                  src={DEMO_PEOPLE[0].src}
                />
                <Avatar name="Ada Lovelace" size={preset} />
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">
                {preset} ({px}px)
              </span>
            </div>
          ))}

          <div className="flex flex-col items-center gap-2 border-l pl-5">
            <div className="flex items-center gap-2 [--avatar-size:56px]">
              <Avatar
                name={DEMO_PEOPLE[1].name}
                src={DEMO_PEOPLE[1].src}
                status="online"
              />
              <Avatar name="Grace Hopper" status="away" />
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">
              inherited 56px
            </span>
          </div>
        </div>
      </section>

      {/* 3. Fallbacks, Shapes & Status */}
      <section className="flex flex-col gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            Fallbacks, shapes &amp; status badges
          </h3>
          <p className="text-xs text-muted-foreground">
            Supports images, broken-image fallback recovery, auto initials,
            custom icons, circle or rounded-square shapes, and scaled status
            dots.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-xl border bg-background/60 p-4">
            <span className="text-xs font-medium text-muted-foreground">
              Fallback modes &amp; error recovery
            </span>
            <div className="flex flex-wrap items-center gap-3 [--avatar-size:40px]">
              <Avatar
                name={DEMO_PEOPLE[0].name}
                src={DEMO_PEOPLE[0].src}
              />
              <Avatar
                name="Broken Image"
                src="/this-avatar-does-not-exist.png"
              />
              <Avatar aria-label="Luke Tracy" fallback="LT" />
              <Avatar aria-label="Assistant" icon={SparklesIcon} />
              <Avatar aria-label="Bot" icon={BotIcon} />
              <Avatar aria-label="Anonymous user" />
              <Avatar>
                <AvatarImage
                  alt={DEMO_PEOPLE[2].name}
                  src={DEMO_PEOPLE[2].src}
                />
                <AvatarFallback>AT</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border bg-background/60 p-4">
            <span className="text-xs font-medium text-muted-foreground">
              Shapes &amp; status badges
            </span>
            <div className="flex flex-wrap items-center gap-3 [--avatar-size:40px]">
              <Avatar
                name={DEMO_PEOPLE[0].name}
                shape="circle"
                src={DEMO_PEOPLE[0].src}
                status="online"
              />
              <Avatar
                name={DEMO_PEOPLE[1].name}
                shape="square"
                src={DEMO_PEOPLE[1].src}
                status="away"
              />
              <Avatar name="Alan Turing" shape="square" status="busy" />
              <Avatar name="Margaret Hamilton" status="offline" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Topmost Directions & Busy Backgrounds */}
      <section className="flex flex-col gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            Both <code className="font-mono">topmost</code> directions on busy
            backgrounds
          </h3>
          <p className="text-xs text-muted-foreground">
            True CSS <code className="font-mono text-foreground">radial-gradient</code>{" "}
            masks punch transparent gaps with zero fake borders — flipping{" "}
            <code className="font-mono text-foreground">topmost</code> flips
            both the circular bites and the crescent text nudge (including{" "}
            <code className="font-mono text-foreground">+3</code>).
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div
            className="flex flex-col gap-3 rounded-xl border p-5"
            style={BACKDROP_STYLES.gradient}
          >
            <span className="w-fit rounded-md bg-black/45 px-2 py-0.5 font-mono text-[11px] text-white backdrop-blur-xs">
              topmost=&quot;right&quot; (default)
            </span>
            <AvatarStack
              label="Right topmost team"
              max={4}
              size="lg"
              topmost="right"
            >
              {DEMO_PEOPLE.map((person) => (
                <Avatar
                  key={person.name}
                  name={person.name}
                  src={person.src}
                />
              ))}
            </AvatarStack>
            <AvatarStack
              label="Right topmost initials"
              max={4}
              size="lg"
              topmost="right"
            >
              {DEMO_PEOPLE.map((person) => (
                <Avatar key={person.name} name={person.name} />
              ))}
            </AvatarStack>
          </div>

          <div
            className="flex flex-col gap-3 rounded-xl border p-5"
            style={BACKDROP_STYLES.checkerboard}
          >
            <span className="w-fit rounded-md bg-black/65 px-2 py-0.5 font-mono text-[11px] text-white backdrop-blur-xs">
              topmost=&quot;left&quot; (flipped cuts &amp; nudge)
            </span>
            <AvatarStack
              label="Left topmost team"
              max={4}
              size="lg"
              topmost="left"
            >
              {DEMO_PEOPLE.map((person) => (
                <Avatar
                  key={person.name}
                  name={person.name}
                  src={person.src}
                />
              ))}
            </AvatarStack>
            <AvatarStack
              label="Left topmost initials"
              max={4}
              size="lg"
              topmost="left"
            >
              {DEMO_PEOPLE.map((person) => (
                <Avatar key={person.name} name={person.name} />
              ))}
            </AvatarStack>
          </div>
        </div>
      </section>
    </div>
  )
}
