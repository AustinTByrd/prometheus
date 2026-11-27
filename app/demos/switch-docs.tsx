"use client"

import * as React from "react"

import {
  PlaygroundFigure,
  PlaygroundStage,
} from "@/components/site/playground"
import { Switch } from "@/components/ui/switch"

export function SwitchDemo() {
  const [notifications, setNotifications] = React.useState(true)
  const [marketing, setMarketing] = React.useState(false)

  return (
    <>
      <PlaygroundFigure code={`<Switch
  label="Notifications"
  checked={notifications}
  onToggle={() => setNotifications((value) => !value)}
/>`}>
        <PlaygroundStage className="flex-col items-start gap-1">
          <Switch
            checked={notifications}
            label="Notifications"
            onToggle={() => setNotifications((value) => !value)}
          />
          <Switch
            checked={marketing}
            label="Marketing emails"
            onToggle={() => setMarketing((value) => !value)}
          />
          <Switch checked={false} disabled label="Disabled" onToggle={() => {}} />
        </PlaygroundStage>
      </PlaygroundFigure>
    </>
  )
}
