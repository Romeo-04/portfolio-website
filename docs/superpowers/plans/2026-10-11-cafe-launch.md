# Café Launch (Build Step 6) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the café the site. Move `/cafe` to `/`, redirect `/cafe` to
`/`, make it indexable, and delete the Flow State site and everything only
it used.

**Architecture:** `app/page.tsx` becomes the café page (what
`app/cafe/page.tsx` is today), and the café fonts move into the root
layout. A permanent redirect in `next.config.ts` keeps old `/cafe` links
working. Flow State files are deleted only when a grep proves nothing else
imports them, the same method as step 1's auth removal.

**Tech Stack:** Next.js 16, React 19.

**Spec:** `docs/superpowers/specs/2026-10-11-coffee-shop-portfolio-design.md`
(build step 6 and the launch gate in section 1; section 8 "Out of scope":
no theme switch back to Flow State).

**Base branch:** `feat/cafe-room`. Branch `feat/cafe-launch` from it.

**Launch gate (spec section 1):** "Toon shading, pour shader, and real
storefront + brew bar models done." Steps 2 to 5 deliver toon shading, the
pour, and built-in toon models of the storefront and brew bar. Whether the
built-in pieces count as "real models", or whether to wait for Blender
files, is the user's call. **This PR is opened as a draft and is not merged
without the user's explicit yes.** Merging it replaces the live site.

## Global Constraints

- `/` serves the café: the server-rendered Quick Order menu plus the 3D
  shell. It is indexable (no `noindex`), and the root layout's canonical,
  JSON-LD and Open Graph stay as they are.
- `/cafe` permanently redirects (308) to `/`, keeping the hash.
- The sitemap still lists only the site root.
- Nothing from Flow State remains: components, hooks, theme store, section
  registry, screenshots, and the `image` field on projects. No theme
  switch (spec section 8).
- Unused dependencies are removed only after a grep proves no user.
- `npm test`, `tsc`, lint and `npm run build` green.
- Commits follow `.claude/skills/git-operations/SKILL.md`. **No
  `Co-Authored-By` trailer or attribution footer.** Do not stage
  `lib/particle-shapes.ts` (the user's work in progress, which stays in
  `lib/`) or `.superpowers/`.

## Review Focus

1. **Old links:** `/cafe`, `/cafe#kislap` and `/#about` (a Flow State
   anchor). Expect the first two to land on the café; the third loads the
   café at the top with no error, because `resolveHash` ignores unknown
   hashes. Checked in Task 2 with curl and the existing `resolveHash`
   tests.
2. **Search engines:** `/` must not carry `noindex`. Checked in Task 2.
3. **Deleted file still imported:** the build fails loudly. The greps in
   Task 1 prevent it.
4. **Fonts:** the café fonts must apply site-wide without the Space fonts
   lingering. Checked in Task 2 by the built HTML's font class names.
5. **The share image and JSON-LD:** still served. Checked in Task 2.

---

### Task 1: Move the café to the root and delete Flow State

**Files:**
- Modify: `app/page.tsx`, `app/layout.tsx`, `next.config.ts`,
  `data/portfolio.ts`, `package.json`, `package-lock.json`
- Delete: `app/cafe/`, Flow State components, hooks and libs, project
  screenshots (exact list built in Step 1)

- [ ] **Step 1: List what only Flow State uses**

Flow State candidates: `components/footer.tsx`,
`components/galaxy-background.tsx`, `components/intro-overlay.tsx`,
`components/marquee.tsx`, `components/orb-navigator.tsx`,
`components/section-heading.tsx`, `components/section-reveal.tsx`,
`components/theme-toggle.tsx`, `components/top-nav.tsx`,
`components/sections/`, `hooks/useActiveSection.ts`, `hooks/useTheme.ts`,
`lib/sections.ts`, `lib/theme.ts`, `lib/intro.ts`, `lib/utils.ts`.

For each candidate, list who imports it outside the candidate set:

```bash
for f in footer galaxy-background intro-overlay marquee orb-navigator section-heading section-reveal theme-toggle top-nav sections/ useActiveSection useTheme lib/sections lib/theme lib/intro lib/utils; do
  echo "== $f"; grep -rln "$f" app components lib hooks data --include=*.ts --include=*.tsx | grep -vE "components/(footer|galaxy-background|intro-overlay|marquee|orb-navigator|section-heading|section-reveal|theme-toggle|top-nav)\.tsx|components/sections/|hooks/use(ActiveSection|Theme)\.ts|lib/(sections|theme|intro|utils)\.ts|app/page\.tsx"
done
```

Expected: no output under any heading, except `lib/intro` hits from
`lib/cafe/intro.ts` paths. Those are a different file (`lib/cafe/intro.ts`);
confirm by reading the hit. If a real outside user appears, stop and
report it.

- [ ] **Step 2: Make `/` the café**

Replace `app/page.tsx` with the café page. Copy `app/cafe/page.tsx` and
remove its `metadata` export, so the root layout's indexable metadata
applies:

```tsx
import CafeShell from "@/components/cafe/cafe-shell";
import QuickOrderMenu from "@/components/menu/quick-order";
import { projectsData } from "@/data/portfolio";
import { drinkRepoNames, selectSpecials } from "@/lib/cafe/specials";
import { getGithubRepos } from "@/lib/github";

export default async function Home() {
  const repos = await getGithubRepos();
  // getGithubRepos already drops githubExclude; here we only hide drinks.
  const specials = selectSpecials(repos, drinkRepoNames(projectsData));
  return (
    <CafeShell specials={specials.map((r) => ({ id: r.id, name: r.displayName, language: r.language }))}>
      <QuickOrderMenu specials={specials} />
    </CafeShell>
  );
}
```

