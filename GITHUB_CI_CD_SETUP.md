# Setting up CI/CD with GitHub and Google Cloud Build

This guide explains how to connect your GitHub repository to Google Cloud Build so that every time you push to the `main` branch, your application is automatically built and deployed.

## Prerequisites

1.  Your code is pushed to a **GitHub Repository**.
2.  You have a **Google Cloud Project** with billing enabled.
3.  You have enabled the **Cloud Build API** and **Cloud Run API** (as described in `GCP_DEPLOYMENT_GUIDE.md`).

---

## Step 1: Connect GitHub Repository

1.  Go to the **[Google Cloud Console > Cloud Build > Triggers](https://console.cloud.google.com/cloud-build/triggers)** page.
2.  Click **Manage Repositories** (top right) -> **Connect Repository**.
3.  Select **GitHub (Cloud Build GitHub App)**.
4.  Authenticate with GitHub and select your repository (`chambal` or whatever you named it).
5.  Click **Connect**.

---

## Step 2: Create a Build Trigger

1.  On the **Triggers** page, click **+ CREATE TRIGGER**.
2.  **Name**: `deploy-chambal-prod`.
3.  **Region**: `us-central1` (or your preferred region).
4.  **Event**: Select **Push to a branch**.
5.  **Source**:
    *   **Repository**: Select your connected GitHub repo.
    *   **Branch**: `^main$` (matches the main branch).
6.  **Configuration**:
    *   **Type**: `Cloud Build configuration file (yaml or json)`.
    *   **Location**: `Repository`.
    *   **File location**: `cloudbuild.yaml` (this is the file I created in your project root).

---

## Step 3: Configure Environment Variables (Substitution Variables)

This is the **most important step**. You need to tell Cloud Build the secrets and configuration values for your database and environment.

Scroll down to the **Advanced > Substitution variables** section.
Add the following variables (Key = Value):

| Variable Name | Value Example | Description |
| :--- | :--- | :--- |
| `_REGION` | `us-central1` | Region for Cloud Run services |
| `_CLOUD_SQL_INSTANCE` | `project-id:us-central1:instance-name` | **Crucial**: The "Connection Name" of your Cloud SQL instance |
| `_DB_NAME` | `chambal` | Database name |
| `_DB_USER` | `chambal` | Database user |
| `_DB_PASSWORD` | `your-secret-password` | Database password |
| `_GS_BUCKET_NAME` | `your-project-media` | The GCS bucket name for media files |
| `_NEXT_PUBLIC_API_BASE_URL` | `https://api.yourdomain.com` | URL of your Backend (leave as default first, then update after backend is deployed) |

*Note: For better security, you can use Secret Manager, but Substitution Variables are the easiest way to start.*

---

## Step 4: Save and Run

1.  Click **CREATE**.
2.  In the Trigger list, click **RUN** on your new trigger to test it manually.
3.  Click **SHOW** to watch the build logs.

## Step 5: Automatic Deployment

Now, whenever you make changes and push to GitHub:

```bash
git add .
git commit -m "New feature"
git push origin main
```

Cloud Build will automatically:
1.  Build your Django Backend Docker image.
2.  Build your Next.js Frontend Docker image.
3.  Push images to Google Container Registry.
4.  Deploy the updated services to Cloud Run.

---

## Troubleshooting

### "Permission denied" for Cloud SQL
If the build fails during deployment or the app crashes:
1.  Go to **IAM & Admin**.
2.  Find the **Cloud Build Service Account** (`@cloudbuild.gserviceaccount.com`).
3.  Ensure it has the **Cloud SQL Client** role.
4.  Find the **Compute Engine default service account** (used by Cloud Run by default).
5.  Ensure it also has **Cloud SQL Client** and **Storage Object Admin** roles.
