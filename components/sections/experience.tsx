import SectionReveal, { SECTION_SHELL } from "@/components/section-reveal";
import SectionHeading from "@/components/section-heading";
import { experienceData } from "@/data/portfolio";

export default function Experience() {
  return (
    <SectionReveal id="experience" className={SECTION_SHELL}>
      <SectionHeading num="03" title="Experience & leadership" />

      <div className="flex flex-col">
        {experienceData.map((role) => (
          <article
            key={`${role.organization}-${role.title}`}
            data-reveal-child
            className="grid gap-4 border-b py-8 first:pt-0 sm:gap-8 md:grid-cols-[200px_1fr]"
            style={{ borderColor: "var(--hairline)" }}
          >
            <div>
              <div className="text-beam font-mono text-[11px] tracking-[0.08em] uppercase">
                {role.period}
              </div>
              <div className="text-ink-muted mt-1.5 font-mono text-[11px] uppercase">
                {role.organization}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold sm:text-[22px]">{role.title}</h3>
              <ul className="mt-3 max-w-[720px] space-y-2">
                {role.description.map((line) => (
                  <li
                    key={line}
                    className="text-ink-muted flex gap-3 text-[15px] leading-relaxed text-pretty"
                  >
                    <span aria-hidden className="text-beam mt-0.5 shrink-0">
                      ›
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </SectionReveal>
  );
}
