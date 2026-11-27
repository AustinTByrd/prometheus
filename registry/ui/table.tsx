// @prometheus 0.2.0
"use client"

import {
  useCallback,
  useLayoutEffect,
  useRef,
  type ReactNode,
  type CSSProperties,
  type RefObject,
} from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import {
  createColumnHelper,
  metaHelper,
  tableFeatures,
  useTable,
  type Cell,
  type ColumnDef,
  type Header,
  type RowData,
} from "@tanstack/react-table"

import { FluidHoverHighlight, useFluidHover } from "@/lib/fluid-hover"
import { SURFACE_BG } from "@/lib/surface-classes"
import { useSurface } from "@/lib/surface-context"
import { cn } from "@/lib/utils"

/**
 * How far (px) before a breakpoint a merged value starts leaning toward the
 * column it will join, and how far after a breakpoint a split value starts
 * pulling back. Too small and the snap fights the pointer. Too large and the
 * columns never feel like they click.
 */
const MAGNET_ZONE = 72
/** Share of the trip the value covers while it is still attached. The rest is the snap. */
const STRAIN = 0.3
const SNAP_MS = 140
const GIVE_PX = 7
/** Width changes larger than this skip the lean and land on the new layout. */
const JUMP_PX = 480

export type IconComponent = (props: { className?: string; style?: CSSProperties }) => ReactNode

export type TableColumnMeta = {
  icon?: IconComponent
  align?: "start" | "end"
  /** Fixed track width for columns that do not split. Splitting columns use `ColumnSplit.width`. */
  width?: number
}

const dataTableFeatures = tableFeatures({
  columnMeta: metaHelper<TableColumnMeta>(),
})

export type DataTableFeatures = typeof dataTableFeatures

export function createTableColumnHelper<TData extends RowData>() {
  return createColumnHelper<DataTableFeatures, TData>()
}

export type ColumnSplit = {
  /** Column the guest sits inside while the container is narrow. */
  host: string
  /** Column that breaks out on its own once the container crosses `breakpoint`. */
  guest: string
  /** Container width, in px, where the guest snaps into its own column. */
  breakpoint: number
  /** Width of the guest column after it has snapped out. */
  width: number
  /**
   * `inline` draws the guest inside the host until it snaps out.
   * `hidden` keeps it out of the host and fades it in as its column opens.
   */
  merged?: "inline" | "hidden"
}

const EMPTY_SPLITS: ColumnSplit[] = []

type Channel = {
  spec: ColumnSplit
  travel: number
  give: number
  split: boolean
  anim: { from: number; to: number; start: number } | null
}

function token(id: string) {
  return id.replace(/[^a-zA-Z0-9_-]/g, "-")
}

/** Reads every host, then writes, so a resize does not reflow once per row. */
function measureAnchors(root: HTMLElement) {
  const hosts = root.querySelectorAll<HTMLElement>("[data-split-host]")
  const updates: { row: HTMLElement; name: string; value: string }[] = []
  for (const cell of hosts) {
    const content = cell.querySelector<HTMLElement>("[data-split-content]")
    const row = cell.closest<HTMLElement>("[role=row]")
    const id = cell.dataset.splitHost
    if (!content || !row || !id) continue
    const gap = cell.getBoundingClientRect().right - content.getBoundingClientRect().right
    updates.push({
      row,
      name: `--split-${id}-anchor`,
      value: `${Math.max(0, gap).toFixed(1)}px`,
    })
  }
  for (const update of updates) {
    if (update.row.style.getPropertyValue(update.name) === update.value) continue
    update.row.style.setProperty(update.name, update.value)
  }
}

