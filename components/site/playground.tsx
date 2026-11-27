"use client"

import type { ReactNode } from "react"

import { CodeBlock } from "@/components/site/code-block"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Elevated } from "@/lib/elevated"
import { cn } from "@/lib/utils"

export function PlaygroundFigure({
  children,
  code,
}: {
  children: ReactNode
  /** Source shown in a tray that extends out from behind the bottom of the example. */
  code?: string
}) {
  const example = (
    <Elevated
      className={cn("flex flex-col overflow-hidden", code && "relative z-10")}
      offset={2}
      shadowLevel={2}
    >
      {children}
    </Elevated>
  )

  if (code === undefined) return example

  return (
    // Lisse renders the example's shadow as a `z-index: -1` sibling inside this
    // wrapper, so the tray has to sit below it (isolate + -z-10) or it covers it.
    <div className="isolate flex flex-col">
      {example}
      <CodeBlock className="relative -z-10 -mt-6 rounded-2xl px-5 pb-4 pt-10">
        {code}
      </CodeBlock>
    </div>
  )
}

export function PlaygroundStage({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex min-h-40 flex-wrap items-center justify-center gap-3 px-6 py-10",
        className
      )}
    >
      {children}
    </div>
  )
}

export function PlaygroundRow({
  label,
  children,
  className,
}: {
  label?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 border-t border-border p-3",
        className
      )}
    >
      {label ? (
        <span className="shrink-0 pl-1 text-sm text-muted-foreground">
          {label}
        </span>
      ) : null}
      {children}
    </div>
  )
}

export function PlaygroundOptions<T extends string>({
  label,
  options,
  value,
  onValueChange,
}: {
  label: string
  options: readonly { value: T; label: string }[]
  value: T
  onValueChange: (value: T) => void
}) {
  return (
    <ToggleGroup
      aria-label={label}
      className="w-full flex-wrap"
      spacing={1}
      value={[value]}
      onValueChange={(next) => {
        if (next[0]) onValueChange(next[0] as T)
      }}
    >
      {options.map((option) => (
        <ToggleGroupItem
          className="flex-1 text-muted-foreground aria-pressed:text-foreground"
          key={option.value}
          value={option.value}
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
