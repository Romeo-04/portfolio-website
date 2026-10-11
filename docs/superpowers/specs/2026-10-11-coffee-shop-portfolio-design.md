# Coffee Shop Portfolio — Design

Date: 2026-10-11 · Status: reviewed through 4 grilling rounds, awaiting
final approval

## 1. Intent

**Goal.** Replace the "Flow State" portfolio at `https://jhez-cafe.vercel.app`
with a scroll-driven 3D coffee shop. The visitor walks through the shop like
in a game. Each project is a drink. The details are presented as a café menu.
Reference for the motion quality: https://aengel.io/.

**Audience.** Creative studios and tech recruiters, equally. The experience
must impress, but every project and the contact details must be reachable in
about 10 seconds through the Quick Order menu.

**Decisions.**

| Topic | Decision |
|---|---|
| Art direction | Stylized toon (Ghibli-like): banded shading, ink outlines, painted feel |
| Models | The user models everything in Blender |
| Structure | One continuous 3D world, camera on a scroll-driven rail |
| Where it is built | On `main` at a hidden `/cafe` route (`noindex`). Flow State stays at `/` until launch |
| Launch gate | Toon shading, pour shader, and real storefront + brew bar models done (end of build step 3 plus those models). Then a small PR moves `/cafe` to `/` and deletes Flow State |
| Project visuals | Screenshots removed. Each project's drink is its visual everywhere |
| Signature drinks | Kislap, KitaKo, Archeon, CitySense Live Geo. All other projects on the shelf |
| Phones | Quick Order menu is the page, with a "Step inside the café" button that loads light 3D |
| Reduced motion | Full café, but cuts between stations instead of glides; no shake or parallax. Intro still plays (keeps commit `8b5b0dc`) |
| Skills | Tiers, not percentages (see 2.1) |
| Sound | Not in v1. Planned as a later polish pass |
| Dead code | Delete `components/auth/*`, `components/context/AuthProvider.jsx`, `api/client.js`, `@supabase/supabase-js` |
| Domain | `jhez-cafe.vercel.app` (done, with SEO and Search Console) |

**Success criteria.**
- A first-time visitor understands "coffee shop = portfolio" in the intro.
- All content in `data/portfolio.ts` is reachable both in 3D and in the
  Quick Order menu.
- Load to interactive under about 5 MB. 60 fps on a mid-range laptop.
- The SEO work stays intact: canonical, JSON-LD, sitemap, indexable text.

## 2. The journey

About 7 viewport heights of scroll. Each station is a camera stop with a
dwell zone where its animation plays. Each station has a URL hash
(`/#storefront`, `/#menu-board`, `/#brew-bar`, `/#wall`, `/#roastery`,
`/#specials`, `/#checkout`). Each signature drink also has one (`/#kislap`).
Opening a hash link skips the intro and glides the camera there.

| # | Station | Content | Scroll animation |
|---|---|---|---|
| 0 | Intro (auto, skippable, once per session) | name, role | Machine pressure gauge = real load progress; steam particles form the name |
| 1 | Storefront (rainy night) | tagline | Door swings open, warm light, camera pushes in |
| 2 | Menu board | about, skill tiers, photo | Chalk text draws line by line. Photo in a "Barista of the Month" frame |
| 3 | Brew bar | 4 signature drinks + shelf | Each signature cup pours its layers. Shelf cups behind the bar. Click any cup = order ticket |
| 4 | Wall of fame | achievements, certifications | Frames swing in and settle |
| 5 | Roastery | experience | Beans roast green → dark along a conveyor; one batch per role |
| 6 | Specials case | live GitHub repos | Case lights on, repos slide in on trays |
| 7 | Checkout | contact, résumé, socials | Receipt printer prints the contact details; tip jar = socials |

World mood: night and rain outside, amber light inside, steam as the
signature motif.

### 2.1 Skill tiers (menu board)

