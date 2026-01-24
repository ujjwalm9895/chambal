# Quick Start - Test All Functionality

## 🚀 Start Services

### Terminal 1: Backend
```bash
cd backend
npm run start:dev
```
**Expected:** `🚀 CMS Backend running on http://localhost:3000/api/v1`

### Terminal 2: Admin Panel
```bash
cd admin
npm run dev
```
**Expected:** `Local: http://localhost:3001/`

### Terminal 3: Website
```bash
cd website
npm run dev
```
**Expected:** `Local: http://localhost:3002`

---

## ✅ Quick Test (5 minutes)

### 1. Login (30 seconds)
- Go to: http://localhost:3001/login
- Email: `admin@cms.com`
- Password: `admin123`
- Should redirect to Dashboard

### 2. Create Page (1 minute)
- Click: **Pages** → **New Page**
- Fill in:
  - Title: `My First Page`
  - Slug: `my-first-page`
  - Status: `PUBLISHED`
- Click: **Save Page**
- Should see: "Page saved successfully!"

### 3. Add Section (1 minute)
- Click: **Add Section**
- Choose: **HERO**
- Click: **Add**
- Click: **Edit** (on the section)
- Fill in:
  - Heading: `Welcome`
  - Subheading: `This is my first page`
  - Button Text: `Get Started`
- Click: **Save**

### 4. View on Website (30 seconds)
- Go to: http://localhost:3002/my-first-page
- Should see: Your page with HERO section!

### 5. Test More Features (2 minutes)
- **Add TEXT section** with rich text content
- **Reorder sections** by dragging
- **Upload media** in Media Library
- **Create menu** in Menus section

---

## ✅ All Features Working

✅ **Authentication** - Login/Logout  
✅ **Page Creation** - Create, Edit, Delete  
✅ **Section Management** - Add, Edit, Delete, Reorder  
✅ **5 Section Types** - HERO, TEXT, IMAGE, CTA, FAQ  
✅ **Media Upload** - Upload and manage images  
✅ **Menu Management** - Create header/footer menus  
✅ **Website Display** - Published pages visible  
✅ **SEO Settings** - Title and description  
✅ **Rich Text Editor** - For TEXT sections  
✅ **Drag & Drop** - Reorder sections  

---

## 🐛 If Something Doesn't Work

1. **Check Backend:**
   ```bash
   curl http://localhost:3000/api/v1/pages
   ```
   Should return JSON (or empty array)

2. **Check Browser Console (F12):**
   - Look for red errors
   - Check Network tab for failed requests

3. **Verify Login:**
   - Make sure you're logged in
   - Token should be in localStorage

4. **Check Environment:**
   ```bash
   # Backend
   cat backend/.env
   
   # Admin
   cat admin/.env
   
   # Website
   cat website/.env.local
   ```

---

**Everything is ready to test! Follow the steps above. 🎉**
