// @prometheus 0.2.0
"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { CheckIcon, MinusIcon } from "@heroicons/react/16/solid"
import { cn } from "@/lib/utils"

/** Shared box chrome for Checkbox and CheckboxGroup items. */
const checkboxBoxClassName =
  "relative inline-flex size-4 origin-center shrink-0 items-center justify-center rounded-[5px] border-[1.5px] border-solid transition-[border-color,background-color,scale] duration-80 ease-(--ease-standard)"

/**
 * Presentational check square used by CheckboxGroup rows (and kept in lockstep
 * with the interactive Checkbox).
 */
function CheckboxGlyph({
  checked,
  indeterminate = false,
  preview = false,
  className,
}: {
  checked: boolean
  /** Dash instead of a check: some, not all, of what this box stands for is on. */
  indeterminate?: boolean
  /** Soft check while the row is hovered but not yet checked. */
  preview?: boolean
  className?: string
}) {
  const filled = indeterminate || checked
  const Icon = indeterminate ? MinusIcon : CheckIcon
  return (
    <span
      aria-hidden="true"
      className={cn(
        checkboxBoxClassName,
        filled
          ? "border-transparent bg-foreground"
          : "border-black/25 bg-transparent dark:border-white/25",
        className,
      )}
    >
      <Icon
        className={cn(
          "pointer-events-none size-3 transition-opacity duration-80",
          filled
            ? "text-background opacity-100"
            : preview
              ? "text-foreground opacity-20"
              : "opacity-0",
        )}
      />
    </span>
  )
}

/**
 * A hairline square. Checked, it fills with foreground and a surface-colored
 * check. Pair with Field and FieldLabel for its text.
 */
function Checkbox({
  className,
  checked,
  defaultChecked = false,
  indeterminate = false,
  onCheckedChange,
  onKeyDown,
  ref: forwardedRef,
  ...props
}: Omit<
  CheckboxPrimitive.Root.Props,
  "checked" | "defaultChecked" | "onCheckedChange" | "indeterminate"
> & {
  checked?: boolean
  defaultChecked?: boolean
  /** Dash instead of a check: some, not all, of what this box stands for is on. */
  indeterminate?: boolean
  onCheckedChange?: (checked: boolean) => void
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultChecked)
  const isChecked = checked ?? uncontrolled
  const filled = indeterminate || isChecked
  return (
    <CheckboxPrimitive.Root
      ref={forwardedRef}
      checked={isChecked}
      className={cn(
        "group/checkbox cursor-pointer border-black/25 bg-transparent p-0 text-background outline-none dark:border-white/25",
        checkboxBoxClassName,
        "[&+input]:absolute! [&+input]:inset-auto!",
        "motion-safe:active:scale-[0.85]",
        "data-checked:border-transparent data-checked:bg-foreground",
        "data-indeterminate:border-transparent data-indeterminate:bg-foreground",
        "aria-invalid:not-data-checked:not-data-indeterminate:border-destructive/50",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      data-slot="checkbox"
      indeterminate={indeterminate}
      onCheckedChange={(next) => {
        if (checked === undefined) setUncontrolled(next)
        onCheckedChange?.(next)
      }}
      onKeyDown={(event) => {
        const card = event.currentTarget.closest("[data-slot=field-label]")
        if (
          event.key === "Enter" &&
          !event.repeat &&
          card?.querySelector(":scope > [data-slot=field]")
        ) {
          event.preventDefault()
          event.currentTarget.click()
        }
        onKeyDown?.(event)
      }}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        keepMounted
        render={(indicatorProps) => {
          const Icon = indeterminate ? MinusIcon : CheckIcon
          return (
            <Icon
              {...indicatorProps}
              aria-hidden="true"
              className={cn(
                "pointer-events-none size-3 transition-opacity duration-80",
                filled
                  ? "text-background opacity-100"
                  : "text-foreground opacity-0 group-hover/checkbox:opacity-20 group-hover/field:opacity-20",
              )}
            />
          )
        }}
      />
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox, CheckboxGlyph, checkboxBoxClassName }
