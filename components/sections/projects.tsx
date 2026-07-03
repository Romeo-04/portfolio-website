"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Github,
  ChevronDown,
  Image as ImageIcon,
} from "lucide-react";
import SectionReveal, { childVariants } from "@/components/section-reveal";
import { projectsData, type Project } from "@/data/portfolio";

const categories = [
  "All",
  ...Array.from(new Set(projectsData.map((p) => p.category))),
];

function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  const entryNum = String(project.id).padStart(3, "0");

  return (
    <motion.div
      variants={childVariants}
      layout
      className="glass-card group relative overflow-hidden rounded-2xl border border-border transition-shadow hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Image placeholder */}
      <div className="relative aspect-video overflow-hidden bg-muted/30">
        <div className="flex h-full items-center justify-center">
          <ImageIcon className="h-10 w-10 text-muted-foreground/20" />
        </div>
        {/* Dex entry number */}
        <div className="absolute top-3 left-3 rounded-lg border border-border bg-background/80 px-2.5 py-1 font-mono text-xs font-bold backdrop-blur-sm">
          #{entryNum}
        </div>
        {/* Category tag */}
        <div className="absolute top-3 right-3 rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
          {project.category}
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold leading-tight">{project.title}</h3>
          {project.featured && (
            <span className="shrink-0 rounded-full bg-yellow-500/10 px-2 py-0.5 text-[10px] font-bold text-yellow-400 uppercase tracking-wider">
              ★ Featured
            </span>
          )}
        </div>

        <p className="mb-3 text-xs font-medium text-primary">
          {project.role}
        </p>

        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          {project.pitch}
        </p>

        {/* Tech stack */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Expandable details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <ul className="mb-4 space-y-1.5 border-t border-border pt-4">
                {project.description.map((point, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
          >
            {expanded ? "Less" : "Details"}
            <ChevronDown
              className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-colors hover:bg-accent"
              aria-label="GitHub Repository"
            >
              <Github className="h-3.5 w-3.5" />
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-colors hover:bg-accent"
              aria-label="Live Demo"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All"
      ? projectsData
      : projectsData.filter((p) => p.category === filter);

  return (
    <SectionReveal id="projects" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <motion.div variants={childVariants} className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px w-8 bg-primary" />
            <span className="text-xs font-bold tracking-widest text-primary uppercase">
              Projects
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Builds
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            A curated collection of projects — full-stack applications,
            intelligence systems, and creative engineering.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div variants={childVariants} className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === cat
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card/50 text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Project grid */}
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </SectionReveal>
  );
}
