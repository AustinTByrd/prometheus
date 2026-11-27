"use client"

import * as React from "react"
import {
  ClockIcon,
  FolderIcon,
  SparklesIcon,
  StarIcon,
} from "@heroicons/react/16/solid"

import {
  PlaygroundFigure,
  PlaygroundOptions,
  PlaygroundRow,
  PlaygroundStage,
} from "@/components/site/playground"
import { Tabs, TabsItem, TabsPanel, type TabsSize } from "@/components/ui/tabs"

const BASIC_TABS = [
  {
    label: "Teamspaces",
    summary: "Shared spaces with permissions, templates, and weekly activity.",
  },
  {
    label: "Recents",
    summary: "Documents and threads you opened over the last fourteen days.",
  },
  {
    label: "Favorites",
    summary: "Pinned views that stay one click away across projects.",
  },
] as const

export function TabsDefaultDemo() {
  const [selected, setSelected] = React.useState(0)

  return (
    <>
      <PlaygroundFigure code={`const tabs = ["Teamspaces", "Recents", "Favorites"]
const [selected, setSelected] = useState(0)

<Tabs idPrefix="views" selectedIndex={selected} onSelect={setSelected}>
  {tabs.map((label, i) => (
    <TabsItem key={label} index={i} label={label} />
  ))}
</Tabs>

{tabs.map((label, i) => (
  <TabsPanel key={label} index={i} selectedIndex={selected} idPrefix="views">
    <p>{label} content</p>
  </TabsPanel>
))}`}>
        <PlaygroundStage className="flex-col items-start gap-4">
          <Tabs
            idPrefix="demo-basic"
            selectedIndex={selected}
            onSelect={setSelected}
          >
            {BASIC_TABS.map((tab, i) => (
              <TabsItem key={tab.label} index={i} label={tab.label} />
            ))}
          </Tabs>
          {BASIC_TABS.map((tab, i) => (
            <TabsPanel
              key={tab.label}
              index={i}
              selectedIndex={selected}
              idPrefix="demo-basic"
              className="text-sm text-muted-foreground"
            >
              {tab.summary}
            </TabsPanel>
          ))}
        </PlaygroundStage>
      </PlaygroundFigure>
    </>
  )
}

const ICON_TABS = [
  { label: "Teamspaces", icon: FolderIcon },
  { label: "Recents", icon: ClockIcon },
  { label: "Favorites", icon: StarIcon },
  { label: "Highlights", icon: SparklesIcon },
] as const

export function TabsIconsDemo() {
  const [selected, setSelected] = React.useState(0)

  return (
    <>
      <PlaygroundFigure code={`import { FolderIcon, ClockIcon, StarIcon } from "@heroicons/react/16/solid"

<Tabs idPrefix="icons" selectedIndex={selected} onSelect={setSelected}>
  <TabsItem index={0} icon={FolderIcon} label="Teamspaces" />
  <TabsItem index={1} icon={ClockIcon} label="Recents" />
  <TabsItem index={2} icon={StarIcon} label="Favorites" />
</Tabs>`}>
        <PlaygroundStage>
          <Tabs
            idPrefix="demo-icons"
            selectedIndex={selected}
            onSelect={setSelected}
          >
            {ICON_TABS.map((tab, i) => (
              <TabsItem
                key={tab.label}
                index={i}
                icon={tab.icon}
                label={tab.label}
              />
            ))}
          </Tabs>
        </PlaygroundStage>
      </PlaygroundFigure>
    </>
  )
}

export function TabsActiveLabelDemo() {
  const [selected, setSelected] = React.useState(0)

  return (
    <>
      <PlaygroundFigure code={`<Tabs activeLabel idPrefix="compact" selectedIndex={selected} onSelect={setSelected}>
  <TabsItem index={0} icon={FolderIcon} label="Teamspaces" />
  <TabsItem index={1} icon={ClockIcon} label="Recents" />
  <TabsItem index={2} icon={StarIcon} label="Favorites" />
</Tabs>`}>
        <PlaygroundStage>
          <Tabs
            activeLabel
            idPrefix="demo-active-label"
            selectedIndex={selected}
            onSelect={setSelected}
          >
            {ICON_TABS.map((tab, i) => (
              <TabsItem
                key={tab.label}
                index={i}
                icon={tab.icon}
                label={tab.label}
              />
            ))}
          </Tabs>
        </PlaygroundStage>
      </PlaygroundFigure>
    </>
  )
}

const SIZES: { value: TabsSize; label: string }[] = [
  { value: "sm", label: "sm · 28px" },
  { value: "default", label: "default · 32px" },
  { value: "lg", label: "lg · 36px" },
]

export function TabsSizeDemo() {
  const [size, setSize] = React.useState<TabsSize>("default")
  const [selected, setSelected] = React.useState(0)
  const prop = size === "default" ? "" : ` size="${size}"`

  return (
    <>
      <PlaygroundFigure code={`<Tabs${prop} selectedIndex={selected} onSelect={setSelected}>
  <TabsItem index={0} icon={FolderIcon} label="Teamspaces" />
  <TabsItem index={1} icon={ClockIcon} label="Recents" />
  <TabsItem index={2} icon={StarIcon} label="Favorites" />
</Tabs>`}>
        <PlaygroundStage>
          <Tabs
            idPrefix="demo-size"
            selectedIndex={selected}
            onSelect={setSelected}
            size={size}
          >
            {ICON_TABS.slice(0, 3).map((tab, i) => (
              <TabsItem
                key={tab.label}
                index={i}
                icon={tab.icon}
                label={tab.label}
              />
            ))}
          </Tabs>
        </PlaygroundStage>
        <PlaygroundRow>
          <PlaygroundOptions
            label="Size"
            options={SIZES}
            value={size}
            onValueChange={setSize}
          />
        </PlaygroundRow>
      </PlaygroundFigure>
    </>
  )
}
