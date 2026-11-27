"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArchiveBoxIcon,
  ArrowUpRightIcon,
  BoldIcon,
  ItalicIcon,
  MagnifyingGlassIcon,
  UnderlineIcon,
} from "@heroicons/react/16/solid"
import { InboxIcon } from "@heroicons/react/24/outline"

import { Button } from "@/components/ui/button"
import {
  CheckboxGroup,
  CheckboxItem,
} from "@/components/ui/checkbox-group"
import { Empty } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { List, ListItem } from "@/components/ui/list"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu"
import { RadioGroup, RadioItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  ToggleButton,
  ToggleButtonGroup,
} from "@/components/ui/toggle-button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Elevated } from "@/lib/elevated"
import { cn } from "@/lib/utils"

function ShowcaseCard({
  title,
  href,
  className,
  children,
}: {
  title: string
  href: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <Elevated
      className={cn(
        "relative flex min-h-0 flex-col overflow-hidden",
        className,
      )}
      offset={2}
      shadowLevel={2}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border/60 px-4 py-2.5">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <Link
          aria-label={`Open ${title} docs`}
          className="rounded-sm p-1 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          href={href}
        >
          <ArrowUpRightIcon className="size-3.5" />
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center p-5">{children}</div>
    </Elevated>
  )
}

function ButtonsCard() {
  return (
    <ShowcaseCard
      className="md:col-span-2"
      href="/component/button"
      title="Button"
    >
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button>Default</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Delete</Button>
      </div>
    </ShowcaseCard>
  )
}

function CheckboxGroupCard() {
  const items = ["Apples", "Bananas", "Cherries", "Dates"]
  const [checked, setChecked] = React.useState<Set<number>>(new Set([0, 1]))

  return (
    <ShowcaseCard href="/component/checkbox-group" title="Checkbox group">
      <CheckboxGroup checkedIndices={checked}>
        {items.map((label, index) => (
          <CheckboxItem
            checked={checked.has(index)}
            index={index}
            key={label}
            label={label}
            onToggle={() => {
              setChecked((previous) => {
                const next = new Set(previous)
                if (next.has(index)) next.delete(index)
                else next.add(index)
                return next
              })
            }}
          />
        ))}
      </CheckboxGroup>
    </ShowcaseCard>
  )
}

function SwitchCard() {
  const [notifications, setNotifications] = React.useState(true)
  const [marketing, setMarketing] = React.useState(false)

  return (
    <ShowcaseCard href="/component/switch" title="Switch">
      <div className="flex w-full max-w-56 flex-col gap-1">
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
      </div>
    </ShowcaseCard>
  )
}

function SliderCard() {
  const [volume, setVolume] = React.useState(42)
  const [quality, setQuality] = React.useState(2)

  return (
    <ShowcaseCard
      className="md:col-span-2"
      href="/component/slider"
      title="Slider"
    >
      <div className="flex w-full max-w-md flex-col gap-5">
        <Slider
          label="Roundness"
          max={4}
          min={0}
          onChange={(value) => setQuality(value as number)}
          value={quality}
        />
        <Slider
          formatValue={(value) => `${value}%`}
          label="Opacity"
          onChange={(value) => setVolume(value as number)}
          size="compact"
          value={volume}
        />
      </div>
    </ShowcaseCard>
  )
}

function ToggleCard() {
  const [range, setRange] = React.useState<string[]>(["week"])
  const [marks, setMarks] = React.useState<string[]>(["bold"])

  return (
    <ShowcaseCard href="/component/toggle-button" title="Toggle button">
      <div className="flex flex-col items-center gap-3">
        <ToggleButtonGroup
          aria-label="Range"
          onValueChange={setRange}
          value={range}
        >
          <ToggleButton value="day">Day</ToggleButton>
          <ToggleButton value="week">Week</ToggleButton>
          <ToggleButton value="month">Month</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          aria-label="Text style"
          multiple
          onValueChange={setMarks}
          value={marks}
        >
          <ToggleButton aria-label="Bold" size="icon" value="bold">
            <BoldIcon />
          </ToggleButton>
          <ToggleButton aria-label="Italic" size="icon" value="italic">
            <ItalicIcon />
          </ToggleButton>
          <ToggleButton aria-label="Underline" size="icon" value="underline">
            <UnderlineIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    </ShowcaseCard>
  )
}

function MenuCard() {
  return (
    <ShowcaseCard href="/component/menu" title="Menu">
      <Menu>
        <MenuTrigger
          render={<Button variant="outlined">Open menu</Button>}
        />
        <MenuContent align="start" className="w-44">
          <MenuItem>Duplicate</MenuItem>
          <MenuItem>Rename</MenuItem>
          <MenuSeparator />
          <MenuItem>
            <ArchiveBoxIcon data-icon="inline-start" />
            Archive
          </MenuItem>
        </MenuContent>
      </Menu>
    </ShowcaseCard>
  )
}

function RadioCard() {
  const options = ["Option A", "Option B", "Option C"]
  const [selected, setSelected] = React.useState(1)

  return (
    <ShowcaseCard href="/component/radio-group" title="Radio group">
      <RadioGroup selectedIndex={selected}>
        {options.map((label, index) => (
          <RadioItem
            index={index}
            key={label}
            label={label}
            onSelect={() => setSelected(index)}
            selected={selected === index}
          />
        ))}
      </RadioGroup>
    </ShowcaseCard>
  )
}

function ListCard() {
  const roles = [
    { title: "Compute Partnerships", team: "Engineering" },
    { title: "Customer Support", team: "Engineering" },
    { title: "Staff Design Engineer", team: "Engineering" },
    { title: "Commercial Counsel", team: "Legal" },
  ]

  return (
    <ShowcaseCard
      className="md:col-span-2"
      href="/component/list"
      title="List"
    >
      <div className="w-full max-w-sm">
        <List label="Open roles">
          {roles.map((role) => (
            <ListItem
              href="#"
              key={role.title}
              meta={role.team}
              onClick={(event) => event.preventDefault()}
            >
              {role.title}
            </ListItem>
          ))}
        </List>
      </div>
    </ShowcaseCard>
  )
}

function InputCard() {
  return (
    <ShowcaseCard href="/component/input" title="Input">
      <Input
        aria-label="Search"
        className="w-full max-w-56"
        placeholder="Search"
        start={<MagnifyingGlassIcon />}
        type="search"
      />
    </ShowcaseCard>
  )
}

function EmptyCard() {
  return (
    <ShowcaseCard href="/component/empty" title="Empty">
      <Empty
        actions={<Button size="sm">New order</Button>}
        className="py-2"
        description="Orders you create will show up here."
        icon={<InboxIcon />}
        title="No orders yet"
      />
    </ShowcaseCard>
  )
}

function TooltipCard() {
  return (
    <ShowcaseCard href="/component/tooltip" title="Tooltip">
      <TooltipProvider>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger
              render={<Button aria-label="Archive" size="icon" variant="ghost" />}
            >
              <ArchiveBoxIcon />
            </TooltipTrigger>
            <TooltipContent>Archive</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button aria-label="Bold" size="icon" variant="ghost" />
              }
            >
              <BoldIcon />
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button aria-label="Italic" size="icon" variant="ghost" />
              }
            >
              <ItalicIcon />
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </ShowcaseCard>
  )
}

export function ShowcaseBento() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      <ButtonsCard />
      <CheckboxGroupCard />
      <SwitchCard />
      <SliderCard />
      <ToggleCard />
      <MenuCard />
      <ListCard />
      <RadioCard />
      <InputCard />
      <EmptyCard />
      <TooltipCard />
    </div>
  )
}
