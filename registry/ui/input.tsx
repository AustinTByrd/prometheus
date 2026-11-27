// @prometheus 0.2.0
"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cva, type VariantProps } from "class-variance-authority"
import { XMarkIcon } from "@heroicons/react/16/solid"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useElevatedLevel } from "@/lib/elevated"
import { SURFACE_BG } from "@/lib/surface-classes"
import { cn } from "@/lib/utils"

/** One step above the substrate, so the field reads as a well on any surface. */
const INPUT_LIFT = 1

/**
 * Text inputs match :focus-visible on pointer focus (browser heuristic).
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

const inputVariants = cva(
  "group/input relative flex w-full min-w-0 cursor-text items-center rounded-sm border bg-clip-padding text-base transition-[border-color,box-shadow,background-color,opacity] duration-(--duration-fast) ease-(--ease-standard) has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50 md:text-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-input hover:border-foreground/20 has-[input:focus]:border-foreground/40 has-[input[readonly]]:bg-muted/50 has-[input[readonly]]:hover:border-input has-[input[aria-invalid=true]]:border-destructive has-[input:disabled]:hover:border-input dark:has-[input[aria-invalid=true]]:border-destructive/50",
        filled:
          "border-transparent bg-muted hover:bg-[color-mix(in_oklab,var(--foreground)_5%,var(--muted))] has-[input:focus]:bg-[color-mix(in_oklab,var(--foreground)_8%,var(--muted))] has-[input[readonly]]:bg-muted/50 has-[input[readonly]]:hover:bg-muted/50 has-[input[aria-invalid=true]]:border-destructive/50 has-[input[aria-invalid=true]]:bg-destructive/10 has-[input:disabled]:hover:bg-muted dark:has-[input[aria-invalid=true]]:border-destructive/40 dark:has-[input[aria-invalid=true]]:bg-destructive/15",
      },
      size: {
        sm: "h-7 gap-1.5 rounded-xs px-2 md:text-[0.8rem] [&_svg:not([class*='size-'])]:size-3.5",
        default: "h-8 gap-2 px-2.5",
        lg: "h-9 gap-2 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type InputProps = Omit<InputPrimitive.Props, "size" | "className"> &
  VariantProps<typeof inputVariants> & {
    className?: string
    ref?: React.Ref<HTMLInputElement>
    /** Icon or text before the value, such as a search icon or a currency sign. */
    start?: React.ReactNode
    /** Icon, text, or a small button after the value. */
    end?: React.ReactNode
    /** Async work on the value, such as an availability check. Shows a Spinner and sets aria-busy. */
    pending?: boolean
    /** Sets aria-invalid. Form fields pass this from the schema. */
    invalid?: boolean
    /** A clear button once there is a value. On by default for type="search". */
    clearable?: boolean
    /** Visible label above the field, linked to the input. */
    label?: React.ReactNode
    /** Quieter text beside the label, such as "Optional" or "Required". Works without a label too. */
    labelAside?: React.ReactNode
  }

function Input({
  className,
  variant = "default",
  size = "default",
  start,
  end,
  pending = false,
  invalid,
  clearable,
  label,
  labelAside,
  ref,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  ...props
}: InputProps) {
  const level = useElevatedLevel(INPUT_LIFT)
  const generatedId = React.useId()
  const inputId = props.id ?? generatedId
  const asideId = labelAside && !label ? `${inputId}-aside` : undefined
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const controlled = props.value !== undefined
  const [uncontrolledFilled, setUncontrolledFilled] = React.useState(
    () => String(props.defaultValue ?? "").length > 0
  )
  const [focusVisible, setFocusVisible] = React.useState(false)
  const filled = controlled ? String(props.value ?? "").length > 0 : uncontrolledFilled
  const showClear =
    (clearable ?? props.type === "search") && filled && !props.disabled && !props.readOnly

  React.useEffect(() => {
    ensureFocusModalityListeners()
  }, [])

  function clear() {
    const input = inputRef.current
    if (!input) return
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, "")
    input.dispatchEvent(new Event("input", { bubbles: true }))
    input.focus({ focusVisible: false } as FocusOptions & { focusVisible?: boolean })
  }

  const setRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )

  const field = (
      <div
        className={cn(
          inputVariants({ variant, size }),
          variant === "default" && SURFACE_BG[level],
          "data-focus-visible:ring-3 data-focus-visible:ring-ring/50 has-[[aria-invalid=true]]:data-focus-visible:ring-destructive/20",
          className,
        )}
        data-focus-visible={focusVisible || undefined}
        data-pending={pending || undefined}
        data-size={size}
        data-slot="input"
        data-variant={variant}
        onPointerDown={(event) => {
          const target = event.target as HTMLElement
          if (target === inputRef.current || target.closest("button, a, [role=button]")) return
          event.preventDefault()
          inputRef.current?.focus({
            focusVisible: false,
          } as FocusOptions & { focusVisible?: boolean })
        }}
      >
        {start ? (
          <span className="flex shrink-0 items-center text-muted-foreground" data-slot="input-start">
            {start}
          </span>
        ) : null}
        <InputPrimitive
          aria-busy={pending || undefined}
          aria-describedby={[asideId, ariaDescribedBy].filter(Boolean).join(" ") || undefined}
          aria-invalid={invalid || ariaInvalid || undefined}
          id={inputId}
          className="h-full w-full min-w-0 flex-1 bg-transparent outline-none select-text placeholder:text-muted-foreground disabled:cursor-not-allowed [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground"
          data-slot="input-control"
          ref={setRef}
          {...props}
          onBlur={(event) => {
            setFocusVisible(false)
            props.onBlur?.(event)
          }}
          onChange={(event) => {
            if (!controlled) setUncontrolledFilled(event.currentTarget.value.length > 0)
            props.onChange?.(event)
          }}
          onFocus={(event) => {
            ensureFocusModalityListeners()
            setFocusVisible(focusModality === "keyboard")
            props.onFocus?.(event)
          }}
        />
        {showClear ? (
          <Button
            aria-label="Clear"
            className="-mr-1 text-muted-foreground hover:text-foreground"
            data-slot="input-clear"
            onClick={clear}
            size="icon-xs"
            variant="ghost"
          >
            <XMarkIcon />
          </Button>
        ) : null}
        {pending ? <Spinner className="text-muted-foreground" data-slot="input-spinner" /> : null}
        {end ? (
          <span className="flex shrink-0 items-center text-muted-foreground" data-slot="input-end">
            {end}
          </span>
        ) : null}
      </div>
  )

  if (!label && !labelAside) return field

  const aside = labelAside ? (
    <span className="text-xs font-normal text-muted-foreground" data-slot="input-label-aside" id={asideId}>
      {labelAside}
    </span>
  ) : null

  return (
    <div
      className="flex w-full flex-col gap-2"
      data-disabled={props.disabled || undefined}
      data-slot="input-field"
    >
      <div className="flex items-baseline gap-1.5 text-sm leading-none in-data-disabled:opacity-50">
        {label ? (
          <label
            className="flex items-baseline gap-1.5 font-medium text-foreground select-none"
            data-slot="input-label"
            htmlFor={inputId}
          >
            {label}
            {aside}
          </label>
        ) : (
          aside
        )}
      </div>
      {field}
    </div>
  )
}

export { Input, inputVariants, type InputProps }
