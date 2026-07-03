// ============================================================
// GITHUB API INTEGRATION
// ============================================================
// Fetches public repositories live from the GitHub REST API and
// normalizes them for the portfolio's "From GitHub" section.
//
// Optional: set GITHUB_TOKEN in your environment (.env.local) to
// raise the API rate limit from 60 to 5,000 requests/hour. It is a
// classic PAT with NO scopes needed (public data only). The site
// works without it — it just falls back to the lower anon limit.
// ============================================================

export const GITHUB_USERNAME = "Romeo-04";

// Repos to hide from the auto-generated grid (config repo, throwaway
// practice/learning repos, coursework). Add slugs here to exclude them.
const EXCLUDED_REPOS = new Set<string>([
  GITHUB_USERNAME.toLowerCase(), // profile README config repo
  "learn-git",
  "my-first-repo",
  "webdev_practice",
  "github-copilot-practice",
]);

export interface GithubRepo {
  id: number;
  name: string;
  displayName: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  pushedAt: string;
}

interface RawRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}

function titleCase(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

/**
 * Fetch and normalize public repos for GITHUB_USERNAME.
 * Cached for 1 hour via Next.js data cache (`revalidate`).
 * Returns an empty array on any error so the section degrades gracefully.
 */
export async function getGithubRepos(): Promise<GithubRepo[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
      { headers, next: { revalidate: 3600 } },
    );

    if (!res.ok) return [];

    const raw: RawRepo[] = await res.json();

    return raw
      .filter(
        (r) =>
          !r.fork &&
          !r.archived &&
          !EXCLUDED_REPOS.has(r.name.toLowerCase()),
      )
      .map<GithubRepo>((r) => ({
        id: r.id,
        name: r.name,
        displayName: titleCase(r.name),
        description: r.description,
        url: r.html_url,
        homepage: r.homepage && r.homepage.trim() !== "" ? r.homepage : null,
        language: r.language,
        topics: r.topics ?? [],
        stars: r.stargazers_count,
        forks: r.forks_count,
        pushedAt: r.pushed_at,
      }))
      .sort(
        (a, b) =>
          b.stars - a.stars ||
          new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime(),
      );
  } catch {
    return [];
  }
}

// Dominant-language accent colors (GitHub's linguist palette, subset).
export const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  "C++": "#f34b7d",
  C: "#555555",
  Java: "#b07219",
  Kotlin: "#A97BFF",
  PHP: "#4F5D95",
  Vue: "#41b883",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Blade: "#f7523f",
  Shell: "#89e051",
  "Jupyter Notebook": "#DA5B0B",
};
