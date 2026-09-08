"use client"

import type * as React from "react"

import {
  Field,
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
}: {
  label: string
  htmlFor?: string
  description?: string
  error?: string
  children: React.ReactNode
  orientation?: "vertical" | "horizontal"
}) {
  return (
    <Field data-invalid={error ? true : undefined} orientation={orientation}>
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      {children}
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  )
}
