// @prometheus 0.2.0
"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "@/lib/utils"

const TRACK_WIDTH = 34
const TRACK_HEIGHT = 20
const THUMB_SIZE = 16
const THUMB_OFFSET = 2
const PILL_EXTEND = 2
const PRESS_EXTEND = 4
const PRESS_SHRINK = 4
const DRAG_DEAD_ZONE = 2
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE - THUMB_OFFSET * 2

type SwitchProps = Omit<React.ComponentProps<"div">, "onToggle"> & {
  label: string
  checked: boolean
  /** Called by a click, the keyboard, or a drag released past the midpoint. */
  onToggle: () => void
  disabled?: boolean
}

/**
 * A labeled row. A click anywhere toggles, and the thumb can be dragged across
 * the track. Hover stretches the thumb into a pill; press stretches it further.
 */
function Switch({
  label,
  checked,
  onToggle,
  disabled = false,
  className,
  ...props
}: SwitchProps) {
  const labelId = React.useId()
  const mounted = React.useRef(false)
  const [hovered, setHovered] = React.useState(false)
  const [pressed, setPressed] = React.useState(false)
  const [thumbX, setThumbX] = React.useState(
    checked ? THUMB_OFFSET + THUMB_TRAVEL : THUMB_OFFSET,
  )
  const dragging = React.useRef(false)
  const didDrag = React.useRef(false)
  const pointerStart = React.useRef<{
    clientX: number
    originX: number
  } | null>(null)
  const thumbXRef = React.useRef(thumbX)
  thumbXRef.current = thumbX

  const thumbWidth = pressed
    ? THUMB_SIZE + PRESS_EXTEND
    : hovered
      ? THUMB_SIZE + PILL_EXTEND
      : THUMB_SIZE
  const thumbHeight = pressed ? THUMB_SIZE - PRESS_SHRINK : THUMB_SIZE
  const thumbY = pressed ? THUMB_OFFSET + PRESS_SHRINK / 2 : THUMB_OFFSET
  const extraWidth = thumbWidth - THUMB_SIZE
  const restX = checked
    ? THUMB_OFFSET + THUMB_TRAVEL - extraWidth
    : THUMB_OFFSET

  React.useEffect(() => {
    mounted.current = true
  }, [])

  React.useEffect(() => {
    if (dragging.current) return
    setThumbX(restX)
  }, [restX])

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent) => {
      if (disabled) return
      if (event.pointerType === "mouse" && event.button !== 0) return
      setPressed(true)
      dragging.current = false
      didDrag.current = false
      pointerStart.current = {
        clientX: event.clientX,
        originX: thumbXRef.current,
      }
      ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
    },
    [disabled],
  )

  const handlePointerMove = React.useCallback((event: React.PointerEvent) => {
    if (!pointerStart.current) return
    const delta = event.clientX - pointerStart.current.clientX
    if (!dragging.current) {
      if (Math.abs(delta) < DRAG_DEAD_ZONE) return
      dragging.current = true
    }
    const pressedWidth = THUMB_SIZE + PRESS_EXTEND
    const max = TRACK_WIDTH - THUMB_OFFSET - pressedWidth
    const next = pointerStart.current.originX + delta
    setThumbX(Math.max(THUMB_OFFSET, Math.min(max, next)))
  }, [])

  const handlePointerUp = React.useCallback(() => {
    if (!pointerStart.current) return
    setPressed(false)
    if (dragging.current) {
      didDrag.current = true
      dragging.current = false
      const pressedWidth = THUMB_SIZE + PRESS_EXTEND
      const max = TRACK_WIDTH - THUMB_OFFSET - pressedWidth
      const midpoint = (THUMB_OFFSET + max) / 2
      const shouldBeOn = thumbXRef.current > midpoint
      if (shouldBeOn !== checked) {
        onToggle()
      } else {
        setThumbX(checked ? THUMB_OFFSET + THUMB_TRAVEL : THUMB_OFFSET)
      }
      requestAnimationFrame(() => {
        didDrag.current = false
      })
    }
    pointerStart.current = null
  }, [checked, onToggle])

  const handlePointerCancel = React.useCallback(() => {
    if (!pointerStart.current) return
    setPressed(false)
    if (dragging.current) {
      dragging.current = false
      setThumbX(checked ? THUMB_OFFSET + THUMB_TRAVEL : THUMB_OFFSET)
    }
    pointerStart.current = null
  }, [checked])

  return (
    <div
      className={cn(
        "relative z-10 flex cursor-pointer items-center gap-2.5 px-1 py-2 touch-none select-none",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      data-slot="switch"
      onClick={() => {
        if (disabled || didDrag.current) return
        onToggle()
      }}
      onPointerCancel={handlePointerCancel}
      onPointerDown={handlePointerDown}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true)
      }}
      onPointerLeave={() => setHovered(false)}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      {...props}
    >
      <SwitchPrimitive.Root
        aria-labelledby={labelId}
        checked={checked}
        className={cn(
          "relative shrink-0 cursor-pointer rounded-full outline-none transition-colors duration-80",
          "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          // --switch-checked stays umber in both themes so the white thumb
          // keeps contrast (bg-primary flips to cream in dark).
          checked
            ? hovered
              ? "bg-[color-mix(in_oklab,var(--switch-checked),black_8%)]"
              : "bg-(--switch-checked)"
            : hovered
              ? "bg-[color-mix(in_oklab,var(--accent),var(--foreground)_10%)]"
              : "bg-accent",
        )}
        disabled={disabled}
        onCheckedChange={() => {
          if (didDrag.current) return
          onToggle()
        }}
        onClick={(event) => event.stopPropagation()}
        style={{ width: TRACK_WIDTH, height: TRACK_HEIGHT }}
        tabIndex={0}
      >
        <SwitchPrimitive.Thumb
          render={(thumbProps) => {
            const { style: baseStyle, className: _className, ...rest } =
              thumbProps as React.HTMLAttributes<HTMLSpanElement>
            return (
              <span
                {...rest}
                className="absolute top-0 left-0 block rounded-full bg-white shadow-[0_0_0_0.5px_hsl(0_0%_0%/10%),0_4px_1px_-2px_hsl(0_0%_0%/8%)]"
                style={{
                  ...(baseStyle as React.CSSProperties | undefined),
                  width: thumbWidth,
                  height: thumbHeight,
                  transform: `translate(${thumbX}px, ${thumbY}px)`,
                  transition: mounted.current
                    ? dragging.current
                      ? "width 160ms var(--ease-standard), height 160ms var(--ease-standard), transform 0ms"
                      : "width 160ms var(--ease-standard), height 160ms var(--ease-standard), transform 160ms var(--ease-standard)"
                    : "none",
                }}
              />
            )
          }}
        />
      </SwitchPrimitive.Root>
      <span
        className={cn(
          "text-sm transition-colors duration-80",
          checked ? "text-foreground" : "text-muted-foreground",
        )}
        id={labelId}
      >
        {label}
      </span>
    </div>
  )
}

export { Switch }
export type { SwitchProps }
