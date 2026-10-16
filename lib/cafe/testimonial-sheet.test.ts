import { afterEach, describe, expect, it } from "vitest";
import { testimonialsData } from "@/data/portfolio";
import { closeTestimonial, getTestimonial, openTestimonial, stepTestimonial, subscribeTestimonial } from "@/lib/cafe/testimonial-sheet";

afterEach(() => closeTestimonial());

describe("testimonial sheet store", () => {
  it("opens a testimonial with its origin and tells subscribers", () => {
    let calls = 0;
    const off = subscribeTestimonial(() => calls++);
    openTestimonial(1, { x: 1, y: 2, w: 3, h: 4 });
    expect(getTestimonial()).toEqual({ index: 1, origin: { x: 1, y: 2, w: 3, h: 4 } });
    expect(calls).toBe(1);
    off();
  });

  it("ignores indexes outside the list", () => {
    openTestimonial(-1);
    openTestimonial(testimonialsData.length);
    openTestimonial(0.5);
    expect(getTestimonial()).toBeNull();
  });

  it("steps and wraps around both ends", () => {
    openTestimonial(0);
    stepTestimonial(-1);
    expect(getTestimonial()?.index).toBe(testimonialsData.length - 1);
    stepTestimonial(1);
    expect(getTestimonial()?.index).toBe(0);
  });
});
