"use client";

// ============================================================
// MENU NAV
// ============================================================
// A row of section chips that sticks to the top of the Quick Order menu,
// so the long single column on phones can be skimmed and jumped through.
// It marks the section in view and keeps that chip centred in the row.
// Works the same as the page (phones) and inside the desktop drawer,
// whose scroll box is found from the nav itself.
// ============================================================

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const MENU_SECTIONS = [
  { id: "menu-drinks", label: "Drinks" },
  { id: "menu-shelf", label: "Shelf" },
  { id: "menu-about", label: "About" },
  { id: "menu-ingredients", label: "Ingredients" },
  { id: "menu-roast-log", label: "Roast Log" },
  { id: "menu-wall", label: "Wall" },
  { id: "menu-specials", label: "Specials" },
  { id: "menu-regulars", label: "Regulars" },
  { id: "menu-find-us", label: "Find Us" },
] as const;

export default function MenuNav() {
  const reduced = useReducedMotion();
  const list = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState<string | null>(null);

  // The section crossing the upper middle of the scroll box is the current one.
  useEffect(() => {
    const nav = list.current;
    if (!nav) return;
    const root = nav.closest<HTMLElement>(".menu-drawer-scroll");
    // The last section is too short to reach that band, so the bottom of the
    // scroll marks it instead, and wins over the observer.
    const box = root ?? document.documentElement;
    const last = MENU_SECTIONS[MENU_SECTIONS.length - 1].id;
    const atBottom = () => box.scrollTop + box.clientHeight >= box.scrollHeight - 4;
    const io = new IntersectionObserver(
      (entries) => {
        if (atBottom()) return setActive(last);
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { root, rootMargin: "-30% 0px -65% 0px" },
    );
    for (const s of MENU_SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    const scroller: HTMLElement | Window = root ?? window;
    const onScroll = () => {
      if (atBottom()) setActive(last);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      scroller.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Keep the active chip in view by scrolling the row only, never the page.
  useEffect(() => {
    const row = list.current;
    const chip = row?.querySelector<HTMLElement>(`[data-section="${active}"]`);
    if (!row || !chip) return;
    row.scrollTo({ left: chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2, behavior: reduced ? "auto" : "smooth" });
  }, [active, reduced]);

  function jump(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    e.stopPropagation();
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    setActive(id);
  }

  return (
    <nav aria-label="Menu sections" className="menu-nav">
      <ul ref={list} className="menu-nav-row">
        {MENU_SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              data-section={s.id}
              aria-current={active === s.id ? "true" : undefined}
              onClick={(e) => jump(e, s.id)}
              className="menu-nav-chip"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
