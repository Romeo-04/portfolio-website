import { personalInfo } from "@/data/portfolio";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex flex-col items-center gap-4 px-2 py-4 sm:flex-row sm:justify-between">
      <p className="text-sm text-muted-foreground">
        © {year} {personalInfo.name}. Crafted with precision.
      </p>
      <div className="flex items-center gap-3">
        {[
          { href: personalInfo.github, icon: Github, label: "GitHub" },
          { href: personalInfo.linkedin, icon: Linkedin, label: "LinkedIn" },
          { href: `mailto:${personalInfo.email}`, icon: Mail, label: "Email" },
        ].map(({ href, icon: Icon, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-primary"
            aria-label={label}
          >
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </div>
    </footer>
  );
}
