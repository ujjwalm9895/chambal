# 🚀 Deployment Guide - cPanel Hosting

**Complete step-by-step guide to deploy Chambal Sandesh CMS to cPanel.**

---

## 📋 **Pre-Deployment Checklist**

Before deploying, ensure you have:
- ✅ cPanel hosting account with SSH access (preferred) or FTP
- ✅ MySQL database access (usually via phpMyAdmin)
- ✅ Python 3.8+ support on server
- ✅ Node.js 18+ support (for building frontend)
- ✅ Domain name configured in cPanel
- ✅ SSL certificate (free Let's Encrypt via cPanel)

---

## 🗄️ **Step 1: Database Setup (cPanel)**

### **1.1 Create MySQL Database**

1. **Login to cPanel**
2. **Go to "MySQL Databases"**
3. **Create Database:**
   - Database name: `yourusername_chambal` (cPanel adds prefix automatically)
   - Click "Create Database"
   - **Note the full database name** (e.g., `yourusername_chambal`)

4. **Create Database User:**
   - Username: `yourusername_chambal_user`
   - Password: Generate strong password (save it!)
   - Click "Create User"

5. **Add User to Database:**
   - Select user: `yourusername_chambal_user`
   - Select database: `yourusername_chambal`
   - Check "ALL PRIVILEGES"
   - Click "Make Changes"

6. **Note Database Details:**
   ```
   Database Name: yourusername_chambal
   Database User: yourusername_chambal_user
   Database Password: [your-password]
   Database Host: localhost (usually)
   ```

### **1.2 Import Database Schema (Optional - if you have existing data)**

If you have a database backup:
1. Go to **phpMyAdmin** in cPanel
2. Select your database
3. Click **Import** tab
4. Upload your `.sql` file
5. Click **Go**

**OR** - Just run migrations on fresh database (Step 3.5)

---

## 🔧 **Step 2: Prepare Backend for Production**

### **2.1 Create Production Settings File**

Create `backend/core/settings_production.py`:

```python
from .settings import *
from decouple import config
import os

# SECURITY: Disable debug in production
DEBUG = False

# Allowed hosts - Add your domain
ALLOWED_HOSTS = [
    'yourdomain.com',
    'www.yourdomain.com',
    'api.yourdomain.com',  # If using subdomain for API
]

# Database configuration - Use cPanel database details
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': config('DB_NAME'),  # yourusername_chambal
        'USER': config('DB_USER'),  # yourusername_chambal_user
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='3306'),
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Security settings
SECURE_SSL_REDIRECT = True  # Force HTTPS
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# CORS - Update with your domain
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]

# Email configuration (if sending emails)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = config('EMAIL_HOST', default='')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = True
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
```

### **2.2 Create Environment File**

Create `.env` file in `backend/` directory:

```env
# Django Settings
SECRET_KEY=your-super-secret-key-here-generate-random-string
DEBUG=False

# Allowed Hosts
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database
DB_NAME=yourusername_chambal
DB_USER=yourusername_chambal_user
DB_PASSWORD=your-database-password
DB_HOST=localhost
DB_PORT=3306

# Email (Optional)
EMAIL_HOST=smtp.yourhost.com
EMAIL_PORT=587
EMAIL_HOST_USER=noreply@yourdomain.com
EMAIL_HOST_PASSWORD=your-email-password
```

**⚠️ Important:** Generate a secure SECRET_KEY:
```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### **2.3 Update wsgi.py for Production**

Update `backend/core/wsgi.py`:

```python
import os
from django.core.wsgi import get_wsgi_application

# Use production settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings_production')

application = get_wsgi_application()
```

---

## 📦 **Step 3: Upload Backend Files**

### **3.1 Upload via FTP/SFTP or Git**

**Option A: Using FTP/SFTP (FileZilla, WinSCP, etc.)**
1. Connect to your cPanel FTP
2. Navigate to `public_html/` or create `api/` subdirectory
3. Upload entire `backend/` folder

**Option B: Using Git (if SSH access)**
```bash
# On server via SSH
cd ~
git clone https://github.com/yourusername/chambal-sandesh.git
cd chambal-sandesh
```

### **3.2 Recommended Directory Structure on cPanel:**

```
/home/yourusername/
├── public_html/          # Frontend (Next.js build output)
│   ├── .next/
│   └── ...
├── api/                  # Backend (Django)
│   ├── backend/
│   ├── .env
│   ├── requirements.txt
│   └── venv/
└── media/                # Shared media files (optional)
```

### **3.3 Set Up Python Virtual Environment (via SSH)**

```bash
# Navigate to backend directory
cd ~/api/backend  # or wherever you uploaded

# Create virtual environment
python3.8 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Install additional production dependencies
pip install gunicorn mysqlclient
```

**Note:** If `mysqlclient` fails, use:
```bash
pip install pymysql
# Then in settings.py, add at top:
# import pymysql
# pymysql.install_as_MySQLdb()
```

### **3.4 Configure Environment Variables**

Upload `.env` file to `backend/` directory with production values.

### **3.5 Run Database Migrations**

```bash
# Activate venv
source venv/bin/activate

# Run migrations
python manage.py migrate

# Create superuser (if needed)
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput
```

---

## 🌐 **Step 4: Configure Apache/Python App (cPanel)**

### **4.1 Option A: Using cPanel Python App**

1. **Go to cPanel → "Python App" or "Setup Python App"**
2. **Create Application:**
   - Python version: 3.8 or higher
   - App root: `api/backend`
   - App URL: `/api` or subdomain
   - Application startup file: `core/wsgi.py`
   - Application entry point: `application`
3. **Set Environment Variables:**
   ```
   DJANGO_SETTINGS_MODULE=core.settings_production
   ```
   Add all variables from `.env` file
4. **Click "Create"**

### **4.2 Option B: Using .htaccess (for Apache/mod_wsgi)**

Create `backend/.htaccess`:

```apache
RewriteEngine On
RewriteBase /

# Pass Authorization header
RewriteCond %{HTTP:Authorization} .
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

# Serve static files
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_URI} ^/static/(.*)$
RewriteRule ^static/(.*)$ /staticfiles/$1 [L]

