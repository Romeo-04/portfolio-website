// ============================================================
// THEME STORE
// ============================================================
// Dark ("Flow State") is the default; light is opt-in and persisted in
// localStorage. The class is applied pre-paint by the inline script in
// app/layout.tsx, so this store's only job is reading and flipping it at
// runtime and telling subscribers.
//
// Deliberately a module-level store rather than a React context: page.tsx is
// a Server Component, and wrapping it in a client provider would force the
// GitHub section (which fetches on the server) into the client bundle.
// ============================================================

export type Theme = "dark" | "light";

const STORAGE_KEY = "theme";
const listeners = new Set<() => void>();

export function getTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("light")
    ? "light"
    : "dark";
}

/** Server snapshot for useSyncExternalStore — matches the SSR default. */
export function getServerTheme(): Theme {
  return "dark";
}

export function setTheme(theme: Theme): void {
  document.documentElement.classList.toggle("light", theme === "light");
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Private mode / storage disabled — the theme still applies for this
    // page view, it just won't be remembered.
  }
  listeners.forEach((fn) => fn());
}

export function toggleTheme(): void {
  setTheme(getTheme() === "light" ? "dark" : "light");
}

export function subscribeTheme(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
