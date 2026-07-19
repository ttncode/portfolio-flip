# Dockerize portfolio-flip — Design Spec

Date: 2026-07-19

## Goal

Add optional Docker support for the portfolio-flip static SPA. Vercel remains
the primary deploy target; Docker is an additive, portable self-host option.

Two environments:

- **Development** — Vite dev server with hot module reload (HMR).
- **Production** — nginx serving the static build.

Purely additive: no changes to application code, `package.json`, `vite.config.ts`,
or the Vercel deployment. Existing `vercel.json` stays as-is.

## Architecture

A single multi-stage `Dockerfile` with three targets.

| Stage   | Base                | Purpose                                            |
|---------|---------------------|----------------------------------------------------|
| `dev`   | `node:22-alpine`    | `npm install`, runs `vite --host` (HMR), port 5173 |
| `build` | `node:22-alpine`    | `npm ci`, `npm run build` → `/app/dist`            |
| `prod`  | `nginx:1.27-alpine` | copies `dist` from `build`, serves on port 80      |

Node 22 matches the project's supported runtime. `build` runs `tsc -b && vite build`
(the existing `build` script) so type errors fail the image build.

## Files added

All new files at repo root. No existing file is modified.

- `Dockerfile` — multi-stage, targets `dev` / `build` / `prod`.
- `docker-compose.yml` — two services selected by profile.
- `nginx.conf` — SPA config for the `prod` stage.
- `.dockerignore` — trims build context.

## Dockerfile (target behavior)

```dockerfile
# --- dev ---
FROM node:22-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# --- build ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- prod ---
FROM nginx:1.27-alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Notes:
- `dev` uses `npm install` (not `ci`) so a bind-mounted lockfile stays flexible
  during local work; `build` uses `npm ci` for reproducible production builds.
- `--host 0.0.0.0` makes the dev server reachable from outside the container.

## docker-compose.yml (target behavior)

Two services, each gated by a profile so only the requested one runs.

```yaml
services:
  dev:
    profiles: ["dev"]
    build:
      context: .
      target: dev
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules   # anonymous volume: keep container's deps
    command: npm run dev -- --host 0.0.0.0

  web:
    profiles: ["prod"]
    build:
      context: .
      target: prod
    ports:
      - "8080:80"
```

The anonymous `/app/node_modules` volume prevents the host bind mount from
shadowing dependencies installed inside the image.

Run:
- Dev with HMR: `docker compose --profile dev up`
- Prod: `docker compose --profile prod up --build`

## nginx.conf (target behavior)

Mirrors the current `vercel.json` SPA rewrite. nginx serves each asset with its
correct MIME type by default, so module scripts load correctly.

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;

    # Long-cache fingerprinted assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback: unknown routes serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## .dockerignore (contents)

```
node_modules
dist
.git
.github
docs
.claude
.superpowers
*.log
.DS_Store
```

Keeps the build context small and stops local `node_modules` / `dist` from
entering the image.

## Success criteria

1. `docker compose --profile prod up --build` serves the site at
   `http://localhost:8080`; the page renders (not blank), and JS/CSS load with
   correct MIME (no `application/octet-stream` module error).
2. `docker compose --profile dev up` serves the dev server at
   `http://localhost:5173`; editing a source file on the host triggers HMR in
   the browser without a manual rebuild.
3. `npm run build` type errors cause the `build` stage (and thus the `prod`
   image build) to fail.
4. No changes to application code, `package.json`, or Vercel deployment.

## Out of scope

- CI/CD pipeline changes.
- Publishing images to a registry.
- Running the test suite inside a container (dev container can run `npm test`
  ad hoc, but no dedicated service).
- Changing the Vercel deploy or `vercel.json`.
