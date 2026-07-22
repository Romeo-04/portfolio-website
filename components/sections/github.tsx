import { Github } from "lucide-react";
import SectionReveal from "@/components/section-reveal";
import GithubGrid from "@/components/sections/github-grid";
import { getGithubRepos, GITHUB_USERNAME } from "@/lib/github";

// Server Component: fetches live repo data (cached 1h) and hands it to the
// client grid for animation/interaction.
export default async function GithubSection() {
  const repos = await getGithubRepos();

  if (repos.length === 0) return null; // graceful: hide on API failure

  return (
    <SectionReveal
      id="github"
      className="rounded-3xl border border-border bg-card p-6 shadow-[0_18px_40px_-32px_rgba(23,42,99,0.35)] sm:p-8 lg:p-9"
    >
      {/* Section header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-[2px] text-primary-accent uppercase">
            Open Source
          </span>
          <h2 className="font-display mt-2 text-[28px] font-extrabold tracking-tight">
            From GitHub
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] text-muted-foreground">
            Pulled live from my GitHub — public repositories, sorted by
            stars and recent activity.
          </p>
        </div>
        <a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <Github className="h-4 w-4" />@{GITHUB_USERNAME}
        </a>
      </div>

      <GithubGrid repos={repos} />
    </SectionReveal>
  );
}
