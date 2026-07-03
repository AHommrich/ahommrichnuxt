# Repo Uplift Plan — ahommrichnuxt

> **Status: COMPLETE — 7 of 7 stages done.** Stage 7 resolved to Option C
> (keep history, use Conventional Commits from now on). Nothing left to
> action; this document is kept as a record of the uplift and can be
> deleted or moved to `docs/` whenever it stops being useful.

---

## ▶ Session handoff (as of 2026-07-03, uplift complete)

All seven stages are done. Stage 7 was resolved to Option C on 2026-07-03:
history stays as-is, Conventional Commits are the going-forward rule.
No further stages remain; the document below is preserved for reference.

### Progress snapshot

| Stage                                       | Status        | Notes                                                                                                           |
| ------------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------- |
| 1 — Baseline (typecheck, .editorconfig)     | ✅ committed  | `chore(tooling): add typecheck script, vue-tsc, and .editorconfig`                                              |
| 2 — Docker/Node consistency                 | ✅ committed  | `build(docker): upgrade Node to 20 and use npm ci for reproducible …`                                           |
| 3 — README rewrite (EN + DE + screenshots)  | ✅ committed  | `docs(readme): rewrite README from starter boilerplate (EN + DE)`                                               |
| 4 — Vitest setup + 23 specs                 | ✅ committed  | `test(vitest): add setup and animation specs (23 tests total)`                                                  |
| 5 — CI workflow + Dependabot + badge        | ✅ committed  | `chore(format): apply Prettier to legacy files and add .prettierignore` (Prep + Stage 5 folded into one commit) |
| 6 — DSGVO fix + Docblock sweep              | ✅ committed  | `docs(privacy): correct hosting/proxy statement + refresh doc comments` (folded; see notes below)               |
| 7 — Commit history cleanup                  | ✅ resolved   | **Option C chosen (2026-07-03):** history kept as-is, Conventional Commits going forward. No rewrite performed. |

**Last commit at handoff:** _to be filled in by André after Stage 6 is committed_ (previous: `e7edf85`).

**Working tree:** clean once Stage 6 is committed.

**CI status:** GitHub Actions was set up in Stage 5. Local `npm run lint`,
`npm run typecheck`, `npm test` (23/23) all green as of Stage 6 close.

### What Stage 6 did

1. **`pages/datenschutz.vue`** — replaced the Caddy claim in section 2 (Hosting)
   with a factually correct paragraph naming Traefik under Coolify and drawing
   a line between proxy-level (can process IPs briefly for operations) and
   app-level (Nuxt writes no access logs). Also added Serverstandort
   „Nürnberg, Deutschland" and a „Stand: Juli 2026" line at the bottom of
   the page. **Note on log wording:** André confirmed 2026-07-03 that he
   can't currently see the Traefik log configuration in Coolify. The new
   text was chosen deliberately not to claim „no access logs" at the proxy
   level — this is honest and DSGVO-safe. If it later turns out Traefik is
   in fact silent, the wording can be tightened.

2. **`CLAUDE.md`** — corrected two stale sections:
   - Deployment line: „Docker + Caddy" → „Docker + Coolify (Traefik reverse proxy)".
   - Icon count: „21 Stück" → „24 Stück" (also list refreshed to include `mariadb`, `nuxtdotjs`, `vite`).
   - Subpixel-fix CSS block: replaced the outdated snippet (`outline: 1px solid transparent`, `scale(1.005)`) with the current one (`margin: -1px`, `isolation: isolate`, `scale(1.01)`).

3. **`components/AppTechSection.vue`** — added a short header comment above
   the physics constants block explaining how FLEE_FORCE, DAMPING and
   MIN_SPEED interact (why changing one requires re-tuning the others),
   and rewrote the inline comments on those four constants to link the
   chosen values to the observed behaviour instead of just restating what
   each variable does.

4. **`components/AppHeader.vue`** — untouched. Every non-obvious detail
   (iOS momentum-scroll rAF, matchMedia mobile gate, scaleX-vs-width choice,
   dual-mechanism IO+rAF) already had a comment explaining its WHY.

