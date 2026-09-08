"use client"

import type * as React from "react"

import { FormFieldWrapper } from "@/components/form-field-wrapper"
import { Textarea } from "@/components/ui/textarea"

export function FormFieldTextarea({
  label,
  description,
  error,
  id,
  ...props
}: React.ComponentProps<typeof Textarea> & {
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
      <Textarea
        aria-invalid={error ? true : undefined}
        id={inputId}
        {...props}
      />
    </FormFieldWrapper>
  )
}
