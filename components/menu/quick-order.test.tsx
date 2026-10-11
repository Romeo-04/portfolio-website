import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import QuickOrderMenu from "@/components/menu/quick-order";
import {
  achievementsData,
  experienceData,
  personalInfo,
  projectsData,
  skillsData,
} from "@/data/portfolio";
import type { GithubRepo } from "@/lib/github";

const decode = (html: string) =>
  html.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');

describe("QuickOrderMenu", () => {
  const html = decode(renderToStaticMarkup(<QuickOrderMenu specials={[]} />));

  it("contains every project, role, skill and achievement as text", () => {
    for (const p of projectsData) expect(html).toContain(p.title);
    for (const e of experienceData) expect(html).toContain(e.title);
    for (const a of achievementsData) expect(html).toContain(a.title);
    for (const c of skillsData) for (const s of c.skills) expect(html).toContain(s.name);
  });

  it("contains the contact details", () => {
    expect(html).toContain(personalInfo.email);
    expect(html).toContain(personalInfo.github);
    expect(html).toContain(personalInfo.linkedin);
  });

  it("lists signature drinks before the shelf", () => {
    expect(html.indexOf('id="menu-drinks"')).toBeLessThan(html.indexOf('id="menu-shelf"'));
    const kislapAt = html.indexOf("Kislap");
    expect(kislapAt).toBeLessThan(html.indexOf('id="menu-shelf"'));
  });

  it("never renders an empty link", () => {
    expect(html).not.toContain('href=""');
  });

  it("shows sold out when there are no specials", () => {
    expect(html).toContain("Sold out");
  });

  it("lists specials when GitHub answers", () => {
    const repo: GithubRepo = {
      id: 1, name: "tessera", displayName: "Tessera", description: "A thing",
      url: "https://github.com/Romeo-04/tessera", homepage: null, language: "Python",
      topics: [], stars: 0, forks: 0, pushedAt: "2026-10-04T00:00:00Z",
    };
    const withRepo = renderToStaticMarkup(<QuickOrderMenu specials={[repo]} />);
    expect(withRepo).toContain("Tessera");
    expect(withRepo).not.toContain("Sold out");
  });
});