If `app/cafe/page.tsx` differs from this (for example in how specials are
passed), copy its body exactly instead, and report the difference.

- [ ] **Step 3: Move the café fonts into the root layout**

In `app/layout.tsx`:
- Replace the `Space_Grotesk` and `Space_Mono` imports and constants with
  the three font constants from `app/cafe/layout.tsx` (`Caveat_Brush`,
  `Courier_Prime`, `Nunito`, with the same options).
- Delete `themeScript` and its `<script>` tag (Flow State's light/dark
  toggle).
- Change the `<body>` className to
  `` `${chalk.variable} ${receipt.variable} ${cafe.variable} font-cafe min-h-screen bg-[#1b120c] text-[#f5e9da]` ``.
- Keep `metadata`, `personJsonLd` and its script exactly as they are.

In `app/globals.css`, inside `@theme inline`, delete the three lines that
point at the Space fonts (`--font-sans`, `--font-display`, `--font-mono`).
Keep the café `--font-chalk`, `--font-receipt` and `--font-cafe` lines. Do
not delete other CSS in this step.

- [ ] **Step 4: Redirect `/cafe`**

Delete `app/cafe/` (`git rm -r app/cafe`). Replace `next.config.ts` with:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The café lived at /cafe while it was being built; old links still work.
  async redirects() {
    return [{ source: "/cafe", destination: "/", permanent: true }];
  },
};

export default nextConfig;
```

- [ ] **Step 5: Delete Flow State**

```bash
git rm -r components/footer.tsx components/galaxy-background.tsx components/intro-overlay.tsx components/marquee.tsx components/orb-navigator.tsx components/section-heading.tsx components/section-reveal.tsx components/theme-toggle.tsx components/top-nav.tsx components/sections hooks/useActiveSection.ts hooks/useTheme.ts lib/sections.ts lib/theme.ts lib/intro.ts
```

Delete `lib/utils.ts` too only if Step 1 showed no outside user.

- [ ] **Step 6: Remove project screenshots and the `image` field**

In `data/portfolio.ts`, delete the `image` line from the `Project`
interface and from every project entry. Delete `navLinks`,
`categoryColors`, `skillStats` and `siteConfig.favicon` if a grep shows no
user:

```bash
for n in navLinks categoryColors skillStats CategoryColor CategoryIcon; do echo "== $n"; grep -rln "$n" app components lib hooks --include=*.ts --include=*.tsx; done
```

Delete the screenshots that nothing references:

```bash
for f in archeon chichen-itza city-sense merchandise-shop trackhab file globe next vercel window; do echo "== $f"; grep -rln "/$f\." app components lib data --include=*.ts --include=*.tsx; done
```

`git rm` each `public/<name>.<ext>` with no hits. Keep
`Tolentino_Jhezra_1x1Photo.png` and `resume.pdf`.

- [ ] **Step 7: Remove dependencies nothing uses**

For each of `framer-motion`, `lucide-react`, `clsx`, `tailwind-merge`,
`tw-animate-css`:

```bash
grep -rl "<package>" app components lib hooks --include=*.ts --include=*.tsx --include=*.css
```

`npm uninstall <package>` only when there are no hits. Keep everything
else.

- [ ] **Step 8: Verify**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`.
Expected: green. `/` is in the route list and `/cafe` is not.

- [ ] **Step 9: Commit**

```bash
git add -A app components hooks lib/sections.ts lib/theme.ts lib/intro.ts lib/utils.ts data public next.config.ts package.json package-lock.json
git status --short   # lib/particle-shapes.ts must still be untracked
git commit -m "feat: launch the café at the site root" -m "The café replaces Flow State at /, as the spec's build step 6 planned. /cafe redirects to / so preview links keep working, the café fonts become the site fonts, and Flow State's components, theme store, screenshots and unused dependencies are removed (no theme switch, spec section 8)." -m "Verification: tests, tsc, lint and build green."
```

---

### Task 2: Check the launch build

- [ ] **Step 1: Run the production server**

```bash
npm run build && (npx next start -p 3123 >/tmp/launch.log 2>&1 &)
for i in $(seq 1 30); do curl -s -o /dev/null localhost:3123 && break; sleep 1; done
```

- [ ] **Step 2: Check each Review Focus item**

```bash
curl -s localhost:3123/ | grep -c 'name="robots" content="noindex'          # expect 0
curl -s localhost:3123/ | grep -o '<link rel="canonical"[^>]*>'               # expect the jhez-cafe URL
curl -s localhost:3123/ | grep -c 'application/ld+json'                       # expect 1
curl -s localhost:3123/ | grep -c 'id="menu-kislap"'                          # expect 1
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" localhost:3123/cafe  # expect 308 → /
curl -s -o /dev/null -w "%{http_code}\n" localhost:3123/opengraph-image       # expect 200
curl -s localhost:3123/sitemap.xml | grep -c "<loc>"                          # expect 1
curl -s localhost:3123/ | grep -c "space_grotesk\|Space_Grotesk"              # expect 0
```

Then stop the server and make sure port 3123 is free.

- [ ] **Step 3: Record the results** in the PR body. No commit for this
task.

---

### Task 3: Draft PR

- [ ] Trailer scan: `git log origin/main..HEAD --format="%h|%s|%(trailers:key=Co-authored-by,valueonly)"` shows an empty third column.
- [ ] `git push -u origin feat/cafe-launch`
- [ ] `gh pr create --draft --base feat/cafe-room --head feat/cafe-launch --title "feat: launch the café at / (build step 6)"`. The body states the launch-gate question, the Task 2 results, and what merging changes on the live site. No attribution footer.
- [ ] Hand back the draft PR URL. **Do not mark it ready or merge it.**
