"use client";

import { useState } from "react";
import Image from "next/image";
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
      onMouseMove={(e) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "perspective(900px) rotateY(0deg) rotateX(0deg)";
      }}
      style={{ transition: "transform .15s ease", willChange: "transform" }}
      className="surface-card group relative overflow-hidden rounded-2xl transition-shadow hover:shadow-lg hover:shadow-primary-accent/10"
    >
      {/* Project image (falls back to an icon when no screenshot exists) */}
      <div className="relative aspect-video overflow-hidden bg-accent/40">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} screenshot`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageIcon className="h-10 w-10 text-muted-foreground/25" />
          </div>
        )}
        {/* Dex entry number */}
        <div className="absolute top-3 left-3 rounded-lg border border-border bg-card/90 px-2.5 py-1 font-mono text-xs font-bold backdrop-blur-sm">
          #{entryNum}
        </div>
        {/* Category tag */}
        <div className="absolute top-3 right-3 rounded-lg border border-primary-accent/20 bg-primary-accent/10 px-2.5 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
          {project.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold leading-tight">{project.title}</h3>
          {project.featured && (
            <span className="shrink-0 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-700 uppercase">
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
              className="rounded-md border border-border bg-card px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
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
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary-accent/60" />
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
            className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
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
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-accent"
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
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-accent"
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
    <SectionReveal
      id="projects"
      className="rounded-3xl border border-border bg-card p-6 shadow-[0_18px_40px_-32px_rgba(23,42,99,0.35)] sm:p-8 lg:p-9"
    >
      {/* Section header */}
      <motion.div variants={childVariants} className="mb-8">
        <span className="text-[11px] font-bold tracking-[2px] text-primary-accent uppercase">
          Projects
        </span>
        <h2 className="font-display mt-2 text-[28px] font-extrabold tracking-tight">
          Featured Builds
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] text-muted-foreground">
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
                ? "bg-linear-to-br from-primary to-primary-accent text-white"
                : "border border-border bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Project grid */}
      <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </AnimatePresence>
      </motion.div>
    </SectionReveal>
  );
}
