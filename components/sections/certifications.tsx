import { ExternalLink } from "lucide-react";
import SectionReveal, { SECTION_SHELL } from "@/components/section-reveal";
import SectionHeading from "@/components/section-heading";
import { certificationsData } from "@/data/portfolio";

export default function Certifications() {
  // Stays hidden until certifications are added to data/portfolio.ts. The
  // section registry and the orb navigator resolve against the DOM, so an
  // absent section is simply skipped rather than becoming a dead anchor.
  if (certificationsData.length === 0) return null;

  return (
    <SectionReveal id="certifications" className={SECTION_SHELL}>
      <SectionHeading
        num="07"
        title="Certifications"
        aside={`${certificationsData.length} CREDENTIALS`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certificationsData.map((cert) => (
          <article
            key={`${cert.issuer}-${cert.title}`}
            data-reveal-child
            className="bg-panel border-border lift-card flex flex-col rounded-2xl border p-5"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-beam font-mono text-[10px] tracking-[0.1em] uppercase">
                {cert.issuer}
              </span>
              <span className="text-ink-muted font-mono text-[10px] whitespace-nowrap">
                {cert.issued}
              </span>
            </div>

            <h3 className="mt-2.5 text-[15px] leading-snug font-bold">
              {cert.title}
            </h3>

            {cert.skills && cert.skills.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {cert.skills.map((skill) => (
                  <li
                    key={skill}
                    className="border-border text-ink-muted rounded-full border px-2 py-0.5 font-mono text-[10px]"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            )}

            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-beam hover:text-ink mt-4 inline-flex w-fit items-center gap-1.5 font-mono text-[10px] transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                SHOW CREDENTIAL
              </a>
            )}
          </article>
        ))}
      </div>
    </SectionReveal>
  );
}
