import Link from "next/link"

import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link className="flex items-center gap-2 font-medium tracking-tight" href="/">
          <span className="size-2 rounded-full bg-primary" />
          Prometheus
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-5 text-sm text-muted-foreground">
            <Link className="transition-colors hover:text-foreground" href="/guide">
              Guide
            </Link>
            <Link
              className="transition-colors hover:text-foreground"
              href="/typography"
            >
              Typography
            </Link>
            <Link
              className="transition-colors hover:text-foreground"
              href="/#components"
            >
              Components
            </Link>
            <a
              className="hidden transition-colors hover:text-foreground sm:inline"
              href="/llms.txt"
            >
              llms.txt
            </a>
            <a
              className="transition-colors hover:text-foreground"
              href="https://github.com/AustinTByrd/prometheus"
              rel="noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
