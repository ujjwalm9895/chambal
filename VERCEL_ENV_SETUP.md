# Setting Environment Variables in Vercel

Your backend is now live at: **https://cms-backend-20v6.onrender.com**

## For Website (Next.js)

1. Go to your Vercel project (website)
2. Click **Settings** → **Environment Variables**
3. Add:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://cms-backend-20v6.onrender.com/api/v1`
   - **Environment:** Production, Preview, Development (select all)
4. Click **Save**
5. **Redeploy** the website (or push a new commit)

## For Admin Panel (Vite)

1. Go to your Vercel project (admin)
2. Click **Settings** → **Environment Variables**
3. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://cms-backend-20v6.onrender.com/api/v1`
   - **Environment:** Production, Preview, Development (select all)
4. Click **Save**
5. **Redeploy** the admin panel (or push a new commit)

## Important Notes

- **Vite** uses `VITE_` prefix for environment variables
- **Next.js** uses `NEXT_PUBLIC_` prefix for client-side variables
- After setting variables, you **must redeploy** for changes to take effect
- You can trigger redeploy from Vercel dashboard → Deployments → Redeploy

## Update Backend CORS

After deploying website and admin panel, update backend CORS:

1. Go to Render → `cms-backend` service → **Environment** tab
2. Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://your-admin.vercel.app,https://your-website.vercel.app
   ```
3. Save and redeploy backend

## Test Your Deployment

1. **Backend:** https://cms-backend-20v6.onrender.com/api/v1/pages
2. **Website:** https://your-website.vercel.app/home
3. **Admin:** https://your-admin.vercel.app (login with admin@cms.com / admin123)

---

**Your CMS is now fully deployed!** 🎉
