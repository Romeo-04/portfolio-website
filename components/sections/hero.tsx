"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  Download,
  ChevronDown,
} from "lucide-react";
import { personalInfo, skillStats } from "@/data/portfolio";
import Spotlight from "@/components/spotlight";
import { handleSpotlightMove, handleSpotlightLeave } from "@/lib/spotlight";

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
      <span className="w-24 text-right font-mono text-xs text-white/60">
        {label}
      </span>
      <div className="stat-bar-track flex-1 bg-white/15">
        <motion.div
          className="stat-bar-fill"
          style={{ background: "linear-gradient(90deg,#7aa2ff,#c9b6ff)" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: value / 100 }}
          transition={{ duration: 1, delay: 0.8 + delay, ease: [0.25, 0.4, 0.25, 1] }}
        />
      </div>
      <span className="w-8 font-mono text-xs text-white/60">{value}</span>
    </div>
  );
}

export default function Hero() {
  const nameWords = personalInfo.name.split(" ");
  const surname = nameWords[nameWords.length - 1];
  const givenNames = nameWords.slice(0, -1).join(" ");

  return (
    <section
      id="home"
      onMouseMove={handleSpotlightMove}
      onMouseLeave={handleSpotlightLeave}
      className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#12224e] via-[#1e3a8a] to-[#2a4bb0] p-6 text-white shadow-[0_30px_60px_-34px_rgba(23,42,99,0.6)] sm:p-8 lg:p-11"
    >
      {/* Aura blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="animate-hero-aura absolute -top-28 -right-14 h-[280px] w-[280px] rounded-full sm:h-[340px] sm:w-[340px]"
          style={{
            background:
              "radial-gradient(circle, rgba(88,127,255,0.35), transparent 70%)",
          }}
        />
        <div
          className="animate-hero-aura2 absolute -bottom-24 -left-10 h-[220px] w-[220px] rounded-full sm:h-[260px] sm:w-[260px]"
          style={{
            background:
              "radial-gradient(circle, rgba(147,113,255,0.28), transparent 70%)",
          }}
        />
        <div
          className="animate-hero-aura-reverse absolute top-1/3 left-1/3 h-[160px] w-[160px] rounded-full sm:h-[180px] sm:w-[180px]"
          style={{
            background:
              "radial-gradient(circle, rgba(120,160,255,0.3), transparent 70%)",
          }}
        />
      </div>

      <Spotlight size={650} />

      <div className="relative grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-8">
        {/* Left — Text Content */}
        <motion.div
          className="flex flex-col justify-center"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <span className="text-xs font-semibold tracking-[2px] text-[#9fb4f0]">
            HELLO, I&apos;M
          </span>

          <h1 className="font-display mt-3 text-4xl leading-[1.02] font-extrabold tracking-tight sm:text-5xl lg:text-[56px]">
            {givenNames}{" "}
            <span className="bg-linear-to-r from-[#7aa2ff] to-[#c9b6ff] bg-clip-text text-transparent">
              {surname}
            </span>
          </h1>

          <p className="font-display mt-4 text-xl leading-tight font-bold sm:text-2xl">
            {personalInfo.role} at{" "}
            <span className="text-[#8fb0ff]">{personalInfo.school}</span>
          </p>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-[#c3cdec]">
            {personalInfo.tagline}
          </p>

          {/* Focus areas */}
          <div className="mt-5 flex flex-wrap gap-2">
            {["Web Development", "Machine Learning", "Full-Stack"].map(
              (tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium"
                >
                  {tag}
                </span>
              )
            )}
          </div>

          {/* CTA Buttons */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-3 text-sm font-semibold transition-colors hover:bg-white/10"
            >
              Get in Touch
            </a>
            <a
              href={personalInfo.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-3 text-sm font-semibold transition-colors hover:bg-white/10"
            >
              <Download className="h-4 w-4" />
              Resume
            </a>
          </div>

          {/* Social links */}
          <div className="mt-7 flex items-center gap-3">
            {[
              { href: personalInfo.github, icon: Github, label: "GitHub" },
              { href: personalInfo.linkedin, icon: Linkedin, label: "LinkedIn" },
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
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 transition-colors hover:bg-white/20"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right — Profile snapshot */}
        <motion.div
          className="flex items-center justify-center lg:justify-end"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#09122c]/55 p-6 backdrop-blur-md sm:p-8">
            {/* Profile row */}
            <div className="mb-6 flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-white/5">
                <Image
                  src={personalInfo.heroImage}
                  alt={personalInfo.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold tracking-tight">
                  {personalInfo.name}
                </h2>
                <p className="text-sm font-medium text-[#8fb0ff]">
                  {personalInfo.role}
                </p>
                <p className="text-xs text-white/60">{personalInfo.school}</p>
              </div>
            </div>

            {/* Focus areas */}
            <div className="mb-6 flex flex-wrap gap-1.5">
              {["Web Dev", "ML / AI", "Full-Stack", "Leadership"].map(
                (label) => (
                  <span
                    key={label}
                    className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-white/85"
                  >
                    {label}
                  </span>
                )
              )}
            </div>

            {/* Skill snapshot */}
            <div className="flex flex-col gap-2.5">
              {skillStats.map((stat, i) => (
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
        className="relative mt-10 flex justify-center lg:hidden"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <a
          href="#about"
          className="flex flex-col items-center gap-1 text-white/50 transition-colors hover:text-white/80"
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
