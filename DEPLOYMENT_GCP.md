# GCP Deployment Guide (CI/CD)

This guide explains how to set up a complete CI/CD pipeline for the Chambal Sandesh CMS on Google Cloud Platform (GCP) using **Cloud Build**, **Artifact Registry**, **Cloud Run**, and **Cloud SQL**.

## Prerequisites

1.  A Google Cloud Platform Account.
2.  A new GCP Project.
3.  `gcloud` CLI installed locally (optional, but helpful).

## 1. Enable Required Services

In your GCP Console, go to **APIs & Services > Library** and enable:
*   **Cloud Build API**
*   **Cloud Run Admin API**
*   **Artifact Registry API**
*   **Cloud SQL Admin API** (if using Cloud SQL)

## 2. Set Up Artifact Registry

1.  Go to **Artifact Registry**.
2.  Click **Create Repository**.
3.  **Name**: `chambal-cms`
4.  **Format**: Docker
5.  **Region**: `us-central1` (or your preferred region)
6.  Click **Create**.

## 3. Set Up Cloud SQL (MySQL)

Since this CMS uses a relational database, you need a cloud database.

1.  Go to **Cloud SQL**.
2.  Create a **MySQL** instance.
3.  Set a password for the `root` user.
4.  Create a database named `chambal_cms`.
5.  **Networking**:
    *   Enable **Public IP** (easiest for setup, secure with authorized networks).
    *   Or use **Private IP** (requires VPC Connector for Cloud Run).
    *   *Recommended for Prod*: Use Private IP with VPC.
    *   *Quick Start*: Use Public IP and allow `0.0.0.0/0` (ONLY for testing) or set up the Cloud SQL Auth Proxy sidecar (advanced).
    *   **Best Practice**: Configure Cloud Run to connect via **Cloud SQL Instance Connection Name**.

## 4. Configure Cloud Build Trigger

1.  Go to **Cloud Build > Triggers**.
2.  Click **Create Trigger**.
3.  **Source**: Connect your GitHub/Bitbucket repository.
4.  **Configuration**: Autodetect (looks for `cloudbuild.yaml`).
5.  **Substitution Variables** (Add these):
    *   `_AR_HOSTNAME`: `asia-south2-docker.pkg.dev`
    *   `_SERVICE_NAME`: `chambal-cms`
    *   `_DEPLOY_REGION`: `asia-south2`

## 5. Environment Variables & Secrets

Cloud Run needs your database credentials and NextAuth secret.

1.  Go to **Security > Secret Manager**.
2.  Create secrets for:
    *   `DATABASE_URL`: `mysql://user:password@host:3306/chambal_cms`
        *   *Note for Cloud SQL*: `mysql://user:password@/chambal_cms?socket=/cloudsql/chambal-485109:asia-south2:chambal-db-instance`
    *   `AUTH_SECRET`: Your generated secret key.
    *   `AUTH_URL`: The URL of your Cloud Run service (you'll get this after first deploy, or set to `https://your-custom-domain.com`).

3.  **Update `cloudbuild.yaml`** (Done):
    *   The configuration is already set to pull these secrets automatically:
        ```yaml
        - '--set-secrets'
        - 'DATABASE_URL=DATABASE_URL:latest,AUTH_SECRET=AUTH_SECRET:latest,AUTH_URL=AUTH_URL:latest'
        ```

## 6. Database Migration (Production)

Running `npx prisma db push` in production is risky. The best practice is:

1.  **Connect locally to Cloud SQL**:
    *   Install **Cloud SQL Auth Proxy**.
    *   Start proxy: `./cloud_sql_proxy -instances=chambal-485109:asia-south2:chambal-db-instance=tcp:3306`
    *   In local `.env`, set `DATABASE_URL="mysql://<DB_USER>:<DB_PASSWORD>@127.0.0.1:3306/chambal_cms"`
    *   Run `npx prisma migrate deploy` (Recommended) or `npx prisma db push`.

2.  **Seed Data**:
    *   Run `node prisma/seed.js` locally while connected to the proxy.

## 7. Deploy

1.  Push your code to the repository.
2.  Cloud Build will trigger automatically.
3.  Monitor the build in **Cloud Build > History**.
4.  Once finished, your app will be live on the Cloud Run URL.

## 8. Post-Deployment

1.  Get the Cloud Run URL.
2.  Update `AUTH_URL` env var in Cloud Run to match this URL.
3.  Update your DNS (if using custom domain) to point to Cloud Run.

---

### Important: Service Account Permissions
The **Cloud Build Service Account** needs permissions to deploy:
*   **Cloud Run Admin**
*   **Service Account User**
*   **Artifact Registry Writer**
