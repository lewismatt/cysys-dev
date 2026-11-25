import { Bar, BarChart, Cell, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@cysys/ui/components/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@cysys/ui/components/chart"
import { Progress } from "@cysys/ui/components/progress"

import { BandLabel, RatingPill } from "./band"
import { bandOf, guns, last24, nextWindow, now, waterByDay } from "./data"

const wetBulbConfig = {
  wetBulb: { label: "Wet-bulb °F", color: "var(--muted-foreground)" },
} satisfies ChartConfig

const waterConfig = {
  gallons: { label: "Million gal", color: "var(--muted-foreground)" },
} satisfies ChartConfig

export function WetBulbNow() {
  return (
    <Card>
      <CardHeader>
        <CardDescription className="font-mono text-xs tracking-wider uppercase">
          Wet-bulb now
        </CardDescription>
        <CardTitle className="text-3xl font-medium tracking-tight">
          {now.wetBulb.toFixed(1)}°F
        </CardTitle>
        <CardAction>
          <BandLabel band={bandOf(now.wetBulb)} />
        </CardAction>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={wetBulbConfig}
          className="aspect-auto h-14 w-full font-mono"
        >
          <LineChart
            data={last24}
            margin={{ top: 4, bottom: 4, left: 0, right: 0 }}
          >
            <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="wetBulb"
              type="monotone"
              stroke="var(--color-wetBulb)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <div className="mt-auto px-4 font-mono text-xs text-muted-foreground">
        Last 24 hours · NWS Boulder hourly
      </div>
    </Card>
  )
}

export function NextWindowStat() {
  const [startDay, startTime] = splitLabel(nextWindow.start)
  const [endDay, endTime] = splitLabel(nextWindow.end)
  return (
    <Card>
      <CardHeader>
        <CardDescription className="font-mono text-xs tracking-wider uppercase">
          Next window
        </CardDescription>
        <CardTitle className="text-3xl font-medium tracking-tight">
          {startTime}
          <span className="px-2 text-muted-foreground">→</span>
          {endTime}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 text-muted-foreground">
        <div>
          {startDay} to {endDay.toLowerCase()} · {nextWindow.hours} h
        </div>
        <div className="tabular-nums">
          <span className="text-foreground">{nextWindow.goodOrBetter}</span>{" "}
          Good-or-better hours · coldest{" "}
          <span className="text-foreground">{nextWindow.coldest}°F</span>
        </div>
      </CardContent>
      <div className="mt-auto flex items-center gap-1.5 px-4 font-mono text-xs text-muted-foreground">
        Shifts{" "}
        <span className="text-foreground">{nextWindow.shifts.join(" → ")}</span>
        <RatingPill
          rating={nextWindow.goodOrBetter >= 4 ? "favorable" : "marginal"}
          className="ml-auto"
        />
      </div>
    </Card>
  )
}

export function WaterThisWeek() {
  const total = waterByDay.reduce((sum, d) => sum + d.gallons, 0)
  return (
    <Card>
      <CardHeader>
        <CardDescription className="font-mono text-xs tracking-wider uppercase">
          Water this week
        </CardDescription>
        <CardTitle className="text-3xl font-medium tracking-tight">
          {total.toFixed(1)}M
          <span className="ml-1 text-base font-normal text-muted-foreground">
            gal
          </span>
        </CardTitle>
        <CardAction>
          <span className="font-mono text-xs text-muted-foreground">
            <span className="text-foreground">+18%</span> vs last week
          </span>
        </CardAction>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={waterConfig}
          className="aspect-auto h-14 w-full font-mono"
        >
          <BarChart
            data={waterByDay}
            margin={{ top: 4, bottom: 0, left: 0, right: 0 }}
          >
            <XAxis dataKey="day" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="gallons" radius={3}>
              {waterByDay.map((_, i) => (
                <Cell
                  key={i}
                  fill={
                    i === waterByDay.length - 1
                      ? "var(--primary)"
                      : "var(--muted-foreground)"
                  }
                  fillOpacity={i === waterByDay.length - 1 ? 1 : 0.35}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <div className="mt-auto px-4 font-mono text-xs text-muted-foreground">
        Mon – Sun · all pump houses
      </div>
    </Card>
  )
}

export function GunsRunning() {
  const running = guns.filter((g) => g.status === "running").length
  const faults = guns.filter((g) => g.status === "fault").length
  return (
    <Card>
      <CardHeader>
        <CardDescription className="font-mono text-xs tracking-wider uppercase">
          Guns running
        </CardDescription>
        <CardTitle className="text-3xl font-medium tracking-tight">
          {running}
          <span className="text-muted-foreground"> / {guns.length}</span>
        </CardTitle>
        {faults > 0 && (
          <CardAction>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-no-window">
              <span
                className="size-1.5 rounded-full bg-no-window"
                aria-hidden
              />
              {faults} fault{faults === 1 ? "" : "s"}
            </span>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Progress
          value={(running / guns.length) * 100}
          className="[&_[data-slot=progress-indicator]]:bg-foreground/55"
          aria-label="Guns running"
        />
        <div className="flex justify-between font-mono text-xs text-muted-foreground">
          <span>{guns.reduce((s, g) => s + g.gpm, 0)} gpm total</span>
          <span>{Math.round((running / guns.length) * 100)}%</span>
        </div>
      </CardContent>
      <div className="mt-auto px-4 font-mono text-xs text-muted-foreground">
        Updated 2 min ago
      </div>
    </Card>
  )
}

function splitLabel(label: string): [string, string] {
  const i = label.lastIndexOf(" ")
  return i < 0 ? [label, ""] : [label.slice(0, i), label.slice(i + 1)]
}
