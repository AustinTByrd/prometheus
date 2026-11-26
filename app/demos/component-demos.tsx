"use client"

import * as React from "react"
import { ArrowRightIcon, SearchIcon, Trash2Icon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/button"
import { ConditionalTooltip } from "@/components/conditional-tooltip"
import { ConditionalWrap } from "@/components/conditional-wrap"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { CopyButton } from "@/components/copy-button"
import { FormFieldCheckbox } from "@/components/form-field-checkbox"
import { FormFieldInput } from "@/components/form-field-input"
import { FormFieldRadioGroup } from "@/components/form-field-radio-group"
import { FormFieldSelect } from "@/components/form-field-select"
import { FormFieldSwitch } from "@/components/form-field-switch"
import { FormFieldTextarea } from "@/components/form-field-textarea"
import { FormFieldWrapper } from "@/components/form-field-wrapper"
import { Kbd, KbdShortcut } from "@/components/kbd"
import { PageHeader } from "@/components/page-header"
import { usePrometheus } from "@/components/prometheus-provider"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
} from "@/components/responsive-dialog"
import { ResponsivePopover } from "@/components/responsive-popover"
import { SimpleDialog, SimpleDialogClose } from "@/components/simple-dialog"
import { SimplePopover } from "@/components/simple-popover"
import { SimpleTooltip } from "@/components/simple-tooltip"
import { FillHeightSpinner, Spinner } from "@/components/spinner"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button icon={SearchIcon}>Search</Button>
      <Button icon={ArrowRightIcon} iconPosition="end" variant="secondary">
        Continue
      </Button>
      <Button loading>Saving</Button>
      <Button href="#usage" variant="outline">
        Link
      </Button>
    </div>
  )
}

export function CopyButtonDemo() {
  const snippet = "npx shadcn@latest add AustinTByrd/prometheus/copy-button"

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <CopyButton label="Copy install" value={snippet} />
      <CopyButton value={snippet} />
    </div>
  )
}

export function ThemeToggleDemo() {
  const { resolvedTheme } = useTheme()

  return (
    <div className="flex items-center gap-3">
      <ThemeToggle variant="outline" />
      <span className="text-sm text-muted-foreground">
        Active theme:{" "}
        <span className="font-mono text-foreground">
          {resolvedTheme ?? "dark"}
        </span>
      </span>
    </div>
  )
}

export function SimpleTooltipDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <SimpleTooltip content="Open settings">
        <Button variant="outline">Hover me</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Disabled triggers still show hints">
        <Button disabled variant="outline">
          Disabled trigger
        </Button>
      </SimpleTooltip>
    </div>
  )
}

export function ConditionalTooltipDemo() {
  const [disabled, setDisabled] = React.useState(true)

  return (
    <div className="flex flex-col items-center gap-3">
      <ConditionalTooltip
        condition={disabled}
        content="Enable this action in settings."
      >
        <Button disabled={disabled} variant="outline">
          Delete
        </Button>
      </ConditionalTooltip>
      <Button
        onClick={() => setDisabled((value) => !value)}
        size="sm"
        variant="ghost"
      >
        {disabled ? "Enable button" : "Disable button"}
      </Button>
    </div>
  )
}

export function ConditionalWrapDemo() {
  const [linked, setLinked] = React.useState(true)

  return (
    <div className="flex flex-col items-center gap-3">
      <ConditionalWrap
        condition={linked}
        wrap={(children) => (
          <a
            className="text-primary underline underline-offset-4"
            href="#usage"
          >
            {children}
          </a>
        )}
      >
        <span className="text-sm">
          {linked ? "Wrapped in an anchor link" : "Rendered as plain text"}
        </span>
      </ConditionalWrap>
      <Button
        onClick={() => setLinked((value) => !value)}
        size="sm"
        variant="ghost"
      >
        Toggle wrapper
      </Button>
    </div>
  )
}

