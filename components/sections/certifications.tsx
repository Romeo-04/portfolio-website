"use client";

import { motion } from "framer-motion";
import { BadgeCheck, ExternalLink } from "lucide-react";
import SectionReveal, { childVariants } from "@/components/section-reveal";
import { certificationsData } from "@/data/portfolio";
import { personalInfo } from "@/data/portfolio";

export default function Certifications() {
  // Stays hidden until you paste certifications into certificationsData
  // (see data/portfolio.ts — LinkedIn can't be scraped programmatically).
  if (certificationsData.length === 0) return null;

  return (
    <SectionReveal
      id="certifications"
      className="rounded-3xl border border-border bg-card p-6 shadow-[0_18px_40px_-32px_rgba(23,42,99,0.35)] sm:p-8 lg:p-9"
    >
      {/* Section header */}
      <motion.div variants={childVariants} className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-[2px] text-primary-accent uppercase">
            Credentials
          </span>
          <h2 className="font-display mt-2 text-[28px] font-extrabold tracking-tight">
            Licenses &amp; Certifications
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] text-muted-foreground">
            Professional certifications and completed programs.
          </p>
        </div>
        <a
          href={personalInfo.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ExternalLink className="h-4 w-4" />
          View on LinkedIn
        </a>
      </motion.div>

      {/* Certification grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certificationsData.map((cert, i) => (
          <motion.div
            key={i}
            variants={childVariants}
            className="surface-card group flex flex-col rounded-2xl p-5 transition-shadow hover:shadow-lg hover:shadow-primary-accent/10"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-primary-accent/10">
                <BadgeCheck className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold leading-tight">
                  {cert.title}
                </h3>
                <p className="mt-1 text-xs font-medium text-primary">
                  {cert.issuer}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Issued {cert.issued}
                  {cert.credentialId ? ` · ID ${cert.credentialId}` : ""}
                </p>
              </div>
            </div>

            {cert.skills && cert.skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {cert.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-border bg-card px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-fit items-center gap-1 rounded-lg border border-primary-accent/20 bg-primary-accent/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary-accent/20"
              >
                <ExternalLink className="h-3 w-3" />
                Show credential
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </SectionReveal>
  );
}
