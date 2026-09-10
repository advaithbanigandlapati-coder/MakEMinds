# CLAUDE.md — makeminds-site

Project-specific operating rules. Read this AFTER `~/.claude/CLAUDE.md` at session start.

## On resume

1. Read `PLAN.md` end-to-end. This is the source of truth for design and architecture decisions.
2. Read `TASK_QUEUE.md` for current state.
3. Read `CHECKPOINT_LAST.md` for last-session handoff.
4. Confirm with the user that the plan still reflects their intent before scaffolding code.

## Project values

- The whole point is the **design quality**. Do not ship anything that looks like an AI-generated landing page. If a section feels generic, kill it and redo it. The user's bar is "shock a pro dev."
- **Motion is a material, not decoration.** Every animation has a purpose: hierarchy, navigation, focus, delight. No idle pulse effects, no infinite gradients, no float-up-from-below on every block.
- **Monospace is structural** — use it for section labels, metadata, numbers, status. Not for body copy. Not as a "techy" decoration.
- **One accent color**, used sparingly. `#649dc7` steel-blue, sampled from the logo SVG (see `PLAN.md` color tokens). If the page has more than ~5% accent coverage, dial it back.
- **No raw jpegs** floating on the dark background. Every photo gets the duotone + grain treatment via `<PhotoFrame>`.
- **Respect `prefers-reduced-motion`** on every motion primitive. Test with macOS Accessibility setting toggled.
- **Performance budget is non-negotiable**: LCP < 2.0s on 4G mobile, JS < 220KB gz on first nav.

## Code conventions

- TypeScript strict mode. No `any` unless commented-justified.
- Tailwind for layout/spacing; CSS custom properties for theme tokens; no inline styles except dynamic transforms.
- One component per file. Co-locate styles only when they're component-scoped CSS modules.
- Effects (cursor, lenis, boot loader, transitions) live under `app/_components/effects/`.
- Hooks live next to the component that owns them, unless reused — then `lib/hooks/`.
- Server components by default. `'use client'` only when state or browser APIs require it.

## What NOT to do

- Don't introduce a CMS in v1.
- Don't add Framer's `LayoutGroup` magic to large sections — it kills perf. Use manual GSAP timelines for choreographed reveals.
- Don't preload R3F. Defer until idle or first interaction.
- Don't add animation libraries beyond the four listed (Framer / GSAP / Lenis / R3F).
- Don't write content into `content/*.json` without flagging placeholders as `__placeholder: true`.
- Don't deploy to Vercel from local — use the git-push flow so every change has a preview URL history.

## Workflow

- `npm run dev` locally on port 3000.
- Branch per page/feature: `feature/home-hero`, `feature/boot-loader`, etc.
- Open a PR even for solo work — preview URL is the artifact you share with the team for review.
- Squash-merge to `main` once approved.
- After each meaningful commit, update `CHECKPOINT_LAST.md`.

## Verification gates

Before marking any page "done":

- Lighthouse Performance ≥ 90, A11y ≥ 95 on that route.
- Manual test with `prefers-reduced-motion`.
- Manual test in mobile Safari (iPhone) and mobile Chrome (Android).
- No console errors or warnings.
- Visual sweep: every photo wrapped in `<PhotoFrame>`, every section has a mono `[NN] LABEL` marker, every heading uses the display face.
