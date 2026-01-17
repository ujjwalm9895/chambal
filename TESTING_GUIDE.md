# 🧪 Complete Testing Guide - Chambal Sandesh CMS

This guide provides comprehensive step-by-step instructions to test all features of the Chambal Sandesh CMS system.

## 📋 Prerequisites

Before testing, ensure:
- ✅ Backend is running on `http://localhost:8000`
- ✅ Frontend is running on `http://localhost:3000`
- ✅ MySQL database is configured and migrations are applied
- ✅ Superuser account is created

---

## 🔐 1. Authentication Testing

### 1.1 Test Login

1. Navigate to: `http://localhost:3000/cms/login`
2. **Test Invalid Credentials:**
   - Enter wrong username/password
   - Should show error message
3. **Test Valid Credentials:**
   - Enter superuser credentials
   - Should redirect to `/cms` (dashboard)
   - Should see dashboard with stats cards

### 1.2 Test Token Storage

1. Open browser DevTools → Application → Local Storage
2. Verify tokens are stored:
   - `access_token` - JWT access token
   - `refresh_token` - JWT refresh token
   - `user` - User object JSON

### 1.3 Test Protected Routes

1. Try accessing `/cms/posts` directly (without login)
2. Should redirect to `/cms/login`
3. After login, should access successfully

### 1.4 Test Logout

1. Click user dropdown in topbar
2. Click "Logout"
3. Should clear localStorage
4. Should redirect to login page

### 1.5 Test Sidebar Navigation

1. After login, verify sidebar:
   - Starts in **collapsed** state (icon-only, ~64px wide)
   - Click hamburger button (☰) in topbar
   - Sidebar expands to show full labels (~256px wide)
   - Click hamburger again to collapse
2. **Mobile**: Sidebar slides in from left with overlay
3. **Desktop**: Sidebar toggles between collapsed/expanded
4. Verify user profile section shows:
   - User avatar with initials
   - Username/name
   - "online" status indicator (green dot)
5. Verify navigation items work:
   - Home (Dashboard)
   - Add Post
   - Bulk Post Upload
   - Posts (expandable submenu)
   - Categories
   - Menus
   - Pages
   - Homepage Builder
   - Users
   - Settings

---

## 📊 2. Dashboard Testing

### 2.1 Verify Dashboard Stats

1. Login to CMS: `http://localhost:3000/cms`
2. Check the 4 main stat cards are displayed:
   - **Posts** (Teal) - Total number of posts
   - **Pending Posts** (Red) - Posts awaiting review
   - **Drafts** (Purple) - Draft posts
   - **Scheduled Posts** (Yellow) - Scheduled posts
3. Cards should be clickable and navigate to filtered post lists

### 2.2 Test Clickable Cards

1. Click on "Total Posts" card
   - Should navigate to `/cms/posts`
2. Click on "Pending Posts" card
   - Should navigate to `/cms/posts?status=pending`
3. Click on "Categories" card
   - Should navigate to `/cms/categories`

### 2.3 Test Real-time Updates

1. Create a new post (draft)
2. Refresh dashboard
3. Verify "Draft" count increased

---

## 📝 3. Post Management Testing

### 3.1 Create New Post

1. Navigate to: `/cms/posts/new`
2. Fill in the form:
   - **Title**: "Test Article 1"
   - **Category**: 
     - Select from dropdown (only active categories shown)
     - OR click **"New Category"** button to create category on-the-fly:
       - Name: "Technology" (auto-generates slug)
       - Language: Auto-matches post language
       - Show in Menu: Optional
       - Active: Optional
       - Click "Create Category" - automatically selected after creation
   - **Language**: English
   - **Content**: Use rich text editor to add:
     - Bold text
     - Headings (H1, H2)
     - Bullet lists
     - Numbered lists
   - **Excerpt**: "This is a test article"
   - **Status**: Draft
   - **SEO Title**: "Test Article 1 - Chambal Sandesh"
   - **SEO Description**: "Testing the CMS system"
3. Click "Save Post"
4. Verify:
   - Success message appears
   - Redirected to posts list
   - New post appears in list

### 3.2 Test Post Status Workflow

#### Test Draft → Pending
1. Create a post with status "Draft"
2. Edit the post
3. Change status to "Pending Review"
4. Save
5. Verify:
   - Post appears in "Pending Posts" filter
   - Dashboard "Pending" count increased

#### Test Pending → Published (Editor/Admin)
1. As admin/editor, go to pending posts
2. Click approve button (✓) on a pending post
3. Verify:
   - Post status changes to "Published"
   - `publish_at` is automatically set

#### Test Scheduled Posts
1. Create/edit a post
2. Set status to "Scheduled"
3. Set `publish_at` to future date/time
4. Save
5. Verify:
   - Post appears in "Scheduled Posts" filter
   - Post is NOT visible on public website yet

### 3.3 Test Post Flags

1. Edit a post
2. Toggle checkboxes:
   - ✅ **Featured**: Post appears in featured section
   - ✅ **Slider**: Post appears in slider section
   - ✅ **Breaking**: Post appears in breaking news
   - ✅ **Recommended**: Post appears in recommended section
3. Save and verify flags are saved

### 3.4 Test Rich Text Editor

1. Create/edit a post
2. Test editor features:
   - **Bold** (B button)
   - **Italic** (I button)
   - **H1** and **H2** headings
   - **Bullet list** (•)
   - **Numbered list** (1.)
3. Save and verify formatting is preserved

### 3.5 Test Post Filters

