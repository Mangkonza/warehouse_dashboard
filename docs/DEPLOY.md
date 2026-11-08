# Deployment Guide

## 1. Environment Configuration
Copy example files and set real secrets (`openssl rand -base64 48`):
```bash
cp .env.frontend.example .env.frontend
cp .env.backend.example .env.backend
cp .env.db.example .env.db
```
`PUBLIC_ORIGIN` is strictly required in production (e.g. `https://warehouse.example.ku.ac.th`).
For local dev database only: `docker compose -f docker-compose.dev.yml up -d` (published on 127.0.0.1:5432).

## 2. Build and Run (Production)
```bash
docker compose build
docker compose up -d
docker compose ps
```

## 3. Changing BASE_PATH or BACKEND_URL
`BASE_PATH` and `BACKEND_URL` are baked into Next.js rewrites at build time. To change them:
```bash
docker compose build frontend
docker compose up -d frontend
```

## 4. Reverse Proxy Requirements (External)
The frontend binds to `127.0.0.1:3000`. The external reverse proxy must satisfy:
- **HTTPS Only**: Terminate SSL and redirect HTTP to HTTPS.
- **Headers**: Overwrite (do NOT append) `Host`, `X-Forwarded-Host`, `X-Forwarded-Proto` (`https`).
- **No Caching**: Disable caching for all `/api/auth/*` routes (`Cache-Control: no-store`).
- **Outbound HTTPS**: Frontend needs outbound port 443 access to:
  - `office.eng.kps.ku.ac.th` (Portal login, exchange, roles)
  - `eng.kps.ku.ac.th` (Portal profile and verification)
