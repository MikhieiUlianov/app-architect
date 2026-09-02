import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/constructor/top-bar";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Forge App Constructor" },
      {
        name: "description",
        content:
          "Your Forge blueprints: Dockerized Next.js 16 + Prisma + PostgreSQL codebases you can open, edit and export.",
      },
      { property: "og:title", content: "Projects — Forge App Constructor" },
      {
        property: "og:description",
        content:
          "Your Forge blueprints: Dockerized Next.js 16 + Prisma + PostgreSQL codebases you can open, edit and export.",
      },
    ],
  }),
  component: ProjectsPage,
});

const PROJECTS = [
  {
    name: "acme-storefront",
    status: "active",
    summary: "Next.js 16 · Prisma · Stripe billing · Docker",
    models: 6,
  },
  {
    name: "ledger-api",
    status: "draft",
    summary: "Next.js 16 · Prisma · Auth · CI",
    models: 4,
  },
  {
    name: "blog-engine",
    status: "draft",
    summary: "Next.js 16 · Prisma · Docker",
    models: 3,
  },
];

function ProjectsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <TopBar />
      <main className="mx-auto w-full max-w-4xl px-6 py-10">
        <h1 className="text-xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-1 max-w-xl text-[13px] text-muted-foreground">
          Every blueprint you construct stays editable. Open one to change its
          modules, data model and generated source.
        </p>
        <div className="mt-6 space-y-1.5">
          {PROJECTS.map((project) => (
            <Link
              key={project.name}
              to="/"
              className="flex items-center gap-3 rounded-md border border-border bg-panel px-4 py-3 transition-colors hover:border-accent/50"
            >
              <span
                className={`size-1.5 rounded-full ${
                  project.status === "active" ? "bg-accent" : "bg-border"
                }`}
              />
              <span className="font-mono text-[13px]">{project.name}</span>
              <span className="text-[12px] text-muted-foreground">
                {project.summary}
              </span>
              <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                {project.models} models
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
