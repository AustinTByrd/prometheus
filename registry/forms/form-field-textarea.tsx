"use client"

import * as React from "react"

import { FormFieldWrapper } from "@/components/form-field-wrapper"
import { Textarea } from "@/components/ui/textarea"

export function FormFieldTextarea({
  label,
  description,
  error,
  id,
  wrapperClassName,
  ...props
}: React.ComponentProps<typeof Textarea> & {
  label: React.ReactNode
  description?: React.ReactNode
  error?: React.ReactNode
  wrapperClassName?: string
}) {
  const generatedId = React.useId()
  const inputId = id ?? props.name ?? generatedId

  return (
    <FormFieldWrapper
      className={wrapperClassName}
      description={description}
      disabled={props.disabled}
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
