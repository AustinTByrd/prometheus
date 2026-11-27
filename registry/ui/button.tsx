// @prometheus 0.2.0
"use client"

import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useElevatedLevel } from "@/lib/elevated"
import { SURFACE_BG } from "@/lib/surface-classes"

/** Steps above the substrate, so a default button stays lighter than the surface it sits on. */
const DEFAULT_LIFT = 2

const PILL_SPACING_CLASSES =
  "rounded-(--pill-r) in-data-[slot=button-group]:rounded-(--pill-r) px-(--pill-px) [&:not(:has(*))]:px-[calc(var(--pill-px)_+_var(--pill-r)_*_(1_-_pi_/_4)_*_var(--pill-r)_/_var(--pill))] [&>:not([data-slot=button-content])]:[--pill-edge:calc(var(--pill-r)_*_(1_-_pi_/_4)_*_var(--pill-r)_/_var(--pill))] [&>svg]:[--pill-edge:calc(var(--pill-py)_-_var(--pill-px))] [&>[data-icon]]:[--pill-edge:calc(var(--pill-py)_-_var(--pill-px))] [&>:not([data-slot=button-content]):first-child]:ms-(--pill-edge) [&>:not([data-slot=button-content]):last-child]:me-(--pill-edge) [&_[data-slot=button-layer]>*]:[--pill-edge:calc(var(--pill-r)_*_(1_-_pi_/_4)_*_var(--pill-r)_/_var(--pill))] [&_[data-slot=button-layer]>svg]:[--pill-edge:calc(var(--pill-py)_-_var(--pill-px))] [&_[data-slot=button-layer]>[data-icon]]:[--pill-edge:calc(var(--pill-py)_-_var(--pill-px))] [&_[data-slot=button-layer]>:first-child]:ms-(--pill-edge) [&_[data-slot=button-layer]>:last-child]:me-(--pill-edge)"

