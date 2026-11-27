"use client"

import * as React from "react"
import {
  CheckIcon,
  ChevronDownIcon,
  Square2StackIcon,
} from "@heroicons/react/16/solid"

import { Button } from "@/components/ui/button"
import {
  Menu,
  MenuContent,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "@/components/ui/menu"
import { useKitSettings } from "@/components/site/kit-settings-provider"
import {
  buildInstallPrompt,
  kitAccents,
  kitHeadingFonts,
  kitHovers,
  kitIcons,
  kitOptionMeta,
  kitRadii,
  kitSizes,
  kitThemes,
  type KitSettings,
} from "@/lib/kit-settings"
import { cn } from "@/lib/utils"

type MenuKey = Exclude<keyof KitSettings, "primitive">

const rows: {
  key: MenuKey
  values: readonly KitSettings[MenuKey][]
}[] = [
  { key: "theme", values: kitThemes },
  { key: "accent", values: kitAccents },
  { key: "headingFont", values: kitHeadingFonts },
  { key: "radius", values: kitRadii },
  { key: "size", values: kitSizes },
  { key: "icons", values: kitIcons },
  { key: "hover", values: kitHovers },
]

function labelFor<K extends keyof KitSettings>(
  key: K,
  value: KitSettings[K]
): string {
  const meta = kitOptionMeta[key]
  return (meta.labels as Record<string, string>)[value as string] ?? String(value)
}

const triggerClassName =
  "group flex w-full items-center justify-between gap-3 rounded-sm px-2 py-1.5 text-left text-sm outline-none transition-colors hover:bg-hover focus-visible:bg-hover data-popup-open:bg-hover"

export function CopyInstallPrompt({
  className,
  size = "default",
}: {
  className?: string
  size?: "default" | "sm"
}) {
  const { settings } = useKitSettings()
  const [copied, setCopied] = React.useState(false)

  async function copy() {
    await navigator.clipboard.writeText(buildInstallPrompt(settings))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <Button
      className={cn("w-full justify-center", className)}
      onClick={copy}
      size={size}
      variant="default"
    >
      {copied ? (
        <CheckIcon data-icon="inline-start" />
      ) : (
        <Square2StackIcon data-icon="inline-start" />
      )}
      {copied ? "Copied" : "Copy install prompt"}
    </Button>
  )
}

function KitSettingMenu({
  settingKey,
  values,
}: {
  settingKey: MenuKey
  values: readonly KitSettings[MenuKey][]
}) {
  const { settings, update } = useKitSettings()
  const meta = kitOptionMeta[settingKey]
  const value = settings[settingKey]

  return (
    <Menu modal={false}>
      <MenuTrigger className={triggerClassName}>
        <span className="text-muted-foreground group-hover:text-foreground group-data-popup-open:text-foreground">
          {meta.label}
        </span>
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          {labelFor(settingKey, value)}
          <ChevronDownIcon className="size-3.5 text-muted-foreground transition-transform group-data-popup-open:rotate-180" />
        </span>
      </MenuTrigger>
      <MenuContent align="end" className="min-w-44" side="left" sideOffset={8}>
        <MenuRadioGroup
          value={value}
          onValueChange={(next) =>
            update(settingKey, next as KitSettings[MenuKey])
          }
        >
          {values.map((option) => (
            <MenuRadioItem key={option} value={option}>
              {labelFor(settingKey, option)}
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
  )
}

export function MakeThemYours() {
  const { settings } = useKitSettings()

  return (
    <aside className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-medium">Make them yours</p>
      </div>
      <div className="flex flex-col">
        {rows.map(({ key, values }) => (
          <KitSettingMenu key={key} settingKey={key} values={values} />
        ))}
        <div className="flex items-center justify-between gap-3 rounded-sm px-2 py-1.5 text-sm">
          <span className="text-muted-foreground">
            {kitOptionMeta.primitive.label}
          </span>
          <span className="font-medium text-foreground">
            {labelFor("primitive", settings.primitive)}
          </span>
        </div>
      </div>
      <CopyInstallPrompt />
    </aside>
  )
}
