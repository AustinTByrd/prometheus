import { cn } from "@/lib/utils"

export function CodeBlock({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  return (
    <pre
      className={cn(
        "overflow-x-auto whitespace-pre rounded-lg bg-surface-2 px-4 py-3 font-mono text-xs text-foreground/80",
        className
      )}
    >
      {children}
    </pre>
  )
}
