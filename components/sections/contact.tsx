"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import SectionReveal, { SECTION_SHELL } from "@/components/section-reveal";
import { personalInfo } from "@/data/portfolio";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context / permission) — the mailto link
      // beside this button still works.
    }
  };

  return (
    <SectionReveal id="contact" className={SECTION_SHELL}>
      <div
        data-reveal-child
        className="border-beam/40 relative overflow-hidden rounded-3xl border px-7 py-14 sm:px-12 sm:py-16"
        style={{
          background: "var(--contact-gradient)",
          color: "var(--contact-ink)",
        }}
      >
        {/* Orbit + infinity watermark */}
        <div
          aria-hidden
          className="animate-orbit absolute -top-28 -right-20 h-[420px] w-[420px] rounded-full border border-dashed border-white/30"
          style={{ animationDuration: "40s" }}
        >
          <div className="absolute -top-[5px] left-1/2 h-2.5 w-2.5 rounded-full bg-white" />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute right-24 -bottom-14 text-[300px] leading-none font-bold text-white/7 select-none"
        >
          ∞
        </div>

        <div className="relative">
          <div className="font-mono text-xs tracking-[0.24em] opacity-80">
            08 — FINAL PHASE
          </div>

          <h2 className="mt-4 text-[clamp(28px,6vw,56px)] leading-[1.08] font-bold tracking-[-0.02em]">
            Let&apos;s build something
            <br />
            that lasts.
          </h2>

          <p className="mt-4 max-w-[520px] text-[15px] leading-relaxed text-pretty opacity-85 sm:text-[17px]">
            Open to internships, research collaborations, freelance projects,
            and conversations about software engineering.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <a
              href={`mailto:${personalInfo.email}`}
              className="text-void rounded-full bg-white px-7 py-3.5 font-mono text-[13px] font-bold transition-opacity hover:opacity-85"
            >
              {personalInfo.email}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              aria-label="Copy email address"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-white/60 transition-colors hover:bg-white/15"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>

            {[
              { label: "GITHUB ↗", href: personalInfo.github },
              { label: "LINKEDIN ↗", href: personalInfo.linkedin },
              { label: "RESUME ↗", href: personalInfo.resumeUrl },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-void rounded-full border-[1.5px] border-white/60 px-7 py-3.5 font-mono text-[13px] transition-colors hover:bg-white"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