- **House Blend (daily use):** Python, TypeScript, JavaScript, React, Next.js,
  Tailwind CSS, HTML/CSS, SQL, PostgreSQL, Git/GitHub, Vercel
- **Seasonal (comfortable):** Node.js, Prisma, Supabase, MySQL, SQLite, Java,
  C++, NumPy, Pandas, Jupyter
- **Experimental (learning):** PyTorch, Scikit-learn, Matplotlib, MATLAB

`Skill.level` is replaced by `Skill.tier: "house" | "seasonal" | "experimental"`.

### 2.2 Signature drinks

| Drink | Framing on the ticket | Data changes |
|---|---|---|
| **Kislap** | Free in-browser reading game for Filipino Grade 1–3 children; on-device speech model checks each word. Role: Lead Developer · team of 4 | **New entry.** Written from the repo README, reviewed by the user. Demo: romeo-04.github.io/kislap (mirror kislap.vercel.app). Stack: React 19, Vite, TypeScript, Transformers.js, PWA |
| **KitaKo** | The research drink: leads with the thesis question (linguistic and cultural gaps in AI) and the user's research work, not the website | Reword pitch and bullets to put the research first |
| **Archeon** | AI architectural memory. Ticket has a "how it works" diagram: ingestion → two-pass query → confidence tags. Role: Lead Developer · Cognee hackathon team of 4 | `role` updated; `demoUrl` = `https://kishiagaytano.github.io/archeon/` |
| **CitySense Live Geo** | As in current data | `featured` used for signature status (see 3) |

iJoin is not a signature drink. It is not in the data now and is not added
in v1. Its repo README stays as is.

### 2.3 Secret drink

A full loyalty card (7 stamps) unlocks "Off the Clock": a personal card with
hobbies, the user's real coffee order and a fun fact. Content provided by
the user before build step 4.

### 2.4 Specials case

The 6 most recently pushed public repos from `lib/github.ts`, excluding
forks, repos shown as drinks, and a user-editable list in
`data/portfolio.ts`:
`specialsExclude = ["Romeo-04", "portfolio-website", "neetcode-submissions", "LeetCodeSolutions"]`
plus coursework repos the user adds. If the fetch fails: "sold out" sign.

## 3. Architecture

### Stack
- `@react-three/fiber` + `@react-three/drei` on the existing `three`.
- `gsap` (ScrollTrigger) + `lenis` for smooth scroll and timelines.
- `@react-three/postprocessing` for outline, bloom and grain.
- `framer-motion` (existing) for HTML UI only.

### Units

| Unit | Responsibility | Depends on |
|---|---|---|
| `lib/cafe/stations.ts` | Station registry: id, hash, label, camera position, look-at target, scroll range. Replaces `lib/sections.ts` at launch | — |
| `lib/cafe/scroll.ts` | Owns `scrollProgress` (0–1), `stationProgress(id)` (local 0–1), and `goTo(id)` for hash links and menu clicks. Only source of scroll truth | Lenis, stations |
| `lib/cafe/motion.ts` | Reduced-motion mode: `goTo` cuts instead of glides; shake and parallax off | scroll |
| `lib/cafe/drinks.ts` | Maps a project to its drink: cup type, layers (from `techStack`), foam-art mark. Optional per-project `drink` override | `data/portfolio.ts` |
| `components/cafe/scene.tsx` | Canvas, lights, post-processing, quality scaling | R3F |
| `components/cafe/camera-rig.tsx` | Moves the camera along the spline through the stations | scroll, stations |
| `components/cafe/stations/*.tsx` | One component per station. Reads only its own `stationProgress` | scroll, data |
| `components/cafe/materials/toon.ts` | Shared toon material (gradient map) | three |
| `components/cafe/shaders/pour.ts` | Liquid shader: `fill` uniform + layer colour bands | three |
| `components/cafe/model.tsx` | Loads a `.glb`; shows a placeholder box until loaded or on error | drei `useGLTF` |
| `components/menu/quick-order.tsx` | Server-rendered HTML menu of all content. Always in the DOM | data, drinks |
| `components/menu/drink-illustration.tsx` | 2D SVG drink drawn from `drinks.ts` data | drinks |
| `components/hud/*` | Loyalty card, order rail, skip intro | scroll, stations |

