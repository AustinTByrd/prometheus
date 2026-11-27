"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon, XMarkIcon } from "@heroicons/react/16/solid"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Elevated } from "@/lib/elevated"
import {
  SURFACE_BG,
  surfaceClasses,
} from "@/lib/surface-classes"
import { SurfaceProvider } from "@/lib/surface-context"
import { cn } from "@/lib/utils"

const DARK_HEX = [
  "#1C1918",
  "#24211F",
  "#2C2926",
  "#33302D",
  "#3A3734",
  "#413E3B",
  "#484542",
  "#4F4C49",
] as const

const LIGHT_HEX = [
  "#F7F6F2",
  "#FBFBF9",
  "#FFFFFF",
  "#FFFFFF",
  "#FFFFFF",
  "#FFFFFF",
  "#FFFFFF",
  "#FFFFFF",
] as const

const ROLES = [
  {
    value: "owner",
    label: "Workspace owner",
    description: "Can change workspace settings and invite new members",
  },
  {
    value: "member",
    label: "Member",
    description: "Can't change workspace settings or invite new members",
  },
  {
    value: "restricted",
    label: "Restricted member",
    description: "Can only see and edit content they created",
  },
] as const

const MENU_ITEMS = ["Favorites", "Recents", "Private"] as const

function useModeHexes() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return LIGHT_HEX
  return resolvedTheme === "dark" ? DARK_HEX : LIGHT_HEX
}

function PreviewWell({
  children,
  className,
  theme,
  inspect,
  onInspectChange,
}: {
  children: React.ReactNode
  className?: string
  theme?: "light" | "dark"
  inspect?: boolean
  onInspectChange?: (value: boolean) => void
}) {
  return (
    <div
      className={
        theme === "dark" ? "dark" : theme === "light" ? "light" : undefined
      }
    >
      <div className="overflow-hidden rounded-2xl bg-surface-1 text-foreground shadow-surface-3">
        {onInspectChange ? (
          <div className="flex h-9 items-center justify-end px-3">
            <button
              aria-pressed={inspect}
              className={cn(
                "rounded-md px-2 py-1 text-xs font-medium",
                inspect
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => onInspectChange(!inspect)}
              type="button"
            >
              Inspect
            </button>
          </div>
        ) : null}
        <div className={cn("relative", className)}>{children}</div>
      </div>
    </div>
  )
}

function Swatch({ hex, label }: { hex: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className="size-2.5 rounded-full ring-1 ring-foreground/20"
        style={{ backgroundColor: hex }}
      />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono text-foreground/80">{hex}</span>
    </div>
  )
}

function InspectCallout({
  hex,
  label,
  color,
  className,
  arrow,
}: {
  hex: string
  label: string
  color: string
  className?: string
  arrow: "se" | "w"
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute z-10 flex flex-col text-xs leading-tight",
        className
      )}
      style={{ color }}
    >
      <span className="font-medium">{label}</span>
      <span className="font-mono tabular-nums">{hex}</span>
      {arrow === "se" ? (
        <span
          className="ml-3 mt-1 h-8 w-14 border-b border-l"
          style={{ borderColor: color }}
        />
      ) : (
        <span
          className="mt-1 mr-1 h-px w-10 self-end"
          style={{ backgroundColor: color }}
        />
      )}
    </div>
  )
}

