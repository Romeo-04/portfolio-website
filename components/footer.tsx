import { personalInfo } from "@/data/portfolio";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-1 mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-2 px-5 pb-10 sm:flex-row sm:px-8">
      <p className="text-ink-muted font-mono text-[11px] tracking-[0.08em]">
        © {year} {personalInfo.name.toUpperCase()}
      </p>
      <p className="text-ink-muted font-mono text-[11px] tracking-[0.08em]">
        0 → 1 → ∞ · CRAFTED WITH PRECISION
      </p>
    </footer>
  );
}
