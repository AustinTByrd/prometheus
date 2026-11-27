import type { ElementType, ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * Stacked backdrop-blur bands with gradient masks. Blur builds toward the top
 * and eases out at the bottom so content scrolling under the sticky title softens
 * progressively instead of hitting a hard edge.
 */
function ProgressiveBlur() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-[130%]"
    >
      <span className="absolute inset-0 bg-gradient-to-b from-background from-30% via-background/70 to-transparent" />
      <span
        className="absolute inset-0 backdrop-blur-[1px]"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 35%, transparent 75%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 35%, transparent 75%)",
        }}
      />
      <span
        className="absolute inset-0 backdrop-blur-[2px]"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 20%, transparent 55%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 20%, transparent 55%)",
        }}
      />
      <span
        className="absolute inset-0 backdrop-blur-[4px]"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 8%, transparent 40%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 8%, transparent 40%)",
        }}
      />
    </span>
  )
}

/** Shared sticky chrome so page and section titles push each other at the same top. */
export function DocsStickyTitle({
  as: Tag = "h1",
  id,
  children,
  className,
}: {
  as?: ElementType
  id?: string
  children: ReactNode
  className?: string
}) {
  return (
    <Tag
      className={cn(
        "relative sticky top-12 z-10 -mx-8 px-8 pt-2 pb-4 font-display lg:top-0 lg:-mx-10 lg:px-10",
        Tag === "h2" ? "text-2xl" : "text-4xl",
        className
      )}
      id={id}
    >
      <ProgressiveBlur />
      <span className="relative">{children}</span>
    </Tag>
  )
}
