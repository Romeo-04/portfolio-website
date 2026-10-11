import { describe, expect, it } from "vitest";
import { MAX_LAYERS, drinkFor } from "@/lib/cafe/drinks";

describe("drinkFor", () => {
  it("maps known technologies to named layers in stack order", () => {
    const drink = drinkFor({ title: "Kislap", techStack: ["Python", "React"] });
    expect(drink.layers.map((l) => l.name)).toEqual(["Espresso", "Steamed milk"]);
  });

  it("matches technologies case-insensitively", () => {
    const drink = drinkFor({ title: "X", techStack: ["python"] });
    expect(drink.layers[0].name).toBe("Espresso");
  });

  it("caps layers at MAX_LAYERS and drops duplicates", () => {
    const drink = drinkFor({
      title: "Big",
      techStack: ["Python", "Python", "React", "Vite", "Node.js", "Leaflet", "Express"],
    });
    expect(drink.layers).toHaveLength(MAX_LAYERS);
    expect(new Set(drink.layers.map((l) => l.name)).size).toBe(MAX_LAYERS);
  });

  it("gives unknown technologies a stable fallback colour", () => {
    const a = drinkFor({ title: "A", techStack: ["Streamlit"] });
    const b = drinkFor({ title: "B", techStack: ["Streamlit"] });
    expect(a.layers[0].name).toBe("Streamlit");
    expect(a.layers[0].color).toBe(b.layers[0].color);
  });

  it("still pours one layer for an empty stack", () => {
    const drink = drinkFor({ title: "Empty", techStack: [] });
    expect(drink.layers).toHaveLength(1);
  });

  it("lets a hand-picked override win", () => {
    const drink = drinkFor({
      title: "Custom",
      techStack: ["Python"],
      drink: { cup: "cup", layers: [{ name: "Ube", color: "#7b4fa0" }] },
    });
    expect(drink.cup).toBe("cup");
    expect(drink.layers).toEqual([{ name: "Ube", color: "#7b4fa0" }]);
  });

  it("uses the title's first letter as the foam mark", () => {
    expect(drinkFor({ title: "archeon", techStack: [] }).mark).toBe("A");
  });
});
