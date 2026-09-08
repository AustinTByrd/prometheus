import type { Metadata } from "next"

import { initCommand, OWNER_REPO } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Usage guide — Prometheus",
}

export default function GuidePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Usage guide</h1>
        <p className="text-muted-foreground">
          Prometheus is not an alternative to shadcn. It is your defaults on
          top of it. Source is installed into the app.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Start a project</h2>
        <pre className="overflow-x-auto rounded-lg border bg-card px-4 py-3 font-mono text-xs">
          {initCommand()}
        </pre>
        <p className="text-sm text-muted-foreground">
          That installs Base UI, ember tokens, the agent pack, and
          PrometheusProvider. Then add what you need:
        </p>
        <pre className="overflow-x-auto rounded-lg border bg-card px-4 py-3 font-mono text-xs">
          {`npx shadcn@latest add ${OWNER_REPO}/responsive-dialog
npx shadcn@latest add ${OWNER_REPO}/form-field-input`}
        </pre>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Provider</h2>
        <p className="text-sm text-muted-foreground">
          Wrap the app in PrometheusProvider. It sets theme, TooltipProvider,
          and isMobile from a breakpoint. Responsive Dialog reads that value.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Simple vs Responsive</h2>
        <p className="text-sm text-muted-foreground">
          Simple is the small API for the standard desktop presentation.
          Responsive adds a mobile drawer to that same API. Responsive may
          depend on Simple. Simple must not install drawer dependencies. Use
          mobileView=&quot;keep&quot; to opt out of the presentation switch.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">For agents</h2>
        <p className="text-sm text-muted-foreground">
          Search the registry before writing UI. Every component page has Copy
          for agents. The machine index is at /llms.txt.
        </p>
        <pre className="overflow-x-auto rounded-lg border bg-card px-4 py-3 font-mono text-xs">
          {`npx shadcn@latest search ${OWNER_REPO}
npx shadcn@latest add ${OWNER_REPO}/<item> --dry-run`}
        </pre>
      </section>
    </main>
  )
}
