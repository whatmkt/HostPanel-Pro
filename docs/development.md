# Development Guide

## Prerequisites

- Node.js 20+
- npm 10+
- Docker & Docker Compose
- Git

## Getting Started

```bash
git clone <repo-url>
cd hostpanel-pro
cp .env.example .env
npm install
docker compose up -d postgres redis
npm run db:migrate
npm run db:seed
npm run dev
```

## Project Structure

```
apps/
├── web/          # Next.js 14 frontend (port 3000)
├── api/          # NestJS backend (port 3001)
├── worker/       # BullMQ job worker
├── mock-agent/   # Mock server agent (port 4000)
└── agent/        # Real agent (future)
packages/
├── types/        # Shared TypeScript interfaces
├── config/       # Shared configuration
├── ui/           # Shared UI components
├── sdk/          # API client SDK
└── validation/   # Zod schemas
```

## Commands

```bash
npm run dev           # Start all in dev mode
npm run build         # Build all packages
npm run lint          # Run linter
npm run typecheck     # TypeScript check
npm run test          # Run tests
npm run format        # Format code
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Run migrations
npm run db:seed       # Seed database
npm run db:studio     # Open Prisma Studio
npm run docker:dev    # Start Docker services
```

## Environment Variables

See `.env.example` for all variables. Key ones:

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT signing secret
- `AGENT_TOKEN` - Token for agent communication

## Database

```bash
# Create migration
cd apps/api && npx prisma migrate dev --name description

# Reset database
cd apps/api && npx prisma migrate reset

# Open visual editor
npm run db:studio
```

## API Development

The API uses NestJS modules. To add a new module:

```bash
cd apps/api
npx nest generate module modules/my-module
npx nest generate controller modules/my-module
npx nest generate service modules/my-module
```

## Frontend Development

Pages are under `apps/web/src/app/(authenticated)/`. Each module has its own directory with `page.tsx`.

Shared components go in `packages/ui/`.

## Testing

```bash
npm run test
npm run test:e2e
```

## Code Style

- TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- Feature branches