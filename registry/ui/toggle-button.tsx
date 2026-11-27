// @prometheus 0.2.0
"use client"

import * as React from "react"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useElevatedLevel } from "@/lib/elevated"
import { SURFACE_BG } from "@/lib/surface-classes"

/** Steps above the substrate, so an unselected toggle matches a default button. */
const DEFAULT_LIFT = 2

const toggleButtonVariants = cva(
  "group/toggle-button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap text-muted-foreground shadow-[inset_0_1px_0_0_rgb(255_255_255/0.08),0_0_0_0.5px_hsl(0_0%_0%/10%),0_4px_1px_-2px_hsl(0_0%_0%/8%)] transition-[background-color,color,box-shadow,scale,opacity] duration-(--duration-fast) ease-(--ease-standard) outline-none select-none hover:bg-[image:linear-gradient(hsl(0_0%_0%/2%),hsl(0_0%_0%/2%))] hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 motion-safe:active:scale-[0.95] motion-safe:data-pressed:scale-[0.97] motion-safe:data-pressed:active:scale-[0.95] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-[0_0_0_0.5px_hsl(0_0%_0%/10%)] active:bg-muted active:bg-none active:text-foreground active:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.08),0_0_0_0.5px_hsl(0_0%_0%/10%)] dark:active:bg-black/25 data-pressed:bg-muted data-pressed:bg-none data-pressed:text-foreground data-pressed:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.08),0_0_0_0.5px_hsl(0_0%_0%/10%)] dark:data-pressed:bg-black/25 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-xs px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-xs px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs": "size-6 rounded-xs [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-xs",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
)

function ToggleButton({
  className,
  size = "default",
  ref: forwardedRef,
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleButtonVariants>) {
  const level = useElevatedLevel(DEFAULT_LIFT)

  return (
    <TogglePrimitive
      ref={forwardedRef}
      data-slot="toggle-button"
      className={cn(toggleButtonVariants({ size }), SURFACE_BG[level], className)}
      {...props}
    />
  )
}

function ToggleButtonGroup({
  className,
  ...props
}: ToggleGroupPrimitive.Props) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-button-group"
      className={cn(
        "flex w-fit flex-wrap items-center gap-1.5 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
        className,
      )}
      {...props}
    />
  )
}

export { ToggleButton, ToggleButtonGroup, toggleButtonVariants }