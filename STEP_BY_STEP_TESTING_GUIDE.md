# 🧪 Complete Step-by-Step Testing Guide - Chambal Sandesh CMS

This is a **comprehensive, step-by-step guide** to test **EVERY feature** of the Chambal Sandesh CMS system. Follow each step in order.

---

## 📋 **SETUP & PREREQUISITES**

### **Step 0: Verify Prerequisites**

1. ✅ **Backend running?**
   - Open terminal in `backend/` folder
   - Run: `python manage.py runserver`
   - Should show: `Starting development server at http://127.0.0.1:8000/`

2. ✅ **Frontend running?**
   - Open terminal in `frontend/` folder
   - Run: `npm run dev`
   - Should show: `Ready on http://localhost:3000`

3. ✅ **Database migrated?**
   - Run: `python manage.py migrate`
   - Should show: `Operations to perform: Apply all migrations...`

4. ✅ **Superuser created?**
   - Run: `python manage.py createsuperuser`
   - Remember username and password!

---

## 🔐 **1. AUTHENTICATION TESTING**

### **Step 1.1: Test Login Page**

1. Navigate to: `http://localhost:3000/cms/login`
2. **Verify page loads:**
   - ✅ Login form visible
   - ✅ Username field
   - ✅ Password field
   - ✅ Submit button

### **Step 1.2: Test Invalid Login**

1. Enter **wrong** credentials:
   - Username: `wronguser`
   - Password: `wrongpass`
2. Click "Login"
3. **Expected:** Error message appears (e.g., "Invalid credentials")
4. **Expected:** Stay on login page

### **Step 1.3: Test Valid Login**

1. Enter **correct** superuser credentials
2. Click "Login"
3. **Expected:** Redirects to `/cms` (dashboard)
4. **Expected:** Dashboard visible with stat cards

### **Step 1.4: Verify Token Storage**

