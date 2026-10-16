"use client";

// ============================================================
// SHEET MOTION
// ============================================================
// The pop-up motion shared by the project and testimonial sheets: the card
// grows out of whatever was clicked and shrinks back into it on close,
// while the backdrop fades. Reduced motion just fades.
// ============================================================

import { useCallback, useLayoutEffect, useRef } from "react";
import type { Origin } from "@/lib/cafe/project-sheet";

const EASE_OUT = "cubic-bezier(0.2, 0.9, 0.25, 1)";
const EASE_IN = "cubic-bezier(0.5, 0, 0.75, 0.2)";

/** The transform that puts the sheet's box over the origin rect. */
function fromOrigin(sheet: DOMRect, origin: Origin): string {
  const dx = origin.x + origin.w / 2 - (sheet.left + sheet.width / 2);
  const dy = origin.y + origin.h / 2 - (sheet.top + sheet.height / 2);
  const s = Math.max(0.08, Math.min(origin.w / sheet.width, origin.h / sheet.height));
  return `translate(${dx}px, ${dy}px) scale(${s})`;
}

/**
 * `open` is true while the store holds a sheet; `origin()` reads where it
 * was opened from; `onClosed` clears the store once the exit animation ends.
 */
export function useSheetMotion({
  open,
  origin,
  reduced,
  onClosed,
}: {
  open: boolean;
  origin: () => Origin | null;
  reduced: boolean;
  onClosed: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const closing = useRef(false);

  // Grow in from the origin when the sheet first opens.
  useLayoutEffect(() => {
    const d = dialog.current;
    const c = card.current;
    if (!open || !d || !c || d.open) return;
    d.showModal();
    closing.current = false;
    const from = origin();
    const end = { transform: "none", opacity: 1 };
    const start =
      reduced || !from
        ? { transform: reduced ? "none" : "translateY(24px) scale(0.97)", opacity: 0 }
        : { transform: fromOrigin(c.getBoundingClientRect(), from), opacity: 0.2 };
    c.animate([start, end], { duration: reduced ? 160 : 480, easing: EASE_OUT });
    d.animate([{ backgroundColor: "rgb(27 18 12 / 0)" }, { backgroundColor: "rgb(27 18 12 / 0.55)" }], {
      duration: reduced ? 160 : 360,
      fill: "forwards",
    });
  }, [open, origin, reduced]);

  // Shrink back into the origin, then really close.
  const dismiss = useCallback(() => {
    const d = dialog.current;
    const c = card.current;
    if (!d || !c || closing.current) return;
    closing.current = true;
    const to = origin();
    const end =
      reduced || !to
        ? { transform: reduced ? "none" : "translateY(16px) scale(0.98)", opacity: 0 }
        : { transform: fromOrigin(c.getBoundingClientRect(), to), opacity: 0 };
    const duration = reduced ? 120 : 300;
    d.animate([{ backgroundColor: "rgb(27 18 12 / 0.55)" }, { backgroundColor: "rgb(27 18 12 / 0)" }], {
      duration,
      fill: "forwards",
    });
    c.animate([{ transform: "none", opacity: 1 }, end], { duration, easing: EASE_IN, fill: "forwards" }).onfinish = () => {
      d.close();
      onClosed();
    };
  }, [origin, reduced, onClosed]);

  return { dialog, card, dismiss };
}