export function SimpleDialogDemo() {
  return (
    <SimpleDialog
      description="This stays a centered dialog on every screen."
      footer={
        <SimpleDialogClose render={<Button variant="outline" />}>
          Done
        </SimpleDialogClose>
      }
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
      footer={
        <ResponsiveDialogClose render={<Button variant="outline" />}>
          Continue
        </ResponsiveDialogClose>
      }
      title="Responsive dialog"
      trigger={<Button>Open responsive dialog</Button>}
    >
      <p className="text-sm text-muted-foreground">
        Resize the window or use a phone to see the mobile presentation.
      </p>
    </ResponsiveDialog>
  )
}

export function ConfirmDialogDemo() {
  const [status, setStatus] = React.useState<string | null>(null)

  return (
    <div className="flex flex-col items-center gap-3">
      <ConfirmDialog
        confirmLabel="Delete workspace"
        description="This permanently removes the workspace and all environment variables."
        onConfirm={async () => {
          await new Promise((resolve) => window.setTimeout(resolve, 700))
          setStatus("Confirmed and completed.")
        }}
        title="Delete workspace?"
        trigger={
          <Button icon={Trash2Icon} variant="destructive">
            Delete workspace
          </Button>
        }
        variant="destructive"
      />
      {status ? (
        <p className="text-xs text-muted-foreground">{status}</p>
      ) : null}
    </div>
  )
}

export function SimplePopoverDemo() {
  return (
    <SimplePopover
      description="Desktop popover with a compact prop API."
      title="Quick settings"
      trigger={<Button variant="outline">Open popover</Button>}
    >
      <FormFieldInput
        defaultValue="prometheus"
        label="Project name"
        name="popover-project"
      />
    </SimplePopover>
  )
}

export function ResponsivePopoverDemo() {
  const [onlyErrors, setOnlyErrors] = React.useState(false)

  return (
    <ResponsivePopover
      description="Popover on desktop, swipeable drawer on mobile."
      title="Filter logs"
      trigger={<Button variant="outline">Filter logs</Button>}
    >
      <FormFieldSwitch
        checked={onlyErrors}
        description="Hide informational events."
        label="Errors only"
        onCheckedChange={setOnlyErrors}
      />
    </ResponsivePopover>
  )
}

export function FormFieldWrapperDemo() {
  const [showError, setShowError] = React.useState(false)

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <FormFieldWrapper
        description="Lowercase letters, numbers, and hyphens."
        error={showError ? "Workspace slug is already taken." : undefined}
        htmlFor="demo-slug"
        label="Workspace slug"
      >
        <Input
          aria-invalid={showError ? true : undefined}
          defaultValue="prometheus-ui"
          id="demo-slug"
        />
      </FormFieldWrapper>
      <Button
        className="w-fit"
        onClick={() => setShowError((value) => !value)}
        size="sm"
        variant="ghost"
      >
        {showError ? "Clear error" : "Simulate error"}
      </Button>
    </div>
  )
}

export function FormFieldInputDemo() {
  const [email, setEmail] = React.useState("ada@lovelace.dev")
  const error =
    email.trim().length > 0 && !email.includes("@")
      ? "Enter a valid email address."
      : undefined

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <FormFieldInput
        description="We’ll never share this. Remove @ to preview validation."
        error={error}
        label="Email"
        name="email"
        onChange={(event) => setEmail(event.target.value)}
        type="email"
        value={email}
      />
    </div>
  )
}

export function FormFieldTextareaDemo() {
  const [notes, setNotes] = React.useState("")
  const tooLong = notes.length > 140

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <FormFieldTextarea
        description={`${notes.length}/140 characters`}
        error={tooLong ? "Keep release notes under 140 characters." : undefined}
        label="Release notes"
        name="notes"
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Describe what changed in this build…"
        value={notes}
      />
    </div>
  )
}

