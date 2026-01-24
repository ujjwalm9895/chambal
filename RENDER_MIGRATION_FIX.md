# Fixing Database Migration on Render

## Problem
The error `The table 'public.users' does not exist in the current database` means the database tables haven't been created yet.

## Solution

### Option 1: Automatic (Recommended)
The `render.yaml` has been updated to automatically run `prisma db push` during build, which will create all tables.

**Just redeploy your service on Render:**
1. Go to Render Dashboard → Your Service
2. Click **Manual Deploy** → **Deploy latest commit**
3. The build will automatically create all tables

### Option 2: Manual Migration via Render Shell

If automatic migration doesn't work, you can run it manually:

1. Go to Render Dashboard → Your Service
2. Click **Shell** tab (or use SSH)
3. Run these commands:

```bash
cd /opt/render/project/src/backend
npm run prisma:db:push
```

### Option 3: Create Proper Migrations (For Future)

Once the database is set up, you can create proper migrations:

1. **Locally**, create the initial migration:
   ```bash
   cd backend
   npx prisma migrate dev --name init
   ```

2. **Commit the migration files** to git:
   ```bash
   git add prisma/migrations
   git commit -m "Add initial database migration"
   git push
   ```

3. **Update render.yaml** to use migrations instead:
   ```yaml
   buildCommand: npm install && npm run prisma:generate && npm run build && npm run prisma:migrate:deploy
   ```

4. **Redeploy** on Render

## Verify Database Setup

After migration, verify tables exist:

1. Go to Render Dashboard → Your Database
2. Click **Connect** → **External Connection**
3. Connect with psql or pgAdmin
4. Run: `\dt` to list all tables

You should see:
- `users`
- `pages`
- `sections`
- `media`
- `menus`
- `menu_items`
- `_prisma_migrations`

## Seed Database (Optional)

After tables are created, you can seed initial data:

1. Go to Render Shell
2. Run:
   ```bash
   cd /opt/render/project/src/backend
   npm run prisma:seed
   ```

This will create:
- Admin user: `admin@cms.com` / `admin123`
- Editor user: `editor@cms.com` / `editor123`

---

**Current Status:** The `render.yaml` is configured to automatically push the schema on each deploy. This will work for now, but consider creating proper migrations for production use.
