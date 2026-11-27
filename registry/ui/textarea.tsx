// @prometheus 0.2.0
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { useElevatedLevel } from "@/lib/elevated"
import { SURFACE_BG } from "@/lib/surface-classes"
import { cn } from "@/lib/utils"

/** Matches Input, so a textarea and an input read as the same kind of well. */
const TEXTAREA_LIFT = 1

/**
 * Textareas match :focus-visible on pointer focus (browser heuristic).
 * Track the last input modality so the ring can stay keyboard-only.
 */
type FocusModality = "keyboard" | "pointer"

let focusModality: FocusModality = "pointer"
let focusModalityBound = false

function ensureFocusModalityListeners() {
  if (focusModalityBound || typeof window === "undefined") return
  focusModalityBound = true
  window.addEventListener(
    "keydown",
    (event) => {
      if (event.metaKey || event.altKey || event.ctrlKey) return
      focusModality = "keyboard"
    },
    true
  )
  window.addEventListener(
    "pointerdown",
    () => {
      focusModality = "pointer"
    },
    true
  )
}

type FocusOpts = FocusOptions & { focusVisible?: boolean }

const textareaVariants = cva(
  "group/textarea relative flex w-full min-w-0 cursor-text flex-col rounded-sm border border-input bg-clip-padding text-base transition-[border-color,box-shadow,background-color,opacity] duration-(--duration-fast) ease-(--ease-standard) hover:border-foreground/20 has-[textarea:focus]:border-foreground/40 has-[textarea[readonly]]:bg-muted/50 has-[textarea[readonly]]:hover:border-input has-[textarea[aria-invalid=true]]:border-destructive has-[textarea:disabled]:cursor-not-allowed has-[textarea:disabled]:opacity-50 has-[textarea:disabled]:hover:border-input md:text-sm dark:has-[textarea[aria-invalid=true]]:border-destructive/50",
  {
    variants: {
      size: {
        sm: "rounded-xs [--textarea-px:--spacing(2)] [--textarea-py:--spacing(1.5)] md:text-[0.8rem]",
        default: "[--textarea-px:--spacing(2.5)] [--textarea-py:--spacing(2)]",
        lg: "[--textarea-px:--spacing(3)] [--textarea-py:--spacing(2.5)]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

type TextareaProps = Omit<React.ComponentProps<"textarea">, "className"> &
  VariantProps<typeof textareaVariants> & {
    className?: string
    /** Lines shown when empty. The field grows from here as the text wraps. */
    rows?: number
    /** Lines before the field stops growing and scrolls. Also the tallest the grab handle drags to. */
    maxRows?: number
    /** Sets aria-invalid. Form fields pass this from the schema. */
    invalid?: boolean
    /** A running count in the footer. Characters count against maxLength, words against maxWords. */
    count?: "characters" | "words"
    /** Soft word limit for count="words". The count turns destructive past it; the schema enforces it. */
    maxWords?: number
    /** Makes the bottom edge a grab handle. Drag or arrow keys set the height in whole lines, between rows and maxRows. */
    resizable?: boolean
    /** Submits the parent form on Cmd+Enter or Ctrl+Enter. */
    submitOnModEnter?: boolean
  }

function countWords(text: string) {
  const trimmed = text.trim()
  return trimmed ? trimmed.split(/\s+/).length : 0
}

function Textarea({
  className,
  size = "default",
  rows = 3,
  maxRows = 12,
  invalid,
  count,
  maxWords,
  resizable = false,
  submitOnModEnter = true,
  style,
  ref,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  ...props
}: TextareaProps) {
  const level = useElevatedLevel(TEXTAREA_LIFT)
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)
  const countId = React.useId()
  const controlled = props.value !== undefined
  const [uncontrolledText, setUncontrolledText] = React.useState(() =>
    String(props.defaultValue ?? "")
  )
  const [focusVisible, setFocusVisible] = React.useState(false)
  const text = controlled ? String(props.value ?? "") : uncontrolledText
  const [lines, setLines] = React.useState(rows)
  const describedBy = [ariaDescribedBy, count ? countId : undefined].filter(Boolean).join(" ")

  const total = count === "words" ? countWords(text) : text.length
  const limit = count === "words" ? maxWords : props.maxLength
  const over = count === "words" && limit !== undefined && total > limit
  const full = count === "characters" && limit !== undefined && total >= limit

  const setRef = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )

  React.useEffect(() => {
    ensureFocusModalityListeners()
  }, [])

  React.useEffect(() => {
    const textarea = textareaRef.current
    if (!resizable || !textarea) return
    const observer = new ResizeObserver(() => {
      const { lineHeight, paddingTop, paddingBottom } = getComputedStyle(textarea)
      const inner = textarea.clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom)
      setLines(Math.max(rows, Math.round(inner / parseFloat(lineHeight))))
    })
    observer.observe(textarea)
    return () => observer.disconnect()
  }, [resizable, rows])

  function setHeight(next: number) {
    const textarea = textareaRef.current
    if (!textarea) return
    const { minHeight, maxHeight, lineHeight, paddingTop, paddingBottom } = getComputedStyle(textarea)
    const padding = parseFloat(paddingTop) + parseFloat(paddingBottom)
    const line = parseFloat(lineHeight)
    const snapped = padding + Math.round((next - padding) / line) * line
    const height = Math.min(Math.max(snapped, parseFloat(minHeight)), parseFloat(maxHeight))
    textarea.style.setProperty("field-sizing", "fixed")
    textarea.style.height = `${height}px`
  }

  function resetHeight() {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.removeProperty("field-sizing")
    textarea.style.height = ""
  }

  return (
    <div
      className={cn(
        textareaVariants({ size }),
        SURFACE_BG[level],
        "data-focus-visible:ring-3 data-focus-visible:ring-ring/50 has-[[aria-invalid=true]]:data-focus-visible:ring-destructive/20",
        className,
      )}
      data-focus-visible={focusVisible || undefined}
      data-size={size}
      data-slot="textarea"
      onPointerDown={(event) => {
        const target = event.target as HTMLElement
        if (
          target === textareaRef.current ||
          target.closest("button, a, [role=button], [data-slot=textarea-handle]")
        )
          return
        event.preventDefault()
        textareaRef.current?.focus({ focusVisible: false } as FocusOpts)
      }}
    >
      <textarea
        aria-describedby={describedBy || undefined}
        aria-invalid={invalid || ariaInvalid || undefined}
        className="field-sizing-content w-full min-w-0 resize-none bg-transparent px-(--textarea-px) py-(--textarea-py) outline-none select-text placeholder:text-muted-foreground disabled:cursor-not-allowed"
        data-slot="textarea-control"
        rows={rows}
        style={{
          minHeight: `calc(${rows}lh + 2 * var(--textarea-py))`,
          maxHeight: `calc(${maxRows}lh + 2 * var(--textarea-py))`,
          ...style,
        }}
        {...props}
        onBlur={(event) => {
          setFocusVisible(false)
          props.onBlur?.(event)
        }}
        onChange={(event) => {
          if (!controlled) setUncontrolledText(event.currentTarget.value)
          props.onChange?.(event)
        }}
        onFocus={(event) => {
          ensureFocusModalityListeners()
          setFocusVisible(focusModality === "keyboard")
          props.onFocus?.(event)
        }}
        onKeyDown={(event) => {
          props.onKeyDown?.(event)
          if (
            submitOnModEnter &&
            !event.defaultPrevented &&
            !event.nativeEvent.isComposing &&
            event.key === "Enter" &&
            (event.metaKey || event.ctrlKey)
          ) {
            event.preventDefault()
            event.currentTarget.form?.requestSubmit()
          }
        }}
        ref={setRef}
      />
      {count ? (
        <div
          className="flex justify-end px-(--textarea-px) pb-(--textarea-py) text-xs text-muted-foreground"
          data-slot="textarea-footer"
        >
          <span
            className={cn(
              "tabular-nums",
              full && "text-foreground",
              over && "text-destructive"
            )}
            data-slot="textarea-count"
            id={countId}
          >
            {limit === undefined ? total : `${total}/${limit}`}
            {count === "words" ? (
              " words"
            ) : (
              <span className="sr-only"> characters</span>
            )}
          </span>
        </div>
      ) : null}
      {resizable ? (
        <div
          aria-disabled={props.disabled || undefined}
          aria-label="Resize"
          aria-orientation="horizontal"
          aria-valuemax={maxRows}
          aria-valuemin={rows}
          aria-valuenow={lines}
          aria-valuetext={`${lines} lines`}
          className="group/handle absolute inset-x-0 -bottom-1.5 flex h-4 cursor-row-resize touch-none justify-center outline-none aria-disabled:pointer-events-none"
          data-slot="textarea-handle"
          onDoubleClick={resetHeight}
          onKeyDown={(event) => {
            const textarea = textareaRef.current
            if (!textarea) return
            const step = parseFloat(getComputedStyle(textarea).lineHeight)
            if (event.key === "ArrowDown") setHeight(textarea.offsetHeight + step)
            else if (event.key === "ArrowUp") setHeight(textarea.offsetHeight - step)
            else if (event.key === "Enter" || event.key === "Escape") resetHeight()
            else return
            event.preventDefault()
          }}
          onPointerDown={(event) => {
            const textarea = textareaRef.current
            if (!textarea || event.button !== 0) return
            event.preventDefault()
            const handle = event.currentTarget
            handle.setPointerCapture(event.pointerId)
            handle.dataset.dragging = ""
            const root = document.documentElement
            const { cursor, userSelect } = root.style
            root.style.cursor = "row-resize"
            root.style.userSelect = "none"
            const startY = event.clientY
            const startHeight = textarea.offsetHeight
            const move = (moveEvent: PointerEvent) => setHeight(startHeight + moveEvent.clientY - startY)
            const end = () => {
              delete handle.dataset.dragging
              root.style.cursor = cursor
              root.style.userSelect = userSelect
              handle.removeEventListener("pointermove", move)
              handle.removeEventListener("pointerup", end)
              handle.removeEventListener("pointercancel", end)
              handle.removeEventListener("lostpointercapture", end)
            }
            handle.addEventListener("pointermove", move)
            handle.addEventListener("pointerup", end)
            handle.addEventListener("pointercancel", end)
            handle.addEventListener("lostpointercapture", end)
          }}
          role="separator"
          tabIndex={props.disabled ? -1 : 0}
        >
          <span className="mt-[3px] h-1 w-8 rounded-full bg-foreground/15 transition-[background-color,width] duration-(--duration-fast) ease-(--ease-standard) group-hover/handle:w-10 group-hover/handle:bg-foreground/30 group-focus-visible/handle:w-10 group-focus-visible/handle:bg-ring group-data-dragging/handle:w-10 group-data-dragging/handle:bg-foreground/40" />
        </div>
      ) : null}
    </div>
  )
}

export { Textarea, textareaVariants, type TextareaProps }
