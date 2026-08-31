// ============================================================
// INTRO HANDOFF
// ============================================================
// The hero's entrance is timed to the moment the boot-sequence overlay
// lifts, not to page load — otherwise the stagger plays out of sight behind
// it. IntroOverlay calls markIntroDone(); Hero waits for it.
//
// Anything that subscribes must also work when the intro never runs (JS
// disabled, reduced motion, an early skip), so `done` starts false and Hero
// treats "not yet signalled" as "render normally, just don't animate".
// ============================================================

let done = false;
const listeners = new Set<() => void>();

export function isIntroDone(): boolean {
  return done;
}

export function markIntroDone(): void {
  if (done) return;
  done = true;
  listeners.forEach((fn) => fn());
}

export function onIntroDone(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Server snapshot for useSyncExternalStore — the intro never runs on SSR. */
export function introNotDone(): boolean {
  return false;
}
