"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionReveal, { childVariants } from "@/components/section-reveal";
import { skillsData, typeColors } from "@/data/portfolio";

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
          Core competencies organized by domain — each representing a type
          affinity in my development toolkit.
        </p>
      </motion.div>

      {/* Skills grid */}
      <div ref={gridRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillsData.map((category, catIdx) => {
          const colors = typeColors[category.type];
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
                  <span className="text-lg">{category.icon}</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold">{category.title}</h3>
                  <p
                    className={`text-[10px] font-semibold tracking-wider uppercase ${colors.text}`}
                  >
                    {category.type} type
                  </p>
                </div>
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
