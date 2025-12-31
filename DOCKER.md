# Docker Setup Guide

This project uses Docker with **Neon Local** for development and **Neon Cloud** for production.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Neon Account](https://console.neon.tech) with API Key

## Environment Variables

| Variable           | Dev | Prod | Description                            |
| ------------------ | --- | ---- | -------------------------------------- |
| `DATABASE_URL`     | ✅  | ✅   | PostgreSQL connection string           |
| `NEON_LOCAL_HOST`  | ✅  | ❌   | Service name of Neon Local container   |
| `NEON_API_KEY`     | ✅  | ❌   | Neon API key for Local proxy           |
| `NEON_PROJECT_ID`  | ✅  | ❌   | Neon project ID                        |
| `PARENT_BRANCH_ID` | ✅  | ❌   | Branch to create ephemeral copies from |

---

## Development Setup

Development uses **Neon Local** which creates ephemeral database branches automatically.

### 1. Create environment file

```bash
cp .env.development .env.development.local
```

Edit `.env.development.local` with your Neon credentials:

- Get `NEON_API_KEY` from: https://console.neon.tech/app/settings/api-keys
- Get `NEON_PROJECT_ID` from your project dashboard URL
- Get `PARENT_BRANCH_ID` from: Project → Branches → Copy branch ID

### 2. Start development environment

```bash
docker compose -f docker-compose.dev.yml --env-file .env.development.local up --build
```

This will:

1. Start Neon Local proxy on port 5432
2. Create an ephemeral branch from your parent branch
3. Start the app with hot-reload on port 3000

### 3. Stop and cleanup

```bash
docker compose -f docker-compose.dev.yml down
```

> **Note**: The ephemeral branch is automatically deleted when the container stops.

---

## Production Setup

Production connects directly to **Neon Cloud** (no Neon Local proxy).

### 1. Create environment file

```bash
cp .env.production .env.production.local
```

Edit `.env.production.local`:

- Set `DATABASE_URL` to your Neon Cloud connection string
- Set `JWT_SECRET` to a secure random string
- Set `ARCJET_KEY` to your Arcjet key

### 2. Build and run

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production.local up --build -d
```

### 3. View logs

```bash
docker compose -f docker-compose.prod.yml logs -f
```

---

## How It Works

### Development (Neon Local)

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Your App  │────▶│  Neon Local  │────▶│  Neon Cloud     │
│  (port 3000)│     │  (port 5432) │     │  (Ephemeral BR) │
└─────────────┘     └──────────────┘     └─────────────────┘
```

- App connects to `postgres://neon:npg@db:5432/neondb`
- Neon Local routes to ephemeral branch on Neon Cloud
- Branch is created on container start, deleted on stop

### Production

```
┌─────────────┐                          ┌─────────────────┐
│   Your App  │─────────────────────────▶│  Neon Cloud     │
│  (port 3000)│   (direct SSL connection)│  (Main Branch)  │
└─────────────┘                          └─────────────────┘
```

- App connects directly to Neon Cloud via `DATABASE_URL`
- No Neon Local proxy needed
- Uses production branch

---

## Troubleshooting

### Neon Local won't connect

1. Verify your `NEON_API_KEY` is valid
2. Check `NEON_PROJECT_ID` matches your project
3. Ensure `PARENT_BRANCH_ID` exists in your project

### Docker on Mac - Git integration issues

If using Docker Desktop for Mac, ensure VM settings use **gRPC FUSE** instead of VirtioFS.

### Database connection errors in development

Make sure `NEON_LOCAL_HOST` is set to `db` (the service name in docker-compose.dev.yml).
