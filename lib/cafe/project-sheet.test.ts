import { afterEach, describe, expect, it, vi } from "vitest";
import { projectsData } from "@/data/portfolio";
import { SHEET_ORDER, closeProject, getSheet, openProject, stepProject, stepSlug, subscribeSheet } from "./project-sheet";

afterEach(() => closeProject());

describe("project sheet", () => {
  it("orders featured projects before the shelf", () => {
    const featured = projectsData.filter((p) => p.featured).length;
    SHEET_ORDER.forEach((slug, i) => {
      const p = projectsData.find((x) => x.slug === slug)!;
      expect(p.featured).toBe(i < featured);
    });
    expect(SHEET_ORDER).toHaveLength(projectsData.length);
  });

  it("opens with an origin and notifies subscribers", () => {
    const fn = vi.fn();
    const off = subscribeSheet(fn);
    openProject(SHEET_ORDER[0], { x: 1, y: 2, w: 3, h: 4 });
    expect(getSheet()).toEqual({ slug: SHEET_ORDER[0], origin: { x: 1, y: 2, w: 3, h: 4 } });
    expect(fn).toHaveBeenCalledTimes(1);
    off();
  });

  it("ignores unknown projects", () => {
    openProject("not-a-project");
    expect(getSheet()).toBeNull();
  });

  it("steps through projects and wraps at both ends", () => {
    const last = SHEET_ORDER[SHEET_ORDER.length - 1];
    expect(stepSlug(last, 1)).toBe(SHEET_ORDER[0]);
    expect(stepSlug(SHEET_ORDER[0], -1)).toBe(last);
    openProject(SHEET_ORDER[0], { x: 0, y: 0, w: 10, h: 10 });
    stepProject(1);
    expect(getSheet()).toEqual({ slug: SHEET_ORDER[1], origin: { x: 0, y: 0, w: 10, h: 10 } });
  });

  it("closes once", () => {
    const fn = vi.fn();
    const off = subscribeSheet(fn);
    openProject(SHEET_ORDER[0]);
    closeProject();
    closeProject();
    expect(getSheet()).toBeNull();
    expect(fn).toHaveBeenCalledTimes(2);
    off();
  });
});
