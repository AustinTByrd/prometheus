import type { Metadata } from "next"

import { CommandBlock } from "@/components/site/command-block"
import { initCommand, OWNER_REPO, REGISTRY_NAMESPACE } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Usage guide — Prometheus",
}

const providerSnippet = `import { PrometheusProvider } from "@/components/prometheus-provider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <PrometheusProvider>{children}</PrometheusProvider>
      </body>
    </html>
  )
}`

export default function GuidePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Usage guide</h1>
        <p className="text-muted-foreground">
          Prometheus is not an alternative to shadcn. It is your defaults on
          top of it. Source is installed directly into the app.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Start a project</h2>
        <CommandBlock code={initCommand()} />
        <p className="text-sm text-muted-foreground">
          <code className="font-mono text-foreground">{OWNER_REPO}/base</code>{" "}
          configures Base UI (<code className="font-mono text-foreground">base-nova</code>),
          Geist, Lucide, ember theme tokens, the{" "}
          <code className="font-mono text-foreground">{REGISTRY_NAMESPACE}</code>{" "}
          namespace, the agent pack, and{" "}
          <code className="font-mono text-foreground">PrometheusProvider</code>.
          Then add the components you need:
        </p>
        <CommandBlock
          code={`npx shadcn@latest add ${OWNER_REPO}/responsive-dialog
npx shadcn@latest add ${REGISTRY_NAMESPACE}/form-field-input
npx shadcn@latest add ${REGISTRY_NAMESPACE}/confirm-dialog`}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Provider</h2>
        <p className="text-sm text-muted-foreground">
          Wrap the root layout in{" "}
          <code className="font-mono text-foreground">PrometheusProvider</code>.
          It provides{" "}
          <code className="font-mono text-foreground">next-themes</code>,{" "}
          <code className="font-mono text-foreground">TooltipProvider</code>,
          and <code className="font-mono text-foreground">isMobile</code> from a
          single breakpoint. Responsive Dialog and Responsive Popover read that
          value via{" "}
          <code className="font-mono text-foreground">usePrometheus()</code>.
        </p>
        <CommandBlock code={providerSnippet} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Simple vs Responsive</h2>
        <p className="text-sm text-muted-foreground">
          Simple (<code className="font-mono text-foreground">SimpleDialog</code>,{" "}
          <code className="font-mono text-foreground">SimplePopover</code>) is
          the compact API for standard desktop presentations. Responsive (
          <code className="font-mono text-foreground">ResponsiveDialog</code>,{" "}
          <code className="font-mono text-foreground">ResponsivePopover</code>)
          adds a mobile swipeable drawer to that same API. Responsive may depend
          on Simple; Simple never installs drawer dependencies. Pass{" "}
          <code className="font-mono text-foreground">
            mobileView=&quot;keep&quot;
          </code>{" "}
          to opt out of the presentation switch.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Forms</h2>
        <p className="text-sm text-muted-foreground">
          Use the{" "}
          <code className="font-mono text-foreground">FormField*</code> wrappers
          (<code className="font-mono text-foreground">FormFieldInput</code>,{" "}
          <code className="font-mono text-foreground">FormFieldTextarea</code>,{" "}
          <code className="font-mono text-foreground">FormFieldSelect</code>,{" "}
          <code className="font-mono text-foreground">FormFieldCheckbox</code>,{" "}
          <code className="font-mono text-foreground">FormFieldSwitch</code>,{" "}
          <code className="font-mono text-foreground">FormFieldRadioGroup</code>
          ) so labels, descriptions, accessible IDs, and validation errors stay
          consistent. Wrap custom inputs in{" "}
          <code className="font-mono text-foreground">FormFieldWrapper</code>.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Agent pack</h2>
        <p className="text-sm text-muted-foreground">
          Installing{" "}
          <code className="font-mono text-foreground">{OWNER_REPO}/agent</code>{" "}
          (included automatically with{" "}
          <code className="font-mono text-foreground">base</code>) writes{" "}
          <code className="font-mono text-foreground">AGENTS.md</code> and{" "}
          <code className="font-mono text-foreground">
            .cursor/skills/prometheus/SKILL.md
          </code>{" "}
          so coding agents search Prometheus before writing UI. Every component
          page has Copy for agents, and the machine index lives at{" "}
          <a
            className="text-foreground underline underline-offset-4"
            href="/llms.txt"
          >
            /llms.txt
          </a>
          .
        </p>
        <CommandBlock
          code={`npx shadcn@latest search ${OWNER_REPO}
npx shadcn@latest view ${OWNER_REPO}/responsive-dialog
npx shadcn@latest add ${OWNER_REPO}/responsive-dialog --dry-run`}
        />
      </section>
    </main>
  )
}
