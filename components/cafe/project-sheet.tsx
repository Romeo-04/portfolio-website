"use client";

// ============================================================
// PROJECT SHEET
// ============================================================
// The pop-up for one project. It grows out of whatever was clicked (a
// panel card, a menu entry or a cup in the café) and shrinks back into it
// on close. Inside: the drink, the pitch, what was built, the stack and
// the links, with prev/next to walk every project. A native <dialog>, so
// focus is trapped and Escape works; reduced motion just fades.
// ============================================================

import { useEffect, useSyncExternalStore } from "react";
import { useSheetMotion } from "@/components/cafe/sheet-motion";
import DrinkIllustration from "@/components/menu/drink-illustration";
import { projectsData } from "@/data/portfolio";
import { drinkFor } from "@/lib/cafe/drinks";
import { ArrowLeft, ArrowRight, Close, Code, External } from "@/components/ui/icons";
import {
  SHEET_ORDER,
  closeProject,
  getSheet,
  stepProject,
  stepSlug,
  subscribeSheet,
} from "@/lib/cafe/project-sheet";

const originOfSheet = () => getSheet()?.origin ?? null;

export default function ProjectSheet({ reduced }: { reduced: boolean }) {
  // The store stays set until the close animation ends, so it drives everything.
  const shown = useSyncExternalStore(subscribeSheet, getSheet, () => null);
  const { dialog, card, dismiss } = useSheetMotion({
    open: shown !== null,
    origin: originOfSheet,
    reduced,
    onClosed: closeProject,
  });

  // Arrow keys walk between projects while the sheet is open.
  useEffect(() => {
    if (!shown) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") stepProject(1);
      else if (e.key === "ArrowLeft") stepProject(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shown]);

  if (!shown) return null;
  const project = projectsData.find((p) => p.slug === shown.slug);
  if (!project) return null;
  const drink = drinkFor(project);
  const index = SHEET_ORDER.indexOf(project.slug);
  const prev = projectsData.find((p) => p.slug === stepSlug(project.slug, -1));
  const next = projectsData.find((p) => p.slug === stepSlug(project.slug, 1));
  // Top layer of the drink tints the header; the stack runs down its edge.
  const tint = drink.layers[drink.layers.length - 1]?.color ?? "#e2cfae";

  return (
    <dialog
      ref={dialog}
      aria-labelledby="sheet-title"
      className="sheet-dialog"
      onCancel={(e) => {
        e.preventDefault();
        dismiss();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) dismiss();
      }}
    >
      <div ref={card} className="sheet-card" data-lenis-prevent>
        {/* Keyed by project so the content re-staggers on prev/next. */}
        <div key={project.slug} className="sheet-grid">
          <aside className="sheet-visual" style={{ background: `linear-gradient(160deg, ${tint}55, #fbf3e4 70%)` }}>
            <div className="sheet-rise" style={{ "--i": 0 } as React.CSSProperties}>
              <DrinkIllustration project={project} size={120} />
            </div>
            <div className="sheet-rise mt-5 w-full" style={{ "--i": 2 } as React.CSSProperties}>
              <p className="sheet-label">In the cup</p>
              <ul className="mt-2 space-y-1.5">
                {[...drink.layers].reverse().map((l) => (
                  <li key={l.name} className="flex items-center gap-2 text-sm">
                    <span aria-hidden className="h-3 w-3 shrink-0 rounded-full border border-black/15" style={{ background: l.color }} />
                    {l.name}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="sheet-body">
            <p className="sheet-label sheet-rise" style={{ "--i": 0 } as React.CSSProperties}>
              {project.featured ? "Signature drink" : "From the shelf"} · {project.category}
            </p>
            <h2 id="sheet-title" className="font-display sheet-rise mt-1 text-4xl leading-tight" style={{ "--i": 1 } as React.CSSProperties}>
              {project.title}
            </h2>
            <p className="sheet-rise mt-1 text-sm text-[#7a5a44]" style={{ "--i": 1 } as React.CSSProperties}>
              {project.role}
            </p>
            <p className="sheet-rise mt-4 text-lg leading-relaxed" style={{ "--i": 2 } as React.CSSProperties}>
              {project.pitch}
            </p>

            <div className="sheet-rise mt-5" style={{ "--i": 3 } as React.CSSProperties}>
              <p className="sheet-label">What I built</p>
              <ul className="mt-2 space-y-2">
                {project.description.map((line) => (
                  <li key={line} className="flex gap-2.5 text-[15px] leading-relaxed">
                    <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d0603f]" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <div className="sheet-rise mt-5" style={{ "--i": 4 } as React.CSSProperties}>
              <p className="sheet-label">Stack</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {project.techStack.map((t) => (
                  <li key={t} className="sheet-chip">
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {(project.demoUrl || project.repoUrl) && (
              <div className="sheet-rise mt-6 flex flex-wrap gap-3" style={{ "--i": 5 } as React.CSSProperties}>
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="sheet-action sheet-action-primary">
                    Live demo <External />
                  </a>
                )}
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="sheet-action">
                    <Code /> View code
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <footer className="sheet-footer">
          <button type="button" onClick={() => stepProject(-1)} className="sheet-nav" aria-label={`Previous project: ${prev?.title}`}>
            <ArrowLeft className="shrink-0" /> <span className="truncate">{prev?.title}</span>
          </button>
          <span className="text-xs tabular-nums text-[#7a5a44]">
            {index + 1} / {SHEET_ORDER.length}
          </span>
          <button type="button" onClick={() => stepProject(1)} className="sheet-nav justify-end" aria-label={`Next project: ${next?.title}`}>
            <span className="truncate">{next?.title}</span> <ArrowRight className="shrink-0" />
          </button>
        </footer>

        <button type="button" onClick={dismiss} className="sheet-close" aria-label="Close project">
          <Close size={18} />
        </button>
      </div>
    </dialog>
  );
}
