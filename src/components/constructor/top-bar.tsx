import { Link } from "@tanstack/react-router";
import { Download, Terminal } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface TopBarProps {
  query?: string;
  onQueryChange?: (value: string) => void;
  onDownload?: () => void;
  busy?: boolean;
}

export function TopBar({ query, onQueryChange, onDownload, busy }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-12 items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid size-6 place-items-center rounded bg-accent/15">
            <span className="forge-drop block size-2.5 bg-accent" />
          </span>
          <span className="text-sm font-semibold tracking-tight">Forge</span>
        </Link>
        <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          v0.1.0
        </span>
        <nav className="ml-6 flex items-center gap-4 text-[13px]">
          <Link
            to="/projects"
            className="text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            Projects
          </Link>
          <Link
            to="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
            activeOptions={{ exact: true }}
          >
            Constructor
          </Link>
          <Link
            to="/templates"
            className="text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            Templates
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          {onQueryChange ? (
            <div className="hidden w-52 items-center gap-2 rounded border border-border bg-panel px-2.5 py-1.5 md:flex">
              <Terminal className="size-3 text-muted-foreground" aria-hidden />
              <input
                value={query ?? ""}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="search files…"
                aria-label="Search generated files"
                className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          ) : null}
          <ThemeToggle />
          {onDownload ? (
            <button
              type="button"
              onClick={onDownload}
              disabled={busy}
              className="flex items-center gap-1.5 rounded bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-60"
            >
              <Download className="size-3" aria-hidden />
              {busy ? "Packing…" : "Download .zip"}
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
