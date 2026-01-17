# 🔧 Git Setup Guide for Chambal Sandesh CMS

**Complete guide to set up Git repository for your project.**

---

## 📋 **Step 1: Install Git (If Not Installed)**

### **Windows:**

1. **Download Git:**
   - Visit: https://git-scm.com/download/win
   - Download the latest version
   - Run the installer

2. **During Installation:**
   - Use default settings (recommended)
   - Choose your preferred editor
   - Select "Git from the command line and also from 3rd-party software"

3. **Verify Installation:**
   ```bash
   git --version
   ```
   Should show: `git version 2.x.x`

### **Alternative: Install via Package Manager**

**Using Chocolatey (if installed):**
```powershell
choco install git
```

**Using Winget:**
```powershell
winget install Git.Git
```

---

## 🔐 **Step 2: Configure Git (First Time Only)**

After installing Git, configure it with your information:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**Example:**
```bash
git config --global user.name "Ujjwal"
git config --global user.email "ujjwalm9895@example.com"
```

Verify configuration:
```bash
git config --list
```

---

## 📦 **Step 3: Initialize Git Repository**

Once Git is installed, run these commands:

### **1. Initialize Repository:**
```bash
cd D:\chambal
git init
```

### **2. Add All Files:**
```bash
git add .
```

### **3. Create Initial Commit:**
```bash
git commit -m "Initial commit: Chambal Sandesh CMS"
```

---

## 🚀 **Step 4: Create GitHub Repository**

### **Option A: Via GitHub Website**

1. **Login to GitHub:** https://github.com
2. **Click "+" (top right) → "New repository"**
3. **Repository Settings:**
   - **Name:** `chambal-sandesh` (or your preferred name)
   - **Description:** "Content Management System for Chambal Sandesh"
   - **Visibility:** 
     - 🔒 **Private** (recommended for production code)
     - 🌍 **Public** (if you want to share)
   - **DO NOT** check "Initialize with README" (we already have files)
   - **DO NOT** add .gitignore (we already have one)
4. **Click "Create repository"**

### **Option B: Via GitHub CLI (if installed)**

```bash
gh repo create chambal-sandesh --private --description "Content Management System for Chambal Sandesh"
```

---

## 🔗 **Step 5: Connect Local Repository to GitHub**

After creating the GitHub repository, GitHub will show you commands. Use these:

```bash
cd D:\chambal

# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/chambal-sandesh.git

# Or if using SSH:
# git remote add origin git@github.com:YOUR_USERNAME/chambal-sandesh.git

# Rename default branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/ujjwalm9895/chambal-sandesh.git
git branch -M main
git push -u origin main
```

---

## 🔐 **Step 6: GitHub Authentication**

When you push, you'll need to authenticate:

### **Option A: Personal Access Token (Recommended)**

1. **Generate Token:**
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - **Name:** `chambal-sandesh-deployment`
   - **Expiration:** Choose duration (90 days recommended)
   - **Scopes:** Check `repo` (full control)
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again!)

2. **Use Token:**
   - When prompted for password, paste the token instead

### **Option B: GitHub CLI**

```bash
gh auth login
```

Follow the prompts to authenticate.

### **Option C: SSH Keys (Advanced)**

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
```

---

## ✅ **Step 7: Verify Setup**

Check if everything is connected:

```bash
# Check remote repository
git remote -v

# Should show:
# origin  https://github.com/YOUR_USERNAME/chambal-sandesh.git (fetch)
# origin  https://github.com/YOUR_USERNAME/chambal-sandesh.git (push)

# Check status
git status

# View commits
git log --oneline
```

---

## 📝 **Step 8: Update Deployment Guide**

Once your repository is set up, update the deployment guide:

In `DEPLOYMENT_GUIDE_CPANEL.md`, line 189, change:
```bash
git clone https://github.com/yourusername/chambal-sandesh.git
```

To:
```bash
git clone https://github.com/YOUR_ACTUAL_USERNAME/chambal-sandesh.git
```

---

## 🔄 **Future Updates**

After making changes, commit and push:

```bash
# Check what changed
git status

# Add changes
git add .

# Commit with message
git commit -m "Description of changes"

# Push to GitHub
git push
```

---

## 🚨 **Important Files NOT in Git**

The `.gitignore` file ensures these are NOT uploaded:
- ✅ `.env` files (contains secrets)
- ✅ `venv/` (virtual environment)
- ✅ `node_modules/` (can be reinstalled)
- ✅ `*.sql` files (database backups)
- ✅ `media/` files (uploaded content)
- ✅ `staticfiles/` (generated files)

**⚠️ Never commit:**
- Database passwords
- API keys
- `.env` files
- Personal access tokens

---

## 📚 **Useful Git Commands**

```bash
# Check status
git status

# View changes
git diff

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo changes to a file
git checkout -- filename

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Merge branch
git merge feature-name

# Pull latest changes
git pull

# Push changes
git push
```

---

## 🎯 **Quick Setup Checklist**

- [ ] Git installed (`git --version` works)
- [ ] Git configured (name and email set)
- [ ] Repository initialized (`git init`)
- [ ] Files added (`git add .`)
- [ ] Initial commit made (`git commit`)
- [ ] GitHub repository created
- [ ] Remote added (`git remote add origin`)
- [ ] Pushed to GitHub (`git push -u origin main`)

---

## 🆘 **Troubleshooting**

### **Error: "git is not recognized"**
- Git not installed or not in PATH
- Solution: Install Git and restart terminal

### **Error: "Permission denied"**
- Authentication issue
- Solution: Use Personal Access Token or SSH keys

### **Error: "Repository not found"**
- Wrong repository URL or no access
- Solution: Check repository name and permissions

### **Error: "Large file detected"**
- GitHub has 100MB file limit
- Solution: Add large files to `.gitignore` or use Git LFS

---

## 📞 **Need Help?**

- **Git Documentation:** https://git-scm.com/doc
- **GitHub Docs:** https://docs.github.com
- **Git Cheat Sheet:** https://education.github.com/git-cheat-sheet-education.pdf

---

**Once Git is set up, you can use it for deployment as shown in the deployment guide!** 🚀
