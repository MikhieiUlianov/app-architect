import { useMemo } from "react";
import { Check, Copy, RotateCcw } from "lucide-react";
import { highlightLine } from "@/lib/constructor/highlight";
import type { GeneratedFile } from "@/lib/constructor/types";

interface EditorPaneProps {
  file: GeneratedFile | undefined;
  openPaths: string[];
  activePath: string;
  edited: boolean;
  editing: boolean;
  copied: boolean;
  onSelect: (path: string) => void;
  onClose: (path: string) => void;
  onToggleEdit: () => void;
  onChange: (contents: string) => void;
  onRegenerate: () => void;
  onCopy: () => void;
}

export function EditorPane({
  file,
  openPaths,
  activePath,
  edited,
  editing,
  copied,
  onSelect,
  onClose,
  onToggleEdit,
  onChange,
  onRegenerate,
  onCopy,
}: EditorPaneProps) {
  const lines = useMemo(
    () => (file ? file.contents.replace(/\n$/, "").split("\n") : []),
    [file],
  );

  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <div className="flex items-stretch overflow-x-auto border-b border-border bg-rail/40">
        {openPaths.map((path) => {
          const active = path === activePath;
          return (
            <div
              key={path}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-2 font-mono text-[13px] ${
                active
                  ? "border-accent text-foreground"
                  : "border-transparent text-muted-foreground"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelect(path)}
                className="flex items-center gap-2 transition-colors hover:text-foreground"
              >
                {active ? <span className="text-accent">●</span> : null}
                {path.split("/").pop()}
              </button>
              <button
                type="button"
                aria-label={`Close ${path}`}
                onClick={() => onClose(path)}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                ×
              </button>
            </div>
          );
        })}
        <div className="ml-auto flex shrink-0 items-center gap-2 px-3">
          <span className="hidden font-mono text-[10px] text-muted-foreground lg:inline">
            {file?.path ?? "no file"}
          </span>
          <button
            type="button"
            onClick={onCopy}
            className="flex items-center gap-1 rounded border border-border px-2 py-1 text-[11px] font-medium transition-colors hover:border-accent/50 hover:text-accent"
          >
            {copied ? (
              <Check className="size-3" aria-hidden />
            ) : (
              <Copy className="size-3" aria-hidden />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={onToggleEdit}
            className={`rounded border px-2 py-1 text-[11px] font-medium transition-colors ${
              editing
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border hover:border-accent/50 hover:text-accent"
            }`}
          >
            {editing ? "Done" : "Edit"}
          </button>
          <button
            type="button"
            onClick={onRegenerate}
            disabled={!edited}
            className="flex items-center gap-1 rounded border border-border px-2 py-1 text-[11px] font-medium transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground"
          >
            <RotateCcw className="size-3" aria-hidden />
            Regenerate
          </button>
        </div>
      </div>

      <div className="scroll-thin flex-1 overflow-auto bg-surface">
        {!file ? (
          <p className="p-6 text-[13px] text-muted-foreground">
            Select a file in the explorer to read or edit it.
          </p>
        ) : editing ? (
          <textarea
            value={file.contents}
            onChange={(event) => onChange(event.target.value)}
            spellCheck={false}
            aria-label={`Edit ${file.path}`}
            className="h-full min-h-[420px] w-full resize-none bg-surface p-4 font-mono text-[12px] leading-5 outline-none"
          />
        ) : (
          <div
            className="grid"
            style={{ gridTemplateColumns: "3.2rem minmax(0,1fr)" }}
          >
            {lines.map((line, index) => (
              <div key={`${file.path}-${index}`} className="contents">
                <div className="border-r border-border pr-3 text-right font-mono text-[12px] leading-5 text-muted-foreground/60 select-none">
                  {index + 1}
                </div>
                <div className="overflow-x-auto px-4 font-mono text-[12px] leading-5 whitespace-pre">
                  {highlightLine(line, file.language)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border bg-rail/40 px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-mono text-[11px] text-muted-foreground">
            docker · compose
          </span>
          <code className="font-mono text-[11px] text-muted-foreground">
            docker compose up --build
          </code>
          <code className="font-mono text-[11px] text-muted-foreground">
            npx prisma migrate deploy
          </code>
          <span className="ml-auto font-mono text-[11px] text-muted-foreground">
            {lines.length} lines{edited ? " · edited" : ""}
          </span>
        </div>
      </div>
    </main>
  );
}
