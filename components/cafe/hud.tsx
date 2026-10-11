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
import { addStamp, isComplete, loadStamps, saveStamps } from "@/lib/cafe/loyalty";
import { getProgress, goTo, subscribeProgress } from "@/lib/cafe/scroll";
import { STATIONS, stationIndexAt, type StationId } from "@/lib/cafe/stations";

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
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const onScroll = () => {
      const id = STATIONS[stationIndexAt(getProgress())].id;
      if (id === last.current) return;
      last.current = id;
      setStamps((prev) => {
        const next = addStamp(prev, id);
        if (next !== prev) saveStamps(storage(), next);
        return next;
      });
    };
    onScroll();
    return subscribeProgress(onScroll);
  }, []);

  useEffect(() => {
    if (!secretOpen) return;
    const card = cardRef.current;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // Capture phase + stopPropagation: the shell's Escape handler (which
      // closes the Quick Order drawer) never sees this keypress.
      e.stopPropagation();
      setSecretOpen(false);
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      card?.focus();
    };
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
        className="font-receipt fixed top-4 left-4 z-20 rounded-sm bg-[#f6ead8] px-3 py-2 text-[#2b1a10] shadow-lg"
      >
        <span className="block text-[10px] tracking-[0.2em]">LOYALTY CARD</span>
        <span aria-hidden className="mt-1 flex gap-1">
          {STATIONS.map((s) => (
            <span
              key={s.id}
              className={`grid h-5 w-5 place-items-center rounded-full border border-[#2b1a10]/40 text-[10px] ${stamps.includes(s.id) ? "bg-[#c0632f] text-[#f6ead8]" : ""}`}
            >
              {stamps.includes(s.id) ? "☕" : ""}
            </span>
          ))}
        </span>
      </button>

      <nav aria-label="Visited stations" className="fixed top-4 left-1/2 z-20 hidden -translate-x-1/2 gap-2 sm:flex">
        {stamps.map((id) => {
          const station = STATIONS.find((s) => s.id === id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => goTo(id, { immediate: reduced })}
              className="font-receipt rounded-sm bg-[#f6ead8]/90 px-2 py-1 text-[11px] text-[#2b1a10] shadow"
            >
              {station?.label}
            </button>
          );
        })}
      </nav>

      {secretOpen && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-[#1b120c]/70 p-4">
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className="w-full max-w-sm rounded-md bg-[#f6ead8] p-6 text-[#2b1a10] shadow-2xl"
          >
            <h2 id={titleId} className="font-chalk text-3xl">
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
              onClick={() => setSecretOpen(false)}
              className="font-receipt mt-5 rounded-sm border border-[#2b1a10]/40 px-4 py-2 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
