import { describe, expect, it } from "vitest";
import { requestShadowUpdate, takeShadowUpdate } from "./shadows";

describe("shadow update requests", () => {
  it("starts with a pending request so the first frame draws shadows", () => {
    expect(takeShadowUpdate()).toBe(true);
  });

  it("clears a request once it is taken", () => {
    requestShadowUpdate();
    expect(takeShadowUpdate()).toBe(true);
    expect(takeShadowUpdate()).toBe(false);
  });

  it("collapses several requests into one redraw", () => {
    requestShadowUpdate();
    requestShadowUpdate();
    expect(takeShadowUpdate()).toBe(true);
    expect(takeShadowUpdate()).toBe(false);
  });
});
