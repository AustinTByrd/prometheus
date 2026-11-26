"use client"

import * as React from "react"
import { ThemeProvider } from "next-themes"

import { TooltipProvider } from "@/components/ui/tooltip"

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
  breakpoint = 768,
  isMobile: isMobileProp,
  defaultTheme = "dark",
}: {
  children: React.ReactNode
  breakpoint?: number
  isMobile?: boolean
  defaultTheme?: "light" | "dark" | "system"
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
  const contextValue = React.useMemo(() => ({ isMobile }), [isMobile])

  return (
    <ThemeProvider attribute="class" defaultTheme={defaultTheme} enableSystem>
      <TooltipProvider>
        <PrometheusContext.Provider value={contextValue}>
          {children}
        </PrometheusContext.Provider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
