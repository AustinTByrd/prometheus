"use client"

import { Fragment, useId, useState } from "react"
import { cn } from "cn"

import {
  BarChart,
  ChartGrid,
  ChartKey,
  LineChart,
  chartPalette,
  type BarDatum,
  type ChartSeries,
  type LineDatum,
} from "@/components/ui/data-display"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const thisShelf: BarDatum[] = [
  { label: "Gatsby", value: 47094 },
  { label: "Frankenstein", value: 75380 },
  { label: "1984", value: 88942 },
  { label: "Pride & Prejudice", value: 121970 },
  { label: "Jane Eyre", value: 183858 },
  { label: "Moby-Dick", value: 206052 },
]

const nextShelf: BarDatum[] = [
  { label: "Animal Farm", value: 29060 },
  { label: "The Road", value: 58702 },
  { label: "Persuasion", value: 87978 },
  {
    label: "Odyssey",
    value: { value: 119502, note: "Bryant translation" },
  },
  { label: "Dracula", value: 161105 },
  { label: "Ulysses", value: 265391 },
  { label: "Emma", value: 156000 },
  { label: "Wuthering Heights", value: 107000 },
  { label: "Little Women", value: 189000 },
  { label: "Heart of Darkness", value: 38000 },
  { label: "Crime and Punishment", value: 211000 },
  { label: "Middlemarch", value: 316000 },
  { label: "Anna Karenina", value: 349000 },
  { label: "War and Peace", value: 587000 },
]

export function BarChartDemo() {
  return (
    <ChartGrid>
      <BarChart
        caption="Total words in each book on this shelf"
        categoryLabel="Work"
        data={thisShelf}
        title="Total words in the book"
        totals={
          <>
            <b className="font-medium text-foreground">Moby-Dick</b> runs
            longest — give it the month, not a weekend.
          </>
        }
        valueLabel="Words"
      />
      <BarChart
        caption="Total words in each book on the next shelf"
        categoryLabel="Work"
        data={nextShelf}
        title="Total words in the book"
        totals={
          <>
            <b className="font-medium text-foreground">Animal Farm</b> is the
            short one — assign it the week the seminar is already full.
          </>
        }
        valueLabel="Words"
      />
    </ChartGrid>
  )
}

const thousands = (value: number) =>
  value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value)

const odysseyBooks: LineDatum[] = [
  { label: "I", value: 4200 },
  { label: "II", value: 3800 },
  { label: "III", value: 5100 },
  { label: "IV", value: 6400 },
  { label: "V", value: { value: 7200, note: "Calypso" } },
  { label: "VI", value: 3900 },
  { label: "VII", value: 4500 },
  { label: "VIII", value: 5800 },
]

const iliadBooks: LineDatum[] = [
  { label: "I", value: 6100 },
  { label: "II", value: 7800 },
  { label: "III", value: 4200 },
  { label: "IV", value: 5300 },
  { label: "V", value: 8100 },
  { label: "VI", value: 4700 },
  { label: "VII", value: 3900 },
  { label: "VIII", value: 5600 },
]

export function LineChartDemo() {
  return (
    <ChartGrid>
      <LineChart
        caption="Approximate word counts by book in the Odyssey, books I–VIII"
        categoryLabel="Book"
        data={odysseyBooks}
        detail="· Odyssey"
        format={thousands}
        formatTick={thousands}
        title="Words per book"
        totals={
          <>
            <b className="font-medium text-foreground">Book V</b> peaks — put
            the seminar discussion on Calypso there.
          </>
        }
        valueLabel="Words"
      />
      <LineChart
        caption="Approximate word counts by book in the Iliad, books I–VIII"
        categoryLabel="Book"
        data={iliadBooks}
        detail="· Iliad"
        format={thousands}
        formatTick={thousands}
        title="Words per book"
        totals={
          <>
            <b className="font-medium text-foreground">Book II</b> runs long —
            split the catalogue reading across two sessions.
          </>
        }
        valueLabel="Words"
      />
    </ChartGrid>
  )
}

const visions = {
  deutan: {
    label: "Deuteranopia",
    matrix:
      "0.367 0.861 -0.228 0 0 0.280 0.673 0.047 0 0 -0.012 0.043 0.969 0 0 0 0 0 1 0",
    note: "Common. Affects 1.5% of males.",
  },
  protan: {
    label: "Protanopia",
    matrix:
      "0.152 1.053 -0.205 0 0 0.115 0.786 0.099 0 0 -0.004 -0.048 1.052 0 0 0 0 0 1 0",
    note: "Less common. Affects 1% of males.",
  },
  tritan: {
    label: "Tritanopia",
    matrix:
      "1.256 -0.077 -0.179 0 0 -0.078 0.931 0.148 0 0 0.005 0.691 0.304 0 0 0 0 0 1 0",
    note: "Rare. Affects 0.008% of everyone.",
  },
} as const

type Vision = keyof typeof visions

const visionKeys = Object.keys(visions) as Vision[]

const paletteSeries: ChartSeries[] = chartPalette.map((color, index) => ({
  key: color,
  label: `${index + 1} · ${color[0].toUpperCase()}${color.slice(1)}`,
  short: color,
}))

const paletteData: BarDatum[] = chartPalette.map((color, index) => ({
  label: `${color[0].toUpperCase()}${color.slice(1)}`,
  value: [0.42, 0.61, 0.38, 0.72, 0.55, 0.47][index]!,
  color,
}))

export function ChartPaletteDemo() {
  const [vision, setVision] = useState<Vision | null>(null)
  const id = useId()
  const matrix = vision ? visions[vision].matrix : null

  return (
    <div className="flex flex-col gap-4">
      <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        {visionKeys.map((key) => (
          <Fragment key={key}>
            <dt
              className={cn(
                "font-medium transition-colors",
                vision === key ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {visions[key].label}
            </dt>
            <dd className="m-0 text-muted-foreground">{visions[key].note}</dd>
          </Fragment>
        ))}
      </dl>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground" id={`${id}-label`}>
          View as
        </span>
        <ToggleGroup
          aria-labelledby={`${id}-label`}
          onValueChange={(value) => setVision((value[0] as Vision) ?? null)}
          size="sm"
          value={vision ? [vision] : []}
          variant="outline"
        >
          {visionKeys.map((key) => (
            <ToggleGroupItem key={key} value={key}>
              {visions[key].label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <svg aria-hidden="true" className="absolute size-0">
        {matrix ? (
          <filter id={id}>
            <feColorMatrix type="matrix" values={matrix} />
          </filter>
        ) : null}
      </svg>
      <div
        className="flex flex-col gap-4"
        style={{ filter: matrix ? `url("#${id}")` : undefined }}
      >
        <ChartKey aria-label="Palette order" series={paletteSeries} />
        <BarChart
          caption="Sample values for all six palette colors"
          categoryLabel="Color"
          data={paletteData}
          format={(value) => value.toFixed(2)}
          formatTick={(value) => value.toFixed(1)}
          title="All six, in order"
          valueLabel="Sample"
        />
      </div>
    </div>
  )
}
