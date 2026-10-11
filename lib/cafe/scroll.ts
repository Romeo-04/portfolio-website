"use client";

// ============================================================
// CAFÉ SCROLL STORE
// ============================================================
// The only source of scroll truth (spec 3). Lenis smooths the native
// window scroll; this store turns scrollY into one 0..1 progress value and
// tells subscribers. The camera rig reads getProgress() every frame instead
// of subscribing, so scrolling never re-renders React.
// Module-level on purpose, like lib/theme.ts.
// ============================================================

import Lenis from "lenis";
import { progressFromScroll, stationAnchor, type StationId } from "@/lib/cafe/stations";

let progress = 0;
let lenis: Lenis | null = null;
let paused = false;
let gliding = false;
const listeners = new Set<() => void>();

function measure(): void {
  progress = progressFromScroll(
    window.scrollY,
    document.documentElement.scrollHeight,
    window.innerHeight,
  );
  listeners.forEach((fn) => fn());
}

/** True while a smooth goTo is still travelling. */
export function isGliding(): boolean {
  return gliding;
}

export function getProgress(): number {
  return progress;
}

export function subscribeProgress(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Start tracking scroll. smooth=false (reduced motion) uses native scroll. */
export function startScroll(opts: { smooth: boolean }): () => void {
  if (opts.smooth) {
    lenis = new Lenis({ autoRaf: true });
    if (paused) lenis.stop();
  }
  window.addEventListener("scroll", measure, { passive: true });
  window.addEventListener("resize", measure);
  measure();
  return () => {
    window.removeEventListener("scroll", measure);
    window.removeEventListener("resize", measure);
    lenis?.destroy();
    lenis = null;
    gliding = false;
  };
}

/** Freeze scrolling (intro overlay). Safe to call before/after Lenis exists. */
export function pauseScroll(value: boolean): void {
  paused = value;
  if (paused) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = paused ? "hidden" : "";
}

export function goTo(id: StationId, opts: { immediate?: boolean } = {}): void {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const y = Math.max(0, max) * stationAnchor(id);
  if (lenis) lenis.resize();
  if (lenis) {
    const immediate = opts.immediate ?? false;
    if (!immediate) gliding = true;
    lenis.scrollTo(y, {
      immediate,
      force: true,
      onComplete: () => {
        gliding = false;
        measure();
      },
    });
  } else window.scrollTo({ top: y, behavior: "instant" });
}