1. Open **Browser DevTools** (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click **Local Storage** → `http://localhost:3000`
4. **Verify these keys exist:**
   - ✅ `access_token` - JWT token (long string)
   - ✅ `refresh_token` - JWT token (long string)
   - ✅ `user` - JSON object with user data

### **Step 1.5: Test Protected Routes**

1. Open new tab (or incognito)
2. Navigate directly to: `http://localhost:3000/cms/posts`
3. **Expected:** Redirects to `/cms/login`
4. **Expected:** Cannot access without login

### **Step 1.6: Test Sidebar Navigation**

1. **Check sidebar state:**
   - ✅ Sidebar visible on left
   - ✅ Shows menu items (Home, Posts, Categories, etc.)

2. **Test hamburger toggle:**
   - Click hamburger button (☰) in topbar
   - ✅ Sidebar expands (shows full labels)
   - Click again
   - ✅ Sidebar collapses (icon-only)

3. **Verify user profile section:**
   - ✅ User avatar with initials visible
   - ✅ Username/name displayed
   - ✅ Green "online" indicator dot

4. **Test navigation items:**
   - Click each menu item
   - ✅ All links work correctly

### **Step 1.7: Test Logout**

1. Click **user avatar** in topbar (top right)
2. Click **"Logout"** in dropdown
3. **Expected:** Redirects to `/cms/login`
4. **Expected:** LocalStorage cleared (check DevTools)
5. **Expected:** Cannot access `/cms` routes anymore

---

## 📊 **2. DASHBOARD TESTING**

### **Step 2.1: Login and View Dashboard**

1. Login again with superuser credentials
2. Navigate to: `http://localhost:3000/cms`
3. **Verify dashboard loads:**
   - ✅ Page title "Dashboard"
   - ✅ 4 stat cards visible

### **Step 2.2: Verify Stat Cards**

**Check each card displays correctly:**

1. **Posts Card (Teal/Blue):**
   - ✅ Icon: FileText
   - ✅ Title: "Posts"
   - ✅ Number: Shows total posts count
   - ✅ Color: Teal background

2. **Pending Posts Card (Red):**
   - ✅ Icon: Clock
   - ✅ Title: "Pending Posts"
   - ✅ Number: Shows pending posts count
   - ✅ Color: Red background

3. **Drafts Card (Purple):**
   - ✅ Icon: Edit
   - ✅ Title: "Drafts"
   - ✅ Number: Shows draft posts count
   - ✅ Color: Purple background

4. **Scheduled Posts Card (Yellow):**
   - ✅ Icon: Clock
   - ✅ Title: "Scheduled Posts"
   - ✅ Number: Shows scheduled posts count
   - ✅ Color: Yellow background

### **Step 2.3: Test Clickable Cards**

1. Click **"Posts"** card
   - ✅ Navigates to `/cms/posts`
   - ✅ Shows all posts

2. Go back to dashboard (`/cms`)
3. Click **"Pending Posts"** card
   - ✅ Navigates to `/cms/posts?status=pending`
   - ✅ Shows only pending posts

4. Go back to dashboard
5. Click **"Drafts"** card
   - ✅ Navigates to `/cms/posts?status=draft`
   - ✅ Shows only draft posts

6. Go back to dashboard
7. Click **"Scheduled Posts"** card
   - ✅ Navigates to `/cms/posts?status=scheduled`
   - ✅ Shows only scheduled posts

---

## 📝 **3. POSTS MANAGEMENT TESTING**

### **Step 3.1: View Posts List**

1. Navigate to: `http://localhost:3000/cms/posts`
2. **Verify:**
   - ✅ Table/list of posts visible
   - ✅ Columns: Title, Category, Status, Date, etc.
   - ✅ "Create Post" or "Add Post" button visible

### **Step 3.2: Create New Post**

1. Click **"Add Post"** or navigate to `/cms/posts/new`
2. **Fill in post form:**
   - ✅ Title: `Test Post 1`
   - ✅ Category: Select a category (or leave empty)
   - ✅ Language: Select "English"
   - ✅ Content: Type some text in rich text editor
   - ✅ Excerpt: `This is a test post excerpt`
   - ✅ Status: Select "Draft"
   - ✅ Leave all other fields default

3. **Test Rich Text Editor:**
   - ✅ Type text
   - ✅ Format text (bold, italic)
   - ✅ Add headings
   - ✅ Editor responds to formatting

4. Click **"Save"** or "Create Post"
5. **Expected:** Success message appears
6. **Expected:** Redirects to `/cms/posts`
7. **Expected:** New post appears in list

### **Step 3.3: Create Post with Category**

1. Click **"Add Post"** again
2. **Fill form:**
   - Title: `Test Post 2 - With Category`
   - Category: Select existing category
   - Content: `This post has a category`
   - Status: `Draft`
   - ✅ Category dropdown works
   - ✅ Can select category

3. Click **"Save"**
4. **Expected:** Post saved with category assigned

### **Step 3.4: Create Category from Post Editor**

1. Click **"Add Post"**
2. In Category field, click **"+" button** (Create New Category)
3. **Category modal opens:**
   - ✅ Modal appears
   - ✅ Form fields visible

4. **Fill category form:**
   - Name: `News`
   - Slug: Auto-generates (should be `news`)
   - Language: `English`
   - Show in Menu: ✅ Checked
   - Active: ✅ Checked

5. Click **"Create Category"**
6. **Expected:** Modal closes
7. **Expected:** Success message
8. **Expected:** Category auto-selected in post form
9. **Expected:** New category appears in dropdown

### **Step 3.5: Edit Existing Post**

1. Go to `/cms/posts`
2. Find a post in the list
3. Click **"Edit"** button or click post title
4. **Verify edit form:**
   - ✅ All fields populated with existing data
   - ✅ Rich text editor shows existing content

5. **Make changes:**
   - Change title: `Updated Test Post`
   - Change status: `Pending`
   - Add more content

6. Click **"Save"**
7. **Expected:** Success message
8. **Expected:** Changes saved
9. **Expected:** Post list shows updated data

### **Step 3.6: Test Post Status Workflow**

1. Create a new post with status **"Draft"**
   - ✅ Saves as draft
   - ✅ Appears in drafts filter

2. Edit same post, change status to **"Pending"**
   - ✅ Status updates
   - ✅ Appears in pending filter

3. Edit again, change status to **"Published"**
   - ✅ Status updates
   - ✅ Appears in published list
   - ✅ Appears on public website

### **Step 3.7: Test Post Flags (Featured, Slider, Breaking)**

1. Edit a post (or create new)
2. **Test checkboxes:**
   - ✅ Featured: Check/uncheck works
   - ✅ Slider: Check/uncheck works
   - ✅ Breaking: Check/uncheck works
   - ✅ Recommended: Check/uncheck works

3. Save post with flags checked
4. **Expected:** Flags saved
5. **Expected:** Post appears in filtered lists (e.g., featured posts)

### **Step 3.8: Test Scheduled Posts**

1. Create/edit a post
2. Set **Status:** `Scheduled`
3. Set **Publish At:** Tomorrow's date/time
4. Click **"Save"**
5. **Expected:** Post saved with scheduled date
6. **Expected:** Appears in scheduled posts filter
7. **Expected:** Does NOT appear on public site until publish date

### **Step 3.9: Test Post Filters**

1. Go to `/cms/posts`
2. **Test status filter:**
   - Click "Drafts" filter (if exists)
   - ✅ Shows only draft posts
   - Click "Pending" filter
   - ✅ Shows only pending posts

3. **Test feature filters:**
   - Filter by "Featured"
   - ✅ Shows only featured posts
   - Filter by "Slider"
   - ✅ Shows only slider posts
   - Filter by "Breaking"
   - ✅ Shows only breaking posts

### **Step 3.10: Test Post Search**

1. Go to `/cms/posts`
2. Use search box (if available)
3. Enter search term: `test`
4. **Expected:** Filters posts by search term
5. **Expected:** Shows matching posts only

### **Step 3.11: Test Delete Post**

1. Go to `/cms/posts`
2. Find a post you can delete (test post)
3. Click **"Delete"** button
4. **Expected:** Confirmation dialog (if implemented)
5. Confirm deletion
6. **Expected:** Success message
7. **Expected:** Post removed from list

### **Step 3.12: Test Bulk Upload**

1. Navigate to: `/cms/posts/upload`
2. **Verify upload page:**
   - ✅ File upload field visible
   - ✅ Instructions/documentation visible

3. **Create test CSV:**
   - Create CSV file with columns: `title`, `content`, `category`
   - Add 2-3 rows of test data

4. **Upload CSV:**
   - Select CSV file
   - Click "Upload"
   - **Expected:** Success message
   - **Expected:** Posts created from CSV

5. **Verify posts:**
   - Go to `/cms/posts`
   - ✅ New posts appear in list

---

## 🗂️ **4. CATEGORIES MANAGEMENT TESTING**

### **Step 4.1: View Categories List**

1. Navigate to: `http://localhost:3000/cms/categories`
2. **Verify:**
   - ✅ Table/list of categories visible
   - ✅ Shows: Name, Language, Status, etc.
   - ✅ "Create Category" button visible

### **Step 4.2: Create English Category**

1. Click **"Create Category"**
2. **Fill form:**
   - Name: `Sports`
   - Slug: Leave empty (auto-generates)
   - Language: `English`
   - Show in Menu: ✅ Checked
   - Menu Order: `0`
   - Active: ✅ Checked

3. Click **"Save"**
4. **Expected:** Success message
5. **Expected:** Slug auto-generated (should be `sports`)
6. **Expected:** Category appears in list

### **Step 4.3: Create Hindi Category**

1. Click **"Create Category"** again
2. **Fill form:**
   - Name: `खेल` (or `Khel` - Hindi for Sports)
   - Slug: Leave empty
   - Language: `Hindi`
   - Show in Menu: ✅ Checked
   - Active: ✅ Checked

3. Click **"Save"**
4. **Expected:** Success message
5. **Expected:** Category saved with Hindi language
6. **Expected:** Can have same slug as English category (different language)

### **Step 4.4: Test Slug Auto-Generation**

1. Create category with name: `Technology News`
2. Leave slug empty
3. Click **"Save"**
4. **Expected:** Slug auto-generated as `technology-news`
5. **Expected:** Slug uses lowercase, spaces become hyphens

### **Step 4.5: Test Slug Uniqueness (Same Language)**

1. Try to create category:
   - Name: `Tech`
   - Slug: `technology-news` (same as previous)
   - Language: `English`

2. Click **"Save"**
3. **Expected:** Error message (slug already exists for English)
4. **Expected:** Slug auto-adjusted (e.g., `technology-news-1`)

### **Step 4.6: Test Slug Uniqueness (Different Language)**

1. Create category:
   - Name: `Technology`
   - Slug: `technology-news`
   - Language: `Hindi`

2. Click **"Save"**
3. **Expected:** ✅ Success! Same slug allowed for different language
4. **Expected:** Both English and Hindi categories with same slug exist

### **Step 4.7: Edit Category**

1. Go to `/cms/categories`
2. Click **"Edit"** on a category
3. **Make changes:**
   - Change name
   - Change menu order
   - Toggle "Show in Menu"

4. Click **"Save"**
5. **Expected:** Changes saved
6. **Expected:** Updated data in list

### **Step 4.8: Test Category Permissions (Writers)**

**Note:** If you're logged in as superuser, create a writer user first (see User Management section)

1. Logout
2. Login as **writer** user
3. Go to `/cms/categories`
4. **Expected:** ✅ Can VIEW categories
5. **Expected:** ✅ Can CREATE categories
6. Click **"Edit"** on existing category
7. **Expected:** ❌ Cannot edit (permission denied)
8. Click **"Delete"** on category
9. **Expected:** ❌ Cannot delete (permission denied)

### **Step 4.9: Test Category in Post Editor**

1. Go to `/cms/posts/new`
2. In Category dropdown
3. **Expected:** ✅ All active categories appear
4. **Expected:** ✅ Categories grouped by language (if implemented)
5. Select a category
6. **Expected:** Category selected correctly

### **Step 4.10: Delete Category**

1. Go to `/cms/categories`
2. Find a test category
3. Click **"Delete"** button
4. **Expected:** Confirmation (if implemented)
5. Confirm
6. **Expected:** Success message
7. **Expected:** Category removed from list
8. **Expected:** Posts with this category still exist (category set to null)

---

## 🎯 **5. MENUS MANAGEMENT TESTING**

### **Step 5.1: View Menus List**

1. Navigate to: `http://localhost:3000/cms/menus`
2. **Verify:**
   - ✅ Table/list of menus visible
   - ✅ Shows: Title, Menu Type, Link Type, Order, etc.
   - ✅ "Create Menu" button visible

### **Step 5.2: Create Navbar Menu (Category Link)**

1. Click **"Create Menu"**
2. **Fill form:**
   - Title: `News`
   - Menu Type: `Navbar`
   - Link Type: `Category`
   - Category: Select "News" category (created earlier)
   - Order: `1`
   - Active: ✅ Checked

3. **Verify dynamic fields:**
   - ✅ Category dropdown appears (when Link Type = Category)
   - ✅ Page field hidden
   - ✅ External URL field hidden

4. Click **"Save"**
5. **Expected:** Success message
6. **Expected:** Menu item appears in list

### **Step 5.3: Create Navbar Menu (Page Link)**

1. Click **"Create Menu"** again
2. **Fill form:**
   - Title: `About`
   - Menu Type: `Navbar`
   - Link Type: `Page`
   - Page: Select a page (or create one first)
   - Order: `2`
   - Active: ✅ Checked

3. **Verify dynamic fields:**
   - ✅ Page dropdown appears (when Link Type = Page)
   - ✅ Category field hidden
   - ✅ External URL field hidden

4. Click **"Save"**
5. **Expected:** Success message

### **Step 5.4: Create Footer Menu (External URL)**

1. Click **"Create Menu"** again
2. **Fill form:**
   - Title: `Contact Us`
   - Menu Type: `Footer`
   - Link Type: `External URL`
   - External URL: `https://example.com/contact`
   - Order: `1`
   - Active: ✅ Checked

3. **Verify dynamic fields:**
   - ✅ External URL field appears (when Link Type = URL)
   - ✅ Category field hidden
   - ✅ Page field hidden

4. Click **"Save"**
5. **Expected:** Success message

### **Step 5.5: Test Menu Ordering**

1. Create multiple menu items with different orders
2. Go to `/cms/menus`
3. **Expected:** ✅ Menus sorted by order
4. Edit a menu item, change order number
5. **Expected:** ✅ Menu position updates in list

### **Step 5.6: Test Menu Permissions**

1. Login as **writer** user
2. Go to `/cms/menus`
3. **Expected:** ✅ Can VIEW menus
4. **Expected:** ❌ Cannot CREATE (permission denied)
5. **Expected:** ❌ Cannot EDIT (permission denied)
6. **Expected:** ❌ Cannot DELETE (permission denied)

### **Step 5.7: Edit Menu**

1. Go to `/cms/menus`
2. Click **"Edit"** on a menu item
3. **Make changes:**
   - Change title
   - Change order
   - Change link type (Category → Page, etc.)

4. **Verify dynamic fields update:**
   - ✅ Fields change based on Link Type selection

5. Click **"Save"**
6. **Expected:** Changes saved

### **Step 5.8: Delete Menu**

1. Go to `/cms/menus`
2. Find a test menu item
3. Click **"Delete"**
4. **Expected:** Success message
5. **Expected:** Menu removed from list

### **Step 5.9: Verify Menus on Public Site**

1. Go to public website: `http://localhost:3000`
2. **Check navbar:**
   - ✅ Navbar menus appear
   - ✅ Click "News" menu
   - ✅ Navigates to `/category/news`

3. **Check footer:**
   - ✅ Footer menus appear
   - ✅ Click footer menu link
   - ✅ Opens correct URL (category/page/external)

---

## 📄 **6. PAGES MANAGEMENT TESTING**

### **Step 6.1: View Pages List**

1. Navigate to: `http://localhost:3000/cms/pages`
2. **Verify:**
   - ✅ Table/list of pages visible
   - ✅ Shows: Title, Slug, Sections Count, etc.
   - ✅ "Create Page" button visible

### **Step 6.2: Create Simple Page**

1. Click **"Create Page"**
2. **Fill form:**
   - Title: `About Us`
   - Slug: Leave empty (auto-generates)
   - SEO Title: `About Us - Chambal Sandesh`
   - SEO Description: `Learn more about Chambal Sandesh`
   - Active: ✅ Checked

3. Click **"Save"**
4. **Expected:** Success message
5. **Expected:** Slug auto-generated as `about-us`
6. **Expected:** Page appears in list

### **Step 6.3: Edit Page**

1. Click **"Edit"** on the page
2. **Verify:**
   - ✅ All fields populated
   - ✅ Can see sections section (if any)

3. **Make changes:**
   - Update SEO title
   - Update SEO description

4. Click **"Save"**
5. **Expected:** Changes saved

### **Step 6.4: Delete Page**

1. Find a test page
2. Click **"Delete"**
3. **Expected:** Success message
4. **Expected:** Page removed from list

### **Step 6.5: Verify Page on Public Site**

1. Go to: `http://localhost:3000/page/about-us`
2. **Expected:**
   - ✅ Page title displays
   - ✅ SEO meta tags correct (check page source)
   - ✅ Sections render (if any added)

---

## 🏠 **7. HOMEPAGE BUILDER TESTING**

### **Step 7.1: Navigate to Homepage Builder**

1. Go to: `http://localhost:3000/cms/homepage`
2. **Verify:**
   - ✅ Page loads
   - ✅ Shows "Select or Create Homepage Page"
   - ✅ Dropdown or form for page selection

### **Step 7.2: Create Homepage Page**

1. **If page doesn't exist:**
   - Create a page with slug: `home`
   - Title: `Homepage`
   - Save it

2. **In Homepage Builder:**
   - Select "home" page from dropdown
   - Or create new page with slug "home"
   - Click "Select" or "Save"

3. **Expected:** ✅ Homepage page selected
4. **Expected:** ✅ Section management interface appears

### **Step 7.3: Add Hero Section**

1. Click **"Add Section"** or "+" button
2. Select **Section Type:** `Hero`
3. **Fill hero data:**
   - Title: `Welcome to Chambal Sandesh`
   - Subtitle: `Your trusted source for news`
   - Image: Upload or enter image URL (optional)
   - CTA Text: `Read More`
   - CTA Link: `/articles`

4. Set **Order:** `1`
5. **Active:** ✅ Checked
6. Click **"Save Section"**
7. **Expected:** ✅ Hero section added to list
8. **Expected:** ✅ Appears in sections list with order 1

### **Step 7.4: Add Slider Section**

1. Click **"Add Section"** again
2. Select **Section Type:** `Slider`
3. **Fill slider data:**
   - Title: `Featured Stories`
   - Select posts: Choose slider posts (or leave for dynamic)
   - Limit: `5`

4. Set **Order:** `2`
5. **Active:** ✅ Checked
6. Click **"Save Section"**
7. **Expected:** ✅ Slider section added

### **Step 7.5: Add Article List Section**

1. Click **"Add Section"** again
2. Select **Section Type:** `Article List`
3. **Fill article list data:**
   - Title: `Latest News`
   - Category: Select a category (or leave for all)
   - Limit: `6`
   - Featured: Unchecked (or checked if wanted)

4. Set **Order:** `3`
5. **Active:** ✅ Checked
6. Click **"Save Section"**
7. **Expected:** ✅ Article List section added

### **Step 7.6: Add Banner Section**

1. Click **"Add Section"** again
2. Select **Section Type:** `Banner`
3. **Fill banner data:**
   - Title: `Special Offer`
   - Content: `Check out our special features`
   - Image: Optional
   - Link: Optional URL
   - Style: `Primary`

4. Set **Order:** `4`
5. **Active:** ✅ Checked
6. Click **"Save Section"**
7. **Expected:** ✅ Banner section added

### **Step 7.7: Add HTML Section**

1. Click **"Add Section"** again
2. Select **Section Type:** `HTML`
3. **Fill HTML data:**
   - HTML: `<div><h3>Custom Content</h3><p>This is custom HTML</p></div>`

4. Set **Order:** `5`
5. **Active:** ✅ Checked
6. Click **"Save Section"**
7. **Expected:** ✅ HTML section added

### **Step 7.8: Test Section Ordering**

1. **Verify sections list:**
   - ✅ Sections shown in order (1, 2, 3, 4, 5)

2. **Change order:**
   - Edit a section
   - Change order number (e.g., change order 3 to order 1)
   - Save

3. **Expected:** ✅ Sections reordered in list
4. **Expected:** ✅ Order updates correctly

### **Step 7.9: Edit Section**

1. Click **"Edit"** on a section
2. **Make changes:**
   - Update title
   - Update data fields
   - Change order

3. Click **"Save"**
4. **Expected:** ✅ Changes saved

### **Step 7.10: Delete Section**

1. Find a test section
2. Click **"Delete"**
3. **Expected:** Success message
4. **Expected:** Section removed from list

### **Step 7.11: Toggle Section Active/Inactive**

1. Edit a section
2. Uncheck **"Active"**
3. Save
4. **Expected:** ✅ Section marked as inactive
5. **Expected:** ✅ Does not render on public homepage

### **Step 7.12: Verify Homepage on Public Site**

1. Go to: `http://localhost:3000`
2. **Verify sections render:**
   - ✅ Hero section appears first (if order 1)
   - ✅ Slider section appears (if added)
   - ✅ Article List section shows latest posts
   - ✅ Banner section displays
   - ✅ HTML section renders custom HTML
   - ✅ All sections in correct order

3. **Verify navigation:**
   - ✅ Navbar visible at top
   - ✅ Footer visible at bottom
   - ✅ Menu items work

4. **Verify content:**
   - ✅ No hardcoded content
   - ✅ All content comes from CMS
   - ✅ Sections load dynamically

---

## 👥 **8. USER MANAGEMENT TESTING (Admin Only)**

### **Step 8.1: Access Users Page**

1. Navigate to: `http://localhost:3000/cms/users`
2. **Verify:**
   - ✅ List of users visible (if you're admin/superuser)
   - ✅ Shows: Username, Email, Role, Status
   - ✅ "Create User" button visible

### **Step 8.2: Create Writer User**

1. Click **"Create User"** or "Add User"
2. **Fill form:**
   - Username: `writer1`
   - Email: `writer1@example.com`
   - Password: `testpass123`
   - Confirm Password: `testpass123`
   - Role: `Writer`
   - Name: `Test Writer`
   - Active: ✅ Checked

3. Click **"Save"**
4. **Expected:** ✅ Success message
5. **Expected:** ✅ User created
6. **Expected:** ✅ User appears in list

### **Step 8.3: Create Editor User**

1. Click **"Create User"** again
2. **Fill form:**
   - Username: `editor1`
   - Email: `editor1@example.com`
   - Password: `testpass123`
   - Role: `Editor`
   - Name: `Test Editor`
   - Active: ✅ Checked

3. Click **"Save"**
4. **Expected:** ✅ Editor user created

### **Step 8.4: Edit User**

1. Click **"Edit"** on a user
2. **Make changes:**
   - Change role
   - Change email
   - Toggle active status

3. Click **"Save"**
4. **Expected:** ✅ Changes saved

### **Step 8.5: Test Writer Permissions**

1. **Logout from admin account**
2. **Login as writer1** (created in Step 8.2)
3. **Test permissions:**
   - ✅ Can access dashboard
   - ✅ Can create posts
   - ✅ Can edit own posts
   - ✅ Can create categories
   - ❌ Cannot edit other users' posts
   - ❌ Cannot access `/cms/users`
   - ❌ Cannot edit/delete categories
   - ❌ Cannot manage menus
   - ❌ Cannot manage pages

### **Step 8.6: Test Editor Permissions**

1. **Logout from writer account**
2. **Login as editor1**
3. **Test permissions:**
   - ✅ Can access dashboard
   - ✅ Can create/edit all posts
   - ✅ Can approve pending posts
   - ✅ Can create/edit/delete categories
   - ✅ Can manage menus
   - ✅ Can manage pages
   - ✅ Can bulk upload
   - ❌ Cannot access `/cms/users`

### **Step 8.7: Delete User**

1. **Login back as admin/superuser**
2. Go to `/cms/users`
3. Find a test user
4. Click **"Delete"**
5. **Expected:** ✅ Confirmation dialog
6. Confirm deletion
7. **Expected:** ✅ User removed from list

---

## 🌐 **9. PUBLIC WEBSITE TESTING**

### **Step 9.1: Test Homepage**

1. Go to: `http://localhost:3000`
2. **Verify:**
   - ✅ Page loads without errors
   - ✅ Homepage sections render (Hero, Slider, Article Lists, etc.)
   - ✅ Navigation menu displays
   - ✅ Footer displays
   - ✅ No hardcoded content visible

### **Step 9.2: Test Category Page**

1. Click a category link in navbar (e.g., "News")
   OR visit directly: `http://localhost:3000/category/news`

2. **Verify:**
   - ✅ Category name displays as heading
   - ✅ Language badge shows
   - ✅ Articles in category are listed
   - ✅ Article cards show:
     - Featured image (if uploaded)
     - Title (clickable)
     - Category name
     - Published date
     - Excerpt

3. **Test empty category:**
   - Visit a category with no posts
   - ✅ Shows: "No articles found in this category yet."
   - ✅ Page doesn't break

### **Step 9.3: Test Article/Post Page**

1. Click on an article from category page or homepage
   OR visit directly: `http://localhost:3000/article/[article-slug]`

2. **Verify article displays:**
   - ✅ Article title as main heading
   - ✅ Category back link (← Category Name)
   - ✅ Featured image (if uploaded)
   - ✅ Article content with formatting:
     - Headings render correctly
     - Bold/italic text displays
     - Lists render properly
     - Links work
   - ✅ Published date
   - ✅ View count (increments on refresh)

3. **Test category navigation:**
   - Click "← Category Name" link
   - ✅ Navigates back to category page
   - Click category name in metadata
   - ✅ Also navigates to category page

### **Step 9.4: Test Page Pages**

1. Visit: `http://localhost:3000/page/about-us` (or your page slug)
2. **Verify:**
   - ✅ Page title displays
   - ✅ Page sections render (if any)
   - ✅ SEO meta tags correct (check page source: Ctrl+U)

### **Step 9.5: Test Navigation**

1. **Test navbar links:**
   - Click each navbar menu item
   - ✅ Category links go to `/category/[slug]`
   - ✅ Page links go to `/page/[slug]`
   - ✅ External links open in new tab

2. **Test footer links:**
   - Click footer menu items
   - ✅ All links work correctly

### **Step 9.6: Test SEO Meta Tags**

1. **Test article page SEO:**
   - Visit any article page
   - Press **Ctrl+U** (or Cmd+U on Mac) to view page source
   - ✅ `<title>` tag matches SEO title (or article title)
   - ✅ `<meta name="description">` contains SEO description
   - ✅ OpenGraph tags present:
     - `og:title`
     - `og:description`
     - `og:image` (if featured image exists)

2. **Test category page SEO:**
   - Visit category page
   - View page source
   - ✅ Title tag includes category name
   - ✅ Description meta tag present

3. **Test page SEO:**
   - Visit any page
   - View page source
   - ✅ Title matches SEO title
   - ✅ Description matches SEO description

### **Step 9.7: Test View Count Increment**

1. Visit an article page
2. Note the view count (e.g., "Views: 5")
3. Refresh the page 3 times
4. **Expected:** ✅ View count increases by 3 (now shows "Views: 8")
5. **Expected:** ✅ Count persists (doesn't reset)

### **Step 9.8: Test 404 Page**

1. Visit: `http://localhost:3000/article/this-does-not-exist`
2. **Expected:** ✅ 404 page displays
3. **Expected:** ✅ No server errors in console

---

## 🔍 **10. ERROR HANDLING & EDGE CASES**

### **Step 10.1: Test Form Validation**

1. **Test post creation without required fields:**
   - Go to `/cms/posts/new`
   - Leave Title empty
   - Leave Content empty
   - Click "Save"
   - ✅ Shows error: "Title: This field is required"
   - ✅ Shows error: "Content: This field is required"

2. **Test category creation with duplicate slug:**
   - Try creating category with existing slug (same language)
   - ✅ Shows error or auto-adjusts slug

### **Step 10.2: Test Permission Errors**

1. **As writer, try to edit another user's post:**
   - Login as writer
   - Find a post created by admin
   - Try to edit
   - ✅ Shows permission error (if implemented)
   - OR ❌ Cannot access edit page

2. **As writer, try to access users page:**
   - Navigate to `/cms/users`
   - ✅ Redirects or shows permission denied

### **Step 10.3: Test API Errors**

1. **Test with invalid API token:**
   - Clear localStorage
   - Try to access CMS pages
   - ✅ Redirects to login
   - ✅ No crashes

2. **Test network errors:**
   - Stop backend server
   - Try to load CMS pages
   - ✅ Shows error message
   - ✅ Doesn't crash frontend

### **Step 10.4: Test Empty States**

1. **Empty categories:**
   - Create category with no posts
   - Visit category page
   - ✅ Shows "No articles found" message

2. **Empty posts list:**
   - Delete all posts (or filter to empty)
   - ✅ Shows empty state message

---

## ✅ **11. FINAL VERIFICATION CHECKLIST**

### **After completing all tests, verify:**

### **CMS Features:**
- [ ] ✅ Login/Logout works
- [ ] ✅ Dashboard shows correct stats
- [ ] ✅ Can create/edit/delete posts
- [ ] ✅ Rich text editor works
- [ ] ✅ Post workflow (Draft → Pending → Published) works
- [ ] ✅ Can create/edit/delete categories
- [ ] ✅ Can create/edit/delete menus
- [ ] ✅ Can create/edit/delete pages
- [ ] ✅ Homepage builder works
- [ ] ✅ Bulk upload works
- [ ] ✅ User management works (admin)

### **Public Website:**
- [ ] ✅ Homepage renders with sections
- [ ] ✅ Category pages show articles
- [ ] ✅ Article pages render correctly
- [ ] ✅ Page pages work
- [ ] ✅ Navigation menus work
- [ ] ✅ Footer menus work
- [ ] ✅ SEO meta tags correct
- [ ] ✅ Images display correctly
- [ ] ✅ View count increments

### **Permissions:**
- [ ] ✅ Writers can create posts/categories
- [ ] ✅ Writers cannot edit others' posts
- [ ] ✅ Editors can approve posts
- [ ] ✅ Editors can manage categories/menus/pages
- [ ] ✅ Admins have full access
- [ ] ✅ Protected routes redirect to login

### **Quality Checks:**
- [ ] ✅ No console errors (check DevTools)
- [ ] ✅ No broken links
- [ ] ✅ Responsive design works (mobile/tablet/desktop)
- [ ] ✅ Forms validate correctly
- [ ] ✅ Error messages are user-friendly
- [ ] ✅ Loading states show appropriately
- [ ] ✅ Success/error toasts work

---

## 🎯 **TESTING COMPLETE!**

If all items in the checklist are ✅, your CMS is **fully functional** and ready for use!

**Total Testing Time:** ~2-3 hours for complete testing

**Notes:**
- Test with different user roles (Writer, Editor, Admin)
- Test on different browsers (Chrome, Firefox, Edge)
- Test on mobile devices
- Check browser console for errors
- Monitor network requests in DevTools

---

**Happy Testing! 🚀**

**Last Updated:** January 2026
