# Manual Deployment Guide (Using Google Cloud Console)

If you cannot install the `gcloud` CLI on your local machine, the easiest way to deploy is using the **Google Cloud Shell** directly in your browser. It has all tools pre-installed.

## Step 1: Open Google Cloud Console

1.  Go to [https://console.cloud.google.com](https://console.cloud.google.com).
2.  Create a new project (e.g., `chambal-news`).
3.  Make sure **Billing** is enabled for the project.

## Step 2: Create Resources (GUI Way)

### 1. Enable APIs
1.  Search for **"APIs & Services"** in the top search bar.
2.  Click **"+ ENABLE APIS AND SERVICES"**.
3.  Search for and enable:
    *   **Cloud Build API**
    *   **Cloud Run API**
    *   **Cloud SQL Admin API**

### 2. Create Database (Cloud SQL)
1.  Search for **"SQL"** and click **Create Instance**.
2.  Choose **MySQL**.
3.  **Instance ID**: `chambal-db-instance`.
4.  **Password**: Generate or create a strong password (SAVE THIS!).
5.  **Database version**: MySQL 8.0.
6.  **Region**: `us-central1` (or your preferred region).
7.  **Edition**: Enterprise Sandbox (cheapest) or Enterprise.
8.  Click **Create Instance**.
9.  Once created, go to the **Databases** tab (left menu) and create a new database named `chambal`.
10. Go to the **Users** tab and create a user `chambal` with a password.

### 3. Create Storage (Cloud Storage)
1.  Search for **"Cloud Storage"** -> **Buckets**.
2.  Click **Create**.
3.  Name: `your-project-id-media` (must be globally unique).
4.  Uncheck "Enforce public access prevention" if you want public images.
5.  Click **Create**.
6.  Go to the **Permissions** tab -> **Grant Access**.
7.  Add principal: `allUsers`.
8.  Role: `Storage Object Viewer`.
9.  Save.

## Step 3: Upload Code to Cloud Shell

1.  Click the **Activate Cloud Shell** icon ( >_ ) in the top right toolbar of the GCP Console.
2.  A terminal window will open at the bottom of the screen.
3.  **Upload your code**:
    *   **Option A (Zip Upload)**: Zip your local `chambal` folder (excluding `node_modules` and `venv`). Click the "Three Dots" menu in the Cloud Shell terminal -> **Upload** -> Select your zip file. Then unzip it: `unzip chambal.zip`.
    *   **Option B (Git - Recommended)**: If your code is on GitHub, just run:
        ```bash
        git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
        cd YOUR_REPO
        ```

## Step 4: Configure and Deploy

Now that your code is in Cloud Shell, you can run the commands directly there (since `gcloud` is pre-installed).

1.  **Open the Cloud Build file**:
    Type `nano cloudbuild.yaml` (or use the Cloud Shell Editor by clicking "Open Editor").

2.  **Update Variables**:
    Scroll down to `substitutions:` and update:
    *   `_CLOUD_SQL_INSTANCE`: Copy the "Connection name" from your SQL Instance overview page (e.g., `project-id:us-central1:chambal-db-instance`).
    *   `_DB_PASSWORD`: The password you set in Step 2.
    *   `_GS_BUCKET_NAME`: The bucket name you created.

3.  **Run Deployment**:
    Run this command in the Cloud Shell terminal:
    ```bash
    gcloud builds submit --config cloudbuild.yaml .
    ```

## Step 5: Final Setup

1.  **Run Migrations**:
    After deployment finishes, you need to set up the database schema.
    
    ```bash
    # Create a migration job
    gcloud run jobs create migrate-db \
        --image gcr.io/$GOOGLE_CLOUD_PROJECT/chambal-backend \
        --region us-central1 \
        --set-env-vars DB_HOST=/cloudsql/YOUR_CONNECTION_NAME,DB_NAME=chambal,DB_USER=chambal,DB_PASSWORD=YOUR_PASSWORD \
        --command python,manage.py,migrate \
        --add-cloudsql-instances YOUR_CONNECTION_NAME
    
    # Run it
    gcloud run jobs execute migrate-db --region us-central1
    ```

2.  **Get Frontend URL**:
    Go to **Cloud Run** in the console. You will see `chambal-frontend`. Click it to get the URL.
