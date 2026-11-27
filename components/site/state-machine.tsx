"use client"

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react"
import { ChevronRightIcon } from "@heroicons/react/16/solid"

import { Button } from "@/components/ui/button"
import { Elevated } from "@/lib/elevated"
import { duration, ease } from "@/lib/motion"
import type { Machine, MachineState, MachineTransition } from "@/lib/state-machines"
import { cn } from "@/lib/utils"

export function useMachine(
  machine: Machine,
  options: { timers?: boolean; state?: string } = {}
) {
  const { timers = true, state: controlled } = options
  const [internal, setInternal] = useState(machine.initial)
  const [last, setLast] = useState<MachineTransition | null>(null)
  const state = controlled ?? internal
  const stateRef = useRef(state)
  stateRef.current = state
  const previous = useRef(controlled)

  useEffect(() => {
    if (controlled === undefined) return
    const from = previous.current
    previous.current = controlled
    if (from === undefined || from === controlled) return
    setLast(
      machine.transitions.find((item) => item.from === from && item.to === controlled) ?? null
    )
  }, [controlled, machine])

  const take = useCallback((transition: MachineTransition) => {
    if (transition.from !== stateRef.current) return
    stateRef.current = transition.to
    setInternal(transition.to)
    setLast(transition)
  }, [])

  const send = useCallback(
    (event: string, guard?: string) => {
      const transition = machine.transitions.find(
        (item) =>
          item.from === stateRef.current &&
          item.event === event &&
          (guard === undefined || item.guard === guard)
      )
      if (transition) take(transition)
      return transition
    },
    [machine, take]
  )

  const reset = useCallback(() => {
    stateRef.current = machine.initial
    setInternal(machine.initial)
    setLast(null)
  }, [machine])

  useEffect(() => {
    if (!timers || controlled !== undefined) return
    const auto = machine.transitions.find(
      (item) => item.from === state && item.after !== undefined
    )
    if (!auto) return
    const timeout = window.setTimeout(() => take(auto), auto.after)
    return () => window.clearTimeout(timeout)
  }, [state, timers, controlled, machine, take])

  return { state, last, send, take, reset }
}

const CELL_W = 200
const CELL_H = 92
const NODE_W = 112
const NODE_H = 34
const TOP = 26
const LINE = 11
const CHAR_W = 5.8

type Point = { x: number; y: number }

/** Machines are authored left to right; the diagram stacks them top to bottom to fit the column. */
function centerOf(state: MachineState): Point {
  return {
    x: state.at[1] * CELL_W + CELL_W / 2,
    y: state.at[0] * CELL_H + CELL_H / 2 + TOP,
  }
}

function Label({
  lines,
  x,
  y,
  anchor,
  grow,
  className,
}: {
  lines: string[]
  x: number
  y: number
  anchor: "start" | "middle" | "end"
  /** up stacks lines above y, down below it, center around it. */
  grow: "up" | "down" | "center"
  className: string
}) {
  const first =
    grow === "up"
      ? y - (lines.length - 1) * LINE
      : grow === "down"
        ? y + LINE * 0.8
        : y - ((lines.length - 1) * LINE) / 2 + LINE * 0.35
  return (
    <text
      className={className}
      paintOrder="stroke"
      stroke="var(--card)"
      strokeWidth={4}
      textAnchor={anchor}
    >
      {lines.map((line, index) => (
        <tspan key={line} x={x} y={first + index * LINE}>
          {line}
        </tspan>
      ))}
    </text>
  )
}

function edgeOfBox(center: Point, toward: Point): Point {
  const dx = toward.x - center.x
  const dy = toward.y - center.y
  if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return center
  const scale = Math.min(
    Math.abs(dx) > 0.01 ? (NODE_W / 2 + 3) / Math.abs(dx) : Infinity,
    Math.abs(dy) > 0.01 ? (NODE_H / 2 + 3) / Math.abs(dy) : Infinity
  )
  return { x: center.x + dx * scale, y: center.y + dy * scale }
}

function distanceToSegment(point: Point, a: Point, b: Point) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const length = dx * dx + dy * dy || 1
  const t = Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / length))
  return Math.hypot(point.x - (a.x + t * dx), point.y - (a.y + t * dy))
}

type Edge = {
  key: string
  from: MachineState
  to: MachineState
  events: string[]
  transitions: MachineTransition[]
}