function useColumnSplits(
  ref: RefObject<HTMLElement | null>,
  splits: readonly ColumnSplit[]
) {
  const splitsRef = useRef(splits)
  splitsRef.current = splits

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let channels: Channel[] = []
    let prevWidth = el.clientWidth
    let frame = 0

    const paint = () => {
      for (const channel of channels) {
        const id = token(channel.spec.guest)
        el.style.setProperty(`--split-${id}-travel`, channel.travel.toFixed(4))
        el.style.setProperty(`--split-${id}-give`, channel.give.toFixed(4))
      }
    }

    const settle = (width: number) => {
      channels = splitsRef.current.map((spec) => {
        const split = width >= spec.breakpoint
        return {
          spec,
          travel: split ? 1 : 0,
          give: 0,
          split,
          anim: null,
        }
      })
    }

    const tick = (now: number) => {
      let running = false
      for (const channel of channels) {
        if (!channel.anim) continue
        const t = Math.min(1, (now - channel.anim.start) / SNAP_MS)
        const eased = 1 - (1 - t) ** 3
        channel.travel =
          channel.anim.from + (channel.anim.to - channel.anim.from) * eased
        if (t >= 1) {
          channel.travel = channel.anim.to
          channel.anim = null
        } else {
          running = true
        }
      }
      paint()
      if (running) frame = requestAnimationFrame(tick)
    }

    const kick = () => {
      if (!channels.some((channel) => channel.anim)) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(tick)
    }

    const sync = (width: number) => {
      const widening = width >= prevWidth
      const jumped = Math.abs(width - prevWidth) > JUMP_PX
      prevWidth = width

      if (
        channels.length !== splitsRef.current.length ||
        channels.some((channel, index) => channel.spec !== splitsRef.current[index])
      ) {
        settle(width)
      } else {
        splitsRef.current.forEach((spec, index) => {
          channels[index].spec = spec
        })
      }

      if (motion.matches || jumped) {
        settle(width)
        paint()
        return
      }

      for (const channel of channels) {
        const breakpoint = channel.spec.breakpoint
        const crossedForward = widening && !channel.split && width >= breakpoint
        const crossedBack = !widening && channel.split && width < breakpoint

        if (channel.anim) {
          const toSplit = channel.anim.to === 1
          const reversed =
            (toSplit && !widening && width < breakpoint) ||
            (!toSplit && widening && width >= breakpoint)
          if (reversed) {
            channel.split = !toSplit
            channel.give = 0
            channel.anim = {
              from: channel.travel,
              to: toSplit ? 0 : 1,
              start: performance.now(),
            }
          }
          continue
        }

        if (crossedForward || crossedBack) {
          const to = crossedForward ? 1 : 0
          channel.split = crossedForward
          channel.give = 0
          if (Math.abs(channel.travel - to) > 0.001) {
            channel.anim = {
              from: channel.travel,
              to,
              start: performance.now(),
            }
          } else {
            channel.travel = to
          }
          continue
        }

        const approachingSplit =
          !channel.split && width > breakpoint - MAGNET_ZONE && width < breakpoint
        const approachingMerge =
          channel.split && width >= breakpoint && width < breakpoint + MAGNET_ZONE

        if (approachingSplit && (widening || channel.travel > 0)) {
          const t = (width - (breakpoint - MAGNET_ZONE)) / MAGNET_ZONE
          channel.travel = t * t * STRAIN
          channel.give = -Math.sin(t * Math.PI)
          continue
        }

        if (approachingMerge && (!widening || channel.travel < 1)) {
          const t = (breakpoint + MAGNET_ZONE - width) / MAGNET_ZONE
          channel.travel = 1 - t * t * STRAIN
          channel.give = Math.sin(t * Math.PI)
          continue
        }

        channel.split = width >= breakpoint
        channel.travel = channel.split ? 1 : 0
        channel.give = 0
      }

      paint()
      kick()
    }

    settle(prevWidth)
    paint()

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width
      if (width == null) return
      sync(width)
      measureAnchors(el)
    })
    observer.observe(el)

    const onMotion = () => sync(el.clientWidth)
    motion.addEventListener("change", onMotion)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      motion.removeEventListener("change", onMotion)
    }
  }, [ref])
}

function trackTemplate(
  columns: { id: string; columnDef: { meta?: TableColumnMeta } }[],
  splits: readonly ColumnSplit[]
) {
  const guests = new Map(splits.map((split) => [split.guest, split]))
  return columns
    .map((column) => {
      const guest = guests.get(column.id)
      if (guest) {
        return `calc(var(--split-${token(guest.guest)}-travel, 0) * ${guest.width}px)`
      }
      if (column.columnDef.meta?.width) return `${column.columnDef.meta.width}px`
      return "minmax(0, 1fr)"
    })
    .join(" ")
}

function isEmpty(value: unknown) {
  return value == null || value === ""
}

function inlineSplit(split?: ColumnSplit) {
  return split != null && split.merged !== "hidden"
}

