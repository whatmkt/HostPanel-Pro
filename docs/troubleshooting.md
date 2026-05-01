# Troubleshooting Guide

## Docker Issues

### Containers won't start
```bash
docker compose down -v
docker compose up -d --build
```

### Port conflicts
```bash
# Check what's using ports
sudo lsof -i :3000
sudo lsof -i :3001
# Change ports in docker-compose.yml if needed
```

### Database connection refused
```bash
docker compose logs postgres
# Ensure postgres is healthy before starting api
docker compose up -d postgres
sleep 5
docker compose up -d api
```

### Prisma push fails
```bash
docker compose exec api npx prisma db push --force-reset
docker compose exec api npm run db:seed
```

## Frontend Issues

### Page not loading
- Check browser console for errors
- Verify API is running: `curl http://localhost:3001/health`
- Clear browser cache
- Check `apps/web/.env.local` has correct `NEXT_PUBLIC_API_URL`
- Verify you're not on the wrong port (web is 3000)

### Login redirect loop
- Clear cookies for localhost
- Check JWT_SECRET matches in API and .env
- Verify Prisma migrations are applied

### Stale data
- Hard refresh (Ctrl+Shift+R)
- Clear React Query cache in devtools
- Check API responses directly

## API Issues

### Authentication errors
```bash
# Verify JWT secret is set
docker compose exec api env | grep JWT_SECRET
# Test login endpoint
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hostpanel.local","password":"Admin123!"}'
```

### Database errors
```bash
# Check Prisma status
docker compose exec api npx prisma db push --force-reset
# View database
docker compose exec postgres psql -U hostpanel -d hostpanel
```

### Missing modules / 404 errors
- Check API logs: `docker compose logs api`
- Verify module is imported in `app.module.ts`
- Check route prefix matches

## Permission Issues

### Access denied on actions
- Check user role: GET /api/v1/auth/me
- Verify permission assignments in database
- Check PermissionsGuard logs
- Superadmin bypasses all permission checks

### Role assignment not working
- Check role ID exists
- Verify user-role relationship
- Clear session cache

## Worker Issues

### Jobs stuck in queue
```bash
docker compose logs worker
docker compose exec redis redis-cli KEYS "bull:*"
# Reset queue if needed:
docker compose exec redis redis-cli FLUSHDB
```

### Agent communication failure
```bash
# Check agent is running
curl http://localhost:4000/health
# Check agent token
docker compose exec mock-agent env | grep AGENT_TOKEN
# Restart agent
docker compose restart mock-agent
```

## Mock Agent Issues

### Mock agent not responding
```bash
curl http://localhost:4000/health
# Should return: {"status":"ok","service":"hostpanel-agent","version":"1.0.0-mock"} 
```

## Database Issues

### Migration conflicts
```bash
# Reset database completely
docker compose down -v
docker compose up -d postgres
sleep 5
docker compose up -d api
docker compose exec api npm run db:seed
```

### Prisma Studio won't open
```bash
# Run from host (not container)
cd apps/api
npx prisma studio
```

## Redis Issues

### Redis connection refused
```bash
docker compose logs redis
docker compose restart redis
```

### Queue processing stopped
```bash
docker compose logs worker
docker compose restart worker
```

## Seed Data Issues

### Required data missing
```bash
docker compose exec api npm run db:seed
```

### Duplicate seed data
```bash
# Seed script uses upsert, safe to run multiple times
docker compose exec api npm run db:seed
```

## Common Errors

### "Cannot find module '@hostpanel/types'"
```bash
# Rebuild all packages
npm run build --filter=@hostpanel/types
```

### "PrismaClientInitializationError"
- Check DATABASE_URL in .env
- Verify PostgreSQL is running
- Check database exists
- Verify credentials

### "ECONNREFUSED ::1:6379"
- Redis not running: `docker compose up -d redis`
- Wrong host: use `redis` not `localhost` in Docker

### "JWT expired"
- Token lifetime is 15 minutes
- Refresh using /auth/refresh endpoint
- Check system time synchronization

### "Permission denied: manage_users"
- User lacks the required permission
- Check role and permissions
- Superadmin bypasses all checks

## Performance

### Slow API responses
```bash
docker stats
# Check resource usage
# Consider increasing Docker resource limits
```

### Build taking too long
```bash
# Clear caches
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm install
```

## Reset Everything

```bash
docker compose down -v
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm install
docker compose up -d --build
docker compose exec api npm run db:seed
```

## Getting Help

1. Check logs: `docker compose logs`
2. Check service status: `docker compose ps`
3. Read architecture docs: `docs/architecture.md`
4. Check API docs: `http://localhost:3001/api/docs`