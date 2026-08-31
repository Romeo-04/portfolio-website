"use client";

import type { CSSProperties } from "react";
import { useSyncExternalStore } from "react";
import { personalInfo } from "@/data/portfolio";
import { introNotDone, isIntroDone, onIntroDone } from "@/lib/intro";

interface Orbit {
  size: number;
  duration: string;
  style: CSSProperties["borderStyle"];
  /** Ring border opacity, 0–1. */
  opacity: number;
  dot: string;
  reverse?: boolean;
}

// Decorative orbit rings behind the hero. Each is a bordered circle with a
// single travelling dot pinned to its edge.
const ORBITS: Orbit[] = [
  { size: 360, duration: "26s", style: "solid", opacity: 0.4, dot: "var(--beam)" },
  { size: 560, duration: "44s", style: "solid", opacity: 0.3, dot: "var(--beam)" },
  {
    size: 780,
    duration: "75s",
    style: "dashed",
    opacity: 0.18,
    dot: "var(--ember)",
    reverse: true,
  },
];

interface Spark {
  pos: CSSProperties;
  size: number;
  color: string;
  delay: string;
  dur: string;
}

const SPARKS: Spark[] = [
  { pos: { top: "14%", left: "16%" }, size: 4, color: "var(--beam)", delay: "0s", dur: "3s" },
  { pos: { top: "22%", right: "18%" }, size: 5, color: "var(--ink)", delay: "0.8s", dur: "2.4s" },
  { pos: { bottom: "18%", left: "26%" }, size: 3, color: "var(--ember)", delay: "1.4s", dur: "3.4s" },
  { pos: { bottom: "26%", right: "24%" }, size: 4, color: "var(--beam)", delay: "0.4s", dur: "2.8s" },
];

export default function Hero() {
  // False on the server and until the boot overlay hands off, so the hero
  // ships as plain, visible markup. The entrance class is only ever added —
  // it never hides anything.
  const entered = useSyncExternalStore(
    onIntroDone,
    isIntroDone,
    introNotDone,
  );

  return (
    <section
      id="home"
      className="relative flex min-h-[88vh] items-center justify-center overflow-hidden"
    >
      {/* Orbit rings */}
      {ORBITS.map(({ size, duration, style, opacity, dot, reverse }) => (
        <div
          key={size}
          aria-hidden
          className="animate-orbit absolute rounded-full"
          style={{
            width: size,
            height: size,
            borderWidth: 1,
            borderStyle: style,
            borderColor: `color-mix(in srgb, var(--beam) ${opacity * 100}%, transparent)`,
            animationDuration: duration,
            animationDirection: reverse ? "reverse" : "normal",
          }}
        >
          <div
            className="absolute -top-[5px] left-1/2 h-2.5 w-2.5 rounded-full"
            style={{ background: dot, boxShadow: `0 0 14px ${dot}` }}
          />
        </div>
      ))}

      {/* Infinity watermark */}
      <div
        aria-hidden
        className="text-beam/6 pointer-events-none absolute leading-none font-bold select-none"
        style={{ fontSize: "min(60vw, 620px)" }}
      >
        ∞
      </div>

      {/* Twinkling sparks */}
      {SPARKS.map((s, i) => (
        <div
          key={i}
          aria-hidden
          className="animate-twinkle absolute rounded-full"
          style={{
            ...s.pos,
            width: s.size,
            height: s.size,
            background: s.color,
            animationDelay: s.delay,
            animationDuration: s.dur,
          }}
        />
      ))}

      {/* Scrim: the galaxy is densest dead centre, exactly where the name and
          tagline sit. This darkens that patch so the copy reads, while the
          field stays vivid toward the edges. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 42% at 50% 50%, var(--void) 0%, color-mix(in srgb, var(--void) 78%, transparent) 45%, transparent 78%)",
        }}
      />

      <div
        className={`animate-float-y relative px-5 py-14 text-center ${
          entered ? "hero-enter" : ""
        }`}
      >
        <div className="text-beam font-mono text-[11px] tracking-[0.26em] sm:text-[13px]">
          0 → 1 → ∞ · {personalInfo.role.toUpperCase()}
        </div>

        <h1 className="mt-5 text-[clamp(38px,9vw,84px)] leading-[1.02] font-bold tracking-[-0.03em]">
          {personalInfo.name}
        </h1>

        <p className="text-ink-muted mx-auto mt-5 max-w-[560px] text-base leading-relaxed text-pretty sm:text-lg lg:text-[22px]">
          {personalInfo.tagline}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3.5">
          <a
            href="#projects"
            className="bg-beam text-primary-foreground hover:bg-ink rounded-full px-7 py-3.5 font-mono text-[13px] font-bold transition-colors"
          >
            EXPLORE WORK
          </a>
          <a
            href="#contact"
            className="border-ink/40 text-ink hover:bg-ink hover:text-void rounded-full border-[1.5px] px-7 py-3.5 font-mono text-[13px] transition-colors"
          >
            SAY HELLO
          </a>
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-5 font-mono text-xs">
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-beam hover:text-ink transition-colors"
          >
            GITHUB ↗
          </a>
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-beam hover:text-ink transition-colors"
          >
            LINKEDIN ↗
          </a>
          <a
            href={`mailto:${personalInfo.email}`}
            className="text-beam hover:text-ink transition-colors"
          >
            EMAIL ↗
          </a>
        </div>
      </div>
    </section>
  );
}