5. **`components/AppHeroSection.vue`** — the subpixel-fix comment was
   stale: it still referenced `outline: 1px solid transparent` and
   `scale(1.005)`, but the CSS block underneath already used `margin: -1px`
   + `isolation: isolate` + `scale(1.01)`. Rewrote the comment to describe
   the current four-piece combo and its role, and added a note that the
   values are load-bearing on iOS Safari.

### Non-obvious context still relevant

Things the next agent will NOT infer from code alone:

1. **Deployment is Coolify + Traefik on Hetzner Nürnberg.** The `Caddyfile`
   and `docker-compose.yml` in the repo are legacy — Coolify builds directly
   from the `Dockerfile`. Both files are still flagged for removal in
   Follow-ups but were left in place during Stage 6 (out of scope).

2. **`@nuxt/test-utils` v4 is installed as devDep but unused** — see the
   Follow-up. Vitest is wired up standalone via `@vitejs/plugin-vue`.

3. **`AppHeader.vue` had `onBeforeMount` used without an explicit import** —
   masked by Nuxt auto-import. Fixed in Stage 4's commit. Similar latent
   auto-import dependencies could still exist elsewhere; a lint pass in a
   non-Nuxt env is a possible follow-up but out of Stage 7's scope.

4. **Screenshots are committed under `docs/screenshots/`.**
   Four files: `hero-desktop.png`, `tech-info-mode-desktop.png`,
   `hero-mobile.png`, `tech-info-mode-mobile.png`.

5. **Conversation is in German, artifacts (code, docs, commit messages) in
   English.** No `Co-Authored-By: Claude` footer. Conventional Commits.

6. **Handoff protocol per stage** — see the section below "Per-stage handoff
   protocol". Short: agent finishes stage, provides a 3-line commit message,
   waits for André to commit manually, then next stage.

### Stage 7 resolution (2026-07-03)

**Choice: Option C — keep history, only fix future commits.**

Rationale André gave when picking: the `asdf`-style commits are honest
project history for a solo-owned portfolio repo. A force-push on `main`
to rewrite them carries more downside (risk, lost context) than upside
(cosmetic log). Going forward every commit follows Conventional Commits
per the section further below.

**Consequences:**

- No backup branch was created (none needed).
- No `git filter-branch`/`rebase -i`/force-push was executed.
- Old commit messages remain visible on GitHub.
- The seven Uplift-era commits (`891e9d2` … `2598c48`) already follow
  Conventional Commits and establish the going-forward style.

---

## Context

`ahommrichnuxt` is a **static personal portfolio site** — no backend logic, no user
accounts, no forms, no analytics, no cookies. It runs on Nuxt 3 + Vue 3 + Tailwind v4,
deployed via Docker + Coolify (Traefik reverse proxy) under `ahommrich.de`. There is
one unlisted route `/lebenslauf` used to print André's CV — public but not linked,
intentionally simple.

The goal of this plan is **presentability + regression-safety for the animations**, not
a security program. The Eventplaner project has a full Laravel backend and warrants
Sub-Processor registers, CSPs, SECURITY.md, PR templates. This repo does not.

**Out of scope on purpose:**

- Security-Headers middleware / CSP (no forms, no auth, no third-party JS)
- Sub-processor register (only Hetzner; already named in the privacy page)
- Cookie banner (no cookies, no tracking)
- SECURITY.md, PR template, CONTRIBUTING.md (solo repo)
- Playwright (no interaction-heavy business flows — animations are covered by Vitest)
- Multi-language README (English is enough)
- New pages, layout changes, animation tweaks

---

## Ground rules for the executing agent

- **No git actions.** No `commit`, no `push`, no `branch`, no `merge`. André runs git himself.
- **No deploys.** Ever. Not even a dry-run. Deployment happens off-agent.
- **Destructive ops require an explicit go-ahead** and a backup branch proposal first
  (relevant for Stage 7 only).
- **Conversation in German, artifacts in English** — docs, code comments, commit messages.
- **No scope creep.** If a stage reveals something worth doing outside its scope,
  note it as a follow-up in this file, do not act on it.
