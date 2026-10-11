import DrinkIllustration from "@/components/menu/drink-illustration";
import {
  aboutData,
  achievementsData,
  certificationsData,
  experienceData,
  personalInfo,
  projectsData,
  skillsData,
  tierLabels,
  type Project,
  type SkillTier,
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
    <section id={id} className="border-t border-dashed border-[#2b1a10]/30 py-6">
      <h2 className="font-chalk flex items-baseline justify-between text-2xl">
        {title}
        {station && (
          <a href={`#${station}`} className="font-receipt text-xs underline">
            see it in the café →
          </a>
        )}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Ticket({ project }: { project: Project }) {
  return (
    <article id={`menu-${project.slug}`} className="flex gap-4 py-3">
      <DrinkIllustration project={project} />
      <div className="min-w-0">
        <h3 className="text-lg font-bold">{project.title}</h3>
        <p className="font-receipt text-xs uppercase">{project.role} · {project.category}</p>
        <p className="mt-1 text-sm">{project.pitch}</p>
        <ul className="mt-1 list-disc pl-5 text-sm">
          {project.description.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="font-receipt mt-1 text-xs">{project.techStack.join(" · ")}</p>
        <p className="mt-2 flex gap-3 text-sm underline">
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">Live demo ↗</a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">Code ↗</a>
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
    <nav aria-label="Quick Order menu" className="font-cafe text-[#2b1a10]">
      <header id="menu-top" className="pb-4 text-center">
        <p className="font-receipt text-xs tracking-[0.3em]">QUICK ORDER</p>
        <h1 className="font-chalk text-4xl">{personalInfo.name}</h1>
        <p>{personalInfo.role}</p>
        <p className="mt-2 text-sm">{personalInfo.tagline}</p>
      </header>

      <Section id="menu-drinks" title="Signature Drinks" station="brew-bar">
        {signature.map((p) => <Ticket key={p.slug} project={p} />)}
      </Section>

      <Section id="menu-shelf" title="The Shelf" station="brew-bar">
        {shelf.map((p) => <Ticket key={p.slug} project={p} />)}
      </Section>

      <Section id="menu-about" title="About the Barista" station="menu-board">
        <div className="flex gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- small portrait, rendered in tests outside Next */}
          <img
            src={personalInfo.heroImage}
            alt={`${personalInfo.name}, Barista of the Month`}
            width={96}
            height={96}
            className="h-24 w-24 rounded-md object-cover"
          />
          <div className="space-y-2 text-sm">
            {aboutData.bio.map((para) => <p key={para}>{para}</p>)}
          </div>
        </div>
      </Section>

      <Section id="menu-ingredients" title="Ingredients" station="menu-board">
        {TIERS.map((tier) => (
          <div key={tier} className="py-1">
            <h3 className="font-receipt text-xs uppercase">{tierLabels[tier]}</h3>
            <p className="text-sm">
              {skillsData
                .flatMap((c) => c.skills)
                .filter((s) => s.tier === tier)
                .map((s) => s.name)
                .join(" · ")}
            </p>
          </div>
        ))}
      </Section>

      <Section id="menu-roast-log" title="Roast Log" station="roastery">
        {experienceData.map((e) => (
          <article key={e.title} className="py-2">
            <h3 className="font-bold">{e.title}</h3>
            <p className="font-receipt text-xs">{e.organization} · {e.period}</p>
            <ul className="list-disc pl-5 text-sm">
              {e.description.map((line) => <li key={line}>{line}</li>)}
            </ul>
          </article>
        ))}
      </Section>

      <Section id="menu-wall" title="On the Wall" station="wall">
        <ul className="space-y-1 text-sm">
          {achievementsData.map((a) => (
            <li key={a.title}><strong>{a.title}</strong> · {a.year} · {a.description}</li>
          ))}
          {certificationsData.map((c) => (
            <li key={c.title}><strong>{c.title}</strong> · {c.issuer} · {c.issued}</li>
          ))}
        </ul>
      </Section>

      <Section id="menu-specials" title="Today's Specials" station="specials">
        {specials.length === 0 ? (
          <p className="font-chalk text-xl">Sold out — check back soon.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {specials.map((r) => (
              <li key={r.id}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-bold underline">
                  {r.displayName}
                </a>
                {r.description && <> · {r.description}</>}
                {r.language && <span className="font-receipt text-xs"> · {r.language}</span>}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section id="menu-find-us" title="Find Us" station="checkout">
        <ul className="space-y-1 text-sm underline">
          <li><a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a></li>
          <li><a href={personalInfo.github} target="_blank" rel="noopener noreferrer">{personalInfo.github}</a></li>
          <li><a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">{personalInfo.linkedin}</a></li>
          <li><a href={personalInfo.resumeUrl} target="_blank" rel="noopener noreferrer">Résumé (PDF)</a></li>
        </ul>
      </Section>
    </nav>
  );
}
