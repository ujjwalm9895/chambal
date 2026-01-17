# 🚀 Quick Step-by-Step Testing Guide - Chambal Sandesh CMS

**Follow these exact steps in order to test everything!**

---

## ✅ STEP-BY-STEP TEST CHECKLIST

### 🔐 STEP 1: AUTHENTICATION (5 minutes)

1. ✅ **Start Servers:**
   - Backend: `cd backend && python manage.py runserver` (port 8000)
   - Frontend: `cd frontend && npm run dev` (port 3000)

2. ✅ **Test Login:**
   - Go to: `http://localhost:3000/cms/login`
   - Enter superuser credentials
   - ✅ Should redirect to dashboard
   - ✅ Check DevTools → Application → Local Storage:
     - `access_token` exists
     - `refresh_token` exists
     - `user` object exists

3. ✅ **Test Logout:**
   - Click user dropdown (top right)
   - Click "Logout"
   - ✅ Should clear localStorage and redirect to login

4. ✅ **Test Sidebar:**
   - Click hamburger button (☰) in topbar
   - ✅ Sidebar expands/collapses
   - ✅ User profile shows at top with initials and "online" status

---

### 📊 STEP 2: DASHBOARD (2 minutes)

1. ✅ **Verify Stats Cards:**
   - Visit: `http://localhost:3000/cms`
   - ✅ See 4 cards:
     - **Posts** (Teal) - Total posts
     - **Pending Posts** (Red) - Pending count
     - **Drafts** (Purple) - Draft count
     - **Scheduled Posts** (Yellow) - Scheduled count

2. ✅ **Test Clickable Cards:**
   - Click "Posts" card → ✅ Goes to `/cms/posts`
   - Click "Pending Posts" card → ✅ Goes to `/cms/posts?status=pending`
   - Click "Drafts" card → ✅ Goes to `/cms/posts?status=draft`

---

### 📂 STEP 3: CREATE CATEGORIES (5 minutes)

1. ✅ **Create Categories:**
   - Go to: `http://localhost:3000/cms/categories`
   - Click **"+ Add Category"**
   - Create these categories:
     ```
     Name: News
     Language: English
     Show in Menu: Yes
     Active: Yes
     ```
   - ✅ Click "Create Category"
   - ✅ Category appears in list

2. ✅ **Create More Categories:**
   - Create: **Sports** (English)
   - Create: **Entertainment** (English)
   - ✅ All appear in list

3. ✅ **Quick Test:**
   - ✅ Categories show language badge
   - ✅ Slug auto-generated
   - ✅ Menu order editable

---

### 📝 STEP 4: CREATE POSTS (10 minutes)

1. ✅ **Create First Post:**
   - Go to: `http://localhost:3000/cms/posts/new`
   - Fill form:
     ```
     Title: "Welcome to Chambal Sandesh"
     Category: Select "News"
     Language: English
     Content: <Type some text in rich text editor>
     Status: Published
     ```
   - ✅ Click "Save Post"
   - ✅ Redirected to posts list
   - ✅ Post appears in list

2. ✅ **Test Quick Category Creation:**
   - While creating post, click **"New Category"** button (next to category dropdown)
   - Fill modal:
     ```
     Name: Technology
     Language: English (auto-matches post language)
     ```
   - ✅ Click "Create Category"
   - ✅ Category auto-selected in post form

3. ✅ **Create More Posts:**
   - Create 3 more posts with different statuses:
     - Post 2: **Status = Draft**
     - Post 3: **Status = Pending**
     - Post 4: **Status = Published**, **Featured = Yes**, **Slider = Yes**

4. ✅ **Test Rich Text Editor:**
   - Edit a post
   - Use toolbar: Bold, Italic, H1, H2, Lists
   - ✅ Save and verify formatting preserved

5. ✅ **Test Post Filters:**
   - Go to `/cms/posts`
   - ✅ Click "All Posts" → Shows all
   - ✅ Click "Drafts" → Shows only drafts
   - ✅ Click "Pending" → Shows only pending
   - ✅ Click "Featured" → Shows featured posts

