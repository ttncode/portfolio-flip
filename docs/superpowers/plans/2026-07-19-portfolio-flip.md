# Portfolio Flip Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a magazine-flipbook personal portfolio that a visitor flips through like a physical magazine, driven entirely by `content.json`, with 6 switchable themes (default Gallery Gold) and free Vercel deploy.

**Architecture:** React + Vite + TypeScript SPA. `react-pageflip` renders real DOM pages (SEO-safe) as two-page spreads on desktop, single-page swipe on mobile. Content is a typed import of `content.json`. Themes are CSS-variable sets selected by a `data-theme` attribute on `<html>`, persisted to `localStorage`. Small focused components: one per magazine page, plus Magazine (flip engine), ThemeSwitcher, Toolbar.

**Tech Stack:** React 18, Vite 5, TypeScript, `react-pageflip`, Vitest + @testing-library/react (logic/smoke tests), plain CSS with custom properties, Vercel static hosting.

## Global Constraints

- Node ≥ 18 (dev env has v22.17.1 via nvm — run `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"` first in any fresh shell; `node`/`npm` are nvm functions).
- TypeScript strict mode on.
- Content is the single source of truth: `content.json`. Components never hardcode copy — they read from the typed content model.
- Themes exactly six, ids: `gallery-gold` (default), `mono-blue`, `editorial-ink`, `nocturne`, `terracotta`, `bauhaus`.
- Active theme key persisted under `localStorage["portfolio-theme"]`. First-ever load with no stored value → `gallery-gold`.
- No fake project screenshots. Project pages are typographic.
- Respect `prefers-reduced-motion: reduce` — flips become instant (no animation).
- Fonts (Google): Cormorant Garamond, Inter, Playfair Display, Libre Bodoni, Public Sans, JetBrains Mono, Fraunces, Archivo.
- Testing reality: red-green TDD for pure logic (theme resolution, persistence, responsive hook, content shape). Components get render smoke tests. The flip engine + final look are verified by running the app (`npm run dev`) — noted per task.

---

## File Structure

```
portfolio-flip/
├── content.json                 # edited: drop `nav`, fix avatar path
├── index.html                   # Vite entry + meta/OG tags
├── package.json
├── tsconfig.json / tsconfig.node.json
├── vite.config.ts               # + vitest config
├── vercel.json                  # SPA rewrite
├── public/
│   └── avatar.jpg               # copied from repo root
└── src/
    ├── main.tsx                 # mount + global.css import
    ├── App.tsx                  # ThemeProvider + Magazine + chrome
    ├── styles/
    │   ├── global.css           # reset, fonts, base book/page styles
    │   └── themes.css           # 6 [data-theme] token blocks + motifs
    ├── content/
    │   ├── content.ts           # typed import of content.json
    │   └── types.ts             # Content model types
    ├── theme/
    │   ├── themes.ts            # THEME_LIST, DEFAULT_THEME, ThemeId
    │   ├── themeStorage.ts      # getInitialTheme / persistTheme
    │   └── ThemeProvider.tsx    # context + data-theme application
    ├── hooks/
    │   └── useResponsiveMode.ts # single vs double page
    ├── components/
    │   ├── Magazine.tsx         # HTMLFlipBook + page order + nav
    │   ├── Page.tsx             # forwardRef page shell + Eyebrow/Folio
    │   ├── primitives.tsx       # MetricTile, Chip, StatBlock
    │   ├── ThemeSwitcher.tsx
    │   └── Toolbar.tsx
    └── pages/
        ├── CoverPage.tsx
        ├── ContentsPage.tsx
        ├── AboutPage.tsx
        ├── ExperiencePage.tsx
        ├── ProjectPage.tsx
        ├── SkillsPage.tsx
        ├── EducationPage.tsx
        ├── ContactPage.tsx
        └── BackCoverPage.tsx
```

---

### Task 1: Scaffold project + tooling

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`, `src/setupTests.ts`
- Create: `public/avatar.jpg` (copy of repo-root `avatar.jpg`)
- Test: `src/smoke.test.ts`

**Interfaces:**
- Produces: a runnable Vite app (`npm run dev`), a passing test runner (`npm test`), `App` default export component.

- [ ] **Step 1: Load nvm and scaffold Vite React-TS**

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"
cd /home/ttndev/workspace/personal/portfolio-flip
npm create vite@latest . -- --template react-ts
# If prompted about non-empty dir, choose "Ignore files and continue".
```

- [ ] **Step 2: Install dependencies**

```bash
npm install react-pageflip
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @types/node
```

- [ ] **Step 3: Copy avatar into public/**

```bash
cp avatar.jpg public/avatar.jpg
```

- [ ] **Step 4: Configure Vite + Vitest** — replace `vite.config.ts`:

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
})
```

- [ ] **Step 5: Add test setup + npm test script**

Create `src/setupTests.ts`:

```ts
import '@testing-library/jest-dom'
```

In `package.json` `"scripts"`, add: `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 6: Minimal App + main** — replace `src/App.tsx`:

```tsx
export default function App() {
  return <div id="app-root">Portfolio Flip</div>
}
```

Replace `src/main.tsx`:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

Create empty `src/styles/global.css` (filled in Task 5) so the import resolves:

```css
/* filled in Task 5 */
```

- [ ] **Step 7: Write smoke test**

Create `src/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest'

