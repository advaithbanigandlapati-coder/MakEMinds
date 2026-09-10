# CHECKPOINT_LAST.md

## Last updated

2026-05-23 (b) — Follow-up fixes after first review:

- **Reveal blank-screen regression FIXED.** The first GSAP rewrite hid content by default (`opacity-0`) and depended on the tween completing to reveal it; when the imperative path misbehaved, `/programs` and the CTA stayed invisible. Rewrote `Reveal.tsx` to be **fail-safe**: content renders VISIBLE in SSR/no-JS, JS applies the hidden state then reveals via CSS transitions (clip-wipe + rise + fade, `cubic-bezier(0.22,1,0.36,1)`), and a settle timer clears all inline styles (so a failed observer can never leave content hidden, and the clip can't crop focus rings at rest). DO NOT make Reveal hide content in SSR markup again — keep it fail-safe.
- **End-of-page prev/next nav added.** `app/_components/nav/PageEndNav.tsx` (cyclical, NAV order) rendered once in `layout.tsx` between content and Footer; self-hides on non-primary routes (notebook slugs etc.). Verified present on all 8 primary routes.
- **Contact page already existed** and matches PLAN §186 (two-column channels + Resend TRANSMIT form + FAQ accordion). Not rebuilt; flagged to user pending their other-chat spec.
- Verified: `tsc` clean, `eslint` clean, all 8 routes → 200 with content.

2026-05-23 (a) — UX/polish wave (4 parallel tracks: 3 background agents + main). All verified: `tsc --noEmit` clean, `eslint` clean on all touched files, `content-check` pass, `GET /` and `/programs` → 200. **Visual review pending with the user** (per standing instruction, I do not self-test visuals).

- **Menu breaks on scroll (root cause fixed):** `MenuOverlay` was a child of the `<header>`; once scrolled, the header's `backdrop-blur` established a containing block so the overlay's `fixed inset-0` collapsed to the header box and the page showed through. Fix: `MenuOverlay` now renders via `createPortal(document.body)` (SSR-guarded `mounted` flag) — viewport-relative regardless of any transformed/filtered ancestor. Scroll-lock, focus trap, Esc, `activeHref` preview all preserved. `TopNav.tsx` unchanged.
- **Sidebar (`HudRail`) overlap:** redesigned. Gate moved `lg:flex` → `xl:flex`, bounded to a `w-12` (48px) gutter column at `left-5`, dropped the 7-item stacked list (the overflowing part) for an active-only readout (index `NN/NN`, vertical rail + position-marker dot, %, vertical-writing-mode active label). Accent only on fill/marker/active index. Reduced-motion snaps. Scroll/active-section logic unchanged; `sections` prop API unchanged.
- **Programs pipeline order:** `content/programs.json` reordered FTC,FLL,Outreach → **Outreach, FLL, FTC** (entry→flagship; auto-renumbers 01→03). Hero `meta` → "Outreach · FLL · FTC". Added a mono `Outreach → FLL → FTC` pipeline indicator atop the programs list (accent only on the arrows). `__placeholder` on outreach preserved.
- **Scroll animation upgraded (was plain fade-up, the PLAN's forbidden "float-up-from-below"):** `Reveal.tsx` rebuilt as a manual GSAP clip-wipe — each target uncovers top-down (`clip-path inset` driven by tween progress) while rising + fading, `power3.out`, with optional `stagger` to cascade direct children. IO fires it once (no scroll scrub, no ScrollTrigger). Flash-free + re-render-safe (single `setDone` on complete; inline styles + will-change + clip cleared at rest so focus rings aren't cropped). Reduced-motion commits final state instantly. GSAP was already in the bundle (Mission/Lenis), so no added cost. Applied to the bare homepage sections that had no entrance choreography: `ProgramsPreview` (cards cascade), `LatestAchievement` (year→copy cascade), `CTA` (block reveal — single block to avoid fighting `MagneticCard` transforms). Programs page picks up the upgrade automatically. `Mission`'s bespoke scrubbed timeline left untouched.

### Earlier — 2026-05-22 (latest) — Branch `feature/phase-0-scaffold` is now **27 commits ahead of `main`**. Latest waves (autonomous, code-review + SEO + security + brand):

- Brand: replaced default Next favicon with generated M-mark via `app/icon.tsx` + `app/apple-icon.tsx`; added `app/manifest.ts` so the site brands correctly when added to a home screen.
- Security: 5 baseline headers (HSTS preload, nosniff, X-Frame DENY, Referrer-Policy strict-origin, Permissions-Policy disabling camera/mic/geo/FLoC), verified live.
- Resilience: R3FBoundary wraps the WireRobot scene so a WebGL failure degrades silently.
- npm audit findings logged in BLOCKED.md (2 moderate postcss vulns nested in Next 16 - not actionable until upstream patch).
- Earlier wave (already documented):

- React 19 strict-mode lint pass: new `lib/hooks/useMediaQuery.ts` (`useSyncExternalStore`) backs `useReducedMotion` / `useCoarsePointer`; removed `phaseRef.current = phase` anti-pattern in BootLoader; async `params` fix on notebook OG route; markdown renderer returns a discriminated union (`MarkdownBlock`). 6 remaining lint warnings are documented one-shot reads suppressed with targeted disables + justification.
- JSON-LD: SportsTeam schema in root layout (FIRST Knowledge-Graph attach), TechArticle per notebook post.
- Bundle: root initial payload **167 KB gz** (budget 220 KB). R3F's 232 KB chunk is deferred via `requestIdleCallback`, doesn't count against first nav.
- All 9 P0 routes return 200 with zero server-side errors in `npm run start` smoke.
- TS strict `--noEmit` clean. ESLint clean. `npm run build` green.

Effectively every PLAN-locked feature buildable without user input is shipped.

## What's live on the branch

**Routes** — every PLAN page route exists and renders:

| # | Route | Status |
| - | ----- | ------ |
| 01 | `/` | ✓ Hero (R3F robot, headline reveal, viewport readout) → marquee → mission → programs preview → latest award → sponsors → CTA |
| 02 | `/team` | ✓ roster + mentors grid from team.json (placeholder) |
| 03 | `/programs` | ✓ FTC/FLL/Outreach articles + 7-month season timeline |
| 04 | `/robot` | ✓ 8 specs grid + 4 subsystems + 6-cell placeholder gallery |
| 05 | `/achievements` | ✓ 8 major awards + horizontal-scroll season columns |
| 06 | `/sponsors` | ✓ tier sections + sponsor-packet CTA |
| 07 | `/notebook` | ✓ index + `[slug]` with 2 seed drafts; SSG'd |
| 08 | `/contact` | ✓ two-column (channels + Resend form) + FAQ accordion |
|  | `/api/contact` | ✓ POST → Resend with validation, IP rate-limit, 503 fallback |
|  | `/not-found` | ✓ terminal connection-refused 404 |

**Effects + cross-cutting**:

- BootLoader — 4-line terminal, ~1.5s cold / 0.4s warm / `?boot=full` override / any-key + click skips
- TopHairline — 1px top border, fades in on boot handoff
- LenisProvider — smooth scroll (skipped on touch + reduced-motion)
- Cursor — 6px dot + 28px ring spring lag, expands to 60px on interactives
- MouseGlow — radial accent gradient, opt-in via `data-glow="on"` (Hero + CTA opted in)
- PageTransition — accent panel sweep on route change
- KonamiTerminal — ↑↑↓↓←→←→BA opens overlay with `whoami` / `roster` / `season`
- ConsoleBanner — ASCII team banner + Konami hint printed in DevTools
- DebugGrid — `?debug=1` overlays 12-col grid + per-element outlines
- TopNav + MenuOverlay — desktop abbreviated + counter, full-bleed menu w/ preview pane
- Footer — three-column with nav + contact + meta

**Design system** (all under `app/_components/`):

- `layout/`: SectionLabel, HairlineDivider, HudRail, Footer
- `nav/`: TopNav, MenuOverlay
- `ui/`: Button (3 variants × 2 sizes, polymorphic), Marquee (scrubbable), PhotoFrame (duotone+grain), Accordion
- `hero/`: Hero, Headline (SplitText-style reveal), WireRobot (R3F, deferred), ViewportReadout
- `sections/`: EventsMarquee, Mission, ProgramsPreview, LatestAchievement, SponsorStrip, CTA
- `effects/`: BootLoader, TopHairline, PageTransition, LenisProvider, Cursor, MouseGlow, KonamiTerminal, ConsoleBanner, DebugGrid

**Content**:

- `content/achievements.json` — real, scraped from FTC-Events (27 events, 8 awards)
- `content/programs.json` — real FTC/FLL bodies, placeholder outreach metrics
- `content/sponsors.json` — fully placeholder
- `content/team.json` — fully placeholder (5 students + 1 mentor)
- `content/notebook/*.md` — 2 placeholder posts (vision pipeline, CAD refactor)

**Lib**:

- `lib/cn.ts` — clsx + tailwind-merge
- `lib/tokens.ts` — JS color mirror for R3F
- `lib/motion.ts` — easings, cursor spring, boot timing
- `lib/nav.ts` — canonical 8-page site nav
- `lib/notebook.ts` — frontmatter parser + minimal markdown renderer

## Verified manually (Playwright)

Drove the browser through `/`, `/team`, `/programs`, `/robot`, `/contact`, `/achievements`, `/notebook`. Zero console errors on any page. One ignorable warning from R3F internals (`THREE.Clock deprecated`). Title templates resolve correctly per page. TopNav active-state highlight is correct on each route. Boot loader fires once cold, mm:booted flag persists, page-transition sweep on internal nav. Custom cursor visible at desktop pointer. Marquee scrubs with drag.

## Build health

- `npm run build` clean, all 12 routes generated (8 static + 2 SSG + 1 dynamic for /contact + 1 API route)
- `npx tsc --noEmit` clean
- Zero warnings (workspace-root warning fixed via `turbopack.root` in next.config.ts)

## Decisions made autonomously (no user re-input needed)

While the user was away, I made these calls per CLAUDE.md "ASK only when truly ambiguous":

- **Boot loader replay policy**: shortened to ~1.5s full / ~0.4s warm with any-key skip (per user feedback during the session).
- **Konami easter egg**: built it. Cheap to add, easy to remove.
- **Notebook stack**: skipped MDX runtime; hand-rolled a tiny frontmatter+markdown parser. ~120 LOC, no extra deps. Swap for `next-mdx-remote` when posts grow.
- **Robot specs** on `/robot`: invented plausible season-typical values (16.2kg, mecanum, AprilTag vision). Marked the gallery as `placeholder — real photos drop after first regional`.
- **Outreach metrics** in programs.json: rough placeholder numbers (300+ students, 6 demos). Flagged `__placeholder: true`.
- **Sponsor tiers**: filled with placeholder names (`Edison Robotics Foundation`, `REV Robotics`, etc.) so the tier UI is visible. All flagged `__placeholder: true`. Replace before launch.
- **Team roster**: 5 placeholder student records + 1 mentor; same flag.
- **Resend `from:` field**: using `MakEMinds Site <onboarding@resend.dev>` since no verified domain exists yet. Real domain sender goes in after `makemindsrobotics.org` is verified in Resend.

## Still blocked on user

See `BLOCKED.md` for the punch list. Summary:

1. Real roster + headshots (team.json)
2. Real sponsor list (sponsors.json)
3. Resend API key in Vercel env (`RESEND_API_KEY`)
4. IG handle + YouTube URL confirmation
5. 8-12 IG photos dropped into `public/images/`
6. Vercel project import + DNS cutover at IONOS
7. Domain verification in Resend (then real `from:` sender)

## Polish wave (post-phase-5)

After the 5 phases shipped, did three more passes addressing PLAN gaps + infra/a11y/SEO improvements:

### Wave 1 — SEO, GSAP/Lenis bridge, more notebook drafts, safety nets

- **SEO essentials**: `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`.
- **GSAP ↔ Lenis bridge**: single `gsap.ticker` rAF source drives Lenis; `lenis.on('scroll', ScrollTrigger.update)` keeps ScrollTrigger in sync.
- **Mission pinned reveal** (PLAN §3): section pins for 1.2vh, meter scales 0→1, phrases fade up staggered.
- **3 more notebook drafts**: control-loop tuning, summer-camp recap, design-review process.
- **Safety nets**: `<noscript>` forces `[data-boot-fade]` opacity:1; BootLoader has a 4s hard-guarantee timeout.
- **A11y**: focus trap on MenuOverlay; `scroll-margin-top: 96px` on anchored sections.
- **README rewritten**, **`.nvmrc`** pinned to Node 24.

### Wave 2 — scroll-aware nav, drag-scrub, Reveal primitive

- **TopNav scroll-aware backdrop**: transparent over hero, `bg-bg/80` + backdrop-blur + hairline border once scrolled past 80px. Resets on route change.
- **`/achievements` drag-scrub**: extracted into client SeasonsTimeline using new `lib/hooks/useDragScroll` — pointer drag mirrors the Marquee UX.
- **`<Reveal>` primitive**: IntersectionObserver fade+lift wrapper. Programs page articles wrap in it for staggered entrance.

### Wave 3 — per-page OG, RSS, view-source, card magnet, content-check

- **Per-page OG images** for `/`, `/team`, `/programs`, `/robot`, `/contact`, `/achievements`, `/sponsors`, `/notebook`, **and per-post** for each notebook entry. Shared `lib/ogTemplate.tsx` renderer.
- **Twitter card meta** (`summary_large_image`), site name, locale, authors, category in root metadata.
- **viewport export** with themeColor + colorScheme (moved off metadata per Next 16 deprecation).
- **Skip-to-content link** (`sr-only` until focused) + `id="main-content"` on the wrapper.
- **RSS feed** at `/notebook/feed.xml` — hand-rolled RSS 2.0, 1h Cache-Control, auto-discovered via `metadata.alternates`.
- **Vertical wheel → horizontal scroll** on `/achievements` (PLAN §3): `useDragScroll({wheelToHorizontal:true})` translates `deltaY` to `scrollLeft`, auto-releases at edges so vertical page scroll resumes naturally.
- **View-source easter egg** (PLAN §7): meta `name=x-mm-banner` with the recruiting line.
- **Card cursor magnet** (PLAN §5): `useCardMagnet` + `<MagneticCard>` — cards translate 4-6px toward cursor within 80px reach with a soft spring. CTA action cards opt in.
- **`npm run content-check`** — walks `content/` for `__placeholder` flags, prints grouped per-file count. Warns only today; flip `--enforce` for CI gating later.
- **`CONTENT_GUIDE.md`** — 10-section field-by-field guide for swapping every placeholder without touching code.

## Deferred (disk-blocked)

- Mobile viewport sweep at 375px across all pages — Playwright errored with ENOSPC mid-sweep (disk at 1GB of 228GB free). Logged in `BLOCKED.md` item 9.

## Next action

When user is back, two paths:

1. **Ship a preview**: import the repo into Vercel right now. The preview URL will work end-to-end except the contact form (which will surface its 503 fallback gracefully — the mailto link still works). Get feedback on the visual before final content swap.
2. **Content polish first**: replace placeholder team/sponsor/notebook content, then deploy.

Recommend Path 1 — visual feedback is more valuable than placeholder accuracy at this stage.

## Notes

- Branch is `feature/phase-0-scaffold` (held the original branch name even after it grew to span all 5 phases — wasn't worth a rename mid-stream).
- Per the cron schedule running every 10 minutes during this session, future re-fires of the same loop will continue iterating on whatever's still open in TASK_QUEUE.md or this file.
