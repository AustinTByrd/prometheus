"use client"

import * as React from "react"

import { FormFieldWrapper } from "@/components/form-field-wrapper"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export type FormFieldSelectOption = {
  label: string
  value: string
  disabled?: boolean
}

export function FormFieldSelect({
  label,
  description,
  error,
  id,
  name,
  placeholder = "Select…",
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  required,
  className,
  wrapperClassName,
}: {
  label: React.ReactNode
  description?: React.ReactNode
  error?: React.ReactNode
  id?: string
  name?: string
  placeholder?: string
  options: FormFieldSelectOption[]
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  disabled?: boolean
  required?: boolean
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
    >
      <Select
        defaultValue={defaultValue}
        disabled={disabled}
        items={options}
        name={name}
        onValueChange={onValueChange}
        required={required}
        value={value}
      >
        <SelectTrigger
          aria-invalid={error ? true : undefined}
          className={cn("w-full", className)}
          id={fieldId}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem
                disabled={option.disabled}
                key={option.value}
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </FormFieldWrapper>
  )
}
