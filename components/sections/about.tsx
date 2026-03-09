"use client";

import { motion } from "framer-motion";
import { MapPin, BookOpen, Rocket, Compass } from "lucide-react";
import SectionReveal, { childVariants } from "@/components/section-reveal";
import { aboutData, personalInfo } from "@/data/portfolio";

const currentItems = [
  {
    icon: BookOpen,
    label: "Studying",
    value: aboutData.currently.studying,
    color: "text-blue-400",
  },
  {
    icon: Rocket,
    label: "Building",
    value: aboutData.currently.building,
    color: "text-red-400",
  },
  {
    icon: Compass,
    label: "Exploring",
    value: aboutData.currently.exploring,
    color: "text-purple-400",
  },
  {
    icon: MapPin,
    label: "Aiming For",
    value: aboutData.currently.aimingFor,
    color: "text-yellow-400",
  },
];

export default function About() {
  return (
    <SectionReveal id="about" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <motion.div variants={childVariants} className="mb-16">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px w-8 bg-primary" />
            <span className="text-xs font-bold tracking-widest text-primary uppercase">
              About
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            About Me
          </h2>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Bio */}
          <motion.div variants={childVariants} className="lg:col-span-3">
            <div className="space-y-4">
              {aboutData.bio.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-base leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Quick identity card */}
            <div className="mt-8 glass-card inline-flex items-center gap-4 rounded-xl px-5 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <span className="text-lg">🎓</span>
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
            <div className="glass-card rounded-2xl p-6">
              <h3 className="mb-5 flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-muted-foreground">
                <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-glow-pulse" />
                Currently
              </h3>
              <div className="space-y-4">
                {currentItems.map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground/5 ${color}`}
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
      </div>
    </SectionReveal>
  );
}