---

### 🔗 STEP 5: CREATE MENUS (5 minutes)

1. ✅ **Create Navbar Menu:**
   - Go to: `http://localhost:3000/cms/menus`
   - Click **"+ Add Menu Item"**
   - Fill form:
     ```
     Title: News
     Menu Type: Navbar
     Link Type: Category
     Category: Select "News"
     Order: 1
     Active: Yes
     ```
   - ✅ Click "Create Menu Item"

2. ✅ **Create More Menus:**
   - Create: **Sports** (Category link)
   - Create: **Contact** (External URL: `https://example.com/contact`)
   - ✅ All appear in menu list

3. ✅ **Test Dynamic Form:**
   - Change Link Type from "Category" to "URL"
   - ✅ Category field hides, External URL field shows
   - ✅ Form validation works

---

### 📄 STEP 6: CREATE PAGES (5 minutes)

1. ✅ **Create About Page:**
   - Go to: `http://localhost:3000/cms/pages`
   - Click **"Add Page"**
   - Fill form:
     ```
     Title: About Us
     Slug: about-us (auto-generated)
     SEO Title: About Us - Chambal Sandesh
     SEO Description: Learn about Chambal Sandesh
     Active: Yes
     ```
   - ✅ Click "Create Page"
   - ✅ Page appears in list

2. ✅ **Edit Page:**
   - Click edit icon (✏️) on "About Us"
   - ✅ Can modify fields
   - ✅ Save works

---

### 🏠 STEP 7: BUILD HOMEPAGE (10 minutes)

1. ✅ **Create Homepage Page:**
   - Go to: `/cms/pages`
   - Create page with:
     ```
     Title: Home
     Slug: home (IMPORTANT!)
     Active: Yes
     ```

2. ✅ **Add Homepage Sections:**
   - Go to: `/cms/homepage` OR edit home page
   - Add sections:

   **Hero Section:**
   - Section Type: `hero`
   - Data JSON:
     ```json
     {
       "title": "Welcome to Chambal Sandesh",
       "subtitle": "Your trusted news source",
       "cta_text": "Read News",
       "cta_link": "/posts"
     }
     ```
   - Order: 1

   **Article List Section:**
   - Section Type: `article_list`
   - Data JSON:
     ```json
     {
       "title": "Latest News",
       "limit": 6,
       "category": "news"
     }
     ```
   - Order: 2

3. ✅ **Test Homepage Rendering:**
   - Visit: `http://localhost:3000`
   - ✅ Hero section displays
   - ✅ Article list shows posts
   - ✅ No hardcoded content

---

### 🌐 STEP 8: TEST PUBLIC WEBSITE (10 minutes)

1. ✅ **Test Homepage:**
   - Visit: `http://localhost:3000`
   - ✅ Sections render from CMS
   - ✅ Navbar shows menu items
   - ✅ Footer displays

2. ✅ **Test Category Page:**
   - Visit: `http://localhost:3000/category/news`
   - ✅ Category name displays
   - ✅ Articles in category are listed
   - ✅ If no articles: Shows "No articles found in this category yet"

3. ✅ **Test Article Page:**
   - Click on any article from category page
   - Visit: `http://localhost:3000/article/[article-slug]`
   - ✅ Article title displays
   - ✅ Content renders with formatting
   - ✅ Category link works
   - ✅ Published date shows
   - ✅ View count increments

4. ✅ **Test Page Pages:**
   - Visit: `http://localhost:3000/page/about-us`
   - ✅ Page title displays
   - ✅ SEO meta tags correct (view page source: Ctrl+U)

5. ✅ **Test Menu Links:**
   - Click "News" in navbar
   - ✅ Goes to `/category/news`
   - ✅ All menu links work

---

### 👥 STEP 9: TEST USER MANAGEMENT (5 minutes) - Admin Only

1. ✅ **View Users:**
   - Go to: `/cms/users`
   - ✅ List of users displays
   - ✅ Shows role, email, status

