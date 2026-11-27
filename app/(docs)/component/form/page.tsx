import type { Metadata } from "next"
import Link from "next/link"

import { FormDemo } from "@/app/demos/form-docs"
import { CodeBlock } from "@/components/site/code-block"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
} from "@/components/site/docs-article"
import { MachineSections, statesToc } from "@/components/site/machine-sections"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Form — Prometheus",
  description:
    "react-hook-form and zod. Field errors, a root error, and a submit button that shows Spinner while pending.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "example", title: "Example" },
]

const sample = `const schema = z.object({
  email: z.string().email("Enter a valid email."),
})

const form = usePrometheusForm(schema, {
  defaultValues: { email: "" },
})

<Form
  form={form}
  onSubmit={async (values) => {
    const error = await save(values)
    if (error) {
      form.setError("root", { message: error })
    }
  }}
>
  <FormInput label="Email" name="email" type="email" />
  <FormRootError />
  <FormSubmit>Save</FormSubmit>
</Form>`

export default function FormPage() {
  const item = getCatalogItem("form")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={[...toc, ...statesToc("form")]}>
      <DocsSection id="example" title="Example">
        <DocsProse>
          Submit an empty name to see a field error. The values stay. Submit{" "}
          <code>a@taken.test</code> to see a root error after the pending
          state. A successful save keeps the values and confirms below the
          button.
        </DocsProse>
        <FormDemo />
        <CodeBlock>{sample}</CodeBlock>
      </DocsSection>
      <MachineSections slug="form" />
    </DocsArticle>
  )
}
