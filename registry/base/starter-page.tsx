import { AppShell } from "@/components/ui/app-shell"

export default function Page() {
  return (
    <AppShell
      nav={
        <div className="flex flex-col gap-1 p-2 text-sm text-muted-foreground">
          <p className="px-2 py-1.5 font-medium text-foreground">Prometheus</p>
          <p className="px-2 py-1.5">Replace this nav</p>
        </div>
      }
    >
      <div className="flex flex-col gap-3 p-6">
        <h1 className="font-display text-3xl">Your app starts here</h1>
        <p className="max-w-prose text-muted-foreground">
          Every Prometheus component is in components/ui. Edit this page, and
          change defaults in components/providers.tsx.
        </p>
      </div>
    </AppShell>
  )
}