const buttonVariants = cva(
  "group/button relative isolate inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-[background-color,color,box-shadow,transform,opacity,filter,padding] duration-(--duration-fast) ease-(--ease-standard) outline-none select-none before:pointer-events-none before:absolute before:inset-0 before:z-0 before:rounded-[inherit] before:bg-hover before:opacity-0 before:transition-opacity before:duration-(--duration-fast) before:ease-(--ease-standard) hover:before:opacity-100 hover:text-[color-mix(in_oklab,currentColor_88%,transparent)] active:before:opacity-100 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 motion-safe:active:not-aria-[haspopup]:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 *:relative *:z-[1] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-surface-3 text-foreground shadow-[inset_0_1px_0_0_rgb(255_255_255/0.08),0_0_0_0.5px_hsl(0_0%_0%/10%),0_4px_1px_-2px_hsl(0_0%_0%/8%)] active:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.08),0_0_0_0.5px_hsl(0_0%_0%/10%),0_4px_1px_-2px_hsl(0_0%_0%/0%)] disabled:shadow-[0_0_0_0.5px_hsl(0_0%_0%/10%)]",
        primary:
          "border-(--button-primary-border) bg-(--button-primary) bg-(image:--button-primary-gradient) bg-clip-border text-(--button-primary-foreground) shadow-[inset_0_1px_0_0_rgb(255_255_255/0.08)] before:bg-[rgb(from_var(--background)_r_g_b_/_12%)] hover:text-(--button-primary-foreground) active:brightness-95 disabled:shadow-none",
        outlined: "border-border bg-transparent text-foreground",
        ghost:
          "hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        destructive:
          "bg-destructive/10 text-destructive hover:text-destructive focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 opacity-80 hover:before:opacity-0 hover:underline hover:opacity-100 active:before:opacity-0 active:opacity-100",
      },
      size: {
        default: "h-8 gap-1.5 px-2.5",
        xs: "h-6 gap-1 rounded-xs px-2 text-xs in-data-[slot=button-group]:rounded-sm [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-xs px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-sm [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-xs in-data-[slot=button-group]:rounded-sm [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-xs in-data-[slot=button-group]:rounded-sm",
        "icon-lg": "size-9",
      },
      pill: {
        true: "rounded-full in-data-[slot=button-group]:rounded-full",
        false: "",
      },
    },
    compoundVariants: [
      {
        pill: false,
        size: "xs",
        className:
          "has-[[data-icon=inline-end]:not([data-exiting]_*)]:pr-1.5 has-[[data-icon=inline-start]:not([data-exiting]_*)]:pl-1.5",
      },
      {
        pill: false,
        size: "sm",
        className:
          "has-[[data-icon=inline-end]:not([data-exiting]_*)]:pr-1.5 has-[[data-icon=inline-start]:not([data-exiting]_*)]:pl-1.5",
      },
      {
        pill: false,
        size: "default",
        className:
          "has-[[data-icon=inline-end]:not([data-exiting]_*)]:pr-2 has-[[data-icon=inline-start]:not([data-exiting]_*)]:pl-2",
      },
      {
        pill: false,
        size: "lg",
        className:
          "has-[[data-icon=inline-end]:not([data-exiting]_*)]:pr-2 has-[[data-icon=inline-start]:not([data-exiting]_*)]:pl-2",
      },
      {
        pill: true,
        size: "xs",
        className: cn(
          "[--pill-py:5px] [--pill-px:8px] [--pill:12px] [--pill-r:var(--pill)]",
          PILL_SPACING_CLASSES,
        ),
      },
      {
        pill: true,
        size: "sm",
        className: cn(
          "[--pill-py:6px] [--pill-px:10px] [--pill:14px] [--pill-r:var(--pill)]",
          PILL_SPACING_CLASSES,
        ),
      },
      {
        pill: true,
        size: "default",
        className: cn(
          "[--pill-py:7px] [--pill-px:10px] [--pill:16px] [--pill-r:var(--pill)]",
          PILL_SPACING_CLASSES,
        ),
      },
      {
        pill: true,
        size: "lg",
        className: cn(
          "[--pill-py:9px] [--pill-px:10px] [--pill:18px] [--pill-r:var(--pill)]",
          PILL_SPACING_CLASSES,
        ),
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      pill: false,
    },
  },
)

const SWAP_DURATION = 220
const SWAP_EASE = "cubic-bezier(0.23, 1, 0.32, 1)"

function contentKey(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return ""
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(contentKey).join("")
  if (React.isValidElement(node)) {
    const type = node.type as
      | string
      | { displayName?: string; name?: string; render?: { name?: string } }
    const name =
      typeof type === "string"
        ? type
        : (type.displayName ?? type.name ?? type.render?.name ?? "")
    const { children } = node.props as { children?: React.ReactNode }
    return `<${name}${node.key ?? ""}>${contentKey(children)}</>`
  }
  return ""
}

function flattenPillNodes(
  node: React.ReactNode,
  out: React.ReactNode[],
): void {
  if (node == null || typeof node === "boolean") return
  if (Array.isArray(node)) {
    for (const item of node) flattenPillNodes(item, out)
    return
  }
  if (React.isValidElement(node) && node.type === React.Fragment) {
    flattenPillNodes(
      (node.props as { children?: React.ReactNode }).children,
      out,
    )
    return
  }
  out.push(node)
}

function normalizePillChildren(children: React.ReactNode): React.ReactNode {
  const flat: React.ReactNode[] = []
  flattenPillNodes(children, flat)

  const result: React.ReactNode[] = []
  let textBuffer: (string | number)[] = []

  const flushText = () => {
    if (textBuffer.length === 0) return
    const trimmed = textBuffer.join("").trim()
    textBuffer = []
    if (!trimmed) return
    result.push(
      <span data-slot="pill-label" key={`pill-label-${result.length}`}>
        {trimmed}
      </span>,
    )
  }

  for (const item of flat) {
    if (typeof item === "string" || typeof item === "number") {
      textBuffer.push(item)
    } else {
      flushText()
      result.push(item)
    }
  }
  flushText()

  return result
}

