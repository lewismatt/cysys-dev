import * as React from "react"
import { FanIcon, LayersIcon, RadioTowerIcon } from "lucide-react"

import { Button } from "@cysys/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cysys/ui/components/card"
import { Input } from "@cysys/ui/components/input"
import { Label } from "@cysys/ui/components/label"
import { RadioGroup, RadioGroupItem } from "@cysys/ui/components/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@cysys/ui/components/select"
import { Separator } from "@cysys/ui/components/separator"
import { Switch } from "@cysys/ui/components/switch"
import { Textarea } from "@cysys/ui/components/textarea"


const MODES = [
  { value: "fan", label: "Fan guns", icon: FanIcon },
  { value: "tower", label: "Towers", icon: RadioTowerIcon },
  { value: "both", label: "Both", icon: LayersIcon },
]

export function ModeCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Snowmaking mode</CardTitle>
        <CardDescription>Which equipment runs when a window opens.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <RadioGroup defaultValue="both" className="grid grid-cols-3 gap-3">
          {MODES.map(({ value, label, icon: Icon }) => (
            <Label
              key={value}
              htmlFor={`mode-${value}`}
              className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-3 text-center transition-colors hover:bg-accent has-focus-visible:ring-3 has-focus-visible:ring-ring/50 has-data-checked:border-primary has-data-checked:bg-primary/5"
            >
              <RadioGroupItem id={`mode-${value}`} value={value} className="sr-only" />
              <Icon className="size-5" />
              {label}
            </Label>
          ))}
        </RadioGroup>
        <div className="grid gap-2">
          <Label htmlFor="target">Target depth on Ho Hum</Label>
          <div className="flex gap-2">
            <Input id="target" defaultValue="24" inputMode="numeric" className="tabular-nums" />
            <Select defaultValue="in">
              <SelectTrigger className="w-24" aria-label="Unit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">inches</SelectItem>
                <SelectItem value="cm">cm</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button className="w-full">Save mode</Button>
      </CardFooter>
    </Card>
  )
}

const ALERTS = [
  { id: "window", title: "Window opening", desc: "An hour before wet-bulb drops to 28°F.", on: true },
  { id: "fault", title: "Gun faults", desc: "Any gun reports a fault or loses pressure.", on: true },
  { id: "wind", title: "High wind", desc: "Gusts over 25 mph at the summit sensor.", on: false },
]

export function AlertsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts</CardTitle>
        <CardDescription>Push notifications for your crew.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {ALERTS.map((a, i) => (
          <React.Fragment key={a.id}>
            {i > 0 && <Separator />}
            <div className="flex items-start justify-between gap-4">
              <Label htmlFor={`alert-${a.id}`} className="flex flex-col items-start gap-1">
                <span>{a.title}</span>
                <span className="font-normal text-muted-foreground">{a.desc}</span>
              </Label>
              <Switch id={`alert-${a.id}`} defaultChecked={a.on} />
            </div>
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  )
}

export function IssueCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Log an issue</CardTitle>
        <CardDescription>Goes to the morning handoff report.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label htmlFor="issue-area">Area</Label>
            <Select defaultValue="hydrants">
              <SelectTrigger id="issue-area" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hydrants">Hydrants</SelectItem>
                <SelectItem value="guns">Guns</SelectItem>
                <SelectItem value="pumps">Pump house</SelectItem>
                <SelectItem value="power">Power</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="issue-severity">Severity</Label>
            <Select defaultValue="2">
              <SelectTrigger id="issue-severity" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Low</SelectItem>
                <SelectItem value="2">Medium</SelectItem>
                <SelectItem value="3">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="issue-subject">Subject</Label>
          <Input id="issue-subject" placeholder="F-21 tripped on low pressure" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="issue-body">Details</Label>
          <Textarea id="issue-body" placeholder="What happened, and what you tried…" />
        </div>
      </CardContent>
      <CardFooter className="mt-auto justify-between">
        <Button variant="ghost">Cancel</Button>
        <Button>Submit</Button>
      </CardFooter>
    </Card>
  )
}
