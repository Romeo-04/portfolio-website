"use client";

import { motion } from "framer-motion";
import { Trophy, Star, Award, Sparkles } from "lucide-react";
import SectionReveal, { childVariants } from "@/components/section-reveal";
import { achievementsData, type Achievement } from "@/data/portfolio";

const tierConfig: Record<
  Achievement["tier"],
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    borderColor: string;
    tierClass: string;
  }
> = {
  gold: {
    icon: Trophy,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    tierClass: "tier-gold",
  },
  silver: {
    icon: Award,
    color: "text-slate-300",
    bgColor: "bg-slate-400/10",
    borderColor: "border-slate-400/20",
    tierClass: "tier-silver",
  },
  bronze: {
    icon: Star,
    color: "text-amber-600",
    bgColor: "bg-amber-600/10",
    borderColor: "border-amber-600/20",
    tierClass: "tier-bronze",
  },
  special: {
    icon: Sparkles,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    tierClass: "tier-special",
  },
};

export default function Achievements() {
  return (
    <SectionReveal id="achievements" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <motion.div variants={childVariants} className="mb-16">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px w-8 bg-primary" />
            <span className="text-xs font-bold tracking-widest text-primary uppercase">
              Achievements
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Badges & Milestones
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Academic honors, competition placements, and recognitions earned
            along the journey.
          </p>
        </motion.div>

        {/* Badges grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievementsData.map((achievement, i) => {
            const tier = tierConfig[achievement.tier];
            const Icon = tier.icon;

            return (
              <motion.div
                key={i}
                variants={childVariants}
                className={`badge-glow glass-card group rounded-2xl border p-5 transition-all ${tier.borderColor} ${tier.tierClass}`}
              >
                <div className="flex items-start gap-4">
                  {/* Badge icon */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tier.bgColor}`}
                  >
                    <Icon className={`h-5 w-5 ${tier.color}`} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold leading-tight">
                      {achievement.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                    <span
                      className={`mt-2 inline-block rounded-full ${tier.bgColor} px-2.5 py-0.5 text-[10px] font-semibold ${tier.color} uppercase tracking-wider`}
                    >
                      {achievement.year}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionReveal>
  );
}
