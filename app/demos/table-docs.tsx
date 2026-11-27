"use client"

import {
  useLayoutEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react"
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  PresentationChartBarIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/16/solid"

import { CodeBlock } from "@/components/site/code-block"
import {
  createTableColumnHelper,
  DataTable,
  type ColumnSplit,
  type IconComponent,
} from "@/components/ui/table"
import { Elevated } from "@/lib/elevated"
import { cn } from "@/lib/utils"

type Person = {
  name: string
  initials: string
}

type Deal = {
  kind: "deal"
  id: string
  name: string
  amount: number
  close: string
  owner: Person
  team: Person[]
}

type Stage = {
  kind: "stage"
  id: string
  name: string
  count: number
  total: number
  icon: IconComponent
}

type Item = Deal | Stage

const amina: Person = { name: "Amina Shah", initials: "AS" }
const jonah: Person = { name: "Jonah Adler", initials: "JA" }
const priya: Person = { name: "Priya Raman", initials: "PR" }
const elena: Person = { name: "Elena Voss", initials: "EV" }
const marcus: Person = { name: "Marcus Hale", initials: "MH" }
const noah: Person = { name: "Noah Ibarra", initials: "NI" }

function deal(
  name: string,
  amount: number,
  close: string,
  owner: Person,
  team: Person[]
): Deal {
  return { kind: "deal", id: name, name, amount, close, owner, team }
}

function stage(id: string, name: string, icon: IconComponent, deals: Deal[]): Item[] {
  const total = deals.reduce((sum, item) => sum + item.amount, 0)
  return [{ kind: "stage", id, name, count: deals.length, total, icon }, ...deals]
}

const rows: Item[] = [
  ...stage("proposal", "Proposal", DocumentTextIcon, [
    deal("Tideline", 450, "27 Aug", amina, [amina, jonah]),
    deal("Bramble", 24000, "15 Oct", jonah, [jonah]),
    deal("Ashford", 52000, "29 Oct", priya, [priya, elena]),
  ]),
  ...stage("demo", "Demo", PresentationChartBarIcon, [
    deal("Fielded", 320, "12 Sept", marcus, [marcus, noah, amina]),
    deal("alvi.sh", 10000, "3 Sept", elena, [elena]),
    deal("Vesper", 18000, "22 Oct", noah, [noah, priya]),
  ]),
  ...stage("leads", "Leads", UserPlusIcon, [
    deal("Holloway", 180, "27 Sept", amina, [amina, jonah, marcus]),
    deal("Northlane", 36000, "5 Nov", priya, [priya]),
    deal("Quietwork", 12000, "12 Nov", elena, []),
  ]),
  ...stage("won", "Closed Won", CheckCircleIcon, [
    deal("Wovenpath", 125, "10 Aug", marcus, [marcus]),
    deal("Halden", 28000, "21 Sept", noah, [noah, elena]),
  ]),
]

const deals = rows.filter((row): row is Deal => row.kind === "deal")
const pipeline = deals.reduce((sum, item) => sum + item.amount, 0)

function money(value: number, style: "compact" | "column") {
  const digits = value >= 1000 ? `${Math.round(value / 1000)}k` : `${value}`
  return style === "compact" ? `$${digits}` : `USD ${digits}`
}

function Amount({ value }: { value: number }) {
  return (
    <span className="inline-grid text-right tabular-nums">
      <span
        className="col-start-1 row-start-1 text-muted-foreground"
        style={{ opacity: "calc(1 - var(--split-amount-travel, 0))" }}
      >
        {money(value, "compact")}
      </span>
      <span
        className="col-start-1 row-start-1"
        style={{ opacity: "var(--split-amount-travel, 0)" }}
      >
        {money(value, "column")}
      </span>
    </span>
  )
}

function Mark({ name }: { name: string }) {
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-[5px] bg-muted text-[10px] font-semibold text-muted-foreground uppercase">
      {name.slice(0, 1)}
    </span>
  )
}

function Avatar({ person }: { person: Person }) {
  return (
    <span
      className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[9px] font-semibold tracking-wide text-muted-foreground"
      title={person.name}
    >
      {person.initials}
    </span>
  )
}

function Team({ people }: { people: Person[] }) {
  return (
    <span className="flex items-center gap-0.5">
      {people.map((person) => (
        <Avatar key={person.name} person={person} />
      ))}
    </span>
  )
}

function StageLabel({ stage }: { stage: Stage }) {
  const Icon = stage.icon
  return (
    <>
      <Icon className="size-3.5 shrink-0 opacity-70" />
      <span className="truncate text-foreground">{stage.name}</span>
      <span className="tabular-nums">{stage.count}</span>
      <span className="ml-auto tabular-nums">{money(stage.total, "column")}</span>
    </>
  )
}

const helper = createTableColumnHelper<Item>()

