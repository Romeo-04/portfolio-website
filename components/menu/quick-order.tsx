import DrinkIllustration from "@/components/menu/drink-illustration";
import MenuNav from "@/components/menu/menu-nav";
import { ArrowRight, Code, Document, External, Mail } from "@/components/ui/icons";
import {
  aboutData,
  achievementName,
  achievementsData,
  certificationsData,
  experienceData,
  personalInfo,
  projectsData,
  skillsData,
  tierLabels,
  type Project,
  type SkillTier,
  testimonialsData,
} from "@/data/portfolio";
import type { GithubRepo } from "@/lib/github";

// ============================================================
// QUICK ORDER MENU
// ============================================================
// The whole portfolio as plain, server-rendered HTML. It is always in the
// DOM: a drawer over the 3D café on desktop, the page itself on phones and
// when WebGL is missing. Search engines and screen readers read this, so
// every piece of content in data/portfolio.ts must appear here.
// Links to "#<station-id>" are handled by CafeShell.
// ============================================================

const TIERS: SkillTier[] = ["house", "seasonal", "experimental"];

/** "https://www.linkedin.com/in/x/" -> "linkedin.com/in/x" for display. */
const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function Section({
  id,
  title,
  station,
  children,
}: {
  id: string;
  title: string;
  station?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="menu-section">
      <div className="menu-section-head">
        <h2 className="font-display menu-h2">{title}</h2>
        {station && (
          <a href={`#${station}`} aria-label={`See ${title} in the café`} className="menu-jump">
            In the café <ArrowRight size={14} />
          </a>
        )}
      </div>
      <div className="menu-section-body">{children}</div>
    </section>
  );
}

function Ticket({ project, withShot = false }: { project: Project; withShot?: boolean }) {
  const shot = withShot ? project.screenshots?.[0] : undefined;
  return (
    <article id={`menu-${project.slug}`} className="menu-ticket">
      {shot && (
        // A pointer shortcut into the sheet; keyboard users have "Open project".
        <button type="button" data-project={project.slug} tabIndex={-1} className="menu-ticket-shot">
          {/* eslint-disable-next-line @next/next/no-img-element -- rendered in tests outside Next */}
          <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} loading="lazy" decoding="async" />
        </button>
      )}
      {/* The cup sits beside the title only, so the text below gets the full width. */}
      <div className="menu-ticket-head">
        <span aria-hidden className="menu-ticket-cup">
          <DrinkIllustration project={project} size={30} />
        </span>
        <div className="min-w-0">
          <h3 className="menu-h3">{project.title}</h3>
          <p className="menu-meta">
            {project.role} · {project.category}
          </p>
        </div>
      </div>
      <div className="min-w-0">
        <p className="menu-text">{project.pitch}</p>
        {/* No-break space before each dot so a wrapped line never starts with "·". */}
        <p className="menu-meta mt-2">{project.techStack.join(" · ")}</p>
        {/* Highlights stay in the page for search and no-JS readers, folded away. */}
        <details className="menu-details">
          <summary>Highlights</summary>
          <ul>
            {project.description.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </details>
        <p className="menu-actions">
          <button type="button" data-project={project.slug} className="ticket-open">
            Open project <ArrowRight size={14} />
          </button>
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" aria-label={`Live demo of ${project.title}`} className="menu-link">
              Live demo <External size={14} />
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" aria-label={`Code for ${project.title}`} className="menu-link">
              Code <External size={14} />
            </a>
          )}
        </p>
      </div>
    </article>
  );
}

