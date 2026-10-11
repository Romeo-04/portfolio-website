import { describe, expect, it } from "vitest";
import { githubExclude, projectsData, skillsData } from "@/data/portfolio";

describe("portfolio data", () => {
  it("has exactly the four signature drinks", () => {
    const signature = projectsData
      .filter((p) => p.featured)
      .map((p) => p.slug)
      .sort();
    expect(signature).toEqual([
      "archeon",
      "citysense-live-geo",
      "kislap",
      "kitako",
    ]);
  });

  it("has unique slugs", () => {
    const slugs = projectsData.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("puts every skill in a tier and has no numeric levels", () => {
    for (const category of skillsData) {
      for (const skill of category.skills) {
        expect(["house", "seasonal", "experimental"]).toContain(skill.tier);
        expect(skill).not.toHaveProperty("level");
      }
    }
  });

  it("gives Archeon its live demo and lead role", () => {
    const archeon = projectsData.find((p) => p.slug === "archeon");
    expect(archeon?.demoUrl).toBe("https://kishiagaytano.github.io/archeon/");
    expect(archeon?.role).toBe("Lead Developer · Cognee hackathon team of 4");
  });

  it("adds Kislap as a team-led project with both links", () => {
    const kislap = projectsData.find((p) => p.slug === "kislap");
    expect(kislap?.role).toBe("Lead Developer · team of 4");
    expect(kislap?.demoUrl).toBe("https://romeo-04.github.io/kislap/");
    expect(kislap?.repoUrl).toBe("https://github.com/Romeo-04/kislap");
  });

  it("keeps the exclusion list lower-case", () => {
    for (const name of githubExclude) expect(name).toBe(name.toLowerCase());
  });
});
