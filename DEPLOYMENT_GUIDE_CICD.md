# CI/CD Deployment Guide (GitHub Actions)

This guide explains how to automate your deployment so that every time you push to GitHub, your site updates automatically.

## 1. Prerequisites

1.  **GitHub Repository**: Your code must be on GitHub.
2.  **cPanel SSH Access**: You need SSH access enabled on your cPanel.
3.  **Server Setup**: You must have followed the initial server setup (cloning the repo to `~/repositories/chambal`).

## 2. Prepare the Server

Since we are now building the frontend in the cloud (GitHub) and pushing the artifacts, we need to make sure the server ignores the `dist` folder in git, but allows us to write to it.

1.  **Log in to cPanel Terminal**.
2.  **Stop tracking dist folder** (if you previously committed it):
    ```bash
    cd repositories/chambal
    git rm -r --cached frontend/dist
    echo "frontend/dist/" >> .gitignore
    git commit -m "Stop tracking dist on server"
    ```
    *(If you haven't committed `dist` before, you can skip this).*

3.  **Ensure Directory Exists**:
    ```bash
    mkdir -p repositories/chambal/frontend/dist
    ```

## 3. Configure GitHub Secrets

Go to your **GitHub Repository** -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**.

Add the following secrets:

| Name | Value | Description |
|------|-------|-------------|
| `CPANEL_HOST` | `yourdomain.com` | Your server IP or domain name. |
| `CPANEL_USERNAME` | `youruser` | Your cPanel username. |
| `CPANEL_SSH_KEY` | `-----BEGIN OPENSSH PRIVATE KEY----- ...` | The **Private Key** (id_rsa) from your local machine (or generate a new pair). **Do not share this!** |

**How to get the SSH Key:**
*   If you generated a key in the previous guide (`~/.ssh/id_rsa`), run `cat ~/.ssh/id_rsa` on your local machine (or cPanel if you generated it there) and copy the entire content.
*   **Important**: Ensure the corresponding Public Key (`id_rsa.pub`) is authorized in cPanel -> **SSH Access** -> **Manage SSH Keys** -> **Authorize**.

## 4. How It Works

The workflow file is located at `.github/workflows/deploy.yml`. Here is what it does:

1.  **Triggers** on every push to the `main` branch.
2.  **Builds Frontend**:
    *   Installs Node.js dependencies.
    *   Runs `npm run build` to generate the `dist` folder.
3.  **Deploys Frontend**:
    *   Uses `rsync` to upload the `dist` folder directly to `~/repositories/chambal/frontend/dist/` on your server.
    *   Since `public_html` is symlinked to this folder, your live site updates instantly.
4.  **Deploys Backend**:
    *   SSHs into the server.
    *   Runs `git pull` to update Python code.
    *   Installs requirements and runs migrations.
    *   Restarts the Python app (`touch passenger_wsgi.py`).

## 5. Troubleshooting

*   **Permission Denied (publickey)**:
    *   Check that `CPANEL_SSH_KEY` is correct.
    *   Ensure the public key is added to `~/.ssh/authorized_keys` on the server.
*   **Rsync failed**:
    *   Ensure the destination path `~/repositories/chambal/frontend/dist/` exists on the server.
*   **Python errors**:
    *   Check cPanel "Errors" log or the application log.
