export const OWNER_REPO = "AustinTByrd/prometheus"
export const SITE_URL = "https://prometheus-ui-rust.vercel.app"
export const REGISTRY_NAMESPACE = "@prometheus"

export type CatalogCategory =
  | "Setup"
  | "Actions"
  | "Display"
  | "Overlays"
  | "Forms"
  | "Layout"

export const catalogCategories: readonly CatalogCategory[] = [
  "Setup",
  "Actions",
  "Display",
  "Overlays",
  "Forms",
  "Layout",
]

export type CatalogItem = {
  slug: string
  title: string
  description: string
  category: CatalogCategory
  usage: string
}

export const catalog: CatalogItem[] = [
  {
    slug: "prometheus-provider",
    title: "Prometheus Provider",
    description:
      "App provider for isMobile, theme, and tooltips. Wrap the root instead of adding a breakpoint hook beside every overlay.",
    category: "Setup",
    usage: `import { PrometheusProvider } from "@/components/prometheus-provider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <PrometheusProvider>{children}</PrometheusProvider>
      </body>
    </html>
  )
}`,
  },
  {
    slug: "button",
    title: "Button",
    description:
      "Loading, icons, and href on one button. Use this instead of wrapping the primitive with a spinner on every action.",
    category: "Actions",
    usage: `import { SearchIcon } from "lucide-react"
import { Button } from "@/components/button"

<Button icon={SearchIcon}>Search</Button>
<Button loading>Saving</Button>
<Button href="/settings" variant="outline">Settings</Button>`,
  },
  {
    slug: "copy-button",
    title: "Copy Button",
    description:
      "Clipboard copy button with temporary copied feedback built on Prometheus Button.",
    category: "Actions",
    usage: `import { CopyButton } from "@/components/copy-button"

<CopyButton value="npx shadcn@latest add @prometheus/button" />
<CopyButton label="Copy install" value="npx shadcn@latest add @prometheus/button" />`,
  },
  {
    slug: "theme-toggle",
    title: "Theme Toggle",
    description:
      "Hydration-safe light/dark toggle wired to next-themes and SimpleTooltip. Pairs with PrometheusProvider.",
    category: "Actions",
    usage: `import { ThemeToggle } from "@/components/theme-toggle"

<ThemeToggle />`,
  },
  {
    slug: "kbd",
    title: "Keyboard Shortcut",
    description:
      "Keycap display for shortcut hints. Bind the actual keys in your app.",
    category: "Actions",
    usage: `import { Kbd, KbdShortcut } from "@/components/kbd"

<KbdShortcut keys={["⌘", "K"]} />
<Kbd>Esc</Kbd>`,
  },
  {
    slug: "avatar",
    title: "Avatar",
    description:
      "Image/initials avatar and see-through AvatarStack sized from --avatar-size with radial-gradient cutout masks and crescent text nudging.",
    category: "Display",
    usage: `import { Avatar, AvatarStack } from "@/components/avatar"

<Avatar src="/avatars/ada.png" name="Ada Lovelace" size="md" status="online" />

<AvatarStack max={4} label="Contributors" topmost="right">
  <Avatar src="/avatars/ada.png" name="Ada Lovelace" />
  <Avatar src="/avatars/grace.png" name="Grace Hopper" />
  <Avatar name="Alan Turing" />
  <Avatar name="Margaret Hamilton" />
  <Avatar name="Donald Knuth" />
</AvatarStack>`,
  },
  {
    slug: "simple-tooltip",
    title: "Simple Tooltip",
    description:
      "One child, one content prop. Handles disabled triggers automatically without extra wrapper markup.",
    category: "Overlays",
    usage: `import { Button } from "@/components/button"
import { SimpleTooltip } from "@/components/simple-tooltip"

<SimpleTooltip content="Open settings">
  <Button variant="outline">Hover me</Button>
</SimpleTooltip>`,
  },
  {
    slug: "conditional-tooltip",
    title: "Conditional Tooltip",
    description:
      "Tooltip only when a condition and content exist. Avoid duplicating the trigger in two branches.",
    category: "Overlays",
    usage: `import { Button } from "@/components/button"
import { ConditionalTooltip } from "@/components/conditional-tooltip"

<ConditionalTooltip condition={isDisabled} content="Enable this action in settings.">
  <Button disabled={isDisabled} variant="outline">Delete</Button>
</ConditionalTooltip>`,
  },
  {
    slug: "simple-dialog",
    title: "Simple Dialog",
    description:
      "Centered desktop dialog with title, description, trigger, footer, and SimpleDialogClose. Does not install mobile drawer behavior.",
    category: "Overlays",
    usage: `import { Button } from "@/components/button"
import { SimpleDialog, SimpleDialogClose } from "@/components/simple-dialog"

<SimpleDialog
  title="Rename project"
  description="This stays a centered dialog on every screen."
  trigger={<Button variant="outline">Rename</Button>}
  footer={<SimpleDialogClose render={<Button variant="outline" />}>Done</SimpleDialogClose>}
>
  <p>Dialog body content.</p>
</SimpleDialog>`,
  },
  {
    slug: "responsive-dialog",
    title: "Responsive Dialog",
    description:
      "Same API as Simple Dialog, as a swipeable drawer on mobile. Requires PrometheusProvider.",
    category: "Overlays",
    usage: `import { Button } from "@/components/button"
import { ResponsiveDialog, ResponsiveDialogClose } from "@/components/responsive-dialog"

<ResponsiveDialog
  title="Edit profile"
  description="Dialog on desktop, swipeable drawer on mobile."
  trigger={<Button>Edit</Button>}
  footer={<ResponsiveDialogClose render={<Button variant="outline" />}>Done</ResponsiveDialogClose>}
>
  <p>Form fields go here.</p>
</ResponsiveDialog>`,
  },
  {
    slug: "confirm-dialog",
    title: "Confirm Dialog",
    description:
      "Confirmation modal on AlertDialog with async loading state and destructive variant.",
    category: "Overlays",
    usage: `import { Button } from "@/components/button"
import { ConfirmDialog } from "@/components/confirm-dialog"

<ConfirmDialog
  title="Delete project?"
  description="This permanently removes all deployments and environment variables."
  confirmLabel="Delete"
  variant="destructive"
  onConfirm={async () => {
    await deleteProject()
  }}
  trigger={<Button variant="destructive">Delete project</Button>}
/>`,
  },
  {
    slug: "simple-popover",
    title: "Simple Popover",
    description:
      "Desktop popover with trigger, optional header, and positioning props. Does not install mobile drawer behavior.",
    category: "Overlays",
    usage: `import { Button } from "@/components/button"
import { SimplePopover } from "@/components/simple-popover"

<SimplePopover
  title="Dimensions"
  description="Set the dimensions for the layer."
  trigger={<Button variant="outline">Open popover</Button>}
>
  <p className="text-sm text-muted-foreground">Popover controls go here.</p>
</SimplePopover>`,
  },
  {
    slug: "responsive-popover",
    title: "Responsive Popover",
    description:
      "Same API as Simple Popover, presented as a swipeable drawer on mobile. Requires PrometheusProvider.",
    category: "Overlays",
    usage: `import { Button } from "@/components/button"
import { ResponsivePopover } from "@/components/responsive-popover"

<ResponsivePopover
  title="Filter results"
  description="Popover on desktop, drawer on mobile."
  trigger={<Button variant="outline">Filter</Button>}
>
  <p className="text-sm text-muted-foreground">Filter options go here.</p>
</ResponsivePopover>`,
  },
  {
    slug: "form-field-wrapper",
    title: "Form Field Wrapper",
    description:
      "Shared label, description, and error shell for custom controls in vertical or horizontal layout.",
    category: "Forms",
    usage: `import { FormFieldWrapper } from "@/components/form-field-wrapper"
import { Input } from "@/components/ui/input"

<FormFieldWrapper
  label="Workspace slug"
  htmlFor="slug"
  description="Lowercase letters and hyphens only."
  error={error}
>
  <Input id="slug" aria-invalid={Boolean(error)} />
</FormFieldWrapper>`,
  },
  {
    slug: "form-field-input",
    title: "Form Field Input",
    description:
      "Labeled text input with validation wiring. Works with register() or value/onChange.",
    category: "Forms",
    usage: `import { FormFieldInput } from "@/components/form-field-input"

<FormFieldInput
  label="Email"
  name="email"
  type="email"
  description="We'll never share this."
  error={errors.email?.message}
/>`,
  },
  {
    slug: "form-field-textarea",
    title: "Form Field Textarea",
    description: "Labeled multiline field using the shared field shell.",
    category: "Forms",
    usage: `import { FormFieldTextarea } from "@/components/form-field-textarea"

<FormFieldTextarea
  label="Notes"
  name="notes"
  placeholder="Add deployment notes…"
  description="Shown to teammates reviewing this release."
/>`,
  },
  {
    slug: "form-field-select",
    title: "Form Field Select",
    description:
      "Labeled select from an options array with Base UI items label mapping. No Select anatomy to reassemble.",
    category: "Forms",
    usage: `import { FormFieldSelect } from "@/components/form-field-select"

<FormFieldSelect
  label="Plan"
  value={plan}
  onValueChange={(value) => setPlan(value ?? undefined)}
  options={[
    { label: "Hobby", value: "hobby" },
    { label: "Pro", value: "pro" },
  ]}
/>`,
  },
  {
    slug: "form-field-checkbox",
    title: "Form Field Checkbox",
    description: "Checkbox paired with its label, description, and error message.",
    category: "Forms",
    usage: `import { FormFieldCheckbox } from "@/components/form-field-checkbox"

<FormFieldCheckbox
  label="Subscribe to release notes"
  description="Receive monthly changelogs by email."
  checked={subscribed}
  onCheckedChange={setSubscribed}
/>`,
  },
  {
    slug: "form-field-switch",
    title: "Form Field Switch",
    description:
      "Settings-row switch paired with label, description, and validation message.",
    category: "Forms",
    usage: `import { FormFieldSwitch } from "@/components/form-field-switch"

<FormFieldSwitch
  label="Automatic deploys"
  description="Deploy every push to main automatically."
  checked={autoDeploy}
  onCheckedChange={setAutoDeploy}
/>`,
  },
  {
    slug: "form-field-radio-group",
    title: "Form Field Radio Group",
    description:
      "Labeled single-choice radio group from an options array using FieldSet and FieldLegend.",
    category: "Forms",
    usage: `import { FormFieldRadioGroup } from "@/components/form-field-radio-group"

<FormFieldRadioGroup
  label="Visibility"
  value={visibility}
  onValueChange={setVisibility}
  options={[
    { label: "Private", value: "private", description: "Only workspace members." },
    { label: "Public", value: "public", description: "Anyone with the link." },
  ]}
/>`,
  },
  {
    slug: "conditional-wrap",
    title: "Conditional Wrap",
    description:
      "Optionally wrap children so links or providers do not duplicate the child tree.",
    category: "Layout",
    usage: `import { ConditionalWrap } from "@/components/conditional-wrap"

<ConditionalWrap
  condition={Boolean(href)}
  wrap={(children) => <a href={href}>{children}</a>}
>
  <span>Card title</span>
</ConditionalWrap>`,
  },
  {
    slug: "page-header",
    title: "Page Header",
    description: "Title, description, and action slot. Optional sticky positioning.",
    category: "Layout",
    usage: `import { Button } from "@/components/button"
import { PageHeader } from "@/components/page-header"

<PageHeader title="Members" description="People in this workspace.">
  <Button size="sm">Invite</Button>
</PageHeader>`,
  },
  {
    slug: "spinner",
    title: "Spinner",
    description:
      "Spinner plus full-page and fill-height layouts. Do not recenter a loader at each boundary.",
    category: "Layout",
    usage: `import { Spinner, FillHeightSpinner, FullPageSpinner } from "@/components/spinner"

<Spinner />
<FillHeightSpinner label="Loading panel" />
<FullPageSpinner label="Loading workspace" />`,
  },
]

export function getCatalogItem(slug: string) {
  return catalog.find((item) => item.slug === slug)
}

export function getAdjacentCatalogItems(slug: string) {
  const index = catalog.findIndex((item) => item.slug === slug)
  if (index === -1) return { prev: null, next: null }
  return {
    prev: index > 0 ? catalog[index - 1] : null,
    next: index < catalog.length - 1 ? catalog[index + 1] : null,
  }
}

export function installCommand(slug: string) {
  return `npx shadcn@latest add ${OWNER_REPO}/${slug}`
}

export function namespaceInstallCommand(slug: string) {
  return `npx shadcn@latest add ${REGISTRY_NAMESPACE}/${slug}`
}

export function initCommand() {
  return `npx shadcn@latest init --name my-app --template next --base base ${OWNER_REPO}/base`
}