function edgesOf(machine: Machine) {
  const byKey = new Map<string, Edge>()
  for (const transition of machine.transitions) {
    const key = `${transition.from}->${transition.to}`
    const from = machine.states.find((state) => state.id === transition.from)
    const to = machine.states.find((state) => state.id === transition.to)
    if (!from || !to) continue
    const edge = byKey.get(key) ?? { key, from, to, events: [], transitions: [] }
    if (!edge.events.includes(transition.event)) edge.events.push(transition.event)
    edge.transitions.push(transition)
    byKey.set(key, edge)
  }
  return [...byKey.values()]
}

type LabelSpot = { x: number; y: number; anchor: "start" | "middle" | "end"; grow: "up" | "down" | "center" }

type Placed = { edge: Edge; d: string; label: LabelSpot }

type Box = { x: number; y: number; w: number; h: number }

function boxOf(spot: LabelSpot, lines: string[]): Box {
  const w = Math.max(...lines.map((line) => line.length)) * CHAR_W
  const h = lines.length * LINE
  const x = spot.anchor === "start" ? spot.x : spot.anchor === "end" ? spot.x - w : spot.x - w / 2
  const y = spot.grow === "up" ? spot.y - h + 3 : spot.grow === "down" ? spot.y : spot.y - h / 2
  return { x, y, w, h }
}

function overlaps(a: Box, b: Box) {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h
}

function spotBeside(point: Point, normal: Point, gap: number): LabelSpot {
  if (Math.abs(normal.x) >= Math.abs(normal.y)) {
    return {
      x: point.x + Math.sign(normal.x || 1) * gap,
      y: point.y,
      anchor: normal.x >= 0 ? "start" : "end",
      grow: "center",
    }
  }
  return {
    x: point.x,
    y: point.y + (normal.y > 0 ? gap - 1 : -gap + 1),
    anchor: "middle",
    grow: normal.y > 0 ? "down" : "up",
  }
}

function place(machine: Machine, edges: Edge[]): Placed[] {
  const keys = new Set(edges.map((edge) => edge.key))
  const taken: Box[] = machine.states.map((item) => {
    const center = centerOf(item)
    return { x: center.x - NODE_W / 2 - 2, y: center.y - NODE_H / 2 - 2, w: NODE_W + 4, h: NODE_H + 4 }
  })
  const settle = (lines: string[], candidates: LabelSpot[]) => {
    const spot =
      candidates.find((item) => {
        const box = boxOf(item, lines)
        return !taken.some((other) => overlaps(box, other))
      }) ?? candidates[0]
    taken.push(boxOf(spot, lines))
    return spot
  }

  return edges.map((edge) => {
    const a = centerOf(edge.from)

    if (edge.from.id === edge.to.id) {
      const crowded = machine.states.some(
        (item) => item.at[0] === edge.from.at[0] && item.at[1] === edge.from.at[1] + 1
      )
      const side = crowded ? -1 : 1
      const x = a.x + side * (NODE_W / 2)
      return {
        edge,
        d: `M ${x + side * 2} ${a.y - 8} C ${x + side * 36} ${a.y - 26}, ${x + side * 36} ${a.y + 26}, ${x + side * 4} ${a.y + 8}`,
        label: settle(edge.events, [
          { x: x + side * 34, y: a.y, anchor: crowded ? "end" : "start", grow: "center" },
        ]),
      }
    }

    const b = centerOf(edge.to)
    const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
    const length = Math.hypot(b.x - a.x, b.y - a.y) || 1
    let normal = { x: -(b.y - a.y) / length, y: (b.x - a.x) / length }
    const blocked = machine.states.some(
      (item) =>
        item.id !== edge.from.id &&
        item.id !== edge.to.id &&
        distanceToSegment(centerOf(item), a, b) < NODE_H
    )
    const reverse = keys.has(`${edge.to.id}->${edge.from.id}`)
    if (!reverse && Math.abs(normal.x) > Math.abs(normal.y) && normal.x < 0) {
      normal = { x: -normal.x, y: -normal.y }
    }
    const bend = blocked ? 46 : reverse ? 14 : 0
    const control = { x: mid.x + normal.x * bend, y: mid.y + normal.y * bend }
    const start = edgeOfBox(a, bend ? control : b)
    const end = edgeOfBox(b, bend ? control : a)
    const pointAt = (t: number) => ({
      x: (1 - t) ** 2 * start.x + 2 * t * (1 - t) * control.x + t ** 2 * end.x,
      y: (1 - t) ** 2 * start.y + 2 * t * (1 - t) * control.y + t ** 2 * end.y,
    })
    const away = { x: -normal.x, y: -normal.y }
    const sides = bend ? [normal] : [normal, away]
    const candidates = [0.5, 0.38, 0.62, 0.28, 0.72].flatMap((t) =>
      sides.map((side) => spotBeside(pointAt(t), side, 6))
    )
    if (bend) {
      candidates.push(...[0.5, 0.35, 0.65].map((t) => spotBeside(pointAt(t), away, 6)))
    }

    return {
      edge,
      d: `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`,
      label: settle(edge.events, candidates),
    }
  })
}

