# Fixing Prisma Migration Lock Timeout

## The Problem
Error: `Timed out trying to acquire a postgres advisory lock`

This happens when Prisma can't acquire a lock on the database, usually because:
1. Another migration process is running
2. A previous migration didn't complete cleanly
3. Stale lock in the database

## Solutions

### Solution 1: Wait and Retry
If another process is running, wait 30 seconds and try again:
```powershell
npm run prisma:migrate
```

### Solution 2: Check for Running Processes
Close any other terminals/processes that might be running Prisma migrations.

### Solution 3: Reset Migration State (If Database is Empty)
If you haven't run migrations yet and the database is empty:

```powershell
# Delete migrations folder
Remove-Item -Recurse -Force prisma\migrations

# Create fresh migration
npm run prisma:migrate dev --name init
```

### Solution 4: Manually Release Lock (Advanced)
If you have access to pgAdmin or psql:

```sql
-- Connect to your database
-- Run this query to see active locks:
SELECT * FROM pg_locks WHERE locktype = 'advisory';

-- If you see a lock with the same ID, you can terminate it:
-- (Use with caution - only if you're sure no migration is running)
SELECT pg_advisory_unlock_all();
```

### Solution 5: Use `prisma db push` Instead (Development Only)
For development, you can bypass migrations:

```powershell
npx prisma db push
```

This will sync your schema directly without creating migration files.

**Warning**: Don't use `db push` in production - use migrations instead.

### Solution 6: Restart PostgreSQL Service
Sometimes restarting PostgreSQL helps:

```powershell
# Find PostgreSQL service
Get-Service -Name "*postgres*"

# Restart it (replace with actual service name)
Restart-Service postgresql-x64-15
```

## Recommended Approach

For a fresh setup:
1. Make sure no other Prisma processes are running
2. Try `npx prisma db push` first (quickest for development)
3. If you need migrations, delete `prisma/migrations` folder and start fresh
