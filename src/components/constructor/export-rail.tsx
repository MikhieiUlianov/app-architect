import { AlertTriangle, Download, GitBranch } from "lucide-react";
import { highlightLine } from "@/lib/constructor/highlight";
import type { GeneratedFile } from "@/lib/constructor/types";
import type { Issue } from "@/lib/constructor/generate";

interface ExportRailProps {
  files: GeneratedFile[];
  issues: Issue[];
  bytes: number;
  busy: boolean;
  onSelect: (path: string) => void;
  onDownload: () => void;
  onReset: () => void;
}

const DEPLOY_FILES = [
  "Dockerfile",
  "docker-compose.yml",
  ".env.example",
  ".github/workflows/ci.yml",
];

export function ExportRail({
  files,
  issues,
  bytes,
  busy,
  onSelect,
  onDownload,
  onReset,
}: ExportRailProps) {
  const deploy = files.filter((f) => DEPLOY_FILES.includes(f.path));
  const dockerfile = files.find((f) => f.path === "Dockerfile");
  const preview = dockerfile
    ? dockerfile.contents.split("\n").filter((l) => l.trim()).slice(2, 12)
    : [];

  return (
    <aside className="scroll-thin w-72 shrink-0 overflow-y-auto border-l border-border bg-rail">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="rail-label">Export</span>
        <span className="font-mono text-[10px] text-accent">
          {files.length} files
        </span>
      </div>

      <div className="space-y-1.5 px-4">
        {deploy.map((file) => (
          <button
            key={file.path}
            type="button"
            onClick={() => onSelect(file.path)}
            className="flex w-full items-center gap-2 rounded-md border border-border bg-panel px-3 py-2 font-mono text-[13px] transition-colors hover:border-accent/50"
          >
            <span className="truncate">{file.path.split("/").pop()}</span>
            <span className="ml-auto text-[10px] text-muted-foreground">
              {(file.contents.length / 1024).toFixed(1)}k
            </span>
          </button>
        ))}
      </div>

      {dockerfile ? (
        <div className="mt-4 px-4">
          <div className="overflow-hidden rounded-md border border-border bg-surface">
            <div className="border-b border-border px-3 py-2">
              <span className="font-mono text-[11px] text-muted-foreground">
                Dockerfile
              </span>
            </div>
            <pre className="overflow-x-auto px-3 py-2 font-mono text-[11px] leading-5 whitespace-pre">
              {preview.map((line, index) => (
                <div key={index}>{highlightLine(line, "docker")}</div>
              ))}
            </pre>
          </div>
        </div>
      ) : null}

      <div className="mt-4 space-y-2 px-4">
        <button
          type="button"
          onClick={onDownload}
          disabled={busy}
          className="forge-slide flex w-full items-center justify-center gap-2 rounded-md bg-accent py-2.5 text-[13px] font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-60"
        >
          <Download className="size-3.5" aria-hidden />
          {busy ? "Packing…" : "Download .zip"}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="forge-slide flex w-full items-center justify-center gap-2 rounded-md border border-border py-2.5 text-[13px] font-medium transition-colors hover:border-accent/50 hover:text-accent"
        >
          <GitBranch className="size-3.5" aria-hidden />
          Reset blueprint
        </button>
      </div>

      <div className="mt-4 px-4">
        <span className="rail-label">Checks</span>
        <div className="mt-2 space-y-1">
          {issues.length === 0 ? (
            <p className="font-mono text-[11px] text-success">
              schema valid · docker ready
            </p>
          ) : (
            issues.map((issue, index) => (
              <p
                key={index}
                className={`flex items-start gap-1.5 font-mono text-[11px] ${
                  issue.level === "error"
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                <AlertTriangle className="mt-0.5 size-3 shrink-0" aria-hidden />
                {issue.message}
              </p>
            ))
          )}
        </div>
      </div>

      <div className="px-4 pt-4 pb-6">
        <span className="rail-label">Bundle</span>
        <p className="mt-2 font-mono text-[11px] text-muted-foreground">
          {files.length} files · {(bytes / 1024).toFixed(1)} KB · 2 services
        </p>
      </div>
    </aside>
  );
}
