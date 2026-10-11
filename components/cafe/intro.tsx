"use client";

// ============================================================
// INTRO (station 0)
// ============================================================
// The espresso machine warms up: its pressure gauge follows real asset
// loading (drei useProgress), never finishing before a minimum time so the
// moment registers. Plays once per session, never on deep links, and can
// be skipped. Mounted only in café mode, so it never renders on the server.
// ============================================================

import { useProgress } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { personalInfo } from "@/data/portfolio";
import { gaugeValue } from "@/lib/cafe/choreo";
import { markIntroSeen, shouldPlayIntro } from "@/lib/cafe/intro";

function storage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export default function Intro({
  reduced,
  ready,
  onActiveChange,
}: {
  reduced: boolean;
  ready: boolean;
  onActiveChange?: (active: boolean) => void;
}) {
  const [show, setShow] = useState(() => shouldPlayIntro(window.location.hash, storage()));
  const [value, setValue] = useState(0);
  const readyRef = useRef(ready);
  const skipRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    readyRef.current = ready;
  }, [ready]);

  useEffect(() => {
    onActiveChange?.(show);
  }, [show, onActiveChange]);

  useEffect(() => {
    if (show) skipRef.current?.focus();
  }, [show]);

  useEffect(() => {
    if (!show) return;
    const minMs = reduced ? 1200 : 2400;
    const start = performance.now();
    let frame = 0;
    // Latched so the needle never moves backwards when more assets start loading.
    let latched = 0;
    const tick = () => {
      const { active, total, progress } = useProgress.getState();
      const loaded = !readyRef.current ? 0 : total === 0 && !active ? null : progress;
      const v = gaugeValue(performance.now() - start, minMs, loaded);
      latched = Math.max(latched, v);
      setValue(latched);
      if (latched >= 1) {
        markIntroSeen(storage());
        setShow(false);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [show, reduced]);

  if (!show) return null;

  const needle = -90 + 180 * value;
  const skip = () => {
    markIntroSeen(storage());
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Café loading"
      className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-[#1b120c] text-[#f5e9da]"
    >
      <div aria-hidden className="relative h-24 w-40">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute bottom-0 h-10 w-4 rounded-full bg-[#f5e9da]/40 blur-sm motion-reduce:hidden motion-safe:animate-[cafe-steam_2.4s_ease-in-out_infinite]"
            style={{ left: `${40 + i * 30}%`, animationDelay: `${i * 0.5}s` }}
          />
        ))}
      </div>
      <svg viewBox="0 0 120 70" width="180" aria-hidden>
        <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="#f5e9da" strokeWidth="4" />
        <line
          x1="60"
          y1="60"
          x2="60"
          y2="18"
          stroke="#ffb36b"
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${needle} 60 60)`}
        />
        <circle cx="60" cy="60" r="5" fill="#ffb36b" />
      </svg>
      <p className="font-chalk mt-4 text-5xl">{personalInfo.name}</p>
      <p className="font-receipt mt-1 text-sm">{personalInfo.role}</p>
      <p role="status" className="font-receipt mt-4 text-xs">
        Brewing… <span aria-hidden>{Math.round(value * 100)}%</span>
      </p>
      <button
        ref={skipRef}
        type="button"
        onClick={skip}
        className="font-receipt mt-6 rounded-sm border border-[#f5e9da]/40 px-4 py-2 text-sm"
      >
        Skip intro
      </button>
    </div>
  );
}