- **Node 20** for all local commands (`.nvmrc`). In Claude Code bash sessions use the
  absolute path (see CLAUDE.md).
- One stop point per stage. Wait for André's approval before moving on.

### Per-stage handoff protocol

At the end of each stage the agent produces:

1. **Short status report** — what changed, test/build output tail, any follow-ups added.
2. **A ready-to-paste commit message** in this exact shape:

   ```
   type(scope): imperative subject ≤ 72 chars

   One or two sentences explaining the WHY, not the what.
   Optional reference to a follow-up or the next stage.
   ```

   Rules: Conventional Commits type (`feat`, `fix`, `chore`, `docs`, `test`, `ci`,
   `build`, `refactor`), imperative mood, no `Co-Authored-By` footer, no emoji.

3. **Wait.** André commits manually, then gives the green light for the next stage.

### Autonomy boundaries — where the agent MUST stop and ask

Everywhere else, the agent proceeds without asking. But at these three points a
question is required, not a judgement call:

- **Stage 3 (README):** first draft goes to André for wording review before commit.
- **Stage 4 (Vitest):** if a spec would require rewriting a component to be
  testable, stop and ask — do not silently skip and do not refactor.
- **Stage 7 (History cleanup):** Option A / B / C is André's decision. Agent
  produces the concrete script + backup-branch proposal and waits.

---

## Commit conventions (applies when André commits, not the agent)

- English, Conventional Commits: `feat(...)`, `fix(...)`, `docs(...)`, `test(...)`,
  `chore(...)`, `ci(...)`, `refactor(...)`, `build(...)`.
- Subject ≤ 72 chars, imperative mood.
- Body explains **why**, not what.
- No `Co-Authored-By: Claude` footer.
- One commit per logical change.

---

## Stage 1 — Baseline (typecheck + `.editorconfig` + TS strictness check)

**Why:** ESLint + Prettier are already wired up and working. What's missing is a type
gate and a small consistency file. `tsconfig.json` currently only extends the Nuxt
default — verify whether `strict` is already effective via that inheritance before
adding overrides.

**Tasks:**

1. Add `.editorconfig` at repo root (UTF-8, LF, 2 spaces, trim trailing whitespace,
   final newline).
2. Add `typecheck` npm script running `nuxt typecheck` (installs `vue-tsc` as devDep
   if not already present via Nuxt).
3. Run `npm run typecheck` once to confirm the current tree passes. If it doesn't,
   list the errors — do not fix silently.
4. Confirm `strict: true` is effective (either already inherited from Nuxt's tsconfig
   or add a minimal override in `tsconfig.json`).

**Do not:** change existing ESLint rules, reformat files, touch existing code.

🛑 **Stop.** Report: added files, typecheck output, whether strict was already active.

---

## Stage 2 — Docker / Node consistency

**Why:** `.nvmrc` says Node 20, `Dockerfile` uses Node 18 (EOL April 2025). Builds are
non-reproducible because of `npm install` instead of `npm ci`. `docker-compose.yml` has
a placeholder image name.

**Tasks:**

1. `Dockerfile`: `FROM node:18-alpine` → `FROM node:20-alpine`.
2. `Dockerfile`: `npm install` → `npm ci`.
3. `docker-compose.yml`: replace `image: your-nuxt-app-image` with a sensible name
   (e.g. `ahommrichnuxt:local`) or remove the `image:` line entirely if `build:` is
   sufficient — decide based on what the current Hetzner deploy actually pulls.
4. `docker compose build` locally to verify the image still builds.

**Do not:** touch Caddyfile, TLS config, network setup, ports.

🛑 **Stop.** Report: three file diffs, local build output tail.

---

## Stage 3 — README rewrite (EN + DE) + optional `.env.example`

**Why:** The current README is the Nuxt starter boilerplate. For a portfolio repo this
is embarrassing — visitors on GitHub see it before the code. Target quality bar:
the local **Eventplaner** README at `/Users/andrehommrich/Repos/eventplaner/README.md`
(+ `README.de.md`).

