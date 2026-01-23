# GCP Cloud Build Deployment Guide

This guide will help you deploy your CMS to Google Cloud Platform using Cloud Build and Cloud Run.

## Prerequisites

1. **Google Cloud Account** with billing enabled
2. **gcloud CLI** installed: https://cloud.google.com/sdk/docs/install
3. **Docker** installed (for local testing)
4. **Git** repository (GitHub, GitLab, or Cloud Source Repositories)

## Step 1: Initial GCP Setup

### 1.1 Create a GCP Project

```bash
# Login to GCP
gcloud auth login

# Create a new project (or use existing)
gcloud projects create cms-project --name="CMS Project"

# Set as current project
gcloud config set project cms-project

# Enable billing (required for Cloud Run)
# Do this in the GCP Console: https://console.cloud.google.com/billing
```

### 1.2 Enable Required APIs

```bash
# Enable Cloud Build API
gcloud services enable cloudbuild.googleapis.com

# Enable Cloud Run API
gcloud services enable run.googleapis.com

# Enable Container Registry API
gcloud services enable containerregistry.googleapis.com

# Enable Cloud SQL Admin API (for PostgreSQL)
gcloud services enable sqladmin.googleapis.com
```

### 1.3 Set Up Cloud Build Permissions

```bash
# Grant Cloud Build service account necessary permissions
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format="value(projectNumber)")
gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

## Step 2: Set Up PostgreSQL Database

### Option A: Cloud SQL (Recommended)

```bash
# Create Cloud SQL PostgreSQL instance
gcloud sql instances create cms-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password=YOUR_SECURE_PASSWORD

# Create database
gcloud sql databases create cms_db --instance=cms-db

# Create database user
gcloud sql users create cms_user \
  --instance=cms-db \
  --password=YOUR_USER_PASSWORD
```

**Get Connection String:**
```bash
# Get connection name
gcloud sql instances describe cms-db --format="value(connectionName)"
# Output: PROJECT_ID:REGION:cms-db
```

### Option B: Use Cloud SQL Proxy (For Cloud Run)

You'll need to configure Cloud SQL connection in Cloud Run service.

## Step 3: Configure Cloud Build

### 3.1 Set Substitution Variables

Create a file `cloudbuild-substitutions.yaml` or set them in Cloud Build triggers:

```yaml
_DATABASE_URL: "postgresql://cms_user:PASSWORD@/cms_db?host=/cloudsql/PROJECT_ID:REGION:cms-db"
_JWT_SECRET: "your-super-secret-jwt-key-minimum-32-characters"
_CORS_ORIGIN: "https://cms-admin-XXXXX.run.app,https://cms-website-XXXXX.run.app"
_MEDIA_BASE_URL: "https://cms-backend-XXXXX.run.app/uploads"
_ADMIN_API_URL: "https://cms-backend-XXXXX.run.app/api/v1"
_WEBSITE_API_URL: "https://cms-backend-XXXXX.run.app/api/v1"
```

### 3.2 Set Secrets in Secret Manager (Recommended)

```bash
# Create secrets
echo -n "your-database-url" | gcloud secrets create DATABASE_URL --data-file=-
echo -n "your-jwt-secret" | gcloud secrets create JWT_SECRET --data-file=-
```

Then update `cloudbuild.yaml` to use secrets.

## Step 4: Connect Repository

### Option A: Cloud Source Repositories

```bash
# Initialize repository
gcloud source repos create cms-repo

# Add remote
git remote add google https://source.developers.google.com/p/PROJECT_ID/r/cms-repo
git push google main
```

### Option B: GitHub/GitLab

1. Go to Cloud Build → Triggers
2. Click "Create Trigger"
3. Connect your repository
4. Select `cloudbuild.yaml` as build configuration

## Step 5: First Deployment

### 5.1 Manual Build (Testing)

```bash
# Submit build
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_DATABASE_URL="your-db-url",_JWT_SECRET="your-secret"
```

### 5.2 Automatic Build (Via Trigger)

1. Push to your repository
2. Cloud Build will automatically trigger
3. Monitor in Cloud Build console

## Step 6: Get Service URLs

After deployment, get your service URLs:

```bash
# Backend URL
gcloud run services describe cms-backend --region=us-central1 --format="value(status.url)"

