"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowUpRightIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/16/solid"
import { useTheme } from "next-themes"

import { getDocsNav, type DocsNavItem } from "@/lib/catalog"
import { useKitSettings } from "@/components/site/kit-settings-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FluidHoverHighlight,
  fluidHoverTargetHasFill,
  useFluidHover,
} from "@/lib/fluid-hover"
import { cn } from "@/lib/utils"

function DocsThemeToggle() {
  const { resolvedTheme } = useTheme()
  const { update } = useKitSettings()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="size-7" />
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => update("theme", isDark ? "light" : "dark")}
      size="icon-sm"
      variant="ghost"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}

type NavFillRect = {
  top: number
  left: number
  width: number
  height: number
}

function measureCurrentPage(container: HTMLElement): NavFillRect | null {
  const item = container.querySelector<HTMLElement>('[aria-current="page"]')
  if (!item) return null
  const root = container.getBoundingClientRect()
  const rect = item.getBoundingClientRect()
  return {
    top: rect.top - root.top + container.scrollTop,
    left: rect.left - root.left + container.scrollLeft,
    width: rect.width,
    height: rect.height,
  }
}

function sameRect(a: NavFillRect | null, b: NavFillRect | null) {
  if (a === b) return true
  if (!a || !b) return false
  return (
    a.top === b.top &&
    a.left === b.left &&
    a.width === b.width &&
    a.height === b.height
  )
}

function filterNav(nav: DocsNavItem[], query: string) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return nav

  return nav
    .map((group) => {
      const groupMatch = group.title.toLowerCase().includes(normalized)
      const items = group.items?.filter(
        (item) =>
          groupMatch || item.title.toLowerCase().includes(normalized),
      )
      return { ...group, items }
    })
    .filter((group) => (group.items?.length ?? 0) > 0)
}

export function DocsNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const navMain = React.useMemo(() => getDocsNav(), [])
  const [query, setQuery] = React.useState("")
  const deferredQuery = React.useDeferredValue(query)
  const filtered = React.useMemo(
    () => filterNav(navMain, deferredQuery),
    [navMain, deferredQuery],
  )
  const hover = useFluidHover<HTMLDivElement>({
    nearest: true,
    gapClick: false,
  })
  const [activeRect, setActiveRect] = React.useState<NavFillRect | null>(null)

  const measureActive = React.useCallback(() => {
    const container = hover.ref.current
    if (!container) return
    const next = measureCurrentPage(container)
    setActiveRect((prev) => (sameRect(prev, next) ? prev : next))
  }, [hover.ref])

  React.useLayoutEffect(() => {
    measureActive()
    const container = hover.ref.current
    if (!container || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(measureActive)
    observer.observe(container)
    for (const item of container.querySelectorAll("[data-fluid-hover-item]")) {
      observer.observe(item)
    }
    return () => observer.disconnect()
  }, [measureActive, hover.ref, pathname, filtered])

  return (
    <nav className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-2">
        <Link
          className="text-sm font-medium text-foreground"
          href="/"
          onClick={onNavigate}
        >
          Prometheus
        </Link>
        <DocsThemeToggle />
      </div>
      <Input
        aria-label="Search"
        onChange={(event) => setQuery(event.currentTarget.value)}
        placeholder="Search"
        start={<MagnifyingGlassIcon />}
        type="search"
        value={query}
        variant="filled"
      />
      <div
        className="relative isolate flex flex-col gap-6"
        ref={hover.ref}
        {...hover.handlers}
      >
        {activeRect ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-0 rounded-sm bg-muted"
            style={{
              top: activeRect.top,
              left: activeRect.left,
              width: activeRect.width,
              height: activeRect.height,
            }}
          />
        ) : null}
        <FluidHoverHighlight
          hover={hover}
          onFill={fluidHoverTargetHasFill(hover.ref.current)}
        />
        {filtered.length ? (
          filtered.map((group) => (
            <div className="flex flex-col gap-1" key={group.title}>
              <p className="text-xs text-foreground/70">{group.title}</p>
              {group.items?.length ? (
                <ul className="flex flex-col">
                  {group.items.map((item) => {
                    const isActive = pathname === item.url

                    return (
                      <li key={item.url}>
                        <Link
                          className={cn(
                            "relative z-10 flex items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm font-medium text-muted-foreground transition-[color,scale] duration-(--duration-fast) ease-(--ease-standard) hover:text-foreground motion-safe:active:scale-[0.97]",
                            isActive && "text-foreground",
                          )}
                          data-fluid-hover-item=""
                          href={item.url}
                          aria-current={isActive ? "page" : undefined}
                          onClick={onNavigate}
                          rel={item.external ? "noreferrer" : undefined}
                          target={item.external ? "_blank" : undefined}
                        >
                          <span className="min-w-0">{item.title}</span>
                          {item.external ? (
                            <ArrowUpRightIcon className="size-3.5 shrink-0 opacity-50" />
                          ) : null}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              ) : null}
            </div>
          ))
        ) : (
          <p className="px-2 text-sm text-muted-foreground">No matches</p>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <a
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
          href="/llms.txt"
          onClick={onNavigate}
          rel="noreferrer"
          target="_blank"
        >
          llms.txt
        </a>
        <a
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
          href="https://github.com/AustinTByrd/prometheus"
          onClick={onNavigate}
          rel="noreferrer"
          target="_blank"
        >
          GitHub
        </a>
      </div>
    </nav>
  )
}