const columns = helper.columns([
  helper.accessor((row) => row.name, {
    id: "name",
    header: "Deal",
    meta: { icon: BriefcaseIcon },
    cell: (info) => (
      <span className="flex min-w-0 items-center gap-2">
        <Mark name={info.row.original.name} />
        <span className="truncate">{info.row.original.name}</span>
      </span>
    ),
  }),
  helper.accessor((row) => (row.kind === "deal" ? row.amount : null), {
    id: "amount",
    header: "Amount",
    meta: { icon: CurrencyDollarIcon, align: "end" },
    cell: (info) => {
      const value = info.getValue()
      return typeof value === "number" ? <Amount value={value} /> : null
    },
  }),
  helper.accessor((row) => (row.kind === "deal" ? row.team.length || null : null), {
    id: "team",
    header: "Team",
    meta: { icon: UsersIcon },
    cell: (info) => {
      const row = info.row.original
      return row.kind === "deal" ? <Team people={row.team} /> : null
    },
  }),
  helper.accessor((row) => (row.kind === "deal" ? row.close : null), {
    id: "close",
    header: "Close",
    meta: { icon: CalendarIcon, align: "end", width: 92 },
    cell: (info) => (
      <span className="ml-auto text-muted-foreground tabular-nums">{info.getValue()}</span>
    ),
  }),
  helper.accessor((row) => (row.kind === "deal" ? row.owner.initials : null), {
    id: "owner",
    header: "Owner",
    meta: { icon: UserIcon, width: 56 },
    cell: (info) => {
      const row = info.row.original
      return row.kind === "deal" ? (
        <span className="ml-auto">
          <Avatar person={row.owner} />
        </span>
      ) : null
    },
  }),
])

const splits: ColumnSplit[] = [
  { host: "name", guest: "amount", breakpoint: 400, width: 112 },
  { host: "close", guest: "team", breakpoint: 520, width: 96, merged: "hidden" },
]

const PANEL_MIN = 300
const PANEL_START = 340
const KEY_STEP = 16
const HANDLE_WIDTH = 16

export function TableResizeDemo() {
  const frameRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const drag = useRef<{ startX: number; startWidth: number } | null>(null)

  const applyWidth = (next: number) => {
    const frame = frameRef.current?.clientWidth
    const max = Math.max(PANEL_MIN, frame == null ? next : frame - HANDLE_WIDTH)
    const width = Math.round(Math.min(max, Math.max(PANEL_MIN, next)))
    if (panelRef.current) panelRef.current.style.width = `${width}px`
    if (labelRef.current) labelRef.current.textContent = `${width}px`
    handleRef.current?.setAttribute("aria-valuenow", `${width}`)
    handleRef.current?.setAttribute("aria-valuemax", `${max}`)
  }

  const currentWidth = () =>
    panelRef.current?.getBoundingClientRect().width ?? PANEL_START

  useLayoutEffect(() => {
    applyWidth(PANEL_START)
    const frame = frameRef.current
    if (!frame) return
    const observer = new ResizeObserver(() => applyWidth(currentWidth()))
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    drag.current = { startX: event.clientX, startWidth: currentWidth() }
    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.dataset.dragging = ""
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    applyWidth(drag.current.startWidth + event.clientX - drag.current.startX)
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    drag.current = null
    delete event.currentTarget.dataset.dragging
  }

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? KEY_STEP * 4 : KEY_STEP
    if (event.key === "ArrowLeft") applyWidth(currentWidth() - step)
    else if (event.key === "ArrowRight") applyWidth(currentWidth() + step)
    else if (event.key === "Home") applyWidth(PANEL_MIN)
    else if (event.key === "End") applyWidth(Infinity)
    else return
    event.preventDefault()
  }

  return (
    <>
      <div className="w-full" ref={frameRef}>
        <div className="relative" ref={panelRef} style={{ width: PANEL_START }}>
          <Elevated className="flex flex-col overflow-hidden" offset={2} shadowLevel={2}>
            <div className="flex items-baseline gap-2 px-4 pt-3.5 pb-3">
              <span className="text-sm font-medium">Deals</span>
              <span className="text-sm text-muted-foreground tabular-nums">
                {deals.length} open · {money(pipeline, "column")}
              </span>
              <span
                className="ml-auto text-xs text-muted-foreground/70 tabular-nums"
                ref={labelRef}
              >
                {PANEL_START}px
              </span>
            </div>
            <DataTable
              className="pb-1.5 [scrollbar-gutter:auto]"
              columns={columns}
              data={rows}
              groupRow={(item) => (item.kind === "stage" ? <StageLabel stage={item} /> : null)}
              splits={splits}
            />
          </Elevated>
          <div
            aria-label="Resize the table"
            aria-orientation="vertical"
            aria-valuemin={PANEL_MIN}
            aria-valuenow={PANEL_START}
            className={cn(
              "group/grip absolute inset-y-0 left-full flex w-4 cursor-ew-resize touch-none items-center justify-center rounded-sm outline-none",
              "focus-visible:ring-3 focus-visible:ring-ring/50"
            )}
            onKeyDown={onKeyDown}
            onPointerCancel={onPointerUp}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            ref={handleRef}
            role="separator"
            tabIndex={0}
          >
            <span className="h-8 w-1 rounded-full bg-border transition-[height,background-color] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/grip:h-10 group-hover/grip:bg-muted-foreground/40 group-focus-visible/grip:bg-muted-foreground/40 group-data-dragging/grip:h-12 group-data-dragging/grip:bg-muted-foreground/60 motion-reduce:transition-none" />
          </div>
        </div>
      </div>
      <CodeBlock>{`<DataTable columns={columns} data={deals} splits={splits} />`}</CodeBlock>
    </>
  )
}
