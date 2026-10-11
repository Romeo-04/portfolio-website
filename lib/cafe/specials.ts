import type { Project } from "@/data/portfolio";
import { GITHUB_USERNAME, type GithubRepo } from "@/lib/github";

// "Fresh from the oven": the most recently pushed repos that are not
// already on the menu as drinks (spec 2.4). The general exclusion list is
// applied earlier, in getGithubRepos.

export const SPECIALS_LIMIT = 6;

export function drinkRepoNames(projects: Pick<Project, "repoUrl">[]): string[] {
  const prefix = `https://github.com/${GITHUB_USERNAME}/`.toLowerCase();
  return projects
    .map((p) => p.repoUrl.toLowerCase())
    .filter((url) => url.startsWith(prefix))
    .map((url) => url.slice(prefix.length).replace(/\/+$/, ""));
}

export function selectSpecials(
  repos: GithubRepo[],
  exclude: string[],
  limit = SPECIALS_LIMIT,
): GithubRepo[] {
  const hidden = new Set(exclude.map((n) => n.toLowerCase()));
  return repos
    .filter((r) => !hidden.has(r.name.toLowerCase()))
    .sort((a, b) => Date.parse(b.pushedAt) - Date.parse(a.pushedAt))
    .slice(0, limit);
}
