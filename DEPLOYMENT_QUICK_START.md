# ⚡ Quick Start Deployment Guide

**Fast deployment guide for experienced developers.**

---

## 🚀 **5-Minute Quick Deploy**

### **1. Database (cPanel)**
```
cPanel → MySQL Databases
→ Create DB: yourusername_chambal
→ Create User: yourusername_chambal_user
→ Grant ALL PRIVILEGES
→ Note credentials
```

### **2. Backend (SSH)**
```bash
# Upload backend/ to ~/api/backend/
cd ~/api/backend
python3.8 -m venv venv
source venv/bin/activate
pip install -r requirements.txt gunicorn mysqlclient

# Create .env file
nano .env
# [Paste production .env values]

# Setup
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput
mkdir -p media/posts media/posts/videos media/settings
chmod 755 media media/posts media/posts/videos media/settings
```

### **3. Frontend (Local Build)**
```bash
cd frontend

# Update API URLs in lib/api.js and lib/cms-api.js
# Change: localhost:8000 → https://api.yourdomain.com

# Build
npm run build

# Upload 'out/' to public_html/
```

### **4. cPanel Python App**
```
cPanel → Python App
→ Create App
→ Python: 3.8+
→ App Root: api/backend
→ Entry: core/wsgi.py
→ Set DJANGO_SETTINGS_MODULE=core.settings_production
→ Create
```

### **5. SSL & Test**
```
cPanel → SSL/TLS → AutoSSL
→ Visit: https://yourdomain.com
```

---

## 📝 **Environment Variables**

Create `backend/.env`:
```env
SECRET_KEY=[generate-random-key]
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DB_NAME=yourusername_chambal
DB_USER=yourusername_chambal_user
DB_PASSWORD=[db-password]
DB_HOST=localhost
```

---

## 🔧 **Required Files**

### **backend/core/settings_production.py**
```python
from .settings import *
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']
# ... (see full guide)
```

### **public_html/.htaccess**
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
```

---

## ✅ **Quick Test**

```bash
# API
curl https://api.yourdomain.com/api/homepage/

# Website
https://yourdomain.com

# CMS
https://yourdomain.com/cms/login
```

---

**Full Guide:** See `DEPLOYMENT_GUIDE_CPANEL.md` for detailed steps.
