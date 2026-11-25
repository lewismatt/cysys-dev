import {
  AlertTriangleIcon,
  BellIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  PlusIcon,
  SettingsIcon,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@cysys/ui/components/alert"
import { Avatar, AvatarFallback } from "@cysys/ui/components/avatar"
import { Badge } from "@cysys/ui/components/badge"
import { Button } from "@cysys/ui/components/button"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@cysys/ui/components/dropdown-menu"
import { Input } from "@cysys/ui/components/input"
import { Label } from "@cysys/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@cysys/ui/components/select"
import { Separator } from "@cysys/ui/components/separator"
import { Switch } from "@cysys/ui/components/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@cysys/ui/components/tabs"
import { Textarea } from "@cysys/ui/components/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@cysys/ui/components/tooltip"

export function Showcase() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Variants and sizes</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button size="sm">
            <PlusIcon data-icon="inline-start" /> Small
          </Button>
          <Button size="lg">Large</Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="outline" aria-label="Settings">
                <SettingsIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
          <Button disabled>Disabled</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Inputs, labels and checkboxes</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@cynerdyne.systems"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" defaultValue="hunter2" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="remember" defaultChecked />
            <Label htmlFor="remember">Remember this device</Label>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button className="flex-1">Sign in</Button>
          <Button variant="outline" className="flex-1">
            Cancel
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Switches and selects</CardDescription>
          <CardAction>
            <Badge variant="secondary">3 new</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {[
            ["alerts", "System alerts", true],
            ["digest", "Weekly digest", false],
            ["deploys", "Deploy updates", true],
          ].map(([id, label, on]) => (
            <div
              key={id as string}
              className="flex items-center justify-between"
            >
              <Label htmlFor={id as string}>{label}</Label>
              <Switch id={id as string} defaultChecked={on as boolean} />
            </div>
          ))}
          <Separator />
          <div className="grid gap-2">
            <Label>Delivery</Label>
            <Select defaultValue="email">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="push">Push</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Badges & avatars</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
          <div className="flex items-center gap-3">
            {["CS", "ML", "AK"].map((i) => (
              <Avatar key={i}>
                <AvatarFallback>{i}</AvatarFallback>
              </Avatar>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                  Actions <ChevronDownIcon data-icon="inline-end" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>Team</DropdownMenuLabel>
                <DropdownMenuItem>
                  Invite member <DropdownMenuShortcut>⌘I</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  Leave team
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tabs</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            <TabsContent
              value="overview"
              className="pt-2 text-sm text-muted-foreground"
            >
              Uptime 99.98% across 14 services over the last 30 days.
            </TabsContent>
            <TabsContent
              value="activity"
              className="pt-2 text-sm text-muted-foreground"
            >
              12 deploys, 3 rollbacks, 0 incidents.
            </TabsContent>
            <TabsContent value="notes" className="pt-2">
              <Textarea placeholder="Leave a note…" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <Alert>
          <CheckCircle2Icon />
          <AlertTitle>Deployment complete</AlertTitle>
          <AlertDescription>v2.4.1 is live in all regions.</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertTriangleIcon />
          <AlertTitle>Certificate expiring</AlertTitle>
          <AlertDescription>
            api.cynerdyne.systems expires in 6 days.
          </AlertDescription>
        </Alert>
        <Card className="flex-1 shadow-lg">
          <CardContent className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <BellIcon className="size-4" />
            </div>
            <div className="text-sm">
              <div className="font-medium">Shadows & radius</div>
              <div className="text-muted-foreground">
                This card uses <code className="font-mono">shadow-lg</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
