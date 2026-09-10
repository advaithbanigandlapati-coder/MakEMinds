# TASK_QUEUE.md

Build order for makeminds-site. Move tasks between sections as they progress. Update `CHECKPOINT_LAST.md` after each meaningful unit.

## In-Progress

_(none — all implementation phases complete; remaining work is user-blocked. See `BLOCKED.md`.)_

## Open — Phase 6: Content sourcing (user-blocked)

- [ ] Real team roster + headshots → `content/team.json` + `public/team/`
- [ ] Real sponsor list + logos → `content/sponsors.json` + `public/sponsors/`
- [ ] Real robot photos → `public/robot/` (replaces placeholder gallery cells)
- [ ] 8-12 IG shots → `public/images/`
- [ ] Confirm IG handle + YouTube URL (currently assumed `@makemindsrobotics` / `youtube.com/@makemindsrobotics`)
- [ ] Real notebook posts (currently 2 placeholder drafts)
- [ ] Sponsor packet PDF → `public/sponsor-packet.pdf`

## Open — Phase 7: Deploy (user-blocked)

- [ ] Import repo to Vercel (project: `makeminds-site`)
- [ ] Set `RESEND_API_KEY` env var in Vercel project
- [ ] Verify a preview deploy works end-to-end
- [ ] IONOS DNS: `A @ → 76.76.21.21`, `CNAME www → cname.vercel-dns.com`
- [ ] Cutover Vercel domain to `makemindsrobotics.org`
- [ ] Monitor `dig makemindsrobotics.org` until DNS resolves to Vercel
- [ ] Enable Vercel Analytics + Speed Insights
- [ ] Verify Resend domain → swap `from:` in `app/api/contact/route.ts` to `noreply@makemindsrobotics.org`
- [ ] Final Lighthouse pass across all P0 routes

## Done

### Planning

- [x] Plan written (`PLAN.md`)
- [x] Local project folder created at `~/Desktop/makeminds-site`
- [x] GitHub repo created at `github.com/AryaVora621/makeminds-site` (public)
- [x] Initial commit pushed
- [x] Doc drift resolved (lime → steel-blue accent; font stack)

### Phase 0 — Scaffold

- [x] `create-next-app` (Next 16, TS, Tailwind v4, App Router, no-src, alias `@/*`, Turbopack)
- [x] Install deps (framer-motion, gsap, lenis, three + R3F + drei + postprocessing, resend, lucide-react, clsx, tailwind-merge, @types/three)
- [x] Wire fonts via `next/font/google`: Space Grotesk + DM Sans + Geist Mono
- [x] Color tokens from logo SVG → globals.css + `@theme inline`
- [x] `lib/motion.ts` + `lib/tokens.ts` + `lib/cn.ts`
- [x] `.env.example` with `RESEND_API_KEY` + `CONTACT_TO_EMAIL`
- [x] `next.config.ts` pinned `turbopack.root`

### Phase 1 — Design system primitives

- [x] `<SectionLabel>` — `[NN] LABEL · meta` mono
- [x] `<HairlineDivider>` — 1px in --border
- [x] `<HudRail>` — left-edge scroll progress + section index
- [x] `<Marquee>` — infinite RTL with pause-on-hover + drag-scrub + wheel-pause
- [x] `<PhotoFrame>` — duotone + grain + vignette pipeline
- [x] `<Accordion>` — native details/summary
- [x] `<Button>` — primary/ghost/terminal × sm/md polymorphic
- [x] `<TopNav>` — wordmark + counter + menu pill
- [x] `<MenuOverlay>` — 12-bar slide-in + index + preview pane
- [x] `lib/nav.ts` — canonical 8-page site nav

### Phase 2 — Home (flagship)

- [x] `<BootLoader>` — terminal sequence with any-key skip + `mm:booted` + `?boot=full`
- [x] `<Hero>` shell with mono viewport readout
- [x] `<WireRobot>` — R3F low-poly wireframe, mouse parallax, idle breathing, deferred via requestIdleCallback
- [x] `<Headline>` — per-char mask-reveal stagger
- [x] Mission section (left meter + phrase column)
- [x] Programs preview (3-col)
- [x] Latest achievement card (auto-pulled from data)
- [x] Sponsor strip
- [x] CTA + Footer (site-wide in root layout)
- [x] `<PageTransition>` — accent panel sweep
- [ ] Lighthouse pass: Perf ≥ 90, A11y ≥ 95 (deferred until Vercel preview URL exists)

### Phase 3 — Remaining P0 pages

- [x] `/team` — roster grid + mentors from `content/team.json`
- [x] `/programs` — FTC/FLL/Outreach articles + season timeline from `content/programs.json`
- [x] `/robot` — specs grid + subsystems + placeholder gallery
- [x] `/contact` — two-column layout (channels + form) + FAQ + Resend serverless route + IP rate-limit + 503 fallback

### Phase 4 — P1 pages

- [x] `/achievements` — major awards grid + horizontal-scroll season columns
- [x] `/sponsors` — tier sections + sponsor-packet CTA
- [x] `/notebook` + `[slug]` — index, SSG'd posts, lightweight frontmatter + markdown parser in `lib/notebook.ts`

### Phase 5 — Easter eggs + polish

- [x] Konami code → terminal with `whoami` / `roster` / `season` (driven by team + achievements data)
- [x] `console.log` ASCII banner + Konami hint
- [x] `?debug=1` 12-col grid + element outlines
- [x] Custom 404 (terminal connection-refused aesthetic)

### Phase 5.5 — PLAN-locked effects

- [x] `LenisProvider` smooth scroll (skipped on touch + reduced-motion)
- [x] `Cursor` — 6px dot + 28px ring spring lag, 60px expand on interactives
- [x] `MouseGlow` — radial accent glow opted in via `data-glow="on"` on Hero + CTA
