"use client";

// ============================================================
// STATION PANEL
// ============================================================
// The café is the backdrop; this is where the details are read. When the
// camera settles at a station, a calm paper card slides in beside it with
// that station's content in plain, readable type: the intro, about and
// skills, projects (each opens its pop-up), the wall, experience, repos
// and contact. It slides out while the camera glides, and the visitor can
// fold it away to just enjoy the view.
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
import { ArrowRight, Code, Document, External, Mail } from "@/components/ui/icons";
import { STATIONS, stationIndexAt, type StationId } from "@/lib/cafe/stations";

/** The panel's width plus its margin, in CSS px (see .station-panel). */
const PANEL_SPACE = 420;


function Label({ children }: { children: ReactNode }) {
  return <p className="panel-label">{children}</p>;
}

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
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
    <button
      type="button"
      onClick={(e) => openProject(p.slug, originOf(e.currentTarget))}
      className="panel-project group"
      aria-label={`Open ${p.title}`}
    >
      <span aria-hidden className="panel-swatch">
        <DrinkIllustration project={p} size={40} />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block font-semibold text-[#2b1a10]">{p.title}</span>
        <span className="mt-0.5 block text-[13px] leading-snug text-[#6b5444]">{p.pitch}</span>
      </span>
      <ArrowRight className="panel-arrow" />
    </button>
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
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" className="panel-action panel-action-primary" onClick={() => goTo("brew-bar", { immediate: reduced })}>
                See my projects <ArrowRight />
              </button>
              <a href={personalInfo.resumeUrl} target="_blank" rel="noopener noreferrer" className="panel-action">
                <Document /> Résumé
              </a>
            </div>
            {testimonialsData.length > 0 && (
              <div className="mt-6">
                <Label>Regulars outside</Label>
                <div className="panel-regulars mt-2">
                  {testimonialsData.map((t, i) => (
                    <button
                      key={`${t.name}-${i}`}
                      type="button"
                      onClick={(e) => openTestimonial(i, originOf(e.currentTarget))}
                      className="panel-project group"
                      aria-label={`Read ${t.placeholder ? "the reserved testimonial" : `${t.name}'s testimonial`}`}
                    >
                      <TestimonialAvatar t={t} size={38} />
                      <span className="min-w-0 flex-1 text-left">
                        <span className="block font-semibold text-[#2b1a10]">{t.name}</span>
                        <span className="mt-0.5 block text-[13px] leading-snug text-[#6b5444]">
                          {t.role} · {t.organization}
                        </span>
                      </span>
                      <ArrowRight className="panel-arrow" />
                    </button>
                  ))}
                </div>
              </div>
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
              <div key={tier} className="mt-4">
                <Label>{tierLabels[tier]}</Label>
                <Chips
                  items={skillsData
                    .flatMap((c) => c.skills)
                    .filter((s) => s.tier === tier)
                    .map((s) => s.name)}
                />
              </div>
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
            <div className="mt-3 space-y-2">
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
              <div className="mt-4">
                <Label>Certifications</Label>
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
              </div>
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
                        height={26}
                        width={Math.round(26 * ORG_LOGOS[k].aspect)}
                        className={ORG_LOGOS[k].dark ? "is-dark" : undefined}
                      />
                    ))}
                  </span>
                )}
                <p className="font-semibold text-[#2b1a10]">{e.title}</p>
                <p className="panel-meta">
                  {e.organization} · {e.period}
                </p>
                <ul className="mt-1.5 space-y-1">
                  {e.description.slice(0, 2).map((line) => (
                    <li key={line} className="text-[13.5px] leading-snug text-[#5a4536]">
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
            <div className="space-y-2">
              {projectsData
                .filter((p) => !p.featured)
                .map((p) => (
                  <ProjectCard key={p.slug} slug={p.slug} />
                ))}
            </div>
            {specials.length > 0 && (
              <div className="mt-4">
                <Label>Fresh on GitHub</Label>
                <ul className="panel-list">
                  {specials.map((r) => (
                    <li key={r.id}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline-offset-2 hover:underline">
                        {r.name} <External size={13} className="opacity-60" />
                      </a>
                      {r.language && <span className="panel-meta">{r.language}</span>}
                    </li>
                  ))}
                </ul>
              </div>
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
            <div className="mt-4 flex flex-col gap-2">
              <a href={`mailto:${personalInfo.email}`} className="panel-action panel-action-primary">
                <Mail /> {personalInfo.email}
              </a>
              <div className="flex flex-wrap gap-2">
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="panel-action">
                  <Code /> GitHub
                </a>
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="panel-action">
                  <External /> LinkedIn
                </a>
                <a href={personalInfo.resumeUrl} target="_blank" rel="noopener noreferrer" className="panel-action">
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
        <span className="tabular-nums text-[#a0522d]">{step}</span> {station.label} · Show details
      </button>
    );
  }

  return (
    <section
      aria-label={`${station.label}: ${title}`}
      className="station-panel is-visible"
      data-lenis-prevent
    >
      {/* Keyed by station so the content re-staggers on arrival. */}
      <div key={station.id} className="panel-inner">
        <div className="flex items-center justify-between">
          <p className="panel-step">
            <span className="tabular-nums">{step}</span> · {eyebrow}
          </p>
          <button type="button" onClick={() => setFolded(true)} className="panel-fold" aria-label="Hide details">
            –
          </button>
        </div>
        <h2 className="font-display panel-title">{title}</h2>
        <div className="panel-body">{body}</div>
      </div>
    </section>
  );
}
