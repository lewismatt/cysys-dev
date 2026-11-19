import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

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
import { Tabs, TabsList, TabsTrigger } from "@cysys/ui/components/tabs"

import { BAND_LABEL, bandOf, forecast, windows } from "./data"

const config = {
  wetBulb: { label: "Wet-bulb", color: "var(--chart-1)" },
} satisfies ChartConfig

const THRESHOLDS = [
  { y: 28, label: "28° qualifies" },
  { y: 24, label: "24° Good" },
  { y: 20, label: "20° Prime" },
]

export function ForecastChart() {
  const [range, setRange] = React.useState("72")
  const data = forecast.slice(0, Number(range))

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Wet-bulb forecast</CardTitle>
        <CardDescription>
          Shaded spans are snowmaking windows: 5+ hours at or below 28°F.
        </CardDescription>
        <CardAction>
          <Tabs value={range} onValueChange={setRange}>
            <TabsList>
              <TabsTrigger value="24">24h</TabsTrigger>
              <TabsTrigger value="72">72h</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        <ChartContainer config={config} className="aspect-auto h-64 w-full">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="fillWetBulb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-wetBulb)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--color-wetBulb)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            {windows.map((w) => (
              <ReferenceArea
                key={w.from}
                x1={data[w.from]?.label}
                x2={data[Math.min(w.to, data.length - 1)]?.label}
                fill="var(--color-wetBulb)"
                fillOpacity={0.08}
                ifOverflow="hidden"
              />
            ))}
            {THRESHOLDS.map((t) => (
              <ReferenceLine
                key={t.y}
                y={t.y}
                stroke="var(--muted-foreground)"
                strokeOpacity={0.5}
                strokeDasharray="3 4"
                label={{
                  value: t.label,
                  position: "insideTopRight",
                  fill: "var(--muted-foreground)",
                  fontSize: 11,
                }}
              />
            ))}
            <XAxis
              dataKey="label"
              ticks={data.filter((h) => h.hour % 6 === 0).map((h) => h.label)}
              interval="preserveStartEnd"
              minTickGap={4}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(label: string) => {
                const at = label.lastIndexOf(" ")
                const time = label.slice(at + 1)
                return time === "00:00" ? label.slice(0, at) : time
              }}
            />
            <YAxis
              domain={[8, 34]}
              ticks={[10, 15, 20, 25, 30]}
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tickFormatter={(v: number) => `${v}°`}
            />
            <ChartTooltip
              cursor={{ stroke: "var(--border)" }}
              content={
                <ChartTooltipContent
                  hideLabel
                  indicator="line"
                  formatter={(value, _name, item) => (
                    <div className="flex w-full flex-col gap-0.5">
                      <span className="text-muted-foreground">{item.payload.label}</span>
                      <div className="flex justify-between gap-4">
                        <span>{BAND_LABEL[bandOf(Number(value))]}</span>
                        <span className="font-mono font-medium tabular-nums">
                          {Number(value).toFixed(1)}°F
                        </span>
                      </div>
                    </div>
                  )}
                />
              }
            />
            <Area
              dataKey="wetBulb"
              type="monotone"
              stroke="var(--color-wetBulb)"
              strokeWidth={2}
              fill="url(#fillWetBulb)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
