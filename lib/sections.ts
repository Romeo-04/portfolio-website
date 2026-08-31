// ============================================================
// SECTION REGISTRY
// ============================================================
// Single source of truth for the page's section order, anchor ids, and the
// two-digit index the redesign prints beside every section heading. The nav,
// the scroll-spy hook, and the orb navigator all read from here so they can
// never drift apart.
//
// `certifications` is listed but renders nothing while certificationsData is
// empty — consumers that care about what's actually on the page resolve the
// list against the DOM via `presentSections()`.
// ============================================================

import { certificationsData } from "@/data/portfolio";

export interface SectionMeta {
  id: string;
  /** Short label for the nav and the orb's status pill. */
  label: string;
  /** Two-digit index shown in section headings; the hero has none. */
  num?: string;
  /** Hidden from the top nav (still scroll-spied if present). */
  navHidden?: boolean;
}

export const SECTIONS: SectionMeta[] = [
  { id: "home", label: "HOME", navHidden: true },
  { id: "about", label: "ABOUT", num: "01" },
  { id: "skills", label: "SKILLS", num: "02" },
  { id: "experience", label: "EXPERIENCE", num: "03" },
  { id: "projects", label: "PROJECTS", num: "04" },
  { id: "achievements", label: "HONORS", num: "05" },
  { id: "github", label: "GITHUB", num: "06" },
  { id: "certifications", label: "CERTS", num: "07" },
  { id: "contact", label: "CONTACT", num: "08" },
];

/** Nav entries, minus the hero and minus sections that render nothing. */
export const NAV_SECTIONS = SECTIONS.filter(
  (s) =>
    !s.navHidden &&
    (s.id !== "certifications" || certificationsData.length > 0),
);

const NO_SECTIONS: SectionMeta[] = [];
let presentCache: SectionMeta[] | null = null;

/**
 * Sections actually mounted in the DOM. Read through useSyncExternalStore,
 * so it must be referentially stable — hence the cache. The set is fixed for
 * the lifetime of the page (sections are decided at render time by whether
 * their data exists), so computing it once is correct, not just an
 * optimization.
 *
 * Returns a stable empty array on the server; the first client read fills
 * the cache from the hydrated markup.
 */
export function presentSections(): SectionMeta[] {
  if (typeof document === "undefined") return NO_SECTIONS;
  presentCache ??= SECTIONS.filter(
    (s) => document.getElementById(s.id) !== null,
  );
  return presentCache;
}

/** Server snapshot for useSyncExternalStore. */
export function noSections(): SectionMeta[] {
  return NO_SECTIONS;
}

/**
 * The section set never changes after mount, so there is nothing to
 * subscribe to — but useSyncExternalStore requires a subscribe function.
 */
export function subscribeSections(): () => void {
  return () => {};
}