describe('toolchain', () => {
  it('runs tests', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 8: Run test — expect PASS**

```bash
npm test
```
Expected: 1 passed.

- [ ] **Step 9: Verify dev server boots**

```bash
npm run build
```
Expected: build succeeds, `dist/` produced.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "chore: scaffold vite react-ts + vitest, avatar to public"
```

---

### Task 2: Content model + content.json edits

**Files:**
- Modify: `content.json` (remove `nav`, fix avatar path)
- Create: `src/content/types.ts`, `src/content/content.ts`
- Test: `src/content/content.test.ts`

**Interfaces:**
- Produces: `content` (typed `Content` object, default export of `content.ts`) and named types `Content`, `Hero`, `ExperienceItem`, `Project`, `SkillGroup`, `Education`, `Contact`, `Metric`.

- [ ] **Step 1: Edit `content.json`** — delete the entire `"nav": [...]` array (and its trailing comma), and change `hero.avatar` from `"assets/images/avatar.jpeg"` to `"/avatar.jpg"`.

- [ ] **Step 2: Enable JSON import in TS** — confirm `tsconfig.json` `compilerOptions` has `"resolveJsonModule": true` and `"esModuleInterop": true`. Add them if missing.

- [ ] **Step 3: Write the failing test**

Create `src/content/content.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { content } from './content'

describe('content model', () => {
  it('loads meta + hero', () => {
    expect(content.meta.name).toBe('Truong Trung Nghia')
    expect(content.hero.avatar).toBe('/avatar.jpg')
  })
  it('has 4 projects and 2 experience items', () => {
    expect(content.projects.items).toHaveLength(4)
    expect(content.experience.items).toHaveLength(2)
  })
  it('no longer exposes nav', () => {
    expect((content as Record<string, unknown>).nav).toBeUndefined()
  })
})
```

- [ ] **Step 4: Run test — expect FAIL** (`Cannot find module './content'`)

```bash
npm test src/content/content.test.ts
```

- [ ] **Step 5: Write types**

Create `src/content/types.ts`:

```ts
export interface Metric { num: string; label: string }
export interface Hero {
  badge: string; name: string; role: string; summary: string
  chips: string[]
  actions: { label: string; href: string }[]
  contacts: { type: string; label: string; href: string }[]
  avatar: string
  stats: Metric[]
}
export interface ExperienceItem {
  company: string; role: string; location: string; period: string
  current: boolean; bullets: string[]; tech: string[]
}
export interface Project {
  name: string; tag: string; period: string; desc: string
  metrics: Metric[]; features: string[]; tech: string[]; team: string
}
export interface SkillGroup { title: string; items: string[] }
export interface Education {
  eyebrow: string; title: string
  degree: { title: string; school: string; location: string; period: string }
  certifications: { name: string; issuer: string; date: string }[]
}
export interface Contact {
  title: string; desc: string
  actions: { label: string; href: string }[]
  footerName: string
  socials: { type: string; href: string }[]
  footerNote: string
}
export interface Content {
  meta: { name: string; title: string; description: string; ogDescription: string; url: string }
  hero: Hero
  about: { eyebrow: string; title: string; cards: { title: string; desc: string }[] }
  experience: { eyebrow: string; title: string; items: ExperienceItem[] }
  projects: { eyebrow: string; title: string; items: Project[] }
  skills: { eyebrow: string; title: string; groups: SkillGroup[] }
  education: Education
  contact: Contact
}
```

- [ ] **Step 6: Write typed loader**

Create `src/content/content.ts`:

```ts
import data from '../../content.json'
import type { Content } from './types'

export const content = data as Content
```

- [ ] **Step 7: Run test — expect PASS**

```bash
npm test src/content/content.test.ts
```

- [ ] **Step 8: Commit**

```bash
git add content.json src/content tsconfig.json
git commit -m "feat: typed content model, drop nav, fix avatar path"
```

---

### Task 3: Theme registry

**Files:**
- Create: `src/theme/themes.ts`
- Test: `src/theme/themes.test.ts`

**Interfaces:**
- Produces: `type ThemeId`, `THEME_LIST: { id: ThemeId; label: string }[]`, `THEME_IDS: ThemeId[]`, `DEFAULT_THEME: ThemeId = 'gallery-gold'`, `isThemeId(v: string): v is ThemeId`.

- [ ] **Step 1: Write the failing test**

Create `src/theme/themes.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { THEME_LIST, THEME_IDS, DEFAULT_THEME, isThemeId } from './themes'

describe('theme registry', () => {
  it('has exactly 6 themes', () => {
    expect(THEME_LIST).toHaveLength(6)
  })
  it('default is gallery-gold and is first', () => {
    expect(DEFAULT_THEME).toBe('gallery-gold')
    expect(THEME_LIST[0].id).toBe('gallery-gold')
  })
  it('exposes the exact id set', () => {
    expect(THEME_IDS).toEqual([
      'gallery-gold', 'mono-blue', 'editorial-ink', 'nocturne', 'terracotta', 'bauhaus',
    ])
  })
  it('validates ids', () => {
    expect(isThemeId('nocturne')).toBe(true)
    expect(isThemeId('swiss')).toBe(false)
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test src/theme/themes.test.ts
```

- [ ] **Step 3: Implement**

Create `src/theme/themes.ts`:

```ts
export const THEME_LIST = [
  { id: 'gallery-gold', label: 'Gallery Gold' },
  { id: 'mono-blue', label: 'Mono Blue' },
  { id: 'editorial-ink', label: 'Editorial Ink' },
  { id: 'nocturne', label: 'Nocturne' },
  { id: 'terracotta', label: 'Terracotta Warm' },
  { id: 'bauhaus', label: 'Bauhaus Blocks' },
] as const

export type ThemeId = (typeof THEME_LIST)[number]['id']
export const THEME_IDS = THEME_LIST.map((t) => t.id) as ThemeId[]
export const DEFAULT_THEME: ThemeId = 'gallery-gold'
export function isThemeId(v: string): v is ThemeId {
  return (THEME_IDS as string[]).includes(v)
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npm test src/theme/themes.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/theme/themes.ts src/theme/themes.test.ts
git commit -m "feat: theme registry (6 themes, gallery-gold default)"
```

---

### Task 4: Theme persistence + provider

**Files:**
- Create: `src/theme/themeStorage.ts`, `src/theme/ThemeProvider.tsx`
- Test: `src/theme/themeStorage.test.ts`

**Interfaces:**
- Consumes: `ThemeId`, `DEFAULT_THEME`, `isThemeId` (Task 3).
- Produces:
  - `STORAGE_KEY = 'portfolio-theme'`
  - `getInitialTheme(): ThemeId` — reads localStorage, falls back to `DEFAULT_THEME`
  - `persistTheme(id: ThemeId): void`
  - `ThemeProvider` component (wraps app, applies `data-theme` to `document.documentElement`)
  - `useTheme(): { theme: ThemeId; setTheme: (id: ThemeId) => void }`

- [ ] **Step 1: Write the failing test**

Create `src/theme/themeStorage.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { getInitialTheme, persistTheme, STORAGE_KEY } from './themeStorage'

describe('theme storage', () => {
  beforeEach(() => localStorage.clear())

  it('defaults to gallery-gold when nothing stored', () => {
    expect(getInitialTheme()).toBe('gallery-gold')
  })
  it('returns a valid stored theme', () => {
    localStorage.setItem(STORAGE_KEY, 'nocturne')
    expect(getInitialTheme()).toBe('nocturne')
  })
  it('ignores an invalid stored value', () => {
    localStorage.setItem(STORAGE_KEY, 'not-a-theme')
    expect(getInitialTheme()).toBe('gallery-gold')
  })
  it('persists a theme', () => {
    persistTheme('terracotta')
    expect(localStorage.getItem(STORAGE_KEY)).toBe('terracotta')
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test src/theme/themeStorage.test.ts
```

- [ ] **Step 3: Implement storage**

Create `src/theme/themeStorage.ts`:

```ts
import { DEFAULT_THEME, isThemeId, type ThemeId } from './themes'

export const STORAGE_KEY = 'portfolio-theme'

export function getInitialTheme(): ThemeId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && isThemeId(stored)) return stored
  } catch {
    /* localStorage unavailable (SSR/private mode) — fall through */
  }
  return DEFAULT_THEME
}

export function persistTheme(id: ThemeId): void {
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    /* ignore write failures */
  }
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npm test src/theme/themeStorage.test.ts
```

- [ ] **Step 5: Implement provider**

Create `src/theme/ThemeProvider.tsx`:

```tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { ThemeId } from './themes'
import { getInitialTheme, persistTheme } from './themeStorage'

interface ThemeContextValue {
  theme: ThemeId
  setTheme: (id: ThemeId) => void
}
const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const setTheme = (id: ThemeId) => {
    persistTheme(id)
    setThemeState(id)
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
```

- [ ] **Step 6: Commit**

```bash
git add src/theme/themeStorage.ts src/theme/themeStorage.test.ts src/theme/ThemeProvider.tsx
git commit -m "feat: theme persistence + provider"
```

---

### Task 5: Global CSS + theme token blocks + fonts

**Files:**
- Create/replace: `src/styles/global.css`, `src/styles/themes.css`
- Modify: `src/main.tsx` (import themes.css)

**Interfaces:**
- Produces: CSS custom properties per `[data-theme]`; base classes used by pages: `.book`, `.page`, `.pg-pad`, `.eyebrow`, `.folio`, `.toc-h`, `.toc-row`, `.about-h`, `.lead`, `.drop`, `.cards2`, `.mini`, `.stat`, `.chip`, `.metric`, `.display`, `.label`. These class names are the contract Tasks 7–10 render against.

*Verification: visual — checked by running the app in Task 11+. No unit test.*

- [ ] **Step 1: Write `src/styles/themes.css`** — the six token blocks + motifs. Values copied from the approved brainstorm mockups:

```css
/* Fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&family=Inter:wght@300;400;500;600;700&family=Libre+Bodoni:wght@400;500;700&family=Public+Sans:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,900;1,9..144,400;1,9..144,600&family=Archivo:wght@500;700;900&display=swap');

:root[data-theme='gallery-gold']{
  --paper:#FFFFFF;--ink:#171717;--accent:#A16207;--accent-soft:#FBF3E2;--muted:#737373;--muted2:#404040;
  --border:#E5E5E5;--card:#FFFFFF;--spine:rgba(0,0,0,.04);--radius:8px;
  --font-display:'Cormorant Garamond',serif;--font-body:'Inter',sans-serif;--font-label:'Inter',sans-serif;
  --display-weight:600;--label-ls:.28em;--display-transform:none;
}
:root[data-theme='mono-blue']{
  --paper:#FAFAFA;--ink:#09090B;--accent:#2563EB;--accent-soft:#EFF4FF;--muted:#64748B;--muted2:#3F3F46;
  --border:#E4E4E7;--card:#FFFFFF;--spine:rgba(0,0,0,.06);--radius:9px;
  --font-display:'Playfair Display',serif;--font-body:'Inter',sans-serif;--font-label:'JetBrains Mono',monospace;
  --display-weight:900;--label-ls:.26em;--display-transform:none;
}
:root[data-theme='editorial-ink']{
  --paper:#FAFAFA;--ink:#09090B;--accent:#EC4899;--accent-soft:#FDEAF4;--muted:#64748B;--muted2:#3F3F46;
  --border:#E4E4E7;--card:#FFFFFF;--spine:rgba(0,0,0,.06);--radius:6px;
  --font-display:'Libre Bodoni',serif;--font-body:'Public Sans',sans-serif;--font-label:'Public Sans',sans-serif;
  --display-weight:700;--label-ls:.2em;--display-transform:none;
}
:root[data-theme='nocturne']{
  --paper:#0B0B0D;--ink:#EDEDEF;--accent:#F59E0B;--accent-soft:rgba(245,158,11,.14);--muted:#8A8A93;--muted2:#B8B8C0;
  --border:rgba(255,255,255,.13);--card:#141418;--spine:rgba(0,0,0,.5);--radius:9px;
  --font-display:'Playfair Display',serif;--font-body:'Inter',sans-serif;--font-label:'JetBrains Mono',monospace;
  --display-weight:700;--label-ls:.26em;--display-transform:none;
}
:root[data-theme='terracotta']{
  --paper:#F6EEE3;--ink:#2B2320;--accent:#B4532A;--accent-soft:#F0DFCB;--muted:#8A7A63;--muted2:#5C5147;
  --border:#DBC9B4;--card:#FCF6EC;--spine:rgba(0,0,0,.045);--radius:12px;
  --font-display:'Fraunces',serif;--font-body:'Inter',sans-serif;--font-label:'Inter',sans-serif;
  --display-weight:900;--label-ls:.18em;--display-transform:none;
}
:root[data-theme='bauhaus']{
  --paper:#F4F1E9;--ink:#141414;--accent:#2555E0;--accent-soft:#DBE3FB;--muted:#555555;--muted2:#333333;
  --border:#D8D3C6;--card:#FCFAF3;--spine:rgba(0,0,0,.05);--radius:0px;
  --font-display:'Archivo',sans-serif;--font-body:'Inter',sans-serif;--font-label:'Archivo',sans-serif;
  --display-weight:900;--label-ls:.12em;--display-transform:uppercase;
}
/* Motif: Bauhaus red corner block on left pages */
:root[data-theme='bauhaus'] .pg.left::before{
  content:"";position:absolute;top:0;right:0;width:76px;height:76px;background:#E23B2E;border-radius:0 0 0 76px;z-index:1;
}
:root[data-theme='bauhaus'] .eyebrow, :root[data-theme='bauhaus'] .toc-h{position:relative;z-index:2}
/* Motif: Gallery Gold centers cover + about headings */
:root[data-theme='gallery-gold'] .cover-inner{text-align:center;align-items:center}
```

- [ ] **Step 2: Write `src/styles/global.css`** — reset + base layout used by all pages:

```css
*,*::before,*::after{box-sizing:border-box}
html,body,#root{height:100%}
body{margin:0;background:#2a2a2e;color:var(--ink);font-family:var(--font-body);
  -webkit-font-smoothing:antialiased;overflow:hidden}
button{font:inherit;cursor:pointer}

.stage{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:24px}

/* react-pageflip pages */
.page{background:var(--paper);color:var(--ink);overflow:hidden}
.pg{position:relative;height:100%;padding:38px 40px;display:flex;flex-direction:column}
.pg.left::after{content:"";position:absolute;top:0;right:0;width:24px;height:100%;
  background:linear-gradient(90deg,var(--spine),transparent)}
.pg.right::before{content:"";position:absolute;top:0;left:0;width:24px;height:100%;
  background:linear-gradient(-90deg,var(--spine),transparent)}

.eyebrow{font-family:var(--font-label);font-size:10px;letter-spacing:var(--label-ls);
  text-transform:uppercase;color:var(--accent);font-weight:600}
.folio{position:absolute;bottom:22px;font-family:var(--font-label);font-size:9px;
  letter-spacing:.14em;color:var(--muted);text-transform:uppercase}
.folio.l{left:40px}.folio.r{right:40px}
.display{font-family:var(--font-display);font-weight:var(--display-weight);text-transform:var(--display-transform)}
.label{font-family:var(--font-label)}

/* Cover */
.cover-inner{height:100%;display:flex;flex-direction:column}
.cover-name{font-family:var(--font-display);font-weight:var(--display-weight);
  text-transform:var(--display-transform);font-size:clamp(36px,5vw,54px);line-height:.95;margin:auto 0 12px}
.cover-role{font-family:var(--font-label);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted2)}
.cover-avatar{width:74px;height:74px;border-radius:50%;object-fit:cover;border:2px solid var(--accent)}

/* Contents */
.toc-h{font-family:var(--font-display);font-weight:var(--display-weight);text-transform:var(--display-transform);
  font-size:32px;line-height:1;margin:12px 0 22px}
.toc-row{display:flex;justify-content:space-between;align-items:baseline;padding:11px 0;
  border-top:1px solid var(--border);font-size:13px}
.toc-row:last-of-type{border-bottom:1px solid var(--border)}
.toc-row .t{font-weight:600}
.toc-row .s{display:block;font-size:11px;color:var(--muted);margin-top:2px}
.toc-row .p{font-family:var(--font-label);font-size:11px;color:var(--accent);background:none;border:none}

/* About */
.about-h{font-family:var(--font-display);font-weight:var(--display-weight);text-transform:var(--display-transform);
  font-size:29px;line-height:1.05;margin:12px 0 16px}
.lead{font-size:13.5px;line-height:1.6;color:var(--muted2)}
.drop{float:left;font-family:var(--font-display);font-weight:var(--display-weight);
  font-size:54px;line-height:.72;padding:6px 10px 0 0;color:var(--accent)}
.cards2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:22px}
.mini{border:1px solid var(--border);border-radius:var(--radius);padding:14px;background:var(--card)}
.mini h4{margin:0 0 6px;font-size:12.5px}
.mini p{margin:0;font-size:11px;line-height:1.45;color:var(--muted)}

/* shared primitives */
.stats{display:flex;gap:22px;margin-top:26px}
.stat .n{font-family:var(--font-display);font-weight:var(--display-weight);font-size:28px;color:var(--accent);line-height:1}
.stat .l{font-family:var(--font-label);font-size:9px;color:var(--muted);margin-top:5px;
  letter-spacing:.06em;text-transform:uppercase}
.metric{border:1px solid var(--border);border-radius:var(--radius);padding:10px 12px;background:var(--card)}
.metric .n{font-family:var(--font-display);font-weight:var(--display-weight);font-size:22px;color:var(--accent);line-height:1}
.metric .l{font-size:9.5px;color:var(--muted);margin-top:4px}
.chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}
.chip{font-family:var(--font-label);font-size:10px;letter-spacing:.04em;padding:4px 9px;border-radius:999px;
  border:1px solid var(--border);color:var(--muted2);background:var(--accent-soft)}
.section-title{font-family:var(--font-display);font-weight:var(--display-weight);
  text-transform:var(--display-transform);font-size:26px;line-height:1.05;margin:10px 0 16px}
.bullets{margin:14px 0 0;padding:0;list-style:none}
.bullets li{font-size:12px;line-height:1.5;color:var(--muted2);padding-left:16px;position:relative;margin-bottom:8px}
.bullets li::before{content:"";position:absolute;left:0;top:7px;width:6px;height:6px;border-radius:50%;background:var(--accent)}

/* Reduced motion: kill flip animation shadows */
@media (prefers-reduced-motion: reduce){
  .page{transition:none !important}
}

/* Mobile single page */
@media (max-width:1024px){
  .pg{padding:26px 24px}
  .cover-name{font-size:34px}
  .cards2{grid-template-columns:1fr}
}
```

- [ ] **Step 3: Import themes.css** — in `src/main.tsx` add below the global import:

```tsx
import './styles/themes.css'
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```
Expected: build succeeds (CSS valid).

- [ ] **Step 5: Commit**

```bash
git add src/styles src/main.tsx
git commit -m "feat: global css + 6 theme token blocks + fonts"
```

---

### Task 6: Responsive mode hook

**Files:**
- Create: `src/hooks/useResponsiveMode.ts`
- Test: `src/hooks/useResponsiveMode.test.ts`

**Interfaces:**
- Produces: `useResponsiveMode(): 'single' | 'double'` — `'single'` when `window.innerWidth < 1024`, else `'double'`. Updates on resize.

- [ ] **Step 1: Write the failing test**

Create `src/hooks/useResponsiveMode.test.ts`:

```ts
import { describe, it, expect, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { useResponsiveMode } from './useResponsiveMode'

function setWidth(w: number) {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: w })
  window.dispatchEvent(new Event('resize'))
}
afterEach(() => setWidth(1280))

describe('useResponsiveMode', () => {
  it('double on wide viewport', () => {
    setWidth(1280)
    const { result } = renderHook(() => useResponsiveMode())
    expect(result.current).toBe('double')
  })
  it('single on narrow viewport', () => {
    setWidth(600)
    const { result } = renderHook(() => useResponsiveMode())
    expect(result.current).toBe('single')
  })
  it('reacts to resize', () => {
    setWidth(1280)
    const { result } = renderHook(() => useResponsiveMode())
    act(() => setWidth(500))
    expect(result.current).toBe('single')
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test src/hooks/useResponsiveMode.test.ts
```

- [ ] **Step 3: Implement**

Create `src/hooks/useResponsiveMode.ts`:

```ts
import { useEffect, useState } from 'react'

const BREAKPOINT = 1024
function compute(): 'single' | 'double' {
  return window.innerWidth < BREAKPOINT ? 'single' : 'double'
}

export function useResponsiveMode(): 'single' | 'double' {
  const [mode, setMode] = useState<'single' | 'double'>(compute)
  useEffect(() => {
    const onResize = () => setMode(compute())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return mode
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npm test src/hooks/useResponsiveMode.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/hooks
git commit -m "feat: useResponsiveMode hook"
```

---

### Task 7: Page shell + primitives

**Files:**
- Create: `src/components/Page.tsx`, `src/components/primitives.tsx`
- Test: `src/components/Page.test.tsx`

**Interfaces:**
- Consumes: CSS classes from Task 5.
- Produces:
  - `Page` — `React.forwardRef<HTMLDivElement, { side?: 'left' | 'right'; className?: string; children: ReactNode }>`. Renders `<div class="page">` (ref target, required by react-pageflip) wrapping `<div class="pg {side}">`.
  - `Eyebrow({ children })`, `Folio({ side, children })`
  - `MetricTile({ metric })`, `Chip({ children })`, `Stat({ metric })` from `primitives.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/Page.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Page, Eyebrow } from './Page'

describe('Page', () => {
  it('forwards ref to the page div and renders children', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Page ref={ref} side="left"><Eyebrow>About</Eyebrow></Page>)
    expect(ref.current).not.toBeNull()
    expect(ref.current!.classList.contains('page')).toBe(true)
    expect(screen.getByText('About')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test src/components/Page.test.tsx
```

- [ ] **Step 3: Implement Page**

Create `src/components/Page.tsx`:

```tsx
import { forwardRef, type ReactNode } from 'react'

interface PageProps { side?: 'left' | 'right'; className?: string; children: ReactNode }

export const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ side = 'right', className = '', children }, ref) => (
    <div className="page" ref={ref}>
      <div className={`pg ${side} ${className}`}>{children}</div>
    </div>
  ),
)
Page.displayName = 'Page'

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow">{children}</div>
}
export function Folio({ side, children }: { side: 'l' | 'r'; children: ReactNode }) {
  return <div className={`folio ${side}`}>{children}</div>
}
```

- [ ] **Step 4: Implement primitives**

Create `src/components/primitives.tsx`:

```tsx
import type { ReactNode } from 'react'
import type { Metric } from '../content/types'

export function MetricTile({ metric }: { metric: Metric }) {
  return (
    <div className="metric">
      <div className="n">{metric.num}</div>
      <div className="l">{metric.label}</div>
    </div>
  )
}
export function Stat({ metric }: { metric: Metric }) {
  return (
    <div className="stat">
      <div className="n">{metric.num}</div>
      <div className="l">{metric.label}</div>
    </div>
  )
}
export function Chip({ children }: { children: ReactNode }) {
  return <span className="chip">{children}</span>
}
```

- [ ] **Step 5: Run test — expect PASS**

```bash
npm test src/components/Page.test.tsx
```

- [ ] **Step 6: Commit**

```bash
git add src/components/Page.tsx src/components/primitives.tsx src/components/Page.test.tsx
git commit -m "feat: page shell (forwardRef) + primitives"
```

---

### Task 8: Cover, Contents, About, Back cover pages

**Files:**
- Create: `src/pages/CoverPage.tsx`, `src/pages/ContentsPage.tsx`, `src/pages/AboutPage.tsx`, `src/pages/BackCoverPage.tsx`
- Test: `src/pages/pagesA.test.tsx`

**Interfaces:**
- Consumes: `Page`, `Eyebrow`, `Folio` (Task 7); `Stat` (Task 7); `content` (Task 2).
- Produces (all `forwardRef<HTMLDivElement>`, no props — read `content` directly):
  `CoverPage`, `ContentsPage`, `AboutPage`, `BackCoverPage`.
- Contents links call an injected `onJump(page: number)` — signature: `ContentsPage` takes prop `{ onJump: (page: number) => void }` plus forwarded ref.

- [ ] **Step 1: Write the failing smoke test**

Create `src/pages/pagesA.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { CoverPage } from './CoverPage'
import { AboutPage } from './AboutPage'
import { ContentsPage } from './ContentsPage'

describe('A pages', () => {
  it('cover shows name and role', () => {
    render(<CoverPage ref={createRef<HTMLDivElement>()} />)
    expect(screen.getByText('Truong Trung Nghia')).toBeInTheDocument()
    expect(screen.getAllByText(/Full Stack Developer/i).length).toBeGreaterThan(0)
  })
  it('about shows the 4 value cards', () => {
    render(<AboutPage ref={createRef<HTMLDivElement>()} />)
    expect(screen.getByText('Enterprise Focus')).toBeInTheDocument()
    expect(screen.getByText('Measurable Impact')).toBeInTheDocument()
  })
  it('contents lists sections', () => {
    render(<ContentsPage ref={createRef<HTMLDivElement>()} onJump={() => {}} />)
    expect(screen.getByText('Projects')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test src/pages/pagesA.test.tsx
```

- [ ] **Step 3: Implement CoverPage**

Create `src/pages/CoverPage.tsx`:

```tsx
import { forwardRef } from 'react'
import { Page } from '../components/Page'
import { content } from '../content/content'

export const CoverPage = forwardRef<HTMLDivElement>((_, ref) => {
  const { hero } = content
  return (
    <Page ref={ref} side="right" className="cover">
      <div className="cover-inner">
        <div className="eyebrow" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Portfolio — 2025</span><span>No. 01</span>
        </div>
        <div className="cover-name">{hero.name}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="cover-role">{hero.role}</span>
          <img className="cover-avatar" src={hero.avatar} alt={hero.name} />
        </div>
        <p className="lead" style={{ marginTop: 18, fontStyle: 'italic' }}>“{hero.summary}”</p>
      </div>
    </Page>
  )
})
CoverPage.displayName = 'CoverPage'
```

- [ ] **Step 4: Implement ContentsPage**

Create `src/pages/ContentsPage.tsx`:

```tsx
import { forwardRef } from 'react'
import { Page, Eyebrow, Folio } from '../components/Page'
import { Stat } from '../components/primitives'
import { content } from '../content/content'

const ENTRIES = [
  { t: 'About', s: 'Turning complex problems into elegant solutions', p: '02', page: 2 },
  { t: 'Experience', s: 'TPS Software · QASoft Solution', p: '04', page: 3 },
  { t: 'Projects', s: 'Unioss · Nippoh · Nail Booking · Misa ERP', p: '06', page: 5 },
  { t: 'Skills & Education', s: 'Stack, tooling, certifications', p: '12', page: 9 },
  { t: 'Contact', s: "Let's build something great", p: '14', page: 11 },
]

interface Props { onJump: (page: number) => void }

export const ContentsPage = forwardRef<HTMLDivElement, Props>(({ onJump }, ref) => (
  <Page ref={ref} side="left">
    <Eyebrow>Issue 01 — Contents</Eyebrow>
    <div className="toc-h">Inside this issue</div>
    {ENTRIES.map((e) => (
      <div className="toc-row" key={e.t}>
        <span>
          <button className="p t" style={{ all: 'unset', cursor: 'pointer' }} onClick={() => onJump(e.page)}>
            <span className="t">{e.t}</span>
          </button>
          <span className="s">{e.s}</span>
        </span>
        <span className="p">{e.p}</span>
      </div>
    ))}
    <div className="stats">
      {content.hero.stats.map((s) => <Stat key={s.label} metric={s} />)}
    </div>
    <Folio side="l">TTN · 01</Folio>
  </Page>
))
ContentsPage.displayName = 'ContentsPage'
```

- [ ] **Step 5: Implement AboutPage**

Create `src/pages/AboutPage.tsx`:

```tsx
import { forwardRef } from 'react'
import { Page, Eyebrow, Folio } from '../components/Page'
import { content } from '../content/content'

export const AboutPage = forwardRef<HTMLDivElement>((_, ref) => {
  const { about, hero } = content
  const [first, ...rest] = hero.summary
  return (
    <Page ref={ref} side="right">
      <Eyebrow>{about.eyebrow}</Eyebrow>
      <div className="about-h">{about.title}</div>
      <p className="lead"><span className="drop">{first}</span>{rest.join('')}</p>
      <div className="cards2">
        {about.cards.map((c) => (
          <div className="mini" key={c.title}><h4>{c.title}</h4><p>{c.desc}</p></div>
        ))}
      </div>
      <Folio side="r">About · 02</Folio>
    </Page>
  )
})
AboutPage.displayName = 'AboutPage'
```

- [ ] **Step 6: Implement BackCoverPage**

Create `src/pages/BackCoverPage.tsx`:

```tsx
import { forwardRef } from 'react'
import { Page } from '../components/Page'
import { content } from '../content/content'

export const BackCoverPage = forwardRef<HTMLDivElement>((_, ref) => {
  const { contact } = content
  return (
    <Page ref={ref} side="left" className="cover">
      <div className="cover-inner" style={{ justifyContent: 'flex-end', gap: 12 }}>
        <div className="cover-name" style={{ margin: 0 }}>{contact.footerName}</div>
        <div className="chips">
          {contact.socials.map((s) => (
            <a className="chip" key={s.type} href={s.href} target="_blank" rel="noreferrer">{s.type}</a>
          ))}
        </div>
        <div className="eyebrow" style={{ marginTop: 10 }}>{contact.footerNote}</div>
      </div>
    </Page>
  )
})
BackCoverPage.displayName = 'BackCoverPage'
```

- [ ] **Step 7: Run test — expect PASS**

```bash
npm test src/pages/pagesA.test.tsx
```

- [ ] **Step 8: Commit**

```bash
git add src/pages/CoverPage.tsx src/pages/ContentsPage.tsx src/pages/AboutPage.tsx src/pages/BackCoverPage.tsx src/pages/pagesA.test.tsx
git commit -m "feat: cover, contents, about, back-cover pages"
```

---

### Task 9: Experience + Project pages

**Files:**
- Create: `src/pages/ExperiencePage.tsx`, `src/pages/ProjectPage.tsx`
- Test: `src/pages/pagesB.test.tsx`

**Interfaces:**
- Consumes: `Page`, `Eyebrow`, `Folio`, `MetricTile`, `Chip`, types `ExperienceItem`/`Project`.
- Produces:
  - `ExperiencePage` — `forwardRef<HTMLDivElement, { item: ExperienceItem; side: 'left' | 'right'; folio: string }>`
  - `ProjectPage` — `forwardRef<HTMLDivElement, { project: Project; side: 'left' | 'right'; folio: string }>`

- [ ] **Step 1: Write the failing smoke test**

Create `src/pages/pagesB.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { ExperiencePage } from './ExperiencePage'
import { ProjectPage } from './ProjectPage'
import { content } from '../content/content'

describe('B pages', () => {
  it('experience shows company + first bullet', () => {
    const item = content.experience.items[0]
    render(<ExperiencePage ref={createRef<HTMLDivElement>()} item={item} side="left" folio="Work · 04" />)
    expect(screen.getByText(item.company)).toBeInTheDocument()
    expect(screen.getByText(item.bullets[0])).toBeInTheDocument()
  })
  it('project shows name + a metric number', () => {
    const p = content.projects.items[0]
    render(<ProjectPage ref={createRef<HTMLDivElement>()} project={p} side="right" folio="Work · 06" />)
    expect(screen.getByText(p.name)).toBeInTheDocument()
    expect(screen.getByText(p.metrics[0].num)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test src/pages/pagesB.test.tsx
```

- [ ] **Step 3: Implement ExperiencePage**

Create `src/pages/ExperiencePage.tsx`:

```tsx
import { forwardRef } from 'react'
import { Page, Eyebrow, Folio } from '../components/Page'
import { Chip } from '../components/primitives'
import type { ExperienceItem } from '../content/types'

interface Props { item: ExperienceItem; side: 'left' | 'right'; folio: string }

export const ExperiencePage = forwardRef<HTMLDivElement, Props>(({ item, side, folio }, ref) => (
  <Page ref={ref} side={side}>
    <Eyebrow>{item.current ? 'Current Role' : 'Experience'}</Eyebrow>
    <div className="section-title">{item.company}</div>
    <div className="label" style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted2)' }}>
      {item.role} · {item.location}
    </div>
    <div className="label" style={{ fontSize: 10, color: 'var(--accent)', marginTop: 4 }}>{item.period}</div>
    <ul className="bullets">{item.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
    <div className="chips">{item.tech.map((t) => <Chip key={t}>{t}</Chip>)}</div>
    <Folio side={side === 'left' ? 'l' : 'r'}>{folio}</Folio>
  </Page>
))
ExperiencePage.displayName = 'ExperiencePage'
```

- [ ] **Step 4: Implement ProjectPage**

Create `src/pages/ProjectPage.tsx`:

```tsx
import { forwardRef } from 'react'
import { Page, Eyebrow, Folio } from '../components/Page'
import { MetricTile, Chip } from '../components/primitives'
import type { Project } from '../content/types'

interface Props { project: Project; side: 'left' | 'right'; folio: string }

export const ProjectPage = forwardRef<HTMLDivElement, Props>(({ project, side, folio }, ref) => (
  <Page ref={ref} side={side}>
    <Eyebrow>{project.tag} · {project.period}</Eyebrow>
    <div className="section-title">{project.name}</div>
    <p className="lead" style={{ fontSize: 12 }}>{project.desc}</p>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
      {project.metrics.map((m) => <MetricTile key={m.label} metric={m} />)}
    </div>
    <ul className="bullets" style={{ marginTop: 12 }}>
      {project.features.map((f) => <li key={f}>{f}</li>)}
    </ul>
    <div className="chips">{project.tech.map((t) => <Chip key={t}>{t}</Chip>)}</div>
    <Folio side={side === 'left' ? 'l' : 'r'}>{folio} · {project.team}</Folio>
  </Page>
))
ProjectPage.displayName = 'ProjectPage'
```

- [ ] **Step 5: Run test — expect PASS**

```bash
npm test src/pages/pagesB.test.tsx
```

- [ ] **Step 6: Commit**

```bash
git add src/pages/ExperiencePage.tsx src/pages/ProjectPage.tsx src/pages/pagesB.test.tsx
git commit -m "feat: experience + project pages"
```

---

### Task 10: Skills, Education, Contact pages

**Files:**
- Create: `src/pages/SkillsPage.tsx`, `src/pages/EducationPage.tsx`, `src/pages/ContactPage.tsx`
- Test: `src/pages/pagesC.test.tsx`

**Interfaces:**
- Consumes: `Page`, `Eyebrow`, `Folio`, `Chip`, `content`.
- Produces (all `forwardRef<HTMLDivElement>`, no props): `SkillsPage`, `EducationPage`, `ContactPage`.

- [ ] **Step 1: Write the failing smoke test**

Create `src/pages/pagesC.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { SkillsPage } from './SkillsPage'
import { EducationPage } from './EducationPage'
import { ContactPage } from './ContactPage'

describe('C pages', () => {
  it('skills shows a group title', () => {
    render(<SkillsPage ref={createRef<HTMLDivElement>()} />)
    expect(screen.getByText('Languages')).toBeInTheDocument()
  })
  it('education shows the degree', () => {
    render(<EducationPage ref={createRef<HTMLDivElement>()} />)
    expect(screen.getByText(/Information Technology/)).toBeInTheDocument()
  })
  it('contact shows the title', () => {
    render(<ContactPage ref={createRef<HTMLDivElement>()} />)
    expect(screen.getByText(/build something great/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test src/pages/pagesC.test.tsx
```

- [ ] **Step 3: Implement SkillsPage**

Create `src/pages/SkillsPage.tsx`:

```tsx
import { forwardRef } from 'react'
import { Page, Eyebrow, Folio } from '../components/Page'
import { Chip } from '../components/primitives'
import { content } from '../content/content'

export const SkillsPage = forwardRef<HTMLDivElement>((_, ref) => {
  const { skills } = content
  return (
    <Page ref={ref} side="left">
      <Eyebrow>{skills.eyebrow}</Eyebrow>
      <div className="section-title">{skills.title}</div>
      <div style={{ overflowY: 'auto' }}>
        {skills.groups.map((g) => (
          <div key={g.title} style={{ marginBottom: 12 }}>
            <div className="label" style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>{g.title}</div>
            <div className="chips">{g.items.map((i) => <Chip key={i}>{i}</Chip>)}</div>
          </div>
        ))}
      </div>
      <Folio side="l">Skills · 12</Folio>
    </Page>
  )
})
SkillsPage.displayName = 'SkillsPage'
```

- [ ] **Step 4: Implement EducationPage**

Create `src/pages/EducationPage.tsx`:

```tsx
import { forwardRef } from 'react'
import { Page, Eyebrow, Folio } from '../components/Page'
import { content } from '../content/content'

export const EducationPage = forwardRef<HTMLDivElement>((_, ref) => {
  const { education } = content
  const d = education.degree
  return (
    <Page ref={ref} side="right">
      <Eyebrow>{education.eyebrow}</Eyebrow>
      <div className="section-title">{education.title}</div>
      <div className="mini" style={{ marginTop: 8 }}>
        <h4>{d.title}</h4>
        <p>{d.school} · {d.location}</p>
        <p className="label" style={{ color: 'var(--accent)', marginTop: 4 }}>{d.period}</p>
      </div>
      <div className="label" style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)', margin: '16px 0 8px' }}>Certifications</div>
      {education.certifications.map((c) => (
        <div className="toc-row" key={c.name}>
          <span><span className="t">{c.name}</span><span className="s">{c.issuer}</span></span>
          <span className="p">{c.date}</span>
        </div>
      ))}
      <Folio side="r">Education · 13</Folio>
    </Page>
  )
})
EducationPage.displayName = 'EducationPage'
```

- [ ] **Step 5: Implement ContactPage**

Create `src/pages/ContactPage.tsx`:

```tsx
import { forwardRef } from 'react'
import { Page, Eyebrow, Folio } from '../components/Page'
import { content } from '../content/content'

export const ContactPage = forwardRef<HTMLDivElement>((_, ref) => {
  const { contact } = content
  return (
    <Page ref={ref} side="left">
      <Eyebrow>Contact</Eyebrow>
      <div className="about-h">{contact.title}</div>
      <p className="lead">{contact.desc}</p>
      <div className="chips" style={{ marginTop: 20, gap: 10 }}>
        {contact.actions.map((a) => (
          <a key={a.label} className="chip" style={{ padding: '9px 16px', fontSize: 12 }} href={a.href}>{a.label}</a>
        ))}
      </div>
      <div className="chips" style={{ marginTop: 14 }}>
        {content.hero.contacts.map((c) => (
          <a key={c.type} className="chip" href={c.href} target="_blank" rel="noreferrer">{c.label}</a>
        ))}
      </div>
      <Folio side="l">Contact · 14</Folio>
    </Page>
  )
})
ContactPage.displayName = 'ContactPage'
```

- [ ] **Step 6: Run test — expect PASS**

```bash
npm test src/pages/pagesC.test.tsx
```

- [ ] **Step 7: Commit**

```bash
git add src/pages/SkillsPage.tsx src/pages/EducationPage.tsx src/pages/ContactPage.tsx src/pages/pagesC.test.tsx
git commit -m "feat: skills, education, contact pages"
```

---

### Task 11: Magazine (flip engine + page order + navigation)

**Files:**
- Create: `src/components/Magazine.tsx`
- Modify: `src/App.tsx` (temporary mount for verification)

**Interfaces:**
- Consumes: all page components (Tasks 8–10), `useResponsiveMode` (Task 6).
- Produces: `Magazine` component (no props) rendering `HTMLFlipBook` with the 13-page order. Exposes navigation callbacks internally via a `pageFlip` ref. Emits current page + total via a render-prop-free internal state consumed by Toolbar in Task 12 — refactor note: Magazine will own state and render Toolbar/ThemeSwitcher as children in Task 13. For now, render bare.

*Verification: run the app and flip — no unit test (react-pageflip needs real layout, unreliable in jsdom).*

- [ ] **Step 1: Implement Magazine**

Create `src/components/Magazine.tsx`:

```tsx
import { useMemo, useRef } from 'react'
// @ts-expect-error — react-pageflip ships no bundled types
import HTMLFlipBook from 'react-pageflip'
import { useResponsiveMode } from '../hooks/useResponsiveMode'
import { content } from '../content/content'
import { CoverPage } from '../pages/CoverPage'
import { ContentsPage } from '../pages/ContentsPage'
import { AboutPage } from '../pages/AboutPage'
import { ExperiencePage } from '../pages/ExperiencePage'
import { ProjectPage } from '../pages/ProjectPage'
import { SkillsPage } from '../pages/SkillsPage'
import { EducationPage } from '../pages/EducationPage'
import { ContactPage } from '../pages/ContactPage'
import { BackCoverPage } from '../pages/BackCoverPage'

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function Magazine() {
  const mode = useResponsiveMode()
  const book = useRef<any>(null)
  const jump = (page: number) => book.current?.pageFlip()?.flip(page)

  // Stable page list; each direct child MUST forward a ref (react-pageflip clones them).
  const pages = useMemo(
    () => [
      <CoverPage key="cover" />,
      <ContentsPage key="contents" onJump={jump} />,
      <AboutPage key="about" />,
      <ExperiencePage key="exp0" item={content.experience.items[0]} side="left" folio="Work · 04" />,
      <ExperiencePage key="exp1" item={content.experience.items[1]} side="right" folio="Work · 05" />,
      <ProjectPage key="p0" project={content.projects.items[0]} side="left" folio="Project · 06" />,
      <ProjectPage key="p1" project={content.projects.items[1]} side="right" folio="Project · 07" />,
      <ProjectPage key="p2" project={content.projects.items[2]} side="left" folio="Project · 08" />,
      <ProjectPage key="p3" project={content.projects.items[3]} side="right" folio="Project · 09" />,
      <SkillsPage key="skills" />,
      <EducationPage key="edu" />,
      <ContactPage key="contact" />,
      <BackCoverPage key="back" />,
    ],
    [],
  )

  return (
    <div className="stage">
      <HTMLFlipBook
        ref={book}
        width={460}
        height={620}
        size="stretch"
        minWidth={300}
        maxWidth={560}
        minHeight={420}
        maxHeight={760}
        showCover
        usePortrait={mode === 'single'}
        mobileScrollSupport
        drawShadow={!prefersReduced}
        flippingTime={prefersReduced ? 0 : 700}
        className="magazine"
      >
        {pages}
      </HTMLFlipBook>
    </div>
  )
}
```

- [ ] **Step 2: Temporarily mount Magazine** — replace `src/App.tsx`:

```tsx
import { ThemeProvider } from './theme/ThemeProvider'
import { Magazine } from './components/Magazine'

export default function App() {
  return (
    <ThemeProvider>
      <Magazine />
    </ThemeProvider>
  )
}
```

- [ ] **Step 3: Verify by running**

```bash
npm run dev
```
Open the printed localhost URL. Expected: cover shows alone; dragging a page corner flips; arrow-less flip works; on a narrow window it shows one page. Existing tests still green:

```bash
npm test
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Magazine.tsx src/App.tsx
git commit -m "feat: magazine flip engine + 13-page order + jump nav"
```

---

### Task 12: Toolbar + ThemeSwitcher

**Files:**
- Create: `src/components/Toolbar.tsx`, `src/components/ThemeSwitcher.tsx`
- Test: `src/components/ThemeSwitcher.test.tsx`

**Interfaces:**
- Consumes: `useTheme` (Task 4), `THEME_LIST` (Task 3).
- Produces:
  - `ThemeSwitcher` (no props) — renders a button per theme; clicking calls `setTheme`.
  - `Toolbar` — `{ page: number; total: number; onPrev: () => void; onNext: () => void }`.

- [ ] **Step 1: Write the failing test**

Create `src/components/ThemeSwitcher.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../theme/ThemeProvider'
import { ThemeSwitcher } from './ThemeSwitcher'

describe('ThemeSwitcher', () => {
  it('sets data-theme on html when a theme is clicked', () => {
    render(<ThemeProvider><ThemeSwitcher /></ThemeProvider>)
    fireEvent.click(screen.getByRole('button', { name: /Nocturne/i }))
    expect(document.documentElement.getAttribute('data-theme')).toBe('nocturne')
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test src/components/ThemeSwitcher.test.tsx
```

- [ ] **Step 3: Implement ThemeSwitcher**

Create `src/components/ThemeSwitcher.tsx`:

```tsx
import { useTheme } from '../theme/ThemeProvider'
import { THEME_LIST } from '../theme/themes'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  return (
    <div className="theme-switcher" role="group" aria-label="Theme">
      {THEME_LIST.map((t) => (
        <button
          key={t.id}
          className={`theme-dot ${theme === t.id ? 'active' : ''}`}
          data-theme-dot={t.id}
          aria-label={t.label}
          aria-pressed={theme === t.id}
          title={t.label}
          onClick={() => setTheme(t.id)}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Implement Toolbar**

Create `src/components/Toolbar.tsx`:

```tsx
interface Props { page: number; total: number; onPrev: () => void; onNext: () => void }

export function Toolbar({ page, total, onPrev, onNext }: Props) {
  const pct = total > 1 ? (page / (total - 1)) * 100 : 0
  return (
    <div className="toolbar">
      <button className="nav-btn" aria-label="Previous page" onClick={onPrev}>‹</button>
      <div className="counter label">{String(page + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</div>
      <div className="progress"><span style={{ width: `${pct}%` }} /></div>
      <button className="nav-btn" aria-label="Next page" onClick={onNext}>›</button>
    </div>
  )
}
```

- [ ] **Step 5: Add chrome CSS** — append to `src/styles/global.css`:

```css
.theme-switcher{position:fixed;top:18px;right:18px;z-index:20;display:flex;gap:8px;
  background:rgba(255,255,255,.7);backdrop-filter:blur(8px);padding:8px 10px;border-radius:999px;box-shadow:0 4px 18px rgba(0,0,0,.15)}
.theme-dot{width:20px;height:20px;border-radius:50%;border:2px solid #fff;outline:1px solid rgba(0,0,0,.15);padding:0}
.theme-dot.active{transform:scale(1.15);outline:2px solid #333}
.theme-dot[data-theme-dot='gallery-gold']{background:#A16207}
.theme-dot[data-theme-dot='mono-blue']{background:#2563EB}
.theme-dot[data-theme-dot='editorial-ink']{background:#EC4899}
.theme-dot[data-theme-dot='nocturne']{background:#0B0B0D}
.theme-dot[data-theme-dot='terracotta']{background:#B4532A}
.theme-dot[data-theme-dot='bauhaus']{background:#2555E0}

.toolbar{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);z-index:20;display:flex;
  align-items:center;gap:14px;background:rgba(255,255,255,.75);backdrop-filter:blur(8px);
  padding:8px 14px;border-radius:999px;box-shadow:0 4px 18px rgba(0,0,0,.15)}
.nav-btn{width:34px;height:34px;border-radius:50%;border:none;background:#111;color:#fff;font-size:18px;line-height:1}
.counter{font-size:11px;letter-spacing:.1em;color:#333}
.progress{width:120px;height:3px;background:rgba(0,0,0,.15);border-radius:2px;overflow:hidden}
.progress span{display:block;height:100%;background:#111;transition:width .3s}
@media (max-width:1024px){.progress{width:70px}}
```

- [ ] **Step 6: Run test — expect PASS**

```bash
npm test src/components/ThemeSwitcher.test.tsx
```

- [ ] **Step 7: Commit**

```bash
git add src/components/Toolbar.tsx src/components/ThemeSwitcher.tsx src/components/ThemeSwitcher.test.tsx src/styles/global.css
git commit -m "feat: theme switcher + toolbar chrome"
```

---

### Task 13: Wire chrome into Magazine + keyboard nav + state

**Files:**
- Modify: `src/components/Magazine.tsx`
- Test: none (verified by running)

**Interfaces:**
- Consumes: `Toolbar`, `ThemeSwitcher`, `onFlip` event from HTMLFlipBook.
- Produces: Magazine now tracks `page`/`total`, wires prev/next, keyboard `←`/`→`, and renders `ThemeSwitcher` + `Toolbar`.

- [ ] **Step 1: Update Magazine** — replace `src/components/Magazine.tsx` body to add state, handlers, keyboard, and chrome. Full file:

```tsx
import { useEffect, useMemo, useRef, useState } from 'react'
// @ts-expect-error — react-pageflip ships no bundled types
import HTMLFlipBook from 'react-pageflip'
import { useResponsiveMode } from '../hooks/useResponsiveMode'
import { content } from '../content/content'
import { CoverPage } from '../pages/CoverPage'
import { ContentsPage } from '../pages/ContentsPage'
import { AboutPage } from '../pages/AboutPage'
import { ExperiencePage } from '../pages/ExperiencePage'
import { ProjectPage } from '../pages/ProjectPage'
import { SkillsPage } from '../pages/SkillsPage'
import { EducationPage } from '../pages/EducationPage'
import { ContactPage } from '../pages/ContactPage'
import { BackCoverPage } from '../pages/BackCoverPage'
import { Toolbar } from './Toolbar'
import { ThemeSwitcher } from './ThemeSwitcher'

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function Magazine() {
  const mode = useResponsiveMode()
  const book = useRef<any>(null)
  const [page, setPage] = useState(0)
  const flipTo = (p: number) => book.current?.pageFlip()?.flip(p)
  const next = () => book.current?.pageFlip()?.flipNext()
  const prev = () => book.current?.pageFlip()?.flipPrev()

  const pages = useMemo(
    () => [
      <CoverPage key="cover" />,
      <ContentsPage key="contents" onJump={flipTo} />,
      <AboutPage key="about" />,
      <ExperiencePage key="exp0" item={content.experience.items[0]} side="left" folio="Work · 04" />,
      <ExperiencePage key="exp1" item={content.experience.items[1]} side="right" folio="Work · 05" />,
      <ProjectPage key="p0" project={content.projects.items[0]} side="left" folio="Project · 06" />,
      <ProjectPage key="p1" project={content.projects.items[1]} side="right" folio="Project · 07" />,
      <ProjectPage key="p2" project={content.projects.items[2]} side="left" folio="Project · 08" />,
      <ProjectPage key="p3" project={content.projects.items[3]} side="right" folio="Project · 09" />,
      <SkillsPage key="skills" />,
      <EducationPage key="edu" />,
      <ContactPage key="contact" />,
      <BackCoverPage key="back" />,
    ],
    [],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <ThemeSwitcher />
      <div className="stage">
        <HTMLFlipBook
          ref={book}
          width={460}
          height={620}
          size="stretch"
          minWidth={300}
          maxWidth={560}
          minHeight={420}
          maxHeight={760}
          showCover
          usePortrait={mode === 'single'}
          mobileScrollSupport
          drawShadow={!prefersReduced}
          flippingTime={prefersReduced ? 0 : 700}
          className="magazine"
          onFlip={(e: { data: number }) => setPage(e.data)}
        >
          {pages}
        </HTMLFlipBook>
      </div>
      <Toolbar page={page} total={pages.length} onPrev={prev} onNext={next} />
    </>
  )
}
```

- [ ] **Step 2: Verify by running**

```bash
npm run dev
```
Expected: theme dots switch skins live and survive reload (localStorage); toolbar counter updates on flip; ← / → flip; Contents links jump. Reload after picking Nocturne → still Nocturne. Fresh browser/profile → Gallery Gold.

- [ ] **Step 3: Verify reduced motion** — in devtools, emulate `prefers-reduced-motion: reduce`, reload; flips are instant.

- [ ] **Step 4: Commit**

```bash
git add src/components/Magazine.tsx
git commit -m "feat: wire chrome, keyboard nav, page state into magazine"
```

---

### Task 14: Meta/OG tags, Vercel config, build + deploy readiness

**Files:**
- Modify: `index.html`
- Create: `vercel.json`, `README.md`

**Interfaces:**
- Consumes: `content.meta` values (hardcoded into `index.html` head — static, matches JSON).
- Produces: deployable build.

- [ ] **Step 1: Write index.html head** — replace `index.html` `<head>` contents (keep the `<body><div id="root">` + module script Vite generated):

```html
<meta charset="UTF-8" />
<link rel="icon" type="image/jpeg" href="/avatar.jpg" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Truong Trung Nghia — Full Stack Developer</title>
<meta name="description" content="Portfolio of Truong Trung Nghia, a Full Stack Developer with 2+ years of experience building enterprise-grade web applications in PHP, Laravel, CodeIgniter, and React." />
<meta property="og:type" content="website" />
<meta property="og:title" content="Truong Trung Nghia — Full Stack Developer" />
<meta property="og:description" content="Full Stack Developer with 2+ years of experience across Fintech, E-commerce, IoT, SaaS, Booking, and ERP domains." />
<meta property="og:url" content="https://ttndev.com" />
<meta property="og:image" content="/avatar.jpg" />
<meta name="twitter:card" content="summary" />
```

- [ ] **Step 2: Write vercel.json**

Create `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

- [ ] **Step 3: Write README**

Create `README.md`:

```markdown
# Portfolio Flip — Truong Trung Nghia

Magazine-style flipbook portfolio. React + Vite + TypeScript, `react-pageflip`, 6 switchable themes (default Gallery Gold). Content lives in `content.json`.

## Develop
\`\`\`bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"   # if using nvm
npm install
npm run dev
\`\`\`

## Test
\`\`\`bash
npm test
\`\`\`

## Edit content
All copy is in `content.json`. Change it and the site updates. Avatar: replace `public/avatar.jpg`.

## Deploy (Vercel, free)
Push to a Git repo, import into Vercel. Framework preset: Vite. Build: `npm run build`, output: `dist`. `vercel.json` handles SPA routing.
```

- [ ] **Step 4: Full test + build**

```bash
npm test
npm run build
```
Expected: all tests pass; `dist/` builds clean.

- [ ] **Step 5: Preview the production build**

```bash
npm run preview
```
Open the printed URL. Expected: identical to dev — flips, themes, persistence all work.

- [ ] **Step 6: Commit**

```bash
git add index.html vercel.json README.md
git commit -m "chore: meta/OG tags, vercel spa config, readme"
```

---

## Self-Review

**Spec coverage:**
- Stack (React+Vite+TS, react-pageflip, plain CSS vars, Vercel) → Tasks 1, 5, 11, 14 ✓
- Content from content.json, drop nav, fix avatar → Task 2 ✓
- 6 themes, Gallery Gold default, tokens → Tasks 3, 5 ✓
- localStorage persistence, default on first load → Task 4 ✓
- 13-page magazine structure, per-page layouts → Tasks 8–11 ✓
- Two-page desktop / single-page mobile → Tasks 6, 11 ✓
- Navigation (drag, arrows, keyboard, contents jump, counter, progress) → Tasks 11, 12, 13 ✓
- Reduced motion → Tasks 5, 11, 13 ✓
- SEO/meta/OG → Task 14 ✓
- No fake screenshots (typographic projects) → Task 9 ✓
- Deploy config → Task 14 ✓

**Placeholder scan:** No TBD/TODO; every code step shows real code. ✓

**Type consistency:** `ThemeId`, `THEME_LIST`, `DEFAULT_THEME`, `isThemeId` consistent across Tasks 3–4, 12. `content` shape from Task 2 used unchanged in all pages. `Page` forwardRef signature consistent Tasks 7–10. `flipTo`/`next`/`prev` naming consistent within Magazine (Tasks 11, 13). ✓

**Note on react-pageflip types:** package ships no types; `@ts-expect-error` used at import and `any` for the ref — acceptable and isolated to `Magazine.tsx`.
