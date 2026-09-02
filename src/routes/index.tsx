import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ConfigRail } from "@/components/constructor/config-rail";
import { EditorPane } from "@/components/constructor/editor-pane";
import { Explorer } from "@/components/constructor/explorer";
import { ExportRail } from "@/components/constructor/export-rail";
import { TopBar } from "@/components/constructor/top-bar";
import { buildTree, estimateBytes } from "@/lib/constructor/generate";
import { slugify } from "@/lib/constructor/types";
import { useProject } from "@/lib/constructor/useProject";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Forge — Construct a Dockerized Next.js App" },
      {
        name: "description",
        content:
          "Configure modules and data models, watch the Next.js 16 + React 19 + Prisma + PostgreSQL codebase generate, edit any file in the browser, then export a Dockerized repo.",
      },
      { property: "og:title", content: "Forge — Construct a Dockerized Next.js App" },
      {
        property: "og:description",
        content:
          "Configure modules and data models, edit the generated source, and export a Dockerized Next.js 16 + Prisma + PostgreSQL project.",
      },
    ],
  }),
  component: ConstructorPage,
});

const DEFAULT_FILE = "prisma/schema.prisma";

function ConstructorPage() {
  const project = useProject();
  const { files, edits, issues } = project;

  const [activePath, setActivePath] = useState(DEFAULT_FILE);
  const [openPaths, setOpenPaths] = useState<string[]>([DEFAULT_FILE]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const visibleFiles = useMemo(
    () =>
      query.trim()
        ? files.filter((f) =>
            f.path.toLowerCase().includes(query.trim().toLowerCase()),
          )
        : files,
    [files, query],
  );

  const tree = useMemo(() => buildTree(visibleFiles), [visibleFiles]);
  const activeFile = files.find((f) => f.path === activePath);
  const edited = edits[activePath] !== undefined;

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const select = useCallback((path: string) => {
    setActivePath(path);
    setEditing(false);
    setOpenPaths((paths) => (paths.includes(path) ? paths : [...paths, path]));
  }, []);

  const close = useCallback(
    (path: string) => {
      setOpenPaths((paths) => {
        const next = paths.filter((p) => p !== path);
        if (path === activePath) setActivePath(next[next.length - 1] ?? "");
        return next;
      });
    },
    [activePath],
  );

  const copy = useCallback(async () => {
    if (!activeFile) return;
    await navigator.clipboard.writeText(activeFile.contents);
    setCopied(true);
  }, [activeFile]);

  const download = useCallback(async () => {
    if (issues.some((i) => i.level === "error")) {
      toast.error("Fix the blueprint errors before exporting.");
      return;
    }
    setBusy(true);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      const root = slugify(project.config.name);
      for (const file of files) zip.file(`${root}/${file.path}`, file.contents);
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${root}.zip`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success(`${files.length} files exported as ${root}.zip`);
    } catch {
      toast.error("Could not build the archive.");
    } finally {
      setBusy(false);
    }
  }, [files, issues, project.config.name]);

  return (
    <div className="flex h-screen flex-col bg-background font-sans text-foreground">
      <TopBar
        query={query}
        onQueryChange={setQuery}
        onDownload={download}
        busy={busy}
      />
      <h1 className="sr-only">Forge app constructor workspace</h1>
      <div className="flex min-h-0 flex-1">
        <ConfigRail project={project} />
        <Explorer
          tree={tree}
          activePath={activePath}
          editedPaths={Object.keys(edits)}
          count={visibleFiles.length}
          onSelect={select}
        />
        <EditorPane
          file={activeFile}
          openPaths={openPaths}
          activePath={activePath}
          edited={edited}
          editing={editing}
          copied={copied}
          onSelect={select}
          onClose={close}
          onToggleEdit={() => setEditing((value) => !value)}
          onChange={(contents) => project.editFile(activePath, contents)}
          onRegenerate={() => {
            project.resetFile(activePath);
            toast.success(`${activePath} regenerated from the blueprint`);
          }}
          onCopy={copy}
        />
        <ExportRail
          files={files}
          issues={issues}
          bytes={estimateBytes(files)}
          busy={busy}
          onSelect={select}
          onDownload={download}
          onReset={() => {
            project.resetAll();
            setActivePath(DEFAULT_FILE);
            setOpenPaths([DEFAULT_FILE]);
            toast.success("Blueprint reset to defaults");
          }}
        />
      </div>
    </div>
  );
}
