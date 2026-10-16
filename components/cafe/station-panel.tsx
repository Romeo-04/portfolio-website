"use client";

// ============================================================
// STATION PANEL
// ============================================================
// The café is the backdrop; this is where the details are read. A phone
// is held up beside the café showing the current station as a small app:
// a status bar, an app bar with the station and a fold button, and a
// scrolling screen with that station's content (the intro, about and
// skills, projects that open their pop-ups, the wall, experience, repos
// and contact). It stays up while the camera travels and can be folded
// away to a pill to just enjoy the view. On phones it is a plain bottom
// sheet instead, since the visitor is already holding one.
// ============================================================

import { useEffect, useState, type ReactNode } from "react";
import type { SpecialItem } from "@/components/cafe/stations/specials";
import DrinkIllustration from "@/components/menu/drink-illustration";
import { TestimonialAvatar } from "@/components/cafe/testimonial-sheet";
import {
  aboutData,
  achievementsData,
  certificationsData,
  experienceData,
  testimonialsData,
  ORG_LOGOS,
  personalInfo,
  projectsData,
  skillsData,
  tierLabels,
  type SkillTier,
} from "@/data/portfolio";
import { openProject, originOf } from "@/lib/cafe/project-sheet";
import { openTestimonial } from "@/lib/cafe/testimonial-sheet";
import { getProgress, goTo, subscribeProgress } from "@/lib/cafe/scroll";
import { setViewInset } from "@/lib/cafe/view-inset";
import { ArrowRight, Code, Document, External, Mail, Minus, Phone } from "@/components/ui/icons";
import { STATIONS, stationIndexAt, type StationId } from "@/lib/cafe/stations";

/** The phone's width plus its left margin and a gap, in CSS px (see .station-panel). */
const PANEL_SPACE = 388;

/** A labelled group on the screen. */
function Section({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="panel-section">
      {label && <p className="panel-label">{label}</p>}
      {children}
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="panel-chips">
      {items.map((t) => (
        <li key={t} className="panel-chip">
          {t}
        </li>
      ))}
    </ul>
  );
}

function ProjectCard({ slug }: { slug: string }) {
  const p = projectsData.find((x) => x.slug === slug)!;
  return (
    <button type="button" onClick={(e) => openProject(p.slug, originOf(e.currentTarget))} className="panel-project" aria-label={`Open ${p.title}`}>
      <span aria-hidden className="panel-swatch">
        <DrinkIllustration project={p} size={36} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="panel-project-title">{p.title}</span>
        <span className="panel-project-text">{p.pitch}</span>
      </span>
      <ArrowRight className="panel-arrow" />
    </button>
  );
}

