"use client"

import * as React from "react"

import { Elevated } from "@/lib/elevated"
import { CORNERS, SmoothCorners, useCornerRef } from "@/lib/smooth-corners"
import { cn } from "@/lib/utils"

function CompareCard({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className={cn("flex items-center justify-center p-6", className)}>
        {children}
      </div>
    </div>
  )
}

export function SmoothCornersCompareDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <CompareCard label="CSS border-radius">
        <div className="flex size-28 items-center justify-center rounded-xl bg-surface-3 text-xs font-medium shadow-surface-4">
          arc
        </div>
      </CompareCard>
      <CompareCard label="Lisse squircle">
        <SmoothCorners
          corners={CORNERS.xl}
          className="flex size-28 items-center justify-center bg-surface-3 text-xs font-medium shadow-surface-4"
        >
          squircle
        </SmoothCorners>
      </CompareCard>
    </div>
  )
}

export function SmoothCornersSizesDemo() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      {(Object.keys(CORNERS) as Array<keyof typeof CORNERS>).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <SmoothCorners
            corners={CORNERS[size]}
            className="flex size-16 items-center justify-center bg-surface-3 text-[10px] font-medium shadow-surface-3"
          >
            {size}
          </SmoothCorners>
          <span className="text-xs text-muted-foreground">{size}</span>
        </div>
      ))}
    </div>
  )
}

export function SmoothCornersElevatedDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <Elevated className="w-44 p-4" offset={2} shadowLevel={3}>
        <p className="text-sm font-medium">Menu panel</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Elevated defaults to panel corners (xl).
        </p>
      </Elevated>
      <Elevated className="w-44 p-4" corners="lg" offset={2} shadowLevel={3}>
        <p className="text-sm font-medium">corners=&quot;lg&quot;</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Pass a preset key when you want a tighter radius.
        </p>
      </Elevated>
    </div>
  )
}

export function SmoothCornersHookDemo() {
  const ref = useCornerRef("xl")

  return (
    <div
      ref={ref}
      className="flex h-24 items-center justify-center bg-surface-3 px-6 text-sm font-medium shadow-surface-4"
    >
      useCornerRef on a plain div
    </div>
  )
}
