"use client";

import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  Download,
  ChevronDown,
  User,
} from "lucide-react";
import { personalInfo, trainerStats } from "@/data/portfolio";

function StatBar({
  label,
  value,
  delay,
}: {
  label: string;
  value: number;
  delay: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 text-right font-mono text-xs text-muted-foreground">
        {label}
      </span>
      <div className="stat-bar-track flex-1 bg-foreground/10">
        <motion.div
          className="stat-bar-fill bg-linear-to-r from-primary/80 to-primary"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: value / 100 }}
          transition={{ duration: 1, delay: 0.8 + delay, ease: [0.25, 0.4, 0.25, 1] }}
        />
      </div>
      <span className="w-8 font-mono text-xs text-muted-foreground">
        {value}
      </span>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16"
    >
      {/* Background glow orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16">
        {/* Left — Text Content */}
        <motion.div
          className="flex flex-col justify-center"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
        >
          {/* Type badges */}
          <div className="mb-6 flex flex-wrap gap-2">
            {["Web Development", "Machine Learning", "Full-Stack"].map(
              (tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
                >
                  {tag}
                </span>
              )
            )}
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {personalInfo.name.split(" ").map((word, i) => (
              <span key={i}>
                {i === 0 ? (
                  <span className="text-primary">{word}</span>
                ) : (
                  word
                )}{" "}
              </span>
            ))}
          </h1>

          <p className="mb-2 text-lg font-medium text-muted-foreground sm:text-xl">
            {personalInfo.role}
            <span className="mx-2 text-muted-foreground/50">·</span>
            <span className="text-foreground/80">
              {personalInfo.school}
            </span>
          </p>

          <p className="mb-8 max-w-lg text-base leading-relaxed text-muted-foreground">
            {personalInfo.tagline}
          </p>

          {/* CTA Buttons */}
          <div className="mb-8 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/50 px-6 py-3 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-accent"
            >
              Get in Touch
            </a>
            <a
              href={personalInfo.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/50 px-6 py-3 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-accent"
            >
              <Download className="h-4 w-4" />
              Resume
            </a>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {[
              {
                href: personalInfo.github,
                icon: Github,
                label: "GitHub",
              },
              {
                href: personalInfo.linkedin,
                icon: Linkedin,
                label: "LinkedIn",
              },
              {
                href: `mailto:${personalInfo.email}`,
                icon: Mail,
                label: "Email",
              },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card/50 backdrop-blur-sm transition-colors hover:bg-accent hover:text-primary"
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right — Trainer Card */}
        <motion.div
          className="flex items-center justify-center lg:justify-end"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <div className="trainer-card glass-card w-full max-w-md rounded-2xl p-6 sm:p-8">
            {/* Card header */}
            <div className="mb-5 flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                <span className="inline-block h-2 w-2 rounded-full bg-primary animate-glow-pulse" />
                Trainer Card
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                ID: {personalInfo.trainerId}
              </span>
            </div>

            {/* Divider */}
            <div className="mb-5 h-px bg-linear-to-r from-transparent via-border to-transparent" />

            {/* Profile row */}
            <div className="mb-6 flex items-center gap-4">
              {/* Avatar placeholder */}
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/50">
                <User className="h-8 w-8 text-muted-foreground/50" />
                {/* Replace with:
                  <Image src={personalInfo.heroImage} alt="Profile" fill className="object-cover" />
                */}
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight">
                  {personalInfo.name}
                </h2>
                <p className="text-sm text-primary font-medium">
                  {personalInfo.role}
                </p>
                <p className="text-xs text-muted-foreground">
                  {personalInfo.trainerClass} · {personalInfo.school}
                </p>
              </div>
            </div>

            {/* Type affinities */}
            <div className="mb-6 flex flex-wrap gap-1.5">
              {[
                { label: "Web Dev", color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
                { label: "ML / AI", color: "bg-purple-500/15 text-purple-400 border-purple-500/20" },
                { label: "Full-Stack", color: "bg-red-500/15 text-red-400 border-red-500/20" },
                { label: "Leadership", color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
              ].map((t) => (
                <span
                  key={t.label}
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${t.color}`}
                >
                  {t.label}
                </span>
              ))}
            </div>

            {/* Stat bars */}
            <div className="mb-4 flex items-center gap-2">
              <span className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
              <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Stats
              </span>
              <span className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
            </div>

            <div className="flex flex-col gap-2.5">
              {trainerStats.map((stat, i) => (
                <StatBar
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  delay={i * 0.12}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <a
          href="#about"
          className="flex flex-col items-center gap-1 text-muted-foreground/50 transition-colors hover:text-muted-foreground"
        >
          <span className="text-[10px] font-medium tracking-widest uppercase">
            scroll
          </span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
}
