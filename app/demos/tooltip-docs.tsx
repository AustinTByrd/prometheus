"use client"

import * as React from "react"
import {
  ArchiveBoxIcon,
  ArrowUturnLeftIcon,
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  TrashIcon,
  UnderlineIcon,
} from "@heroicons/react/16/solid"

import {
  PlaygroundFigure,
  PlaygroundOptions,
  PlaygroundRow,
  PlaygroundStage,
} from "@/components/site/playground"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Elevated } from "@/lib/elevated"

/** Pinned demos wait for web fonts, or the popup anchors to pre-reflow text. */
function usePinned() {
  const [pinned, setPinned] = React.useState(false)

  React.useEffect(() => {
    let active = true
    document.fonts.ready.then(() => {
      if (active) setPinned(true)
    })
    return () => {
      active = false
    }
  }, [])

  return pinned
}

const SIDES = [
  { value: "top", label: "Top" },
  { value: "right", label: "Right" },
  { value: "bottom", label: "Bottom" },
  { value: "left", label: "Left" },
] as const

const ALIGNS = [
  { value: "start", label: "Start" },
  { value: "center", label: "Center" },
  { value: "end", label: "End" },
] as const

const TERM_CLASS_NAME =
  "cursor-help rounded-xs whitespace-nowrap text-foreground underline decoration-foreground/40 decoration-dotted underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"

type Side = (typeof SIDES)[number]["value"]
type Align = (typeof ALIGNS)[number]["value"]

export function TooltipPlacementDemo() {
  const pinned = usePinned()
  const [side, setSide] = React.useState<Side>("top")
  const [align, setAlign] = React.useState<Align>("center")
  const props = [
    side === "top" ? "" : ` side="${side}"`,
    align === "center" ? "" : ` align="${align}"`,
  ].join("")

  return (
    <>
      <PlaygroundFigure code={`<p>
  Menus and dialogs lift on the{" "}
  <Tooltip>
    <TooltipTrigger
      render={<span className="underline decoration-dotted" tabIndex={0} />}
    >
      surface ladder
    </TooltipTrigger>
    <TooltipContent${props}>
      Eight nested levels of background and shadow
    </TooltipContent>
  </Tooltip>{" "}
  in both themes.
</p>`}>
        <PlaygroundStage className="min-h-56">
          <p className="text-sm text-foreground/80">
            Menus and dialogs lift on the{" "}
            <Tooltip open={pinned}>
              <TooltipTrigger render={<span className={TERM_CLASS_NAME} tabIndex={0} />}>
                surface ladder
              </TooltipTrigger>
              <TooltipContent align={align} side={side}>
                Eight nested levels of background and shadow
              </TooltipContent>
            </Tooltip>{" "}
            in both themes.
          </p>
        </PlaygroundStage>
        <PlaygroundRow>
          <PlaygroundOptions label="Side" options={SIDES} value={side} onValueChange={setSide} />
        </PlaygroundRow>
        <PlaygroundRow>
          <PlaygroundOptions label="Align" options={ALIGNS} value={align} onValueChange={setAlign} />
        </PlaygroundRow>
      </PlaygroundFigure>
    </>
  )
}

const SIZES = [
  { value: "sm", label: "sm" },
  { value: "default", label: "default" },
  { value: "lg", label: "lg" },
] as const

const ARROWS = [
  { value: "on", label: "Arrow" },
  { value: "off", label: "No arrow" },
] as const

type Size = (typeof SIZES)[number]["value"]
type Arrow = (typeof ARROWS)[number]["value"]

const SIZE_COPY: Record<Size, string> = {
  sm: "Undo",
  default: "Undo the last change",
  lg: "Undo the last change. Earlier changes stay in the history panel.",
}

export function TooltipSizeDemo() {
  const pinned = usePinned()
  const [size, setSize] = React.useState<Size>("default")
  const [arrow, setArrow] = React.useState<Arrow>("on")
  const props = [
    size === "default" ? "" : ` size="${size}"`,
    arrow === "on" ? "" : " showArrow={false}",
  ].join("")

  return (
    <>
      <PlaygroundFigure code={`<TooltipContent${props}>${SIZE_COPY[size]}</TooltipContent>`}>
        <PlaygroundStage className="min-h-56 items-end pb-12">
          <Tooltip open={pinned}>
            <TooltipTrigger render={<Button aria-label="Undo" size="icon" />}>
              <ArrowUturnLeftIcon />
            </TooltipTrigger>
            <TooltipContent showArrow={arrow === "on"} size={size}>
              {SIZE_COPY[size]}
            </TooltipContent>
          </Tooltip>
        </PlaygroundStage>
        <PlaygroundRow>
          <PlaygroundOptions label="Size" options={SIZES} value={size} onValueChange={setSize} />
        </PlaygroundRow>
        <PlaygroundRow>
          <PlaygroundOptions label="Arrow" options={ARROWS} value={arrow} onValueChange={setArrow} />
        </PlaygroundRow>
      </PlaygroundFigure>
    </>
  )
}

const CONTENTS = [
  { value: "label", label: "Label" },
  { value: "shortcut", label: "Shortcut" },
  { value: "overflow", label: "Overflow" },
] as const

type Content = (typeof CONTENTS)[number]["value"]