**Structure to mirror from Eventplaner (adjusted for portfolio scope):**

| Eventplaner section                                  | Portfolio equivalent                                                                               | Keep?                                     |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Title + badges + one-liner + language switcher       | Same                                                                                               | ✅                                        |
| Screenshots                                          | Screenshots or animated GIFs of Hero/Tech                                                          | ❓ needs decision at stage start (see Q1) |
| Feature highlights (numbered, links to central file) | Same, portfolio-flavoured                                                                          | ✅                                        |
| Tech stack table                                     | Same                                                                                               | ✅                                        |
| Quick start                                          | Same (npm-based, not Docker for local dev)                                                         | ✅                                        |
| Architecture (short) + link to `ARCHITECTURE.md`     | Skip the `ARCHITECTURE.md` — code is small enough. Keep a short 3–5 line architecture note inline. | ✅ (inline only)                          |
| Tests table + coverage note                          | Same (after Stage 4 ships)                                                                         | ✅                                        |
| Companion app                                        | N/A — drop                                                                                         | ❌                                        |
| GDPR / data protection                               | Short bullet list: no cookies, no analytics, no external assets, imprint + privacy links           | ✅ (shortened)                            |
| License                                              | Depends on Q2                                                                                      | ❓                                        |

**Feature highlights — candidate list (final list decided when writing):**

Sorted "engineering-interesting → UX-polish", each with a link to the file that
implements it:

1. **rAF physics with flee-from-pointer + info-mode** in `AppTechSection.vue` —
   replaces GSAP for performance; touch vs pointer separation, IO-paused loop, cached
   document-relative positions. → `components/AppTechSection.vue`
2. **Hero diamonds grid** — desktop uses a rotated 8-tile grid, mobile falls back to
   stacked squares with a documented subpixel-gap fix (translateZ + backface-hidden).
   → `components/AppHeroSection.vue`
3. **Header slider with IntersectionObserver-driven active section** — recently
   perf-tuned for mobile. → `components/AppHeader.vue`
4. **Printable CV route** at `/lebenslauf` — unlisted (`robots: noindex`), print-optimised
   layout. → `pages/lebenslauf.vue`
5. **Zero third-party runtime** — no analytics, no CDNs, no Google Fonts. FontAwesome
   bundled locally + tree-shakeable. → `nuxt.config.ts`, `plugins/fontawesome.client.js`
6. **Tailwind v4 via `@tailwindcss/vite`** — no `tailwind.config.js`, theme lives in
   CSS. → `assets/css/main.css`, `nuxt.config.ts`

**Sections that MUST be present in both languages:**

- Title, one-liner, screenshots block, feature highlights, tech stack, quick start,
  architecture note, tests, GDPR, license, language switcher.
