// @prometheus 0.2.0
"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
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
import { XMarkIcon } from "@heroicons/react/16/solid"

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ className, ...props }: SheetPrimitive.Portal.Props) {
  return (
    <SheetPrimitive.Portal
      data-slot="sheet-portal"
      className={cn("relative z-50", className)}
      {...props}
    />
  )
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/10 transition-opacity duration-200 ease-(--ease-standard) data-ending-style:opacity-0 data-ending-style:duration-160 data-starting-style:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ref: forwardedRef,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
}) {
  const level = useElevatedLevel(SURFACE_OFFSET.dialog)
  const surfaceRef = useCornerRef<HTMLDivElement>(OVERLAY_CORNERS.dialog)

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        ref={forwardedRef}
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "fixed z-50 flex [transition:translate_var(--sheet-move)_var(--ease-enter),opacity_var(--sheet-fade)_var(--ease-standard),filter_var(--sheet-fade)_var(--ease-standard)] [--sheet-fade:200ms] [--sheet-move:320ms] data-ending-style:opacity-0 data-ending-style:blur-[4px] data-ending-style:[--sheet-fade:160ms] data-ending-style:[--sheet-move:200ms] data-starting-style:opacity-0 data-starting-style:blur-[4px] motion-reduce:data-ending-style:translate-0 motion-reduce:data-starting-style:translate-0 data-[side=bottom]:inset-x-2 data-[side=bottom]:bottom-2 data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-2 data-[side=left]:left-2 data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-2 data-[side=right]:right-2 data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-2 data-[side=top]:top-2 data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem]"
        )}
        {...props}
      >
        <div
          ref={surfaceRef}
          data-slot="sheet-surface"
          data-side={side}
          className={cn(
            "relative flex w-full flex-col gap-4 bg-clip-padding text-sm text-foreground data-[side=left]:w-[75vw] data-[side=left]:sm:max-w-sm data-[side=right]:w-[75vw] data-[side=right]:sm:max-w-sm",
            surfaceClasses(level, SURFACE_SHADOW_LEVEL.dialog),
            className
          )}
          style={{ borderRadius: cornersCssRadius(OVERLAY_CORNERS.dialog) }}
        >
          <SurfaceProvider value={level}>
            {children}
            {showCloseButton && (
              <SheetPrimitive.Close
                data-slot="sheet-close"
                render={
                  <Button
                    variant="ghost"
                    className="absolute top-3 right-3"
                    size="icon-sm"
                  />
                }
              >
                <XMarkIcon />
                <span className="sr-only">Close</span>
              </SheetPrimitive.Close>
            )}
          </SurfaceProvider>
        </div>
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-0.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("font-display text-xl text-foreground", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
