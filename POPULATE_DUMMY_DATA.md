# 📦 Populate Dummy Data Guide - Chambal Sandesh CMS

This guide will help you quickly populate your database with comprehensive dummy data for testing.

---

## 🚀 Quick Start

### **Method 1: Using Django Management Command (Recommended)**

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Run the populate command:**
   ```bash
   python manage.py populate_dummy_data
   ```

3. **To clear existing data and repopulate:**
   ```bash
   python manage.py populate_dummy_data --clear
   ```

That's it! The command will create all dummy data automatically.

---

## 📋 What Gets Created

The script will populate your database with:

### **Users (2):**
- **Admin User:**
  - Username: `admin`
  - Password: `admin123`
  - Role: Admin
  - Email: `admin@chambalsandesh.com`

- **Editor User:**
  - Username: `editor1`
  - Password: `editor123`
  - Role: Editor
  - Email: `editor@chambalsandesh.com`

### **Categories (9):**

**English Categories:**
- News
- Sports
- Entertainment
- Technology
- Business
- Health

**Hindi Categories:**
- समाचार (News)
- खेल (Sports)
- मनोरंजन (Entertainment)

### **Posts (20+):**
- **English Posts (15):**
  - Mix of Draft, Pending, Published, and Scheduled posts
  - Various categories assigned
  - Some with Featured, Slider, Breaking flags
  - Different authors (admin and editor)

- **Hindi Posts (5):**
  - All Published
  - Hindi categories assigned
  - Featured and Slider flags

### **Menus (7):**

**Navbar Menus (4):**
- News → Links to News category
- Sports → Links to Sports category
- Entertainment → Links to Entertainment category
- Technology → Links to Technology category

**Footer Menus (3):**
- About Us → Links to About Us page
- Contact → External URL
- Privacy Policy → Links to Privacy Policy page

### **Pages (3):**
- **About Us** (`/page/about-us/`)
  - SEO optimized
  - Active

- **Privacy Policy** (`/page/privacy-policy/`)
  - SEO optimized
  - Active

- **Home** (`/page/home/`) - Homepage with sections
  - Has 3 sections:
    - Hero section
    - Latest News article list
    - Featured Stories section

---

## ✅ Verification Steps

After running the command, verify the data:

### **1. Check Dashboard:**
```
http://localhost:3000/cms
```
- ✅ Should show stats: Posts, Pending, Drafts, Scheduled counts

### **2. Check Posts:**
```
http://localhost:3000/cms/posts
```
- ✅ Should see 20+ posts with different statuses
- ✅ Filter by status should work

### **3. Check Categories:**
```
http://localhost:3000/cms/categories
```
- ✅ Should see 9 categories (6 English + 3 Hindi)

### **4. Check Menus:**
```
http://localhost:3000/cms/menus
```
- ✅ Should see 7 menu items (4 navbar + 3 footer)

### **5. Check Pages:**
```
http://localhost:3000/cms/pages
```
- ✅ Should see 3 pages (About Us, Privacy Policy, Home)

### **6. Check Public Website:**
```
http://localhost:3000
```
- ✅ Homepage should show hero section and article lists
- ✅ Navbar should have menu items
- ✅ Footer should have menu items

### **7. Test Category Pages:**
```
http://localhost:3000/category/news
```
- ✅ Should show posts in News category

### **8. Test Article Pages:**
- Click on any article from homepage or category page
- ✅ Should display article with formatting
- ✅ Category link should work

---

## 🔄 Clear and Repopulate

If you want to start fresh:

```bash
cd backend
python manage.py populate_dummy_data --clear
```

**Warning:** This will delete ALL existing data (posts, categories, menus, pages, sections).

---

## 📝 Customization

If you want to customize the dummy data:

1. **Edit the command file:**
   ```
   backend/cms/management/commands/populate_dummy_data.py
   ```

2. **Modify:**
   - Post titles (edit `post_titles_en` and `post_titles_hi` lists)
   - Categories (edit `categories_data` list)
   - Menu items (edit `navbar_menus` and `footer_menus` lists)
   - Pages (edit `pages_data` list)

3. **Run the command again:**
   ```bash
   python manage.py populate_dummy_data --clear
   ```

---

## 🐛 Troubleshooting

### **Issue: Command not found**
**Solution:**
- Make sure you're in the `backend` directory
- Ensure the file exists: `backend/cms/management/commands/populate_dummy_data.py`

### **Issue: Permission errors**
**Solution:**
- Make sure you have Django properly installed
- Check that migrations are applied: `python manage.py migrate`

### **Issue: Data not appearing**
**Solution:**
- Check backend server is running
- Check database connection
- Run migrations: `python manage.py migrate`
- Check Django admin to verify data was created

### **Issue: Cannot login with created users**
**Solution:**
- Usernames: `admin` and `editor1`
- Passwords: `admin123` and `editor123`
- Make sure backend server is running

---

## 📊 Expected Results After Population

After running the command, you should see:

```
✅ Dummy data population completed successfully!

📊 Summary:
   - Users: 2
   - Categories: 9
   - Posts: 20+
   - Menus: 7
   - Pages: 3
   - Page Sections: 3

🔑 Login Credentials:
   - Admin: username=admin, password=admin123
   - Editor: username=editor1, password=editor123
```

---

## 🎯 Next Steps

After populating dummy data:

1. ✅ **Login to CMS:**
   - Go to `http://localhost:3000/cms/login`
   - Login with: `admin` / `admin123`

2. ✅ **Start Testing:**
   - Follow the `STEP_BY_STEP_TESTING_GUIDE.md`
   - All features should have data to test with

3. ✅ **Verify Public Website:**
   - Visit `http://localhost:3000`
   - Should see homepage with articles
   - Navigate through categories and articles

---

**Happy Testing! 🚀**
