# Fixing Render Database Connection Issue

## Error
```
PrismaClientInitializationError: Server has closed the connection.
```

## Solution

The issue is with the database connection string format for Render PostgreSQL.

### Step 1: Get the Correct Connection String

In Render dashboard:
1. Go to your PostgreSQL database
2. Click on the database
3. Find **"Internal Database URL"** (NOT External)
4. Copy the full connection string

It should look like:
```
postgresql://cms_user:password@dpg-xxxxx-a/cms_db
```

### Step 2: Update Environment Variable

In your Render backend service:
1. Go to **Environment** tab
2. Update `DATABASE_URL` with the **Internal Database URL**
3. Make sure it's the Internal URL (not External)

### Step 3: Verify Connection String Format

The connection string should be:
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

For Render Internal Database URL, it's usually:
```
postgresql://USER:PASSWORD@HOST/DATABASE
```
(No port needed for internal connections)

### Step 4: Common Issues

**Issue 1: Using External URL instead of Internal**
- ❌ External Database URL (has public hostname)
- ✅ Internal Database URL (uses internal network)

**Issue 2: Wrong Format**
- Make sure it starts with `postgresql://` not `postgres://`
- Check for special characters in password (URL encode if needed)

**Issue 3: Database Not Ready**
- Wait a few minutes after creating database
- Check database status in Render dashboard

### Step 5: Test Connection

After updating, redeploy:
1. Go to your backend service
2. Click "Manual Deploy" → "Deploy latest commit"
3. Check logs to see if connection succeeds

### Alternative: Use Connection Pooling

If connection issues persist, use Render's connection pooling:

1. In PostgreSQL service, find **"Connection Pooling"**
2. Use the pooled connection string instead
3. Update `DATABASE_URL` with pooled URL

Pooled URL format:
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?pgbouncer=true
```

---

## Quick Fix Checklist

- [ ] Using Internal Database URL (not External)
- [ ] Connection string starts with `postgresql://`
- [ ] No typos in username/password
- [ ] Database is running (check status in Render)
- [ ] Backend service is in same region as database
- [ ] Environment variable is set correctly
- [ ] Redeployed after updating DATABASE_URL

---

## Still Not Working?

1. **Check Render Logs:**
   - Go to backend service → Logs
   - Look for connection errors

2. **Verify Database:**
   - Go to PostgreSQL service
   - Check it's running
   - Verify credentials

3. **Test Locally:**
   - Copy Internal Database URL
   - Update `backend/.env`
   - Test: `npm run start:dev`
   - If works locally, issue is Render-specific

4. **Use Connection Pooling:**
   - Enable connection pooling in PostgreSQL service
   - Use pooled connection string