Navigate to `/cms/posts` and test filters:

1. **All Posts**: Shows all posts
2. **By Status**: 
   - `?status=draft` - Shows only drafts
   - `?status=pending` - Shows pending posts
   - `?status=published` - Shows published posts
   - `?status=scheduled` - Shows scheduled posts
3. **By Special Flags**:
   - `?featured=true` - Featured posts only
   - `?slider=true` - Slider posts only
   - `?breaking=true` - Breaking news only
   - `?recommended=true` - Recommended posts only

### 3.6 Test Post Search

1. Go to `/cms/posts`
2. Use search functionality (if implemented)
3. Search by title/content
4. Verify results match search term

### 3.7 Test Post Edit

1. Click edit icon (✏️) on any post
2. Modify:
   - Title
   - Content
   - Status
   - Flags
3. Save
4. Verify changes are reflected in list

### 3.8 Test Post Delete

1. Click delete icon (🗑️) on a post
2. Confirm deletion in dialog
3. Verify:
   - Post removed from list
   - Success message appears

---

## 📤 4. Bulk Upload Testing

### 4.1 Prepare CSV File

Create a file `test_posts.csv` with content:

```csv
title,content,category,status,language,excerpt,publish_at
"Test Post 1","This is content for test post 1","News",draft,en,"Excerpt 1",
"Test Post 2","This is content for test post 2","News",pending,en,"Excerpt 2",
"Test Post 3","This is content for test post 3","Sports",published,hi,"Excerpt 3",2024-12-20 10:00:00
```

### 4.2 Test Bulk Upload

1. Navigate to: `/cms/posts/upload`
2. Click "Select CSV file"
3. Choose `test_posts.csv`
4. Click "Upload CSV"
5. Verify:
   - Success message shows number of posts created
   - Any validation errors are displayed
   - Posts appear in posts list

### 4.3 Test CSV Validation

Create invalid CSV files and test:

1. **Missing required column** (title/content/category):
   - Should show error: "Missing columns: title"
2. **Invalid category name**:
   - Should show error: "Category 'InvalidCategory' not found"
3. **Invalid status**:
   - Should show error for invalid status values

---

## 📂 5. Category Management Testing

### 5.1 Create Categories

1. Navigate to: `/cms/categories`
2. Click **"+ Add Category"** button
3. Create categories:
   
   **English Categories:**
   - Name: "News", Language: English, Show in Menu: Yes, Menu Order: 1
   - Name: "Sports", Language: English, Show in Menu: Yes, Menu Order: 2
   - Name: "Entertainment", Language: English, Show in Menu: Yes, Menu Order: 3
   
   **Hindi Categories:**
   - Name: "समाचार", Language: Hindi, Show in Menu: Yes
   - Name: "खेल", Language: Hindi, Show in Menu: Yes

4. **Note**: 
   - Slug is auto-generated from name if not provided
   - Same slug can exist for different languages (e.g., "news" for English and "news" for Hindi)
   - If slug already exists for same language, auto-appends number (e.g., "news-1")

5. Verify categories appear in list with:
   - Name, Slug, Language badge, Menu Order, Posts Count, Status badges

### 5.1.1 Quick Category Creation from Post Editor

