# Portfolio Flip — Design Spec

**Date:** 2026-07-19
**Owner:** Truong Trung Nghia
**Status:** Approved design → ready for implementation plan

## Goal

A modern, sophisticated, clean personal portfolio that reads and behaves like a physical magazine the visitor flips through. Desktop shows two-page spreads; mobile shows one page at a time with swipe. Content comes from `content.json`. Ships free on Vercel.

## Success Criteria

- Visitor can flip through the whole portfolio like a magazine (drag corner, arrows, keyboard, swipe).
- Opens on **Gallery Gold** theme; a switcher changes to 4 other themes live, persisted across visits.
- All content in `content.json` renders across the correct pages with no fake data.
- Works on desktop (two-page spread) and mobile (single-page swipe).
- Respects `prefers-reduced-motion`.
- Deployed on Vercel free tier, text crawlable for SEO.

## Stack

- **React 18 + Vite + TypeScript**, SPA.
- **Flip engine:** `react-pageflip` (StPageFlip React wrapper). Renders real DOM pages → text stays in the DOM for SEO and accessibility.
- **Styling:** hand-written CSS with CSS custom properties for theming. No Tailwind (keeps the editorial type control precise and the bundle small).
- **Fonts:** Google Fonts, loaded per active theme's stack (see Themes).
- **Content:** `content.json` is the single source of truth. A typed loader (`content.ts`) imports it and exposes a typed `Content` model. Editing the JSON updates the site.
- **Hosting:** Vercel static build. `vercel.json` rewrites all routes to `index.html`.

## Theme System

Six themes, each a set of CSS custom properties (color + font + radius tokens + per-theme motif). Default is **Gallery Gold**.

| Theme | Paper | Ink | Accent | Display font | Body font | Label font | Motif |
|-------|-------|-----|--------|--------------|-----------|------------|-------|
| **Gallery Gold** (default) | `#FFFFFF` | `#171717` | `#A16207` | Cormorant Garamond | Inter | Inter | Centered luxury annual, thin gold rules |
| Mono Blue | `#FAFAFA` | `#09090B` | `#2563EB` | Playfair Display 900 | Inter | JetBrains Mono | Airy, blue dot monogram, mono labels |
| Editorial Ink | `#FAFAFA` | `#09090B` | `#EC4899` | Libre Bodoni | Public Sans | Public Sans | Bold Bodoni masthead, magenta kicker |
| Nocturne (dark) | `#0B0B0D` | `#EDEDEF` | `#F59E0B` | Playfair Display | Inter | JetBrains Mono | Near-black paper, amber glow |
| Terracotta Warm | `#F6EEE3` | `#2B2320` | `#B4532A` | Fraunces (900) | Inter | Inter | Warm clay paper, circle seal, soft-serif |
| Bauhaus Blocks | `#F4F1E9` | `#141414` | `#2555E0` | Archivo (900) | Inter | Archivo | Constructivist corner blocks, uppercase |

Full token set per theme (paper, ink, accent, accent-soft, muted, muted2, border, card, spine, radius, display/body/label font + display weight + label letter-spacing + motif) mirrors the approved brainstorm mockups in `.superpowers/brainstorm/`.

**Switcher:** fixed toolbar in a screen corner (outside the book), lists the 6 themes. Selection sets a `data-theme` attribute on the root and writes `localStorage`. On load, read `localStorage` (fallback Gallery Gold). Swap is instant — no reload. All Google Fonts for all themes are loaded up front (small) so switching never flashes unstyled text.

## Magazine Structure

The book is an ordered list of **pages**. On desktop `react-pageflip` pairs them into spreads (cover shows alone first). On mobile each page shows singly and flips on swipe.

Page order:

