"use client";

// ============================================================
// SCROLL CUE
// ============================================================
// The first-visit reminder at the storefront: "Scroll to order" with a
// downward motion. It sits under the café (centred beside the station
// panel, following the view inset) and bows out for good on the first
// scroll. Clicking it walks to the next station.
// ============================================================

import { useEffect, useState, useSyncExternalStore } from "react";
import { getProgress, goTo, subscribeProgress } from "@/lib/cafe/scroll";
import { STATIONS } from "@/lib/cafe/stations";
import { getViewInset, subscribeViewInset } from "@/lib/cafe/view-inset";

/** Progress past which the visitor has clearly started walking. */
const MOVED = 0.004;
/** Let the storefront panel land first. */
const DELAY_MS = 700;

export default function ScrollCue({ reduced }: { reduced: boolean }) {
  const inset = useSyncExternalStore(subscribeViewInset, getViewInset, () => 0);
  const [moved, setMoved] = useState(() => getProgress() > MOVED);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (moved) return;
    return subscribeProgress(() => {
      if (getProgress() > MOVED) setMoved(true);
    });
  }, [moved]);

  useEffect(() => {
    const t = window.setTimeout(() => setShown(true), reduced ? 0 : DELAY_MS);
    return () => window.clearTimeout(t);
  }, [reduced]);

  const visible = shown && !moved;

  return (
    <button
      type="button"
      onClick={() => goTo(STATIONS[1].id, { immediate: reduced })}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`scroll-cue ${visible ? "is-visible" : ""}`}
      style={{ "--cue-shift": `${inset}px` } as React.CSSProperties}
    >
      <span className="scroll-cue-label">
        <span aria-hidden className="scroll-cue-mouse">
          <span />
        </span>
        Scroll to order
      </span>
      <span aria-hidden className="scroll-cue-chevrons">
        <span />
        <span />
      </span>
    </button>
  );
}
