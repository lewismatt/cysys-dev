import * as React from "react"
import { MountainSnowIcon } from "lucide-react"

import { themes } from "@cysys/themes"
import { cn } from "@cysys/ui/lib/utils"

import { ModeToggle, ThemeSelect } from "@/components/theme-controls"
import { Showcase } from "@/components/showcase"
import { ThemeGallery } from "@/components/theme-gallery"
import { TokenGrid } from "@/components/token-grid"
import { Typography } from "@/components/typography"
import { EldoraOverview } from "@/examples/eldora-overview"

const themeCount: number = themes.length

const PAGES = [
  { id: "overview", label: "Overview" },
  { id: "components", label: "Components" },
] as const
type PageId = (typeof PAGES)[number]["id"]

function usePage(): PageId {
  const read = () =>
    (PAGES.find((p) => `#/${p.id}` === window.location.hash)?.id ?? "overview") as PageId
  const [page, setPage] = React.useState<PageId>(read)
  React.useEffect(() => {
    const onHash = () => {
      setPage(read())
      window.scrollTo(0, 0)
    }
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])
  return page
}

export function App() {
  const page = usePage()

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 sm:h-14 sm:flex-nowrap sm:gap-6 sm:px-6 sm:py-0">
          <a href="#/overview" className="flex items-center gap-2 font-semibold">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <MountainSnowIcon className="size-4" />
            </span>
            <span>Cynerdyne</span>
          </a>
          <nav className="order-last flex w-full items-center gap-4 text-sm sm:order-none sm:w-auto">
            {PAGES.map((p) => (
              <a
                key={p.id}
                href={`#/${p.id}`}
                aria-current={page === p.id ? "page" : undefined}
                className={cn(
                  "transition-colors hover:text-foreground",
                  page === p.id ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                {p.label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <ThemeSelect />
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {page === "overview" ? <EldoraOverview /> : <ComponentsPage />}
      </main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        {themeCount} themes · press{" "}
        <kbd className="rounded border px-1 font-mono">d</kbd> to toggle dark mode
      </footer>
    </div>
  )
}

function ComponentsPage() {
  return (
    <div className="flex flex-col gap-12">
      <Section
        title="Components"
        description="shadcn/ui components from @cysys/ui, rendered with the active theme."
      >
        <Showcase />
      </Section>
      <Section title="Tokens" description="Semantic color tokens defined by the active theme.">
        <TokenGrid />
      </Section>
      <Section title="Typography">
        <Typography />
      </Section>
      <Section
        title="All themes"
        description={
          <>
            Each preview is scoped with its own{" "}
            <code className="font-mono text-xs">data-theme</code> attribute, so themes can
            coexist on one page.
          </>
        }
      >
        <ThemeGallery />
      </Section>
    </div>
  )
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  )
}
