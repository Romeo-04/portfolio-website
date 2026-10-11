import { describe, expect, it } from "vitest";
import { resolveMode } from "@/lib/cafe/mode";

describe("resolveMode", () => {
  it("closes the café without WebGL, even if the visitor asked to enter", () => {
    expect(resolveMode({ webgl: false, phone: false, entered: false })).toBe("closed");
    expect(resolveMode({ webgl: false, phone: true, entered: true })).toBe("closed");
  });
  it("shows the menu on phones until the visitor steps inside", () => {
    expect(resolveMode({ webgl: true, phone: true, entered: false })).toBe("menu");
    expect(resolveMode({ webgl: true, phone: true, entered: true })).toBe("cafe");
  });
  it("opens the café on desktop", () => {
    expect(resolveMode({ webgl: true, phone: false, entered: false })).toBe("cafe");
  });
});
