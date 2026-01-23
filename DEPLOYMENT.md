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

## Making It Truly "Live" (Publicly Accessible)

To make your website accessible from anywhere on the internet, you need to **deploy** it to a hosting service.

### Option 1: Deploy Everything to One Platform (Easiest)

#### **Vercel** (Recommended for Next.js)
- **Website**: Deploy for free
- **Admin Panel**: Can deploy as separate app
- **Backend**: Use Vercel Serverless Functions or separate service

**Steps:**
1. Push code to GitHub
2. Connect to Vercel
3. Deploy website and admin panel
4. Use Vercel's serverless functions for API (or deploy backend separately)

#### **Railway** (Full-Stack)
- Deploy backend, admin, and website all together
- Free tier available
- Automatic PostgreSQL database

**Steps:**
1. Sign up at https://railway.app
2. Create new project
3. Add PostgreSQL service
4. Deploy backend, admin, and website services
5. Connect them together

#### **Render** (Full-Stack)
- Free tier for all services
- PostgreSQL included
- Easy deployment

**Steps:**
1. Sign up at https://render.com
2. Create PostgreSQL database
3. Deploy backend as Web Service
4. Deploy admin and website as Static Sites or Web Services

---

### Option 2: Separate Services (More Control)

#### **Backend:**
- **Railway**: https://railway.app
- **Render**: https://render.com
- **Heroku**: https://heroku.com (paid)
- **DigitalOcean App Platform**: https://www.digitalocean.com/products/app-platform

#### **Database:**
- **Supabase**: https://supabase.com (free tier)
- **Neon**: https://neon.tech (free tier)
- **Railway PostgreSQL**: Included with Railway
- **Render PostgreSQL**: Included with Render

#### **Admin Panel & Website:**
- **Vercel**: https://vercel.com (free, best for Next.js)
- **Netlify**: https://netlify.com (free)
- **Cloudflare Pages**: https://pages.cloudflare.com (free)

---

## Quick Deployment Steps (Railway Example)

### 1. Prepare Your Code

```bash
# Make sure everything is committed to Git
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy Backend

1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select your repository
4. Add PostgreSQL service
5. Set environment variables:
   - `DATABASE_URL` (from Railway PostgreSQL)
   - `JWT_SECRET` (generate a secure random string)
   - `CORS_ORIGIN` (your frontend URLs)
   - `MEDIA_BASE_URL` (your backend URL + /uploads)
6. Railway will auto-detect NestJS and deploy

### 3. Deploy Website (Vercel)

1. Go to https://vercel.com
2. Import your GitHub repository
3. Set root directory: `website`
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your Railway backend URL
5. Deploy

### 4. Deploy Admin Panel (Vercel)

1. Create another Vercel project
2. Set root directory: `admin`
3. Add environment variable:
   - `VITE_API_URL` = your Railway backend URL
4. Deploy

### 5. Update CORS

Update backend `CORS_ORIGIN` to include your deployed URLs:
```
CORS_ORIGIN=https://your-admin.vercel.app,https://your-website.vercel.app
```

---

## Environment Variables for Production

### Backend (.env)
```env
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public"
JWT_SECRET="your-super-secure-secret-key-minimum-32-chars"
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-admin.vercel.app,https://your-website.vercel.app
MEDIA_UPLOAD_PATH=./uploads
MEDIA_BASE_URL=https://your-backend.railway.app/uploads
```

### Admin Panel (.env)
```env
VITE_API_URL=https://your-backend.railway.app/api/v1
```a

### Website (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1
```

---

## Important Production Considerations

### Security
- ✅ Use strong `JWT_SECRET` (generate with: `openssl rand -hex 64`)
- ✅ Use HTTPS only
- ✅ Set proper CORS origins
- ✅ Use environment variables for all secrets
- ✅ Enable rate limiting
- ✅ Use secure password hashing (already using bcrypt)

### Database
- ✅ Use managed PostgreSQL (Supabase, Neon, Railway)
- ✅ Enable backups
- ✅ Use connection pooling

### Media Storage
- ✅ Consider using cloud storage (AWS S3, Cloudinary) instead of local files
- ✅ Or use Railway's persistent storage

### Performance
- ✅ Enable caching
- ✅ Optimize images
- ✅ Use CDN for static assets

---

## Testing Your Deployment

1. **Backend**: `https://your-backend.railway.app/api/v1/pages`
2. **Admin Panel**: `https://your-admin.vercel.app`
3. **Website**: `https://your-website.vercel.app`

---

## Cost Estimate

### Free Tier Options:
- **Railway**: $5/month free credit
- **Vercel**: Free for personal projects
- **Supabase**: Free tier (500MB database)
- **Neon**: Free tier (0.5GB storage)

### Total: **$0-5/month** for small projects

---

## Need Help?

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs

---

**Your CMS is production-ready!** Just needs deployment to be truly "live" on the internet. 🚀
