// @prometheus 0.2.0
"use client"

import * as React from "react"
import { ThemeProvider } from "next-themes"

import { TooltipProvider } from "@/components/ui/tooltip"
import { breakpoints } from "@/lib/breakpoints"
import {
  ShapeProvider,
  type ShapeVariant,
} from "@/lib/shape-context"
import {
  SizeProvider,
  type SizeVariant,
} from "@/lib/size-context"
import { SurfaceProvider } from "@/lib/surface-context"

type PrometheusContextValue = {
  isMobile: boolean
}

const PrometheusContext = React.createContext<PrometheusContextValue | null>(
  null
)

export function usePrometheus() {
  const context = React.useContext(PrometheusContext)

  if (!context) {
    throw new Error("usePrometheus must be used within PrometheusProvider.")
  }

  return context
}

export function PrometheusProvider({
  children,
  breakpoint = breakpoints.md.px,
  isMobile: isMobileProp,
  defaultTheme = "dark",
  enableSystem = true,
  forcedTheme,
  size = "default",
  shape = "rounded",
}: {
  children: React.ReactNode
  breakpoint?: number
  isMobile?: boolean
  defaultTheme?: "light" | "dark" | "system"
  enableSystem?: boolean
  forcedTheme?: "light" | "dark"
  size?: SizeVariant
  shape?: ShapeVariant
}) {
  const [isMobileDetected, setIsMobileDetected] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const update = () => setIsMobileDetected(media.matches)

    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [breakpoint])

  const isMobile = isMobileProp ?? isMobileDetected

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      forcedTheme={forcedTheme}
    >
      <SizeProvider size={size}>
        <ShapeProvider shape={shape}>
          <TooltipProvider>
            <PrometheusContext.Provider value={{ isMobile }}>
              <SurfaceProvider value={1}>{children}</SurfaceProvider>
            </PrometheusContext.Provider>
          </TooltipProvider>
        </ShapeProvider>
      </SizeProvider>
    </ThemeProvider>
  )
}
