"use client"

import * as React from "react"
import { EnvelopeIcon } from "@heroicons/react/16/solid"
import { z } from "zod"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormField,
  FormInput,
  FormRootError,
  FormSubmit,
  FormTextarea,
  usePrometheusForm,
} from "@/components/ui/form"
import { Elevated } from "@/lib/elevated"

const schema = z
  .object({
    name: z.string().min(1, "Enter a name."),
    email: z.string().email("Enter a valid email."),
    note: z.string().max(200, "Keep the note under 200 characters."),
    agree: z.boolean(),
  })
  .refine((value) => value.agree, {
    message: "Confirm to continue.",
    path: ["agree"],
  })

type OrderValues = z.infer<typeof schema>

export function FormDemo() {
  const [saved, setSaved] = React.useState(false)
  const form = usePrometheusForm(schema, {
    defaultValues: { name: "", email: "", note: "", agree: false },
  })

  async function onSubmit(values: OrderValues) {
    await new Promise((resolve) => setTimeout(resolve, 600))

    if (values.email.endsWith("@taken.test")) {
      form.setError("root", {
        message: "That email is already in use. Try another.",
      })
      setSaved(false)
      return
    }

    form.clearErrors("root")
    setSaved(true)
  }

  return (
    <Elevated className="p-6" offset={2} shadowLevel={2}>
      <Form form={form} onSubmit={onSubmit}>
        <FormInput autoComplete="name" label="Name" name="name" />
        <FormInput
          autoComplete="email"
          description="Use a @taken.test address to see a root error."
          inputMode="email"
          label="Email"
          name="email"
          placeholder="you@example.com"
          start={<EnvelopeIcon />}
          type="email"
        />
        <FormTextarea
          description="Delivery details or a gift message."
          label="Note"
          maxLength={200}
          name="note"
          count="characters"
        />
        <FormField label="Email me about this order" name="agree" orientation="horizontal">
          {(field, _invalid, control) => (
            <Checkbox
              {...control}
              checked={field.value}
              name={field.name}
              onBlur={field.onBlur}
              onCheckedChange={field.onChange}
            />
          )}
        </FormField>
        <FormRootError />
        <FormSubmit>Save order</FormSubmit>
        {saved ? (
          <p className="text-sm text-muted-foreground">Order saved.</p>
        ) : null}
      </Form>
    </Elevated>
  )
}
