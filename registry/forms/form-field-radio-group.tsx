"use client"

import * as React from "react"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

export type FormFieldRadioOption = {
  label: React.ReactNode
  value: string
  description?: React.ReactNode
  disabled?: boolean
}

export function FormFieldRadioGroup({
  label,
  description,
  error,
  name,
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  required,
  orientation = "vertical",
  className,
  wrapperClassName,
}: {
  label: React.ReactNode
  description?: React.ReactNode
  error?: React.ReactNode
  name?: string
  options: FormFieldRadioOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  required?: boolean
  orientation?: "vertical" | "horizontal"
  className?: string
  wrapperClassName?: string
}) {
  const generatedId = React.useId()

  return (
    <FieldSet
      className={cn("gap-3", wrapperClassName)}
      data-disabled={disabled ? true : undefined}
      data-invalid={error ? true : undefined}
    >
      <div className="flex flex-col gap-1">
        <FieldLegend className="mb-0" variant="label">
          {label}
        </FieldLegend>
        {description ? (
          <FieldDescription>{description}</FieldDescription>
        ) : null}
      </div>
      <RadioGroup
        aria-invalid={error ? true : undefined}
        className={cn(
          orientation === "horizontal" && "flex flex-wrap gap-4",
          className
        )}
        defaultValue={defaultValue}
        disabled={disabled}
        name={name}
        onValueChange={(nextValue) => onValueChange?.(String(nextValue))}
        required={required}
        value={value}
      >
        {options.map((option) => {
          const itemId = `${generatedId}-${option.value}`
          const itemDisabled = disabled || option.disabled

          return (
            <Field
              className="w-fit"
              data-disabled={itemDisabled ? true : undefined}
              data-invalid={error ? true : undefined}
              key={option.value}
              orientation="horizontal"
            >
              <RadioGroupItem
                aria-invalid={error ? true : undefined}
                disabled={itemDisabled}
                id={itemId}
                value={option.value}
              />
              <FieldContent>
                <FieldLabel className="font-normal" htmlFor={itemId}>
                  {option.label}
                </FieldLabel>
                {option.description ? (
                  <FieldDescription>{option.description}</FieldDescription>
                ) : null}
              </FieldContent>
            </Field>
          )
        })}
      </RadioGroup>
      {error ? <FieldError>{error}</FieldError> : null}
    </FieldSet>
  )
}
