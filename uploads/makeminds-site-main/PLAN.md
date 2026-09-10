# MakEMinds Robotics — site rebuild plan

> Frozen on 2026-05-22. Resume by reading this file, then `TASK_QUEUE.md`, then `CHECKPOINT_LAST.md`.

## Context

`makemindsrobotics.org` currently routes to a Google Sites page (Home / Our Programs / Achievements / Sponsors / Contact) with a robot photo hero, a serif title, and the team's lightbulb-in-circuit logo. The apex domain is parked on IONOS — Google Sites is reached only through a `/home` path, so direct visitors see an IONOS "domain registered" page. Visually it reads as a default template: no motion, no personality, no signal of technical sophistication.

The team wants a complete rebuild that:

- Looks like it was made in 2040 — opinionated motion, mouse reactivity, scroll choreography, terminal-style boot loader.
- Would impress a senior front-end engineer, not just a parent or judge.
- Matches the existing dark circular logo and FTC-team identity.
- Borrows the editorial calm of hackjps.org (large type, generous whitespace, monospace accents, sharp section breaks) without copying it.

Scope: full redesign + rebuild, 8 pages, animated boot sequence, custom design system, deployed to Vercel under the existing domain. Ship Home first at a flagship level (every animation, every detail), then fast-follow the rest at the same quality bar.

## Decisions locked

| Item | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + CSS custom properties for theme tokens |
| Motion | Framer Motion (component-level), GSAP + ScrollTrigger (scroll choreography), Lenis (smooth scroll) |
| 3D / canvas | React Three Fiber + drei (hero, robot showcase). Postprocessing for bloom/chromatic. |
| Fonts | **DM Sans** (body), **Space Grotesk** (display / headlines), **Geist Mono** (mono / captions / metadata). All free, OFL, loaded via `next/font/google`. |
| Icons | Lucide + custom SVGs |
| CMS / content | MDX in-repo for blog (Engineering Notebook). Static JSON for team/sponsors/achievements. No external CMS in v1. |
| Forms | Vercel serverless function → Resend for the contact form. No DB. |
| Analytics | Vercel Analytics + Speed Insights |
| Hosting | Vercel Hobby, A/CNAME records at IONOS pointing apex + www to Vercel |
| Repo | `AryaVora621/makeminds-site` (public). `main` auto-deploys; PRs get preview URLs. |

## Brand & visual language

Design north star: dark-mode-first, brand-aligned steel-blue accent, editorial layout, monospace as a structural element, motion as a first-class material.

### Color tokens

All values **sampled directly from the logo SVG** (`#050506`, `#555c65`, `#60758c`, `#649dc7`, `#ccd9e6`). The whole palette descends from the mark — no warm accent, no off-brand surprises.

```
--bg          #050506   from logo background — true brand black
--bg-elev     #0E1116   one step up, slightly cooler
--bg-grain    layered SVG noise at 4% opacity over --bg
--fg          #E8EEF4   cool off-white (reads premium against the steel palette)
--fg-muted    #8090A4   muted steel
--fg-dim      #555c65   from logo — borders, disabled text
--border      #1A2028
--accent      #649dc7   THE blue from the logo — primary accent
--accent-hi   #ccd9e6   from logo — bright highlight (used sparingly)
--accent-dim  #2E5878   hover wash, focus rings
--warn        #FF6B35   reserved for terminal errors in boot loader only
```

A steel-blue accent against true-black reads as "aerospace / engineering studio" rather than "AI-generated gradient slop." Pulling the palette straight from the mark guarantees the logo never looks pasted onto an unrelated background.

### Typography scale

Locked 2026-05-22.

- **Display** (hero, page H1s, section H2s): **Space Grotesk**, 700–900 weight, 72–180px on hero, 32–56px on section heads, tracking -0.02 to -0.04em, line-height 0.95.
- **Body**: **DM Sans**, 400/500/700, 16/26.
- **Caption / metadata / section labels**: **Geist Mono**, 12/16, uppercase, tracking 0.08em.
- **Numbers / counters**: Geist Mono with tabular figures.

