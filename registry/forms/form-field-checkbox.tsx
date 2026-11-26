"use client"

import * as React from "react"

import { FormFieldWrapper } from "@/components/form-field-wrapper"
import { Checkbox } from "@/components/ui/checkbox"

export function FormFieldCheckbox({
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
  className?: string
  wrapperClassName?: string
}) {
  const generatedId = React.useId()
  const fieldId = id ?? name ?? generatedId

  return (
    <FormFieldWrapper
      className={wrapperClassName}
      description={description}
      disabled={disabled}
      error={error}
      htmlFor={fieldId}
      label={label}
      orientation="horizontal"
    >
      <Checkbox
        aria-invalid={error ? true : undefined}
        checked={checked}
        className={className}
        defaultChecked={defaultChecked}
        disabled={disabled}
        id={fieldId}
        name={name}
        onCheckedChange={onCheckedChange}
        required={required}
        value={value}
      />
    </FormFieldWrapper>
  )
}
