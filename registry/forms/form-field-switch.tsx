"use client"

import * as React from "react"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export function FormFieldSwitch({
  label,
  description,
  error,
  id,
  name,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  required,
  value,
  size = "default",
  className,
  wrapperClassName,
}: {
  label: React.ReactNode
  description?: React.ReactNode
  error?: React.ReactNode
  id?: string
  name?: string
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  required?: boolean
  value?: string
  size?: "sm" | "default"
  className?: string
  wrapperClassName?: string
}) {
  const generatedId = React.useId()
  const fieldId = id ?? name ?? generatedId

  return (
    <Field
      className={cn("justify-between", wrapperClassName)}
      data-disabled={disabled ? true : undefined}
      data-invalid={error ? true : undefined}
      orientation="horizontal"
    >
      <FieldContent>
        <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
        {description ? (
          <FieldDescription>{description}</FieldDescription>
        ) : null}
        {error ? <FieldError>{error}</FieldError> : null}
      </FieldContent>
      <Switch
        aria-invalid={error ? true : undefined}
        checked={checked}
        className={className}
        defaultChecked={defaultChecked}
        disabled={disabled}
        id={fieldId}
        name={name}
        onCheckedChange={onCheckedChange}
        required={required}
        size={size}
        value={value}
      />
    </Field>
  )
}