Mono is used **structurally** — as section labels (`[01] / WHO`), timestamps, coordinate labels next to images, status indicators. Not decorative.

### Layout system

- 12-col grid, 80px gutter on desktop, asymmetric — content sits in cols 2–8 or 5–12, never centered with equal margins. This kills the "Google Sites centered block" feeling instantly.
- Section markers in the top-left of every section: `[02] PROGRAMS · 2025–26`
- Horizontal hairline dividers in `--border`, never thicker than 1px.
- A persistent left-edge HUD on desktop showing page section index + scroll progress, mono.

### Photo treatment

Every uploaded photo is run through a duotone + grain pipeline:

```
filter: grayscale(1) contrast(1.05);
mix-blend-mode: lighten;
background: --bg-elev tinted with --accent at 6%;
```

The result: photos blend into the dark background as if they were rendered into the page, not pasted on. No floating jpegs. For hero photography, we composite an SVG noise overlay + soft vignette so a single robot shot reads as intentional art direction.

## Signature interactions

The "shock a pro dev" moments. Each lives under `app/_components/effects/` once built.

### 1. Boot loader (first paint, ~2.4s)

Full-viewport `<BootLoader />` mounts at root layout before anything else. Pure terminal aesthetic.

```
[ make-minds-robotics.boot ]
> initializing systems......... OK
> loading manifest............. OK
> auth: GUEST                   [ pass ]
> resolving makemindsrobotics.org
  ▸ 76.76.21.21
  ▸ TLS 1.3, HSTS enabled
> mounting /home              [████████████░] 87%
> mounting /home              [██████████████] 100%
> ready.

press [ enter ] to continue, or wait 1.2s
```

- Typewriter timing per line (24–60ms/char, GSAP timeline).
- Cursor blink in `--accent`.
- "press [ enter ]" — actually wired: Enter key or click skips remaining wait.
- After the last line, the terminal collapses into a 1px horizontal line that flies to the top of the viewport and becomes the page's top hairline border. Coordinated handoff so it doesn't fade — it transforms.
- LocalStorage flag `mm:booted=1` so returning visitors get a 0.4s minimal version. `?boot=full` query param replays the full sequence for showing off.
- Skip-link respected; `prefers-reduced-motion` collapses the whole thing to a 200ms fade.

### 1.5 Events marquee (Home, just below hero)

Locked 2026-05-22. Sits as a "passport stamp" strip between the hero and the mission section.

