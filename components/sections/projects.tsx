"use client";

import { useState } from "react";
import Image from "next/image";
import SectionReveal, { SECTION_SHELL } from "@/components/section-reveal";
import SectionHeading from "@/components/section-heading";
import { projectsData, type Project } from "@/data/portfolio";

const INITIAL_COUNT = 6;

// Featured builds lead; everything else follows in data order.
const ORDERED = [...projectsData].sort(
  (a, b) => Number(b.featured) - Number(a.featured),
);

function ProjectCard({ project, rank }: { project: Project; rank: number }) {
  const href = project.demoUrl || project.repoUrl;
  const num = String(rank).padStart(3, "0");

  const body = (
    <>
      <div
        className="relative h-[200px] overflow-hidden sm:h-[230px]"
        style={{
          background:
            "linear-gradient(135deg, var(--panel-raised), var(--accent))",
        }}
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} screenshot`}
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            className="object-cover object-top"
          />
        ) : (
          <div className="text-beam/18 absolute inset-0 flex items-center justify-center text-[110px] leading-none font-bold">
            {num}
          </div>
        )}

        <span className="bg-beam text-primary-foreground absolute top-3.5 left-3.5 rounded-full px-3 py-1 font-mono text-[11px] font-bold">
          #{num}
        </span>
        <span className="bg-void/85 text-beam absolute top-3.5 right-3.5 rounded-full px-3 py-1 font-mono text-[10px] tracking-wide uppercase">
          {project.category}
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[19px] leading-tight font-bold sm:text-[21px]">
            {project.title}
          </h3>
          <span className="text-ink-muted shrink-0 font-mono text-[10px] whitespace-nowrap uppercase">
            {project.role}
          </span>
        </div>

        <p className="text-ink-muted mt-2.5 text-sm leading-relaxed text-pretty">
          {project.pitch}
        </p>

        <p className="text-beam mt-4 font-mono text-[10px] tracking-[0.08em] uppercase">
          {project.techStack.join(" · ")}
        </p>
      </div>
    </>
  );

  const shell =
    "bg-panel border-border lift-card block overflow-hidden rounded-[18px] border";

  // Two projects have neither a demo nor a public repo — those render as
  // plain cards rather than links that go nowhere.
  return href ? (
    <a
      data-reveal-child
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={shell}
    >
      {body}
    </a>
  ) : (
    <div data-reveal-child className={shell}>
      {body}
    </div>
  );
}

export default function Projects() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? ORDERED : ORDERED.slice(0, INITIAL_COUNT);

  return (
    <SectionReveal id="projects" className={SECTION_SHELL}>
      <SectionHeading num="04" title="Featured builds" aside="SORTED BY RANK" />

      <div className="grid gap-5 md:grid-cols-2">
        {visible.map((project, i) => (
          <ProjectCard key={project.id} project={project} rank={i + 1} />
        ))}
      </div>

      {ORDERED.length > INITIAL_COUNT && (
        <div data-reveal-child className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="border-border text-ink-muted hover:border-beam hover:text-beam cursor-pointer rounded-full border px-6 py-3 font-mono text-[11px] tracking-[0.08em] transition-colors"
          >
            {showAll ? "SHOW LESS" : `SHOW ALL ${ORDERED.length} BUILDS`}
          </button>
        </div>
      )}
    </SectionReveal>
  );
}
