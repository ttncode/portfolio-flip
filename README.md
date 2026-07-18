# Portfolio Flip — Truong Trung Nghia

Magazine-style flipbook portfolio. React + Vite + TypeScript, `react-pageflip`, 6 switchable themes (default Gallery Gold). Content lives in `content.json`.

## Develop
```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"   # if using nvm
npm install
npm run dev
```

## Test
```bash
npm test
```

## Edit content
All copy is in `content.json`. Change it and the site updates. Avatar: replace `public/avatar.jpg`.

## Deploy (Vercel, free)
Push to a Git repo, import into Vercel. Framework preset: Vite. Build: `npm run build`, output: `dist`. `vercel.json` handles SPA routing.
