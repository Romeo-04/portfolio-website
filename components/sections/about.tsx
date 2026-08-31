import Image from "next/image";
import SectionReveal, { SECTION_SHELL } from "@/components/section-reveal";
import SectionHeading from "@/components/section-heading";
import { aboutData, personalInfo } from "@/data/portfolio";

export default function About() {
  const { studying, building, exploring, aimingFor } = aboutData.currently;

  const facts = [
    { label: "STUDYING", value: studying },
    { label: "BUILDING", value: building },
    { label: "EXPLORING", value: exploring },
    { label: "AIMING FOR", value: aimingFor },
  ];

  return (
    <SectionReveal id="about" className={SECTION_SHELL}>
      <SectionHeading num="01" title="About me" />

      <div className="grid items-start gap-12 lg:grid-cols-[340px_1fr] lg:gap-14">
        {/* Portrait with its own orbit ring */}
        <div
          data-reveal-child
          className="relative mx-auto h-[260px] w-[260px] sm:h-[340px] sm:w-[340px]"
        >
          <div
            aria-hidden
            className="animate-orbit border-beam/45 absolute -inset-6 rounded-full border border-dashed"
            style={{ animationDuration: "30s" }}
          >
            <div className="bg-beam absolute -top-[5px] left-1/2 h-2.5 w-2.5 rounded-full shadow-[0_0_14px_var(--beam)]" />
          </div>
          <Image
            src={personalInfo.heroImage}
            alt={personalInfo.name}
            width={340}
            height={340}
            priority
            className="border-beam h-full w-full rounded-full border-[3px] object-cover"
            style={{ boxShadow: "0 0 60px var(--glow-beam)" }}
          />
          <div className="bg-beam text-primary-foreground absolute right-0 bottom-1.5 rounded-full px-3.5 py-1.5 font-mono text-[11px] font-bold sm:-right-2">
            № 001
          </div>
        </div>

        <div>
          <p
            data-reveal-child
            className="text-ink-soft text-[17px] leading-relaxed text-pretty sm:text-[19px]"
          >
            {aboutData.bio[0]}
          </p>
          <p
            data-reveal-child
            className="text-ink-muted mt-4 text-[15px] leading-relaxed text-pretty sm:text-base"
          >
            {aboutData.bio[1]}
          </p>
          <p
            data-reveal-child
            className="text-ink-muted mt-4 text-[15px] leading-relaxed text-pretty sm:text-base"
          >
            {aboutData.bio[2]}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {facts.map(({ label, value }) => (
              <div
                key={label}
                data-reveal-child
                className="bg-panel border-border lift-card rounded-2xl border p-5"
              >
                <div className="text-beam font-mono text-[11px] tracking-[0.16em]">
                  {label}
                </div>
                <div className="mt-2 text-[15px] font-medium">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
