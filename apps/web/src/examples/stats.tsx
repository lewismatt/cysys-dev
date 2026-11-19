import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from "recharts"

import { Badge } from "@cysys/ui/components/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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

import { BandLabel } from "./band"
import { bandOf, guns, last24, nextWindow, now, waterByDay } from "./data"

const wetBulbConfig = {
  wetBulb: { label: "Wet-bulb °F", color: "var(--chart-1)" },
} satisfies ChartConfig

const waterConfig = {
  gallons: { label: "Million gal", color: "var(--chart-2)" },
} satisfies ChartConfig

export function WetBulbNow() {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Wet-bulb now</CardDescription>
        <CardTitle className="text-3xl font-semibold tabular-nums">
          {now.wetBulb.toFixed(1)}°F
        </CardTitle>
        <CardAction>
          <BandLabel band={bandOf(now.wetBulb)} />
        </CardAction>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={wetBulbConfig} className="aspect-auto h-14 w-full">
          <LineChart data={last24} margin={{ top: 4, bottom: 4, left: 0, right: 0 }}>
            <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
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
      <CardFooter className="mt-auto text-xs text-muted-foreground">
        Last 24 hours · NWS Boulder hourly
      </CardFooter>
    </Card>
  )
}

export function NextWindowStat() {
  const [startDay, startTime] = splitLabel(nextWindow.start)
  const [endDay, endTime] = splitLabel(nextWindow.end)
  return (
    <Card>
      <CardHeader>
        <CardDescription>Next window</CardDescription>
        <CardTitle className="text-3xl font-semibold tabular-nums">
          {startTime}
          <span className="px-1.5 text-muted-foreground">→</span>
          {endTime}
        </CardTitle>
        <CardAction>
          <Badge>Favorable</Badge>
        </CardAction>
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
      <CardFooter className="mt-auto gap-1.5 text-xs text-muted-foreground">
        Shifts
        {nextWindow.shifts.map((s, i) => (
          <Badge key={i} variant="outline">
            {s}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  )
}

export function WaterThisWeek() {
  const total = waterByDay.reduce((sum, d) => sum + d.gallons, 0)
  return (
    <Card>
      <CardHeader>
        <CardDescription>Water this week</CardDescription>
        <CardTitle className="text-3xl font-semibold tabular-nums">
          {total.toFixed(1)}M
          <span className="ml-1 text-base font-normal text-muted-foreground">gal</span>
        </CardTitle>
        <CardAction>
          <Badge variant="secondary">+18% vs last week</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={waterConfig} className="aspect-auto h-14 w-full">
          <BarChart data={waterByDay} margin={{ top: 4, bottom: 0, left: 0, right: 0 }}>
            <XAxis dataKey="day" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="gallons" fill="var(--color-gallons)" radius={3} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="mt-auto text-xs text-muted-foreground">
        Mon – Sun · all pump houses
      </CardFooter>
    </Card>
  )
}

export function GunsRunning() {
  const running = guns.filter((g) => g.status === "running").length
  const faults = guns.filter((g) => g.status === "fault").length
  return (
    <Card>
      <CardHeader>
        <CardDescription>Guns running</CardDescription>
        <CardTitle className="text-3xl font-semibold tabular-nums">
          {running}
          <span className="text-muted-foreground"> / {guns.length}</span>
        </CardTitle>
        {faults > 0 && (
          <CardAction>
            <Badge variant="destructive">
              {faults} fault{faults === 1 ? "" : "s"}
            </Badge>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Progress value={(running / guns.length) * 100} aria-label="Guns running" />
        <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
          <span>
            {guns.reduce((s, g) => s + g.gpm, 0)} gpm total
          </span>
          <span>{Math.round((running / guns.length) * 100)}%</span>
        </div>
      </CardContent>
      <CardFooter className="mt-auto text-xs text-muted-foreground">
        Updated 2 min ago
      </CardFooter>
    </Card>
  )
}

function splitLabel(label: string): [string, string] {
  const i = label.lastIndexOf(" ")
  return i < 0 ? [label, ""] : [label.slice(0, i), label.slice(i + 1)]
}
