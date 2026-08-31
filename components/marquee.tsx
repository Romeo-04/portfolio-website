import { achievementsData, projectsData } from "@/data/portfolio";

/**
 * The band that separates the hero from the body of the page. Pure CSS
 * animation, so it stays a Server Component — and it stops entirely under
 * prefers-reduced-motion (see .animate-marquee in globals.css).
 */
export default function Marquee() {
  const items = [
    "WEB DEVELOPMENT",
    "MACHINE LEARNING",
    "FULL-STACK",
    "LEADERSHIP",
    `${projectsData.length} PROJECTS SHIPPED`,
    `${achievementsData.length} HONORS`,
    "400+ USERS SERVED",
  ];

  const strip = items.join(" ✦ ") + " ✦ ";

  return (
    <div className="border-beam/40 bg-panel text-ink relative z-1 overflow-hidden border-y py-3">
      <div className="animate-marquee flex w-max font-mono text-xs tracking-[0.15em] whitespace-nowrap sm:text-sm">
        {/* Duplicated so the -50% translate loops seamlessly. */}
        <span aria-hidden="false" className="pr-8">
          {strip}
        </span>
        <span aria-hidden className="pr-8">
          {strip}
        </span>
      </div>
    </div>
  );
}
