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

// Band zones, as on the Eldora dashboard's chart: each tinted with its
// status color and labeled with its word.
const ZONES = [
  { y1: 24, y2: 28, color: "var(--marginal)", label: "Marginal" },
  { y1: 20, y2: 24, color: "var(--good)", label: "Good" },
  { y1: 8, y2: 20, color: "var(--prime)", label: "Prime" },
]

export function ForecastChart() {
  const [range, setRange] = React.useState("72")
  const data = forecast.slice(0, Number(range))

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Wet-bulb forecast</CardTitle>
        <CardDescription>
          Orange marks snowmaking windows: 5+ hours at or below 28°F.
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
      <CardContent className="flex flex-1 flex-col px-2 sm:px-4">
        <ChartContainer config={config} className="aspect-auto min-h-64 w-full flex-1 font-mono">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            {ZONES.map((z) => (
              <ReferenceArea
                key={z.label}
                y1={z.y1}
                y2={z.y2}
                fill={z.color}
                fillOpacity={0.06}
                ifOverflow="hidden"
                label={{
                  value: z.label,
                  position: "insideTopRight",
                  fill: z.color,
                  fontSize: 11,
                  fontWeight: 500,
                }}
              />
            ))}
            <ReferenceLine
              y={28}
              stroke="var(--muted-foreground)"
              strokeOpacity={0.6}
              strokeDasharray="3 4"
            />
            {/* Qualifying windows: a brand-orange strip along the bottom. */}
            {windows.map((w) => (
              <ReferenceArea
                key={w.from}
                x1={data[w.from]?.label}
                x2={data[Math.min(w.to, data.length - 1)]?.label}
                y1={8}
                y2={9}
                fill="var(--primary)"
                fillOpacity={1}
                ifOverflow="hidden"
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
              strokeWidth={2.25}
              fill="none"
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
