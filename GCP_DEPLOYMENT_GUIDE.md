# GCP Deployment Guide for Chambal Sandesh

This guide will walk you through deploying the Chambal Sandesh application (Django Backend + Next.js Frontend) to Google Cloud Platform (GCP) using Cloud Run and Cloud Build.

## Prerequisites

1.  **Google Cloud Project**: You need a GCP project with billing enabled.
2.  **Google Cloud SDK**: Install and initialize `gcloud` CLI locally.

## Step 1: Enable APIs

Run the following commands to enable necessary Google Cloud APIs:

```bash
gcloud services enable cloudbuild.googleapis.com \
    run.googleapis.com \
    sqladmin.googleapis.com \
    storage.googleapis.com \
    secretmanager.googleapis.com \
    artifactregistry.googleapis.com
```

## Step 2: Set up Cloud SQL (MySQL)

1.  Create a MySQL instance:
    ```bash
    gcloud sql instances create chambal-db-instance \
        --database-version=MYSQL_8_0 \
        --cpu=1 --memory=4GB \
        --region=us-central1 \
        --root-password=YOUR_DB_ROOT_PASSWORD
    ```

2.  Create a database and user:
    ```bash
    gcloud sql databases create chambal --instance=chambal-db-instance
    gcloud sql users create chambal --instance=chambal-db-instance --password=YOUR_DB_PASSWORD
    ```

## Step 3: Set up Cloud Storage (Media Files)

1.  Create a GCS bucket for media files:
    ```bash
    gsutil mb -l us-central1 gs://YOUR_PROJECT_ID-media
    ```
2.  Make the bucket public (if media files should be public):
    ```bash
    gsutil iam ch allUsers:objectViewer gs://YOUR_PROJECT_ID-media
    ```

## Step 4: Configure Cloud Build

1.  Open `cloudbuild.yaml` in the root directory.
2.  Update the `substitutions` section with your values:
    *   `_REGION`: Your preferred region (e.g., `us-central1`).
    *   `_DB_HOST`: For Cloud Run, this is usually `/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME` if using the Cloud SQL Auth Proxy built-in, but for build time it's harder. 
        *   **Recommendation**: Use **Secret Manager** or **Environment Variables** in the Cloud Run service settings later. For `cloudbuild.yaml`, you can set defaults.
        *   The provided `cloudbuild.yaml` uses `set-env-vars`. You will need to update the `args` in `cloudbuild.yaml` or override them in the Cloud Build trigger.

    **Important**: For Cloud SQL connection from Cloud Run, you need to add `--add-cloudsql-instances=PROJECT_ID:REGION:INSTANCE_NAME` to the deploy command.
    
    *I have updated `cloudbuild.yaml` to include a placeholder for this.*

## Step 5: Deploy

You can trigger the build manually from your local machine:

```bash
gcloud builds submit --config cloudbuild.yaml .
```

Or set up a Trigger in GCP Console connected to your GitHub repository.

## Step 6: Post-Deployment Configuration

1.  **Database Migrations**:
    After the backend is deployed, you need to run migrations. You can do this by creating a one-off job or using Cloud Run jobs.
    
    Create a job definition:
    ```bash
    gcloud run jobs create migrate-db \
        --image gcr.io/YOUR_PROJECT_ID/chambal-backend \
        --region us-central1 \
        --set-env-vars DB_HOST=/cloudsql/YOUR_PROJECT_ID:us-central1:chambal-db-instance,DB_NAME=chambal,DB_USER=chambal,DB_PASSWORD=YOUR_DB_PASSWORD \
        --command python,manage.py,migrate \
        --add-cloudsql-instances YOUR_PROJECT_ID:us-central1:chambal-db-instance
    ```
    
    Run the job:
    ```bash
    gcloud run jobs execute migrate-db --region us-central1
    ```

2.  **Create Superuser**:
    Similarly, create a job to run `createsuperuser`.

3.  **Frontend API URL**:
    Once the Backend is deployed, get its URL (e.g., `https://chambal-backend-xyz.a.run.app`).
    Update your `cloudbuild.yaml` or Trigger substitution `_NEXT_PUBLIC_API_BASE_URL` with this URL (append `/api` if needed).
    Re-deploy the Frontend.

## Troubleshooting

-   **Cloud SQL Connection**: Ensure the Cloud Run service account has `Cloud SQL Client` role.
-   **Static Files**: Ensure `GS_BUCKET_NAME` is set correctly and the service account has access to the bucket.