2. ✅ **Create User:**
   - Click "Add User" (if implemented)
   - Create test user:
     ```
     Username: testwriter
     Email: test@example.com
     Role: Writer
     Password: testpass123
     ```
   - ✅ User created successfully

3. ✅ **Test Permissions:**
   - Logout
   - Login as testwriter
   - ✅ Can create posts
   - ✅ Cannot edit/delete other users' posts
   - ✅ Cannot access users page

---

### 🔍 STEP 10: TEST SEO (3 minutes)

1. ✅ **Check Meta Tags:**
   - Visit any article: `http://localhost:3000/article/[slug]`
   - Press `Ctrl+U` (View Page Source)
   - ✅ `<title>` tag matches SEO title
   - ✅ `<meta name="description">` matches SEO description
   - ✅ OpenGraph tags present

2. ✅ **Test Slug URLs:**
   - ✅ All URLs use slugs:
     - Articles: `/article/[slug]`
     - Categories: `/category/[slug]`
     - Pages: `/page/[slug]`

---

### 🐛 STEP 11: TEST ERROR HANDLING (5 minutes)

1. ✅ **Test Validation Errors:**
   - Try creating post without title
   - ✅ Shows error: "Title: This field is required"

2. ✅ **Test 404:**
   - Visit: `http://localhost:3000/article/non-existent-article`
   - ✅ Shows 404 page

3. ✅ **Test Unauthorized:**
   - Logout
   - Try accessing: `/cms/posts`
   - ✅ Redirects to login

---

## ✅ FINAL VERIFICATION CHECKLIST

After completing all steps, verify:

### CMS Features:
- ✅ Dashboard shows correct stats
- ✅ Can create/edit/delete posts
- ✅ Can create/edit/delete categories
- ✅ Can create/edit/delete menus
- ✅ Can create/edit/delete pages
- ✅ Homepage builder works
- ✅ Bulk upload works
- ✅ User management works (admin)

### Public Website:
- ✅ Homepage renders with sections
- ✅ Category pages show articles
- ✅ Article pages display correctly
- ✅ Page pages work
- ✅ Navigation menu works
- ✅ Footer menu works
- ✅ SEO tags correct

### Functionality:
- ✅ Post workflow (Draft → Pending → Published)
- ✅ Post flags (Featured, Slider, Breaking)
- ✅ Rich text editor works
- ✅ Image upload works
- ✅ Search/filter works
- ✅ Multi-language support

### Permissions:
- ✅ Writers can create posts/categories
- ✅ Editors can approve posts
- ✅ Admins have full access
- ✅ Protected routes work

---

## 🎯 QUICK TEST COMMANDS

### Start Backend:
```bash
cd backend
python manage.py runserver
```

### Start Frontend:
```bash
cd frontend
npm run dev
```

### Create Superuser (if needed):
```bash
cd backend
python manage.py createsuperuser
```

### Run Migrations (if needed):
```bash
cd backend
python manage.py migrate
```

---

## 📝 TESTING NOTES

- **Test Time**: ~60-70 minutes for complete testing
- **Browser**: Use Chrome/Edge with DevTools open
- **Console**: Check for JavaScript errors (F12)
- **Network**: Monitor API calls in Network tab
- **Storage**: Check LocalStorage in Application tab

---

## 🐞 COMMON ISSUES & FIXES

**Issue: Articles not showing on category page**
- ✅ Check posts are **Published** status
- ✅ Check `publish_at` date is not in future
- ✅ Check category is assigned to posts

**Issue: Homepage not rendering sections**
- ✅ Check homepage page slug is exactly `home`
- ✅ Check sections are active
- ✅ Check section order is set

**Issue: Menu links not working**
- ✅ Check menu items are active
- ✅ Check linked category/page exists and is active
- ✅ Check menu order is set

**Issue: Cannot create/edit (permission error)**
- ✅ Check user role (Writer/Editor/Admin)
- ✅ Superusers have full access
- ✅ Check browser console for error details

---

**✅ If all steps pass, your CMS is fully functional! 🎉**
