import type { Metadata } from "next"
import Link from "next/link"

import {
  InputLabelDemo,
  InputSizeDemo,
  InputSlotDemo,
  InputStateDemo,
  InputVariantDemo,
} from "@/app/demos/input-docs"
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
  title: "Input — Prometheus",
  description:
    "Base UI text input on Prometheus tokens: a bordered default or a filled muted wash, control-height sizes, start and end slots, a pending check, and invalid, read-only, and disabled states. Form wires it up as FormInput.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "label", title: "Label" },
  { id: "slots", title: "Slots" },
  { id: "variant", title: "Variant" },
  { id: "size", title: "Size" },
  { id: "state", title: "State" },
  { id: "form", title: "In a form" },
  { id: "api", title: "API" },
]

const formSample = `<Form form={form} onSubmit={save}>
  <FormInput
    autoComplete="email"
    description="We send the receipt here."
    label="Email"
    name="email"
    start={<EnvelopeIcon />}
    type="email"
  />
  <FormSubmit>Save</FormSubmit>
</Form>`

export default function InputPage() {
  const item = getCatalogItem("input")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={[...toc, ...statesToc("input")]}>
      <DocsSection id="label" title="Label">
        <DocsProse>
          <code>label</code> puts a visible label above the field and links
          it to the input, so a press on the label focuses the field.{" "}
          <code>labelAside</code> adds quieter text beside it, such as{" "}
          <code>Optional</code> or <code>Required</code>. Use either one, both,
          or neither. Mark whichever kind is rarer in the form, not every
          field. With a label, the aside is read as part of the field&apos;s
          name. Without one, it becomes the description, and the field still
          needs an <code>aria-label</code>.
        </DocsProse>
        <InputLabelDemo />
      </DocsSection>
      <DocsSection id="slots" title="Slots">
        <DocsProse>
          <code>start</code> and <code>end</code> hold an icon, a unit, or a
          small button. They sit inside the border, so the whole box reads as
          one control, and a press anywhere outside a button puts the caret in
          the field. Give an icon-only action an <code>aria-label</code>.
        </DocsProse>
        <InputSlotDemo />
      </DocsSection>

      <DocsSection id="variant" title="Variant">
        <DocsProse>
          Default is a hairline border on a lifted surface.{" "}
          <code>filled</code> drops the border for a muted wash that deepens a
          little on hover and focus. Invalid still draws a destructive edge on
          either.
        </DocsProse>
        <InputVariantDemo />
      </DocsSection>

      <DocsSection id="size" title="Size">
        <DocsProse>
          Heights follow the{" "}
          <Link href="/foundations#controls">control sizes</Link>, so an input
          lines up with a button of the same size. Text stays 16px below{" "}
          <code>md</code> so iOS keeps the zoom where it is on focus.
        </DocsProse>
        <InputSizeDemo />
      </DocsSection>

      <DocsSection id="state" title="State">
        <DocsProse>
          On the default, the border darkens a little on hover and a little more
          on focus. Filled deepens its wash instead. The highlight ring appears
          only on keyboard focus. <code>invalid</code> sets{" "}
          <code>aria-invalid</code> and turns the edge destructive; point{" "}
          <code>aria-describedby</code> at the message. <code>pending</code>{" "}
          adds a Spinner at the end and sets <code>aria-busy</code> while a
          check on the value runs, and typing continues. Read-only keeps the
          value selectable and focusable on a muted fill. Disabled fades to half
          and leaves the submit.
        </DocsProse>
        <InputStateDemo />
      </DocsSection>

      <DocsSection id="form" title="In a form">
        <DocsProse>
          Inside <Link href="/component/form">Form</Link>, use{" "}
          <code>FormInput</code>. It registers the field, links the label,
          sets <code>invalid</code> from the schema, points{" "}
          <code>aria-describedby</code> at the description and the error, and
          turns read-only while the form submits so the values sent are the
          values shown.
        </DocsProse>
        <CodeBlock>{formSample}</CodeBlock>
      </DocsSection>

      <DocsSection id="api" title="API">
        <DocsProse>
          Accepts every Base UI <code>Input</code> prop, plus:
        </DocsProse>
        <DocsTable
          headers={["Prop", "Values", "Default"]}
          rows={[
            [<code key="p">variant</code>, "default · filled", <code key="d">default</code>],
            [<code key="p">size</code>, "sm · default · lg", <code key="d">default</code>],
            [<code key="p">label</code>, "ReactNode", "—"],
            [<code key="p">labelAside</code>, "ReactNode", "—"],
            [<code key="p">start</code>, "ReactNode", "—"],
            [<code key="p">end</code>, "ReactNode", "—"],
            [<code key="p">pending</code>, "boolean", <code key="d">false</code>],
            [<code key="p">invalid</code>, "boolean", <code key="d">false</code>],
            [
              <code key="p">clearable</code>,
              "boolean",
              <span key="d">
                <code>true</code> for <code>type=&quot;search&quot;</code>
              </span>,
            ],
          ]}
        />
        <DocsProse>
          <code>className</code> lands on the bordered box, so width and
          spacing classes size the whole control. With a label, the box and
          the label row sit in a full-width column. <code>ref</code>,{" "}
          <code>id</code>, and every native attribute reach the{" "}
          <code>&lt;input&gt;</code>. <code>FormInput</code> takes the same
          props plus <code>name</code>, <code>label</code>,{" "}
          <code>labelAside</code>, <code>description</code>, and{" "}
          <code>orientation</code>; its label comes from the form field, so the
          aside sits in that label.
        </DocsProse>
      </DocsSection>
      <MachineSections slug="input" />
    </DocsArticle>
  )
}
