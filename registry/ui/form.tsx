// @prometheus 0.2.0
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  type SubmitHandler,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form"
import type { ZodType } from "zod"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input, type InputProps } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea, type TextareaProps } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const FormPendingContext = React.createContext(false)

type FormControlProps = {
  id: string
  "aria-invalid": true | undefined
  "aria-describedby": string | undefined
}

function usePrometheusForm<T extends FieldValues>(
  schema: ZodType<T>,
  props?: Omit<UseFormProps<T>, "resolver">
) {
  return useForm<T>({
    ...props,
    resolver: zodResolver(schema),
  })
}

function Form<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
}: {
  form: UseFormReturn<T>
  onSubmit: SubmitHandler<T>
  children: React.ReactNode
  className?: string
}) {
  const [pending, setPending] = React.useState(false)

  return (
    <FormProvider {...form}>
      <FormPendingContext.Provider value={pending}>
        <form
          className={className}
          noValidate
          onSubmit={form.handleSubmit(async (values) => {
            setPending(true)
            try {
              await onSubmit(values)
            } finally {
              setPending(false)
            }
          })}
        >
          <FieldGroup>{children}</FieldGroup>
        </form>
      </FormPendingContext.Provider>
    </FormProvider>
  )
}

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  labelAside,
  description,
  orientation,
  disabled,
  children,
}: {
  name: TName
  label: React.ReactNode
  /** Quieter text beside the label, such as "Optional" or "Required". */
  labelAside?: React.ReactNode
  description?: React.ReactNode
  orientation?: "vertical" | "horizontal" | "responsive"
  disabled?: boolean
  children: (
    field: ControllerRenderProps<TFieldValues, TName>,
    invalid: boolean,
    /** Spread onto the control so the label, description, and error point at it. */
    control: FormControlProps
  ) => React.ReactNode
}) {
  const { control } = useFormContext<TFieldValues>()
  const id = React.useId()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const controlId = `${id}-control`
        const descriptionId = description ? `${id}-description` : undefined
        const errorId = fieldState.error ? `${id}-error` : undefined

        return (
          <Field
            data-disabled={disabled || undefined}
            data-invalid={fieldState.invalid || undefined}
            orientation={orientation}
          >
            <FieldLabel htmlFor={controlId} className="items-baseline">
              {label}
              {labelAside ? (
                <span className="text-xs font-normal text-muted-foreground" data-slot="field-label-aside">
                  {labelAside}
                </span>
              ) : null}
            </FieldLabel>
            {children(field, fieldState.invalid, {
              id: controlId,
              "aria-invalid": fieldState.invalid || undefined,
              "aria-describedby": [descriptionId, errorId].filter(Boolean).join(" ") || undefined,
            })}
            {description ? (
              <FieldDescription id={descriptionId}>{description}</FieldDescription>
            ) : null}
            {fieldState.error ? <FieldError errors={[fieldState.error]} id={errorId} /> : null}
          </Field>
        )
      }}
    />
  )
}

function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  labelAside,
  description,
  orientation,
  disabled,
  readOnly,
  ...props
}: Omit<
  InputProps,
  "name" | "id" | "value" | "defaultValue" | "onChange" | "onBlur" | "onValueChange" | "invalid" | "label" | "labelAside"
> & {
  name: TName
  label: React.ReactNode
  labelAside?: React.ReactNode
  description?: React.ReactNode
  orientation?: "vertical" | "horizontal" | "responsive"
}) {
  const pending = React.useContext(FormPendingContext)

  return (
    <FormField<TFieldValues, TName>
      description={description}
      disabled={disabled}
      label={label}
      labelAside={labelAside}
      name={name}
      orientation={orientation}
    >
      {(field, invalid, control) => (
        <Input
          {...props}
          {...control}
          disabled={disabled}
          invalid={invalid}
          name={field.name}
          onBlur={field.onBlur}
          onChange={field.onChange}
          readOnly={readOnly || pending}
          ref={field.ref}
          value={field.value ?? ""}
        />
      )}
    </FormField>
  )
}

function FormTextarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  labelAside,
  description,
  orientation,
  disabled,
  readOnly,
  ...props
}: Omit<TextareaProps, "name" | "id" | "value" | "defaultValue" | "onChange" | "onBlur" | "invalid" | "ref"> & {
  name: TName
  label: React.ReactNode
  labelAside?: React.ReactNode
  description?: React.ReactNode
  orientation?: "vertical" | "horizontal" | "responsive"
}) {
  const pending = React.useContext(FormPendingContext)

  return (
    <FormField<TFieldValues, TName>
      description={description}
      disabled={disabled}
      label={label}
      labelAside={labelAside}
      name={name}
      orientation={orientation}
    >
      {(field, invalid, control) => (
        <Textarea
          {...props}
          {...control}
          disabled={disabled}
          invalid={invalid}
          name={field.name}
          onBlur={field.onBlur}
          onChange={field.onChange}
          readOnly={readOnly || pending}
          ref={field.ref}
          value={field.value ?? ""}
        />
      )}
    </FormField>
  )
}

function FormRootError() {
  const {
    formState: { errors },
  } = useFormContext()
  const message = errors.root?.message

  if (!message) return null

  return <FieldError>{message}</FieldError>
}

function FormSubmit({
  children,
  pendingLabel = "Saving",
  className,
}: {
  children: React.ReactNode
  pendingLabel?: string
  className?: string
}) {
  const pending = React.useContext(FormPendingContext)

  return (
    <Button className={cn(className)} disabled={pending} type="submit">
      {pending ? <Spinner data-icon="inline-start" /> : null}
      {pending ? pendingLabel : children}
    </Button>
  )
}

export {
  Form,
  FormField,
  FormInput,
  FormRootError,
  FormSubmit,
  FormTextarea,
  usePrometheusForm,
  type FormControlProps,
}
