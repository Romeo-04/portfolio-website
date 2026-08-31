"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Shared page-section geometry: centred 1200px column, gutters, vertical
 * rhythm, and `z-1` to sit above the fixed galaxy canvas.
 */
export const SECTION_SHELL =
  "relative z-1 mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20";

const STAGGER_STEP = 0.07; // seconds between children
const MAX_STAGGERED = 8; // beyond this every child shares the last delay

// useLayoutEffect warns during SSR; the arming pass has no server equivalent.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/**
 * Scroll-triggered entrance for a page section.
 *
 * Fail-visible by construction: the server renders the section fully
 * visible, and the hidden state ("armed") is applied client-side in a layout
 * effect — before the browser paints, so there's no flash, but only ever
 * when JS is actually running. If a script fails, or the visitor prefers
 * reduced motion, the content simply sits there, readable.
 *
 * Descendants tagged `data-reveal-child` animate in sequence.
 */
export default function SectionReveal({
  children,
  className = "",
  id,
}: SectionRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const children = el.querySelectorAll<HTMLElement>("[data-reveal-child]");
    children.forEach((child, i) => {
      child.style.transitionDelay = `${Math.min(i, MAX_STAGGERED) * STAGGER_STEP}s`;
    });
    el.classList.add("reveal-armed");

    return () => {
      el.classList.remove("reveal-armed", "reveal-in");
      children.forEach((child) => {
        child.style.transitionDelay = "";
      });
    };
  }, [reduced]);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("reveal-in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );
    observer.observe(el);

    // Failsafe: a section taller than the viewport can never cross the 12%
    // threshold on some browsers. Reveal anything still armed after 3s.
    const failsafe = setTimeout(() => el.classList.add("reveal-in"), 3000);

    return () => {
      observer.disconnect();
      clearTimeout(failsafe);
    };
  }, [reduced]);

  return (
    <section ref={ref} id={id} className={className}>
      {children}
    </section>
  );
}
