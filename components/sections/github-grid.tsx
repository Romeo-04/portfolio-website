"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Star, GitFork, ExternalLink, ArrowUpRight } from "lucide-react";
import { childVariants } from "@/components/section-reveal";
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
    <motion.a
      variants={childVariants}
      layout
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="surface-card group relative flex flex-col rounded-2xl p-5 transition-shadow hover:shadow-lg hover:shadow-primary-accent/10"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Github className="h-4 w-4 shrink-0 text-muted-foreground" />
          <h3 className="truncate text-base font-bold leading-tight">
            {repo.displayName}
          </h3>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <p className="mb-4 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-muted-foreground">
        {repo.description ?? "No description provided."}
      </p>

      {repo.topics.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="rounded-md border border-border bg-card px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      {/* Meta footer */}
      <div className="mt-auto flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: accent ?? "#8b949e" }}
            />
            {repo.language}
          </span>
        )}
        {repo.stars > 0 && (
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5" />
            {repo.stars}
          </span>
        )}
        {repo.forks > 0 && (
          <span className="flex items-center gap-1">
            <GitFork className="h-3.5 w-3.5" />
            {repo.forks}
          </span>
        )}
        <span className="ml-auto">Updated {formatUpdated(repo.pushedAt)}</span>
      </div>

      {repo.homepage && (
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
          className="mt-3 inline-flex w-fit items-center gap-1 rounded-lg border border-primary-accent/20 bg-primary-accent/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary-accent/20"
        >
          <ExternalLink className="h-3 w-3" />
          Live demo
        </span>
      )}
    </motion.a>
  );
}

export default function GithubGrid({ repos }: { repos: GithubRepo[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? repos : repos.slice(0, INITIAL_COUNT);

  return (
    <>
      <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </AnimatePresence>
      </motion.div>

      {repos.length > INITIAL_COUNT && (
        <motion.div variants={childVariants} className="mt-8 flex justify-center">
          <button
            onClick={() => setShowAll((v) => !v)}
            className="rounded-lg border border-border bg-secondary px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {showAll ? "Show less" : `Show all ${repos.length} repositories`}
          </button>
        </motion.div>
      )}
    </>
  );
}
