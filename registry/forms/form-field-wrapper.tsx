"use client"

import type * as React from "react"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

export function FormFieldWrapper({
  label,
  htmlFor,
  description,
  error,
  children,
  orientation = "vertical",
  disabled,
  className,
}: {
  label: React.ReactNode
  htmlFor?: string
  description?: React.ReactNode
  error?: React.ReactNode
  children: React.ReactNode
  orientation?: "vertical" | "horizontal"
  disabled?: boolean
  className?: string
}) {
  if (orientation === "horizontal") {
    return (
      <Field
        className={className}
        data-disabled={disabled ? true : undefined}
        data-invalid={error ? true : undefined}
        orientation="horizontal"
      >
        {children}
        <FieldContent>
          <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
          {description ? (
            <FieldDescription>{description}</FieldDescription>
          ) : null}
          {error ? <FieldError>{error}</FieldError> : null}
        </FieldContent>
      </Field>
    )
  }

  return (
    <Field
      className={className}
      data-disabled={disabled ? true : undefined}
      data-invalid={error ? true : undefined}
      orientation={orientation}
    >
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      {children}
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  )
}
