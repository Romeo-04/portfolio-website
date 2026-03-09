"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionReveal, { childVariants } from "@/components/section-reveal";
import { skillsData, typeColors } from "@/data/portfolio";

function SkillBar({
  name,
  level,
  barColor,
  delay,
  inView,
}: {
  name: string;
  level: number;
  barColor: string;
  delay: number;
  inView: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 truncate text-sm text-muted-foreground">
        {name}
      </span>
      <div className="stat-bar-track flex-1 bg-foreground/5">
        <motion.div
          className={`stat-bar-fill ${barColor}`}
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
    <SectionReveal id="skills" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <motion.div variants={childVariants} className="mb-16">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px w-8 bg-primary" />
            <span className="text-xs font-bold tracking-widest text-primary uppercase">
              Skills
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Tech Stack & Specializations
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Core competencies organized by domain — each representing a type
            affinity in my development toolkit.
          </p>
        </motion.div>

        {/* Skills grid */}
        <div
          ref={gridRef}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {skillsData.map((category, catIdx) => {
            const colors = typeColors[category.type];
            return (
              <motion.div
                key={category.title}
                variants={childVariants}
                className={`glass-card group rounded-2xl border p-6 transition-shadow hover:shadow-lg ${colors.border} ${colors.glow}`}
              >
                {/* Category header */}
                <div className="mb-5 flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors.bg}`}
                  >
                    <span className="text-base">{category.icon}</span>
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
                      barColor={colors.bar}
                      delay={catIdx * 0.08 + skillIdx * 0.05}
                      inView={inView}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionReveal>
  );
}
