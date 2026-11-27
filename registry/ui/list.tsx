// @prometheus 0.2.0
"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cn } from "@/lib/utils"

import { FluidHoverHighlight, useFluidHover } from "@/lib/fluid-hover"

function List({
  label,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** Muted line above the rows, like "Open roles". */
  label?: React.ReactNode
}) {
  const hover = useFluidHover<HTMLDivElement>()
  const labelId = React.useId()

  return (
    <div
      data-slot="list"
      className={cn("@container/list", className)}
      {...props}
    >
      {label ? (
        <p
          className="mb-3 text-sm text-muted-foreground/70"
          data-slot="list-label"
          id={labelId}
        >
          {label}
        </p>
      ) : null}
      <div
        aria-labelledby={label ? labelId : undefined}
        className="relative isolate -mx-[5px]"
        data-slot="list-rows"
        ref={hover.ref}
        role="group"
        {...hover.handlers}
      >
        <FluidHoverHighlight
          className="rounded-sm"
          hover={hover}
          inset={{ y: 5 }}
        />
        {children}
      </div>
    </div>
  )
}

function ListItem({
  render,
  meta,
  className,
  children,
  ...props
}: useRender.ComponentProps<"a"> &
  React.ComponentProps<"a"> & {
    /** Right-hand detail, like a team. Hidden when the list is narrow. */
    meta?: React.ReactNode
  }) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          "relative flex h-11 cursor-pointer items-center justify-between gap-4 rounded-sm px-[5px] text-base tracking-[-0.01em] text-muted-foreground outline-none select-none focus-visible:ring-2 focus-visible:ring-ring",
          "after:absolute after:inset-x-[5px] after:bottom-0 after:h-px after:bg-border",
          "[[data-slot=fluid-hover-highlight]+&]:before:absolute [[data-slot=fluid-hover-highlight]+&]:before:inset-x-[5px] [[data-slot=fluid-hover-highlight]+&]:before:top-0 [[data-slot=fluid-hover-highlight]+&]:before:h-px [[data-slot=fluid-hover-highlight]+&]:before:bg-border",
          className,
        ),
        children: (
          <>
            <span
              className="min-w-0 truncate @max-[28rem]/list:text-sm"
              data-slot="list-item-title"
            >
              {children}
            </span>
            {meta ? (
              <span
                className="shrink-0 @max-[28rem]/list:hidden"
                data-slot="list-item-meta"
              >
                {meta}
              </span>
            ) : null}
          </>
        ),
        "data-fluid-hover-item": "",
        "data-slot": "list-item",
      } as React.ComponentProps<"a">,
      props,
    ),
    render,
  })
}

export { List, ListItem }
