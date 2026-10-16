"use client";

// ============================================================
// TESTIMONIAL SHEET
// ============================================================
// The card for one testimonial: who they are, how they know Jhezra, their
// words, and links to their own work. It grows out of the person outside
// the café (or the panel card) that was clicked, like the project sheet.
// ============================================================

import { useEffect, useSyncExternalStore } from "react";
import { useSheetMotion } from "@/components/cafe/sheet-motion";
import { ArrowLeft, ArrowRight, Close, External, Quote, User } from "@/components/ui/icons";
import { testimonialsData, type Testimonial } from "@/data/portfolio";
import { closeTestimonial, getTestimonial, stepTestimonial, subscribeTestimonial } from "@/lib/cafe/testimonial-sheet";

const originOfTestimonial = () => getTestimonial()?.origin ?? null;

/** Their photo, or a figure in their shirt colour until one is added. */
export function TestimonialAvatar({ t, size }: { t: Testimonial; size: number }) {
  if (t.photo) {
    // eslint-disable-next-line @next/next/no-img-element -- small static portrait
    return <img src={t.photo} alt="" width={size} height={size} className="testimonial-avatar" />;
  }
  return (
    <span aria-hidden className="testimonial-avatar" style={{ width: size, height: size, background: t.look.shirt }}>
      <User size={size * 0.55} />
    </span>
  );
}

export default function TestimonialSheet({ reduced }: { reduced: boolean }) {
  const shown = useSyncExternalStore(subscribeTestimonial, getTestimonial, () => null);
  const { dialog, card, dismiss } = useSheetMotion({
    open: shown !== null,
    origin: originOfTestimonial,
    reduced,
    onClosed: closeTestimonial,
  });

  useEffect(() => {
    if (!shown) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") stepTestimonial(1);
      else if (e.key === "ArrowLeft") stepTestimonial(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shown]);

  if (!shown) return null;
  const t = testimonialsData[shown.index];
  if (!t) return null;
  const n = testimonialsData.length;

  return (
    <dialog
      ref={dialog}
      aria-labelledby="testimonial-title"
      className="sheet-dialog"
      onCancel={(e) => {
        e.preventDefault();
        dismiss();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) dismiss();
      }}
    >
      <div ref={card} className="sheet-card testimonial-card" data-lenis-prevent>
        <div key={shown.index} className="testimonial-body">
          <div className="sheet-rise flex items-center gap-4" style={{ "--i": 0 } as React.CSSProperties}>
            <TestimonialAvatar t={t} size={76} />
            <div className="min-w-0">
              <p className="sheet-label">{t.placeholder ? "Coming soon" : "From a regular"}</p>
              <h2 id="testimonial-title" className="font-display mt-0.5 text-3xl leading-tight">
                {t.name}
              </h2>
              <p className="text-sm text-[var(--ink-muted)]">
                {t.role} · {t.organization}
              </p>
            </div>
          </div>

          <blockquote className="testimonial-quote sheet-rise" style={{ "--i": 1 } as React.CSSProperties}>
            <Quote size={30} className="testimonial-mark" />
            <p>{t.quote}</p>
          </blockquote>

          <dl className="sheet-rise testimonial-facts" style={{ "--i": 2 } as React.CSSProperties}>
            <div>
              <dt>How we know each other</dt>
              <dd>{t.relationship}</dd>
            </div>
            <div>
              <dt>Their usual</dt>
              <dd>{t.order}</dd>
            </div>
          </dl>

          {(t.portfolioUrl || t.linkedinUrl) && (
            <div className="sheet-rise mt-6 flex flex-wrap gap-3" style={{ "--i": 3 } as React.CSSProperties}>
              {t.portfolioUrl && (
                <a href={t.portfolioUrl} target="_blank" rel="noopener noreferrer" className="sheet-action sheet-action-primary">
                  Their portfolio <External />
                </a>
              )}
              {t.linkedinUrl && (
                <a href={t.linkedinUrl} target="_blank" rel="noopener noreferrer" className="sheet-action">
                  LinkedIn <External />
                </a>
              )}
            </div>
          )}
        </div>

        {n > 1 && (
          <footer className="sheet-footer">
            <button type="button" onClick={() => stepTestimonial(-1)} className="sheet-nav" aria-label="Previous testimonial">
              <ArrowLeft className="shrink-0" /> Previous
            </button>
            <span className="text-xs tabular-nums text-[var(--ink-muted)]">
              {shown.index + 1} / {n}
            </span>
            <button type="button" onClick={() => stepTestimonial(1)} className="sheet-nav justify-end" aria-label="Next testimonial">
              Next <ArrowRight className="shrink-0" />
            </button>
          </footer>
        )}

        <button type="button" onClick={dismiss} className="sheet-close" aria-label="Close testimonial">
          <Close size={18} />
        </button>
      </div>
    </dialog>
  );
}
