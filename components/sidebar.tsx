"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Download,
  Github,
  Linkedin,
  Mail,
  Home,
  User,
  Sparkles,
  Briefcase,
  FolderGit2,
  Trophy,
  BadgeCheck,
  Send,
  type LucideIcon,
} from "lucide-react";
import { navLinks, personalInfo } from "@/data/portfolio";
import { useActiveSection } from "@/hooks/useActiveSection";

const navIcons: Record<string, LucideIcon> = {
  Home,
  About: User,
  Skills: Sparkles,
  Experience: Briefcase,
  Projects: FolderGit2,
  GitHub: Github,
  Achievements: Trophy,
  Certifications: BadgeCheck,
  Contact: Send,
};

const socials = [
  { href: personalInfo.github, icon: Github, label: "GitHub" },
  { href: personalInfo.linkedin, icon: Linkedin, label: "LinkedIn" },
  { href: `mailto:${personalInfo.email}`, icon: Mail, label: "Email" },
];

const resumeLabel = personalInfo.resumeUrl.split("/").pop() || "Resume.pdf";

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const activeSection = useActiveSection();

  return (
    <nav className="flex flex-col gap-1.5">
      {navLinks.map((link) => {
        const sectionId = link.href.replace("#", "");
        const isActive = activeSection === sectionId;
        const Icon = navIcons[link.label] ?? Home;
        return (
          <a
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
              isActive
                ? "bg-linear-to-br from-primary to-primary-accent text-white shadow-[0_10px_22px_-12px_rgba(37,99,235,0.7)]"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <span className="flex w-5 justify-center">
              <Icon className="h-4 w-4" />
            </span>
            {link.label}
          </a>
        );
      })}
    </nav>
  );
}

function CtaPanel() {
  return (
    <div className="rounded-[18px] bg-linear-to-br from-primary via-primary to-primary-accent p-5 text-white">
      <p className="font-display text-[15px] font-bold">
        Open to Opportunities
      </p>
      <p className="mt-2 text-xs leading-relaxed text-white/75">
        Internships, research, and collaborations — let&apos;s build
        something together.
      </p>
      <a
        href="#contact"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-[11px] bg-white px-3 py-2.5 text-[13.5px] font-bold text-primary transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Get In Touch →
      </a>
    </div>
  );
}

function ResumeRow() {
  return (
    <div>
      <p className="text-[10.5px] font-semibold tracking-[1.5px] text-muted-foreground/80">
        DOWNLOAD CV
      </p>
      <a
        href={personalInfo.resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2.5 flex items-center gap-2.5 rounded-[11px] border border-border bg-secondary px-3.5 py-2.5 text-[13px] font-medium transition-colors hover:bg-accent"
      >
        <Download className="h-4 w-4 shrink-0 text-primary-accent" />
        <span className="truncate">{resumeLabel}</span>
      </a>
    </div>
  );
}

function SocialRow() {
  return (
    <div>
      <p className="text-[10.5px] font-semibold tracking-[1.5px] text-muted-foreground/80">
        FOLLOW ME
      </p>
      <div className="mt-2.5 flex gap-2.5">
        {socials.map(({ href, icon: Icon, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex h-9 w-9 items-center justify-center rounded-[11px] border border-border bg-secondary text-primary transition-colors hover:bg-accent"
          >
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </div>
    </div>
  );
}

function Identity() {
  return (
    <div className="flex items-center gap-3 border-b border-border pb-5">
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[14px]">
        <Image
          src={personalInfo.heroImage}
          alt={personalInfo.name}
          fill
          sizes="44px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="font-display truncate text-[15px] font-extrabold tracking-tight">
          {personalInfo.firstName.toUpperCase()}{" "}
          {personalInfo.name.split(" ").slice(-1)[0].toUpperCase()}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {personalInfo.role}
        </p>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-7 hidden h-fit w-[272px] shrink-0 flex-col rounded-[22px] border border-border bg-card p-6 shadow-[0_18px_40px_-28px_rgba(23,42,99,0.35)] lg:flex">
        <Identity />
        <div className="mt-5">
          <NavList />
        </div>
        <div className="mt-6">
          <CtaPanel />
        </div>
        <div className="mt-5 border-t border-border pt-5">
          <ResumeRow />
        </div>
        <div className="mt-5">
          <SocialRow />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-50 lg:hidden">
        <div className="flex items-center justify-between border-b border-border bg-card/95 px-4 py-3 backdrop-blur-md">
          <a href="#home" className="flex items-center gap-2.5">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-[11px]">
              <Image
                src={personalInfo.heroImage}
                alt={personalInfo.name}
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
            <span className="font-display text-sm font-bold">
              {personalInfo.firstName}
              <span className="text-primary-accent">.dev</span>
            </span>
          </a>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-[11px] border border-border"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-b border-border bg-card/98 backdrop-blur-md"
            >
              <div className="flex flex-col gap-5 px-4 py-5">
                <NavList onNavigate={() => setMobileOpen(false)} />
                <CtaPanel />
                <ResumeRow />
                <SocialRow />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
