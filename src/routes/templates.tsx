import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/constructor/top-bar";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Starter templates — Forge App Constructor" },
      {
        name: "description",
        content:
          "Opinionated starting points for the constructor: SaaS, content platform, internal tool and API service blueprints.",
      },
      {
        property: "og:title",
        content: "Starter templates — Forge App Constructor",
      },
      {
        property: "og:description",
        content:
          "Opinionated starting points for the constructor: SaaS, content platform, internal tool and API service blueprints.",
      },
    ],
  }),
  component: TemplatesPage,
});

const TEMPLATES = [
  {
    name: "SaaS starter",
    blurb: "Auth, Stripe billing, tenant-scoped Prisma models, CI, Docker.",
    modules: ["Auth", "Billing", "Docker", "CI/CD"],
  },
  {
    name: "Content platform",
    blurb: "Posts, authors and media models with server components and caching.",
    modules: ["Database", "Docker"],
  },
  {
    name: "Internal tool",
    blurb: "Session auth, audit log model, protected dashboard middleware.",
    modules: ["Auth", "Database", "Docker"],
  },
  {
    name: "API service",
    blurb: "Route handlers, zod-validated payloads, health check, Vitest suite.",
    modules: ["Database", "Docker", "Testing"],
  },
];

function TemplatesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <TopBar />
      <main className="mx-auto w-full max-w-4xl px-6 py-10">
        <h1 className="text-xl font-semibold tracking-tight">Templates</h1>
        <p className="mt-1 max-w-xl text-[13px] text-muted-foreground">
          Each template preloads the constructor with a module set and data
          model. Everything stays editable afterwards.
        </p>
        <div className="mt-6 grid gap-1.5 sm:grid-cols-2">
          {TEMPLATES.map((template) => (
            <Link
              key={template.name}
              to="/"
              className="rounded-md border border-border bg-panel p-4 transition-colors hover:border-accent/50"
            >
              <span className="text-[13px] font-medium">{template.name}</span>
              <p className="mt-1 text-[12px] text-muted-foreground">
                {template.blurb}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {template.modules.map((module) => (
                  <span
                    key={module}
                    className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                  >
                    {module}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