function RoleMenu({
  value,
  onChange,
  className,
}: {
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <div className={cn("flex flex-col p-1", className)} role="menu">
      {ROLES.map((role) => {
        const selected = role.value === value
        return (
          <button
            aria-checked={selected}
            className={cn(
              "flex flex-col items-start rounded-md px-2 py-1.5 text-left",
              selected ? "bg-foreground/10" : "hover:bg-hover"
            )}
            key={role.value}
            onClick={() => onChange(role.value)}
            role="menuitemradio"
            type="button"
          >
            <span className="flex w-full items-center justify-between gap-2 text-sm">
              {role.label}
              {selected ? <CheckIcon className="size-3.5" /> : null}
            </span>
            <span className="text-xs text-muted-foreground">
              {role.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function InviteDialog({
  menuClassName,
  panelClassName,
  menuStyle,
  panelStyle,
}: {
  menuClassName: string
  panelClassName: string
  menuStyle?: React.CSSProperties
  panelStyle?: React.CSSProperties
}) {
  const [role, setRole] = React.useState("member")
  const current = ROLES.find((item) => item.value === role) ?? ROLES[1]

  return (
    <div
      className={cn("relative w-[min(100%,20rem)] rounded-xl p-4", panelClassName)}
      style={panelStyle}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-foreground/10 text-xs font-medium">
            M
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium">Invite to your workspace</p>
          </div>
        </div>
        <span className="text-muted-foreground">
          <XMarkIcon className="size-4" />
        </span>
      </div>
      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5 text-sm">
          Email
          <Input placeholder="email@gmail.com, email2@gmail.com..." readOnly />
        </label>
        <div className="flex flex-col gap-1.5">
          <p className="text-sm">Select role</p>
          <button
            className="flex h-8 w-full items-center justify-between rounded-lg border border-input px-2.5 text-sm"
            type="button"
          >
            {current.label}
            <ChevronDownIcon className="size-4 text-muted-foreground" />
          </button>
          <div className={cn("rounded-lg", menuClassName)} style={menuStyle}>
            <RoleMenu onChange={setRole} value={role} />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button size="sm" variant="ghost">
            Cancel
          </Button>
          <Button disabled size="sm">
            Send invites
          </Button>
        </div>
      </div>
    </div>
  )
}

export function SurfacesProblemDemo() {
  const [inspect, setInspect] = React.useState(true)
  const hexes = useModeHexes()
  const sameFill = hexes[4]

  return (
    <PreviewWell
      className="flex min-h-[28rem] items-center justify-center p-8"
      inspect={inspect}
      onInspectChange={setInspect}
    >
      {inspect ? (
        <>
          <InspectCallout
            arrow="se"
            className="left-5 top-4"
            color="#5B8DEF"
            hex={hexes[0]}
            label="Page background"
          />
          <InspectCallout
            arrow="w"
            className="right-5 top-[42%]"
            color="#E5484D"
            hex={sameFill}
            label="Dialog"
          />
          <InspectCallout
            arrow="w"
            className="bottom-16 right-5"
            color="#E5484D"
            hex={sameFill}
            label="Role dropdown"
          />
        </>
      ) : null}
      <InviteDialog
        menuClassName="shadow-surface-3"
        menuStyle={{ backgroundColor: sameFill }}
        panelClassName="shadow-surface-5"
        panelStyle={{ backgroundColor: sameFill }}
      />
    </PreviewWell>
  )
}

export function SurfacesTokensDemo() {
  return (
    <div className="flex flex-col gap-3">
      <PreviewWell className="flex flex-col gap-4 p-6" theme="dark">
        <p className="text-xs font-medium text-muted-foreground">Dark</p>
        <div className="flex flex-wrap gap-3">
          {DARK_HEX.map((hex, index) => {
            const level = index + 1
            return (
              <div className="flex flex-col items-center gap-2" key={`dark-${level}`}>
                <div
                  className={cn("size-14 rounded-xl", surfaceClasses(level))}
                  title={hex}
                />
                <span className="text-xs text-muted-foreground">{level}</span>
              </div>
            )
          })}
        </div>
      </PreviewWell>
      <PreviewWell className="flex flex-col gap-4 p-6" theme="light">
        <p className="text-xs font-medium text-muted-foreground">Light</p>
        <div className="flex flex-wrap gap-3">
          {LIGHT_HEX.map((hex, index) => {
            const level = index + 1
            return (
              <div className="flex flex-col items-center gap-2" key={`light-${level}`}>
                <div
                  className={cn("size-14 rounded-xl", surfaceClasses(level))}
                  title={hex}
                />
                <span className="text-xs text-muted-foreground">{level}</span>
              </div>
            )
          })}
        </div>
      </PreviewWell>
    </div>
  )
}

function DemoMenu() {
  const [selected, setSelected] = React.useState<(typeof MENU_ITEMS)[number]>(
    "Favorites"
  )

  return (
    <Elevated className="w-40 rounded-lg p-1" offset={2} role="menu" shadowLevel={3}>
      {MENU_ITEMS.map((item) => (
        <button
          aria-checked={selected === item}
          className={cn(
            "flex w-full rounded-md px-2 py-1.5 text-left text-sm",
            selected === item ? "bg-foreground/10" : "hover:bg-hover"
          )}
          key={item}
          onClick={() => setSelected(item)}
          role="menuitemradio"
          type="button"
        >
          {item}
        </button>
      ))}
    </Elevated>
  )
}

function SubstrateColumn({
  title,
  substrate,
}: {
  title: string
  substrate: number
}) {
  const hexes = useModeHexes()
  const menuLevel = Math.min(substrate + 2, 8)

  return (
    <div className="flex min-w-40 flex-1 flex-col gap-3">
      <p className="text-xs font-medium">{title}</p>
      <SurfaceProvider value={substrate}>
        <div
          className={cn(
            "flex min-h-44 items-start justify-center rounded-xl p-4",
            SURFACE_BG[substrate]
          )}
        >
          <DemoMenu />
        </div>
      </SurfaceProvider>
      <div className="flex flex-col gap-1.5">
        <Swatch hex={hexes[substrate - 1]} label="BG" />
        <Swatch hex={hexes[menuLevel - 1]} label="Menu" />
        <p className="text-xs text-muted-foreground">Hover +6%</p>
        <p className="text-xs text-muted-foreground">Selected +10%</p>
      </div>
    </div>
  )
}

export function SurfacesSubstrateDemo() {
  return (
    <PreviewWell className="p-6">
      <div className="flex flex-col gap-6 sm:flex-row">
        <SubstrateColumn substrate={1} title="On the page" />
        <SubstrateColumn substrate={3} title="Inside a popover" />
        <SubstrateColumn substrate={5} title="Inside a dialog" />
      </div>
    </PreviewWell>
  )
}

export function SurfacesElevatedDemo() {
  return (
    <PreviewWell className="p-8">
      <SurfaceProvider value={1}>
        <div className="flex flex-col gap-3">
          <p className="text-xs text-muted-foreground">Page</p>
          <Elevated className="rounded-2xl p-5" offset={1}>
            <p className="text-xs text-muted-foreground">Card</p>
            <Elevated className="mt-4 rounded-xl p-5" offset={2} shadowLevel={3}>
              <p className="text-xs text-muted-foreground">Popover</p>
              <Elevated
                className="mt-4 rounded-lg p-4"
                offset={2}
                shadowLevel={3}
              >
                <p className="text-xs text-muted-foreground">Menu</p>
              </Elevated>
            </Elevated>
          </Elevated>
        </div>
      </SurfaceProvider>
    </PreviewWell>
  )
}

function LevelRangeSlider({
  min,
  max,
  onChange,
}: {
  min: number
  max: number
  onChange: (min: number, max: number) => void
}) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const dragging = React.useRef<"min" | "max" | null>(null)

  const levelFromClientX = React.useCallback((clientX: number) => {
    const track = trackRef.current
    if (!track) return 1
    const rect = track.getBoundingClientRect()
    const t = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    return Math.round(t * 7) + 1
  }, [])

  const move = React.useCallback(
    (clientX: number) => {
      const next = levelFromClientX(clientX)
      const thumb = dragging.current
      if (thumb === "min") onChange(Math.min(next, max), max)
      if (thumb === "max") onChange(min, Math.max(next, min))
    },
    [levelFromClientX, max, min, onChange]
  )

  React.useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging.current) return
      move(event.clientX)
    }
    const onPointerUp = () => {
      dragging.current = null
    }
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
    }
  }, [move])

  const minPct = ((min - 1) / 7) * 100
  const maxPct = ((max - 1) / 7) * 100

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {min} — {max}
        </span>
      </div>
      <div className="px-1.5">
        <div
          className="relative h-6 cursor-pointer"
          onPointerDown={(event) => {
            const next = levelFromClientX(event.clientX)
            const distMin = Math.abs(next - min)
            const distMax = Math.abs(next - max)
            dragging.current = distMin <= distMax ? "min" : "max"
            move(event.clientX)
          }}
          ref={trackRef}
        >
          <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-foreground/15" />
          <div
            className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-foreground/40"
            style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
          />
          {Array.from({ length: 8 }, (_, index) => (
            <span
              className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/30"
              key={index}
              style={{ left: `${(index / 7) * 100}%` }}
            />
          ))}
          <button
            aria-label="Minimum surface"
            aria-orientation="horizontal"
            aria-valuemax={max}
            aria-valuemin={1}
            aria-valuenow={min}
            className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground shadow-sm"
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowUp") {
                event.preventDefault()
                onChange(Math.min(max, min + 1), max)
              } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
                event.preventDefault()
                onChange(Math.max(1, min - 1), max)
              } else if (event.key === "Home") {
                event.preventDefault()
                onChange(1, max)
              } else if (event.key === "End") {
                event.preventDefault()
                onChange(max, max)
              }
            }}
            onPointerDown={(event) => {
              event.stopPropagation()
              dragging.current = "min"
            }}
            role="slider"
            style={{ left: `${minPct}%` }}
            type="button"
          />
          <button
            aria-label="Maximum surface"
            aria-orientation="horizontal"
            aria-valuemax={8}
            aria-valuemin={min}
            aria-valuenow={max}
            className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground shadow-sm"
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowUp") {
                event.preventDefault()
                onChange(min, Math.min(8, max + 1))
              } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
                event.preventDefault()
                onChange(min, Math.max(min, max - 1))
              } else if (event.key === "Home") {
                event.preventDefault()
                onChange(min, min)
              } else if (event.key === "End") {
                event.preventDefault()
                onChange(min, 8)
              }
            }}
            onPointerDown={(event) => {
              event.stopPropagation()
              dragging.current = "max"
            }}
            role="slider"
            style={{ left: `${maxPct}%` }}
            type="button"
          />
        </div>
      </div>
    </div>
  )
}

