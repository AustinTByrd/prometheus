"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"

import { Button } from "@/components/button"
import { ConditionalTooltip } from "@/components/conditional-tooltip"
import { ConditionalWrap } from "@/components/conditional-wrap"
import { FormFieldCheckbox } from "@/components/form-field-checkbox"
import { FormFieldInput } from "@/components/form-field-input"
import { FormFieldSelect } from "@/components/form-field-select"
import { FormFieldTextarea } from "@/components/form-field-textarea"
import { Kbd, KbdShortcut } from "@/components/kbd"
import { PageHeader } from "@/components/page-header"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import { SimpleDialog } from "@/components/simple-dialog"
import { SimpleTooltip } from "@/components/simple-tooltip"
import { usePrometheus } from "@/components/prometheus-provider"
import { FillHeightSpinner, Spinner } from "@/components/spinner"

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button icon={SearchIcon}>Search</Button>
      <Button loading>Saving</Button>
      <Button href="#components" variant="outline">
        Link
      </Button>
    </div>
  )
}

export function SimpleTooltipDemo() {
  return (
    <SimpleTooltip content="Open settings">
      <Button variant="outline">Hover me</Button>
    </SimpleTooltip>
  )
}

export function ConditionalTooltipDemo() {
  const [disabled, setDisabled] = React.useState(true)

  return (
    <div className="flex flex-col gap-3">
      <ConditionalTooltip
        condition={disabled}
        content="Enable this action in settings."
      >
        <Button disabled={disabled} variant="outline">
          Delete
        </Button>
      </ConditionalTooltip>
      <Button onClick={() => setDisabled((value) => !value)} size="sm" variant="ghost">
        Toggle disabled
      </Button>
    </div>
  )
}

export function ConditionalWrapDemo() {
  return (
    <ConditionalWrap
      condition
      wrap={(children) => (
        <a className="underline underline-offset-4" href="#components">
          {children}
        </a>
      )}
    >
      Optional link around this text
    </ConditionalWrap>
  )
}

export function SimpleDialogDemo() {
  return (
    <SimpleDialog
      description="This stays a centered dialog on every screen."
      footer={<Button variant="outline">Done</Button>}
      title="Simple dialog"
      trigger={<Button variant="outline">Open simple dialog</Button>}
    >
      <p className="text-sm text-muted-foreground">
        Use Responsive Dialog when the same interaction should become a drawer
        on mobile.
      </p>
    </SimpleDialog>
  )
}

export function ResponsiveDialogDemo() {
  return (
    <ResponsiveDialog
      description="Drawer on small screens. Dialog on desktop."
      footer={<Button variant="outline">Continue</Button>}
      title="Responsive dialog"
      trigger={<Button>Open responsive dialog</Button>}
    >
      <p className="text-sm text-muted-foreground">
        Resize the window or use a phone to see the mobile presentation.
      </p>
    </ResponsiveDialog>
  )
}

export function FormDemo() {
  const [plan, setPlan] = React.useState<string | undefined>("pro")
  const [subscribed, setSubscribed] = React.useState(true)

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <FormFieldInput
        defaultValue="ada@lovelace.dev"
        description="We’ll never share this."
        label="Email"
        name="email"
        type="email"
      />
      <FormFieldTextarea label="Notes" name="notes" placeholder="Optional" />
      <FormFieldSelect
        label="Plan"
        onValueChange={(value) => setPlan(value ?? undefined)}
        options={[
          { label: "Hobby", value: "hobby" },
          { label: "Pro", value: "pro" },
        ]}
        value={plan}
      />
      <FormFieldCheckbox
        checked={subscribed}
        label="Subscribe to updates"
        onCheckedChange={setSubscribed}
      />
    </div>
  )
}

export function PageHeaderDemo() {
  return (
    <div className="w-full">
      <PageHeader description="People in this workspace." title="Members">
        <Button size="sm">Invite</Button>
      </PageHeader>
    </div>
  )
}

export function SpinnerDemo() {
  return (
    <div className="flex items-center gap-6">
      <Spinner />
      <div className="h-32 w-48 rounded-lg border">
        <FillHeightSpinner label="Loading panel" />
      </div>
    </div>
  )
}

export function KbdDemo() {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      Save
      <KbdShortcut keys={["⌘", "S"]} />
      or press <Kbd>Esc</Kbd>
    </div>
  )
}

export function ProviderDemo() {
  const { isMobile } = usePrometheus()
  return (
    <p className="text-sm text-muted-foreground">
      isMobile is currently <span className="text-foreground">{String(isMobile)}</span>
    </p>
  )
}

export const demos: Record<string, React.ComponentType> = {
  "prometheus-provider": ProviderDemo,
  button: ButtonDemo,
  "simple-tooltip": SimpleTooltipDemo,
  "conditional-tooltip": ConditionalTooltipDemo,
  "conditional-wrap": ConditionalWrapDemo,
  "simple-dialog": SimpleDialogDemo,
  "responsive-dialog": ResponsiveDialogDemo,
  "form-field-wrapper": FormDemo,
  "form-field-input": FormDemo,
  "form-field-textarea": FormDemo,
  "form-field-select": FormDemo,
  "form-field-checkbox": FormDemo,
  "page-header": PageHeaderDemo,
  spinner: SpinnerDemo,
  kbd: KbdDemo,
}
