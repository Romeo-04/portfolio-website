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
    tierClass: string;
  }
> = {
  gold: {
    icon: Trophy,
    color: "text-yellow-700",
    bgColor: "bg-yellow-500/10",
    tierClass: "tier-gold",
  },
  silver: {
    icon: Award,
    color: "text-slate-600",
    bgColor: "bg-slate-500/10",
    tierClass: "tier-silver",
  },
  bronze: {
    icon: Star,
    color: "text-amber-700",
    bgColor: "bg-amber-600/10",
    tierClass: "tier-bronze",
  },
  special: {
    icon: Sparkles,
    color: "text-purple-700",
    bgColor: "bg-purple-500/10",
    tierClass: "tier-special",
  },
};

export default function Achievements() {
  return (
    <SectionReveal
      id="achievements"
      className="rounded-3xl border border-border bg-card p-6 shadow-[0_18px_40px_-32px_rgba(23,42,99,0.35)] sm:p-8 lg:p-9"
    >
      {/* Section header */}
      <motion.div variants={childVariants} className="mb-10">
        <span className="text-[11px] font-bold tracking-[2px] text-primary-accent uppercase">
          Achievements
        </span>
        <h2 className="font-display mt-2 text-[28px] font-extrabold tracking-tight">
          Badges &amp; Milestones
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] text-muted-foreground">
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
              className={`badge-glow surface-card group rounded-2xl p-5 transition-all ${tier.tierClass}`}
            >
              <div className="flex items-start gap-4">
                {/* Badge icon */}
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] ${tier.bgColor}`}
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
                    className={`mt-2 inline-block rounded-full ${tier.bgColor} px-2.5 py-0.5 text-[10px] font-semibold ${tier.color} tracking-wider uppercase`}
                  >
                    {achievement.year}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </SectionReveal>
  );
}
