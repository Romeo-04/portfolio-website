"use client";

import { motion } from "framer-motion";
import { MapPin, BookOpen, Rocket, Compass, GraduationCap } from "lucide-react";
import SectionReveal, { childVariants } from "@/components/section-reveal";
import { aboutData, personalInfo } from "@/data/portfolio";

const currentItems = [
  {
    icon: BookOpen,
    label: "Studying",
    value: aboutData.currently.studying,
    color: "text-blue-500",
  },
  {
    icon: Rocket,
    label: "Building",
    value: aboutData.currently.building,
    color: "text-red-500",
  },
  {
    icon: Compass,
    label: "Exploring",
    value: aboutData.currently.exploring,
    color: "text-purple-500",
  },
  {
    icon: MapPin,
    label: "Aiming For",
    value: aboutData.currently.aimingFor,
    color: "text-amber-500",
  },
];

export default function About() {
  return (
    <SectionReveal
      id="about"
      className="rounded-3xl border border-border bg-card p-6 shadow-[0_18px_40px_-32px_rgba(23,42,99,0.35)] sm:p-8 lg:p-9"
    >
      {/* Section header */}
      <motion.div variants={childVariants} className="mb-10">
        <span className="text-[11px] font-bold tracking-[2px] text-primary-accent uppercase">
          About
        </span>
        <h2 className="font-display mt-2 text-[28px] font-extrabold tracking-tight">
          About Me
        </h2>
      </motion.div>

      <div className="grid gap-10 lg:grid-cols-5 lg:gap-10">
        {/* Bio */}
        <motion.div variants={childVariants} className="lg:col-span-3">
          <div className="space-y-4">
            {aboutData.bio.map((paragraph, i) => (
              <p key={i} className="text-[15px] leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Quick identity card */}
          <div className="surface-card mt-7 inline-flex items-center gap-4 rounded-[16px] px-5 py-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-accent">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">{personalInfo.program}</p>
              <p className="text-xs text-muted-foreground">
                {personalInfo.school}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Currently section */}
        <motion.div variants={childVariants} className="lg:col-span-2">
          <div className="surface-card rounded-2xl p-6">
            <h3 className="mb-5 flex items-center gap-2 text-sm font-bold tracking-widest text-muted-foreground uppercase">
              <span className="animate-glow-pulse inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Currently
            </h3>
            <div className="space-y-4">
              {currentItems.map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-card ${color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      {label}
                    </p>
                    <p className="text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </SectionReveal>
  );
}
