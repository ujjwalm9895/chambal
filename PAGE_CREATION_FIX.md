# Page Creation Not Working - Fix Guide

## Problem
Cannot add pages at `http://localhost:3001/pages/new` - getting errors or page not saving.

## ✅ Fixes Applied

### 1. **Added Axios Interceptors** (`admin/src/contexts/AuthContext.tsx`)
- ✅ Automatically attaches JWT token to all API requests
- ✅ Handles 401 (Unauthorized) errors - auto redirects to login
- ✅ Ensures token is sent with every request

### 2. **Improved Error Handling** (`admin/src/pages/PageEditor.tsx`)
- ✅ Better validation messages
- ✅ Clear error messages for different scenarios
- ✅ Handles 401, 409 (conflict), and other errors

### 3. **Created Admin .env File**
- ✅ Created `admin/.env` with correct API URL

---

## 🔍 Troubleshooting Steps

### Step 1: Check Backend is Running

**Open Terminal 1:**
```bash
cd backend
npm run start:dev
```

**Expected Output:**
```
🚀 CMS Backend running on http://localhost:3000/api/v1
```

**If not running:**
- Check if port 3000 is in use
- Verify database connection in `backend/.env`
- Check for errors in terminal

---

### Step 2: Check Admin Panel Environment

**Verify `admin/.env` exists:**
```bash
cd admin
cat .env
```

**Should contain:**
```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_SITE_URL=http://localhost:3002
```

**If missing, create it:**
```bash
cd admin
echo "VITE_API_URL=http://localhost:3000/api/v1" > .env
echo "VITE_SITE_URL=http://localhost:3002" >> .env
```

**Restart admin panel after creating .env:**
```bash
# Stop admin (Ctrl+C)
# Then restart
npm run dev
```

---

### Step 3: Check You're Logged In

1. **Go to:** http://localhost:3001/login
2. **Login with:**
   - Email: `admin@cms.com`
   - Password: `admin123`

3. **Verify:**
   - Should redirect to Dashboard
   - Check browser console (F12) - no errors
   - Check Network tab - requests should have `Authorization: Bearer ...` header

---

### Step 4: Check Browser Console

**Open Browser DevTools (F12):**

1. **Console Tab:**
   - Look for red errors
   - Common errors:
     - `401 Unauthorized` → Not logged in or token expired
     - `Network Error` → Backend not running
     - `CORS Error` → Backend CORS not configured

2. **Network Tab:**
   - Go to Pages → New Page
   - Fill form and click Save
   - Check the POST request to `/pages`
   - **Status should be 201 (Created)** or 200 (OK)
   - **If 401:** You're not logged in
   - **If 500:** Backend error (check backend terminal)

---

### Step 5: Verify Database

**Check if database is accessible:**
```bash
cd backend
npm run prisma:db:push
```

**Should output:**
```
✅ Database schema synced
```

**If error:**
- Check `backend/.env` has correct `DATABASE_URL`
- Verify PostgreSQL is running
- Check database credentials

---

## 🐛 Common Errors & Solutions

### Error: "401 Unauthorized"

**Cause:** Not logged in or token expired

**Solution:**
1. Go to http://localhost:3001/login
2. Login again
3. Try creating page again

---

### Error: "Network Error" or "Failed to fetch"

**Cause:** Backend not running or wrong API URL

**Solution:**
1. Check backend is running on port 3000
2. Verify `admin/.env` has `VITE_API_URL=http://localhost:3000/api/v1`
3. Restart admin panel after changing .env

---

### Error: "Page with this slug already exists"

**Cause:** Slug is not unique

**Solution:**
- Choose a different slug
- Or edit the existing page with that slug

---

### Error: "Failed to save page" (no specific message)

**Cause:** Various backend issues

**Solution:**
1. Check backend terminal for errors
2. Verify database connection
3. Check backend logs
4. Try restarting backend

---

### Button is Disabled / Can't Click Save

**Cause:** Required fields not filled

**Solution:**
- Fill in **Title** field
- Fill in **Slug** field
- Both are required

---

## ✅ Verification Checklist

Before trying to create a page:

- [ ] Backend is running on http://localhost:3000
- [ ] Admin panel is running on http://localhost:3001
- [ ] You are logged in (not on login page)
- [ ] `admin/.env` file exists with correct `VITE_API_URL`
- [ ] Database is accessible
- [ ] No errors in browser console
- [ ] Title and Slug fields are filled

---

## 🧪 Test Steps

1. **Start Backend:**
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Start Admin:**
   ```bash
   cd admin
   npm run dev
   ```

3. **Login:**
   - Go to http://localhost:3001/login
   - Login: `admin@cms.com` / `admin123`

4. **Create Page:**
   - Go to Pages → New Page
   - Fill in:
     - Title: `Test Page`
     - Slug: `test-page`
     - Status: `DRAFT` or `PUBLISHED`
   - Click "Save Page"

5. **Expected Result:**
   - Should show "Page saved successfully!"
   - Should redirect to edit page
   - Page should appear in Pages list

---

## 🔧 Still Not Working?

1. **Clear Browser Cache:**
   - Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

2. **Check All Services:**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run start:dev
   
   # Terminal 2 - Admin
   cd admin && npm run dev
   ```

3. **Check Environment Variables:**
   ```bash
   # Backend
   cd backend
   cat .env
   
   # Admin
   cd admin
   cat .env
   ```

4. **Check Browser Console:**
   - Open DevTools (F12)
   - Check Console and Network tabs
   - Look for specific error messages

5. **Check Backend Logs:**
   - Look at backend terminal
   - Check for error messages
   - Verify API requests are received

---

**All fixes have been applied. Try creating a page now!** 🚀

If it still doesn't work, check the browser console (F12) and share the specific error message.
