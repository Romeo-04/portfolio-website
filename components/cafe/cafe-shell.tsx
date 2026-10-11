"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { detectWebGL, isPhoneViewport, resolveMode } from "@/lib/cafe/mode";
import { goTo, startScroll } from "@/lib/cafe/scroll";
import { STATIONS, resolveHash } from "@/lib/cafe/stations";

const CafeScene = dynamic(() => import("@/components/cafe/scene"), { ssr: false });

// Browser capabilities don't change during a visit, so read them once.
// null on the server: the SSR markup is the menu-as-page, which is also the
// right answer for no-JS visitors.
type Env = { webgl: boolean; phone: boolean };
let env: Env | null = null;
const readEnv = () => (env ??= { webgl: detectWebGL(), phone: isPhoneViewport() });
const noSubscribe = () => () => {};

export default function CafeShell({ children }: { children: ReactNode }) {
  const caps = useSyncExternalStore(noSubscribe, readEnv, () => null);
  const reduced = useReducedMotion();
  const [entered, setEntered] = useState(false);
  const [open, setOpen] = useState(false);

  const mode = caps ? resolveMode({ ...caps, entered }) : "menu";
  const inCafe = mode === "cafe";

  useEffect(() => {
    if (!inCafe) return;
    const stop = startScroll({ smooth: !reduced });
    const target = resolveHash(window.location.hash);
    if (target) goTo(target, { immediate: true });
    return stop;
  }, [inCafe, reduced]);

  useEffect(() => {
    if (!inCafe) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "m" || e.key === "M") setOpen((o) => !o);
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inCafe]);

  // One handler for every "#station" link in the menu: glide the camera in
  // the café, or jump to the matching menu section when the menu is the page.
  function onLinkClick(e: React.MouseEvent) {
    const link = (e.target as HTMLElement).closest("a");
    const href = link?.getAttribute("href");
    if (!href?.startsWith("#")) return;
    const station = resolveHash(href);
    if (!station) return;
    e.preventDefault();
    history.replaceState(null, "", href);
    if (inCafe) {
      setOpen(false);
      goTo(station, { immediate: reduced });
    } else {
      const section = STATIONS.find((s) => s.id === station)?.menuSection;
      if (section) document.getElementById(section)?.scrollIntoView();
    }
  }

  if (!inCafe) {
    return (
      <main onClick={onLinkClick} className="mx-auto max-w-2xl px-5 py-10">
        {mode === "closed" && (
          <p role="status" className="font-chalk mb-6 text-center text-2xl">
            The café is closed today ☕
          </p>
        )}
        {caps?.phone && caps.webgl && (
          <button
            type="button"
            onClick={() => setEntered(true)}
            className="font-receipt mb-6 w-full rounded-md border border-[#f5e9da]/40 px-4 py-3"
          >
            Step inside the café →
          </button>
        )}
        <div className="rounded-lg bg-[#f6ead8] p-6">{children}</div>
      </main>
    );
  }

  return (
    <div onClick={onLinkClick}>
      <CafeScene cut={reduced} />
      {/* Scroll track: one viewport of scroll per station. */}
      <div aria-hidden style={{ height: `${STATIONS.length * 100}vh` }} />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="quick-order"
        className="font-receipt fixed top-4 right-4 z-20 rounded-sm bg-[#f6ead8] px-4 py-2 text-sm text-[#2b1a10] shadow-lg"
      >
        {open ? "Close menu" : "Quick Order (M)"}
      </button>
      <aside
        id="quick-order"
        inert={!open}
        className={`fixed top-0 right-0 z-10 h-full w-full max-w-md overflow-y-auto bg-[#f6ead8] p-6 pt-16 shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {children}
      </aside>
    </div>
  );
}