/** Signal, Wi-Fi and battery, drawn small for the status bar. */
function StatusIcons() {
  return (
    <span className="phone-icons" aria-hidden>
      <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
        <rect x="0" y="7" width="3" height="4" rx="1" />
        <rect x="4.5" y="5" width="3" height="6" rx="1" />
        <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
        <rect x="13.5" y="0" width="3" height="11" rx="1" />
      </svg>
      <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M1.5 4a9 9 0 0 1 12 0M4 6.6a5.4 5.4 0 0 1 7 0" />
        <circle cx="7.5" cy="9.3" r="1" fill="currentColor" stroke="none" />
      </svg>
      <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
        <rect x="0.75" y="0.75" width="21" height="10.5" rx="3" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" />
        <rect x="2.5" y="2.5" width="17.5" height="7" rx="1.6" fill="currentColor" />
        <path d="M23.3 4.2v3.6" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}

const TIERS: SkillTier[] = ["house", "seasonal", "experimental"];

function content(id: StationId, specials: SpecialItem[], reduced: boolean): { eyebrow: string; title: string; body: ReactNode } {
  switch (id) {
    case "storefront":
      return {
        eyebrow: `${personalInfo.role} · ${personalInfo.school}`,
        title: personalInfo.name,
        body: (
          <>
            <p className="panel-lead">{personalInfo.tagline}</p>
            <dl className="panel-facts">
              <div>
                <dt>Building</dt>
                <dd>{aboutData.currently.building}</dd>
              </div>
              <div>
                <dt>Exploring</dt>
                <dd>{aboutData.currently.exploring}</dd>
              </div>
              <div>
                <dt>Looking for</dt>
                <dd>{aboutData.currently.aimingFor}</dd>
              </div>
            </dl>
            <div className="panel-actions">
              <button type="button" className="panel-action panel-action-primary" onClick={() => goTo("brew-bar", { immediate: reduced })}>
                Projects <ArrowRight />
              </button>
              <a href={personalInfo.resumeUrl} target="_blank" rel="noopener noreferrer" className="panel-action">
                <Document /> Résumé
              </a>
            </div>
            {testimonialsData.length > 0 && (
              <Section label="Regulars outside">
                <div className="panel-stack">
                  {testimonialsData.map((t, i) => (
                    <button
                      key={`${t.name}-${i}`}
                      type="button"
                      onClick={(e) => openTestimonial(i, originOf(e.currentTarget))}
                      className="panel-project"
                      aria-label={`Read ${t.placeholder ? "the reserved testimonial" : `${t.name}'s testimonial`}`}
                    >
                      <TestimonialAvatar t={t} size={36} />
                      <span className="min-w-0 flex-1">
                        <span className="panel-project-title">{t.name}</span>
                        <span className="panel-project-text">
                          {t.role} · {t.organization}
                        </span>
                      </span>
                      <ArrowRight className="panel-arrow" />
                    </button>
                  ))}
                </div>
              </Section>
            )}
          </>
        ),
      };
    case "menu-board":
      return {
        eyebrow: "About the barista",
        title: "Hi, I'm Jhezra",
        body: (
          <>
            <p className="panel-text">{aboutData.bio[0]}</p>
            {TIERS.map((tier) => (
              <Section key={tier} label={tierLabels[tier]}>
                <Chips
                  items={skillsData
                    .flatMap((c) => c.skills)
                    .filter((s) => s.tier === tier)
                    .map((s) => s.name)}
                />
              </Section>
            ))}
          </>
        ),
      };
    case "brew-bar":
      return {
        eyebrow: "Signature projects",
        title: "On the bar today",
        body: (
          <>
            <p className="panel-text">Each project is a drink, layered from its stack. Open one for the full story.</p>
            <div className="panel-stack">
              {projectsData
                .filter((p) => p.featured)
                .map((p) => (
                  <ProjectCard key={p.slug} slug={p.slug} />
                ))}
            </div>
          </>
        ),
      };
    case "wall":
      return {
        eyebrow: "Wall of fame",
        title: "Recognition",
        body: (
          <>
            <ul className="panel-list">
              {achievementsData.map((a) => (
                <li key={a.title}>
                  <span className="font-semibold">{a.title}</span>
                  <span className="panel-meta">{a.year}</span>
                </li>
              ))}
            </ul>
            {certificationsData.length > 0 && (
              <Section label="Certifications">
                <ul className="panel-list">
                  {certificationsData.map((c) => (
                    <li key={c.title}>
                      <span className="font-semibold">{c.title}</span>
                      <span className="panel-meta">
                        {c.issuer} · {c.issued}
                      </span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </>
        ),
      };
    case "roastery":
      return {
        eyebrow: "Roast log",
        title: "Experience",
        body: (
          <ol className="panel-timeline">
            {experienceData.map((e) => (
              <li key={`${e.title}-${e.organization}`}>
                {e.logos && (
                  <span className="panel-logos">
                    {e.logos.map((k) => (
                      // eslint-disable-next-line @next/next/no-img-element -- tiny static logos
                      <img
                        key={k}
                        src={ORG_LOGOS[k].src}
                        alt={ORG_LOGOS[k].alt}
                        height={24}
                        width={Math.round(24 * ORG_LOGOS[k].aspect)}
                        className={ORG_LOGOS[k].dark ? "is-dark" : undefined}
                      />
                    ))}
                  </span>
                )}
                <p className="panel-project-title">{e.title}</p>
                <p className="panel-meta">
                  {e.organization} · {e.period}
                </p>
                <ul className="mt-2 grid gap-1">
                  {e.description.slice(0, 2).map((line) => (
                    <li key={line} className="panel-text">
                      {line}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        ),
      };
    case "specials":
      return {
        eyebrow: "Today's specials",
        title: "More from the shelf",
        body: (
          <>
            <div className="panel-stack">
              {projectsData
                .filter((p) => !p.featured)
                .map((p) => (
                  <ProjectCard key={p.slug} slug={p.slug} />
                ))}
            </div>
            {specials.length > 0 && (
              <Section label="Fresh on GitHub">
                <ul className="panel-list">
                  {specials.map((r) => (
                    <li key={r.id}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold underline-offset-2 hover:underline">
                        {r.name} <External size={14} className="opacity-60" />
                      </a>
                      {r.language && <span className="panel-meta">{r.language}</span>}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </>
        ),
      };
    case "checkout":
      return {
        eyebrow: "Find us",
        title: "Let's work together",
        body: (
          <>
            <p className="panel-text">Open to {aboutData.currently.aimingFor.toLowerCase()}. The fastest way to reach me is email.</p>
            <div className="panel-stack">
              <a href={`mailto:${personalInfo.email}`} className="panel-action panel-action-primary panel-action-block">
                <Mail /> {personalInfo.email}
              </a>
              <div className="panel-stack">
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="panel-action panel-action-row">
                  <Code /> GitHub
                </a>
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="panel-action panel-action-row">
                  <External /> LinkedIn
                </a>
                <a href={personalInfo.resumeUrl} target="_blank" rel="noopener noreferrer" className="panel-action panel-action-row">
                  <Document /> Résumé
                </a>
              </div>
            </div>
          </>
        ),
      };
  }
}

export default function StationPanel({ specials, reduced }: { specials: SpecialItem[]; reduced: boolean }) {
  // The panel stays up the whole way through; its content follows the
  // station the camera is at or heading for.
  const [index, setIndex] = useState(() => stationIndexAt(getProgress()));
  const [folded, setFolded] = useState(false);

  useEffect(
    () =>
      subscribeProgress(() => {
        setIndex(stationIndexAt(getProgress()));
      }),
    [],
  );

  // Make room for the panel: the 3D view centres in the space beside it.
  // Phones get a bottom sheet instead, so the view stays put there.
  const open = !folded;
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 641px)").matches;
    setViewInset(open && wide ? PANEL_SPACE / 2 : 0);
  }, [open]);
  useEffect(() => () => setViewInset(0), []);

  const station = STATIONS[index];
  const { eyebrow, title, body } = content(station.id, specials, reduced);
  const step = `${String(index + 1).padStart(2, "0")} / ${String(STATIONS.length).padStart(2, "0")}`;

  if (folded) {
    return (
      <button type="button" onClick={() => setFolded(false)} className="panel-pill" aria-label={`Show details: ${title}`}>
        <Phone size={18} />
        <span className="panel-pill-step">{step}</span> {station.label}
      </button>
    );
  }

  return (
    <section aria-label={`${station.label}: ${title}`} className="station-panel is-visible">
      <div className="phone-screen">
        <div className="phone-status" aria-hidden>
          <span>9:41</span>
          <span className="phone-island" />
          <StatusIcons />
        </div>
        <header className="phone-appbar">
          <p className="panel-step">
            <span className="tabular-nums">{step}</span> · {station.label}
          </p>
          <button type="button" onClick={() => setFolded(true)} className="panel-fold" aria-label="Hide details">
            <Minus size={18} />
          </button>
        </header>
        <div className="phone-scroll" data-lenis-prevent>
          {/* Keyed by station so the content re-staggers on arrival. */}
          <div key={station.id} className="panel-inner">
            <p className="panel-eyebrow">{eyebrow}</p>
            <h2 className="font-display panel-title">{title}</h2>
            <div className="panel-body">{body}</div>
          </div>
        </div>
        <div className="phone-home" aria-hidden />
      </div>
    </section>
  );
}
