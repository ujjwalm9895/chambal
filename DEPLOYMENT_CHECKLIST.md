# ✅ Deployment Checklist - Chambal Sandesh CMS

**Use this checklist to ensure successful deployment to cPanel.**

---

## 📋 **Pre-Deployment**

- [ ] Tested all features locally
- [ ] Database backup created (if migrating)
- [ ] Environment variables documented
- [ ] SECRET_KEY generated for production
- [ ] All sensitive data removed from code
- [ ] `DEBUG=False` in production settings

---

## 🗄️ **Database Setup**

- [ ] MySQL database created in cPanel
- [ ] Database user created with proper privileges
- [ ] Database credentials documented
- [ ] Database connection tested
- [ ] Migrations ready to run

---

## 🔧 **Backend Configuration**

- [ ] `settings_production.py` created
- [ ] `.env` file prepared with production values
- [ ] `ALLOWED_HOSTS` includes your domain
- [ ] Database credentials in `.env`
- [ ] `SECRET_KEY` set in `.env`
- [ ] `DEBUG=False`
- [ ] CORS origins updated
- [ ] SSL/HTTPS settings configured
- [ ] Static files path configured
- [ ] Media files path configured

---

## 📦 **Backend Deployment**

- [ ] Backend files uploaded to server
- [ ] Virtual environment created
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] Production dependencies installed (`gunicorn`, `mysqlclient`)
- [ ] `.env` file uploaded
- [ ] File permissions set correctly
- [ ] Python app configured in cPanel (or `.htaccess`/`passenger_wsgi.py`)
- [ ] Environment variables set in cPanel Python App

---

## 🗃️ **Database Migration**

- [ ] Migrations run successfully (`python manage.py migrate`)
- [ ] Superuser created (`python manage.py createsuperuser`)
- [ ] Static files collected (`python manage.py collectstatic`)
- [ ] Database schema verified
- [ ] Initial data populated (optional)

---

## ⚛️ **Frontend Configuration**

- [ ] API URLs updated in `lib/api.js`
- [ ] API URLs updated in `lib/cms-api.js`
- [ ] `.env.production` created with API URL
- [ ] Next.js config updated for production
- [ ] Frontend built successfully (`npm run build`)

---

## 🌐 **Frontend Deployment**

- [ ] Frontend files uploaded to `public_html/`
- [ ] `.htaccess` configured for routing
- [ ] Static assets loading correctly
- [ ] Images/media paths correct
- [ ] File permissions set (755 for dirs, 644 for files)

---

## 🔐 **Security & SSL**

- [ ] SSL certificate installed (AutoSSL or manual)
- [ ] HTTPS working (`https://yourdomain.com`)
- [ ] HTTP redirects to HTTPS
- [ ] Security headers configured
- [ ] `.env` file permissions set (644, not world-readable)
- [ ] Database credentials secure

---

## 🗂️ **Media & Static Files**

- [ ] Media directory created (`media/posts/`, `media/settings/`)
- [ ] Media directory writable (755 permissions)
- [ ] Static files directory configured
- [ ] Static files accessible via URL
- [ ] Media files accessible via URL
- [ ] Image uploads working
- [ ] Video uploads working

---

## 🧪 **Testing**

- [ ] **Public Website:**
  - [ ] Homepage loads
  - [ ] Categories page works
  - [ ] Individual articles load
  - [ ] Static pages load
  - [ ] Navigation menu works
  - [ ] Footer links work
  - [ ] Images display correctly
  - [ ] Videos play correctly

- [ ] **CMS Panel:**
  - [ ] Login page loads
  - [ ] Can login with superuser
  - [ ] Dashboard displays
  - [ ] Can create/edit posts
  - [ ] Can upload images/videos
  - [ ] Can manage categories
  - [ ] Can manage menus
  - [ ] Can manage pages
  - [ ] Can manage homepage sections
  - [ ] Can manage users (admin only)
  - [ ] Can update settings

- [ ] **API Endpoints:**
  - [ ] Public API works (`/api/homepage/`)
  - [ ] CMS API works with auth (`/api/cms/posts/`)
  - [ ] CORS headers correct
  - [ ] JWT authentication working

---

## 📊 **Performance & Optimization**

- [ ] Static files cached (via `.htaccess` or server config)
- [ ] Images optimized (compressed)
- [ ] Database indexes created (via migrations)
- [ ] Gzip compression enabled (check cPanel)
- [ ] Error logging configured
- [ ] Performance monitoring setup

---

## 🔄 **Backup & Maintenance**

- [ ] Database backup procedure documented
- [ ] Automated backups configured (cron job)
- [ ] Media files backup plan
- [ ] Recovery procedure documented
- [ ] Update procedure documented

---

## 📝 **Documentation**

- [ ] Deployment steps documented
- [ ] Environment variables documented
- [ ] Database credentials secured
- [ ] Admin login credentials secured
- [ ] Support/contact information updated

---

## 🎯 **Post-Deployment**

- [ ] All features tested in production
- [ ] Error logs checked (no critical errors)
- [ ] Performance acceptable
- [ ] Mobile responsiveness checked
- [ ] Browser compatibility checked
- [ ] SEO meta tags working
- [ ] Google Analytics/Facebook Pixel configured (if needed)

---

## 🚨 **Common Issues Checklist**

If something doesn't work, check:

- [ ] File permissions (755 for dirs, 644 for files)
- [ ] `.env` file exists and has correct values
- [ ] Virtual environment activated
- [ ] Database connection working
- [ ] Python version correct (3.8+)
- [ ] Node.js version correct (18+)
- [ ] SSL certificate installed
- [ ] CORS origins match exact domain
- [ ] Static files collected
- [ ] Media directory writable
- [ ] Apache/Python app restarted
- [ ] Error logs checked

---

## ✅ **Final Verification**

- [ ] Website accessible: `https://yourdomain.com`
- [ ] CMS accessible: `https://yourdomain.com/cms/login`
- [ ] API accessible: `https://api.yourdomain.com/api/homepage/`
- [ ] No console errors (browser DevTools)
- [ ] No server errors (cPanel error logs)
- [ ] All forms submitting correctly
- [ ] File uploads working
- [ ] User roles/permissions working

---

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Domain:** _______________  
**Status:** ☐ In Progress  ☐ Complete  ☐ Issues Found

---

*Use this checklist to ensure nothing is missed during deployment.*
