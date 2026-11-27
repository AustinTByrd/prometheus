"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"

import { CodeBlock } from "@/components/site/code-block"
import {
  PlaygroundFigure,
  PlaygroundRow,
  PlaygroundStage,
} from "@/components/site/playground"
import { Skeleton, SkulletProvider } from "@/components/ui/skeleton"
import { Toggle } from "@/components/ui/toggle"
import { Elevated } from "@/lib/elevated"

const profile = (
  <div className="flex items-start gap-4">
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-xs font-medium">
      A
    </div>
    <div className="flex min-w-0 flex-1 flex-col">
      <p className="text-base font-medium">Avery Chen</p>
      <p className="text-sm text-muted-foreground">Product design</p>
      <p className="text-sm text-muted-foreground">
        Last active 2 hours ago
      </p>
    </div>
  </div>
)

function Example({
  label,
  options,
  value,
  onValueChange,
  children,
}: {
  label: string
  options: readonly { value: string; label: string }[]
  value: string
  onValueChange: (value: string) => void
  children: ReactNode
}) {
  return (
    <PlaygroundFigure>
      <PlaygroundStage>
        <div className="w-full max-w-sm">{children}</div>
      </PlaygroundStage>
      <PlaygroundRow className="p-0">
        <div
          aria-label={label}
          className="flex w-full items-center justify-center p-1.5"
          role="group"
        >
          {options.map((option) => {
            const selected = option.value === value
            return (
              <Toggle
                className="group h-[41px] min-w-0 flex-1 basis-0 rounded-sm bg-transparent p-1.5 hover:bg-transparent aria-pressed:bg-transparent"
                key={option.value}
                pressed={selected}
                onClick={() => onValueChange(option.value)}
              >
                <span className="relative flex h-[29px] w-full items-center justify-center rounded-sm px-2.5 text-sm leading-none font-medium transition-[scale] duration-150 ease-[cubic-bezier(0.2,0,0,1)] group-active:scale-[0.96] motion-reduce:transition-none motion-reduce:group-active:scale-100">
                  <span
                    aria-hidden
                    className={
                      selected
                        ? "absolute inset-0 scale-100 rounded-sm bg-foreground/10 opacity-100 transition-[scale,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"
                        : "pointer-events-none absolute inset-0 scale-90 rounded-sm bg-foreground/10 opacity-0 transition-[scale,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"
                    }
                  />
                  <span className="relative">{option.label}</span>
                </span>
              </Toggle>
            )
          })}
        </div>
      </PlaygroundRow>
    </PlaygroundFigure>
  )
}

function useReload(latency: number) {
  const [loading, setLoading] = useState(true)
  const timer = useRef<number | undefined>(undefined)
  const reload = (ms = latency) => {
    window.clearTimeout(timer.current)
    setLoading(true)
    timer.current = window.setTimeout(() => setLoading(false), ms)
  }
  useEffect(() => {
    timer.current = window.setTimeout(() => setLoading(false), latency)
    return () => window.clearTimeout(timer.current)
  }, [latency])
  return { loading, reload }
}

export function SkeletonRevealDemo() {
  const [loading, setLoading] = useState(true)

  return (
    <>
      <Example
        label="Reveal"
        options={[
          { value: "loading", label: "Loading" },
          { value: "reveal", label: "Loaded" },
        ]}
        value={loading ? "loading" : "reveal"}
        onValueChange={(next) => setLoading(next === "loading")}
      >
        <Elevated className="rounded-xl p-4" offset={1}>
          <Skeleton label="Loading profile" loading={loading}>
            {profile}
          </Skeleton>
        </Elevated>
      </Example>
      <CodeBlock>{`<Skeleton loading={${loading}} label="Loading profile">
  <Profile />
</Skeleton>`}</CodeBlock>
    </>
  )
}

type Member = { name: string; role: string; seen: string }

const SAMPLE_MEMBER: Member = {
  name: "Sample Name",
  role: "Sample role",
  seen: "Last active sample",
}

const members: Record<string, Member> = {
  fast: { name: "Avery Chen", role: "Product design", seen: "Last active 2 hours ago" },
  slow: { name: "Jordan Okafor", role: "Platform engineering", seen: "Last active yesterday" },
}

function MemberCard({ member }: { member: Member }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-xs font-medium">
        {member.name[0]}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-base font-medium">{member.name}</p>
        <p className="text-sm text-muted-foreground">{member.role}</p>
        <p className="text-sm text-muted-foreground">{member.seen}</p>
      </div>
    </div>
  )
}

