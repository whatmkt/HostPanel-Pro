# HostPanel Pro Architecture

## Overview

HostPanel Pro is a modular hosting control panel with a clear separation between:

1. **Frontend (Web)** - Next.js application for the user interface
2. **Backend API** - NestJS REST API for business logic
3. **Worker** - Background job processor using BullMQ
4. **Agent** - Server-side agent with controlled privileges

## System Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│  Next.js    │────▶│  NestJS API │
│  (Frontend) │◀────│  (Web App)  │◀────│  (Backend)  │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                │
                              ┌─────────────────┼─────────────────┐
                              │                 │                 │
                         ┌────▼────┐     ┌─────▼─────┐    ┌─────▼─────┐
                         │PostgreSQL│     │   Redis   │    │  Worker   │
                         │(Primary) │     │(Cache/Q)  │    │ (BullMQ)  │
                         └─────────┘     └───────────┘    └─────┬─────┘
                                                                │
┌─────────────┐                                          ┌─────▼─────┐
│  Server     │◀─────────────────────────────────────────│  Agent    │
│  (Linux)    │─────────────────────────────────────────▶│ (Root)    │
└─────────────┘                                          └───────────┘
```

## Component Details

### Frontend (apps/web)

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand stores
- **Auth:** JWT stored in HttpOnly cookies
- **API:** Fetch-based client with interceptors

### Backend API (apps/api)

- **Framework:** NestJS
- **ORM:** Prisma
- **Auth:** JWT with refresh tokens
- **Docs:** Swagger/OpenAPI
- **Validation:** Zod + class-validator
- **Queue:** BullMQ (job enqueueing)

### Worker (apps/worker)

- **Process:** Independent Node.js process
- **Queue System:** BullMQ with Redis backend
- **Queues:**
  - `system` - Health checks, metric collection
  - `domain` - Domain operations
  - `ssl` - Certificate issuance
  - `backup` - Backup jobs
  - `security` - Malware scans
  - `mail` - Email operations
  - `notification` - Alert delivery
  - `audit` - Audit log recording
  - `deployment` - Git deployments
  - `cleanup` - Maintenance tasks

### Agent (apps/mock-agent, apps/agent)

- **Mock:** Express server for development
- **Real:** Planned as Go or Node.js service
- **Auth:** Token-based authentication
- **Scope:** Runs with controlled sudo privileges
- **Safety:**
  - Never executes arbitrary commands
  - Validates all inputs
  - Configuration rollback on failure
  - Full audit trail

## Database Schema

PostgreSQL with Prisma ORM. See `apps/api/prisma/schema.prisma` for full schema.

Key entities:
- Users, Roles, Permissions (RBAC)
- Clients, Hosting Plans, Subscriptions
- Domains, Subdomains, Aliases
- Websites (with PHP/nginx settings)
- SSL Certificates
- DNS Zones & Records
- Mail Domains, Mailboxes
- Databases & Users
- FTP/SFTP Accounts
- Backups & Snapshots
- Firewall Rules
- Fail2Ban Jails
- Malware Scans & Findings
- Performance Profiles
- System Metrics
- Audit Logs
- Notifications
- Extensions

## Security Architecture

```
┌──────────────────────────────────────────────────┐
│                   Security Layers                 │
├──────────────────────────────────────────────────┤
│ 1. Network: Firewall + Fail2Ban + Rate Limiting  │
│ 2. Transport: HTTPS + HSTS + TLS 1.2+           │
│ 3. Application: JWT + CSRF + Input Validation    │
│ 4. Authentication: 2FA + Password Policy         │
│ 5. Authorization: RBAC + Permission Checks       │
│ 6. Data: Encryption + No Plaintext Secrets       │
│ 7. Audit: Full Activity Logging                   │
│ 8. Agent: Controlled Sudo + No Arbitrary Cmds    │
└──────────────────────────────────────────────────┘
```

## Deployment Modes

### Development (Docker Compose)
All services containerized with hot-reload.

### Production Single Server
Panel + Agent on same server with systemd.

### Production Multi-Server (Planned)
Separate web/API servers + agent on each managed server.

## Technology Decisions

| Decision | Rationale |
|---|---|
| PostgreSQL over MySQL | Better JSON support, extensions, and reliability |
| Prisma over raw SQL | Type safety, migrations, multi-DB support |
| NestJS over Express raw | Module system, DI, guards, interceptors |
| JWT over sessions | Stateless, scalable for multi-server |
| BullMQ over other queues | Redis-backed, reliable, active maintenance |
| Agent separate from API | Security isolation, principle of least privilege |
| TypeScript everywhere | Type safety across the full stack |