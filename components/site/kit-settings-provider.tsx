"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import {
  KIT_DEFAULTS,
  KIT_STORAGE_KEY,
  type KitSettings,
  kitAccentValues,
  kitRadiusToShape,
  kitRadiusValues,
  parseKitSettings,
} from "@/lib/kit-settings"
import { ShapeProvider } from "@/lib/shape-context"
import { SizeProvider } from "@/lib/size-context"

type KitSettingsContextValue = {
  settings: KitSettings
  setSettings: React.Dispatch<React.SetStateAction<KitSettings>>
  update: <K extends keyof KitSettings>(key: K, value: KitSettings[K]) => void
}

const KitSettingsContext = React.createContext<KitSettingsContextValue | null>(
  null
)

export function useKitSettings() {
  const context = React.useContext(KitSettingsContext)
  if (!context) {
    throw new Error("useKitSettings must be used within KitSettingsProvider.")
  }
  return context
}

function applyKitDom(settings: KitSettings, resolvedTheme: string | undefined) {
  const root = document.documentElement
  root.dataset.kitAccent = settings.accent
  root.dataset.kitHeading = settings.headingFont
  root.dataset.kitRadius = settings.radius
  root.dataset.kitSize = settings.size
  root.dataset.kitIcons = settings.icons
  root.dataset.kitHover = settings.hover
  root.dataset.kitPrimitive = settings.primitive

  root.style.setProperty("--radius", kitRadiusValues[settings.radius])

  const mode = resolvedTheme === "dark" ? "dark" : "light"
  const accent = kitAccentValues[settings.accent][mode]
  root.style.setProperty("--kit-accent", accent)
  root.style.setProperty("--primary", accent)
  root.style.setProperty("--ring", accent)
  root.style.setProperty("--sidebar-primary", accent)
  root.style.setProperty("--sidebar-ring", accent)
  root.style.setProperty("--chart-1", accent)

  if (settings.accent === "umber") {
    // Restore button primary CSS vars from theme sheets by clearing overrides
    root.style.removeProperty("--button-primary")
    root.style.removeProperty("--button-primary-foreground")
    root.style.removeProperty("--button-primary-border")
    root.style.removeProperty("--button-primary-gradient")
  } else {
    const fg = mode === "dark" ? "#1C1918" : "#FEF1DF"
    root.style.setProperty("--button-primary", accent)
    root.style.setProperty("--button-primary-foreground", fg)
    root.style.setProperty("--button-primary-border", accent)
    root.style.setProperty("--button-primary-gradient", "none")
  }
}

function KitDomSync({ settings }: { settings: KitSettings }) {
  const { setTheme, resolvedTheme } = useTheme()

  React.useEffect(() => {
    setTheme(settings.theme)
  }, [settings.theme, setTheme])

  React.useEffect(() => {
    applyKitDom(settings, resolvedTheme)
  }, [settings, resolvedTheme])

  React.useEffect(() => {
    return () => {
      const root = document.documentElement
      delete root.dataset.kitAccent
      delete root.dataset.kitHeading
      delete root.dataset.kitRadius
      delete root.dataset.kitSize
      delete root.dataset.kitIcons
      delete root.dataset.kitHover
      delete root.dataset.kitPrimitive
      root.style.removeProperty("--radius")
      root.style.removeProperty("--kit-accent")
      root.style.removeProperty("--primary")
      root.style.removeProperty("--ring")
      root.style.removeProperty("--sidebar-primary")
      root.style.removeProperty("--sidebar-ring")
      root.style.removeProperty("--chart-1")
      root.style.removeProperty("--button-primary")
      root.style.removeProperty("--button-primary-foreground")
      root.style.removeProperty("--button-primary-border")
      root.style.removeProperty("--button-primary-gradient")
    }
  }, [])

  return null
}

export function KitSettingsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [settings, setSettings] = React.useState<KitSettings>(KIT_DEFAULTS)
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KIT_STORAGE_KEY)
      if (raw) {
        const parsed = parseKitSettings(JSON.parse(raw))
        if (parsed) setSettings(parsed)
      }
    } catch {
      // ignore corrupt storage
    }
    setReady(true)
  }, [])

  React.useEffect(() => {
    if (!ready) return
    window.localStorage.setItem(KIT_STORAGE_KEY, JSON.stringify(settings))
  }, [ready, settings])

  const update = React.useCallback(
    <K extends keyof KitSettings>(key: K, value: KitSettings[K]) => {
      setSettings((current) => ({ ...current, [key]: value }))
    },
    []
  )

  const value = React.useMemo(
    () => ({ settings, setSettings, update }),
    [settings, update]
  )

  return (
    <KitSettingsContext.Provider value={value}>
      <SizeProvider size={settings.size}>
        <ShapeProvider shape={kitRadiusToShape[settings.radius]}>
          {ready ? <KitDomSync settings={settings} /> : null}
          {children}
        </ShapeProvider>
      </SizeProvider>
    </KitSettingsContext.Provider>
  )
}
