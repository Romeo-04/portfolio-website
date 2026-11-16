import { describe, expect, it } from "vitest";
import { packLines } from "@/lib/cafe/lines";

describe("packLines", () => {
  it("packs names onto a line until the next one would not fit", () => {
    expect(packLines(["Python", "TypeScript", "JavaScript", "SQL"], 20)).toEqual(["Python · TypeScript", "JavaScript · SQL"]);
  });

  it("gives a name longer than a line a line of its own", () => {
    expect(packLines(["Git", "Prompt & harness engineering", "ONNX"], 20)).toEqual(["Git", "Prompt & harness engineering", "ONNX"]);
  });

  it("keeps every name, in order", () => {
    const names = ["C++", "Dart", "Flutter", "FastAPI", "PyTorch", "ONNX"];
    expect(packLines(names, 20).join(" · ").split(" · ")).toEqual(names);
  });

  it("returns no lines for no names", () => {
    expect(packLines([], 20)).toEqual([]);
  });
});