- Horizontal infinite scroll, right-to-left, **220s loop on desktop** (slower on mobile via media query so it doesn't burn battery).
- Pulls all events from `content/achievements.json` — currently 27, dynamic going forward.
- Each chip: `2025 · DECODE` (mono, accent-blue) · `Event name` (Space Grotesk 600, white) · `RESULT` (mono, muted). **Every chip is exactly 64px tall** — no variation in size, weight, or text color between regular and award chips.
- Award-winning events are distinguished by a **2px accent-blue left border + a glowing accent dot** at the start of the chip. Never by text size or color. This keeps the strip visually uniform while still letting awards "pop" on scroll.
- Edges fade to `--bg` (140px gradient mask) so chips don't pop in/out.
- **Pause on hover**: animation pauses while pointer is over the strip.
- **Manual scrubbing**: drag horizontally (mouse or touch) to scrub through events at your own pace. Trackpad horizontal-scroll + shift+wheel also work natively. Native scrollbar is hidden but `overflow-x: auto` remains so the container is genuinely scrollable.
- While the user is interacting (dragging or trackpad-scrolling), animation stays paused; it resumes 600ms after the last wheel event and immediately on mouseleave after a drag.
- `prefers-reduced-motion: reduce` → static, no animation, but manual scroll still works.
- Implementation: render the list twice in the DOM (React `<Marquee>` component does this at mount), animate `translateX(0 → -50%)`. Linear easing. Pointer/touch handlers attached at component mount for the scrub interaction; CSS class toggles drive pause state to avoid React re-renders during drag.

### 2. Hero (Home page)

- Headline `MAKEMINDS / ROBOTICS` in display face, broken across two lines, kinetic on mount — characters mask-reveal from below with stagger 0.012s, GSAP SplitText.
- Behind the text: a slow-rotating wireframe robot built in R3F. Low-poly, edges-only material, slight chromatic aberration. Mouse position drives subtle camera parallax (lerped, never jittery). Idle, the model breathes ±2° rotation.
- Mouse leaves a 1px crosshair with `(x, y)` mono coordinates and a "VIEWPORT 1440×900" readout in the corner — purely visual but immediately reads "made by people who care."
- Marquee row below the fold: `FTC TEAM 23786 · SEASON 2025–26 · NEW JERSEY · MAKEMINDS ROBOTICS ·` infinite scroll, scrubs in reverse based on scroll velocity.

### 3. Scroll-driven section reveals

GSAP ScrollTrigger pinned timelines on key sections:

- **About**: text blocks fade in one phrase at a time as the section pins. A meter on the left fills as you progress. When it hits 100% the pin releases.
- **Programs (FTC / FLL / Outreach)**: three vertical panels. As you scroll, the active panel slides to full-bleed; the others compress to thin labeled spines on the right. Click a spine to expand it; previous one collapses.
- **Achievements**: horizontal scroll section. Vertical wheel = horizontal page motion via GSAP. Each award is a card with giant year, place, event, photo with the duotone treatment.

### 4. Interactive nav

- Top-right nav, mono uppercase. Hovering a label slides a 1px underline left→right + advances a counter `(03)` next to the active item.
- Clicking opens a full-bleed menu overlay: left half is a giant index `[01] HOME / [02] PROGRAMS / ...`, right half is a live preview thumbnail of the page being hovered.
- Closing animates outward as 12 vertical bars retreating to the edges.

### 5. Mouse reactivity (global, subtle)

- Custom cursor: 6px dot + 28px ring that lags behind with a spring. On any interactive element, ring expands to 60px and the dot inverts color. Disabled on touch.
- A faint `--accent` glow follows the cursor through hero/CTA blocks via a radial gradient masked to the section. ~12% opacity max.
- Image cards: cursor magnet — within 80px, the card translates 4–6px toward the cursor. Spring damping 18.

### 6. Page transitions

App Router page transitions use a single horizontal panel sweep: an `--accent` (steel-blue) panel slides in from right covering everything, page swaps under it, panel slides off-left. ~520ms total. Kills the "different site" feel of route changes.

### 7. Easter eggs

- Konami code → terminal opens with three real commands: `whoami`, `roster`, `season`. Output is real team data. Closes on `exit`.
- `console.log` ASCII banner with team name + recruiting line + email.
- View-source comment block at the top with team tagline and credit.
- `?debug=1` query param turns on a grid overlay + element box-model outlines.

## Pages

8 pages. Home is the flagship, the rest share the design system and progressively cheaper animation budgets.

| # | Route | Priority | Key content blocks |
| --- | --- | --- | --- |
| 01 | `/` Home | P0, flagship | Boot loader, hero with R3F robot, marquee, mission, programs preview, latest achievement, sponsor strip, CTA |
| 02 | `/team` | P0 | Roster grid with hover-reveal bios, role/year metadata, dual-tone portraits |
| 03 | `/programs` | P0 | FTC + FLL + Outreach kinetic panels, season timeline |
| 04 | `/robot` | P0 | Current season robot showcase, scroll-driven spec reveal, photo gallery, CAD render placeholder |
| 05 | `/achievements` | P1 | Horizontal-scroll timeline of awards/results |
| 06 | `/sponsors` | P1 | Tiered logo grid (Title / Gold / Silver / Friends), sponsor CTA, sponsor packet PDF link |
| 07 | `/notebook` | P1 | MDX engineering blog index + post pages with code blocks, build-season tags |
| 08 | `/contact` | P0 | Two-column layout (see Contact Pattern below): direct-link channels + form (Resend), FAQ accordion |

### Contact pattern (revised)

The contact page splits in two:

**Left column — direct channels**, large hover-reactive list, monospace-coded keys:

```
[ 01 / EMAIL    ]  info@makemindsrobotics.org      →
[ 02 / INSTAGRAM]  @makemindsrobotics              ↗
[ 03 / YOUTUBE  ]  MakEMinds Robotics              ↗
[ 04 / LOCATION ]  Edison, NJ — USA                ·
```

Each row is a real anchor (`mailto:`, IG, YouTube). On hover: the row inset-shifts 16px right, the arrow turns `--accent`, a subtle `--accent` wash slides under it. Mono uppercase keys, display-font values.

**Right column — message form**, posts to `/api/contact` via Resend serverless function. Fields: name, email, reason (select: sponsorship / mentor / partnership / outreach / judging / other), message. Submit button is an `--accent` (steel-blue) mono "TRANSMIT →" with translateY hover.

**Mailto fallback** sits just below the submit row: `or email us direct: info@makemindsrobotics.org` — so the form is never a hard dependency. If JS is broken or Resend is down, the mailto link still works.

Both halves stack into a single column on mobile.

Build order: Home → shared design system tokens / components → Team → Programs → Robot → Contact → Sponsors → Achievements → Notebook.

## File / folder structure

```
makeminds-site/
├─ app/
│  ├─ layout.tsx              # boot loader mount, fonts, cursor, lenis provider
│  ├─ page.tsx                # Home
│  ├─ team/page.tsx
│  ├─ programs/page.tsx
│  ├─ robot/page.tsx
│  ├─ achievements/page.tsx
│  ├─ sponsors/page.tsx
│  ├─ notebook/page.tsx
│  ├─ notebook/[slug]/page.tsx
│  ├─ contact/page.tsx
│  ├─ api/contact/route.ts    # POST → Resend
│  └─ _components/
│     ├─ effects/
│     │  ├─ BootLoader.tsx
│     │  ├─ Cursor.tsx
│     │  ├─ PageTransition.tsx
│     │  ├─ LenisProvider.tsx
│     │  ├─ NoiseOverlay.tsx
│     │  └─ MouseGlow.tsx
│     ├─ hero/
│     │  ├─ Hero.tsx
│     │  ├─ WireRobot.tsx     # R3F scene
│     │  └─ Headline.tsx      # SplitText reveal
│     ├─ nav/
│     │  ├─ TopNav.tsx
│     │  └─ MenuOverlay.tsx
│     ├─ layout/
│     │  ├─ SectionLabel.tsx  # `[02] PROGRAMS · 2025–26`
│     │  ├─ HairlineDivider.tsx
│     │  └─ HudRail.tsx       # left-edge progress
│     └─ ui/
│        ├─ Marquee.tsx
│        ├─ PhotoFrame.tsx    # duotone + grain pipeline
│        ├─ Accordion.tsx
│        └─ Button.tsx
├─ content/
│  ├─ team.json
│  ├─ achievements.json
│  ├─ sponsors.json
│  ├─ programs.json
│  └─ notebook/*.mdx
├─ public/
│  ├─ fonts/
│  ├─ images/  (sourced — see below)
│  └─ logo.svg (cleaned vector)
├─ lib/
│  ├─ motion.ts               # shared easings, spring configs
│  ├─ tokens.ts               # color/space tokens mirrored for JS consumers
│  └─ analytics.ts
├─ tailwind.config.ts
├─ next.config.ts
└─ package.json
```

## Content sourcing plan

Per the user's choice: pull what we can from the current site + Instagram + FTC sources, fill gaps with placeholders.

Already collected (2026-05-22):
- Team identity confirmed via FTC-Events: **Team 23786 MakEMinds, Edison NJ, rookie 2023, 27 events across 2 seasons.**
- Award history scraped end-to-end into `content/achievements.json` (Inspire 2nd 2025, Inspire 3rd 2024, Think, Control, multiple Finalist/Winning alliance captains at NJ Championship).
- Original detailed logo PNG saved to `public/logo-full.png`.
- Clean hand-built simplified brand mark saved to `public/logo-mark.svg` (uses `currentColor` — themeable to white / steel-blue / dark per context).

Still to gather:
1. **Logo refinement**: simplified mark is built; may want a wordmark `logo-lockup.svg` (mark + "MakEMinds" set in chosen display font).
2. **Mission copy**: lift verbatim from current site ("MakEMinds Robotics is a dynamic community…"). Tighten by ~30% for the new hero.
3. **Hero photo**: the current robot-on-bench shot. Re-export at high res; apply duotone in component.
4. **Achievements**: lift bullets from `/achievements`. Add years/places/events into `content/achievements.json`.
5. **Sponsors**: enumerate from `/sponsors` page. Logos sourced from sponsor websites (PNG + SVG where available).
6. **Programs**: lift FTC / FLL descriptions, restructure for the kinetic panel layout.
7. **Instagram**: pull 8–12 best shots (events, builds, outreach) for the team page collage + outreach section. Each gets the duotone treatment.
8. **Contact**: `info@makemindsrobotics.org`, IG `@makemindsrobotics` (verify handle), YouTube channel link from current site.

Placeholders flagged in content JSON with `__placeholder: true` so build warns before deploy.

## Performance & accessibility budget

Non-negotiable, even with heavy motion:

- LCP < 2.0s on 4G mobile (hero photo pre-loaded, R3F deferred until idle, boot loader doesn't block LCP candidate)
- Total JS < 220KB gzipped on first nav
- All animations honor `prefers-reduced-motion`: boot loader collapses to fade, R3F static, ScrollTrigger pins disabled, cursor reverts to native
- Keyboard navigable: focus rings in `--accent`, skip-link to main, Tab order tested per page
- Color contrast ≥ 4.5:1 for body, ≥ 3:1 for large text — verified against the dark palette
- All photos `next/image` with explicit width/height, blur placeholder
- R3F scene: <30k polys, frustum culled, paused when off-screen via IntersectionObserver

## Deployment

1. Push to `AryaVora621/makeminds-site` on GitHub.
2. Import into Vercel; framework auto-detected; build settings default.
3. At IONOS DNS: add `A` record `@ → 76.76.21.21`, `CNAME` `www → cname.vercel-dns.com`. TTL 3600. Domain verifies in Vercel within ~10 minutes.
4. Add `RESEND_API_KEY` env var in Vercel for the contact form.
5. Vercel Analytics + Speed Insights enabled.
6. Each PR auto-deploys to a preview URL.

## Verification (per page, before "done")

- **Boot loader**: cleared storage → full sequence plays → handoff to top border is seamless. `mm:booted=1` → fast variant. `?boot=full` → full again. `prefers-reduced-motion` → 200ms fade only.
- **Hero**: hard reload, watch LCP in Lighthouse (< 2.0s). Move mouse → wireframe parallax tracks. Disable JS → headline + photo still render.
- **Scroll**: full-page scroll on trackpad and mouse wheel. Lenis should not lag input. ScrollTrigger pins release cleanly on resize.
- **Nav menu**: open / close 5x rapidly without state breaking. Tab through all items keyboard-only.
- **Photo treatment**: every photo gets `<PhotoFrame>`. Visual sweep: no raw jpegs visible against page bg.
- **Contact form**: submit with valid + invalid email, empty fields, too-long input. Verify Resend delivery + serverless 200/400 codes.
- **Routes**: visit every page via in-app nav and direct URL. Page transition plays both ways.
- **Lighthouse**: on Home, Team, Robot. Performance ≥ 90, A11y ≥ 95, Best Practices ≥ 95.
- **Reduced motion**: macOS Reduce Motion ON. Reload. No motion sickness vectors remain.
- **Cross-device**: iPhone Safari, Android Chrome, MacBook Chrome + Safari + Firefox, Windows Chrome. 320px → 2560px without overflow.
- **DNS cutover**: pre-cutover, dev URL fully QA'd. Cutover during low-traffic window. Monitor `dig makemindsrobotics.org` until both A + CNAME resolve to Vercel.

## Out of scope for v1

- Multi-language
- Member-only / admin areas
- CMS UI (content edits via PR for now)
- Online merch / donations checkout
- Match scouting tools

These can be added later without restructuring; the architecture leaves room (App Router segments, env-flagged routes).
