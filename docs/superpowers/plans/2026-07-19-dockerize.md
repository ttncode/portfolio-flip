# Dockerize portfolio-flip Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add optional Docker support — a dev container with Vite HMR and a production nginx image serving the static build — without touching app code or the Vercel deploy.

**Architecture:** One multi-stage `Dockerfile` with `dev` / `build` / `prod` targets. A `docker-compose.yml` selects dev or prod via profiles. nginx serves the built `dist` with SPA fallback and correct MIME types. Purely additive; all new files at repo root.

**Tech Stack:** Docker, Docker Compose, multi-stage builds, `node:22-alpine`, `nginx:1.27-alpine`, Vite.

## Global Constraints

- Node base image: `node:22-alpine` (matches project's supported runtime).
- nginx base image: `nginx:1.27-alpine`.
- Do NOT modify application code, `package.json`, `vite.config.ts`, `tsconfig*.json`, or `vercel.json`.
- Prod build stage MUST run the existing `npm run build` (`tsc -b && vite build`) so type errors fail the image build.
- Dev server port `5173`; prod host port `8080` → container `80`.
- SPA fallback in nginx must mirror `vercel.json`: unknown routes serve `index.html`; `/assets/*` served with correct MIME (nginx default).
- All new files at repo root: `Dockerfile`, `docker-compose.yml`, `nginx.conf`, `.dockerignore`.
- These verification steps require a working Docker daemon. If Docker is unavailable in the execution environment, report BLOCKED with the exact commands the user must run — do not fake results.

---

### Task 1: Production image (Dockerfile + nginx.conf + .dockerignore)

Delivers a self-contained production image that serves the built site via nginx.

**Files:**
- Create: `/home/ttndev/workspace/personal/portfolio-flip/.dockerignore`
- Create: `/home/ttndev/workspace/personal/portfolio-flip/nginx.conf`
- Create: `/home/ttndev/workspace/personal/portfolio-flip/Dockerfile`

**Interfaces:**
- Consumes: existing `npm run build` script → emits `/app/dist`.
- Produces: Dockerfile stages named `dev`, `build`, `prod` (consumed by Task 2's compose targets); prod image serves on container port `80`.

- [ ] **Step 1: Create `.dockerignore`**

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

- [ ] **Step 2: Create `nginx.conf`**

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

- [ ] **Step 3: Create `Dockerfile` (all three stages)**

```dockerfile
# --- dev: Vite dev server with HMR ---
FROM node:22-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# --- build: produce static dist ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- prod: nginx serving dist ---
FROM nginx:1.27-alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

- [ ] **Step 4: Build the prod image (verifies build stage + type check + nginx assembly)**

Run:
```bash
docker build --target prod -t portfolio-flip:prod .
```
Expected: build completes; the `npm run build` line shows `tsc -b && vite build` and emits `dist/`; final image tagged `portfolio-flip:prod`. A TypeScript error here MUST fail the build (that is the intended guard).

- [ ] **Step 5: Run the container and verify it serves correctly**

Run:
```bash
docker run -d --name pf-prod -p 8080:80 portfolio-flip:prod
sleep 2
curl -sI http://localhost:8080/ | head -n1
curl -s http://localhost:8080/ | grep -o '<div id="root"></div>'
```
Expected: `HTTP/1.1 200 OK`; the `<div id="root"></div>` line prints.

Verify the JS module MIME (the bug class this fixes):
```bash
asset=$(curl -s http://localhost:8080/ | grep -o '/assets/[^"]*\.js' | head -n1)
curl -sI "http://localhost:8080$asset" | grep -i content-type
```
Expected: `Content-Type: text/javascript` (or `application/javascript`) — NOT `application/octet-stream`.

Verify SPA fallback:
```bash
curl -sI http://localhost:8080/some/deep/route | head -n1
```
Expected: `HTTP/1.1 200 OK` (served `index.html`, not 404).

Cleanup:
```bash
docker rm -f pf-prod
```

- [ ] **Step 6: Commit**

```bash
git add Dockerfile nginx.conf .dockerignore
git commit -m "feat(docker): production nginx image serving static build"
```

---

### Task 2: Compose orchestration (dev HMR + prod profiles)

Delivers `docker-compose.yml` wiring both environments via profiles, and verifies dev hot reload.

**Files:**
- Create: `/home/ttndev/workspace/personal/portfolio-flip/docker-compose.yml`

**Interfaces:**
- Consumes: Dockerfile stages `dev` and `prod` from Task 1.
- Produces: compose services `dev` (profile `dev`, port 5173) and `web` (profile `prod`, port 8080).

- [ ] **Step 1: Create `docker-compose.yml`**

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
      - /app/node_modules
    command: npm run dev -- --host 0.0.0.0

  web:
    profiles: ["prod"]
    build:
      context: .
      target: prod
    ports:
      - "8080:80"
```

- [ ] **Step 2: Verify config parses**

Run:
```bash
docker compose --profile dev config >/dev/null && echo OK
docker compose --profile prod config >/dev/null && echo OK
```
Expected: `OK` twice; no YAML/schema errors.

- [ ] **Step 3: Verify prod service serves**

Run:
```bash
docker compose --profile prod up -d --build
sleep 3
curl -sI http://localhost:8080/ | head -n1
docker compose --profile prod down
```
Expected: `HTTP/1.1 200 OK`.

- [ ] **Step 4: Verify dev server + HMR**

Run:
```bash
docker compose --profile dev up -d --build
sleep 6
curl -sI http://localhost:5173/ | head -n1
```
Expected: `HTTP/1.1 200 OK` (Vite dev server responding).

Confirm hot reload picks up host edits (bind mount working): touch a source file and check Vite logs report an update.
```bash
touch src/App.tsx
sleep 2
docker compose --profile dev logs --tail=20 dev | grep -i -E 'hmr|update|reload' || echo "check logs manually"
```
Expected: Vite log shows an HMR update line for `src/App.tsx` (confirms bind mount + HMR). Restore the file if `touch` changed mtime only (no content change, nothing to restore).

Cleanup:
```bash
docker compose --profile dev down
```

- [ ] **Step 5: Commit**

```bash
git add docker-compose.yml
git commit -m "feat(docker): compose profiles for dev HMR and prod"
```

---

## Notes for the implementer

- If `curl` to localhost is blocked in the execution sandbox, verify via `docker exec pf-prod wget -qO- http://localhost/` from inside the container, or report the commands for the user to run — never fabricate output.
- Do not add a `.env`, healthchecks, registry push, or CI wiring — out of scope per the spec.