- Language switcher line goes right below the badges: EN links to `README.de.md`
  („🇩🇪 Auch auf Deutsch verfügbar: [README.de.md](README.de.md)"), DE mirrors it
  back to `README.md` („🇬🇧 Also available in English: [README.md](README.md)").
- Headings translated, not copied. Body prose is genuinely rewritten, not
  machine-translated.

**Questions to answer at stage start (agent must ask, do not guess):**

- **Q1 — Screenshots:** should we ship 2–3 screenshots (e.g. Hero desktop, TechSection
  info-mode, mobile view) under `docs/screenshots/`? Or link the live site and skip
  screenshots?
- **Q2 — License:** add `LICENSE` file? Eventplaner uses MIT. For a portfolio the
  choice is between MIT (encourages reuse of individual components) and "All rights
  reserved / no license" (default without file — signals "look, don't fork").

**Also to do in this stage:**

- Skip `.env.example` — there are no env vars in use. If Stage 5 (CI) introduces one,
  add it there.
- Do **not** add CI badge yet — that gets added at the end of Stage 5.

🛑 **Stop.** Show both READMEs, wait for wording feedback. Iterate before commit.

---

## Stage 4 — Vitest + animation specs

**Why:** The animations (Hero diamonds grid, TechSection physics with flee behaviour +
info-mode grid, Header slider) are the meaningful engineering work in this repo. They
have burned time before (mobile subpixel gap, touch vs pointer, info-mode transition
ordering — see CLAUDE.md). Small regression guards are worth their weight.

**Tasks:**

1. Install Vitest + `@nuxt/test-utils` + `@vue/test-utils` + `happy-dom` as devDeps.
2. Add `test` and `test:watch` scripts.
3. Add a minimal `vitest.config.ts` with Nuxt env.
4. Write 3–5 targeted specs (**not coverage-driven**). Suggested targets — final
   selection depends on what's actually testable without mocking too much:
   - `AppTechSection.vue`: flee-radius math (pure function extraction OK if it
     already exists as a helper — otherwise test observable behaviour via
     component instance).
   - `AppTechSection.vue`: info-mode grid width calculation (`gridCardW`).
   - `AppHeader.vue`: IntersectionObserver-driven active-section state (mock IO).
   - `AppHeroSection.vue`: mobile-diamonds wrapper renders with the subpixel-fix
     class present.
   - Any composable that exists (there are none right now — skip if still true).
5. Run once — all green before finishing the stage.

**Do not:** refactor components to make them testable in ways that change behaviour.
If a component is genuinely untestable without a rewrite, note it as a follow-up and
skip that spec.

🛑 **Stop.** Report: number of specs written, test output, which planned specs were
skipped and why.

---

## Stage 5 — Minimal CI + Dependabot

**Why:** A portfolio repo without a green CI badge on GitHub reads as unfinished.
Dependabot keeps FontAwesome / Nuxt / Tailwind from silently rotting.

**Tasks:**

1. `.github/workflows/ci.yml`: single job on `ubuntu-latest`, Node 20, npm cache,
   runs `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test`. Triggers on
   `push` (all branches) and `pull_request`.
2. `.github/dependabot.yml`: weekly, groups for `npm` (all deps) and `github-actions`.
3. Add CI badge to top of `README.md` once the first run is green.
4. Do NOT add release / publish workflows. Do NOT add a deploy workflow — deploys
   stay manual on Hetzner.

🛑 **Stop.** Report: workflow file, first CI run URL (once André pushes), badge
added yes/no.

---

## Stage 6 — Docblock sweep (comments only, no code changes)

**Why:** A few non-obvious constants and ordering decisions live in
`AppTechSection.vue`, `AppHeader.vue`, `AppHeroSection.vue`. Adding short function
headers makes the intent readable in 6 months without needing to reverse-engineer.

**Hard constraint:** **Comments only.** No renaming, no reformatting, no
extracting helpers, no reordering. If a function looks like it needs refactoring,
note it as a follow-up and move on.

**Tasks:**

1. Walk `AppTechSection.vue`, `AppHeader.vue`, `AppHeroSection.vue`. For each
   non-trivial function or `ref`/`reactive` block, decide: is the WHY obvious?
   If yes → skip. If no → add a one-line or short block comment above.
2. Focus areas (from CLAUDE.md):
   - `FLEE_RADIUS`, `FLEE_FORCE`, `DAMPING`, `MIN_SPEED` — link the values to the
     observed behaviour, not just restate them.
   - Info-mode transition ordering (why `will-change` set before, `infoMode.value`
     set in next `rAF`).
   - IntersectionObserver pause of the rAF loop.
   - Scroll-handler pointer reset (prevents flee-on-scroll).
   - Touch vs pointer separation on mobile.
   - Mobile diamonds subpixel fix in `AppHeroSection.vue`.
3. English, terse. No explanations of "what" — only "why".

🛑 **Stop.** Show diff. If any function was flagged for follow-up, list them here
under the "Follow-ups" section.

---

## Stage 7 — Commit history cleanup (DESTRUCTIVE — explicit go-ahead required)

**Why:** History has entries like `asdf`, `seo`, `mobile opti`, mixed German/English,
no Conventional Commits. For a portfolio repo, `git log` is part of the product.

**This stage rewrites `main`.** It requires:

- A backup branch (`backup/pre-cleanup-<date>`) pushed to `origin` first
- André's explicit go-ahead in writing after seeing the exact plan
- André runs the git commands himself (agent produces the script, does not execute)

**Approach options (agent proposes, André picks):**

- **A. Interactive rebase-squash into chapter commits** — group current commits into
  logical chunks (`chore: initial project setup`, `feat: hero section`,
  `feat: about section`, `feat: tech section`, `perf: header slider`,
  `docs: privacy + imprint`, etc.). Preserves rough history.
- **B. Squash-all to a single initial commit + start Conventional Commits going
  forward.** Cleanest, but loses granular history.
- **C. Keep history as-is, only fix future commits.** Safest, no rewrite.

**Regardless of option:**

- Backup branch pushed and confirmed present on GitHub before any rewrite.
- Force-push only after André confirms the rewritten log is what he wants.
- Never force-push without `--force-with-lease`.

🛑 **Stop before any git action.** Agent prepares the script + preview, waits for
André.

---

## DSGVO sanity check (folded into Stage 3 or 6 — no dedicated stage)

The current `pages/datenschutz.vue` is complete for a no-tracking, no-cookies static
site. During Stages 3 or 6, do one pass:

- Add "Stand: <month year>" line at the top or bottom.
- Verify "Server-Logs" wording is accurate (Caddy access logs off, container logs
  ephemeral, 15 MB cap).
- Confirm imprint has `Berufsbezeichnung` if legally required for a Fachinformatiker
  portfolio (usually not — check).

No new sections. No new pages.

---

## Follow-ups (populated as stages surface non-scope items)

- [ ] Stage 2: Add a `.dockerignore` to keep `node_modules`, `.nuxt`, `.output`,
      `.git`, and local logs out of the build context. Not required for correctness
      (`npm ci` overwrites anything staged), but cuts image build time and prevents
      local state from leaking into the deployed container.
- [x] ~~**HIGH PRIORITY (Stage 6):** `pages/datenschutz.vue` — Caddy claim
      corrected to Traefik-under-Coolify, Serverstandort Nürnberg added,
      Stand-Zeile eingefügt.~~ Traefik log behaviour still not confirmed;
      wording chosen to be honest (does not claim „no access logs" at proxy
      level) so no follow-up needed unless André wants to tighten it later.
- [ ] Cleanup: Remove `Caddyfile` — legacy, superseded by Coolify/Traefik.
- [ ] Cleanup: Remove `docker-compose.yml` — legacy, Coolify builds directly from
      the `Dockerfile`. Optionally replace with a minimal compose file for local
      production checks if that is useful — otherwise delete.
- [x] ~~Stage 4: Prettier drift on pre-existing files~~ — resolved in the
      Stage 5 prep commit (`chore(format): apply Prettier to legacy files`) so
      the first CI run wouldn't fail on unrelated whitespace.
- [ ] Stage 4: `@nuxt/test-utils` v4 is installed as a devDep but not used —
      it turned out to be incompatible with Nuxt 3.15 at install time (crashes on
      `createApp` inside its runtime entry). Vitest is wired up standalone with
      `@vitejs/plugin-vue` instead. Options: (a) remove `@nuxt/test-utils`,
      (b) leave it in and revisit once Nuxt is upgraded.
- [ ] Stage 4: `AppHeader.vue` used `onBeforeMount` without an explicit Vue
      import (auto-imported at Nuxt runtime, but a latent bug outside of it).
      Fixed by adding the import. Consider running a lint/typecheck pass in a
      hypothetical non-Nuxt environment to catch similar cases.

---

## Progress tracker

- [x] Stage 1 — Baseline
- [x] Stage 2 — Docker/Node consistency
- [x] Stage 3 — README rewrite
- [x] Stage 4 — Vitest + animation specs
- [x] Stage 5 — Minimal CI + Dependabot
- [x] Stage 6 — DSGVO fix + Docblock sweep
- [x] Stage 7 — Commit history cleanup (resolved: Option C, no rewrite)