export function FormFieldSelectDemo() {
  const [plan, setPlan] = React.useState<string | null>("pro")

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <FormFieldSelect
        description="Base UI items mapping renders option labels immediately."
        label="Plan"
        name="plan"
        onValueChange={setPlan}
        options={[
          { label: "Hobby", value: "hobby" },
          { label: "Pro", value: "pro" },
          { label: "Enterprise (contact sales)", value: "enterprise", disabled: true },
        ]}
        value={plan}
      />
    </div>
  )
}

export function FormFieldCheckboxDemo() {
  const [subscribed, setSubscribed] = React.useState(true)

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <FormFieldCheckbox
        checked={subscribed}
        description="Monthly registry updates and breaking-change notices."
        error={!subscribed ? "Please confirm to continue." : undefined}
        label="Subscribe to updates"
        onCheckedChange={setSubscribed}
      />
    </div>
  )
}

export function FormFieldSwitchDemo() {
  const [autoDeploy, setAutoDeploy] = React.useState(true)
  const [previewUrls, setPreviewUrls] = React.useState(false)

  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <FormFieldSwitch
        checked={autoDeploy}
        description="Deploy every push to main automatically."
        label="Automatic deploys"
        onCheckedChange={setAutoDeploy}
      />
      <FormFieldSwitch
        checked={previewUrls}
        description="Generate a preview deployment for each pull request."
        label="Preview deployments"
        onCheckedChange={setPreviewUrls}
      />
    </div>
  )
}

export function FormFieldRadioGroupDemo() {
  const [visibility, setVisibility] = React.useState("private")

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <FormFieldRadioGroup
        description="Choose who can install items from this project."
        label="Visibility"
        onValueChange={setVisibility}
        options={[
          {
            label: "Private",
            value: "private",
            description: "Only workspace members can view and install.",
          },
          {
            label: "Public",
            value: "public",
            description: "Anyone with the GitHub or URL address can install.",
          },
        ]}
        value={visibility}
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
    <div className="flex flex-wrap items-center justify-center gap-6">
      <Spinner />
      <div className="h-32 w-48 rounded-lg border">
        <FillHeightSpinner label="Loading panel" />
      </div>
    </div>
  )
}

export function KbdDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
      <span>Save</span>
      <KbdShortcut keys={["⌘", "S"]} />
      <span>or go to top</span>
      <KbdShortcut keys={["g", "g"]} />
      <span>or press</span>
      <Kbd>Esc</Kbd>
    </div>
  )
}

export function ProviderDemo() {
  const { isMobile } = usePrometheus()
  return (
    <p className="text-sm text-muted-foreground">
      isMobile is currently{" "}
      <span className="font-mono text-foreground">{String(isMobile)}</span>{" "}
      (resize below 768px to flip)
    </p>
  )
}

export const demos: Record<string, React.ComponentType> = {
  "prometheus-provider": ProviderDemo,
  button: ButtonDemo,
  "copy-button": CopyButtonDemo,
  "theme-toggle": ThemeToggleDemo,
  "simple-tooltip": SimpleTooltipDemo,
  "conditional-tooltip": ConditionalTooltipDemo,
  "conditional-wrap": ConditionalWrapDemo,
  "simple-dialog": SimpleDialogDemo,
  "responsive-dialog": ResponsiveDialogDemo,
  "confirm-dialog": ConfirmDialogDemo,
  "simple-popover": SimplePopoverDemo,
  "responsive-popover": ResponsivePopoverDemo,
  "form-field-wrapper": FormFieldWrapperDemo,
  "form-field-input": FormFieldInputDemo,
  "form-field-textarea": FormFieldTextareaDemo,
  "form-field-select": FormFieldSelectDemo,
  "form-field-checkbox": FormFieldCheckboxDemo,
  "form-field-switch": FormFieldSwitchDemo,
  "form-field-radio-group": FormFieldRadioGroupDemo,
  "page-header": PageHeaderDemo,
  spinner: SpinnerDemo,
  kbd: KbdDemo,
}
