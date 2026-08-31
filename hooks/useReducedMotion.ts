"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

// The server can't know the preference. Assuming "not reduced" matches the
// markup we ship (fully visible, un-animated), so hydration is consistent
// either way — the effects that read this only start on the client.
function getServerSnapshot(): boolean {
  return false;
}

/** True when the visitor has asked the OS to minimise motion. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