const LEVEL_LADDER = 8
const LEVEL_INSET = 20
const LEVEL_INNER = 64
const LEVEL_CANVAS = LEVEL_INNER + (LEVEL_LADDER - 1) * LEVEL_INSET * 2

function levelSize(level: number) {
  return LEVEL_INNER + (LEVEL_LADDER - level) * LEVEL_INSET * 2
}

export function SurfacesLevelsDemo() {
  const [min, setMin] = React.useState(1)
  const [max, setMax] = React.useState(4)
  const levels = Array.from({ length: max - min + 1 }, (_, index) => min + index)

  return (
    <PreviewWell className="flex flex-col items-center gap-8 p-8">
      <div
        className="flex w-full items-center justify-center"
        style={{ height: LEVEL_CANVAS }}
      >
        <div className="relative" style={{ width: LEVEL_CANVAS, height: LEVEL_CANVAS }}>
          {levels.map((level) => {
            const size = levelSize(level)
            return (
              <div
                className={cn(
                  "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl",
                  surfaceClasses(level)
                )}
                key={level}
                style={{ width: size, height: size }}
              >
                <p className="absolute inset-x-0 top-0.5 text-center text-xs text-muted-foreground">
                  surface-{level}
                </p>
              </div>
            )
          })}
        </div>
      </div>
      <LevelRangeSlider
        max={max}
        min={min}
        onChange={(nextMin, nextMax) => {
          setMin(nextMin)
          setMax(nextMax)
        }}
      />
    </PreviewWell>
  )
}