# Serve media files
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_URI} ^/media/(.*)$
RewriteRule ^media/(.*)$ /media/$1 [L]

# Pass all other requests to Django
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /api/backend/core/wsgi.py/$1 [L]
```

### **4.3 Create passenger_wsgi.py (for Passenger/Phusion Passenger)**

If your cPanel uses Passenger, create `backend/passenger_wsgi.py`:

```python
import sys
import os

# Add project directory to path
sys.path.insert(0, os.path.dirname(__file__))

# Set environment variables
os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings_production'

# Import Django WSGI application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

---

## ⚛️ **Step 5: Deploy Frontend (Next.js)**

### **5.1 Build Frontend Locally**

On your local machine:

```bash
cd frontend

# Update API URL in lib/api.js and lib/cms-api.js
# Change localhost:8000 to your production API URL

# Install dependencies (if not done)
npm install

# Build for production
npm run build

# This creates .next/ directory with optimized files
```

### **5.2 Update API URLs**

Update `frontend/lib/api.js`:
```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.yourdomain.com';
```

Update `frontend/lib/cms-api.js`:
```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.yourdomain.com';
```

Create `frontend/.env.production`:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

Rebuild:
```bash
npm run build
```

### **5.3 Option A: Static Export (Recommended for cPanel)**

Update `frontend/next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Static export
  images: {
    unoptimized: true,  // Required for static export
  },
  trailingSlash: true,
}

module.exports = nextConfig
```

Rebuild:
```bash
npm run build
# Creates 'out/' directory
```

Upload `out/` directory contents to `public_html/`

### **5.4 Option B: Server-Side Rendering (SSR)**

If cPanel supports Node.js:

1. **Upload frontend files:**
   ```
   public_html/
   ├── .next/
   ├── public/
   ├── package.json
   └── ...
   ```

2. **Install dependencies:**
   ```bash
   cd ~/public_html
   npm install --production
   ```

3. **Start Next.js server:**
   ```bash
   npm start
   ```

4. **Use PM2 for process management:**
   ```bash
   npm install -g pm2
   pm2 start npm --name "nextjs" -- start
   pm2 save
   pm2 startup
   ```

### **5.5 Configure .htaccess for Frontend**

Create `public_html/.htaccess`:

```apache
RewriteEngine On
RewriteBase /

# Redirect www to non-www (optional)
# RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
# RewriteRule ^(.*)$ https://%1/$1 [R=301,L]

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle Next.js routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## 🔐 **Step 6: SSL Certificate Setup**

1. **Go to cPanel → "SSL/TLS Status"**
2. **Select your domain**
3. **Click "Run AutoSSL"** (free Let's Encrypt)
4. **Wait for SSL to be installed** (usually 5-10 minutes)
5. **Verify:** Visit `https://yourdomain.com`

---

## 🎯 **Step 7: Final Configuration**

### **7.1 Update CORS Settings**

In `backend/core/settings_production.py`, ensure CORS allows your frontend domain:

```python
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]
```

### **7.2 Create Media Directory**

```bash
cd ~/api/backend
mkdir -p media/posts media/posts/videos media/settings
chmod 755 media media/posts media/posts/videos media/settings
```

### **7.3 Set File Permissions**

