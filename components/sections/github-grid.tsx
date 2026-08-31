"use client";

import { useState } from "react";
import { Star, GitFork, ExternalLink, ArrowUpRight } from "lucide-react";
import { languageColors, type GithubRepo } from "@/lib/github";

const INITIAL_COUNT = 6;

function formatUpdated(iso: string): string {
  const then = new Date(iso).getTime();
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function RepoCard({ repo }: { repo: GithubRepo }) {
  const accent = repo.language ? languageColors[repo.language] : undefined;

  return (
    <a
      data-reveal-child
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-panel border-border lift-card group relative flex flex-col rounded-2xl border p-5"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="truncate text-[15px] leading-tight font-bold">
          {repo.displayName}
        </h3>
        <ArrowUpRight className="text-beam h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <p className="text-ink-muted mb-4 line-clamp-2 min-h-[2.5rem] text-[13px] leading-relaxed">
        {repo.description ?? "No description provided."}
      </p>

      {repo.topics.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="border-border text-ink-muted rounded-full border px-2 py-0.5 font-mono text-[10px]"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      <div
        className="text-ink-muted mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-3 font-mono text-[10px]"
        style={{ borderColor: "var(--hairline)" }}
      >
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: accent ?? "var(--ink-muted)" }}
            />
            {repo.language.toUpperCase()}
          </span>
        )}
        {repo.stars > 0 && (
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            {repo.stars}
          </span>
        )}
        {repo.forks > 0 && (
          <span className="flex items-center gap-1">
            <GitFork className="h-3 w-3" />
            {repo.forks}
          </span>
        )}
        <span className="ml-auto">{formatUpdated(repo.pushedAt)}</span>
      </div>

      {repo.homepage && (
        // Nested inside the card link, so this can't be an <a> — it opens the
        // demo itself and stops the outer navigation.
        <span
          role="link"
          tabIndex={0}
          onClick={(e) => {
            e.preventDefault();
            window.open(repo.homepage!, "_blank", "noopener,noreferrer");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              window.open(repo.homepage!, "_blank", "noopener,noreferrer");
            }
          }}
          className="border-beam/25 bg-beam/10 text-beam hover:bg-beam/20 mt-3 inline-flex w-fit cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[10px] transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          LIVE DEMO
        </span>
      )}
    </a>
  );
}

export default function GithubGrid({ repos }: { repos: GithubRepo[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? repos : repos.slice(0, INITIAL_COUNT);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>

      {repos.length > INITIAL_COUNT && (
        <div data-reveal-child className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="border-border text-ink-muted hover:border-beam hover:text-beam cursor-pointer rounded-full border px-6 py-3 font-mono text-[11px] tracking-[0.08em] transition-colors"
          >
            {showAll ? "SHOW LESS" : `SHOW ALL ${repos.length} REPOSITORIES`}
          </button>
        </div>
      )}
    </>
  );
}