export function SurfacesInviteDemo() {
  return (
    <PreviewWell className="flex min-h-[32rem] items-center justify-center p-8">
      <SurfaceProvider value={1}>
        <Elevated className="w-[min(100%,20rem)] rounded-xl p-4" offset={4} shadowLevel={5}>
          <InviteDialogContents />
        </Elevated>
      </SurfaceProvider>
    </PreviewWell>
  )
}

function InviteDialogContents() {
  const [role, setRole] = React.useState("member")
  const current = ROLES.find((item) => item.value === role) ?? ROLES[1]

  return (
    <>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-foreground/10 text-xs font-medium">
            M
          </span>
          <p className="text-sm font-medium">Invite to your workspace</p>
        </div>
        <span className="text-muted-foreground">
          <XMarkIcon className="size-4" />
        </span>
      </div>
      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5 text-sm">
          Email
          <Input placeholder="email@gmail.com, email2@gmail.com..." readOnly />
        </label>
        <div className="flex flex-col gap-1.5">
          <p className="text-sm">Select role</p>
          <button
            className="flex h-8 w-full items-center justify-between rounded-lg border border-input px-2.5 text-sm"
            type="button"
          >
            {current.label}
            <ChevronDownIcon className="size-4 text-muted-foreground" />
          </button>
          <Elevated className="rounded-lg" offset={2} shadowLevel={3}>
            <RoleMenu onChange={setRole} value={role} />
          </Elevated>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button size="sm" variant="ghost">
            Cancel
          </Button>
          <Button disabled size="sm">
            Send invites
          </Button>
        </div>
      </div>
    </>
  )
}