type SwapLayer = { id: number; key: string; node: React.ReactNode }

function ButtonContent({
  children,
  pill,
}: {
  children: React.ReactNode
  pill: boolean
}) {
  const key = contentKey(children)
  const [layers, setLayers] = React.useState<SwapLayer[]>(() => [
    { id: 0, key, node: children },
  ])
  const rendered = React.useRef(children)
  const current = layers[layers.length - 1]
  if (current.key !== key) {
    const outgoing = rendered.current
    setLayers((previous) => {
      const last = previous[previous.length - 1]
      return [
        ...previous.slice(0, -1),
        { ...last, node: outgoing },
        { id: last.id + 1, key, node: children },
      ]
    })
  }

  React.useEffect(() => {
    rendered.current = children
  })

  const ref = React.useRef<HTMLSpanElement>(null)
  const width = React.useRef<number | null>(null)

  React.useLayoutEffect(() => {
    const wrapper = ref.current
    const layer = wrapper?.lastElementChild as HTMLElement | null
    if (!wrapper || !layer) return
    const from = width.current
    const to = parseFloat(getComputedStyle(layer).width)
    width.current = to
    if (from === null || Math.abs(from - to) < 0.5) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    wrapper.style.transition = "none"
    wrapper.style.width = `${from}px`
    void wrapper.offsetWidth
    wrapper.style.transition = `width ${SWAP_DURATION}ms ${SWAP_EASE}`
    wrapper.style.width = `${to}px`
    const timeout = window.setTimeout(() => {
      wrapper.style.removeProperty("width")
      wrapper.style.removeProperty("transition")
    }, SWAP_DURATION)
    return () => window.clearTimeout(timeout)
  }, [current.id])

  React.useEffect(() => {
    if (layers.length < 2) return
    const timeout = window.setTimeout(
      () => setLayers((previous) => previous.slice(-1)),
      SWAP_DURATION + 40,
    )
    return () => window.clearTimeout(timeout)
  }, [layers.length])

  return (
    <span
      className="relative inline-flex items-center justify-center gap-[inherit]"
      data-slot="button-content"
      data-swapping={layers.length > 1 ? "" : undefined}
      ref={ref}
    >
      {layers.map((layer, index) => {
        const exiting = index < layers.length - 1
        const layerNode = exiting ? layer.node : children
        return (
          <span
            aria-hidden={exiting || undefined}
            data-exiting={exiting ? "" : undefined}
            data-slot="button-layer"
            className={cn(
              "inline-flex items-center justify-center gap-[inherit] whitespace-nowrap transition-[opacity,translate,filter] duration-220 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:duration-150 motion-reduce:ease-linear",
              layer.id > 0 &&
                "starting:opacity-0 motion-safe:starting:-translate-y-[120%] motion-safe:starting:blur-[5px]",
              exiting &&
                "pointer-events-none absolute inset-x-0 top-0 h-full opacity-0 motion-safe:translate-y-[120%] motion-safe:blur-[5px]",
            )}
            key={layer.id}
          >
            {pill ? normalizePillChildren(layerNode) : layerNode}
          </span>
        )
      })}
    </span>
  )
}

function Button({
  className,
  variant = "default",
  size = "default",
  pill = false,
  children,
  ref: forwardedRef,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  const level = useElevatedLevel(DEFAULT_LIFT)

  return (
    <ButtonPrimitive
      ref={forwardedRef}
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size, pill }),
        variant === "default" && SURFACE_BG[level],
        "has-data-swapping:overflow-hidden",
        className,
      )}
      {...props}
    >
      {children == null ? (
        children
      ) : (
        <ButtonContent pill={Boolean(pill)}>{children}</ButtonContent>
      )}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }