// ============================================================
// TESTIMONIAL SHEET STORE
// ============================================================
// Which testimonial's card is open and where it was opened from (a person
// outside the café, or a card in the panel or menu), so the card can grow
// out of that spot. Same shape as the project sheet store.
// ============================================================

import { testimonialsData } from "@/data/portfolio";
import type { Origin } from "@/lib/cafe/project-sheet";

export type TestimonialState = { index: number; origin: Origin | null } | null;

let state: TestimonialState = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((fn) => fn());

export function getTestimonial(): TestimonialState {
  return state;
}

export function subscribeTestimonial(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Open testimonial `index`. Out-of-range indexes are ignored. */
export function openTestimonial(index: number, origin: Origin | null = null): void {
  if (!Number.isInteger(index) || index < 0 || index >= testimonialsData.length) return;
  state = { index, origin };
  emit();
}

export function closeTestimonial(): void {
  if (!state) return;
  state = null;
  emit();
}

/** Move to a neighbouring testimonial, wrapping around both ends. */
export function stepTestimonial(step: number): void {
  if (!state) return;
  const n = testimonialsData.length;
  state = { ...state, index: (((state.index + step) % n) + n) % n };
  emit();
}
