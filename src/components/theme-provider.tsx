import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "forge-theme";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// Reuse one context across hot-module reloads and duplicate module instances,
// otherwise a remounted consumer reads a different (empty) context and throws.
const globalScope = globalThis as typeof globalThis & {
  __forgeThemeContext?: React.Context<ThemeContextValue | null>;
};

const ThemeContext =
  globalScope.__forgeThemeContext ??
  (globalScope.__forgeThemeContext =
    createContext<ThemeContextValue | null>(null));

/**
 * Applies the theme class to <html>. The initial paint uses the dark default
 * (see the inline script in __root) so there is no flash before hydration.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      setThemeState(stored);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggleTheme = useCallback(
    () => setTheme(theme === "dark" ? "light" : "dark"),
    [setTheme, theme],
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  const fallback = useCallback((next?: Theme) => {
    const root = document.documentElement;
    const resolved: Theme =
      next ?? (root.classList.contains("dark") ? "light" : "dark");
    root.classList.toggle("dark", resolved === "dark");
    window.localStorage.setItem(STORAGE_KEY, resolved);
  }, []);

  if (ctx) return ctx;

  // Degrade gracefully instead of blanking the page if a consumer renders
  // outside the provider (e.g. during a hot reload).
  return {
    theme:
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark")
        ? "dark"
        : "light",
    setTheme: (next: Theme) => fallback(next),
    toggleTheme: () => fallback(),
  };
}
