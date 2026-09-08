import type * as React from "react"

import { cn } from "@/lib/utils"

export function Kbd({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5 min-w-5 items-center justify-center rounded-sm border bg-muted px-1 font-mono text-[11px] font-medium text-muted-foreground",
        className
      )}
    >
      {children}
    </kbd>
  )
}

export function KbdShortcut({
  keys,
  className,
}: {
  keys: string[]
  className?: string
}) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {keys.map((key) => (
        <Kbd key={key}>{key}</Kbd>
      ))}
    </span>
  )
}
