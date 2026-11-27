export type MachineState = {
  id: string
  label: string
  detail: string
  /** Grid cell in the diagram, row then column. */
  at: [number, number]
}

export type MachineTransition = {
  from: string
  to: string
  event: string
  /** Condition that picks this transition when an event has more than one. */
  guard?: string
  detail: string
  /** Fires on its own this many ms after entering `from`. */
  after?: number
}

export type Machine = {
  id: string
  title: string
  summary: string
  /** Where the state lives in the registry source. */
  source: string
  /** What moves it between states. */
  drivenBy: string
  /** Docs pages that show this machine. */
  slugs: string[]
  initial: string
  states: MachineState[]
  transitions: MachineTransition[]
}

export const machines: Machine[] = [
  {
    id: "overlay",
    title: "Overlay presence",
    summary:
      "Dialog, Sheet, and the Select menu stay mounted while they animate. Open is two states, and so is closed.",
    source: "registry/ui/dialog.tsx, sheet.tsx, select.tsx",
    drivenBy: "Base UI open state, data-starting-style and data-ending-style, onOpenChangeComplete",
    slugs: ["dialog", "sheet", "select"],
    initial: "closed",
    states: [
      { id: "closed", label: "Closed", detail: "Popup is unmounted. Focus sits on the page.", at: [0, 0] },
      {
        id: "opening",
        label: "Opening",
        detail: "Popup mounts with data-starting-style, then eases in. Focus moves into the popup.",
        at: [1, 0],
      },
      {
        id: "open",
        label: "Open",
        detail: "Popup is interactive. The page behind is inert and the backdrop is up.",
        at: [2, 0],
      },
      {
        id: "closing",
        label: "Closing",
        detail: "Popup carries data-ending-style and eases out. Focus returns to the trigger.",
        at: [1, 1],
      },
    ],
    transitions: [
      { from: "closed", to: "opening", event: "OPEN", detail: "Trigger press, or open set to true." },
      {
        from: "opening",
        to: "open",
        event: "ANIMATION_END",
        detail: "onOpenChangeComplete(true).",
        after: 160,
      },
      { from: "opening", to: "closing", event: "CLOSE", detail: "Dismissed before the entrance finished." },
      { from: "open", to: "closing", event: "CLOSE", detail: "Close button, or open set to false." },
      { from: "open", to: "closing", event: "ESCAPE", detail: "Escape key." },
      { from: "open", to: "closing", event: "OUTSIDE_PRESS", detail: "Press on the backdrop or the page." },
      {
        from: "closing",
        to: "closed",
        event: "ANIMATION_END",
        detail: "onOpenChangeComplete(false). The popup unmounts.",
        after: 160,
      },
      { from: "closing", to: "opening", event: "OPEN", detail: "Reopened during the exit. It reverses from where it is." },
    ],
  },
  {
    id: "tooltip",
    title: "Tooltip presence",
    summary:
      "Hover waits on Provider or Trigger delay unless focus, provider grouping, or delay zero skips it. The popup is non-modal, lifts on the surface ladder, animates with --duration-instant, and unmounts when closed. SidebarMenuButton keeps content hidden until the rail is icon-only and the viewport is wide.",
    source: "registry/ui/tooltip.tsx, prometheus-provider.tsx, registry/ui/sidebar.tsx (SidebarMenuButton)",
    drivenBy:
      "Base UI Tooltip, TooltipProvider delay, closeDelay, and timeout, Trigger delay and closeDelay, hidden on TooltipContent, data-open and data-closed, onOpenChangeComplete",
    slugs: ["tooltip", "prometheus-provider", "sidebar", "app-shell"],
    initial: "closed",
    states: [
      {
        id: "closed",
        label: "Closed",
        detail: "Popup is unmounted. Focus and pointer rest on the page or the trigger.",
        at: [0, 0],
      },
      {
        id: "delayed",
        label: "Delayed",
        detail:
          "Hover intent. Provider or Trigger delay is running. Popup stays unmounted until the timer ends.",
        at: [1, 0],
      },
      {
        id: "entering",
        label: "Entering",
        detail:
          "Popup mounted with data-open. Fade and zoom over --duration-instant unless data-instant skips motion.",
        at: [2, 0],
      },
      {
        id: "open",
        label: "Open",
        detail:
          "Readable beside the anchor. Pointer leaving the trigger waits closeDelay, then dismisses.",
        at: [2, 1],
      },
      {
        id: "exiting",
        label: "Exiting",
        detail: "data-closed. Exit animation, then the portal unmounts.",
        at: [1, 1],
      },
    ],
    transitions: [
      {
        from: "closed",
        to: "delayed",
        event: "HOVER",
        guard: "delay remains",
        detail: "Pointer entered the trigger. The hover timer starts.",
      },
      {
        from: "closed",
        to: "entering",
        event: "HOVER",
        guard: "delay is zero",
        detail:
          "Pointer entered the trigger. PrometheusProvider sets Provider delay 0, so the popup mounts immediately.",
      },
      {
        from: "closed",
        to: "entering",
        event: "HOVER",
        guard: "within provider timeout",
        detail:
          "Another tooltip closed within TooltipProvider timeout (default 400ms). The next trigger opens without waiting on hover delay.",
      },
      {
        from: "closed",
        to: "entering",
        event: "FOCUS",
        detail: "Keyboard focus on the trigger. Skips the hover delay.",
      },
      {
        from: "delayed",
        to: "entering",
        event: "DELAY_END",
        detail: "Hover delay elapsed. The popup mounts.",
        after: 600,
      },
      {
        from: "delayed",
        to: "closed",
        event: "UNHOVER",
        detail: "Pointer left before the delay finished.",
      },
      {
        from: "entering",
        to: "open",
        event: "ANIMATION_END",
        detail: "onOpenChangeComplete(true).",
        after: 120,
      },
      {
        from: "entering",
        to: "exiting",
        event: "UNHOVER",
        detail: "Pointer left during the entrance.",
      },
      {
        from: "open",
        to: "exiting",
        event: "UNHOVER",
        detail: "Pointer left the trigger after closeDelay.",
      },
      { from: "open", to: "exiting", event: "BLUR", detail: "Focus left the trigger." },
      { from: "open", to: "exiting", event: "ESCAPE", detail: "Escape while the trigger is focused." },
      {
        from: "open",
        to: "exiting",
        event: "DISMISS",
        detail: "Trigger pressed with closeOnClick, or open set to false.",
      },
      {
        from: "exiting",
        to: "closed",
        event: "ANIMATION_END",
        detail: "onOpenChangeComplete(false). The popup unmounts.",
        after: 120,
      },
      {
        from: "exiting",
        to: "entering",
        event: "HOVER",
        detail: "Pointer returned during the exit.",
      },
      {
        from: "closed",
        to: "closed",
        event: "HOVER",
        guard: "content hidden",
        detail:
          "TooltipContent stays hidden (for example SidebarMenuButton when expanded, on mobile, or without tooltip). The tree may mount but nothing shows.",
      },
      {
        from: "delayed",
        to: "closed",
        event: "DISABLE",
        detail: "Trigger disabled, or Tooltip root disabled.",
      },
    ],
  },
  {
    id: "drawer",
    title: "Drawer swipe",
    summary:
      "Drawer adds a swipe on top of overlay presence. A release either springs back, lands on a snap point, or dismisses.",
    source: "registry/ui/drawer.tsx",
    drivenBy: "Base UI drawer, data-swiping, --drawer-swipe-progress, --drawer-swipe-strength",
    slugs: ["drawer"],
    initial: "closed",
    states: [
      { id: "closed", label: "Closed", detail: "Drawer is unmounted.", at: [0, 0] },
      { id: "opening", label: "Opening", detail: "Slides in from its edge.", at: [1, 0] },
      {
        id: "open",
        label: "Open",
        detail: "Resting, at the full height or on a snap point.",
        at: [2, 0],
      },
      {
        id: "swiping",
        label: "Swiping",
        detail: "Follows the pointer with transitions off. The backdrop fades with swipe progress.",
        at: [2, 1],
      },
      {
        id: "closing",
        label: "Closing",
        detail: "Slides out. A fast swipe shortens the exit through --drawer-swipe-strength.",
        at: [1, 1],
      },
    ],
    transitions: [
      { from: "closed", to: "opening", event: "OPEN", detail: "Trigger press, or open set to true." },
      { from: "opening", to: "open", event: "ANIMATION_END", detail: "onOpenChangeComplete(true).", after: 450 },
      { from: "open", to: "swiping", event: "SWIPE_START", detail: "Pointer drags the popup or the handle." },
      {
        from: "swiping",
        to: "open",
        event: "RELEASE",
        guard: "short of the dismiss threshold",
        detail: "Springs back, or settles on the nearest snap point.",
      },
      {
        from: "swiping",
        to: "closing",
        event: "RELEASE",
        guard: "past the dismiss threshold",
        detail: "Dismissed with reason swipe.",
      },
      { from: "open", to: "closing", event: "CLOSE", detail: "Close button, Escape, or a press outside." },
      { from: "closing", to: "closed", event: "ANIMATION_END", detail: "onOpenChangeComplete(false).", after: 400 },
    ],
  },
  {
    id: "sidebar",
    title: "Sidebar",
    summary:
      "Two machines that trade places at the md breakpoint. Wide viewports collapse in place. Narrow ones open a sheet.",
    source: "registry/ui/sidebar.tsx",
    drivenBy: "open and openMobile state, usePrometheus().isMobile, the sidebar_state cookie, ⌘B",
    slugs: ["sidebar", "app-shell"],
    initial: "expanded",
    states: [
      {
        id: "expanded",
        label: "Expanded",
        detail: "data-state=expanded. Labels, groups, and badges show.",
        at: [0, 0],
      },
      {
        id: "collapsed",
        label: "Collapsed",
        detail:
          "data-state=collapsed. Offcanvas slides away, or icon keeps a rail of icons. SidebarMenuButton labels move into a right-side Tooltip.",
        at: [1, 0],
      },
      {
        id: "sheet-closed",
        label: "Sheet closed",
        detail: "Below md. The sidebar lives in a Sheet that is closed.",
        at: [0, 1],
      },
      {
        id: "sheet-open",
        label: "Sheet open",
        detail: "Below md. The Sheet is open over the page.",
        at: [1, 1],
      },
    ],
    transitions: [
      { from: "expanded", to: "collapsed", event: "TOGGLE", detail: "Trigger, rail, or ⌘B. Saved to the cookie." },
      { from: "collapsed", to: "expanded", event: "TOGGLE", detail: "Trigger, rail, or ⌘B. Saved to the cookie." },
      { from: "expanded", to: "sheet-closed", event: "NARROW", detail: "Viewport drops below md." },
      { from: "collapsed", to: "sheet-closed", event: "NARROW", detail: "Viewport drops below md." },
      { from: "sheet-closed", to: "sheet-open", event: "TOGGLE", detail: "Trigger or ⌘B." },
      { from: "sheet-open", to: "sheet-closed", event: "TOGGLE", detail: "Trigger, ⌘B, Escape, or a press outside." },
      {
        from: "sheet-closed",
        to: "expanded",
        event: "WIDEN",
        guard: "desktop state was expanded",
        detail: "Viewport reaches md. The desktop state was kept the whole time.",
      },
      {
        from: "sheet-closed",
        to: "collapsed",
        event: "WIDEN",
        guard: "desktop state was collapsed",
        detail: "Viewport reaches md. The desktop state was kept the whole time.",
      },
    ],
  },
  {
    id: "input",
    title: "Input",
    summary:
      "A field is empty, focused, or filled. A check on the value can hold it pending, a failed check marks it invalid, and disabled sets it aside. Hover and read-only are styling on top of these.",
    source: "registry/ui/input.tsx, form.tsx (FormInput)",
    drivenBy: "focus and blur, the value, pending, aria-invalid from the schema, and disabled",
    slugs: ["input"],
    initial: "empty",
    states: [
      { id: "empty", label: "Empty", detail: "No value and no focus. The placeholder shows.", at: [1, 0] },
      {
        id: "focused",
        label: "Focused",
        detail: "The caret is in. The border darkens to 40% foreground, with no ring.",
        at: [1, 1],
      },
      { id: "filled", label: "Filled", detail: "Holds a value without focus.", at: [1, 2] },
      {
        id: "disabled",
        label: "Disabled",
        detail: "Half opacity, out of the tab order, and left out of the submit. The value is kept.",
        at: [0, 1],
      },
      {
        id: "pending",
        label: "Pending",
        detail: "A check on the value is running. A Spinner sits at the end and the input is aria-busy.",
        at: [2, 2],
      },
      {
        id: "invalid",
        label: "Invalid",
        detail: "aria-invalid. Destructive border, with the error under the field in aria-describedby.",
        at: [2, 1],
      },
    ],
    transitions: [
      { from: "empty", to: "focused", event: "FOCUS", detail: "A click, a tap, Tab, or a press on the label." },
      { from: "filled", to: "focused", event: "FOCUS", detail: "A click, a tap, Tab, or a press on the label." },
      { from: "focused", to: "empty", event: "BLUR", guard: "no value", detail: "The placeholder comes back." },
      { from: "focused", to: "filled", event: "BLUR", guard: "has a value", detail: "Nothing to check, or the check already passed." },
      { from: "focused", to: "pending", event: "CHECK", detail: "Blur starts a check on the server, such as a username lookup." },
      { from: "focused", to: "invalid", event: "VALIDATE", guard: "fails the schema", detail: "Blur or submit finds a problem on the spot." },
      { from: "pending", to: "filled", event: "RESOLVE", guard: "passes", detail: "The Spinner leaves. The value is kept." },
      { from: "pending", to: "invalid", event: "RESOLVE", guard: "fails", detail: "The error appears under the field." },
      { from: "empty", to: "invalid", event: "VALIDATE", guard: "required", detail: "Submit with nothing entered." },
      { from: "filled", to: "invalid", event: "VALIDATE", guard: "fails the schema", detail: "Submit finds a problem." },
      { from: "invalid", to: "focused", event: "EDIT", detail: "Typing clears the error. The field checks again on the next blur or submit." },
      { from: "empty", to: "disabled", event: "DISABLE", detail: "disabled set to true." },
      { from: "filled", to: "disabled", event: "DISABLE", detail: "disabled set to true. The value stays." },
      { from: "disabled", to: "empty", event: "ENABLE", guard: "no value", detail: "disabled set to false." },
      { from: "disabled", to: "filled", event: "ENABLE", guard: "has a value", detail: "disabled set to false." },
    ],
  },
  {
    id: "textarea",
    title: "Textarea",
    summary:
      "The same empty, focused, and filled cycle as Input, with a limit state when the text reaches maxLength. The field grows between rows and maxRows in every state.",
    source: "registry/ui/textarea.tsx, form.tsx (FormTextarea)",
    drivenBy: "focus and blur, the value length against maxLength, aria-invalid from the schema, and disabled",
    slugs: ["textarea"],
    initial: "empty",
    states: [
      { id: "empty", label: "Empty", detail: "No value and no focus. The placeholder shows at the rows height.", at: [1, 0] },
      {
        id: "focused",
        label: "Focused",
        detail: "The caret is in. The border darkens to 40% foreground, with no ring. Cmd or Ctrl+Enter submits the form.",
        at: [1, 1],
      },
      { id: "filled", label: "Filled", detail: "Holds a value without focus, at the height of its text.", at: [1, 2] },
      {
        id: "disabled",
        label: "Disabled",
        detail: "Half opacity, out of the tab order, and left out of the submit. The value is kept.",
        at: [0, 1],
      },
      {
        id: "limit",
        label: "Limit",
        detail: "The text reached maxLength. The count turns foreground and further typing stops.",
        at: [2, 2],
      },
      {
        id: "invalid",
        label: "Invalid",
        detail: "aria-invalid. Destructive border, with the error under the field in aria-describedby.",
        at: [2, 1],
      },
    ],
    transitions: [
      { from: "empty", to: "focused", event: "FOCUS", detail: "A click anywhere in the box, a tap, Tab, or a press on the label." },
      { from: "filled", to: "focused", event: "FOCUS", detail: "A click anywhere in the box, a tap, Tab, or a press on the label." },
      { from: "focused", to: "empty", event: "BLUR", guard: "no value", detail: "The placeholder comes back." },
      { from: "focused", to: "filled", event: "BLUR", guard: "passes", detail: "The value is kept at its height." },
      { from: "focused", to: "invalid", event: "VALIDATE", guard: "fails the schema", detail: "Blur or submit finds a problem." },
      { from: "focused", to: "limit", event: "TYPE", guard: "reaches maxLength", detail: "The count reads full." },
      { from: "limit", to: "focused", event: "DELETE", detail: "Removing text frees room again." },
      { from: "limit", to: "filled", event: "BLUR", detail: "A full value is still a valid value." },
      { from: "empty", to: "invalid", event: "VALIDATE", guard: "required", detail: "Submit with nothing entered." },
      { from: "filled", to: "invalid", event: "VALIDATE", guard: "fails the schema", detail: "Submit finds a problem." },
      { from: "invalid", to: "focused", event: "EDIT", detail: "Typing clears the error. The field checks again on the next blur or submit." },
      { from: "empty", to: "disabled", event: "DISABLE", detail: "disabled set to true." },
      { from: "filled", to: "disabled", event: "DISABLE", detail: "disabled set to true. The value stays." },
      { from: "disabled", to: "empty", event: "ENABLE", guard: "no value", detail: "disabled set to false." },
      { from: "disabled", to: "filled", event: "ENABLE", guard: "has a value", detail: "disabled set to false." },
    ],
  },
  {
    id: "form",
    title: "Form submit",
    summary:
      "Validation runs before submit. While the handler is pending, FormSubmit shows a Spinner, reads Saving, and stays disabled.",
    source: "registry/ui/form.tsx",
    drivenBy: "react-hook-form errors, the zod resolver, and the pending flag around onSubmit",
    slugs: ["form"],
    initial: "idle",
    states: [
      { id: "idle", label: "Idle", detail: "Fields are editable. Nothing is reported.", at: [0, 0] },
      {
        id: "invalid",
        label: "Invalid",
        detail: "Field errors under each failing field. Each field revalidates as it changes.",
        at: [0, 1],
      },
      {
        id: "submitting",
        label: "Submitting",
        detail: "onSubmit is pending. Submit is disabled with a Spinner and the pending label. Inputs turn read-only, so the values sent are the values shown.",
        at: [1, 0],
      },
      { id: "succeeded", label: "Succeeded", detail: "onSubmit resolved.", at: [2, 0] },
      {
        id: "failed",
        label: "Failed",
        detail: "onSubmit set a root error. FormRootError shows it above the actions.",
        at: [2, 1],
      },
    ],
    transitions: [
      { from: "idle", to: "submitting", event: "SUBMIT", guard: "schema passes", detail: "onSubmit starts." },
      { from: "idle", to: "invalid", event: "SUBMIT", guard: "schema fails", detail: "Field errors appear. onSubmit does not run." },
      { from: "invalid", to: "idle", event: "EDIT", guard: "every field passes", detail: "Errors clear as fields are corrected." },
      { from: "invalid", to: "submitting", event: "SUBMIT", guard: "schema passes", detail: "onSubmit starts." },
      { from: "submitting", to: "succeeded", event: "RESOLVE", detail: "onSubmit resolved." },
      { from: "submitting", to: "failed", event: "REJECT", detail: "onSubmit called setError on root." },
      { from: "succeeded", to: "idle", event: "EDIT", detail: "A field changes." },
      { from: "succeeded", to: "submitting", event: "SUBMIT", guard: "schema passes", detail: "onSubmit runs again." },
      { from: "failed", to: "submitting", event: "SUBMIT", guard: "schema passes", detail: "The root error clears and onSubmit runs again." },
      { from: "failed", to: "invalid", event: "SUBMIT", guard: "schema fails", detail: "The root error clears and field errors appear." },
    ],
  },
  {
    id: "reveal",
    title: "Loading reveal",
    summary:
      "Skeleton lays the real content out unseen and draws a bar for every line and a block for every image. A short hold keeps fast loads from flashing a skeleton at all.",
    source: "registry/ui/skeleton.tsx (skullet/react)",
    drivenBy: "loading or data, a 150ms hold, and the reveal mode",
    slugs: ["skeleton"],
    initial: "held",
    states: [
      {
        id: "held",
        label: "Held",
        detail: "Loading has started. The skeleton waits 150ms, so data that beats it never shows one.",
        at: [0, 0],
      },
      {
        id: "skeleton",
        label: "Skeleton",
        detail: "Bars measured from the content shimmer in its exact footprint. The slot is aria-busy and inert.",
        at: [1, 0],
      },
      {
        id: "revealing",
        label: "Revealing",
        detail: "Content replaces its skeleton: whole, piece by piece, or behind a sweep, as the reveal mode decides.",
        at: [2, 0],
      },
      {
        id: "content",
        label: "Content",
        detail: "The content is in place. The skeleton took the same space, so nothing moved.",
        at: [1, 1],
      },
    ],
    transitions: [
      { from: "held", to: "skeleton", event: "HOLD_END", detail: "150ms passed with no data.", after: 150 },
      { from: "held", to: "content", event: "LOADED", detail: "Data beat the hold. The content shows at once." },
      { from: "skeleton", to: "revealing", event: "LOADED", detail: "The data arrived." },
      { from: "revealing", to: "content", event: "REVEAL_END", detail: "The last piece lands.", after: 320 },
      { from: "content", to: "held", event: "LOADING", detail: "A refetch. The next skeleton is drawn from the data on screen." },
    ],
  },
  {
    id: "data-view",
    title: "Data view",
    summary:
      "Skeleton, Empty, and Error are the states of one fetch. Skeleton takes error and emptyMessage, so each view swaps into the same slot, and Error offers the way back.",
    source: "registry/ui/skeleton.tsx, empty.tsx, error.tsx",
    drivenBy: "the app's request, through Skeleton's data, error, and empty props",
    slugs: ["empty", "error"],
    initial: "loading",
    states: [
      { id: "loading", label: "Loading", detail: "Skeleton draws the rows from the sample.", at: [1, 0] },
      { id: "ready", label: "Ready", detail: "Rows came back. The view renders.", at: [2, 0] },
      { id: "empty", label: "Empty", detail: "The request worked and returned nothing. Empty offers the first action.", at: [2, 1] },
      { id: "error", label: "Error", detail: "The request failed. ErrorState explains and offers Try again.", at: [0, 1] },
    ],
    transitions: [
      { from: "loading", to: "ready", event: "SUCCESS", guard: "rows", detail: "The content reveals." },
      { from: "loading", to: "empty", event: "SUCCESS", guard: "no rows", detail: "Empty reveals." },
      { from: "loading", to: "error", event: "FAILURE", detail: "ErrorState reveals." },
      { from: "error", to: "loading", event: "RETRY", detail: "Try again." },
      { from: "empty", to: "loading", event: "REFRESH", detail: "The first record was created." },
      { from: "ready", to: "loading", event: "REFRESH", detail: "Filters or the range changed." },
    ],
  },
  {
    id: "column-split",
    title: "Column split",
    summary:
      "A merged value leans toward its column as the table nears a breakpoint, then snaps out. Narrowing pulls it back the same way.",
    source: "registry/ui/table.tsx",
    drivenBy: "container width from a ResizeObserver, --split-*-travel and --split-*-give",
    slugs: ["table"],
    initial: "merged",
    states: [
      { id: "merged", label: "Merged", detail: "travel 0. The guest sits inside the host cell.", at: [0, 0] },
      {
        id: "leaning",
        label: "Leaning",
        detail: "Within 72px under the breakpoint. travel eases up to 0.3 and the value strains right.",
        at: [1, 0],
      },
      { id: "snapping-out", label: "Snapping out", detail: "travel runs to 1 over 140ms.", at: [2, 0] },
      { id: "split", label: "Split", detail: "travel 1. The guest has its own column.", at: [3, 0] },
      {
        id: "pulling-back",
        label: "Pulling back",
        detail: "Within 72px over the breakpoint while narrowing. travel eases down to 0.7.",
        at: [2, 1],
      },
      { id: "snapping-in", label: "Snapping in", detail: "travel runs to 0 over 140ms.", at: [1, 1] },
    ],
    transitions: [
      { from: "merged", to: "leaning", event: "WIDEN", guard: "within 72px", detail: "Width enters the magnet zone." },
      { from: "leaning", to: "merged", event: "NARROW", guard: "below the zone", detail: "Width leaves the zone. The lean lets go." },
      { from: "leaning", to: "snapping-out", event: "CROSS", detail: "Width reaches the breakpoint." },
      { from: "snapping-out", to: "split", event: "SNAP_END", detail: "140ms, ease-out cubic.", after: 140 },
      { from: "snapping-out", to: "snapping-in", event: "CROSS_BACK", detail: "Width drops back under mid-snap. It reverses from where it is." },
      { from: "split", to: "pulling-back", event: "NARROW", guard: "within 72px", detail: "Width enters the zone over the breakpoint." },
      { from: "pulling-back", to: "split", event: "WIDEN", guard: "past the zone", detail: "The pull lets go." },
      { from: "pulling-back", to: "snapping-in", event: "CROSS_BACK", detail: "Width drops under the breakpoint." },
      { from: "snapping-in", to: "merged", event: "SNAP_END", detail: "140ms, ease-out cubic.", after: 140 },
      { from: "snapping-in", to: "snapping-out", event: "CROSS", detail: "Width climbs back mid-snap." },
      { from: "merged", to: "split", event: "JUMP", detail: "A change over 480px, or reduced motion, lands without the lean." },
      { from: "split", to: "merged", event: "JUMP", detail: "A change over 480px, or reduced motion, lands without the lean." },
    ],
  },
]

export function getMachine(id: string) {
  return machines.find((machine) => machine.id === id)
}

export function machinesFor(slug: string) {
  return machines.filter((machine) => machine.slugs.includes(slug))
}