function TableHeaderCell<TData extends RowData>({
  header,
  guest,
  render: Render,
}: {
  header: Header<DataTableFeatures, TData, unknown>
  guest?: ColumnSplit
  render: (props: { header: Header<DataTableFeatures, TData, unknown> }) => ReactNode
}) {
  const meta = header.column.columnDef.meta
  const Icon = meta?.icon
  const id = guest ? token(guest.guest) : ""

  return (
    <div
      className={cn(
        "h-8 min-w-0",
        guest ? "overflow-hidden" : "px-3"
      )}
      role="columnheader"
      style={
        guest
          ? {
              opacity: `clamp(0, calc((var(--split-${id}-travel, 0) - 0.62) * 2.632), 1)`,
            }
          : undefined
      }
    >
      <span
        className={cn(
          "flex h-full min-w-0 items-center gap-1.5 text-xs font-medium text-muted-foreground [&_svg]:opacity-70",
          guest ? "px-3" : "w-full",
          meta?.align === "end" && "flex-row-reverse justify-end"
        )}
        style={
          guest
            ? {
                transform: `translateX(calc((1 - var(--split-${id}-travel, 0)) * -16px))`,
              }
            : undefined
        }
      >
        {Icon ? <Icon className="size-3.5 shrink-0" /> : null}
        <span className="truncate">
          {header.isPlaceholder ? null : <Render header={header} />}
        </span>
      </span>
    </div>
  )
}

function TableBodyCell<TData extends RowData>({
  cell,
  guest,
  host,
  render: Render,
}: {
  cell: Cell<DataTableFeatures, TData, unknown>
  guest?: ColumnSplit
  host?: ColumnSplit
  render: (props: { cell: Cell<DataTableFeatures, TData, unknown> }) => ReactNode
}) {
  const meta = cell.column.columnDef.meta
  const empty = isEmpty(cell.getValue())
  const measureRef = useRef<HTMLSpanElement>(null)
  const contentRef = useRef<HTMLSpanElement>(null)
  const inlineHost = inlineSplit(host) ? host : undefined
  const guestId = guest ? token(guest.guest) : inlineHost ? token(inlineHost.guest) : ""

  useLayoutEffect(() => {
    const el = measureRef.current
    if (!guest || guest.merged === "hidden" || !el) return
    const row = el.closest("[role=row]")
    if (!(row instanceof HTMLElement)) return
    row.style.setProperty(`--split-${guestId}-size`, `${el.offsetWidth}px`)
  }, [guest, guestId])

  useLayoutEffect(() => {
    const el = contentRef.current
    if (!inlineHost || !el) return
    const row = el.closest("[role=row]")
    const cellEl = el.closest("[role=cell]")
    if (!(row instanceof HTMLElement) || !(cellEl instanceof HTMLElement)) return
    const gap = cellEl.getBoundingClientRect().right - el.getBoundingClientRect().right
    row.style.setProperty(
      `--split-${guestId}-anchor`,
      `${Math.max(0, gap).toFixed(1)}px`
    )
  }, [guestId, inlineHost])

  if (guest?.merged === "hidden") {
    return (
      <div
        className="h-9 min-w-0 overflow-hidden text-sm"
        role="cell"
        style={{
          opacity: `clamp(0, calc((var(--split-${guestId}-travel, 0) - 0.4) * 2.4), 1)`,
        }}
      >
        <div
          className={cn(
            "flex h-full min-w-0 items-center px-3",
            empty && "text-muted-foreground"
          )}
        >
          {empty ? "—" : <Render cell={cell} />}
        </div>
      </div>
    )
  }

  if (guest) {
    return (
      <div className="relative h-9 min-w-0" role="cell" style={{ overflow: "visible" }}>
        <span
          className={cn(
            "absolute top-1/2 left-0 w-max whitespace-nowrap px-3 text-sm",
            meta?.align === "end" && "tabular-nums",
            empty && "text-muted-foreground"
          )}
          ref={measureRef}
          style={{
            transform: `translate(calc((var(--split-${guestId}-travel, 0) - 1) * var(--split-${guestId}-anchor, 0px)), -50%)`,
          }}
        >
          {empty ? "—" : <Render cell={cell} />}
        </span>
      </div>
    )
  }

  return (
    <div
      className="min-w-0"
      data-split-host={inlineHost ? guestId : undefined}
      role="cell"
    >
      <div className="flex h-9 min-w-0 items-center px-3 text-sm">
        <span
          className={cn(
            "min-w-0 truncate",
            empty && "text-muted-foreground",
            inlineHost ? "font-medium" : "flex-1"
          )}
          data-split-content={inlineHost ? "" : undefined}
          ref={contentRef}
          style={
            inlineHost
              ? {
                  width: "max-content",
                  maxWidth: `calc(100% - (1 - round(down, var(--split-${guestId}-travel, 0), 1)) * var(--split-${guestId}-size, 0px))`,
                  transform: `translateX(calc(var(--split-${guestId}-give, 0) * ${GIVE_PX}px))`,
                }
              : undefined
          }
        >
          {empty ? "—" : <Render cell={cell} />}
        </span>
      </div>
    </div>
  )
}

