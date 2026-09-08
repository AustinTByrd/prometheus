import Link from "next/link"

import { HomeDialogDemo } from "@/app/demos/home-dialog-demo"
import { catalog, initCommand } from "@/lib/catalog"

const categories = ["Setup", "Actions", "Overlays", "Forms", "Layout"] as const

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 py-16">
      <section className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="flex flex-col gap-6">
          <p className="text-sm font-medium text-primary">A few less lines of code.</p>
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Your components. Your defaults. Every project.
          </h1>
          <p className="max-w-xl text-muted-foreground text-pretty">
            Prometheus is a personal shadcn registry on Base UI. Install the
            source into the app. Keep a small prop API for dialogs, forms, and
            the mobile behavior agents would otherwise rewrite.
          </p>
          <pre className="overflow-x-auto rounded-lg border bg-card px-4 py-3 font-mono text-xs text-card-foreground">
            {initCommand()}
          </pre>
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
          <h2 className="text-2xl font-semibold tracking-tight">Components</h2>
          <p className="text-sm text-muted-foreground">
            Small APIs for the things you and your coding agent do every day.
          </p>
        </div>
        {categories.map((category) => {
          const items = catalog.filter((item) => item.category === category)
          return (
            <div className="flex flex-col gap-3" key={category}>
              <h3 className="text-sm font-medium text-muted-foreground">{category}</h3>
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
