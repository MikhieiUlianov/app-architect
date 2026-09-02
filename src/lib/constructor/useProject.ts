import { useCallback, useEffect, useMemo, useState } from "react";
import { generateFiles, validateConfig } from "./generate";
import {
  defaultConfig,
  makeField,
  uid,
  type GeneratedFile,
  type ModelDef,
  type ModuleId,
  type ProjectConfig,
} from "./types";

const STORAGE_KEY = "forge-project-v1";

interface Persisted {
  config: ProjectConfig;
  edits: Record<string, string>;
}

/**
 * Owns the project blueprint plus any hand edits made to generated files.
 * Generation is pure and derived; edits are stored as per-path overrides so
 * regenerating a file simply drops its override.
 */
export function useProject() {
  const [config, setConfig] = useState<ProjectConfig>(defaultConfig);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Persisted;
        if (parsed.config) setConfig(parsed.config);
        if (parsed.edits) setEdits(parsed.edits);
      }
    } catch {
      /* corrupted storage — fall back to defaults */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ config, edits } satisfies Persisted),
    );
  }, [config, edits, loaded]);

  const generated = useMemo(() => generateFiles(config), [config]);

  const files = useMemo<GeneratedFile[]>(
    () =>
      generated.map((file) =>
        edits[file.path] === undefined
          ? file
          : { ...file, contents: edits[file.path]! },
      ),
    [generated, edits],
  );

  const issues = useMemo(() => validateConfig(config), [config]);

  const patch = useCallback(
    (next: Partial<ProjectConfig>) => setConfig((c) => ({ ...c, ...next })),
    [],
  );

  const toggleModule = useCallback((id: ModuleId) => {
    setConfig((c) => ({
      ...c,
      modules: c.modules.includes(id)
        ? c.modules.filter((m) => m !== id)
        : [...c.modules, id],
    }));
  }, []);

  const addModel = useCallback(() => {
    setConfig((c) => ({
      ...c,
      models: [
        ...c.models,
        {
          id: uid(),
          name: `Model${c.models.length + 1}`,
          fields: [makeField({ name: "title" })],
        },
      ],
    }));
  }, []);

  const updateModel = useCallback((id: string, next: Partial<ModelDef>) => {
    setConfig((c) => ({
      ...c,
      models: c.models.map((m) => (m.id === id ? { ...m, ...next } : m)),
    }));
  }, []);

  const removeModel = useCallback((id: string) => {
    setConfig((c) => ({ ...c, models: c.models.filter((m) => m.id !== id) }));
  }, []);

  const editFile = useCallback((path: string, contents: string) => {
    setEdits((e) => ({ ...e, [path]: contents }));
  }, []);

  const resetFile = useCallback((path: string) => {
    setEdits((e) => {
      const next = { ...e };
      delete next[path];
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setConfig(defaultConfig());
    setEdits({});
  }, []);

  return {
    config,
    files,
    edits,
    issues,
    loaded,
    patch,
    toggleModule,
    addModel,
    updateModel,
    removeModel,
    editFile,
    resetFile,
    resetAll,
  };
}

export type ProjectState = ReturnType<typeof useProject>;
