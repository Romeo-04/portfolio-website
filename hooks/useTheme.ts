"use client";

import { useSyncExternalStore } from "react";
import {
  getServerTheme,
  getTheme,
  subscribeTheme,
  toggleTheme,
  type Theme,
} from "@/lib/theme";

/** Current theme, kept in sync across every component that reads it. */
export function useTheme(): { theme: Theme; toggle: () => void } {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getTheme,
    getServerTheme,
  );
  return { theme, toggle: toggleTheme };
}
