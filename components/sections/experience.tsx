"use client";

import { motion } from "framer-motion";
import { Briefcase, Shield } from "lucide-react";
import SectionReveal, { childVariants } from "@/components/section-reveal";
import { experienceData } from "@/data/portfolio";

export default function Experience() {
  return (
    <SectionReveal
      id="experience"
      className="rounded-3xl border border-border bg-card p-6 shadow-[0_18px_40px_-32px_rgba(23,42,99,0.35)] sm:p-8 lg:p-9"
    >
      {/* Section header */}
      <motion.div variants={childVariants} className="mb-10">
        <span className="text-[11px] font-bold tracking-[2px] text-primary-accent uppercase">
          Experience
        </span>
        <h2 className="font-display mt-2 text-[28px] font-extrabold tracking-tight">
          Leadership &amp; Evolution Path
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] text-muted-foreground">
          Key milestones in my journey — from academic foundations to leading
          engineering teams.
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-0 bottom-0 left-4 w-px bg-linear-to-b from-primary-accent/40 via-border to-transparent sm:left-8" />

        <div className="flex flex-col gap-10">
          {experienceData.map((exp, i) => (
            <motion.div
              key={i}
              variants={childVariants}
              className="relative pl-12 sm:pl-20"
            >
              {/* Timeline node */}
              <div className="absolute top-0 left-0 sm:left-4">
                <div className="relative flex h-8 w-8 items-center justify-center">
                  <div className="animate-glow-pulse absolute inset-0 rounded-full bg-primary-accent/20" />
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary-accent/40 bg-card">
                    <Shield className="h-3.5 w-3.5 text-primary-accent" />
                  </div>
                </div>
              </div>

              {/* Card */}
              <div className="surface-card rounded-2xl p-6">
                {/* Header */}
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{exp.title}</h3>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="h-3.5 w-3.5" />
                      {exp.organization}
                    </p>
                  </div>
                  <span className="rounded-full border border-primary-accent/25 bg-primary-accent/10 px-3 py-1 text-xs font-medium whitespace-nowrap text-primary">
                    {exp.period}
                  </span>
                </div>

                {/* Description */}
                <ul className="space-y-2">
                  {exp.description.map((point, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary-accent/60" />
                      {point}
                    </li>
                  ))}
                </ul>

                {/* Badge tag */}
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1">
                  <Shield className="h-3 w-3 text-amber-600" />
                  <span className="text-[10px] font-semibold tracking-wider text-amber-700 uppercase">
                    {exp.badge}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}
