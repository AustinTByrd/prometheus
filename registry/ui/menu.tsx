// @prometheus 0.2.0
"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { CheckIcon, ChevronRightIcon } from "@heroicons/react/16/solid"

import { cn } from "@/lib/utils"
import { useElevatedLevel } from "@/lib/elevated"
import {
  OVERLAY_CORNERS,
  cornersCssRadius,
  useCornerRef,
} from "@/lib/smooth-corners"
import {
  SURFACE_OFFSET,
  SURFACE_SHADOW_LEVEL,
  surfaceClasses,
} from "@/lib/surface-classes"
import { SurfaceProvider } from "@/lib/surface-context"

const Menu = MenuPrimitive.Root

const menuMotionClassName =
  "relative isolate z-50 w-fit origin-(--transform-origin) duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"

const menuSlideClassName =
  "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"

const menuSurfaceClassName =
  "relative max-h-(--available-height) w-max overflow-x-hidden overflow-y-auto p-1 text-foreground"

function MenuPopup({
  className,
  motionClassName,
  minWidthClassName,
  slot,
  ref: forwardedRef,
  children,
  ...props
}: MenuPrimitive.Popup.Props & {
  motionClassName?: string
  minWidthClassName: string
  slot: string
}) {
  const level = useElevatedLevel(SURFACE_OFFSET.menu)
  const ref = useCornerRef(OVERLAY_CORNERS.menu)

  return (
    <MenuPrimitive.Popup
      ref={forwardedRef}
      data-slot={slot}
      className={cn(menuMotionClassName, motionClassName)}
      {...props}
    >
      <div
        ref={ref}
        data-slot="menu-surface"
        className={cn(
          menuSurfaceClassName,
          minWidthClassName,
          surfaceClasses(level, SURFACE_SHADOW_LEVEL.menu),
          className
        )}
        style={{ borderRadius: cornersCssRadius(OVERLAY_CORNERS.menu) }}
      >
        <SurfaceProvider value={level}>{children}</SurfaceProvider>
      </div>
    </MenuPrimitive.Popup>
  )
}

function MenuTrigger({ className, ...props }: MenuPrimitive.Trigger.Props) {
  return (
    <MenuPrimitive.Trigger
      data-slot="menu-trigger"
      className={cn(className)}
      {...props}
    />
  )
}

function MenuContent({
  className,
  side = "bottom",
  sideOffset = 4,
  align = "start",
  alignOffset = 0,
  ref: forwardedRef,
  children,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className="isolate z-50"
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPopup
          ref={forwardedRef}
          className={className}
          minWidthClassName="min-w-40"
          motionClassName={menuSlideClassName}
          slot="menu-content"
          {...props}
        >
          {children}
        </MenuPopup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function MenuGroup({ className, ...props }: MenuPrimitive.Group.Props) {
  return (
    <MenuPrimitive.Group
      data-slot="menu-group"
      className={cn(className)}
      {...props}
    />
  )
}

function MenuLabel({ className, ...props }: MenuPrimitive.GroupLabel.Props) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="menu-label"
      className={cn("px-1.5 py-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function MenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenuPrimitive.Item
      data-slot="menu-item"
      data-inset={inset ? "" : undefined}
      data-variant={variant}
      className={cn(
        "relative flex cursor-default items-center gap-1.5 rounded-sm px-1.5 py-1 text-sm outline-hidden select-none focus:bg-hover data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-hover data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function MenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: MenuPrimitive.CheckboxItem.Props) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="menu-checkbox-item"
      checked={checked}
      className={cn(
        "relative flex cursor-default items-center gap-1.5 rounded-sm py-1 pr-1.5 pl-7 text-sm outline-hidden select-none focus:bg-hover data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-hover [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-1.5 flex size-4 items-center justify-center">
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function MenuRadioGroup({
  className,
  ...props
}: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="menu-radio-group"
      className={cn(className)}
      {...props}
    />
  )
}

function MenuRadioItem({
  className,
  children,
  ...props
}: MenuPrimitive.RadioItem.Props) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="menu-radio-item"
      className={cn(
        "relative flex cursor-default items-center gap-1.5 rounded-sm py-1 pr-1.5 pl-7 text-sm outline-hidden select-none focus:bg-hover data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-hover [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-1.5 flex size-4 items-center justify-center">
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function MenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function MenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function MenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="menu-sub" {...props} />
}

function MenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & { inset?: boolean }) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="menu-sub-trigger"
      data-inset={inset ? "" : undefined}
      className={cn(
        "flex cursor-default items-center gap-1.5 rounded-sm px-1.5 py-1 text-sm outline-hidden select-none focus:bg-hover data-highlighted:bg-hover data-open:bg-hover data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" data-icon="inline-end" />
    </MenuPrimitive.SubmenuTrigger>
  )
}

function MenuSubContent({
  className,
  side = "right",
  sideOffset = 0,
  align = "start",
  alignOffset = -4,
  ref: forwardedRef,
  children,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className="isolate z-50"
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPopup
          ref={forwardedRef}
          className={className}
          minWidthClassName="min-w-32"
          slot="menu-sub-content"
          {...props}
        >
          {children}
        </MenuPopup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

export {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuGroup,
  MenuLabel,
  MenuItem,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubTrigger,
  MenuSubContent,
}
