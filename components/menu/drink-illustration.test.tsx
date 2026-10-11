import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import DrinkIllustration from "@/components/menu/drink-illustration";
import { projectsData } from "@/data/portfolio";
import { drinkFor } from "@/lib/cafe/drinks";

describe("DrinkIllustration", () => {
  it("draws one band per layer and names the layers for screen readers", () => {
    const project = projectsData.find((p) => p.slug === "kislap")!;
    const html = renderToStaticMarkup(<DrinkIllustration project={project} />);
    const layers = drinkFor(project).layers;
    expect(html.match(/data-layer=/g)).toHaveLength(layers.length);
    expect(html).toContain(`aria-label="Kislap drink: ${layers.map((l) => l.name).join(", ")}"`);
  });
});

describe("DrinkIllustration clip ids", () => {
  it("gives two renders of the same project distinct clip ids that resolve", () => {
    const project = projectsData.find((p) => p.slug === "kislap")!;
    const html = renderToStaticMarkup(
      <>
        <DrinkIllustration project={project} />
        <DrinkIllustration project={project} />
      </>,
    );
    const ids = [...html.matchAll(/<clipPath id="([^"]+)"/g)].map((m) => m[1]);
    const refs = [...html.matchAll(/clip-path="url\(#([^)]+)\)"/g)].map((m) => m[1]);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
    for (const ref of refs) expect(ids).toContain(ref);
  });
});
