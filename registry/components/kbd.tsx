import type * as React from "react"

import { cn } from "@/lib/utils"

export function Kbd({
  children,
  className,
  ...props
}: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5 min-w-5 items-center justify-center rounded-sm border bg-muted px-1 font-mono text-[11px] font-medium text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  )
}

export function KbdShortcut({
  keys,
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  keys: string[]
}) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)} {...props}>
      {keys.map((key, index) => (
        <Kbd key={`${key}-${index}`}>{key}</Kbd>
      ))}
    </span>
  )
}
