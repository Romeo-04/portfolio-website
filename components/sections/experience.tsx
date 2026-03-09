"use client";

import { motion } from "framer-motion";
import { Briefcase, Shield } from "lucide-react";
import SectionReveal, { childVariants } from "@/components/section-reveal";
import { experienceData } from "@/data/portfolio";

export default function Experience() {
  return (
    <SectionReveal id="experience" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <motion.div variants={childVariants} className="mb-16">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px w-8 bg-primary" />
            <span className="text-xs font-bold tracking-widest text-primary uppercase">
              Experience
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Leadership & Evolution Path
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Key milestones in my journey — from academic foundations to leading
            engineering teams.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-linear-to-b from-primary/40 via-border to-transparent sm:left-8" />

          <div className="flex flex-col gap-12">
            {experienceData.map((exp, i) => (
              <motion.div
                key={i}
                variants={childVariants}
                className="relative pl-12 sm:pl-20"
              >
                {/* Timeline node */}
                <div className="absolute left-0 top-0 sm:left-4">
                  <div className="relative flex h-8 w-8 items-center justify-center">
                    {/* Outer glow ring */}
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-glow-pulse" />
                    {/* Inner circle */}
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary/40 bg-background">
                      <Shield className="h-3.5 w-3.5 text-primary" />
                    </div>
                  </div>
                </div>

                {/* Card */}
                <div className="glass-card rounded-2xl border border-border p-6">
                  {/* Header */}
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{exp.title}</h3>
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="h-3.5 w-3.5" />
                        {exp.organization}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary whitespace-nowrap">
                        {exp.period}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <ul className="space-y-2">
                    {exp.description.map((point, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                        {point}
                      </li>
                    ))}
                  </ul>

                  {/* Badge tag */}
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/5 px-3 py-1">
                    <Shield className="h-3 w-3 text-yellow-400" />
                    <span className="text-[10px] font-semibold text-yellow-400 uppercase tracking-wider">
                      {exp.badge}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
