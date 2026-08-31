import SectionReveal, { SECTION_SHELL } from "@/components/section-reveal";
import SectionHeading from "@/components/section-heading";
import { achievementsData, type Achievement } from "@/data/portfolio";

// Presentation only — the underlying record is `tier`. These read better as
// a mono tag than "GOLD"/"BRONZE" would, and keep the palette to two accents.
const TIER: Record<Achievement["tier"], { tag: string; className: string }> = {
  gold: { tag: "HIGH HONOR", className: "text-beam" },
  silver: { tag: "MERIT", className: "text-ink-muted" },
  bronze: { tag: "PODIUM", className: "text-ink-muted" },
  special: { tag: "SCHOLAR", className: "text-ember" },
};

export default function Achievements() {
  return (
    <SectionReveal id="achievements" className={SECTION_SHELL}>
      <SectionHeading
        num="05"
        title="Honors & milestones"
        aside={`${achievementsData.length} TOTAL`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievementsData.map((item) => {
          const tier = TIER[item.tier];
          return (
            <article
              key={item.title}
              data-reveal-child
              className="bg-panel border-border lift-card rounded-2xl border p-5"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span
                  className={`font-mono text-[10px] tracking-[0.1em] ${tier.className}`}
                >
                  {tier.tag}
                </span>
                <span className="text-ink-muted font-mono text-[10px] whitespace-nowrap">
                  {item.year}
                </span>
              </div>

              <h3 className="mt-2.5 text-[15px] leading-snug font-bold">
                {item.title}
              </h3>
              <p className="text-ink-muted mt-2 text-[13px] leading-relaxed text-pretty">
                {item.description}
              </p>
            </article>
          );
        })}
      </div>
    </SectionReveal>
  );
}
