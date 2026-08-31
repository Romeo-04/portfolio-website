"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { markIntroDone } from "@/lib/intro";

// Phase durations in ms, in order: 0 → 1, 1 → ∞, tagline.
const PHASE_DURATIONS = [2100, 2100, 2600];
const SLIDE_MS = 1000;

const PHASE_LABELS = [
  "01 / ZERO → ONE",
  "02 / ONE → INFINITY",
  "03 / EGO",
] as const;

/**
 * The `0 → 1 → ∞` boot sequence that precedes the site on every visit.
 *
 * Deliberately fail-visible: the page itself is server-rendered underneath,
 * and this overlay only mounts after hydration. If JS never runs — or the
 * visitor prefers reduced motion — the portfolio is simply there, unblocked.
 */
export default function IntroOverlay() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const dismiss = useCallback(() => {
    clearTimers();
    setLeaving(true);
    delete document.body.dataset.intro;
    // Hand off to the hero as the overlay starts lifting, so its stagger
    // rides the slide rather than playing hidden behind it.
    markIntroDone();
    timers.current.push(setTimeout(() => setGone(true), SLIDE_MS));
  }, []);

  useEffect(() => {
    if (reduced) {
      // Nothing to play — hand straight off to the hero. `gone` is derived
      // from `reduced` below rather than set here.
      markIntroDone();
      return;
    }

    // The overlay is the first thing a visitor sees, so start from the top
    // even if the browser restored a scroll position — but never clobber a
    // deep link: someone following #projects should land on #projects.
    if (!window.location.hash) window.scrollTo(0, 0);
    document.body.dataset.intro = "playing";

    let current = 0;
    const advance = () => {
      current += 1;
      if (current > 2) {
        dismiss();
        return;
      }
      setPhase(current);
      timers.current.push(setTimeout(advance, PHASE_DURATIONS[current]));
    };
    timers.current.push(setTimeout(advance, PHASE_DURATIONS[0]));

    // Failsafe: never leave a visitor stuck behind the overlay if a timer
    // is throttled (background tab) or a phase animation stalls.
    timers.current.push(
      setTimeout(
        dismiss,
        PHASE_DURATIONS.reduce((a, b) => a + b, 0) + 1500,
      ),
    );

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      clearTimers();
      delete document.body.dataset.intro;
      window.removeEventListener("keydown", onKey);
    };
  }, [reduced, dismiss]);

  if (gone || reduced) return null;

  return (
    <div
      role="dialog"
      aria-label="Intro animation"
      className="bg-void fixed inset-0 z-[1000] flex items-center justify-center"
      style={{
        transform: leaving ? "translateY(-100%)" : "translateY(0)",
        transition: `transform ${SLIDE_MS}ms cubic-bezier(.85,0,.15,1)`,
      }}
    >
      {/* Star-field dot pattern */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--glow-beam) 1px, transparent 1px), radial-gradient(circle, var(--hairline) 1px, transparent 1px)",
          backgroundSize: "140px 140px, 90px 90px",
          backgroundPosition: "20px 30px, 60px 70px",
        }}
      />

      <div className="text-ink-muted absolute top-6 left-6 font-mono text-[11px] tracking-[0.14em] sm:top-7 sm:left-8 sm:text-xs">
        JHEZRA.DEV — BOOT SEQUENCE
      </div>
      <div className="text-beam absolute top-6 right-6 font-mono text-[11px] tracking-[0.14em] sm:top-7 sm:right-8 sm:text-xs">
        PHASE {PHASE_LABELS[phase]}
      </div>

      {phase === 0 && (
        <Transition
          from="0"
          to="1"
          fromClass="text-ink animate-num-pop"
          toClass="text-beam animate-slide-right"
          arrowClass="text-beam"
          streakColor="var(--beam)"
          toDelay="0.85s"
          arrowDelay="0.55s"
        />
      )}

      {phase === 1 && (
        <Transition
          from="1"
          to="∞"
          fromClass="text-beam"
          toClass="text-ink animate-slide-right"
          arrowClass="text-ember"
          streakColor="var(--ember)"
          toDelay="0.65s"
          arrowDelay="0.35s"
        />
      )}

      {phase === 2 && (
        <div className="relative px-6 text-center">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[clamp(28px,6vw,56px)] font-bold tracking-[-0.02em]">
            {["Building", "something", "that", "lasts."].map((word, i) => (
              <span key={word} className="inline-block overflow-hidden">
                <span
                  className={`animate-word-up inline-block ${
                    i === 3 ? "text-beam" : "text-ink"
                  }`}
                  style={{ animationDelay: `${i * 0.12}s` }}
                >
                  {word}
                </span>
              </span>
            ))}
          </div>
          <div
            className="text-ink-muted animate-word-up mt-6 font-mono text-[11px] tracking-[0.18em] sm:text-sm"
            style={{ animationDelay: "0.7s" }}
          >
            JHEZRA A. TOLENTINO — SOFTWARE ENGINEER
          </div>
        </div>
      )}

      {/* Progress + skip */}
      <div className="absolute right-6 bottom-7 left-6 flex items-center gap-4 sm:right-8 sm:left-8">
        <div className="hairline h-0.5 flex-1 overflow-hidden rounded-full">
          <div
            className="bg-beam h-full transition-[width] duration-500 ease-out"
            style={{ width: `${Math.min(phase + 1, 3) * 33.4}%` }}
          />
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="border-border text-ink-muted hover:border-beam hover:text-ink cursor-pointer rounded-full border px-4 py-1.5 font-mono text-[11px] transition-colors"
        >
          SKIP →
        </button>
      </div>
    </div>
  );
}

/** One `A → B` glyph pair with the light streak sweeping across it. */
function Transition({
  from,
  to,
  fromClass,
  toClass,
  arrowClass,
  streakColor,
  toDelay,
  arrowDelay,
}: {
  from: string;
  to: string;
  fromClass: string;
  toClass: string;
  arrowClass: string;
  streakColor: string;
  toDelay: string;
  arrowDelay: string;
}) {
  return (
    <div className="relative flex items-center gap-[min(5vw,48px)]">
      <div
        className={`text-[min(26vh,220px)] leading-none font-bold ${fromClass}`}
        style={{ textShadow: "0 0 70px var(--glow-beam)" }}
      >
        {from}
      </div>
      <div
        className={`animate-arrow-in text-[min(14vh,120px)] leading-none ${arrowClass}`}
        style={{ animationDelay: arrowDelay }}
      >
        →
      </div>
      <div
        className={`text-[min(26vh,220px)] leading-none font-bold ${toClass}`}
        style={{
          animationDelay: toDelay,
          textShadow: "0 0 90px var(--glow-beam)",
        }}
      >
        {to}
      </div>
      <div
        aria-hidden
        className="animate-streak absolute top-1/2 -right-20 -left-20 h-0.5"
        style={{
          background: `linear-gradient(90deg, transparent, ${streakColor}, transparent)`,
          animationDelay: "0.3s",
        }}
      />
    </div>
  );
}
