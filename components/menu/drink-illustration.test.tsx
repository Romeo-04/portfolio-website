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