export default function QuickOrderMenu({ specials }: { specials: GithubRepo[] }) {
  const signature = projectsData.filter((p) => p.featured);
  const shelf = projectsData.filter((p) => !p.featured);

  return (
    <div className="menu">
      <header id="menu-top" className="menu-header">
        {/* eslint-disable-next-line @next/next/no-img-element -- small portrait, rendered in tests outside Next */}
        <img src="/portrait.webp" alt={personalInfo.name} width={96} height={96} decoding="async" className="menu-portrait" />
        <h1 className="font-display menu-h1">{personalInfo.name}</h1>
        <p className="menu-role">
          {personalInfo.role} · {personalInfo.school}
        </p>
        <p className="menu-text menu-tagline">{personalInfo.tagline}</p>
        <p className="menu-status">
          <span aria-hidden className="menu-status-dot" />
          Open to {aboutData.currently.aimingFor.toLowerCase()}
        </p>
        <div className="menu-hero-actions">
          <a href={`mailto:${personalInfo.email}`} className="menu-cta menu-cta-primary">
            <Mail size={16} /> Email me
          </a>
          <a href={personalInfo.resumeUrl} target="_blank" rel="noopener noreferrer" className="menu-cta">
            <Document size={16} /> Résumé
          </a>
        </div>
      </header>

      <MenuNav />

      <Section id="menu-drinks" title="Signature Drinks" station="brew-bar">
        {signature.map((p) => <Ticket key={p.slug} project={p} withShot />)}
      </Section>

      <Section id="menu-shelf" title="The Shelf" station="brew-bar">
        {shelf.map((p) => <Ticket key={p.slug} project={p} />)}
      </Section>

      <Section id="menu-about" title="About the Barista" station="menu-board">
        <div className="grid gap-3">
          {aboutData.bio.map((para) => (
            <p key={para} className="menu-text">
              {para}
            </p>
          ))}
        </div>
      </Section>

      <Section id="menu-ingredients" title="Ingredients" station="menu-board">
        {TIERS.map((tier) => (
          <div key={tier} className="grid gap-2">
            <h3 className="menu-label">{tierLabels[tier]}</h3>
            <ul className="menu-chips">
              {skillsData
                .flatMap((c) => c.skills)
                .filter((s) => s.tier === tier)
                .map((s) => (
                  <li key={s.name} className="menu-chip">
                    {s.name}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </Section>

      <Section id="menu-roast-log" title="Roast Log" station="roastery">
        {experienceData.map((e) => (
          <article key={e.title}>
            <h3 className="menu-h3">{e.title}</h3>
            <p className="menu-meta">
              {e.organization} · {e.period}
            </p>
            <ul className="menu-bullets">
              {e.description.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>
        ))}
      </Section>

      <Section id="menu-wall" title="On the Wall" station="wall">
        <ul className="menu-list">
          {achievementsData.map((a) => (
            <li key={achievementName(a)}>
              <span className="menu-list-title">{achievementName(a)}</span>
              <span className="menu-meta">
                {a.year} · {a.description}
              </span>
            </li>
          ))}
          {certificationsData.map((c) => (
            <li key={c.title}>
              <span className="menu-list-title">{c.title}</span>
              <span className="menu-meta">
                {c.issued ? `${c.issuer} · ${c.issued}` : c.issuer}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="menu-specials" title="Today's Specials" station="specials">
        {specials.length === 0 ? (
          <p className="menu-text">Sold out — check back soon.</p>
        ) : (
          <ul className="menu-list">
            {specials.map((r) => (
              <li key={r.id}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="menu-list-title menu-link">
                  {r.displayName} <External size={14} />
                </a>
                {(r.description || r.language) && (
                  <span className="menu-meta">
                    {[r.description, r.language].filter(Boolean).join(" · ")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section id="menu-regulars" title="Regulars Say" station="storefront">
        {testimonialsData.map((t, i) => (
          <article key={`${t.name}-${i}`} className="menu-quote">
            <h3 className="menu-h3">{t.name}</h3>
            <p className="menu-meta">
              {t.role} · {t.organization}
            </p>
            <p className="menu-text mt-2">&ldquo;{t.quote}&rdquo;</p>
            <button type="button" data-testimonial={i} className="ticket-open">
              Read more <ArrowRight size={14} />
            </button>
          </article>
        ))}
      </Section>

      <Section id="menu-find-us" title="Find Us" station="checkout">
        <ul className="menu-contact">
          <li>
            <a href={`mailto:${personalInfo.email}`}>
              <Mail size={18} /> {personalInfo.email}
            </a>
          </li>
          <li>
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
              <Code size={18} /> {bare(personalInfo.github)}
            </a>
          </li>
          <li>
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
              <External size={18} /> {bare(personalInfo.linkedin)}
            </a>
          </li>
          <li>
            <a href={personalInfo.resumeUrl} target="_blank" rel="noopener noreferrer">
              <Document size={18} /> Résumé (PDF)
            </a>
          </li>
        </ul>
      </Section>
    </div>
  );
}
