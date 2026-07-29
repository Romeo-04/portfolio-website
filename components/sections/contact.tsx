"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Github,
  Linkedin,
  Download,
  Copy,
  Check,
  Send,
} from "lucide-react";
import SectionReveal, { childVariants } from "@/components/section-reveal";
import Spotlight from "@/components/spotlight";
import { handleSpotlightMove, handleSpotlightLeave } from "@/lib/spotlight";
import { personalInfo } from "@/data/portfolio";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback — select text
    }
  };

  const contactLinks = [
    {
      label: "GitHub",
      href: personalInfo.github,
      icon: Github,
      description: "Browse my repositories",
    },
    {
      label: "LinkedIn",
      href: personalInfo.linkedin,
      icon: Linkedin,
      description: "Connect with me",
    },
    {
      label: "Email",
      href: `mailto:${personalInfo.email}`,
      icon: Mail,
      description: personalInfo.email,
    },
  ];

  return (
    <SectionReveal id="contact" className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
      {/* Gradient intro panel */}
      <motion.div
        variants={childVariants}
        onMouseMove={handleSpotlightMove}
        onMouseLeave={handleSpotlightLeave}
        className="relative flex flex-col justify-center overflow-hidden rounded-3xl bg-linear-to-br from-[#12224e] via-primary to-primary-accent p-8 text-white shadow-[0_30px_60px_-34px_rgba(23,42,99,0.6)] sm:p-9"
      >
        <Spotlight size={450} />

        <div className="relative">
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-white/15">
            <Send className="h-5 w-5" />
          </div>
          <h2 className="font-display mt-5 text-2xl leading-tight font-extrabold sm:text-[26px]">
            Let&apos;s Connect!
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#c3cdec]">
            Open to internship opportunities, research collaborations,
            freelance projects, and conversations about software engineering.
          </p>
        </div>
      </motion.div>

      {/* Content panel */}
      <motion.div
        variants={childVariants}
        className="rounded-3xl border border-border bg-card p-6 shadow-[0_18px_40px_-32px_rgba(23,42,99,0.35)] sm:p-8"
      >
        <div className="grid gap-8 sm:grid-cols-[1.3fr_1fr]">
          {/* Email CTA */}
          <div className="flex flex-col justify-center">
            <h3 className="text-lg font-bold">Send me a message</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Have an opportunity or just want to chat? I&apos;d love to hear
              from you.
            </p>

            <div className="surface-card mt-5 inline-flex w-fit items-center gap-2 rounded-xl px-4 py-2.5">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-sm">{personalInfo.email}</span>
              <button
                onClick={copyEmail}
                aria-label="Copy email"
                className="ml-1 flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-accent"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={`mailto:${personalInfo.email}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-br from-primary to-primary-accent px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Mail className="h-4 w-4" />
                Send Email
              </a>
              <a
                href={personalInfo.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
              >
                <Download className="h-4 w-4" />
                Resume
              </a>
            </div>
          </div>

          {/* Social links */}
          <div className="flex flex-col justify-center gap-4 border-t border-border pt-6 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8">
            {contactLinks.map(({ label, href, icon: Icon, description }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-accent transition-colors group-hover:bg-primary-accent/15">
                  <Icon className="h-4 w-4 text-primary transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </SectionReveal>
  );
}
