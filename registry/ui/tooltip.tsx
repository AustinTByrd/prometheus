// @prometheus 0.2.0
"use client"

import { Children, createContext, isValidElement, useContext, type ReactNode } from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

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

const TooltipPopupMotionContext = createContext(false)

const tooltipArrowClassName =
  "size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] data-[side=bottom]:top-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5"

const tooltipArrowMotionClassName =
  "duration-(--duration-instant) data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 data-[instant]:animate-none"

const tooltipMotionClassName =
  "relative isolate z-50 inline-flex w-fit origin-(--transform-origin) duration-(--duration-instant) ease-(--ease-enter) data-closed:ease-(--ease-exit) data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[instant=delay]:animate-none data-[instant=dismiss]:animate-none data-[instant=focus]:animate-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"

const tooltipContentVariants = cva(
  "relative z-10 inline-flex w-fit max-w-xs items-center text-foreground has-data-[slot=kbd]:pr-1.5 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm **:data-[slot=kbd]:bg-muted **:data-[slot=kbd]:px-1 **:data-[slot=kbd]:font-mono **:data-[slot=kbd]:text-[0.625rem] **:data-[slot=kbd]:text-muted-foreground",
  {
    variants: {
      size: {
        default: "gap-1.5 px-3 py-1.5 text-xs",
        sm: "gap-1 px-2 py-1 text-xs",
        lg: "max-w-sm gap-2 px-3.5 py-2 text-sm",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function TooltipProvider({
  delay = 0,
  closeDelay,
  timeout,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      closeDelay={closeDelay}
      timeout={timeout}
      {...props}
    />
  )
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipPortal({ ...props }: TooltipPrimitive.Portal.Props) {
  return <TooltipPrimitive.Portal data-slot="tooltip-portal" {...props} />
}

function TooltipPositioner({
  className,
  sideOffset = 6,
  arrowPadding = 8,
  ...props
}: TooltipPrimitive.Positioner.Props) {
  return (
    <TooltipPrimitive.Positioner
      data-slot="tooltip-positioner"
      sideOffset={sideOffset}
      arrowPadding={arrowPadding}
      className={cn("isolate z-50", className)}
      {...props}
    />
  )
}

function TooltipArrow({
  className,
  ...props
}: TooltipPrimitive.Arrow.Props) {
  const level = useElevatedLevel(SURFACE_OFFSET.tooltip)
  const insidePopupMotion = useContext(TooltipPopupMotionContext)

  return (
    <TooltipPrimitive.Arrow
      data-slot="tooltip-arrow"
      className={cn(
        tooltipArrowClassName,
        insidePopupMotion ? null : tooltipArrowMotionClassName,
        surfaceClasses(level, SURFACE_SHADOW_LEVEL.tooltip),
        className
      )}
      {...props}
    />
  )
}

function TooltipViewport({ ...props }: TooltipPrimitive.Viewport.Props) {
  return (
    <TooltipPrimitive.Viewport data-slot="tooltip-viewport" {...props} />
  )
}

function partitionTooltipChildren(children: ReactNode) {
  const arrows: ReactNode[] = []
  const content: ReactNode[] = []

  for (const child of Children.toArray(children)) {
    if (isValidElement(child) && child.type === TooltipArrow) {
      arrows.push(child)
    } else {
      content.push(child)
    }
  }

  return { arrows, content }
}

function TooltipPopup({
  className,
  size,
  children,
  ref: forwardedRef,
  ...props
}: TooltipPrimitive.Popup.Props &
  VariantProps<typeof tooltipContentVariants>) {
  const level = useElevatedLevel(SURFACE_OFFSET.tooltip)
  const ref = useCornerRef(OVERLAY_CORNERS.tooltip)
  const { arrows, content } = partitionTooltipChildren(children)

  return (
    <TooltipPrimitive.Popup
      ref={forwardedRef}
      data-slot="tooltip-content"
      className={tooltipMotionClassName}
      {...props}
    >
      <TooltipPopupMotionContext.Provider value={true}>
        {arrows}
        <div
          ref={ref}
          data-slot="tooltip-surface"
          className={cn(
            tooltipContentVariants({ size }),
            surfaceClasses(level, SURFACE_SHADOW_LEVEL.tooltip),
            className
          )}
          style={{ borderRadius: cornersCssRadius(OVERLAY_CORNERS.tooltip) }}
        >
          <SurfaceProvider value={level}>{content}</SurfaceProvider>
        </div>
      </TooltipPopupMotionContext.Provider>
    </TooltipPrimitive.Popup>
  )
}

function TooltipContent({
  className,
  size,
  side = "top",
  sideOffset,
  align = "center",
  alignOffset,
  arrowPadding,
  collisionBoundary,
  collisionPadding,
  sticky,
  positionMethod,
  showArrow = true,
  children,
  container,
  keepMounted,
  ref: forwardedRef,
  ...props
}: TooltipPrimitive.Popup.Props &
  VariantProps<typeof tooltipContentVariants> &
  Pick<
    TooltipPrimitive.Positioner.Props,
    | "align"
    | "alignOffset"
    | "side"
    | "sideOffset"
    | "arrowPadding"
    | "collisionBoundary"
    | "collisionPadding"
    | "sticky"
    | "positionMethod"
  > & {
    showArrow?: boolean
    container?: TooltipPrimitive.Portal.Props["container"]
    keepMounted?: TooltipPrimitive.Portal.Props["keepMounted"]
  }) {
  return (
    <TooltipPortal container={container} keepMounted={keepMounted}>
      <TooltipPositioner
        side={side}
        sideOffset={sideOffset ?? (showArrow ? 10 : 6)}
        align={align}
        alignOffset={alignOffset}
        arrowPadding={arrowPadding}
        collisionBoundary={collisionBoundary}
        collisionPadding={collisionPadding}
        sticky={sticky}
        positionMethod={positionMethod}
      >
        {/* The squircle clips the surface, so the arrow stays in the popup, above the shadow. */}
        <TooltipPopup ref={forwardedRef} size={size} className={className} {...props}>
          {showArrow ? <TooltipArrow /> : null}
          {children}
        </TooltipPopup>
      </TooltipPositioner>
    </TooltipPortal>
  )
}

const createTooltipHandle = TooltipPrimitive.createHandle

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipPortal,
  TooltipPositioner,
  TooltipPopup,
  TooltipArrow,
  TooltipViewport,
  createTooltipHandle,
  tooltipContentVariants,
}
