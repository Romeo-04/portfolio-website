import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { achievementName, achievementsData, githubExclude, projectsData, skillsData } from "@/data/portfolio";

describe("portfolio data", () => {
  it("has exactly the four signature drinks", () => {
    const signature = projectsData
      .filter((p) => p.featured)
      .map((p) => p.slug)
      .sort();
    expect(signature).toEqual([
      "cs-expo-2026",
      "homestead",
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

  it("puts Homestead and CS Expo first on the bar", () => {
    const bar = projectsData.filter((p) => p.featured).map((p) => p.slug);
    expect(bar.slice(0, 2)).toEqual(["homestead", "cs-expo-2026"]);
  });

  it("names each achievement once", () => {
    const names = achievementsData.map(achievementName);
    expect(new Set(names).size).toBe(names.length);
    expect(achievementName({ title: "Champion", event: "CyberXploit", year: "2026", description: "", tier: "gold" })).toBe("Champion — CyberXploit");
  });

  it("has a file in public/ for every screenshot", () => {
    for (const p of projectsData) {
      for (const shot of p.screenshots ?? []) {
        expect(existsSync(join(process.cwd(), "public", shot.src)), shot.src).toBe(true);
        expect(shot.alt.trim(), `${shot.src} alt text`).not.toBe("");
      }
    }
  });

  it("keeps the exclusion list lower-case", () => {
    for (const name of githubExclude) expect(name).toBe(name.toLowerCase());
  });
});
