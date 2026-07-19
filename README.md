<div align="center">
  <h1>📖 portfolio-flip</h1>
  <p>
    <strong>Magazine-style flipbook portfolio for Truong Trung Nghia, Full Stack Developer.</strong><br>
    A resume in — a page-turning, theme-switchable magazine out.
  </p>

  [![Vercel](https://img.shields.io/badge/deploy-Vercel-black)](https://vercel.com)
  [![React](https://img.shields.io/badge/React-19-61dafb)](#)
  [![Vite](https://img.shields.io/badge/Vite-8-646cff)](#)
  [![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)](#)

  <sub>Built and maintained by <strong>Truong Trung Nghia</strong>.</sub>
</div>

---

## Why it exists

**📖 Magazine flip**
- Real page-turn animation via `react-pageflip`.
- Two-page spread on desktop, single-page swipe on mobile.
- Keyboard `←` / `→`, on-screen prev/next, progress bar.

**🎨 Six switchable themes**
- Gallery Gold (default), Mono Blue, Editorial Ink, Nocturne, Terracotta Warm, Bauhaus Blocks.
- Driven by CSS custom properties on `data-theme`; swap animates smoothly.
- Choice persists across visits via `localStorage` (`portfolio-theme`).

**📄 Content-driven**
- Cover, Contents, About, Experience, Projects, Skills, Education, Contact — all real content.
- Single source of truth: edit `content.json`, the site updates.

## Structure

```
portfolio-flip/
├── content.json            # Single source of truth for all copy
├── public/
│   └── avatar.jpg          # Profile image + favicon
├── src/
│   ├── components/
│   │   └── Magazine.tsx     # HTMLFlipBook, page order, nav, keyboard
│   ├── pages/               # One forwardRef component per magazine page
│   ├── theme/               # Theme registry, storage, ThemeProvider
│   ├── content/content.ts   # Typed access to content.json
│   └── styles/              # global.css + themes.css (token blocks)
├── index.html              # Meta/OG tags, entry point
└── vercel.json             # SPA routing (asset-safe rewrite)
```

## Pages

| Page | Content |
| ---- | ------- |
| Cover | Name, title, avatar |
| Contents | Table of contents, jump links |
| About | Summary, highlights |
| Experience | Work history |
| Projects | Featured work |
| Skills | Tech stack |
| Education | Academic background |
| Contact | Email, phone, LinkedIn, GitHub |

## Run locally

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"   # if using nvm
npm install
npm run dev
```

Test: `npm test`  ·  Build: `npm run build` (output: `dist`)

## Edit content

All copy lives in `content.json` — change it and the site updates. Replace the avatar at `public/avatar.jpg`.

## Deploy

- Push to a Git repo, import into Vercel. Framework preset: **Vite**.
- Build: `npm run build`, output: `dist`.
- `vercel.json` handles SPA routing with an asset-safe rewrite (excludes `/assets/` and real files so JS/CSS keep correct MIME).