Rule: stations never read each other or the raw scroll position. They get
their local progress only. The menu, HUD, hash links and camera use the same
registry.

### Data changes (`data/portfolio.ts`)
- `Project.image` removed; public screenshots deleted at launch.
- `Project.featured` means "signature drink". Exactly 4 are `true`.
- `Project.drink?` optional override: cup type and layer colours.
- `Skill.level` → `Skill.tier`.
- New Kislap entry; KitaKo and Archeon updates (2.2).
- New `specialsExclude` list and `offTheClock` content (2.3, 2.4).

### Asset pipeline
- Blender → `.glb` → `gltf-transform` (Draco geometry, KTX2 textures) →
  `public/models/`.
- Lighting baked into textures where possible.
- One room file plus separate prop files. Placeholders until each file
  exists.
- `.blend` source files stay out of the repo.

### Performance
- Under about 5 MB to interactive. Intro + machine load first. The rest
  streams in during the intro.
- drei `PerformanceMonitor` lowers DPR and turns off effects below 50 fps.
- Phones: light 3D only on request (lower DPR, no post-processing except
  outlines).

## 4. Quick Order menu and HUD

**Quick Order.** A paper menu that slides in from the right (ticket button or
`M` key). On phones it is the page. Sections: Signature Drinks, The Shelf
(other projects), About the Barista, Ingredients (skill tiers), Roast Log
(experience), On the Wall (honors, certificates), Today's Specials (GitHub),
Find Us (contact, résumé). Each project card shows its 2D drink illustration.
Clicking an item calls `goTo` for that station. It is server-rendered HTML
that is always present, so it is the content for search engines and screen
readers.

**HUD.** Loyalty card with 7 stamps (saved in `localStorage`; full card
unlocks the secret drink), order rail of visited stations (click to jump),
skip intro.

**Typography.** Chalk handwriting for the menu board, receipt monospace for
tickets and receipts, a warm rounded sans for UI text. Specific Google Fonts
chosen in build step 1, loaded with `next/font`.

## 5. Failure behaviour

| Failure | Behaviour |
|---|---|
| No WebGL or 3D chunk fails | Quick Order menu is the page, with "the café is closed today ☕" |
| A model fails to load | Its placeholder box stays |
| GitHub fetch fails | Specials case shows "sold out" |
| Slow network | Intro gauge shows real load progress |

## 6. Verification

- Each change: `tsc`, lint, `next build` (see the `git-operations` skill).
- Playwright screenshots of the Vercel preview of `/cafe` at fixed scroll
  positions, desktop and mobile widths.
- Lighthouse performance and SEO on the menu-only (mobile) version.
- At launch: canonical, JSON-LD and sitemap still present at `/`; `/cafe`
  redirects to `/`.

## 7. Build order

1. Data changes (2.1–2.4, 3), dead-code removal, `/cafe` route with
   placeholder scene, camera rail, scroll engine, hash links, Quick Order
   menu, fonts.
2. Toon material, outlines, pour shader, drink illustrations.
3. Station animations, one at a time, including reduced-motion behaviour.
4. HUD and the secret drink.
5. Blender models swapped in as they are ready.
6. Launch: when the gate in section 1 is met, move `/cafe` to `/` and delete
   Flow State.

## 8. Out of scope

- Theme switch back to Flow State.
- Sound (later polish pass).
- Toon barista character (possible later).
- Separate pages per project.
- CMS or database-driven content. Content stays in `data/portfolio.ts`.
- iJoin entry and README rewrite.
