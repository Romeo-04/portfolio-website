"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Code2,
  LayoutGrid,
  Server,
  Database,
  BrainCircuit,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import SectionReveal, { childVariants } from "@/components/section-reveal";
import { skillsData, categoryColors, type CategoryIcon } from "@/data/portfolio";

const categoryIcons: Record<CategoryIcon, LucideIcon> = {
  code: Code2,
  layout: LayoutGrid,
  server: Server,
  database: Database,
  brain: BrainCircuit,
  wrench: Wrench,
};

function SkillBar({
  name,
  level,
  delay,
  inView,
}: {
  name: string;
  level: number;
  delay: number;
  inView: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 truncate text-sm text-muted-foreground">
        {name}
      </span>
      <div className="stat-bar-track flex-1">
        <motion.div
          className="stat-bar-fill"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: level / 100 } : { scaleX: 0 }}
          transition={{
            duration: 0.8,
            delay,
            ease: [0.25, 0.4, 0.25, 1],
          }}
        />
      </div>
      <span className="w-7 text-right font-mono text-xs text-muted-foreground">
        {level}
      </span>
    </div>
  );
}

export default function Skills() {
  const gridRef = useRef(null);
  const inView = useInView(gridRef, { once: true, amount: 0.2 });

  return (
    <SectionReveal
      id="skills"
      className="rounded-3xl border border-border bg-card p-6 shadow-[0_18px_40px_-32px_rgba(23,42,99,0.35)] sm:p-8 lg:p-9"
    >
      {/* Section header */}
      <motion.div variants={childVariants} className="mb-10">
        <span className="text-[11px] font-bold tracking-[2px] text-primary-accent uppercase">
          Skills
        </span>
        <h2 className="font-display mt-2 text-[28px] font-extrabold tracking-tight">
          Tech Stack &amp; Specializations
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] text-muted-foreground">
          Core competencies organized by domain, from languages to tooling.
        </p>
      </motion.div>

      {/* Skills grid */}
      <div ref={gridRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillsData.map((category, catIdx) => {
          const colors = categoryColors[category.color];
          const Icon = categoryIcons[category.icon];
          return (
            <motion.div
              key={category.title}
              variants={childVariants}
              className="surface-card group rounded-2xl p-6 transition-shadow hover:shadow-lg"
            >
              {/* Category header */}
              <div className="mb-5 flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-[14px] ${colors.bg}`}
                >
                  <Icon className={`h-5 w-5 ${colors.text}`} />
                </div>
                <h3 className="text-sm font-bold">{category.title}</h3>
              </div>

              {/* Skill bars */}
              <div className="flex flex-col gap-2.5">
                {category.skills.map((skill, skillIdx) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    delay={catIdx * 0.08 + skillIdx * 0.05}
                    inView={inView}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </SectionReveal>
  );
}
