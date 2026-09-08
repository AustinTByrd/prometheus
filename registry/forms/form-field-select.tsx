"use client"

import { FormFieldWrapper } from "@/components/form-field-wrapper"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function FormFieldSelect({
  label,
  description,
  error,
  id,
  placeholder = "Select…",
  options,
  value,
  onValueChange,
}: {
  label: string
  description?: string
  error?: string
  id?: string
  placeholder?: string
  options: Array<{ label: string; value: string }>
  value?: string
  onValueChange?: (value: string | null) => void
}) {
  return (
    <FormFieldWrapper description={description} error={error} htmlFor={id} label={label}>
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger
          aria-invalid={error ? true : undefined}
          className="w-full"
          id={id}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </FormFieldWrapper>
  )
}
