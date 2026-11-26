import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>Prometheus — personal shadcn registry on Base UI.</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link className="transition-colors hover:text-foreground" href="/guide">
            Guide
          </Link>
          <Link
            className="transition-colors hover:text-foreground"
            href="/typography"
          >
            Typography
          </Link>
          <a className="transition-colors hover:text-foreground" href="/llms.txt">
            llms.txt
          </a>
          <a
            className="transition-colors hover:text-foreground"
            href="/r/registry.json"
          >
            registry.json
          </a>
          <a
            className="transition-colors hover:text-foreground"
            href="https://github.com/AustinTByrd/prometheus"
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
