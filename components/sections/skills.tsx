import SectionReveal, { SECTION_SHELL } from "@/components/section-reveal";
import SectionHeading from "@/components/section-heading";
import { skillsData } from "@/data/portfolio";

export default function Skills() {
  return (
    <SectionReveal id="skills" className={SECTION_SHELL}>
      <SectionHeading
        num="02"
        title="Stack & specializations"
        aside={`${skillsData.length} CATEGORIES`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillsData.map((category, i) => (
          <div
            key={category.title}
            data-reveal-child
            className="bg-panel border-border lift-card rounded-2xl border p-6"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-[17px] font-bold">{category.title}</h3>
              <span className="text-beam font-mono text-[13px]">
                {String(i + 1).padStart(3, "0")}
              </span>
            </div>

            <ul className="mt-4 flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <li
                  key={skill.name}
                  className="border-border text-ink-soft rounded-full border px-3 py-1.5 font-mono text-[11px]"
                >
                  {skill.name} <span className="text-beam">{skill.level}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionReveal>
  );
}