# Admin URL
gcloud run services describe cms-admin --region=us-central1 --format="value(status.url)"

# Website URL
gcloud run services describe cms-website --region=us-central1 --format="value(status.url)"
```

## Step 7: Update Environment Variables

After first deployment, update CORS and API URLs:

```bash
# Update backend CORS
gcloud run services update cms-backend \
  --region=us-central1 \
  --update-env-vars CORS_ORIGIN="https://your-admin-url,https://your-website-url"

# Update admin API URL
gcloud run services update cms-admin \
  --region=us-central1 \
  --update-env-vars VITE_API_URL="https://your-backend-url/api/v1"

# Update website API URL
gcloud run services update cms-website \
  --region=us-central1 \
  --update-env-vars NEXT_PUBLIC_API_URL="https://your-backend-url/api/v1"
```

## Step 8: Run Database Migrations

```bash
# Connect to Cloud Run backend
gcloud run services proxy cms-backend --region=us-central1 --port=8080

# In another terminal, run migrations
cd backend
gcloud run services execute cms-backend \
  --region=us-central1 \
  --command="npm" \
  --args="run,prisma:migrate,deploy"

# Or use Cloud SQL Proxy and run locally
```

## Step 9: Seed Database

```bash
# Run seed script
gcloud run services execute cms-backend \
  --region=us-central1 \
  --command="npm" \
  --args="run,prisma:seed"
```

## Configuration Files

### cloudbuild.yaml
Main Cloud Build configuration file.

### Dockerfiles
- `backend/Dockerfile` - Backend NestJS application
- `admin/Dockerfile` - Admin panel (Nginx)
- `website/Dockerfile` - Next.js website

## Environment Variables

### Backend (Cloud Run)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - Token expiration (default: 7d)
- `NODE_ENV` - Set to "production"
- `CORS_ORIGIN` - Allowed origins (comma-separated)
- `MEDIA_UPLOAD_PATH` - File upload path
- `MEDIA_BASE_URL` - Base URL for media files

### Admin (Cloud Run)
- `VITE_API_URL` - Backend API URL

### Website (Cloud Run)
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Troubleshooting

### Build Fails
- Check Cloud Build logs in console
- Verify Dockerfiles are correct
- Check substitution variables

### Service Won't Start
- Check Cloud Run logs
- Verify environment variables
- Check database connectivity

### Database Connection Issues
- Verify Cloud SQL instance is running
- Check connection string format
- Ensure Cloud SQL Proxy is configured (if needed)

## Cost Estimation

### Free Tier
- Cloud Build: 120 build-minutes/day free
- Cloud Run: 2 million requests/month free
- Cloud SQL: db-f1-micro eligible for free tier

### Estimated Monthly Cost (Small Project)
- Cloud Run: $0-10 (depending on traffic)
- Cloud SQL: $0-25 (db-f1-micro)
- Cloud Build: $0-5 (if exceeding free tier)

**Total: ~$0-40/month** for small projects

## Security Best Practices

1. ✅ Use Secret Manager for sensitive data
2. ✅ Enable Cloud SQL SSL connections
3. ✅ Use IAM roles and service accounts
4. ✅ Enable Cloud Armor for DDoS protection
5. ✅ Use HTTPS only (Cloud Run default)
6. ✅ Regular security updates

## Next Steps

1. Set up custom domains
2. Configure Cloud CDN
3. Set up monitoring and alerts
4. Configure backup strategy
5. Set up CI/CD pipeline

## Useful Commands

```bash
# View logs
gcloud run services logs read cms-backend --region=us-central1

# Update service
gcloud run services update cms-backend --region=us-central1

# Scale service
gcloud run services update cms-backend --region=us-central1 --min-instances=1 --max-instances=10

# Delete service
gcloud run services delete cms-backend --region=us-central1
```

---

**Your CMS is now ready for GCP deployment!** 🚀
