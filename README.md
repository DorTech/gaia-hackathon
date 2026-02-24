# GAIA Hackathon

Monorepo skeleton for the GAIA 2026 hackathon

![Screenshot](screenshot.png)

## Prerequisites

- Node.js 20+
- Docker & Docker Compose

## Quick Start

```bash
# Install all dependencies
yarn install

# Setup environment files
cp back/api/env/.env.example back/api/env/.env
cp front/web/.env.example front/web/.env

# Start PostgreSQL
yarn db:up

# Build all packages (shared types, API, frontend)
yarn build

# Init DB schema (creates tables)
yarn db:init

# Start API and Frontend
yarn api:dev
yarn web:dev
```

- **Frontend:** http://localhost:3000
- **API:** http://localhost:3001/api
- **Swagger:** http://localhost:3001/api/doc

## Project Structure

```
hackathon-gaia-bloomeo/
├── back/api/          # NestJS backend (port 3001)
├── front/web/         # React + Vite frontend (port 3000)
├── libs/shared-type/  # Shared TypeScript types
└── docker-compose.yml # PostgreSQL 17
```

## Scripts

| Command | Description |
|---------|-------------|
| `yarn api:dev` | Start NestJS backend |
| `yarn web:dev` | Start Vite frontend |
| `yarn build` | Build all packages (topological order) |
| `yarn db:up` | Start PostgreSQL container |
| `yarn db:down` | Stop PostgreSQL container |
| `yarn db:init` | Initialize database schema |

## Stack

- **Backend:** NestJS, raw pg (node-postgres), PostgreSQL 17
- **Frontend:** React, Vite, MUI, React Router, Jotai, Axios
- **Shared:** TypeScript types library
- **Monorepo:** Yarn 4 workspaces
