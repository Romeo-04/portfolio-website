import SectionReveal, { SECTION_SHELL } from "@/components/section-reveal";
import SectionHeading from "@/components/section-heading";
import GithubGrid from "@/components/sections/github-grid";
import { getGithubRepos, GITHUB_USERNAME } from "@/lib/github";

// Server Component: fetches live repo data (cached 1h) and hands it to the
// client grid for animation/interaction.
export default async function GithubSection() {
  const repos = await getGithubRepos();

  if (repos.length === 0) return null; // graceful: hide on API failure

  return (
    <SectionReveal id="github" className={SECTION_SHELL}>
      <SectionHeading
        num="06"
        title="From GitHub"
        aside={`${repos.length} PUBLIC REPOS`}
      />

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-ink-muted max-w-2xl text-[15px] leading-relaxed text-pretty">
          Pulled live from my GitHub — public repositories, sorted by stars and
          recent activity.
        </p>
        <a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="border-beam/50 text-beam hover:bg-beam hover:text-primary-foreground shrink-0 rounded-full border px-4 py-2 font-mono text-[11px] transition-colors"
        >
          @{GITHUB_USERNAME} ↗
        </a>
      </div>

      <GithubGrid repos={repos} />
    </SectionReveal>
  );
}