export function DataTable<TData extends RowData>({
  data,
  columns,
  splits = EMPTY_SPLITS,
  estimateSize = 36,
  groupSize = 40,
  groupRow,
  showHeader = true,
  rowClassName,
  className,
}: {
  data: TData[]
  columns: ColumnDef<DataTableFeatures, TData>[]
  splits?: ColumnSplit[]
  /** Row height passed to the virtualizer. Rows are a single line, so keep this in sync with the row. */
  estimateSize?: number
  /** Height of a group row. */
  groupSize?: number
  /** Return content to draw the row as a full-width group label instead of cells. */
  groupRow?: (original: TData) => ReactNode | null | undefined
  showHeader?: boolean
  rowClassName?: (row: { original: TData }) => string | undefined
  className?: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const sizesRef = useRef({ row: estimateSize, group: groupSize })
  sizesRef.current = { row: estimateSize, group: groupSize }
  const surface = SURFACE_BG[useSurface()]
  const hover = useFluidHover<HTMLDivElement>()

  useColumnSplits(rootRef, splits)

  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
  })

  const rows = table.getRowModel().rows
  const leafColumns = table.getAllLeafColumns()
  const template = trackTemplate(leafColumns, splits)
  const guests = new Map(splits.map((split) => [split.guest, split]))
  const hosts = new Map(splits.map((split) => [split.host, split]))
  const headerGroup = table.getHeaderGroups()[0]
  const groups = rows.map((row) => groupRow?.(row.original) ?? null)
  const groupsRef = useRef(groups)
  groupsRef.current = groups

  const estimate = useCallback(
    (index: number) =>
      groupsRef.current[index] != null ? sizesRef.current.group : sizesRef.current.row,
    []
  )
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: estimate,
    getItemKey: (index) => rows[index]?.id ?? index,
    overscan: 8,
  })

  const Render = table.FlexRender

  return (
    <div
      className={cn("min-w-0 overflow-hidden text-foreground", surface)}
      ref={rootRef}
      role="table"
    >
      <div
        className={cn(
          "overflow-x-hidden overflow-y-auto [scrollbar-gutter:stable]",
          className
        )}
        ref={scrollRef}
      >
        {showHeader && headerGroup ? (
          <div
            className={cn(
              "sticky top-0 z-10 grid after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-border",
              surface
            )}
            role="row"
            style={{ gridTemplateColumns: template }}
          >
            {headerGroup.headers.map((header) => (
              <TableHeaderCell
                guest={guests.get(header.column.id)}
                header={header}
                key={header.id}
                render={Render}
              />
            ))}
          </div>
        ) : null}
        {rows.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-muted-foreground">
            Nothing to show.
          </div>
        ) : (
          <div
            className="relative isolate w-full"
            ref={hover.ref}
            role="rowgroup"
            style={{ height: virtualizer.getTotalSize() }}
            {...hover.handlers}
          >
            <FluidHoverHighlight className="rounded-sm" hover={hover} inset={{ x: 4 }} />
            {virtualizer.getVirtualItems().map((item) => {
              const row = rows[item.index]
              if (!row) return null
              const group = groups[item.index]
              if (group != null) {
                return (
                  <div
                    className={cn(
                      "absolute inset-x-0 flex items-end gap-2 px-3 pb-2 text-xs font-medium text-muted-foreground",
                      rowClassName?.(row)
                    )}
                    data-index={item.index}
                    key={row.id}
                    role="row"
                    style={{ height: item.size, top: item.start }}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2" role="cell">
                      {group}
                    </div>
                  </div>
                )
              }
              const divided = item.index > 0 && groups[item.index - 1] == null
              return (
                <div
                  className={cn(
                    "absolute inset-x-0 grid",
                    divided &&
                      "before:pointer-events-none before:absolute before:inset-x-3 before:top-0 before:h-px before:bg-border/70 before:transition-opacity before:duration-150 data-fluid-hover-active:before:opacity-0 [[data-fluid-hover-active]+&]:before:opacity-0",
                    rowClassName?.(row)
                  )}
                  data-fluid-hover-item=""
                  data-index={item.index}
                  key={row.id}
                  role="row"
                  style={{
                    height: item.size,
                    top: item.start,
                    gridTemplateColumns: template,
                  }}
                >
                  {row.getAllCells().map((cell) => (
                    <TableBodyCell
                      cell={cell}
                      guest={guests.get(cell.column.id)}
                      host={hosts.get(cell.column.id)}
                      key={cell.id}
                      render={Render}
                    />
                  ))}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
