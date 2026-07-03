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
    <SectionReveal id="github" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <div className="mb-12">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Open Source
            </span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                From GitHub
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Pulled live from my GitHub — public repositories, sorted by
                stars and recent activity.
              </p>
            </div>
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
            >
              <Github className="h-4 w-4" />@{GITHUB_USERNAME}
            </a>
          </div>
        </div>

        <GithubGrid repos={repos} />
      </div>
    </SectionReveal>
  );
}