```bash
# Backend
chmod 755 ~/api/backend
chmod 644 ~/api/backend/.env
chmod -R 755 ~/api/backend/media
chmod -R 755 ~/api/backend/staticfiles

# Frontend
chmod -R 755 ~/public_html
```

### **7.4 Test API Endpoint**

Visit: `https://api.yourdomain.com/api/homepage/`

Should return JSON response.

---

## 🧪 **Step 8: Testing Deployment**

### **8.1 Test Public Website:**
- ✅ Homepage loads: `https://yourdomain.com`
- ✅ Categories work: `https://yourdomain.com/category/news`
- ✅ Articles load: `https://yourdomain.com/article/some-article-slug`
- ✅ Images/media load correctly

### **8.2 Test CMS:**
- ✅ Login: `https://yourdomain.com/cms/login`
- ✅ Dashboard loads
- ✅ Create/edit posts
- ✅ Upload images/videos
- ✅ Manage categories, menus, pages

### **8.3 Test API:**
```bash
# Test public API
curl https://api.yourdomain.com/api/homepage/

# Test CMS API (with auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.yourdomain.com/api/cms/posts/
```

---

## 🔧 **Step 9: Troubleshooting**

### **Issue: 500 Internal Server Error**

**Check Django logs:**
```bash
# Via SSH
cd ~/api/backend
python manage.py check --deploy
```

**Check cPanel error logs:**
- cPanel → Errors → Latest Errors
- Look for Python/Django errors

**Common fixes:**
- Verify `.env` file exists and has correct values
- Check file permissions
- Ensure virtual environment is activated
- Verify database connection

### **Issue: Database Connection Failed**

**Check:**
1. Database name, user, password in `.env`
2. Database host (usually `localhost` for cPanel)
3. Database user has proper privileges
4. Firewall not blocking connection

**Test connection:**
```bash
python manage.py dbshell
```

### **Issue: Static Files Not Loading**

**Fix:**
```bash
cd ~/api/backend
python manage.py collectstatic --noinput --clear
```

**Check:**
- `STATIC_ROOT` path is correct
- `.htaccess` rules for static files
- File permissions (755 for directories, 644 for files)

### **Issue: Media Files Not Uploading**

**Check:**
- `MEDIA_ROOT` directory exists and is writable
- File permissions: `chmod 755 media/`
- Apache allows file uploads (check `upload_max_filesize` in php.ini)

### **Issue: CORS Errors**

**Fix:**
Update `CORS_ALLOWED_ORIGINS` in `settings_production.py` with exact domain (with https://)

### **Issue: Next.js Build Fails**

**Fix:**
- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (need 18+)
- Check for TypeScript errors

---

## 📝 **Step 10: Post-Deployment Tasks**

### **10.1 Create Superuser (if not done)**
```bash
cd ~/api/backend
source venv/bin/activate
python manage.py createsuperuser
```

### **10.2 Populate Initial Data**
```bash
python manage.py populate_dummy_data
python manage.py publish_all_posts
```

### **10.3 Set Up Backups**

**Database Backup (cPanel):**
1. Go to "Backup" in cPanel
2. Create full backup or just database backup
3. Download and store securely

**Automated Backups (cron job via cPanel):**
1. Go to "Cron Jobs"
2. Add daily backup:
   ```bash
   0 2 * * * mysqldump -u DB_USER -pDB_PASS DB_NAME > ~/backups/$(date +\%Y\%m\%d).sql
   ```

### **10.4 Monitor Performance**

**Check:**
- Server resource usage (CPU, RAM)
- Database size
- Media file storage
- Error logs regularly

---

## 🎉 **Deployment Complete!**

Your CMS should now be live at:
- **Website:** `https://yourdomain.com`
- **CMS Panel:** `https://yourdomain.com/cms/login`
- **API:** `https://api.yourdomain.com` (if using subdomain)

---

## 📞 **Quick Reference Commands**

```bash
# Activate virtual environment
source ~/api/backend/venv/bin/activate

# Run migrations
cd ~/api/backend && python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Create superuser
python manage.py createsuperuser

# Check Django setup
python manage.py check --deploy

# View Django logs
tail -f ~/logs/django.log

# Restart Python app (cPanel Python App)
# Use cPanel interface or touch passenger_wsgi.py
```

---

## 🔗 **Additional Resources**

- **cPanel Documentation:** https://docs.cpanel.net/
- **Django Deployment:** https://docs.djangoproject.com/en/4.2/howto/deployment/
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **MySQL cPanel Guide:** https://docs.cpanel.net/cpanel/databases/mysql-databases/

---

**Need Help?** Check the troubleshooting section or review server error logs in cPanel.

---

*Last Updated: Deployment guide for Chambal Sandesh CMS v1.0*
