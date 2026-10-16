"use client";

// ============================================================
// HUD
// ============================================================
// The game layer over the café (spec section 4): a loyalty card that stamps
// each station the visitor reaches, an order rail to jump back, and the
// secret "Off the Clock" drink once the card is full. It listens to the
// scroll store but only re-renders when the current station changes.
// ============================================================

import { useEffect, useId, useRef, useState } from "react";
import { offTheClock } from "@/data/portfolio";
import { Cup } from "@/components/ui/icons";
import { addStamp, isComplete, loadStamps, saveStamps, stampFor } from "@/lib/cafe/loyalty";
import { getProgress, goTo, isGliding, subscribeProgress } from "@/lib/cafe/scroll";
import { STATIONS, type StationId } from "@/lib/cafe/stations";

function storage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export default function Hud({ reduced }: { reduced: boolean }) {
  const [stamps, setStamps] = useState<StationId[]>(() => loadStamps(storage()));
  const [secretOpen, setSecretOpen] = useState(false);
  const last = useRef<StationId | null>(null);
  const cardRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const onScroll = () => {
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
        className="game-panel fixed top-4 left-4 z-20 px-3 py-2"
      >
        <span className="font-display block text-sm tracking-[0.08em]">Loyalty Card</span>
        <span aria-hidden className="mt-1 flex gap-1">
          {STATIONS.map((s) => (
            <span
              key={s.id}
              className={`grid h-6 w-6 place-items-center rounded-full border-2 border-[#2b2b2e] text-[11px] transition-transform ${stamps.includes(s.id) ? "scale-110 bg-[#e4572e] text-[#fff8ec]" : "bg-[#efe3cf]"}`}
            >
              {stamps.includes(s.id) && <Cup size={14} />}
            </span>
          ))}
        </span>
      </button>

      <nav aria-label="Visited stations" className="fixed top-4 left-1/2 z-20 hidden -translate-x-1/2 gap-2 lg:flex">
        {stamps.map((id) => {
          const station = STATIONS.find((s) => s.id === id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => goTo(id, { immediate: reduced })}
              className="game-button px-3 py-1 text-xs"
            >
              {station?.label}
            </button>
          );
        })}
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
          className="game-panel m-auto max-h-[80vh] w-full max-w-sm overflow-y-auto p-6 backdrop:bg-[#1b120c]/70"
        >
          <h2 id={titleId} className="font-display text-3xl">
            Off the Clock
          </h2>
          {offTheClock ? (
            <div className="mt-3 space-y-2 text-sm">
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
            <p className="mt-3 text-sm">The barista is still writing this one — check back soon.</p>
          )}
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="game-button game-button-accent mt-5 px-5 py-2 text-sm"
          >
            Close
          </button>
        </dialog>
      )}
    </>
  );
}
