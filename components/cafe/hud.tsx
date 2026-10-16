"use client";

// ============================================================
// HUD
// ============================================================
// The game layer over the café (spec section 4): a loyalty card that stamps
// each station the visitor reaches, a station nav centred over the café
// (the current stop filled, visited ones stamped), and the secret "Off the
// Clock" drink once the card is full. It listens to the scroll store but
// only re-renders when the current station changes.
// ============================================================

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { offTheClock } from "@/data/portfolio";
import { Close, Cup } from "@/components/ui/icons";
import { addStamp, isComplete, loadStamps, saveStamps, stampFor } from "@/lib/cafe/loyalty";
import { getProgress, goTo, isGliding, subscribeProgress } from "@/lib/cafe/scroll";
import { STATIONS, stationIndexAt, type StationId } from "@/lib/cafe/stations";
import { getViewInset, subscribeViewInset } from "@/lib/cafe/view-inset";

function storage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export default function Hud({ reduced }: { reduced: boolean }) {
  const [stamps, setStamps] = useState<StationId[]>(() => loadStamps(storage()));
  const [current, setCurrent] = useState(() => stationIndexAt(getProgress()));
  const [secretOpen, setSecretOpen] = useState(false);
  const inset = useSyncExternalStore(subscribeViewInset, getViewInset, () => 0);
  const last = useRef<StationId | null>(null);
  const cardRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const onScroll = () => {
      setCurrent(stationIndexAt(getProgress()));
      const id = stampFor(getProgress(), isGliding());
      if (!id || id === last.current) return;
      last.current = id;
      setStamps((prev) => addStamp(prev, id));
    };
    return subscribeProgress(onScroll);
  }, []);

  useEffect(() => {
    saveStamps(storage(), stamps);
  }, [stamps]);

  useEffect(() => {
    if (secretOpen && dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
  }, [secretOpen]);

  const complete = isComplete(stamps);

  return (
    <>
      <button
        ref={cardRef}
        type="button"
        onClick={() => complete && setSecretOpen(true)}
        aria-label={
          complete
            ? "Loyalty card full: open your secret drink"
            : `Loyalty card: ${stamps.length} of ${STATIONS.length} stamps`
        }
        aria-disabled={!complete}
        className={`hud-card ${complete ? "is-complete" : ""}`}
      >
        <span className="hud-card-label">
          <span className="hud-card-name">Loyalty card</span>
          <span className="hud-card-count">
            {stamps.length}/{STATIONS.length}
          </span>
        </span>
        <span aria-hidden className="hud-stamps">
          {STATIONS.map((s) => (
            <span key={s.id} className={`hud-stamp ${stamps.includes(s.id) ? "is-stamped" : ""}`}>
              {stamps.includes(s.id) && <Cup size={12} />}
            </span>
          ))}
        </span>
      </button>

      <nav aria-label="Stations" className="hud-nav" style={{ "--hud-shift": `${inset}px` } as React.CSSProperties}>
        {STATIONS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(s.id, { immediate: reduced })}
            aria-current={i === current ? "step" : undefined}
            aria-label={s.label}
            className={`hud-nav-item ${stamps.includes(s.id) ? "is-visited" : ""}`}
          >
            {s.short}
          </button>
        ))}
      </nav>

      {secretOpen && (
        <dialog
          ref={dialogRef}
          aria-labelledby={titleId}
          onClose={() => {
            setSecretOpen(false);
            cardRef.current?.focus();
          }}
          onClick={(e) => {
            if (e.target === dialogRef.current) dialogRef.current?.close();
          }}
          className="secret-dialog"
        >
          <p className="sheet-label">Loyalty card full</p>
          <h2 id={titleId} className="font-display mt-1 text-[32px] leading-tight">
            Off the Clock
          </h2>
          {offTheClock ? (
            <div className="mt-4 grid gap-2 text-sm leading-relaxed">
              <p>
                <strong>My order:</strong> {offTheClock.coffeeOrder}
              </p>
              <p>
                <strong>Off the clock:</strong> {offTheClock.hobbies.join(" · ")}
              </p>
              <p>
                <strong>Fun fact:</strong> {offTheClock.funFact}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-relaxed">The barista is still writing this one — check back soon.</p>
          )}
          <button type="button" onClick={() => dialogRef.current?.close()} className="sheet-close" aria-label="Close">
            <Close size={18} />
          </button>
        </dialog>
      )}
    </>
  );
}