1. While creating/editing a post at `/cms/posts/new` or `/cms/posts/[id]/edit`
2. In the Category field, click **"New Category"** button
3. Modal form opens with:
   - Name field (required) - auto-generates slug
   - Slug field (optional, editable)
   - Language (defaults to post's language)
   - Show in Menu checkbox
   - Active checkbox
4. Click "Create Category"
5. Category is created and automatically selected in the post form

### 5.2 Edit/Delete Categories

1. Click edit icon (✏️) on any category
2. Modify fields and save
3. Click delete icon (🗑️) to delete category
4. **Note**: Writers can view categories, but only admins/editors can create/edit/delete

### 5.3 Test Category Permissions

1. **As Writer**:
   - ✅ Can view categories list
   - ✅ Can create categories (needed for post creation)
   - ❌ Cannot edit existing categories
   - ❌ Cannot delete categories

2. **As Editor/Admin**:
   - ✅ Can view, create, edit, and delete categories

### 5.4 Test Category Filters

1. Filter by language:
   - `?lang=en` - Shows only English categories
   - `?lang=hi` - Shows only Hindi categories
2. Filter by active status
3. Test search functionality

### 5.5 Test Menu Order

1. Edit categories (as admin/editor) and set different `menu_order` values:
   - News: 1
   - Sports: 2
   - Entertainment: 3
2. Verify order is reflected in menus
3. Verify categories list is sorted by menu_order

---

## 🔗 6. Menu Management Testing

### 6.1 Create Navbar Menus

1. Navigate to: `/cms/menus`
2. Click **"+ Add Menu Item"** button
3. Create navbar menu items:
   
   **Category Links:**
   - Title: "News", Menu Type: Navbar, Link Type: Category, Category: News (select from dropdown), Order: 1
   - Title: "Sports", Menu Type: Navbar, Link Type: Category, Category: Sports, Order: 2
   
   **Page Links:**
   - Title: "About", Menu Type: Navbar, Link Type: Page, Page: About (select from dropdown), Order: 3
   
   **External Links:**
   - Title: "Contact", Menu Type: Navbar, Link Type: URL, External URL: `https://example.com/contact`, Order: 4

4. **Note**: Form fields change dynamically based on Link Type selection
5. Only active categories/pages are shown in dropdowns

### 6.1.1 Test Menu Form Validation

1. Try creating menu without required fields
2. Verify error messages display:
   - Title is required
   - Category/Page/URL required based on link type
3. Verify proper field cleanup when switching link types

### 6.2 Create Footer Menus

1. Create footer menu items:
   - Title: "Privacy Policy", Menu Type: Footer, Link Type: Page
   - Title: "Terms of Service", Menu Type: Footer, Link Type: Page
   - Title: "FAQ", Menu Type: Footer, Link Type: URL, External URL: `https://example.com/faq`

### 6.3 Test Menu Permissions

1. **As Writer**:
   - ✅ Can view menus list
   - ❌ Cannot create/edit/delete menus

2. **As Editor/Admin**:
   - ✅ Can view, create, edit, and delete menus

### 6.4 Verify Menu Display

1. Check public website: `http://localhost:3000`
2. Verify:
   - Navbar shows navbar menu items
   - Footer shows footer menu items
   - Links work correctly
   - Order is correct
   - Only active menu items display

---

## 📄 7. Page Management Testing

### 7.1 Create Static Pages

1. Navigate to: `/cms/pages`
2. Create pages:
   - **About Page**:
     - Title: "About Us"
     - Slug: `about`
     - SEO Title: "About Us - Chambal Sandesh"
     - SEO Description: "Learn about Chambal Sandesh"
   
   - **Privacy Policy**:
     - Title: "Privacy Policy"
     - Slug: `privacy-policy`

### 7.2 Test Page Access

1. Visit public URL: `http://localhost:3000/page/about`
2. Verify page content renders correctly
3. Check SEO meta tags in page source

---

## 🏠 8. Homepage Builder Testing

### 8.1 Create Homepage Page

1. Navigate to: `/cms/pages`
2. Create a page:
   - Title: "Home"
   - Slug: `home` (important!)
   - Mark as active

### 8.2 Add Homepage Sections

Navigate to `/cms/homepage` or edit the home page and add sections:

#### 8.2.1 Hero Section

1. Add new section:
   - Section Type: `hero`
   - Data (JSON):
     ```json
     {
       "title": "Welcome to Chambal Sandesh",
       "subtitle": "Your trusted news source",
       "image": "https://example.com/hero.jpg",
       "cta_text": "Read More",
       "cta_link": "/articles"
     }
     ```
   - Order: 1
   - Active: Yes

#### 8.2.2 Slider Section

1. Add section:
   - Section Type: `slider`
   - Data:
     ```json
     {
       "title": "Featured Stories",
       "post_ids": [1, 2, 3]
     }
     ```
   - Order: 2

#### 8.2.3 Article List Section

1. Add section:
   - Section Type: `article_list`
   - Data:
     ```json
     {
       "title": "Latest News",
       "limit": 6,
       "category": "news",
       "featured": false
     }
     ```
   - Order: 3

#### 8.2.4 Banner Section

1. Add section:
   - Section Type: `banner`
   - Data:
     ```json
     {
       "title": "Special Offer",
       "content": "Subscribe to our newsletter",
       "image": "https://example.com/banner.jpg",
       "link": "/subscribe",
       "style": "primary"
     }
     ```
   - Order: 4

#### 8.2.5 HTML Section

1. Add section:
   - Section Type: `html`
   - Data:
     ```json
     {
       "html": "<div><h2>Custom Content</h2><p>This is custom HTML content</p></div>"
     }
     ```
   - Order: 5

### 8.3 Test Homepage Rendering

1. **Prerequisites:**
   - Create homepage page with slug `home`
   - Add at least 2-3 sections (Hero, Article List, etc.)
   - Ensure sections are marked as active
   - Create some published posts for article lists to display

2. **Test Homepage Loading:**
   - Visit: `http://localhost:3000`
   - ✅ Homepage loads without errors
   - ✅ Loading state shows briefly (if any)
   - ✅ No console errors in DevTools

3. **Test Section Rendering:**
   - ✅ **Hero Section** (if added):
     - Title displays correctly
     - Subtitle displays correctly
     - Background image displays (if set)
     - CTA button works (if set)
   - ✅ **Slider Section** (if added):
     - Shows slider/carousel of posts
     - Posts are clickable
     - Navigation arrows work (if implemented)
   - ✅ **Article List Section**:
     - Section title displays: "Latest News" (or custom title)
     - Articles display in grid layout
     - Article cards show images, titles, dates
     - Clicking article navigates to detail page
   - ✅ **Banner Section** (if added):
     - Banner content displays
     - Image displays (if set)
     - Link works (if set)
   - ✅ **HTML Section** (if added):
     - Custom HTML renders correctly
     - All HTML tags work as expected

4. **Test Section Order:**
   - Check section order in CMS
   - ✅ Sections appear in correct order on homepage
   - ✅ Order matches the `order` field in database

5. **Test Homepage Without Sections:**
   - Delete all sections from homepage page
   - Refresh homepage
   - ✅ Shows default homepage layout:
     - "Chambal Sandesh" heading
     - Featured articles section (if posts exist)
     - Slider posts section (if posts exist)
     - Breaking news section (if posts exist)
     - Latest articles section

6. **Test Data-Driven Content:**
   - ✅ No hardcoded content visible
   - ✅ All content comes from CMS/API
   - ✅ Changes in CMS reflect on homepage after refresh

7. **Test Navigation and Footer:**
   - ✅ Navbar displays at top
   - ✅ Footer displays at bottom
   - ✅ Menu items work correctly
   - ✅ Footer links work correctly

### 8.4 Test Section Ordering

1. Edit section orders in CMS
2. Refresh homepage
3. Verify sections reorder correctly

---

## 👥 9. User Management Testing (Admin Only)

### 9.1 Create Test Users

1. Navigate to: `/cms/users` (if implemented)
2. Create users with different roles:
   
   **Writer:**
   - Username: `writer1`
   - Role: Writer
   - Email: `writer1@example.com`
   
   **Editor:**
   - Username: `editor1`
   - Role: Editor
   - Email: `editor1@example.com`

### 9.2 Test Role-Based Permissions

#### Test Writer Permissions:
1. Login as writer
2. Verify:
   - ✅ Can create posts
   - ✅ Can edit own posts
   - ❌ Cannot approve posts
   - ❌ Cannot edit other users' posts
   - ❌ Cannot access user management

#### Test Editor Permissions:
1. Login as editor
2. Verify:
   - ✅ Can create/edit all posts
   - ✅ Can approve pending posts
   - ✅ Can bulk upload
   - ✅ Can manage categories/menus/pages
   - ❌ Cannot access user management

#### Test Admin Permissions:
1. Login as admin
2. Verify:
   - ✅ Full access to all features
   - ✅ Can manage users
   - ✅ Can access all settings

---

## 🌐 10. Public Website Testing

### 10.1 Test Homepage

1. Visit: `http://localhost:3000`
2. Verify:
   - Homepage loads correctly
   - All sections render from CMS
   - No hardcoded content
   - Navigation menu displays
   - Footer displays

### 10.2 Test Category Pages

1. **Prerequisites:**
   - Ensure you have created a category named "News" with slug "news"
   - Ensure you have at least 1 published post in the "News" category

2. **Test Category Page Display:**
   - Visit: `http://localhost:3000/category/news`
   - ✅ Category name displays as heading: "News"
   - ✅ Language badge displays: "English Category"
   - ✅ "Showing articles in this category" message appears (if show_in_menu is true)

3. **Test Article Listing:**
   - ✅ Articles in category are listed in a grid layout
   - ✅ Each article card shows:
     - Featured image (if uploaded)
     - Category name/badge
     - Article title (clickable)
     - Published date
     - Excerpt/description (if available)
   - ✅ Clicking article title navigates to article detail page

4. **Test Empty Category:**
   - Create a category with no posts
   - Visit that category page
   - ✅ Should display: "No articles found in this category yet."
   - ✅ Page does not show error or blank page

5. **Test Pagination (if implemented):**
   - Create more than 12 posts in a category
   - ✅ Pagination controls appear
   - ✅ Next/Previous buttons work

6. **Test Language Filter:**
   - Create Hindi category and Hindi posts
   - Visit category with `?lang=hi` parameter
   - ✅ Only Hindi posts are displayed

7. **Browser Console Check:**
   - Open DevTools (F12) → Console tab
   - ✅ Should see: "Fetching articles with params: {category: 'news', ...}"
   - ✅ Should see: "Fetched articles: X [...]"
   - ✅ No errors in console

### 10.3 Test Article/Post Pages

1. **Prerequisites:**
   - Create a published post with:
     - Title: "Test Article 1"
     - Category: News
     - Featured image (optional)
     - Rich text content (headings, lists, bold, etc.)
     - SEO title and description

2. **Test Article Display:**
   - Visit: `http://localhost:3000/article/test-article-1` (use your actual slug)
   - ✅ Post title displays as main heading (h1)
   - ✅ Content renders with all formatting:
     - Headings (H1, H2, etc.) are styled correctly
     - Bold/italic text displays
     - Lists (bulleted/numbered) render properly
     - Links are clickable and styled
     - Paragraphs have proper spacing

3. **Test Article Metadata:**
   - ✅ Category link displays: "← News" (back link)
   - ✅ Category name appears in metadata section
   - ✅ Published date displays in readable format (e.g., "January 16, 2026")
   - ✅ View count displays (if > 0): "Views: 5"
   - ✅ All metadata is styled and readable

4. **Test Featured Image:**
   - If post has featured image:
     - ✅ Image displays prominently below title
     - ✅ Image is responsive (scales with screen)
     - ✅ Image has proper styling (rounded corners, shadow)
     - ✅ Image alt text uses article title

5. **Test Category Navigation:**
   - Click "← News" back link
   - ✅ Navigates to `/category/news`
   - Click category name in metadata
   - ✅ Also navigates to category page

6. **Test View Count Increment:**
   - Note current view count
   - Refresh page
   - ✅ View count increases by 1
   - ✅ Count persists after page reload

7. **Test SEO Meta Tags:**
   - View page source (Ctrl+U or Cmd+U)
   - ✅ `<title>` tag matches SEO title (or article title if SEO title not set)
   - ✅ `<meta name="description">` contains SEO description (or excerpt)
   - ✅ OpenGraph tags present:
     - `og:title`
     - `og:description`
     - `og:image` (if featured image exists)
     - `og:type` = "article"

8. **Test Content Rendering:**
   - Article content uses `dangerouslySetInnerHTML` (safe HTML from TipTap)
   - ✅ All HTML formatting preserved
   - ✅ No escaped HTML entities showing
   - ✅ Images in content display correctly
   - ✅ Links in content work properly

9. **Test 404 for Non-Existent Articles:**
   - Visit: `http://localhost:3000/article/this-does-not-exist`
   - ✅ Shows 404 page (not-found.js)
   - ✅ No server errors in console

### 10.4 Test Page Pages

1. **Prerequisites:**
   - Create a page with slug `about` or `about-us`
   - Add some sections to the page (optional)

2. **Test Page Display:**
   - Visit: `http://localhost:3000/page/about` (or your page slug)
   - ✅ Page title displays as main heading
   - ✅ Page content/sections render correctly

3. **Test Page Sections:**
   - If page has sections:
     - ✅ All sections render in order
     - ✅ Hero sections display
     - ✅ Article list sections show articles
     - ✅ HTML sections render custom HTML
     - ✅ Banner sections display

4. **Test Page Without Sections:**
   - Create a page with no sections
   - Visit the page
   - ✅ Shows default message: "This page is managed through the CMS. Please add sections to display content."
   - ✅ Page doesn't break or show errors

5. **Test SEO Meta Tags:**
   - View page source (Ctrl+U)
   - ✅ `<title>` tag matches SEO title (or page title)
   - ✅ `<meta name="description">` matches SEO description
   - ✅ Meta tags are properly formatted

6. **Test Page Navigation:**
   - Click navbar/footer link to the page
   - ✅ Navigates correctly
   - ✅ URL matches page slug

### 10.5 Test Multi-Language

1. Switch language in CMS topbar (EN/HI)
2. Visit homepage with `?lang=hi`
3. Verify:
   - Hindi categories display
   - Hindi posts appear
   - Content filters by language

### 10.6 Test Menu Links

1. Click each navbar menu item
2. Verify:
   - Category links go to category pages
   - Page links go to page pages
   - External links open in new tab
3. Test footer links similarly

---

## 🔍 11. SEO Testing

### 11.1 Test Meta Tags

1. Visit any article page
2. View page source (Ctrl+U)
3. Verify:
   - `<title>` tag matches SEO title
   - `<meta name="description">` matches SEO description
   - OpenGraph tags present (if implemented)

### 11.2 Test Slug-Based URLs

1. **Verify URL Structure:**
   - ✅ Articles use: `/article/{slug}`
     - Example: `/article/welcome-to-chambal-sandesh`
   - ✅ Categories use: `/category/{slug}`
     - Example: `/category/news`
   - ✅ Pages use: `/page/{slug}`
     - Example: `/page/about-us`

2. **Test Slug Generation:**
   - Create a post with title: "Test Article 2024"
   - ✅ Slug auto-generates: `test-article-2024`
   - ✅ Slug is URL-safe (lowercase, hyphens, no spaces)

3. **Test Slug Uniqueness:**
   - Create category "News" (English) - slug: `news`
   - Create category "समाचार" (Hindi) - slug: `news`
   - ✅ Both can have same slug (different languages)
   - ✅ Each is accessible via `/category/news` (returns first match)

4. **Test Slug Changes:**
   - Edit a post and change slug manually
   - ✅ Save successfully
   - ✅ Visit old URL - should redirect or show 404
   - ✅ Visit new URL - should work correctly

5. **Test Special Characters in Slugs:**
   - Create post with title containing special chars
   - ✅ Special chars are converted to hyphens or removed
   - ✅ Slug is clean and URL-safe

---

## ⚡ 12. Performance Testing

### 12.1 Test API Response Times

1. Open DevTools → Network tab
2. Navigate through CMS pages
3. Verify:
   - API calls complete in reasonable time
   - No failed requests
   - Responses are properly formatted

### 12.2 Test Image Loading

1. Upload featured images for posts
2. Verify:
   - Images load on public website
   - Images are optimized
   - Lazy loading works (if implemented)

---

## 🐛 13. Error Handling Testing

### 13.1 Test Invalid Data

1. Try to create post without required fields (title, content)
2. Verify detailed validation errors display with field-specific messages
3. Try creating category with duplicate slug for same language
4. Try creating menu without required link target
5. Verify error messages are user-friendly and actionable

### 13.1.1 Test Error Messages

1. Check browser console (F12) for detailed error information
2. Verify toast notifications show specific error messages:
   - Field validation errors (e.g., "Title error: This field is required")
   - Permission errors (e.g., "You do not have permission to...")
   - Network errors (e.g., "Failed to load categories")
   - Server errors (e.g., "Slug error: A category with this slug already exists...")

### 13.2 Test Non-Existent Resources

1. Visit: `http://localhost:3000/article/non-existent`
2. Verify 404 page displays

### 13.3 Test Unauthorized Access

1. Logout
2. Try to access: `/cms/posts`
3. Verify redirect to login

---

## ✅ 14. Complete Workflow Test

### End-to-End Workflow:

1. **Login** as admin
2. **Create Categories** (English & Hindi)
3. **Create Navbar Menus** linking to categories
4. **Create Pages** (About, Privacy Policy)
5. **Create Posts** with different statuses:
   - 3 Draft posts
   - 2 Pending posts
   - 5 Published posts (mix of featured, slider, breaking)
6. **Build Homepage** with multiple sections
7. **Approve** pending posts
8. **Verify Public Website**:
   - Homepage displays all sections
   - Categories show correct posts
   - Articles render correctly
   - Menus work
   - SEO tags are correct

---

## 📋 15. Testing Checklist

Use this checklist to ensure all features are tested:

### Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout functionality
- [ ] Token storage
- [ ] Protected route access

### Dashboard
- [ ] All 4 stat cards display (Posts, Pending Posts, Drafts, Scheduled Posts)
- [ ] Stats update correctly
- [ ] Clickable cards navigate correctly
- [ ] Cards show correct colors (Teal, Red, Purple, Yellow)

### Posts
- [ ] Create post
- [ ] Create category from post editor (quick creation modal)
- [ ] Edit post
- [ ] Delete post
- [ ] Rich text editor works
- [ ] Status workflow (Draft → Pending → Published)
- [ ] Scheduled posts
- [ ] Post flags (Featured, Slider, Breaking, Recommended)
- [ ] Post filters work
- [ ] Search works
- [ ] Bulk upload works
- [ ] Empty category handled correctly (post can be saved without category)

### Categories
- [ ] Create category (English) - Writers can create
- [ ] Create category (Hindi) - Writers can create
- [ ] Create category from post editor modal
- [ ] Edit category - Only admins/editors
- [ ] Delete category - Only admins/editors
- [ ] View categories - All authenticated users
- [ ] Menu order works
- [ ] Slug auto-generation works
- [ ] Slug uniqueness per language (same slug for different languages allowed)

### Menus
- [ ] Create navbar menu - Only admins/editors
- [ ] Create footer menu - Only admins/editors
- [ ] View menus - All authenticated users
- [ ] Dynamic form fields (Category/Page/URL based on link type)
- [ ] Menu links work on public site
- [ ] Menu order correct

### Pages
- [ ] Create page
- [ ] Edit page
- [ ] Delete page
- [ ] Page renders on public site

### Homepage Builder
- [ ] Create homepage page
- [ ] Add hero section
- [ ] Add slider section
- [ ] Add article list section
- [ ] Add banner section
- [ ] Add HTML section
- [ ] Sections render on homepage
- [ ] Section order works

### Users (Admin)
- [ ] Create user
- [ ] Edit user
- [ ] Delete user
- [ ] Role-based permissions work

### Public Website
- [ ] Homepage renders
- [ ] Category pages work
- [ ] Article pages work
- [ ] Page pages work
- [ ] Navigation works
- [ ] Footer works
- [ ] Multi-language works
- [ ] SEO tags correct

---

## 🎯 Success Criteria

After completing all tests, you should verify:

✅ All CMS features work as expected  
✅ Public website renders all CMS content  
✅ No hardcoded content on frontend  
✅ Workflow functions correctly  
✅ Role-based permissions work  
✅ Multi-language support works  
✅ SEO optimization works  
✅ No console errors  
✅ No broken links  

---

## 🐞 Reporting Issues

If you find any issues during testing:

1. Note the feature/page where issue occurs
2. Document steps to reproduce
3. Check browser console for errors
4. Check backend logs for errors
5. Document expected vs actual behavior

---

## 📄 Pages Management Guide

### How to Create and Manage Pages

Pages are static content pages that can be used for About Us, Contact, Terms & Conditions, Privacy Policy, etc.

#### **Step 1: Access Pages Management**
1. Log in to the CMS at `http://localhost:3000/cms/login`
2. Navigate to **Pages** from the left sidebar
3. You'll see the Pages management page with a table listing all pages

#### **Step 2: Create a New Page**

1. **Click "Add Page"** button (top right)
2. **Fill in the form:**
   - **Title** (Required): Enter the page title (e.g., "About Us", "Contact Us")
     - Slug will auto-generate from the title as you type
   - **Slug** (Optional): Custom URL slug
     - Example: "about-us" creates URL: `/page/about-us/`
     - Leave empty to auto-generate from title
     - Must be unique
   - **SEO Title** (Optional): Meta title for search engines (max 70 characters)
     - Shows character counter: "0/70 characters"
     - Recommended: 50-60 characters for best display
   - **SEO Description** (Optional): Meta description for search engines (max 160 characters)
     - Shows character counter: "0/160 characters"
     - Recommended: 150-160 characters
   - **Active**: Toggle checkbox to activate/deactivate the page
     - Only active pages appear on the public website

3. **Click "Create Page"**
4. You'll see a success toast notification
5. The new page will appear in the table

#### **Step 3: Edit a Page**

1. Find the page in the table
2. Click the **Edit icon** (pencil ✏️) in the Actions column
3. Modify any fields as needed:
   - You can change the slug manually if needed
   - Update SEO fields
   - Toggle active status
4. Click **"Update Page"**
5. Changes are saved immediately

#### **Step 4: Delete a Page**

1. Find the page in the table
2. Click the **Delete icon** (trash 🗑️) in the Actions column
3. Confirm the deletion in the popup dialog
4. Page will be permanently deleted
5. ⚠️ **Warning**: This action cannot be undone!

#### **Step 5: View Page Details**

The table shows:
- **Title**: Page title with SEO title preview (if set)
- **Slug**: Clickable code showing the URL path
- **Sections**: Number of page sections (click to manage)
- **Status**: Active (green) or Inactive (gray) badge
- **Updated**: Last modification date

#### **Step 6: Manage Page Sections** (Advanced)

After creating a page, you can add dynamic sections:

1. Click on the **section count** link (e.g., "0 sections")
2. This opens the page sections management
3. Add different section types:
   - **Hero Section**: Full-width banner with content
   - **Slider**: Image/content carousel
   - **Article List**: List of articles/posts
   - **Banner**: Promotional banner
   - **HTML Content**: Custom HTML content

#### **Example 1: Creating an "About Us" Page**

```
Title: About Us
Slug: about-us (auto-generated, can be customized)
SEO Title: About Us - Chambal Sandesh News Portal
SEO Description: Learn more about Chambal Sandesh, your trusted source for local news and updates in the Chambal region.
Active: ✅ Enabled
```

**Result:** 
- URL: `http://localhost:3000/page/about-us/`
- Accessible on the public website
- SEO-optimized for search engines
- Can be linked in menus

#### **Example 2: Creating a "Contact" Page**

```
Title: Contact Us
Slug: contact (customized for shorter URL)
SEO Title: Contact Us - Chambal Sandesh
SEO Description: Get in touch with Chambal Sandesh. Send us your news tips, feedback, or inquiries. We're here to serve you.
Active: ✅ Enabled
```

#### **Example 3: Creating a "Privacy Policy" Page**

```
Title: Privacy Policy
Slug: privacy-policy (auto-generated)
SEO Title: Privacy Policy - Chambal Sandesh
SEO Description: Read our privacy policy to understand how Chambal Sandesh collects, uses, and protects your personal information.
Active: ✅ Enabled
```

#### **Best Practices:**

1. **Slug Formatting:**
   - ✅ Use lowercase letters and hyphens: `about-us`, `contact-us`, `privacy-policy`
   - ✅ Keep slugs short and memorable
   - ❌ Avoid special characters, spaces, and uppercase
   - ❌ Don't use duplicate slugs

2. **SEO Optimization:**
   - ✅ Keep SEO title under 60 characters for best search engine display
   - ✅ Write compelling SEO descriptions (150-160 characters)
   - ✅ Include relevant keywords naturally
   - ✅ Make it unique for each page
   - ✅ Avoid keyword stuffing

3. **Page Organization:**
   - ✅ Use clear, descriptive titles
   - ✅ Keep slugs short and memorable
   - ✅ Activate pages only when they're ready for publication
   - ✅ Use inactive status for drafts

4. **Using Pages in Menus:**
   - After creating a page, go to **Menus** section
   - Click "Add Menu Item"
   - Set Link Type to **"Page"**
   - Select your newly created page from the dropdown
   - The page will appear in the navigation menu

5. **Page Sections:**
   - Build complex pages using multiple sections
   - Combine different section types for rich content
   - Use HTML sections for custom content
   - Add article lists to show related posts

#### **Common Use Cases:**

| Use Case | Example Title | Example Slug | Description |
|----------|--------------|--------------|-------------|
| About Us | About Us | `about-us` | Company/organization information |
| Contact | Contact Us | `contact` | Contact information and form |
| Terms | Terms & Conditions | `terms-conditions` | Legal terms of service |
| Privacy | Privacy Policy | `privacy-policy` | Privacy policy page |
| FAQs | Frequently Asked Questions | `faqs` | Frequently asked questions |
| Advertise | Advertise With Us | `advertise` | Advertising information |
| Careers | Careers | `careers` | Job listings |
| Editorial | Editorial Policy | `editorial-policy` | Editorial guidelines |
| Support | Support | `support` | Customer support page |

#### **Troubleshooting:**

**Problem: "Failed to save page"**
- ✅ Check if you're logged in
- ✅ Verify you have admin/editor permissions
- ✅ Ensure the title is not empty
- ✅ Check that slug is unique (if manually set)
- ✅ Check browser console for detailed errors

**Problem: "Slug already exists"**
- ✅ Change the slug to something unique
- ✅ Or let it auto-generate from title
- ✅ Backend will auto-append a number if duplicate (e.g., `about-us-2`)

**Problem: Page not showing on website**
- ✅ Check if the page is **Active** (green badge)
- ✅ Verify the page slug is correct
- ✅ Check if page sections are configured (for dynamic pages)
- ✅ Ensure menu item is created and active

**Problem: Cannot edit/delete pages**
- ✅ Only admins and editors can modify pages
- ✅ Writers can only view pages
- ✅ Check your user role in the Users section
- ✅ Superusers have full access automatically

**Problem: SEO fields not showing in search results**
- ✅ Ensure SEO title and description are filled
- ✅ Check character limits (70 for title, 160 for description)
- ✅ Verify page is active and published
- ✅ Search engines need time to index new pages

#### **Quick Reference:**

**URL Format:**
```
Public URL: /page/[slug]/
Example: /page/about-us/
```

**Required Fields:**
- Title

**Optional Fields:**
- Slug (auto-generated if empty)
- SEO Title
- SEO Description

**Permissions:**
- **Admin/Editor**: Full access (create, read, update, delete)
- **Writer**: Read-only access
- **Superuser**: Full access automatically

---

## 🔌 16. API Endpoints Testing

### 16.1 Test Public API Endpoints

1. **Homepage API:**
   - Visit: `http://localhost:8000/api/homepage/`
   - ✅ Returns JSON with:
     - `menus` (array)
     - `categories` (array)
     - `featured_posts` (array)
     - `slider_posts` (array)
     - `breaking_posts` (array)
     - `homepage_page` (object or null)

2. **Articles API:**
   - Visit: `http://localhost:8000/api/articles/`
   - ✅ Returns list of published articles
   - ✅ Supports query params:
     - `category=news` - Filter by category slug
     - `lang=en` - Filter by language
     - `is_featured=true` - Get featured articles
     - `page=1` - Pagination
     - `page_size=20` - Results per page

3. **Article Detail API:**
   - Visit: `http://localhost:8000/api/articles/test-article-1/`
   - ✅ Returns single article object
   - ✅ Includes full content, category, images
   - ✅ View count increments on each request

4. **Categories API:**
   - Visit: `http://localhost:8000/api/categories/`
   - ✅ Returns list of active categories
   - ✅ Supports `lang` filter: `?lang=en`

5. **Category Detail API:**
   - Visit: `http://localhost:8000/api/categories/news/`
   - ✅ Returns single category by slug
   - ✅ Includes name, slug, language, menu_order

6. **Pages API:**
   - Visit: `http://localhost:8000/api/pages/about-us/`
   - ✅ Returns page with sections
   - ✅ Sections are ordered by `order` field
   - ✅ Only active sections included

7. **Menus API:**
   - Visit: `http://localhost:8000/api/menus/?menu_type=navbar`
   - ✅ Returns navbar menu items
   - ✅ Items ordered by `order` field
   - ✅ Only active items included

### 16.2 Test CMS API Endpoints (Requires Authentication)

1. **Dashboard Stats:**
   - Use Postman or browser with token
   - GET: `http://localhost:8000/api/dashboard/stats/`
   - Headers: `Authorization: Bearer <access_token>`
   - ✅ Returns stats object with counts

2. **CMS Posts:**
   - GET: `http://localhost:8000/api/cms/posts/`
   - ✅ Returns posts (filtered by user role)
   - ✅ Writers see only their posts
   - ✅ Editors/Admins see all posts

3. **CMS Categories:**
   - GET: `http://localhost:8000/api/cms/categories/`
   - ✅ Returns all categories (for authenticated users)

---

## 📸 17. Visual Testing & UI Verification

### 17.1 Test Responsive Design

1. **Mobile View (375px - 767px):**
   - Open DevTools → Toggle device toolbar (Ctrl+Shift+M)
   - Test on mobile device sizes
   - ✅ Sidebar slides in/out on mobile
   - ✅ Navbar is responsive
   - ✅ Article cards stack vertically
   - ✅ Forms are mobile-friendly
   - ✅ Buttons are touch-friendly

2. **Tablet View (768px - 1024px):**
   - ✅ Layout adapts appropriately
   - ✅ Sidebar can be toggled
   - ✅ Grid layouts adjust

3. **Desktop View (1024px+):**
   - ✅ Full sidebar available
   - ✅ Multi-column layouts
   - ✅ Hover states work

### 17.2 Test UI Components

1. **Buttons:**
   - ✅ Hover effects work
   - ✅ Click states visible
   - ✅ Disabled states work
   - ✅ Loading states show spinner

2. **Forms:**
   - ✅ Input fields focus correctly
   - ✅ Validation errors display
   - ✅ Required field indicators (*)
   - ✅ Character counters work (SEO fields)

3. **Modals:**
   - ✅ Open/close animations work
   - ✅ Click outside closes modal
   - ✅ Escape key closes modal
   - ✅ Focus trap works

4. **Toast Notifications:**
   - ✅ Success messages appear (green)
   - ✅ Error messages appear (red)
   - ✅ Auto-dismiss after few seconds
   - ✅ Multiple toasts stack correctly

---

## 🎯 20. Final Comprehensive Test

### Complete End-to-End Scenario:

1. **Setup Phase:**
   - ✅ Login as admin
   - ✅ Create 3 categories: News, Sports, Tech
   - ✅ Create navbar menus for all 3 categories
   - ✅ Create "About Us" page
   - ✅ Create footer menu with About Us link

2. **Content Creation Phase:**
   - ✅ Create 5 published posts in News category:
     - 2 Featured posts
     - 1 Slider post
     - 1 Breaking news post
     - 1 Regular post
   - ✅ Create 3 draft posts
   - ✅ Create 2 pending posts

3. **Homepage Building Phase:**
   - ✅ Create homepage page (slug: `home`)
   - ✅ Add Hero section
   - ✅ Add Article List section (News category)
   - ✅ Add Banner section

4. **Public Website Verification:**
   - ✅ Visit homepage - all sections render
   - ✅ Click "News" menu - category page works
   - ✅ Click article - article page renders correctly
   - ✅ Click "About Us" - page displays
   - ✅ All links work
   - ✅ SEO tags are correct

5. **CMS Verification:**
   - ✅ Dashboard shows correct counts
   - ✅ Can edit/delete posts
   - ✅ Can manage categories
   - ✅ Can manage menus
   - ✅ User management works (if admin)

---

## ✅ COMPLETE TEST CHECKLIST SUMMARY

### Must Pass Before Production:

- [ ] ✅ All authentication flows work
- [ ] ✅ Dashboard displays correct stats
- [ ] ✅ Can create/edit/delete posts
- [ ] ✅ Rich text editor works
- [ ] ✅ Post workflow (Draft → Pending → Published) works
- [ ] ✅ Can create/edit/delete categories
- [ ] ✅ Can create/edit/delete menus
- [ ] ✅ Can create/edit/delete pages
- [ ] ✅ Homepage builder works
- [ ] ✅ Public homepage renders sections
- [ ] ✅ Category pages show articles
- [ ] ✅ Article pages render correctly
- [ ] ✅ Page pages work
- [ ] ✅ Navigation menus work
- [ ] ✅ Footer menus work
- [ ] ✅ SEO meta tags are correct
- [ ] ✅ Images upload and display
- [ ] ✅ Search/filter works
- [ ] ✅ Error handling works
- [ ] ✅ Role-based permissions work
- [ ] ✅ API endpoints return correct data
- [ ] ✅ Responsive design works
- [ ] ✅ No console errors
- [ ] ✅ No broken links

---

**Happy Testing! 🚀**

**Last Updated:** January 2026