const CONTENT_CODE: Record<Content, string> = {
  label: `<TooltipTrigger render={<Button aria-label="Delete" size="icon" />}>
  <TrashIcon />
</TooltipTrigger>
<TooltipContent>Delete</TooltipContent>`,
  shortcut: `<TooltipTrigger render={<Button aria-label="Archive" size="icon" />}>
  <ArchiveBoxIcon />
</TooltipTrigger>
<TooltipContent>
  Archive <kbd data-slot="kbd">E</kbd>
</TooltipContent>`,
  overflow: `<TooltipTrigger render={<span className="block max-w-40 truncate" />}>
  {fileName}
</TooltipTrigger>
<TooltipContent>{fileName}</TooltipContent>`,
}

const FILE_NAME = "quarterly-revenue-forecast-final-v3.xlsx"

export function TooltipContentDemo() {
  const pinned = usePinned()
  const [content, setContent] = React.useState<Content>("label")

  let preview: React.ReactNode
  if (content === "label") {
    preview = (
      <Tooltip open={pinned}>
        <TooltipTrigger render={<Button aria-label="Delete" size="icon" />}>
          <TrashIcon />
        </TooltipTrigger>
        <TooltipContent>Delete</TooltipContent>
      </Tooltip>
    )
  } else if (content === "shortcut") {
    preview = (
      <Tooltip open={pinned}>
        <TooltipTrigger render={<Button aria-label="Archive" size="icon" />}>
          <ArchiveBoxIcon />
        </TooltipTrigger>
        <TooltipContent>
          Archive <kbd data-slot="kbd">E</kbd>
        </TooltipContent>
      </Tooltip>
    )
  } else {
    preview = (
      <Tooltip open={pinned}>
        <TooltipTrigger
          render={<span className="block max-w-40 truncate text-sm" tabIndex={0} />}
        >
          {FILE_NAME}
        </TooltipTrigger>
        <TooltipContent>{FILE_NAME}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <>
      <PlaygroundFigure code={CONTENT_CODE[content]}>
        <PlaygroundStage className="min-h-48 items-end pb-12">{preview}</PlaygroundStage>
        <PlaygroundRow>
          <PlaygroundOptions
            label="Content"
            options={CONTENTS}
            value={content}
            onValueChange={setContent}
          />
        </PlaygroundRow>
      </PlaygroundFigure>
    </>
  )
}

const SURFACES = [
  { value: "0", label: "Figure" },
  { value: "2", label: "Menu · +2" },
  { value: "4", label: "Dialog · +4" },
] as const

type SurfaceOffset = (typeof SURFACES)[number]["value"]

function SurfaceTooltip() {
  const pinned = usePinned()
  return (
    <Tooltip open={pinned}>
      <TooltipTrigger render={<Button />}>Share</TooltipTrigger>
      <TooltipContent>Copy a link to this view</TooltipContent>
    </Tooltip>
  )
}

export function TooltipSurfaceDemo() {
  const [offset, setOffset] = React.useState<SurfaceOffset>("4")

  return (
    <PlaygroundFigure>
      <PlaygroundStage className="min-h-56 items-end pb-10">
        {offset === "0" ? (
          <SurfaceTooltip />
        ) : (
          <Elevated className="flex items-center justify-center px-10 pt-14 pb-6" offset={Number(offset)}>
            <SurfaceTooltip />
          </Elevated>
        )}
      </PlaygroundStage>
      <PlaygroundRow>
        <PlaygroundOptions
          label="Surface"
          options={SURFACES}
          value={offset}
          onValueChange={setOffset}
        />
      </PlaygroundRow>
    </PlaygroundFigure>
  )
}

const DELAYS = [
  { value: "0", label: "0ms · Prometheus" },
  { value: "300", label: "300ms" },
  { value: "600", label: "600ms · Base UI" },
] as const

type Delay = (typeof DELAYS)[number]["value"]

const TOOLBAR = [
  { label: "Bold", shortcut: "⌘B", icon: BoldIcon },
  { label: "Italic", shortcut: "⌘I", icon: ItalicIcon },
  { label: "Underline", shortcut: "⌘U", icon: UnderlineIcon },
  { label: "Link", shortcut: "⌘K", icon: LinkIcon },
] as const

export function TooltipDelayDemo() {
  const [delay, setDelay] = React.useState<Delay>("0")

  return (
    <>
      <PlaygroundFigure code={`<TooltipProvider delay={${delay}}>
  {/* Toolbar of Tooltip + TooltipTrigger + TooltipContent */}
</TooltipProvider>`}>
        <PlaygroundStage className="min-h-48 items-end pb-12">
          <TooltipProvider delay={Number(delay)}>
            <div className="flex gap-1">
              {TOOLBAR.map((item) => (
                <Tooltip key={item.label}>
                  <TooltipTrigger
                    render={<Button aria-label={item.label} size="icon" variant="ghost" />}
                  >
                    <item.icon />
                  </TooltipTrigger>
                  <TooltipContent>
                    {item.label} <kbd data-slot="kbd">{item.shortcut}</kbd>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </PlaygroundStage>
        <PlaygroundRow>
          <PlaygroundOptions label="Delay" options={DELAYS} value={delay} onValueChange={setDelay} />
        </PlaygroundRow>
      </PlaygroundFigure>
    </>
  )
}