const LATENCY = { fast: 90, slow: 1400 } as const

export function SkeletonDataDemo() {
  const [speed, setSpeed] = useState<keyof typeof LATENCY>("slow")
  const { loading, reload } = useReload(LATENCY.slow)
  const member = loading ? null : members[speed]

  return (
    <>
      <Example
        label="Load"
        options={[
          { value: "fast", label: "Fast load" },
          { value: "slow", label: "Slow load" },
        ]}
        value={speed}
        onValueChange={(next) => {
          const key = next as keyof typeof LATENCY
          setSpeed(key)
          reload(LATENCY[key])
        }}
      >
        <Elevated className="rounded-xl p-4" offset={1}>
          <Skeleton data={member} label="Loading member" sample={SAMPLE_MEMBER}>
            {(loaded) => <MemberCard member={loaded} />}
          </Skeleton>
        </Elevated>
      </Example>
      <CodeBlock>{`<Skeleton data={member} sample={SAMPLE_MEMBER}>
  {(member) => <MemberCard member={member} />}
</Skeleton>`}</CodeBlock>
    </>
  )
}

const rows = [
  { title: "Quarterly review", meta: "Due Friday", body: "Draft the summary and share it with the leads." },
  { title: "Hiring loop", meta: "3 candidates", body: "Collect feedback before the debrief." },
  { title: "Launch checklist", meta: "8 of 12 done", body: "Copy, pricing, and the status page remain." },
]

const REVEALS = ["smart", "together", "sequence", "sweep"] as const

export function SkeletonRevealModeDemo() {
  const [reveal, setReveal] = useState<(typeof REVEALS)[number]>("smart")
  const { loading, reload } = useReload(1100)

  return (
    <>
      <Example
        label="Reveal mode"
        options={REVEALS.map((value) => ({ value, label: value[0].toUpperCase() + value.slice(1) }))}
        value={reveal}
        onValueChange={(next) => {
          setReveal(next as (typeof REVEALS)[number])
          reload()
        }}
      >
        <SkulletProvider reveal={reveal}>
          <Skeleton label="Loading tasks" loading={loading}>
            <ul className="flex flex-col gap-3">
              {rows.map((row) => (
                <li className="flex flex-col gap-0.5 rounded-lg bg-muted/50 p-3" key={row.title}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-medium">{row.title}</span>
                    <span className="text-xs text-muted-foreground">{row.meta}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{row.body}</span>
                </li>
              ))}
            </ul>
          </Skeleton>
        </SkulletProvider>
      </Example>
      <CodeBlock>{`<SkulletProvider reveal="${reveal}">
  <Skeleton loading={loading}>…</Skeleton>
</SkulletProvider>`}</CodeBlock>
    </>
  )
}

const ANIMATIONS = ["shimmer", "group-shimmer", "pulse", "none"] as const

export function SkeletonAnimationDemo() {
  const [animation, setAnimation] = useState<(typeof ANIMATIONS)[number]>("shimmer")

  return (
    <>
      <Example
        label="Animation"
        options={ANIMATIONS.map((value) => ({ value, label: value }))}
        value={animation}
        onValueChange={(next) => setAnimation(next as (typeof ANIMATIONS)[number])}
      >
        <div key={animation} style={{ "--skullet-animation": animation } as CSSProperties}>
          <Skeleton loading>{profile}</Skeleton>
        </div>
      </Example>
      <CodeBlock>{`.my-section {
  --skullet-animation: ${animation};
}`}</CodeBlock>
    </>
  )
}

const TEXT = {
  full: { top: "ascender", bottom: "descender", label: "Ascender to descender" },
  tight: { top: "x-height", bottom: "baseline", label: "x-height to baseline" },
} as const

export function SkeletonTextDemo() {
  const [text, setText] = useState<keyof typeof TEXT>("full")
  const { top, bottom } = TEXT[text]

  return (
    <>
      <Example
        label="Text lines"
        options={Object.entries(TEXT).map(([value, item]) => ({ value, label: item.label }))}
        value={text}
        onValueChange={(next) => setText(next as keyof typeof TEXT)}
      >
        <div
          key={text}
          style={{ "--skullet-text-top": top, "--skullet-text-bottom": bottom } as CSSProperties}
        >
          <Skeleton loading>{profile}</Skeleton>
        </div>
      </Example>
      <CodeBlock>{`.my-section {
  --skullet-text-top: ${top};
  --skullet-text-bottom: ${bottom};
}`}</CodeBlock>
    </>
  )
}
