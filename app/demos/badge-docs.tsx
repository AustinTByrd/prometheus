import { Badge } from "@/components/ui/badge"
import { chartPalette } from "@/lib/chart-palette"

const labels: Record<(typeof chartPalette)[number], string> = {
  blue: "Live",
  sand: "Queued",
  terracotta: "At risk",
  plum: "Review",
  sage: "Healthy",
  amber: "Warning",
}

export function BadgeDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>Draft</Badge>
        {chartPalette.map((color) => (
          <Badge color={color} key={color}>
            {labels[color]}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge size="lg">Draft</Badge>
        {chartPalette.map((color) => (
          <Badge color={color} key={color} size="lg">
            {labels[color]}
          </Badge>
        ))}
      </div>
    </div>
  )
}
