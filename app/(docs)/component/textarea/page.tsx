import type { Metadata } from "next"
import Link from "next/link"

import {
  TextareaFooterDemo,
  TextareaGrowDemo,
  TextareaSizeDemo,
  TextareaStateDemo,
} from "@/app/demos/textarea-docs"
import { CodeBlock } from "@/components/site/code-block"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"
import { MachineSections, statesToc } from "@/components/site/machine-sections"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Textarea — Prometheus",
  description:
    "Multi-line text field on the Input tokens: grows with the text between rows and maxRows, a character or word count, an optional grab handle, and invalid, read-only, and disabled states. Form wires it up as FormTextarea.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "grow", title: "Growth" },
  { id: "footer", title: "Footer" },
  { id: "size", title: "Size" },
  { id: "state", title: "State" },
  { id: "form", title: "In a form" },
  { id: "api", title: "API" },
]

const formSample = `const schema = z.object({
  note: z.string().max(200, "Keep the note under 200 characters."),
})

<Form form={form} onSubmit={save}>
  <FormTextarea
    count="characters"
    description="Delivery details or a gift message."
    label="Note"
    maxLength={200}
    name="note"
  />
  <FormSubmit>Save</FormSubmit>
</Form>`

export default function TextareaPage() {
  const item = getCatalogItem("textarea")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={[...toc, ...statesToc("textarea")]}>
      <DocsSection id="grow" title="Growth">
        <DocsProse>
          <code>rows</code> sets the empty height and <code>maxRows</code> the
          tallest it gets. In between, the field fits its text, so short
          answers stay compact and long ones never need a drag handle. Past{" "}
          <code>maxRows</code> it scrolls.
        </DocsProse>
        <TextareaGrowDemo />
      </DocsSection>
      <DocsSection id="footer" title="Footer">
        <DocsProse>
          <code>count=&quot;characters&quot;</code> shows a running count
          against <code>maxLength</code>, which stops typing and turns the
          count foreground at the limit. <code>count=&quot;words&quot;</code>{" "}
          counts words against <code>maxWords</code>, a soft limit: the count
          turns destructive past it and the schema decides. Either count joins{" "}
          <code>aria-describedby</code>. <code>resizable</code> turns the bottom
          edge into a grab handle. Drag anywhere along it, or focus it and press
          the arrow keys. The height moves a whole line at a time, so text is
          never cut in half, and stays between <code>rows</code> and{" "}
          <code>maxRows</code>. Double-click the edge or press Enter to go back
          to fitting the text.
        </DocsProse>
        <TextareaFooterDemo />
      </DocsSection>

      <DocsSection id="size" title="Size">
        <DocsProse>
          Sizes match Input&apos;s padding and type, so a textarea and an input
          of the same size line up in a form. Text stays 16px below{" "}
          <code>md</code> so iOS keeps the zoom where it is on focus.
        </DocsProse>
        <TextareaSizeDemo />
      </DocsSection>

      <DocsSection id="state" title="State">
        <DocsProse>
          The same looks as Input. The border darkens a little on hover and a
          little more on focus. The highlight ring appears only on keyboard
          focus. <code>invalid</code> sets <code>aria-invalid</code> and turns
          the border destructive. Read-only keeps the text selectable on a
          muted fill. Disabled fades to half and leaves the submit.
        </DocsProse>
        <TextareaStateDemo />
      </DocsSection>

      <DocsSection id="form" title="In a form">
        <DocsProse>
          Inside <Link href="/component/form">Form</Link>, use{" "}
          <code>FormTextarea</code>. Like <code>FormInput</code>, it registers
          the field, links the label, sets <code>invalid</code> from the
          schema, points <code>aria-describedby</code> at the description and
          the error, and turns read-only while the form submits. Match{" "}
          <code>maxLength</code> to the schema&apos;s <code>max</code> so the
          count and the error agree.
        </DocsProse>
        <CodeBlock>{formSample}</CodeBlock>
      </DocsSection>

      <DocsSection id="api" title="API">
        <DocsProse>
          Accepts every native <code>textarea</code> prop, plus:
        </DocsProse>
        <DocsTable
          headers={["Prop", "Values", "Default"]}
          rows={[
            [<code key="p">size</code>, "sm · default · lg", <code key="d">default</code>],
            [<code key="p">rows</code>, "number", <code key="d">3</code>],
            [<code key="p">maxRows</code>, "number", <code key="d">12</code>],
            [<code key="p">count</code>, "characters · words", "—"],
            [<code key="p">maxWords</code>, "number", "—"],
            [<code key="p">resizable</code>, "boolean", <code key="d">false</code>],
            [<code key="p">invalid</code>, "boolean", <code key="d">false</code>],
            [<code key="p">submitOnModEnter</code>, "boolean", <code key="d">true</code>],
          ]}
        />
        <DocsProse>
          Cmd+Enter or Ctrl+Enter submits the parent form; turn it off with{" "}
          <code>submitOnModEnter=&#123;false&#125;</code>.{" "}
          <code>className</code> lands on the bordered box. <code>ref</code>,{" "}
          <code>id</code>, and every native attribute reach the{" "}
          <code>&lt;textarea&gt;</code>. <code>FormTextarea</code> takes the
          same props plus <code>name</code>, <code>label</code>,{" "}
          <code>description</code>, and <code>orientation</code>.
        </DocsProse>
      </DocsSection>
      <MachineSections slug="textarea" />
    </DocsArticle>
  )
}
