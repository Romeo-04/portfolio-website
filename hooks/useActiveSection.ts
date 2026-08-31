"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  noSections,
  presentSections,
  subscribeSections,
  type SectionMeta,
} from "@/lib/sections";

interface ActiveSection {
  /** Anchor id of the section currently occupying the viewport band. */
  activeId: string;
  /** Its index within `sections` — the orb uses this to pick a rotation. */
  activeIndex: number;
  /** Sections that actually rendered (github/certifications can be absent). */
  sections: SectionMeta[];
}

/**
 * Scroll-spy over whichever sections are mounted. The section list comes
 * from the DOM rather than the static registry, so a section that rendered
 * nothing (empty certifications, GitHub API failure) never becomes an
 * unreachable stop in the nav or the orb's cycle.
 */
export function useActiveSection(): ActiveSection {
  const sections = useSyncExternalStore(
    subscribeSections,
    presentSections,
    noSections,
  );
  const [activeId, setActiveId] = useState("home");

  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const activeIndex = Math.max(
    0,
    sections.findIndex((s) => s.id === activeId),
  );

  return { activeId, activeIndex, sections };
}
