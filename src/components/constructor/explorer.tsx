import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { TreeNode } from "@/lib/constructor/types";

interface ExplorerProps {
  tree: TreeNode[];
  activePath: string;
  editedPaths: string[];
  count: number;
  onSelect: (path: string) => void;
}

export function Explorer({
  tree,
  activePath,
  editedPaths,
  count,
  onSelect,
}: ExplorerProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const renderNodes = (nodes: TreeNode[], depth: number) =>
    nodes.map((node) => {
      if (node.kind === "dir") {
        const isCollapsed = collapsed[node.path];
        return (
          <div key={node.path}>
            <button
              type="button"
              onClick={() =>
                setCollapsed((c) => ({ ...c, [node.path]: !c[node.path] }))
              }
              style={{ paddingLeft: `${8 + depth * 12}px` }}
              className="flex w-full items-center gap-1 py-1 pr-2 text-left text-muted-foreground transition-colors hover:text-foreground"
            >
              {isCollapsed ? (
                <ChevronRight className="size-3" aria-hidden />
              ) : (
                <ChevronDown className="size-3" aria-hidden />
              )}
              <span>{node.name}</span>
            </button>
            {isCollapsed ? null : renderNodes(node.children ?? [], depth + 1)}
          </div>
        );
      }

      const active = node.path === activePath;
      const edited = editedPaths.includes(node.path);
      return (
        <button
          key={node.path}
          type="button"
          onClick={() => onSelect(node.path)}
          style={{ paddingLeft: `${20 + depth * 12}px` }}
          className={`flex w-full items-center gap-1.5 py-1 pr-2 text-left transition-colors ${
            active
              ? "bg-accent/15 text-accent"
              : "text-foreground/85 hover:bg-panel"
          }`}
        >
          <span className="truncate">{node.name}</span>
          {edited ? (
            <span
              className="ml-auto size-1.5 shrink-0 rounded-full bg-accent"
              title="Edited"
            />
          ) : null}
        </button>
      );
    });

  return (
    <section className="scroll-thin w-56 shrink-0 overflow-y-auto border-r border-border bg-rail/60">
      <div className="flex items-center justify-between px-3 pt-4 pb-2">
        <span className="rail-label">Explorer</span>
        <span className="font-mono text-[10px] text-muted-foreground">
          {count}
        </span>
      </div>
      <nav className="pb-4 font-mono text-[13px]">
        {tree.length === 0 ? (
          <p className="px-3 text-[12px] text-muted-foreground">No matches.</p>
        ) : (
          renderNodes(tree, 0)
        )}
      </nav>
    </section>
  );
}
