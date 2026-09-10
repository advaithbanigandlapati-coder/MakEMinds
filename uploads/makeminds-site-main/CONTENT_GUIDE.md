# CONTENT_GUIDE.md

How to swap the placeholder content in this repo for the real thing. Every file mentioned here lives under `content/` or `public/`. After editing, run `npm run build` to confirm nothing breaks; no code changes should be needed.

## Conventions

- **`__placeholder: true`** flags any record (or whole file) that has stand-in data. Remove the flag once the entry is verified. A future build hook can warn or fail when placeholders are still present.
- **Naming**: keep paths lowercase, hyphenated. Slugs in notebook files double as the filename (without `.md`).
- **Images**: drop into `public/<area>/`. Reference them by absolute path (`/team/jane-doe.jpg`). Next.js `<Image>` and the `<PhotoFrame>` wrapper both expect explicit width/height — see existing usages.

## 1 · Team roster — `content/team.json`

```jsonc
{
  "members": [
    {
      "name": "Jane Doe",                      // full name
      "role": "Captain",                       // shows in mono uppercase
      "year": "Senior",                        // free text — "Senior", "Class of 2027", etc.
      "bio": "One sentence. Two max.",         // 80–200 chars works best in the card
      "headshot": "/team/jane-doe.jpg"         // 1:1 image, ≥600×600. null if missing.
    }
  ],
  "mentors": [
    {
      "name": "Coach Last",
      "role": "Head Coach",
      "bio": "One sentence.",
      "headshot": "/team/coach-last.jpg"
    }
  ]
}
```

Headshots: drop files into `public/team/<lastname>.jpg`. Square crop. ~600px is enough.

Remove `__placeholder: true` from each member as you verify them, and from the file root when the roster is complete.

## 2 · Sponsors — `content/sponsors.json`

```jsonc
{
  "tiers": [
    {
      "id": "title",                           // url anchor on /sponsors
      "label": "Title Sponsor",
      "blurb": "What this tier funds.",        // 80–120 chars
      "sponsors": [
        {
          "name": "Acme Robotics",
          "url": "https://acme.example",       // null if no website
          "logo": "/sponsors/acme.svg"         // optional; SVG preferred, PNG ok
        }
      ]
    }
  ]
}
```

Logos: drop into `public/sponsors/<slug>.svg`. SVGs render best — they get the same duotone treatment as photos via CSS.

## 3 · Programs — `content/programs.json`

Already has real FTC/FLL copy from your current Google site. The **outreach metrics** are placeholder (`__placeholder: true` on the outreach entry). Update the `metrics` array with verified numbers and remove the flag.

To add a new program: append a new object to `programs` with a unique `id`, a 2-char `code`, name, age range, headline, body, and optional metrics. It'll render automatically on `/programs` and in the home `<ProgramsPreview>`.

## 4 · Achievements — `content/achievements.json`

Verified end-to-end from FTC-Events as of 2026-05-22. Two things to double-check before launch:

- Has anything been added to the **2026 AGE season** since the scrape? Append new `events` entries.
- Are there awards I missed? Add to `majorAwards`. The Home `<LatestAchievement>` automatically pulls the most recent year.

## 5 · Robot — `app/robot/page.tsx`

The `SPECS` array (mass, drivetrain, etc.) and `SUBSYSTEMS` array are inlined in the page file because they only render here. To update: edit those two constants at the top of `app/robot/page.tsx`. Numbers I invented:

- Mass `16.2 kg`
- Top speed `1.8 m/s`
- Auto routines `04`

Swap these for real measurements. **Gallery**: just drop `.jpg` / `.png` / `.webp` / `.avif` files into `public/robot/` — the page reads the directory at build time and renders each through `<PhotoFrame>` (brand duotone + grain) automatically, alphabetical by filename. No JSON wiring needed. When the directory is empty, the page falls back to the `[ fig.NN — pending ]` placeholder cells.

## 6 · Notebook posts — `content/notebook/*.md`

Format:

```markdown
---
title: A short post title
slug: 2026-05-vision-pipeline
date: 2026-05-22
tags: ["vision", "auto"]
excerpt: One sentence shown on the /notebook index.
__placeholder: true
---

Markdown body. Supports:

## Section heads
### Sub-heads

Paragraphs (one blank line between).

- Bulleted lists
- Render with a mono `›` prefix instead of a dot
```

Naming: `YYYY-MM-<topic>.md`. The filename (minus `.md`) becomes the URL slug if you don't set one in frontmatter.

Remove `__placeholder: true` once the post is real. The `/notebook` index shows a `[draft]` badge for placeholder posts.

## 7 · Sponsor packet PDF

If the team has a sponsor packet, drop the PDF at `public/sponsor-packet.pdf` and add a link to `/sponsors` page in the "Become a sponsor" section. (Currently links to the contact form only.)

## 8 · Logo / favicon

- `public/logo-mark.svg` — clean SVG mark used in the TopNav (themeable via `currentColor`)
- `public/logo-full.png` — high-res full logo for hero / large display
- Favicon: replace `app/favicon.ico` with a 32×32 (and ideally 16×16 + Apple touch icon). I left the create-next-app default in place.

## 9 · Social handles + contact

Two places to update:

- `app/contact/page.tsx` — `CHANNELS` array at the top
- `app/_components/layout/Footer.tsx` — contact block

Currently assumed:
- Email: `info@makemindsrobotics.org`
- Instagram: `@makemindsrobotics`
- YouTube: `https://youtube.com/@makemindsrobotics`
- Location: `Edison, NJ — USA`

## 10 · Hero photo

The current Hero shows a wireframe R3F robot. If you want to add a real photo behind/beside it, drop a high-res shot at `public/robot/hero.jpg` and wire it into `app/_components/hero/Hero.tsx`.

## After swapping content

1. `npm run build` — confirms types + content shapes still parse.
2. `npm run dev` — visit each page, confirm nothing is empty.
3. Grep for `__placeholder` in `content/` to find any remaining stubs:
   ```sh
   grep -r "__placeholder" content/
   ```
4. Commit with a `content:` prefix so the diff is easy to spot.
