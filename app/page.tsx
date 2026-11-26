import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { HomeDialogDemo } from "@/app/demos/home-dialog-demo"
import { Button } from "@/components/button"
import { CommandBlock } from "@/components/site/command-block"
import { catalog, catalogCategories, initCommand } from "@/lib/catalog"

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 py-16">
      <section className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="flex flex-col gap-6">
          <p className="text-sm font-medium text-primary">
            A few less lines of code.
          </p>
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Your components. Your defaults. Every project.
          </h1>
          <p className="max-w-xl text-muted-foreground text-pretty">
            Prometheus is a personal shadcn registry on Base UI. Install the
            source into the app. Keep a small prop API for dialogs, popovers,
            forms, and the mobile behavior agents would otherwise rewrite.
          </p>
          <CommandBlock code={initCommand()} />
          <div className="flex flex-wrap items-center gap-3">
            <Button
              href="/guide"
              icon={ArrowRightIcon}
              iconPosition="end"
              size="sm"
            >
              Usage guide
            </Button>
            <Button href="/llms.txt" size="sm" variant="outline">
              Read llms.txt
            </Button>
          </div>
        </div>
        <div className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-xl border bg-card p-8">
          <p className="text-sm text-muted-foreground">Live component</p>
          <HomeDialogDemo />
          <p className="text-center text-xs text-muted-foreground">
            A dialog on desktop. A swipeable drawer on mobile.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-8" id="components">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Components ({catalog.length})
          </h2>
          <p className="text-sm text-muted-foreground">
            Small APIs for the things you and your coding agent do every day.
          </p>
        </div>
        {catalogCategories.map((category) => {
          const items = catalog.filter((item) => item.category === category)
          return (
            <div className="flex flex-col gap-3" key={category}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {category}
                </h3>
                <span className="font-mono text-xs text-muted-foreground">
                  {items.length}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <Link
                    className="flex flex-col gap-2 rounded-xl border bg-card p-4 transition-colors hover:border-foreground/20"
                    href={`/component/${item.slug}`}
                    key={item.slug}
                  >
                    <span className="font-medium">{item.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.description}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </section>
    </main>
  )
}
