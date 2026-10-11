"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import SceneBoundary from "@/components/cafe/scene-boundary";
import Intro from "@/components/cafe/intro";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { detectWebGL, isPhoneViewport, resolveMode } from "@/lib/cafe/mode";
import { goTo, pauseScroll, startScroll } from "@/lib/cafe/scroll";
import { STATIONS, menuTargetForHash, resolveHash } from "@/lib/cafe/stations";

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
  const [failed, setFailed] = useState(false);
  const [introActive, setIntroActive] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);
  const asideRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // Move focus into the drawer when it opens; hand it back to the toggle on
  // close if it was inside. Not a modal, so no trap. Skips initial mount.
  useEffect(() => {
    if (open) {
      asideRef.current?.focus();
    } else if (
      wasOpen.current &&
      // inert drops focus to <body> in the same commit, so count that too.
      (document.activeElement === document.body || asideRef.current?.contains(document.activeElement))
    ) {
      toggleRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  const mode = !caps ? "menu" : failed ? "closed" : resolveMode({ ...caps, entered });
  const inCafe = mode === "cafe";

  useEffect(() => {
    if (!inCafe) return;
    const stop = startScroll({ smooth: !reduced });
    pauseScroll(introActive);
    const target = resolveHash(window.location.hash);
    // Wait a frame so Lenis and the layout have measured before jumping.
    const frame = requestAnimationFrame(() => {
      if (target) goTo(target, { immediate: true });
    });
    return () => {
      cancelAnimationFrame(frame);
      stop();
    };
    // introActive is read only at start; the effect below tracks later changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inCafe, reduced]);

  // Freeze scrolling while the intro covers the café.
  useEffect(() => {
    if (!inCafe || !introActive) return;
    pauseScroll(true);
    return () => pauseScroll(false);
  }, [inCafe, introActive]);

  // Menu is the page (phones, no WebGL): honour a deep link by scrolling to
  // the matching menu section.
  useEffect(() => {
    if (inCafe) return;
    const id = menuTargetForHash(window.location.hash);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, [inCafe]);

  useEffect(() => {
    if (!inCafe || introActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "m" && e.key !== "M") return;
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      setOpen((o) => !o);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inCafe, introActive]);

  // One handler for every "#station" link in the menu: glide the camera in
  // the café, or jump to the matching menu section when the menu is the page.
  function onLinkClick(e: React.MouseEvent) {
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
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
      const id = menuTargetForHash(href);
      if (id) document.getElementById(id)?.scrollIntoView();
    }
  }

  if (!inCafe) {
    return (
      <main onClick={onLinkClick} aria-label="Quick Order menu" className="mx-auto max-w-2xl px-5 py-10">
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
      <div inert={introActive}>
      <SceneBoundary onError={() => setFailed(true)}>
        <CafeScene cut={reduced} onReady={() => setSceneReady(true)} />
      </SceneBoundary>
      {/* Scroll track: one viewport of scroll per station. */}
      <div aria-hidden style={{ height: `${STATIONS.length * 100}vh` }} />
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="quick-order"
        className="font-receipt fixed top-4 right-4 z-20 rounded-sm bg-[#f6ead8] px-4 py-2 text-sm text-[#2b1a10] shadow-lg"
      >
        {open ? "Close menu" : "Quick Order (M)"}
      </button>
      <aside
        ref={asideRef}
        tabIndex={-1}
        aria-label="Quick Order menu"
        id="quick-order"
        data-lenis-prevent
        inert={!open}
        className={`fixed top-0 right-0 z-10 h-full w-full max-w-md overflow-y-auto bg-[#f6ead8] p-6 pt-16 shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {children}
      </aside>
      </div>
      <Intro reduced={reduced} ready={sceneReady} onActiveChange={setIntroActive} />
    </div>
  );
}
