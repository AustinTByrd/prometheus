"use client"

import * as React from "react"

import { FormFieldWrapper } from "@/components/form-field-wrapper"
import { Input } from "@/components/ui/input"

export function FormFieldInput({
  label,
  description,
  error,
  id,
  wrapperClassName,
  ...props
}: React.ComponentProps<typeof Input> & {
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
      <Input aria-invalid={error ? true : undefined} id={inputId} {...props} />
    </FormFieldWrapper>
  )
}
