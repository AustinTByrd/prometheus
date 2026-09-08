"use client"

import { FormFieldWrapper } from "@/components/form-field-wrapper"
import { Checkbox } from "@/components/ui/checkbox"

export function FormFieldCheckbox({
  label,
  description,
  error,
  id,
  checked,
  onCheckedChange,
  disabled,
}: {
  label: string
  description?: string
  error?: string
  id?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <FormFieldWrapper
      description={description}
      error={error}
      htmlFor={id}
      label={label}
      orientation="horizontal"
    >
      <Checkbox
        aria-invalid={error ? true : undefined}
        checked={checked}
        disabled={disabled}
        id={id}
        onCheckedChange={onCheckedChange}
      />
    </FormFieldWrapper>
  )
}
