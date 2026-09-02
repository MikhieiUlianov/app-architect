import { Plus, Trash2 } from "lucide-react";
import {
  MODULES,
  SCALAR_TYPES,
  makeField,
  type ScalarType,
} from "@/lib/constructor/types";
import type { ProjectState } from "@/lib/constructor/useProject";

const STACK = [
  { label: "Next.js 16", detail: "app/" },
  { label: "React 19", detail: "19.0" },
  { label: "Prisma", detail: "6.2" },
  { label: "PostgreSQL", detail: "17" },
];

export function ConfigRail({ project }: { project: ProjectState }) {
  const { config, patch, toggleModule, addModel, updateModel, removeModel } =
    project;
  const filled = config.modules.length;

  return (
    <aside className="scroll-thin w-72 shrink-0 overflow-y-auto border-r border-border bg-rail">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="rail-label">Configure</span>
        <span className="font-mono text-[10px] text-accent">
          {filled}/{MODULES.length}
        </span>
      </div>

      <div className="space-y-2 px-4">
        <label className="block">
          <span className="font-mono text-[10px] text-muted-foreground">
            project name
          </span>
          <input
            value={config.name}
            onChange={(event) => patch({ name: event.target.value })}
            className="mt-1 w-full rounded-md border border-border bg-panel px-3 py-2 font-mono text-[13px] outline-none focus:border-accent/60"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] text-muted-foreground">
            description
          </span>
          <textarea
            value={config.description}
            rows={2}
            onChange={(event) => patch({ description: event.target.value })}
            className="mt-1 w-full resize-none rounded-md border border-border bg-panel px-3 py-2 text-[13px] outline-none focus:border-accent/60"
          />
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="font-mono text-[10px] text-muted-foreground">
              port
            </span>
            <input
              type="number"
              value={config.port}
              onChange={(event) =>
                patch({ port: Number(event.target.value) || 3000 })
              }
              className="mt-1 w-full rounded-md border border-border bg-panel px-3 py-2 font-mono text-[13px] outline-none focus:border-accent/60"
            />
          </label>
          <label className="block">
            <span className="font-mono text-[10px] text-muted-foreground">
              node
            </span>
            <select
              value={config.nodeVersion}
              onChange={(event) =>
                patch({
                  nodeVersion: event.target
                    .value as typeof config.nodeVersion,
                })
              }
              className="mt-1 w-full rounded-md border border-border bg-panel px-3 py-2 font-mono text-[13px] outline-none focus:border-accent/60"
            >
              <option value="20">20</option>
              <option value="22">22</option>
              <option value="24">24</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-5 px-4">
        <span className="rail-label">Stack</span>
        <div className="mt-2 space-y-1.5">
          {STACK.map((item, index) => (
            <div
              key={item.label}
              className="forge-drop flex items-center gap-2.5 rounded-md border border-border bg-panel px-3 py-2.5"
              style={{ animationDelay: `${60 * (index + 1)}ms` }}
            >
              <span className="size-1.5 rounded-full bg-accent" />
              <span className="text-sm">{item.label}</span>
              <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                {item.detail}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 px-4">
        <span className="rail-label">Modules</span>
        <div className="mt-2 space-y-1">
          {MODULES.map((module) => {
            const on = config.modules.includes(module.id);
            return (
              <label
                key={module.id}
                title={module.blurb}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 transition-colors hover:bg-panel ${
                  module.locked ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={on}
                  disabled={module.locked}
                  onChange={() => toggleModule(module.id)}
                />
                <span
                  className={`grid size-4 place-items-center rounded border ${
                    on ? "border-accent bg-accent" : "border-border"
                  }`}
                >
                  {on ? (
                    <span className="size-1.5 rounded-full bg-accent-foreground" />
                  ) : null}
                </span>
                <span className={`text-sm ${on ? "" : "text-muted-foreground"}`}>
                  {module.label}
                </span>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                  {module.locked ? "core" : on ? "on" : "—"}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="mt-5 px-4">
        <div className="flex items-center justify-between">
          <span className="rail-label">Data model</span>
          <button
            type="button"
            onClick={addModel}
            className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground transition-colors hover:text-accent"
          >
            <Plus className="size-3" aria-hidden />
            model
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {config.models.map((model) => (
            <div
              key={model.id}
              className="rounded-md border border-border bg-panel p-2.5"
            >
              <div className="flex items-center gap-2">
                <input
                  value={model.name}
                  onChange={(event) =>
                    updateModel(model.id, { name: event.target.value })
                  }
                  className="min-w-0 flex-1 bg-transparent font-mono text-[13px] outline-none"
                />
                <button
                  type="button"
                  aria-label={`Remove model ${model.name}`}
                  onClick={() => removeModel(model.id)}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="size-3.5" aria-hidden />
                </button>
              </div>
              <div className="mt-2 space-y-1">
                {model.fields.map((field) => (
                  <div key={field.id} className="flex items-center gap-1">
                    <input
                      value={field.name}
                      onChange={(event) =>
                        updateModel(model.id, {
                          fields: model.fields.map((f) =>
                            f.id === field.id
                              ? { ...f, name: event.target.value }
                              : f,
                          ),
                        })
                      }
                      className="min-w-0 flex-1 rounded border border-border bg-surface px-1.5 py-1 font-mono text-[11px] outline-none focus:border-accent/60"
                    />
                    <select
                      value={field.type}
                      aria-label={`Type of ${field.name}`}
                      onChange={(event) =>
                        updateModel(model.id, {
                          fields: model.fields.map((f) =>
                            f.id === field.id
                              ? { ...f, type: event.target.value as ScalarType }
                              : f,
                          ),
                        })
                      }
                      className="rounded border border-border bg-surface px-1 py-1 font-mono text-[11px] outline-none focus:border-accent/60"
                    >
                      {SCALAR_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      title="Toggle optional"
                      aria-label={`Toggle optional for ${field.name}`}
                      onClick={() =>
                        updateModel(model.id, {
                          fields: model.fields.map((f) =>
                            f.id === field.id
                              ? { ...f, optional: !f.optional }
                              : f,
                          ),
                        })
                      }
                      className={`w-5 rounded border border-border py-1 font-mono text-[11px] ${
                        field.optional ? "text-accent" : "text-muted-foreground"
                      }`}
                    >
                      ?
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove field ${field.name}`}
                      onClick={() =>
                        updateModel(model.id, {
                          fields: model.fields.filter((f) => f.id !== field.id),
                        })
                      }
                      className="px-1 font-mono text-[11px] text-muted-foreground transition-colors hover:text-destructive"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    updateModel(model.id, {
                      fields: [
                        ...model.fields,
                        makeField({ name: `field${model.fields.length + 1}` }),
                      ],
                    })
                  }
                  className="w-full rounded border border-dashed border-border py-1 font-mono text-[10px] text-muted-foreground transition-colors hover:border-accent/50 hover:text-accent"
                >
                  + field
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pt-5 pb-6">
        <span className="rail-label">Chassis</span>
        <div className="mt-2 flex h-2 gap-1.5 overflow-hidden rounded-full border border-border bg-panel">
          {MODULES.map((module, index) => (
            <span
              key={module.id}
              className={`forge-grow flex-1 ${
                config.modules.includes(module.id) ? "bg-accent" : "bg-transparent"
              }`}
              style={{ animationDelay: `${300 + index * 60}ms` }}
            />
          ))}
        </div>
        <p className="mt-2 font-mono text-[10px] text-muted-foreground">
          {filled} of {MODULES.length} slots filled · {config.models.length} models
        </p>
      </div>
    </aside>
  );
}
