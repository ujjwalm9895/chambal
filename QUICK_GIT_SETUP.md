# ⚡ Quick Git Setup (5 Minutes)

**Fast setup if Git is already installed.**

---

## 🚀 **Quick Commands**

```bash
# 1. Navigate to project
cd D:\chambal

# 2. Initialize Git (if not done)
git init

# 3. Configure Git (first time only)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 4. Add all files
git add .

# 5. Create first commit
git commit -m "Initial commit: Chambal Sandesh CMS"

# 6. Create repository on GitHub.com
# Go to: https://github.com/new
# Name: chambal-sandesh
# Click "Create repository"

# 7. Connect and push (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/chambal-sandesh.git
git branch -M main
git push -u origin main
```

---

## 🔐 **GitHub Authentication**

When pushing, use **Personal Access Token** as password:

1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Check `repo` scope
4. Copy token
5. Use token as password when pushing

---

**Done!** Your code is now on GitHub. Use it in deployment: `git clone https://github.com/YOUR_USERNAME/chambal-sandesh.git`
