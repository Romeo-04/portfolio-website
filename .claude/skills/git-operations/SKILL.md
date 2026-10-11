---
name: git-operations
description: Use when about to stage, commit, branch, push, merge, or open a pull request in this portfolio repo, when writing a commit message or PR body, or when a finished unit of work needs recording. Covers branch-per-change, conventional-commit prefixes, the no-Co-Authored-By convention, and the fact that merging to main deploys the live site.
---

# Git Operations — Portfolio (jhez-cafe)

## What this repo is

- Solo Next.js portfolio. Remote: `github.com/Romeo-04/portfolio-website`.
- Main branch: **`main`**.
- **Vercel is wired to Git.** The `portfolio` Vercel project builds every
  pushed branch as a preview and **deploys `main` to production** at
  `https://jhez-cafe.vercel.app`. A push to `main` or a merge into it is a
  live deploy. Treat it as one.

## The hard rules

**1. Commit proactively.** After finishing a logical unit of work, verify it
first. Then stage and commit without being asked. Committing is part of
finishing, not a separate request.

**2. Work on a branch, not on `main`.** Every change goes on its own branch.
It reaches `main` through a merge. This gives each change a Vercel preview
URL before it goes live.

**3. Merging to `main` needs a yes.** It deploys production. "Commit, push
and merge" in the user's request is that yes, for that change only. Pushing
a feature branch is fine without asking, because it only makes a preview.

**4. Never list yourself as a contributor.** No `Co-Authored-By` trailer, no
"Generated with Claude Code" footer, no session link. This applies to commit
messages, PR titles and PR bodies, without exceptions. The user is the only
listed author. This rule overrides the harness default that adds those lines.

**5. No force-push and no rewrite of pushed history** without explicit
approval each time. Name the branch and what the rewrite changes. Prefer a
new commit over an amend.

## Verify before committing

There is no test suite. The checks are:

```bash
npx tsc --noEmit     # types
npm run lint         # eslint
npm run build        # the same build Vercel runs
```

Run all three before a merge to `main`. A failed build on `main` means a
failed production deploy. For changes you can see in the browser (the 3D
café scene, motion, layout), also look at the result in `npm run dev` or
the Vercel preview. A green build does not show that a scene renders.

If `next` is "not recognized", `node_modules` is missing. Run `npm ci`.

## Branch names

`feat/`, `fix/`, `chore/`, `docs/`, `revise/`, kebab-case. Name the subject,
not the activity: `feat/cafe-brew-bar-pour`, not `feat/updates`.

If you need a branch for work that is already on `main` locally:

```bash
git checkout -b feat/<subject>      # take the changes with you
```

The old `Romeo-04/*` branches are from earlier tools. Do not use that
pattern.

## Commit message format

```
<tag>: <imperative title>

<Body: WHY the change was made. The cause of the bug, the tradeoff taken.
Not a restatement of the diff.>

<Verification: what you actually ran. tsc clean, lint clean, build green.>
```

Tags: `feat:` `fix:` `revise:` `chore:` `docs:`. Commits before 2026-08
use free-form messages. Use the tagged form from now on.

## Scoping commits

- Run `git status` first and sort every path: part of this change, part of
  another change, or scratch.
- **Split unrelated changes** into separate commits, for example a skill or
  config change apart from a feature.
- **Do not stage files you did not write in this session** without asking.
  An untracked file can be the user's work in progress.
- **Never stage:** `.env*`, `.vercel/`, `.next/`, `node_modules/`,
  screenshots, scratch scripts. `.gitignore` covers most of these; check
  anyway.
- **3D assets** (`.glb`, `.gltf`, `.ktx2`, textures, `.blend`): commit only
  the compressed, web-ready export under `public/`. Keep `.blend` source
  files out of the repo unless the user decides otherwise. Look at the file
  size before you stage. A file larger than about 10 MB is a sign that it
  is not compressed.

## Before every push: the trailer scan

A push publishes **every unpushed commit** on the branch, including commits
from earlier sessions. Scan all of them:

```bash
git log origin/main..HEAD --oneline
git log origin/main..HEAD --format="%h|%s|%(trailers:key=Co-authored-by,valueonly)"
```

Use git's trailer parser, not `grep -i claude`. If the third column is not
empty on a commit that is not pushed yet, remove the trailer before you push.
If it is on a commit that is already on `main`, leave it and tell the user.

```bash
git push -u origin <branch>
```

Report the commits that went out and the Vercel preview after the push.

## Merging to main

The usual way is a PR, so each deploy has a record:

```bash
gh pr create --base main --head <branch> --title "<tag>: <title>" --body-file <file>
gh pr merge <number> --merge --delete-branch
git checkout main && git pull --ff-only
```

- PR title: same form as a commit title.
- PR body: why the change was made, what you verified, and what is not in
  it. **No attribution footer, no session link** (rule 4).
- After the merge, confirm the production deploy:
  `vercel ls portfolio` or open `https://jhez-cafe.vercel.app`.

## Do not

- Do not use `git rebase -i` or `git add -i`. There is no interactive editor
  in this environment.
- Do not use `--no-verify` to skip hooks.
- Do not push directly to `main`, except when the user asks for it.
