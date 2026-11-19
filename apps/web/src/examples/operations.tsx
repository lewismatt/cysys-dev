import * as React from "react"
import { SearchIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@cysys/ui/components/avatar"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cysys/ui/components/card"
import { Checkbox } from "@cysys/ui/components/checkbox"
import { Input } from "@cysys/ui/components/input"
import { Progress } from "@cysys/ui/components/progress"
import { cn } from "@cysys/ui/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@cysys/ui/components/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cysys/ui/components/table"

import { crew, guns, pumps, type Gun } from "./data"

const STATUS: Record<Gun["status"], { label: string; dot: string; text: string }> = {
  running: { label: "Running", dot: "bg-prime", text: "" },
  standby: { label: "Standby", dot: "bg-muted-foreground/50", text: "text-muted-foreground" },
  fault: { label: "Fault", dot: "bg-no-window", text: "text-no-window font-medium" },
}

export function GunsTable() {
  const [query, setQuery] = React.useState("")
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const rows = guns.filter((g) =>
    `${g.id} ${g.trail} ${g.type} ${g.status}`.toLowerCase().includes(query.toLowerCase())
  )
  const allSelected = rows.length > 0 && rows.every((g) => selected.has(g.id))

  const toggle = (id: string, on: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (on) next.add(id)
      else next.delete(id)
      return next
    })

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Guns</CardTitle>
        <CardDescription>Live status across the hill.</CardDescription>
        <CardAction>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter guns…"
              className="h-8 w-40 pl-8 sm:w-52"
              aria-label="Filter guns"
            />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader className="[&_th]:font-mono [&_th]:text-xs [&_th]:font-normal [&_th]:tracking-wider [&_th]:text-muted-foreground [&_th]:uppercase">
            <TableRow>
              <TableHead className="w-10 pl-4">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(v) => rows.forEach((g) => toggle(g.id, v === true))}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Gun</TableHead>
              <TableHead>Trail</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-4 text-right">Flow</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((g) => (
              <TableRow key={g.id} data-state={selected.has(g.id) ? "selected" : undefined}>
                <TableCell className="pl-4">
                  <Checkbox
                    checked={selected.has(g.id)}
                    onCheckedChange={(v) => toggle(g.id, v === true)}
                    aria-label={`Select ${g.id}`}
                  />
                </TableCell>
                <TableCell className="font-mono text-xs font-medium">{g.id}</TableCell>
                <TableCell>{g.trail}</TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">{g.type}</TableCell>
                <TableCell>
                  <span className={cn("inline-flex items-center gap-2 font-mono text-[13px]", STATUS[g.status].text)}>
                    <span className={cn("size-1.5 rounded-full", STATUS[g.status].dot)} aria-hidden />
                    {STATUS[g.status].label}
                  </span>
                </TableCell>
                <TableCell className="pr-4 text-right font-mono text-[13px]">
                  {g.gpm ? `${g.gpm} gpm` : "—"}
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-20 text-center text-muted-foreground">
                  No guns match “{query}”.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="mt-auto justify-between font-mono text-xs text-muted-foreground">
        <span>
          {selected.size} of {guns.length} selected
        </span>
        <span className="tabular-nums">
          {guns.filter((g) => g.status === "running").length} running
        </span>
      </CardFooter>
    </Card>
  )
}

export function CrewCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Crew on shift</CardTitle>
        <CardDescription>Night shift · 19:00 – 07:00</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {crew.map((c) => (
          <div key={c.email} className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{c.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{c.name}</div>
              <div className="truncate font-mono text-xs text-muted-foreground">{c.email}</div>
            </div>
            <Select defaultValue={c.role}>
              <SelectTrigger size="sm" className="w-32" aria-label={`${c.name} role`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {["Lead", "Hydrants", "Pump house", "Groomer"].map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function PumpHouse() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pump house</CardTitle>
        <CardDescription>Load at current demand.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {pumps.map((p) => (
          <div key={p.name} className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span>{p.name}</span>
              <span className="font-mono text-muted-foreground">{p.load}%</span>
            </div>
            <Progress value={p.load} className="[&_[data-slot=progress-indicator]]:bg-foreground/55" aria-label={`${p.name} load`} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
