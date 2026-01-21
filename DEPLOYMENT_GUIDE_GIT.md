# Git Deployment Guide for cPanel

This guide explains how to deploy your **Chambal Sandesh** project (React SPA + Django Backend) to cPanel using **Git**. This workflow allows you to push changes from your local machine and pull them on the server.

## Prerequisites

1.  **cPanel Access**: Ensure your hosting plan supports Git Version Control and SSH Access.
2.  **GitHub/GitLab Repository**: Your project should be pushed to a remote repository.
3.  **SSH Key**: Your local machine's SSH key must be added to your GitHub/GitLab account.

---

## Part 1: Initial Server Setup (One-Time)

### 1. Generate SSH Key on cPanel
1.  Log in to cPanel -> **Terminal**.
2.  Run: `ssh-keygen -t rsa -b 4096` (Press Enter for all prompts).
3.  Run: `cat ~/.ssh/id_rsa.pub`.
4.  Copy the output key and add it to your **GitHub/GitLab -> Settings -> SSH Keys**.

### 2. Clone Repository on cPanel
1.  In cPanel Terminal, navigate to the root directory (or where you want the code to live, usually **outside** `public_html` for security).
    ```bash
    cd ~
    git clone git@github.com:username/chambal-sandesh.git repositories/chambal
    ```
    *(Replace with your actual repo URL)*.

---

## Part 2: Backend Deployment (Django)

The backend code stays in the repository folder. We point the Python App to it.

### 1. Setup Python App
1.  Go to cPanel -> **Setup Python App**.
2.  **Create Application**:
    *   **Python Version**: 3.9+
    *   **Application Root**: `repositories/chambal/backend`
    *   **Application URL**: `api.yourdomain.com` (or `yourdomain.com/api`)
    *   **Application Entry Point**: `passenger_wsgi.py` (ensure this file exists in `backend/`)
3.  Click **Create**.

### 2. Install Dependencies
1.  Copy the "Enter virtual environment" command from the Python App page.
2.  Paste it into the cPanel Terminal.
3.  Install requirements:
    ```bash
    cd repositories/chambal/backend
    pip install -r requirements.txt
    ```

### 3. Environment Variables
Create a `.env` file in `repositories/chambal/backend/` with your production secrets (DB credentials, SECRET_KEY, debug=False).

---

## Part 3: Frontend Deployment (React)

Since cPanel serves static files for the frontend, we need a build step. You have two options:

### Option A: Build Locally (Recommended for Shared Hosting)
Shared hosting often has limited RAM, so building Node apps on the server might fail.
1.  Build locally: `npm run build`
2.  Commit the `dist` folder to Git (remove `dist` from `.gitignore` temporarily if needed, or use a separate "release" branch).
3.  On Server:
    *   Create a symlink from `public_html` to your build folder.
    *   **Backup existing public_html first!**
    ```bash
    cd ~
    # Remove default public_html if empty or backup
    mv public_html public_html_backup
    # Link dist folder to public_html
    ln -s repositories/chambal/frontend/dist public_html
    ```

### Option B: Build on Server (If Node.js is available)
1.  In cPanel Terminal:
    ```bash
    cd repositories/chambal/frontend
    npm install
    npm run build
    ```
2.  Copy or Symlink `dist` to `public_html`.
    ```bash
    rsync -av dist/ ~/public_html/
    ```

---

## Part 4: The Deployment Workflow

Once setup, here is your routine to deploy changes.

### Step 1: Push Changes (Local)
1.  Make code changes.
2.  (If using Option A) Run `npm run build` in `frontend/`.
3.  Commit and push:
    ```bash
    git add .
    git commit -m "Update feature X"
    git push origin main
    ```

### Step 2: Pull & Update (Server)
1.  Log in to cPanel Terminal (or SSH).
2.  Navigate to repo:
    ```bash
    cd repositories/chambal
    ```
3.  Pull changes:
    ```bash
    git pull origin main
    ```

### Step 3: Apply Updates
**For Backend Changes:**
1.  Activate virtualenv (if installing new packages):
    ```bash
    pip install -r backend/requirements.txt
    python backend/manage.py migrate
    python backend/manage.py collectstatic --noinput
    ```
2.  **Restart Python App**: Go to cPanel -> "Setup Python App" -> Click **Restart**.

**For Frontend Changes:**
*   If using **Symlink (Option A)**: No action needed! The `git pull` updated the files in `dist`, which `public_html` points to.
*   If using **Copy (Option B)**: Run the build and copy commands again.

---

## Summary Script (deploy.sh)

You can create a script `deploy.sh` on your server to automate Step 2 & 3:

```bash
#!/bin/bash

# 1. Pull latest code
cd ~/repositories/chambal
git pull origin main

# 2. Update Backend
source ~/virtualenv/backend/3.9/bin/activate  # Verify path
pip install -r backend/requirements.txt
python backend/manage.py migrate
python backend/manage.py collectstatic --noinput

# 3. Touch restart file (Restarts Passenger App)
touch backend/tmp/restart.txt

echo "Deployment Complete!"
```

Give it permission: `chmod +x deploy.sh`.
Now you just run `./deploy.sh` to deploy!
