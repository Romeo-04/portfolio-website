import { describe, expect, it } from "vitest";
import { drinkRepoNames, selectSpecials } from "@/lib/cafe/specials";
import type { GithubRepo } from "@/lib/github";

const repo = (name: string, pushedAt: string): GithubRepo => ({
  id: name.length,
  name,
  displayName: name,
  description: null,
  url: `https://github.com/Romeo-04/${name}`,
  homepage: null,
  language: null,
  topics: [],
  stars: 0,
  forks: 0,
  pushedAt,
});

describe("drinkRepoNames", () => {
  it("takes the user's own repo names from project links, lower-case", () => {
    expect(
      drinkRepoNames([
        { repoUrl: "https://github.com/Romeo-04/Kislap" },
        { repoUrl: "https://github.com/kishiagaytano/archeon" },
        { repoUrl: "" },
      ]),
    ).toEqual(["kislap"]);
  });

  it("keeps only the repo segment when the link has extra path or query", () => {
    expect(
      drinkRepoNames([
        { repoUrl: "https://github.com/Romeo-04/Kislap/tree/main" },
        { repoUrl: "https://github.com/Romeo-04/kislap.git" },
        { repoUrl: "https://github.com/Romeo-04/kislap?tab=readme" },
      ]),
    ).toEqual(["kislap", "kislap", "kislap"]);
  });
});

describe("selectSpecials", () => {
  const repos = [
    repo("old", "2025-01-01T00:00:00Z"),
    repo("kislap", "2026-10-10T00:00:00Z"),
    repo("tessera", "2026-10-04T00:00:00Z"),
    repo("sakto", "2026-09-05T00:00:00Z"),
  ];

  it("shows the most recently pushed first and hides drink repos", () => {
    expect(selectSpecials(repos, ["kislap"]).map((r) => r.name)).toEqual([
      "tessera",
      "sakto",
      "old",
    ]);
  });

  it("respects the limit", () => {
    expect(selectSpecials(repos, [], 2)).toHaveLength(2);
  });

  it("sorts a repo with an unparsable pushedAt after dated repos", () => {
    const withBadDate = [
      repo("broken", "not-a-date"),
      repo("dated", "2026-01-01T00:00:00Z"),
    ];
    expect(selectSpecials(withBadDate, []).map((r) => r.name)).toEqual([
      "dated",
      "broken",
    ]);
  });

  it("returns an empty list when GitHub returned nothing", () => {
    expect(selectSpecials([], ["kislap"])).toEqual([]);
  });
});
