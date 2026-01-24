# Setting Database URL in Render

## Your Database Connection String

```
postgresql://cms_user:DAdfJUruyXK8XKo5ixjHr3JTcLGho9J4@dpg-d5pt4ejuibrs73f7ojtg-a.virginia-postgres.render.com/cms_db_e8or
```

## How to Set This in Render

### Step 1: Go to Your Backend Service

1. Go to https://dashboard.render.com
2. Click on your **cms-backend** service

### Step 2: Add Environment Variable

1. Click on the **Environment** tab
2. Click **Add Environment Variable**
3. Set:
   - **Key:** `DATABASE_URL`
   - **Value:** `postgresql://cms_user:DAdfJUruyXK8XKo5ixjHr3JTcLGho9J4@dpg-d5pt4ejuibrs73f7ojtg-a.virginia-postgres.render.com/cms_db_e8or`
4. Click **Save Changes**

### Step 3: Redeploy

After setting the environment variable:

1. Go to the **Events** tab
2. Click **Manual Deploy** → **Deploy latest commit**
3. Wait for deployment to complete

### Step 4: Verify

Check the logs to ensure:
- ✅ Database connection successful
- ✅ Tables are created (from `prisma db push`)
- ✅ No connection errors

## Important Notes

### Internal vs External URL

The URL you provided appears to be an **External Database URL** (has the full hostname).

**For Render services, you should use:**
- ✅ **Internal Database URL** (if available) - faster, more secure
- ⚠️ **External Database URL** (what you provided) - works but slower

### To Get Internal URL:

1. Go to your PostgreSQL database service in Render
2. Look for **"Internal Database URL"**
3. It should look like: `postgresql://cms_user:password@dpg-xxxxx-a/cms_db_e8or`
   (No hostname, just the service name)

### If Connection Fails:

1. **Check if database is running:**
   - Go to PostgreSQL service
   - Verify status is "Available"

2. **Try Connection Pooling:**
   - In PostgreSQL service → Connection Pooling
   - Use the pooled connection string
   - Format: `postgresql://user:pass@host:port/db?pgbouncer=true`

3. **Verify credentials:**
   - Username: `cms_user`
   - Password: `DAdfJUruyXK8XKo5ixjHr3JTcLGho9J4`
   - Database: `cms_db_e8or`

## Quick Setup Checklist

- [ ] DATABASE_URL environment variable set in Render backend service
- [ ] Value matches the connection string exactly
- [ ] No extra spaces or quotes
- [ ] Service redeployed after setting variable
- [ ] Check logs for connection success

---

## Alternative: Update render.yaml (Not Recommended for Secrets)

**Note:** Don't put sensitive credentials in `render.yaml` if it's committed to Git.

If you want to use `render.yaml`, you can add it there, but it's better to set it in the Render dashboard for security.
