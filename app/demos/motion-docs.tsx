import { DocsTable } from "@/components/site/docs-article"
import { duration } from "@/lib/motion"

const durationUse = {
  instant: "Reduced-motion fades.",
  fast: "Small state changes, and a placeholder leaving.",
  exit: "Elements leaving. Quicker than an entrance.",
  standard: "Content arriving, panels, and menus.",
  considered: "Rare, introductory reveals.",
} as const

export function MotionDurationDemo() {
  const longest = duration.considered

  return (
    <DocsTable
      headers={["Token", "Duration", "Use it for"]}
      rows={(
        Object.entries(duration) as [keyof typeof duration, number][]
      ).map(([name, ms]) => [
        <code key="token">duration.{name}</code>,
        <span className="flex items-center gap-3" key="value">
          <span className="w-12 shrink-0 tabular-nums">{ms}ms</span>
          <span className="h-1.5 w-24 overflow-hidden rounded-full bg-foreground/10">
            <span
              className="block h-full rounded-full bg-foreground/40"
              style={{ width: `${(ms / longest) * 100}%` }}
            />
          </span>
        </span>,
        durationUse[name],
      ])}
    />
  )
}
