"use client"

import type * as React from "react"

import { Input } from "@/components/ui/input"
import { FormFieldWrapper } from "@/components/form-field-wrapper"

export function FormFieldInput({
  label,
  description,
  error,
  id,
  ...props
}: React.ComponentProps<typeof Input> & {
  label: string
  description?: string
  error?: string
}) {
  const inputId = id ?? props.name

  return (
    <FormFieldWrapper
      description={description}
      error={error}
      htmlFor={inputId}
      label={label}
    >
      <Input aria-invalid={error ? true : undefined} id={inputId} {...props} />
    </FormFieldWrapper>
  )
}
