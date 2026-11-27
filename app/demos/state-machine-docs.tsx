"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { AtSymbolIcon } from "@heroicons/react/16/solid"
import { ExclamationCircleIcon, InboxIcon } from "@heroicons/react/24/outline"
import { z } from "zod"

import { ManualMachine, StateMachineView, useMachine } from "@/components/site/state-machine"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Empty } from "@/components/ui/empty"
import { ErrorState } from "@/components/ui/error"
import {
  Form,
  FormInput,
  FormRootError,
  FormSubmit,
  usePrometheusForm,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getMachine, type Machine } from "@/lib/state-machines"

function closeEvent(reason: string) {
  if (reason === "escape-key") return "ESCAPE"
  if (reason === "outside-press") return "OUTSIDE_PRESS"
  return "CLOSE"
}

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "fig", label: "Fig" },
  { value: "pear", label: "Pear" },
]

function OverlayDemo({ machine, kind }: { machine: Machine; kind: "dialog" | "sheet" | "select" }) {
  const { state, last, send, take, reset } = useMachine(machine, { timers: false })
  const open = state === "opening" || state === "open"
  const onOpenChange = (next: boolean, details: { reason: string }) => {
    if (next) send("OPEN")
    else if (!send(closeEvent(details.reason))) send("CLOSE")
  }
  const onOpenChangeComplete = () => send("ANIMATION_END")

  let preview: ReactNode
  if (kind === "select") {
    preview = (
      <Select
        defaultValue="fig"
        items={fruits}
        onOpenChange={onOpenChange}
        onOpenChangeComplete={onOpenChangeComplete}
        open={open}
      >
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {fruits.map((fruit) => (
            <SelectItem key={fruit.value} value={fruit.value}>
              {fruit.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  } else if (kind === "sheet") {
    preview = (
      <>
        <Button onClick={() => send("OPEN")}>
          Open sheet
        </Button>
        <Sheet onOpenChange={onOpenChange} onOpenChangeComplete={onOpenChangeComplete} open={open}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Press Escape, the backdrop, or the close button. Each one is its own event.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </>
    )
  } else {
    preview = (
      <>
        <Button onClick={() => send("OPEN")}>
          Open dialog
        </Button>
        <Dialog onOpenChange={onOpenChange} onOpenChangeComplete={onOpenChangeComplete} open={open}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Archive project</DialogTitle>
              <DialogDescription>
                Press Escape, the backdrop, or a button. Each one is its own event.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button />}>Cancel</DialogClose>
              <DialogClose render={<Button variant="primary" />}>
                Archive
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <StateMachineView last={last} machine={machine} onReset={reset} onTake={take} state={state}>
      {preview}
    </StateMachineView>
  )
}

function TooltipDemo({ machine }: { machine: Machine }) {
  const { state, last, send, take, reset } = useMachine(machine, { timers: true })
  const stateRef = useRef(state)
  stateRef.current = state
  const open = state === "entering" || state === "open" || state === "exiting"

  const onOpenChange = (next: boolean, details: { reason: string }) => {
    if (next) {
      if (details.reason === "trigger-focus") send("FOCUS")
      else send("DELAY_END") || send("HOVER", "within provider timeout") || send("HOVER", "delay is zero")
      return
    }
    if (details.reason === "escape-key") send("ESCAPE")
    else if (details.reason === "focus-out") send("BLUR")
    else if (details.reason === "trigger-hover") send("UNHOVER")
    else send("DISMISS") || send("UNHOVER")
  }

  const onOpenChangeComplete = (next: boolean) => {
    const current = stateRef.current
    if (next && current === "entering") send("ANIMATION_END")
    if (!next && current === "exiting") send("ANIMATION_END")
  }

  const triggerLabel =
    state === "delayed"
      ? "Hover delay…"
      : state === "entering"
        ? "Entering"
        : state === "exiting"
          ? "Exiting"
          : state === "open"
            ? "Open"
            : "Hover or focus"

  return (
    <StateMachineView last={last} machine={machine} onReset={reset} onTake={take} state={state}>
      <Tooltip
        onOpenChange={onOpenChange}
        onOpenChangeComplete={onOpenChangeComplete}
        open={open}
      >
        <TooltipTrigger
          delay={600}
          onPointerEnter={() => {
            if (stateRef.current === "closed") send("HOVER", "delay remains")
            else if (stateRef.current === "exiting") send("HOVER")
          }}
          onPointerLeave={() => {
            if (stateRef.current === "delayed") send("UNHOVER")
          }}
          render={<Button className="w-36" variant="outlined" />}
        >
          {triggerLabel}
        </TooltipTrigger>
        <TooltipContent>Icon labels, shortcuts, and overflow text.</TooltipContent>
      </Tooltip>
    </StateMachineView>
  )
}

function DrawerDemo({ machine }: { machine: Machine }) {
  const { state, last, send, take, reset } = useMachine(machine, { timers: false })
  const open = state === "opening" || state === "open" || state === "swiping"
  const stateRef = useRef(state)
  stateRef.current = state
  const [popup, setPopup] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!popup) return
    let swiping = popup.hasAttribute("data-swiping")
    const observer = new MutationObserver(() => {
      const now = popup.hasAttribute("data-swiping")
      if (now === swiping) return
      swiping = now
      if (now) {
        send("SWIPE_START")
        return
      }
      window.setTimeout(() => {
        if (stateRef.current === "swiping") send("RELEASE", "short of the dismiss threshold")
      }, 0)
    })
    observer.observe(popup, { attributeFilter: ["data-swiping"], attributes: true })
    return () => observer.disconnect()
  }, [popup, send])

  return (
    <StateMachineView last={last} machine={machine} onReset={reset} onTake={take} state={state}>
      <Button onClick={() => send("OPEN")}>
        Open drawer
      </Button>
      <Drawer
        onOpenChange={(next, details) => {
          if (next) send("OPEN")
          else if (details.reason !== "swipe") send("CLOSE")
          else if (!send("RELEASE", "past the dismiss threshold")) send("CLOSE")
        }}
        onOpenChangeComplete={() => send("ANIMATION_END")}
        open={open}
        showSwipeHandle
      >
        <DrawerContent ref={setPopup}>
          <DrawerHeader>
            <DrawerTitle>Move to folder</DrawerTitle>
            <DrawerDescription>
              Drag the drawer down a little and let go, then drag it further.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose render={<Button />}>Done</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </StateMachineView>
  )
}

const TAKEN_USERNAMES = ["admin", "prometheus", "root"]

function InputDemo({ machine }: { machine: Machine }) {
  const [value, setValue] = useState("")
  const [focused, setFocused] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [disabled, setDisabled] = useState(false)
  const check = useRef(0)

  const derived = disabled
    ? "disabled"
    : pending
      ? "pending"
      : error
        ? "invalid"
        : focused
          ? "focused"
          : value
            ? "filled"
            : "empty"
  const { state, last } = useMachine(machine, { state: derived })

  function onBlur() {
    setFocused(false)
    const next = value.trim()
    if (!next || error) return
    if (next.length < 3) {
      setError("Use at least 3 characters.")
      return
    }
    const id = ++check.current
    setPending(true)
    window.setTimeout(() => {
      if (id !== check.current) return
      setPending(false)
      if (TAKEN_USERNAMES.includes(next.toLowerCase())) setError(`${next} is taken. Try another.`)
    }, 900)
  }

  return (
    <StateMachineView last={last} machine={machine} state={state}>
      <div className="flex w-full max-w-xs flex-col gap-2">
        <label className="text-sm font-medium" htmlFor="machine-username">
          Username
        </label>
        <Input
          aria-describedby="machine-username-note"
          autoCapitalize="none"
          autoComplete="username"
          disabled={disabled}
          id="machine-username"
          invalid={Boolean(error)}
          onBlur={onBlur}
          onChange={(event) => {
            setValue(event.target.value)
            setError(null)
            setPending(false)
            check.current++
          }}
          onFocus={() => setFocused(true)}
          pending={pending}
          placeholder="ada"
          spellCheck={false}
          start={<AtSymbolIcon />}
          value={value}
        />
        <p
          className={error ? "text-sm text-destructive" : "text-sm text-muted-foreground"}
          id="machine-username-note"
          role={error ? "alert" : undefined}
        >
          {error ?? "Blur to check it. Try admin, or two letters."}
        </p>
        <Button
          className="self-start"
          onClick={() => setDisabled((current) => !current)}
          size="sm"
          variant="outlined"
        >
          {disabled ? "Enable" : "Disable"}
        </Button>
      </div>
    </StateMachineView>
  )
}

const signupSchema = z.object({ email: z.string().email("Enter a valid email.") })

function FormDemo({ machine }: { machine: Machine }) {
  const form = usePrometheusForm(signupSchema, { defaultValues: { email: "" } })
  const [outcome, setOutcome] = useState<"success" | "failure">("success")
  const [pending, setPending] = useState(false)
  const [succeeded, setSucceeded] = useState(false)
  const { errors } = form.formState

  useEffect(() => {
    const subscription = form.watch(() => setSucceeded(false))
    return () => subscription.unsubscribe()
  }, [form])

  const derived = pending
    ? "submitting"
    : errors.root
      ? "failed"
      : Object.keys(errors).some((key) => key !== "root")
        ? "invalid"
        : succeeded
          ? "succeeded"
          : "idle"
  const { state, last } = useMachine(machine, { state: derived })

  return (
    <StateMachineView last={last} machine={machine} state={state}>
      <div className="flex w-full max-w-sm flex-col gap-4">
        <Form
          form={form}
          onSubmit={async () => {
            setPending(true)
            setSucceeded(false)
            await new Promise((resolve) => window.setTimeout(resolve, 1200))
            setPending(false)
            if (outcome === "failure") {
              form.setError("root", { message: "The server is busy. Try again in a moment." })
            } else {
              setSucceeded(true)
            }
          }}
        >
          <FormInput label="Email" name="email" placeholder="you@example.com" type="email" />
          <FormRootError />
          <div className="flex items-center justify-between gap-3">
            <div aria-label="Server response" className="flex rounded-full bg-muted p-0.5" role="group">
              {(
                [
                  ["success", "Server accepts"],
                  ["failure", "Server fails"],
                ] as const
              ).map(([id, name]) => (
                <button
                  aria-pressed={outcome === id}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    outcome === id ? "bg-card text-foreground shadow-surface-2" : "text-muted-foreground"
                  }`}
                  key={id}
                  onClick={() => setOutcome(id)}
                  type="button"
                >
                  {name}
                </button>
              ))}
            </div>
            <FormSubmit>Sign up</FormSubmit>
          </div>
        </Form>
      </div>
    </StateMachineView>
  )
}

function RevealDemo({ machine }: { machine: Machine }) {
  const { state, last, take, reset } = useMachine(machine)
  const loading = state === "held" || state === "skeleton"

  return (
    <StateMachineView last={last} machine={machine} onReset={reset} onTake={take} state={state}>
      <div className="w-full max-w-sm">
        <Skeleton label="Loading profile" loading={loading}>
          <div className="flex items-start gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-xs font-medium">
              A
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Ada Lovelace</span>
              <span className="text-sm text-muted-foreground">
                Analyst. Writes the notes that outlive the machine.
              </span>
            </div>
          </div>
        </Skeleton>
      </div>
    </StateMachineView>
  )
}

type Order = { id: string; item: string; price: string }

const orders: Order[] = [
  { id: "1042", item: "Linen apron", price: "$48" },
  { id: "1041", item: "Field notebook", price: "$16" },
]

function DataViewDemo({ machine }: { machine: Machine }) {
  const { state, last, send, take, reset } = useMachine(machine)
  const data = state === "ready" ? orders : null

  return (
    <StateMachineView last={last} machine={machine} onReset={reset} onTake={take} state={state}>
      <div className="w-full max-w-sm">
        <Skeleton
          data={data}
          empty={state === "empty"}
          emptyMessage={
            <Empty
              actions={
                <Button onClick={() => send("REFRESH")} size="sm">
                  New order
                </Button>
              }
              className="py-6"
              description="Orders you create will show up here."
              icon={<InboxIcon />}
              title="No orders yet"
            />
          }
          error={
            state === "error" ? (
              <ErrorState
                actions={
                  <Button onClick={() => send("RETRY")} size="sm">
                    Try again
                  </Button>
                }
                className="py-6"
                description="The orders could not be loaded. Your place in the list is unchanged."
                icon={<ExclamationCircleIcon />}
                title="Orders didn't load"
              />
            ) : undefined
          }
          label="Loading orders"
          sample={orders}
        >
          {(rows) => (
            <div className="flex flex-col gap-2 text-sm">
              {rows.map((order) => (
                <div className="flex justify-between" key={order.id}>
                  <span>
                    #{order.id} {order.item}
                  </span>
                  <span className="text-muted-foreground">{order.price}</span>
                </div>
              ))}
              <Button className="self-start" onClick={() => send("REFRESH")} size="sm" variant="ghost">
                Refresh
              </Button>
            </div>
          )}
        </Skeleton>
      </div>
    </StateMachineView>
  )
}

const BIO_MAX = 80

function TextareaDemo({ machine }: { machine: Machine }) {
  const [value, setValue] = useState("")
  const [focused, setFocused] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [disabled, setDisabled] = useState(false)

  const derived = disabled
    ? "disabled"
    : error
      ? "invalid"
      : focused && value.length >= BIO_MAX
        ? "limit"
        : focused
          ? "focused"
          : value
            ? "filled"
            : "empty"
  const { state, last } = useMachine(machine, { state: derived })

  return (
    <StateMachineView last={last} machine={machine} state={state}>
      <div className="flex w-full max-w-xs flex-col gap-2">
        <label className="text-sm font-medium" htmlFor="machine-bio">
          Bio
        </label>
        <Textarea
          aria-describedby="machine-bio-note"
          disabled={disabled}
          id="machine-bio"
          invalid={Boolean(error)}
          maxLength={BIO_MAX}
          onBlur={() => {
            setFocused(false)
            const length = value.trim().length
            if (length > 0 && length < 12) setError("Write at least 12 characters.")
          }}
          onChange={(event) => {
            setValue(event.target.value)
            setError(null)
          }}
          onFocus={() => setFocused(true)}
          placeholder="A line or two about you"
          rows={2}
          count="characters"
          value={value}
        />
        <p
          className={error ? "text-sm text-destructive" : "text-sm text-muted-foreground"}
          id="machine-bio-note"
          role={error ? "alert" : undefined}
        >
          {error ?? "Blur with a few words to fail the check, or type to the limit."}
        </p>
        <Button
          className="self-start"
          onClick={() => setDisabled((current) => !current)}
          size="sm"
          variant="outlined"
        >
          {disabled ? "Enable" : "Disable"}
        </Button>
      </div>
    </StateMachineView>
  )
}

export function MachineDemo({ id, slug }: { id: string; slug?: string }) {
  const machine = getMachine(id)
  if (!machine) return null
  switch (machine.id) {
    case "overlay":
      return (
        <OverlayDemo kind={slug === "sheet" || slug === "select" ? slug : "dialog"} machine={machine} />
      )
    case "tooltip":
      return <TooltipDemo machine={machine} />
    case "drawer":
      return <DrawerDemo machine={machine} />
    case "input":
      return <InputDemo machine={machine} />
    case "textarea":
      return <TextareaDemo machine={machine} />
    case "form":
      return <FormDemo machine={machine} />
    case "reveal":
      return <RevealDemo machine={machine} />
    case "data-view":
      return <DataViewDemo machine={machine} />
    default:
      return <ManualMachine machine={machine} />
  }
}