1. **Front cover** — masthead, name, role, tagline, issue line, monogram/photo.
2. **Contents** (left) — section list with page numbers + headline stats (2+ / 7+ / 80%).
3. **About** (right) — eyebrow, title, drop-cap lead paragraph, 4 value cards.
4. **Experience — TPS Software** (left) — role, location, period, "current" marker, bullets, tech chips.
5. **Experience — QASoft Solution** (right) — same shape.
6. **Project — Unioss** (left).
7. **Project — Nippoh** (right).
8. **Project — Nail Booking** (left).
9. **Project — Misa ERP** (right).
10. **Skills & Expertise** (left) — 8 skill groups as labeled chip clusters.
11. **Education & Certifications** (right) — degree block + 3 certification rows.
12. **Contact** (left) — title, desc, action buttons, socials.
13. **Back cover** — footer name, socials, footer note, "TTN · Issue 01".

Each **project page** layout: name, tag, period, short description, 4 metric tiles, feature list, tech chips, team size.

## Component Architecture

Small, single-purpose units, each reading typed content:

- `App` — theme provider (context), loads content, renders `Magazine` + `ThemeSwitcher` + `Toolbar`.
- `Magazine` — owns the `react-pageflip` instance, page list, current-page state, responsive single/double mode, navigation handlers.
- `Page` — shared page shell (paper, folio/page-number, eyebrow). Wraps each content page.
- Content page components: `CoverPage`, `ContentsPage`, `AboutPage`, `ExperiencePage`, `ProjectPage`, `SkillsPage`, `EducationPage`, `ContactPage`, `BackCoverPage`.
- `ThemeSwitcher` — the 5-theme picker, localStorage sync.
- `Toolbar` — prev/next arrows, page counter, progress bar.
- `content.ts` — typed import of `content.json` + `Content` types.
- `themes.ts` — the 5 theme token maps.
- `useResponsiveMode` — hook deciding single vs double page from viewport width.

## Data Flow

`content.json` → `content.ts` (typed) → `App` → props down to page components. No mutation, no fetch — content is bundled at build time. Theme lives in React context + `data-theme` on root; CSS variables cascade from there.

## Navigation & Interaction

- **Flip:** drag/swipe page corner (native `react-pageflip`), prev/next arrows in toolbar, keyboard `←` / `→`.
- **Jump:** Contents entries are buttons that flip to the target page.
- **Feedback:** page counter (`03 / 13`), progress bar, current spread reflected live.
- **Reduced motion:** when `prefers-reduced-motion: reduce`, disable the 3D flip animation (instant page change / cross-fade). Navigation still works.

## Responsive Behavior

- **Desktop (≥ ~1024px):** two-page spread, book centered, comfortable margins.
- **Tablet/mobile (< ~1024px):** single-page portrait mode, swipe horizontally, type scale steps down, toolbar compacts.
- No horizontal page-body scroll; book sizes to viewport.

## Assets

- `avatar.jpg` (960×1014, at repo root) → copied to `public/avatar.jpg`. Used on cover and/or contact.
- Content reference `assets/images/avatar.jpeg` is corrected to the real path.
- No project screenshots exist → project pages are typographic (no placeholder/fake images).

## Content Changes (extract / rewrite / remove)

- **Keep** all sections: meta, hero, about, experience, projects, skills, education, contact.
- **Remove** the `nav` array — the magazine navigates via the Contents page, not a nav bar.
- `hero` content feeds the **cover**; `hero.stats` also feed the Contents page stat row.
- Fix avatar path (`assets/images/avatar.jpeg` → `avatar.jpg`).
- No copy rewrite needed — existing copy is strong and used as-is.

## SEO & Accessibility

- Real DOM text (react-pageflip renders DOM, not canvas) → crawlable.
- `<title>`, meta description, and Open Graph tags from `content.json.meta`.
- Semantic headings per page; theme accent colors chosen to meet WCAG contrast (gold adjusted per design DB note).
- Keyboard operable; focus-visible rings kept; reduced-motion honored.

## Deployment

- `npm run build` → `dist/`.
- `vercel.json`: SPA rewrite to `/index.html`.
- Free Vercel project, connected to the repo.

## Out of Scope

- CMS / backend. Content edited via `content.json`.
- Real project screenshots (until provided).
- Multi-language.
- Contact form submission (contact is mailto/tel links).
```
