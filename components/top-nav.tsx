"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { useActiveSection } from "@/hooks/useActiveSection";
import { NAV_SECTIONS } from "@/lib/sections";
import { personalInfo } from "@/data/portfolio";

export default function TopNav() {
  const { activeId } = useActiveSection();
  const [open, setOpen] = useState(false);

  // Close the mobile sheet on Escape and whenever the viewport grows past
  // the breakpoint where the inline nav takes over.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  return (
    <header
      className="sticky top-0 z-100 border-b backdrop-blur-xl"
      style={{ background: "var(--nav-bg)", borderColor: "var(--hairline)" }}
    >
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <a
          href="#home"
          className="text-ink shrink-0 font-mono text-[15px] font-bold"
        >
          JT<span className="text-beam">.</span>dev
        </a>

        {/* Inline nav — desktop */}
        <div className="hidden items-center gap-6 font-mono text-[11px] tracking-[0.08em] lg:flex">
          {NAV_SECTIONS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={activeId === id ? "true" : undefined}
              className={
                activeId === id
                  ? "text-beam transition-colors"
                  : "text-ink-muted hover:text-ink transition-colors"
              }
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <ThemeToggle />
          <a
            href={personalInfo.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border-beam/50 text-beam hover:bg-beam hover:text-primary-foreground hidden rounded-full border px-3.5 py-1.5 font-mono text-[11px] transition-colors sm:inline-block"
          >
            RESUME ↗
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="border-border text-ink-muted hover:text-ink flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border transition-colors lg:hidden"
          >
            {open ? (
              <X className="h-3.5 w-3.5" />
            ) : (
              <Menu className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </nav>

      {/* Sheet — mobile / tablet */}
      {open && (
        <div
          className="bg-panel border-t px-5 pt-2 pb-5 lg:hidden"
          style={{ borderColor: "var(--hairline)" }}
        >
          <div className="grid grid-cols-2 gap-1">
            {NAV_SECTIONS.map(({ id, num, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className={`flex items-baseline gap-2 rounded-lg px-3 py-2.5 font-mono text-xs tracking-[0.08em] transition-colors ${
                  activeId === id
                    ? "bg-accent text-beam"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                <span className="text-beam/60 text-[10px]">{num}</span>
                {label}
              </a>
            ))}
          </div>
          <a
            href={personalInfo.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border-beam/50 text-beam mt-3 block rounded-full border px-4 py-2.5 text-center font-mono text-[11px] sm:hidden"
          >
            RESUME ↗
          </a>
        </div>
      )}
    </header>
  );
}