function Diagram({
  machine,
  state,
  last,
  onTake,
}: {
  machine: Machine
  state: string
  last: MachineTransition | null
  onTake?: (transition: MachineTransition) => void
}) {
  const arrow = useId().replace(/:/g, "")
  const cols = Math.max(...machine.states.map((item) => item.at[1])) + 1
  const rows = Math.max(...machine.states.map((item) => item.at[0])) + 1
  const placed = place(machine, edgesOf(machine))
  let minX = 0
  let maxX = cols * CELL_W
  for (const { edge, label } of placed) {
    const wide = Math.max(...edge.events.map((event) => event.length)) * CHAR_W
    const left = label.anchor === "start" ? 0 : label.anchor === "end" ? wide : wide / 2
    minX = Math.min(minX, label.x - left - 4)
    maxX = Math.max(maxX, label.x - left + wide + 4)
  }
  const width = maxX - minX
  const height = rows * CELL_H + TOP
  const lastKey = last ? `${last.from}->${last.to}` : null
  const initial = machine.states.find((item) => item.id === machine.initial)
  const start = initial ? centerOf(initial) : null
  const transition = `stroke ${duration.standard}ms ${ease.standard}, fill ${duration.standard}ms ${ease.standard}, opacity ${duration.standard}ms ${ease.standard}`

  return (
    <svg
      aria-hidden
      className="w-full"
      style={{ maxWidth: width }}
      viewBox={`${minX} 0 ${width} ${height}`}
    >
      <defs>
        <marker
          id={`${arrow}-tip`}
          markerHeight="8"
          markerUnits="userSpaceOnUse"
          markerWidth="8"
          orient="auto"
          refX="7"
          refY="4"
          viewBox="0 0 8 8"
        >
          <path d="M 0 0 L 8 4 L 0 8 z" fill="context-stroke" />
        </marker>
      </defs>

      {start ? (
        <g>
          <circle cx={start.x} cy={start.y - NODE_H / 2 - 20} fill="var(--muted-foreground)" r={3.5} />
          <line
            markerEnd={`url(#${arrow}-tip)`}
            stroke="var(--muted-foreground)"
            strokeWidth={1.25}
            x1={start.x}
            x2={start.x}
            y1={start.y - NODE_H / 2 - 16}
            y2={start.y - NODE_H / 2 - 3}
          />
        </g>
      ) : null}

      {placed.map(({ edge, d, label }) => {
        const outgoing = edge.from.id === state
        const taken = edge.key === lastKey
        const stroke = taken
          ? "var(--foreground)"
          : outgoing
            ? "var(--muted-foreground)"
            : "color-mix(in oklab, var(--muted-foreground) 35%, transparent)"
        const clickable = outgoing && onTake && edge.transitions.length === 1
        const fire = () => {
          const only = edge.transitions[0]
          if (clickable && only) onTake(only)
        }
        return (
          <g key={edge.key} onClick={fire}>
            <path
              d={d}
              fill="none"
              markerEnd={`url(#${arrow}-tip)`}
              stroke={stroke}
              strokeWidth={taken ? 1.75 : 1.25}
              style={{ transition }}
            />
            <Label
              anchor={label.anchor}
              className={cn(
                "font-mono text-[9.5px] tracking-tight",
                taken || outgoing ? "fill-foreground" : "fill-muted-foreground",
                clickable && "cursor-pointer"
              )}
              grow={label.grow}
              lines={edge.events}
              x={label.x}
              y={label.y}
            />
          </g>
        )
      })}

      {machine.states.map((item) => {
        const center = centerOf(item)
        const current = item.id === state
        return (
          <g key={item.id}>
            <rect
              fill={current ? "var(--foreground)" : "var(--muted)"}
              height={NODE_H}
              rx={10}
              stroke={current ? "var(--foreground)" : "var(--border)"}
              style={{ transition }}
              width={NODE_W}
              x={center.x - NODE_W / 2}
              y={center.y - NODE_H / 2}
            />
            <text
              className={cn(
                "text-xs font-medium",
                current ? "fill-background" : "fill-foreground"
              )}
              dominantBaseline="central"
              style={{ transition }}
              textAnchor="middle"
              x={center.x}
              y={center.y}
            >
              {item.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function StateMachineView({
  machine,
  state,
  last,
  onTake,
  onReset,
  children,
}: {
  machine: Machine
  state: string
  last: MachineTransition | null
  /** Omit when the live preview owns every transition. */
  onTake?: (transition: MachineTransition) => void
  onReset?: () => void
  /** Live preview driven by, and driving, the machine. */
  children?: ReactNode
}) {
  const current = machine.states.find((item) => item.id === state)
  const outgoing = machine.transitions.filter((item) => item.from === state)
  const labelOf = (id: string) => machine.states.find((item) => item.id === id)?.label ?? id

  return (
    <Elevated className="flex flex-col gap-5 rounded-2xl p-5" offset={2} shadowLevel={2}>
      {children ? (
        <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-border px-4 py-6">
          {children}
        </div>
      ) : null}

      <div className="flex justify-center px-2">
        <Diagram last={last} machine={machine} onTake={onTake} state={state} />
      </div>

      <div className="flex flex-col gap-4 border-t border-border pt-4">
        {onTake ? (
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">Events</span>
            <div className="flex flex-wrap gap-1.5">
              {outgoing.map((item) => (
                <Button
                  key={`${item.event}-${item.guard ?? ""}-${item.to}`}
                  onClick={() => onTake(item)}
                  size="sm"
                  title={item.detail}
                >
                  <span className="font-mono text-xs">{item.event}</span>
                  {item.guard ? (
                    <span className="text-muted-foreground">{item.guard}</span>
                  ) : null}
                </Button>
              ))}
              {onReset ? (
                <Button onClick={onReset} size="sm" variant="ghost">
                  Reset
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-xs text-muted-foreground">State</span>
          <span className="text-sm font-medium">{current?.label}</span>
          <span className="text-sm text-muted-foreground">{current?.detail}</span>
          <p aria-live="polite" className="pt-1 text-xs text-muted-foreground">
            {last ? (
              <>
                <code className="font-mono text-foreground">{last.event}</code>
                {" took "}
                {labelOf(last.from)} to {labelOf(last.to)}. {last.detail}
              </>
            ) : (
              "Starts here."
            )}
          </p>
        </div>
      </div>

      <details className="group text-sm">
        <summary className="flex w-fit cursor-pointer list-none items-center gap-1 text-xs text-muted-foreground select-none [&::-webkit-details-marker]:hidden">
          <ChevronRightIcon className="size-3.5 transition-transform duration-(--duration-fast) ease-(--ease-standard) group-open:rotate-90" />
          All {machine.transitions.length} transitions
        </summary>
        <div className="overflow-x-auto pt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-1.5 pr-3 font-medium" scope="col">From</th>
                <th className="py-1.5 pr-3 font-medium" scope="col">Event</th>
                <th className="py-1.5 pr-3 font-medium" scope="col">To</th>
                <th className="py-1.5 font-medium" scope="col">What happens</th>
              </tr>
            </thead>
            <tbody>
              {machine.transitions.map((item, index) => (
                <tr
                  className={cn(
                    "border-b border-border/60 align-top",
                    item.from === state ? "text-foreground" : "text-muted-foreground"
                  )}
                  key={index}
                >
                  <td className="py-1.5 pr-3">{labelOf(item.from)}</td>
                  <td className="py-1.5 pr-3">
                    <code className="font-mono">{item.event}</code>
                    {item.guard ? <span className="block">{item.guard}</span> : null}
                  </td>
                  <td className="py-1.5 pr-3">{labelOf(item.to)}</td>
                  <td className="py-1.5">
                    {item.detail}
                    {item.after !== undefined ? ` Fires on its own after ${item.after}ms.` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </Elevated>
  )
}

export function ManualMachine({ machine }: { machine: Machine }) {
  const { state, last, take, reset } = useMachine(machine)
  return (
    <StateMachineView
      last={last}
      machine={machine}
      onReset={reset}
      onTake={take}
      state={state}
    />
  )
}
