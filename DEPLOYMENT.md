# Deployment Guide - Making Your CMS Live

## Current Status: Local Development

Your CMS is currently running **locally** on your computer:
- ✅ Backend: `http://localhost:3000`
- ✅ Admin Panel: `http://localhost:3001`
- ✅ Website: `http://localhost:3002`

**This means:**
- Only accessible on your computer
- Not accessible from the internet
- Stops when you close the terminal

---

## 🚀 Recommended: Vercel + Render Deployment

### Overview

Deploy your CMS using:
- **Vercel** - For website and admin panel (free, optimized for Next.js/React)
- **Render** - For backend API and PostgreSQL database (free tier available)

**Benefits:**
- ✅ Free tier for all services
- ✅ Automatic HTTPS
- ✅ Easy setup
- ✅ Great for Next.js and React
- ✅ Automatic deployments from Git

---

## Step-by-Step Deployment

### Step 1: Prepare Your Code

1. **Push to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create `.env` files** (don't commit these):
   - `backend/.env` - Will be set in Render
   - `admin/.env` - Will be set in Vercel
   - `website/.env.local` - Will be set in Vercel

### Step 2: Deploy Backend to Render

1. **Sign up/Login** at https://render.com

2. **Create PostgreSQL Database:**
   - Click "New +" → "PostgreSQL"
   - Name: `cms-db`
   - Database: `cms_db`
   - User: `cms_user`
   - Region: Choose closest to you
   - Plan: Free (or paid)
   - Click "Create Database"
   - **Save the connection string** (Internal Database URL)

3. **Deploy Backend:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Name: `cms-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install && npm run prisma:generate && npm run build`
   - Start Command: `npm run start:prod`
   
   **Note:** The build outputs to `dist/src/main.js`, so the start command uses that path.
   
   **If build fails, try:**
   - Build Command: `npm ci && npm run prisma:generate && npm run build`

4. **Set Environment Variables:**
   ```
   DATABASE_URL=<your-postgres-connection-string>
   JWT_SECRET=<generate-a-random-secret-min-32-chars>
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   CORS_ORIGIN=https://your-admin.vercel.app,https://your-website.vercel.app
   MEDIA_UPLOAD_PATH=/opt/render/project/src/uploads
   MEDIA_BASE_URL=https://cms-backend.onrender.com/uploads
   PORT=10000
   ```

5. **Click "Create Web Service"**

6. **Wait for deployment** (first build takes ~5-10 minutes)

7. **Get your backend URL:** `https://cms-backend.onrender.com`

### Step 3: Run Database Migrations

After backend is deployed:

1. **Option A: Using Render Shell**
   - Go to your backend service
   - Click "Shell" tab
   - Run:
     ```bash
     npm run prisma:migrate deploy
     npm run prisma:seed
     ```

2. **Option B: Using Local Prisma**
   - Update `backend/.env` with Render database URL
   - Run locally:
     ```bash
     cd backend
     npm run prisma:migrate deploy
     npm run prisma:seed
     ```

### Step 4: Deploy Website to Vercel

1. **Sign up/Login** at https://vercel.com

2. **Import Project:**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Framework Preset: **Next.js**
   - Root Directory: `website`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

3. **Set Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://cms-backend.onrender.com/api/v1
   ```

4. **Click "Deploy"**

5. **Get your website URL:** `https://your-project.vercel.app`

### Step 5: Deploy Admin Panel to Vercel

1. **Create Another Project:**
   - Click "Add New" → "Project"
   - Import same GitHub repository
   - Framework Preset: **Vite**
   - Root Directory: `admin`
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. **Set Environment Variables:**
   ```
   VITE_API_URL=https://cms-backend.onrender.com/api/v1
   ```

3. **Click "Deploy"**

4. **Get your admin URL:** `https://your-admin-project.vercel.app`

### Step 6: Update Backend CORS

After getting your Vercel URLs:

1. Go to Render → Your backend service → Environment
2. Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://your-admin.vercel.app,https://your-website.vercel.app
   ```
3. Save and redeploy

### Step 7: Test Your Deployment

1. **Backend:** `https://cms-backend.onrender.com/api/v1/pages`
2. **Admin Panel:** `https://your-admin.vercel.app` (login with admin@cms.com / admin123)
3. **Website:** `https://your-website.vercel.app/home`

---

## Environment Variables Summary

### Backend (Render)
```env
DATABASE_URL=<render-postgres-connection-string>
JWT_SECRET=<your-secret-key>
JWT_EXPIRES_IN=7d
NODE_ENV=production
CORS_ORIGIN=https://your-admin.vercel.app,https://your-website.vercel.app
MEDIA_UPLOAD_PATH=/opt/render/project/src/uploads
MEDIA_BASE_URL=https://cms-backend.onrender.com/uploads
PORT=10000
```

### Website (Vercel)
```env
NEXT_PUBLIC_API_URL=https://cms-backend.onrender.com/api/v1
```

### Admin Panel (Vercel)
```env
VITE_API_URL=https://cms-backend.onrender.com/api/v1
```

---

## Cost Estimation

### Free Tier:
- **Vercel**: Free for personal projects (unlimited)
- **Render**: 
  - Web Services: Free tier (spins down after 15 min inactivity)
  - PostgreSQL: Free tier (90 days, then $7/month)

### Paid (Recommended for Production):
- **Render Web Service**: $7/month (always on)
- **Render PostgreSQL**: $7/month
- **Vercel**: Still free

**Total: ~$14/month** for always-on production

---

## Troubleshooting

### Backend Won't Start
- Check Render logs
- Verify environment variables
- Ensure database is running
- Check build logs for errors

### Database Connection Issues
- Use Internal Database URL from Render
- Verify DATABASE_URL is correct
- Check database is running

### CORS Errors
- Update CORS_ORIGIN with exact Vercel URLs
- Include both admin and website URLs
- Redeploy backend after updating

### Admin/Website Can't Connect to Backend
- Verify VITE_API_URL and NEXT_PUBLIC_API_URL
- Check backend is running (Render dashboard)
- Ensure backend URL is correct

---

## Alternative: Railway (All-in-One)

If you prefer one platform:

1. **Sign up** at https://railway.app
2. **Create Project** → "Deploy from GitHub"
3. **Add PostgreSQL** service
4. **Deploy Backend:**
   - New → "GitHub Repo" → Select repo
   - Root Directory: `backend`
   - Add environment variables
5. **Deploy Admin & Website** similarly

**Cost:** $5/month free credit, then pay-as-you-go

---

## Alternative: GCP Cloud Build

For Google Cloud Platform deployment, see `GCP_DEPLOYMENT.md` for detailed instructions.

---

## Quick Commands Reference

### Render
- View logs: Render dashboard → Service → Logs
- Update env vars: Service → Environment
- Redeploy: Service → Manual Deploy

### Vercel
- View logs: Project → Deployments → Click deployment → Logs
- Update env vars: Project → Settings → Environment Variables
- Redeploy: Push to GitHub (automatic) or Manual Deploy

---

**Your CMS is now ready for deployment!** 🚀

Start with Render for backend, then Vercel for frontends - it's the easiest path!
