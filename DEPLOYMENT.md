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

## 🚀 GCP Cloud Build Deployment (Recommended)

### Overview

Deploy your CMS to Google Cloud Platform using **Cloud Build** and **Cloud Run**. This provides:
- ✅ Automatic builds on git push
- ✅ Serverless scaling (pay per use)
- ✅ Managed PostgreSQL (Cloud SQL)
- ✅ HTTPS by default
- ✅ Global CDN

### Prerequisites

1. **Google Cloud Account** with billing enabled
2. **gcloud CLI** installed: https://cloud.google.com/sdk/docs/install
3. **Git** repository (GitHub, GitLab, or Cloud Source Repositories)

### Quick Start

```bash
# 1. Login and create project
gcloud auth login
gcloud projects create cms-project --name="CMS Project"
gcloud config set project cms-project

# 2. Enable APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable sqladmin.googleapis.com

# 3. Set permissions
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format="value(projectNumber)")
gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin"
gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# 4. Create PostgreSQL database
gcloud sql instances create cms-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password=YOUR_SECURE_PASSWORD
gcloud sql databases create cms_db --instance=cms-db
gcloud sql users create cms_user --instance=cms-db --password=YOUR_USER_PASSWORD

# 5. Deploy
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_DATABASE_URL="postgresql://cms_user:PASSWORD@/cms_db?host=/cloudsql/PROJECT_ID:us-central1:cms-db",_JWT_SECRET="your-secret-key"
```

### Detailed Steps

See **`GCP_DEPLOYMENT.md`** for complete step-by-step instructions including:
- Setting up Cloud SQL
- Configuring Cloud Build triggers
- Running migrations
- Seeding database
- Environment variables
- Troubleshooting

### Configuration Files

- **`cloudbuild.yaml`** - Cloud Build configuration
- **`backend/Dockerfile`** - Backend container
- **`admin/Dockerfile`** - Admin panel container (Nginx)
- **`website/Dockerfile`** - Next.js website container
- **`admin/nginx.conf`** - Nginx configuration

### Environment Variables

**Backend (Cloud Run):**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret (min 32 chars)
- `JWT_EXPIRES_IN` - Token expiration (default: 7d)
- `NODE_ENV` - Set to "production"
- `CORS_ORIGIN` - Allowed origins (comma-separated)
- `MEDIA_UPLOAD_PATH` - File upload path (`/tmp/uploads`)
- `MEDIA_BASE_URL` - Base URL for media files

**Admin (Cloud Run):**
- `VITE_API_URL` - Backend API URL

**Website (Cloud Run):**
- `NEXT_PUBLIC_API_URL` - Backend API URL

### Cost Estimation

**Free Tier:**
- Cloud Build: 120 build-minutes/day free
- Cloud Run: 2 million requests/month free
- Cloud SQL: db-f1-micro eligible for free tier

**Estimated Monthly Cost (Small Project):**
- Cloud Run: $0-10 (depending on traffic)
- Cloud SQL: $0-25 (db-f1-micro)
- Cloud Build: $0-5 (if exceeding free tier)

**Total: ~$0-40/month** for small projects

---

## Alternative Deployment Options

### Option 1: Railway (Full-Stack)

**Steps:**
1. Sign up at https://railway.app
2. Create new project
3. Add PostgreSQL service
4. Deploy backend, admin, and website services
5. Connect them together

**Pros:**
- Simple setup
- Automatic PostgreSQL
- Free tier available

### Option 2: Render (Full-Stack)

**Steps:**
1. Sign up at https://render.com
2. Create PostgreSQL database
3. Deploy backend as Web Service
4. Deploy admin and website as Static Sites or Web Services

**Pros:**
- Free tier for all services
- PostgreSQL included
- Easy deployment

### Option 3: Vercel + Railway

**Website & Admin:**
- Deploy to Vercel (free)
- Best for Next.js and React apps

**Backend:**
- Deploy to Railway (free tier)
- Use Railway PostgreSQL or Supabase

**Pros:**
- Optimized for frontend
- Free tier generous
- Great Next.js support

### Option 4: Separate Services

**Backend:**
- Railway, Render, Heroku, DigitalOcean

**Database:**
- Supabase (free tier)
- Neon (free tier)
- Railway PostgreSQL
- Render PostgreSQL

**Admin Panel & Website:**
- Vercel (free, best for Next.js)
- Netlify (free)
- Cloudflare Pages (free)

---

## Production Considerations

### Security
- ✅ Use strong `JWT_SECRET` (generate with: `openssl rand -hex 64`)
- ✅ Use HTTPS only
- ✅ Set proper CORS origins
- ✅ Use environment variables for all secrets
- ✅ Enable rate limiting
- ✅ Use secure password hashing (already using bcrypt)

### Database
- ✅ Use managed PostgreSQL (Cloud SQL, Supabase, Neon)
- ✅ Enable backups
- ✅ Use connection pooling

### Media Storage
- ✅ Consider using cloud storage (AWS S3, Cloudinary) instead of local files
- ✅ Or use persistent storage (Railway, Cloud Run volumes)

### Performance
- ✅ Enable caching
- ✅ Optimize images
- ✅ Use CDN for static assets

---

## Testing Your Deployment

1. **Backend**: `https://your-backend-url/api/v1/pages`
2. **Admin Panel**: `https://your-admin-url`
3. **Website**: `https://your-website-url`

---

## Useful Commands

### GCP

```bash
# View logs
gcloud run services logs read cms-backend --region=us-central1

# Update service
gcloud run services update cms-backend --region=us-central1

# Scale service
gcloud run services update cms-backend \
  --region=us-central1 \
  --min-instances=1 \
  --max-instances=10

# Get service URLs
gcloud run services describe cms-backend --region=us-central1 --format="value(status.url)"
```

---

**Your CMS is production-ready!** Choose your deployment method and follow the steps above. 🚀
