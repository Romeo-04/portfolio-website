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
    <SectionReveal id="contact" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <motion.div variants={childVariants} className="mb-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="h-px w-8 bg-primary" />
            <span className="text-xs font-bold tracking-widest text-primary uppercase">
              Contact
            </span>
            <span className="h-px w-8 bg-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Let&apos;s Connect
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Open to internship opportunities, research collaborations, freelance
            projects, and conversations about software engineering.
          </p>
        </motion.div>

        <div className="mx-auto max-w-2xl">
          {/* Email CTA */}
          <motion.div
            variants={childVariants}
            className="glass-card mb-8 rounded-2xl border border-primary/20 p-6 text-center sm:p-8"
          >
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Send className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Send me a message</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Have an opportunity or just want to chat? I&apos;d love to hear from
              you.
            </p>

            {/* Email with copy */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-2.5">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-sm">{personalInfo.email}</span>
              <button
                onClick={copyEmail}
                className="ml-1 flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-accent"
                aria-label="Copy email"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href={`mailto:${personalInfo.email}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
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
                Download Resume
              </a>
            </div>
          </motion.div>

          {/* Social links */}
          <motion.div
            variants={childVariants}
            className="grid gap-4 sm:grid-cols-3"
          >
            {contactLinks.map(({ label, href, icon: Icon, description }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card group flex items-center gap-4 rounded-xl border border-border p-4 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground/5 transition-colors group-hover:bg-primary/10">
                  <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {description}
                  </p>
                </div>
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </SectionReveal>
  );
}
