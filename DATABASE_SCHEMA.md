# 🗄️ Database Schema Documentation - Chambal Sandesh CMS

**Complete Database Management System (DBMS) Documentation**

This document provides comprehensive documentation of the database schema for the Chambal Sandesh CMS. The system is fully data-driven, meaning all website content is managed through the database.

---

## 📊 **Database Overview**

**Database Type:** MySQL 8.0+  
**ORM:** Django ORM  
**Total Tables:** 6 Core Tables (+ Django built-in tables: auth_user, sessions, etc.)

---

## 📋 **Entity Relationship Diagram (ERD)**

```
┌──────────────┐
│     User     │
│──────────────│
│ id (PK)      │
│ username     │
│ email        │
│ name         │
│ role         │──┐
│ phone        │  │
│ is_active    │  │
└──────────────┘  │
                  │
                  │ (1:N)
                  │
                  ├─────────────────────────────────┐
                  │                                 │
┌──────────────┐  │                   ┌─────────────┐
│    Post      │◄─┼───────────────────┤  Category   │
│──────────────│  │                   │─────────────│
│ id (PK)      │  │                   │ id (PK)     │
│ title        │  │                   │ name        │
│ slug (UQ)    │  │                   │ slug        │
│ content      │  │                   │ language    │
│ excerpt      │  │                   │ menu_order  │
│ featured_img │  │                   │ is_active   │
│ video        │  │                   └─────────────┘
│ video_url    │  │                           │
│ category (FK)├──┘                           │
│ author (FK)  ├───────────────────────────────┘
│ language     │                    (1:N)
│ status       │
│ is_featured  │
│ is_slider    │
│ is_breaking  │
│ is_recommended│
│ publish_at   │
│ seo_title    │
│ seo_desc     │
│ views_count  │
│ created_at   │
│ updated_at   │
└──────────────┘
       │
       │ (1:N)
       │
┌──────────────┐
│  PageSection │
│──────────────│
│ id (PK)      │
│ page (FK)    ├──┐
│ section_type │  │
│ data (JSON)  │  │
│ order        │  │
│ is_active    │  │
└──────────────┘  │
                  │
                  │ (N:1)
                  │
┌──────────────┐  │
│     Page     │◄─┘
│──────────────│
│ id (PK)      │
│ title        │
│ slug (UQ)    │
│ seo_title    │
│ seo_desc     │
│ is_active    │
│ created_at   │
│ updated_at   │
└──────────────┘
       │
       │ (1:N)
       │
┌──────────────┐
│     Menu     │
│──────────────│
│ id (PK)      │
│ title        │
│ menu_type    │
│ link_type    │
│ category (FK)├──┐
│ page (FK)    ├─┼─┐
│ external_url │  │ │
│ order        │  │ │
│ is_active    │  │ │
└──────────────┘  │ │
                  │ │
        ┌─────────┘ │
        │           │
        ▼           ▼
  ┌─────────┐ ┌─────────┐
  │Category │ │  Page   │
  └─────────┘ └─────────┘

┌──────────────┐
│ SiteSettings │ (Singleton)
│──────────────│
│ id (PK) = 1  │
│ site_name    │
│ site_tagline │
│ site_logo    │
│ contact_*    │
│ social_*     │
│ seo_defaults │
│ analytics    │
└──────────────┘
```

---

## 📦 **Table Structures**

### **1. users (User Model)**

**Table Name:** `users`  
**Description:** Custom user model extending Django's AbstractUser with role-based access control.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| `username` | VARCHAR(150) | UNIQUE, NOT NULL | Login username |
| `email` | VARCHAR(254) | NULL | User email address |
| `password` | VARCHAR(128) | NOT NULL | Hashed password (Django) |
| `first_name` | VARCHAR(150) | NULL | User's first name |
| `last_name` | VARCHAR(150) | NULL | User's last name |
| `name` | VARCHAR(255) | NULL | Full name (computed) |
| `phone` | VARCHAR(15) | NULL | Contact phone number |
| `role` | VARCHAR(20) | NOT NULL, DEFAULT='writer' | Role: 'admin', 'editor', 'writer' |
| `is_active` | BOOLEAN | DEFAULT=True | Account active status |
| `is_staff` | BOOLEAN | DEFAULT=False | Django admin access |
| `is_superuser` | BOOLEAN | DEFAULT=False | Superuser privileges |
| `date_joined` | DATETIME | AUTO | Account creation timestamp |
| `last_login` | DATETIME | NULL | Last login timestamp |
| `created_at` | DATETIME | AUTO | Record creation time |
| `updated_at` | DATETIME | AUTO_UPDATE | Last update time |

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE: `username`

**Relationships:**
- One-to-Many: User → Posts (author field)

**Default Users:**
- `admin` / `admin123` (Role: admin, is_superuser=True)
- `editor1` / `editor123` (Role: editor)

---

### **2. cms_category (Category Model)**

**Table Name:** `cms_category`  
**Description:** Content categories for organizing posts. Supports multiple languages (English/Hindi).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique category identifier |
| `name` | VARCHAR(200) | NOT NULL | Category name |
| `slug` | VARCHAR(200) | NULL | URL-friendly slug |
| `language` | VARCHAR(2) | NOT NULL, DEFAULT='en' | Language: 'en' or 'hi' |
| `show_in_menu` | BOOLEAN | DEFAULT=True | Display in navigation menu |
| `menu_order` | INT UNSIGNED | DEFAULT=0 | Menu display order |
| `is_active` | BOOLEAN | DEFAULT=True | Category active status |
| `created_at` | DATETIME | AUTO | Record creation time |
| `updated_at` | DATETIME | AUTO_UPDATE | Last update time |

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE TOGETHER: `(slug, language)` - Same slug allowed per language

**Relationships:**
- One-to-Many: Category → Posts
- One-to-Many: Category → Menu Items

**Example Data:**
- `{name: "News", slug: "news", language: "en"}`
- `{name: "समाचार", slug: "samachar", language: "hi"}`

---

### **3. cms_post (Post Model)**

**Table Name:** `cms_post`  
**Description:** Main content model for news articles/posts. Supports rich text, media, and workflow states.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique post identifier |
| `title` | VARCHAR(300) | NOT NULL | Post title |
| `slug` | VARCHAR(255) | UNIQUE, NULL | URL-friendly slug |
| `content` | TEXT | NOT NULL | Rich text content (HTML) |
| `excerpt` | VARCHAR(500) | NULL | Short description/excerpt |
| `featured_image` | VARCHAR(100) | NULL | Path to featured image file |
| `video` | VARCHAR(100) | NULL | Path to uploaded video file |
| `video_url` | VARCHAR(200) | NULL | External video URL (YouTube/Vimeo) |
| `category_id` | INT | FOREIGN KEY, NULL | Reference to cms_category |
| `author_id` | INT | FOREIGN KEY, NULL | Reference to users |
| `language` | VARCHAR(2) | NOT NULL, DEFAULT='en' | Language: 'en' or 'hi' |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT='draft' | Status: 'draft', 'pending', 'scheduled', 'published' |
| `is_featured` | BOOLEAN | DEFAULT=False | Featured post flag |
| `is_slider` | BOOLEAN | DEFAULT=False | Show in slider |
| `is_breaking` | BOOLEAN | DEFAULT=False | Breaking news flag |
| `is_recommended` | BOOLEAN | DEFAULT=False | Recommended post flag |
| `publish_at` | DATETIME | NULL | Scheduled publish date/time |
| `seo_title` | VARCHAR(70) | NULL | SEO meta title |
| `seo_description` | VARCHAR(160) | NULL | SEO meta description |
| `views_count` | INT UNSIGNED | DEFAULT=0 | Number of views |
| `created_at` | DATETIME | AUTO | Record creation time |
| `updated_at` | DATETIME | AUTO_UPDATE | Last update time |

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE: `slug`
- INDEX: `(status, publish_at)` - For filtering published posts
- INDEX: `(category_id, status)` - For category filtering
- INDEX: `(author_id, status)` - For author filtering
- INDEX: `is_featured` - For featured posts query
- INDEX: `is_slider` - For slider posts query
- INDEX: `is_breaking` - For breaking news query
- INDEX: `(language, status)` - For language filtering

**Foreign Keys:**
- `category_id` → `cms_category(id)` ON DELETE SET NULL
- `author_id` → `users(id)` ON DELETE SET NULL

**Relationships:**
- Many-to-One: Post → Category
- Many-to-One: Post → User (author)

**Workflow States:**
1. **draft** - Work in progress, not visible publicly
2. **pending** - Submitted for review (writers → editors/admins)
3. **scheduled** - Set to publish at future `publish_at` time
4. **published** - Live on website (visible to public)

**Media Storage:**
- Images: `media/posts/{filename}`
- Videos: `media/posts/videos/{filename}`

---

### **4. cms_page (Page Model)**

**Table Name:** `cms_page`  
**Description:** Static pages (About Us, Privacy Policy, etc.) with dynamic sections capability.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique page identifier |
| `title` | VARCHAR(200) | NOT NULL | Page title |
| `slug` | VARCHAR(200) | UNIQUE, NULL | URL-friendly slug (unique across all pages) |
| `seo_title` | VARCHAR(70) | NULL | SEO meta title |
| `seo_description` | VARCHAR(160) | NULL | SEO meta description |
| `is_active` | BOOLEAN | DEFAULT=True | Page active status |
| `created_at` | DATETIME | AUTO | Record creation time |
| `updated_at` | DATETIME | AUTO_UPDATE | Last update time |

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE: `slug`

**Relationships:**
- One-to-Many: Page → Page Sections
- One-to-Many: Page → Menu Items

**Special Page:**
- Slug `'home'` is treated as the homepage with dynamic sections

---

### **5. cms_pagesection (PageSection Model)**

**Table Name:** `cms_pagesection`  
**Description:** Dynamic sections for pages. Allows flexible page layouts without hardcoding.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique section identifier |
| `page_id` | INT | FOREIGN KEY, NOT NULL | Reference to cms_page |
| `section_type` | VARCHAR(20) | NOT NULL | Type: 'hero', 'slider', 'article_list', 'banner', 'html' |
| `data` | JSON | NOT NULL | Section-specific configuration data |
| `order` | INT UNSIGNED | NOT NULL, DEFAULT=0 | Display order (lower = first) |
| `is_active` | BOOLEAN | DEFAULT=True | Section active status |
| `created_at` | DATETIME | AUTO | Record creation time |
| `updated_at` | DATETIME | AUTO_UPDATE | Last update time |

**Indexes:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `page_id` → `cms_page(id)` ON DELETE CASCADE

**Section Types & Data Structure:**

1. **hero** - Hero/banner section
   ```json
   {
     "title": "Welcome to Chambal Sandesh",
     "subtitle": "Your trusted news source",
     "image": "/media/hero.jpg",
     "cta_text": "Read More",
     "cta_link": "/articles"
   }
   ```

2. **slider** - Image/article slider
   ```json
   {
     "title": "Featured Stories",
     "post_ids": [1, 2, 3],
     "limit": 10
   }
   ```

3. **article_list** - List of articles
   ```json
   {
     "title": "Latest News",
     "limit": 6,
     "category": 1,
     "featured": false,
     "lang": "en"
   }
   ```

4. **banner** - Promotional banner
   ```json
   {
     "title": "Special Offer",
     "content": "Subscribe to our newsletter",
     "image": "/media/banner.jpg",
     "link": "/subscribe",
     "style": "primary"
   }
   ```

5. **html** - Custom HTML content
   ```json
   {
     "html": "<div><h2>Custom Content</h2></div>"
   }
   ```

**Relationships:**
- Many-to-One: PageSection → Page (CASCADE delete)

---

### **6. cms_menu (Menu Model)**

**Table Name:** `cms_menu`  
**Description:** Dynamic menu system for navbar and footer. Links can point to categories, pages, or external URLs.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique menu item identifier |
| `title` | VARCHAR(200) | NOT NULL | Menu item display text |
| `menu_type` | VARCHAR(20) | NOT NULL | Type: 'navbar' or 'footer' |
| `link_type` | VARCHAR(20) | NOT NULL | Link type: 'category', 'page', 'url' |
| `category_id` | INT | FOREIGN KEY, NULL | Reference to cms_category (if link_type='category') |
| `page_id` | INT | FOREIGN KEY, NULL | Reference to cms_page (if link_type='page') |
| `external_url` | VARCHAR(200) | NULL | External URL (if link_type='url') |
| `order` | INT UNSIGNED | NOT NULL, DEFAULT=0 | Display order within menu_type |
| `is_active` | BOOLEAN | DEFAULT=True | Menu item active status |
| `created_at` | DATETIME | AUTO | Record creation time |
| `updated_at` | DATETIME | AUTO_UPDATE | Last update time |

**Indexes:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `category_id` → `cms_category(id)` ON DELETE CASCADE
- FOREIGN KEY: `page_id` → `cms_page(id)` ON DELETE CASCADE

**Relationships:**
- Many-to-One: Menu → Category (optional, for category links)
- Many-to-One: Menu → Page (optional, for page links)

**URL Generation Logic:**
- `link_type='category'` → `/category/{category.slug}/`
- `link_type='page'` → `/page/{page.slug}/`
- `link_type='url'` → `external_url` (as-is)

---

### **7. cms_sitesettings (SiteSettings Model)**

**Table Name:** `cms_sitesettings`  
**Description:** Site-wide configuration (Singleton pattern - only one record, ID=1).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY = 1 | Always ID=1 (singleton) |
| `site_name` | VARCHAR(200) | DEFAULT='Chambal Sandesh' | Website name/title |
| `site_tagline` | VARCHAR(300) | NULL | Site tagline/description |
| `site_logo` | VARCHAR(100) | NULL | Path to logo image |
| `site_favicon` | VARCHAR(100) | NULL | Path to favicon image |
| `contact_email` | VARCHAR(254) | NULL | Contact email address |
| `contact_phone` | VARCHAR(20) | NULL | Contact phone number |
| `contact_address` | TEXT | NULL | Contact address |
| `facebook_url` | VARCHAR(200) | NULL | Facebook page URL |
| `twitter_url` | VARCHAR(200) | NULL | Twitter profile URL |
| `instagram_url` | VARCHAR(200) | NULL | Instagram profile URL |
| `youtube_url` | VARCHAR(200) | NULL | YouTube channel URL |
| `linkedin_url` | VARCHAR(200) | NULL | LinkedIn profile URL |
| `default_seo_title` | VARCHAR(70) | NULL | Default SEO title for pages |
| `default_seo_description` | VARCHAR(160) | NULL | Default SEO description |
| `default_seo_keywords` | VARCHAR(200) | NULL | Default SEO keywords (comma-separated) |
| `posts_per_page` | INT UNSIGNED | DEFAULT=20 | Number of posts per listing page |
| `enable_comments` | BOOLEAN | DEFAULT=False | Enable comments feature |
| `enable_registration` | BOOLEAN | DEFAULT=False | Allow user registration |
| `maintenance_mode` | BOOLEAN | DEFAULT=False | Enable maintenance mode |
| `maintenance_message` | TEXT | NULL | Message to show during maintenance |
| `google_analytics_id` | VARCHAR(50) | NULL | Google Analytics Tracking ID |
| `facebook_pixel_id` | VARCHAR(50) | NULL | Facebook Pixel ID |
| `created_at` | DATETIME | AUTO | Record creation time |
| `updated_at` | DATETIME | AUTO_UPDATE | Last update time |

**Indexes:**
- PRIMARY KEY: `id` (always 1)

**Special Behavior:**
- Singleton pattern: Only one record allowed (ID=1)
- `get_settings()` class method: Returns or creates the single instance

---

## 🔗 **Relationship Summary**

### **One-to-Many Relationships:**

1. **User → Posts**
   - One user can author many posts
   - Foreign Key: `Post.author_id` → `User.id`
   - On Delete: SET NULL (posts remain if user deleted)

2. **Category → Posts**
   - One category can have many posts
   - Foreign Key: `Post.category_id` → `Category.id`
   - On Delete: SET NULL (posts remain if category deleted)

3. **Category → Menu Items**
   - One category can be linked by many menu items
   - Foreign Key: `Menu.category_id` → `Category.id`
   - On Delete: CASCADE (menu items deleted with category)

4. **Page → Page Sections**
   - One page can have many sections
   - Foreign Key: `PageSection.page_id` → `Page.id`
   - On Delete: CASCADE (sections deleted with page)

5. **Page → Menu Items**
   - One page can be linked by many menu items
   - Foreign Key: `Menu.page_id` → `Page.id`
   - On Delete: CASCADE (menu items deleted with page)

---

## 📊 **Data Flow Architecture**

### **Public Website Data Flow:**

```
User Request → Next.js Frontend → Django REST API → MySQL Database
                    ↓
            Cache/Transform
                    ↓
            Render Dynamic Content
```

**API Endpoints:**
- `/api/homepage/` → Aggregates all homepage data
- `/api/articles/` → Fetches published posts
- `/api/categories/{slug}/` → Category details with posts
- `/api/articles/{slug}/` → Individual post details

### **CMS Data Flow:**

```
Admin Action → CMS Frontend → Django REST API (JWT Auth) → MySQL Database
                    ↓
            Validation & Permissions
                    ↓
            CRUD Operations
                    ↓
            Return Updated Data
```

**API Endpoints:**
- `/api/cms/posts/` → Post management
- `/api/cms/categories/` → Category management
- `/api/cms/pages/` → Page management
- `/api/cms/menus/` → Menu management
- `/api/cms/settings/` → Site settings
- `/api/cms/users/` → User management (admin only)

---

## 🔍 **Key Database Queries**

### **Get Published Posts:**
```sql
SELECT * FROM cms_post 
WHERE status = 'published' 
  AND (publish_at IS NULL OR publish_at <= NOW())
ORDER BY publish_at DESC;
```

### **Get Posts by Category:**
```sql
SELECT p.* FROM cms_post p
JOIN cms_category c ON p.category_id = c.id
WHERE c.slug = 'news' 
  AND p.status = 'published'
  AND p.language = 'en';
```

### **Get Homepage Sections:**
```sql
SELECT ps.* FROM cms_pagesection ps
JOIN cms_page p ON ps.page_id = p.id
WHERE p.slug = 'home' 
  AND ps.is_active = 1
ORDER BY ps.order ASC;
```

### **Get Active Menu Items:**
```sql
SELECT m.*, 
       COALESCE(c.slug, p.slug) as target_slug,
       m.link_type
FROM cms_menu m
LEFT JOIN cms_category c ON m.category_id = c.id AND m.link_type = 'category'
LEFT JOIN cms_page p ON m.page_id = p.id AND m.link_type = 'page'
WHERE m.is_active = 1
  AND m.menu_type = 'navbar'
ORDER BY m.order ASC;
```

---

## 📈 **Performance Optimizations**

### **Indexes:**
- Post status/publish_at for fast published post queries
- Category/status composite index for category filtering
- Language/status for language-based filtering
- Featured/slider/breaking flags for special post queries

### **Query Optimizations:**
- `select_related()` for ForeignKey relationships (category, author)
- `prefetch_related()` for reverse ForeignKey (page sections)
- Pagination on all list endpoints (20 items per page)

### **Media Storage:**
- Images stored in `media/posts/`
- Videos stored in `media/posts/videos/`
- Static files served via Django's static files handling

---

## 🔐 **Data Integrity Rules**

1. **Slug Uniqueness:**
   - Post slugs must be globally unique
   - Category slugs unique per language
   - Page slugs globally unique

2. **Cascade Deletes:**
   - Delete page → Delete all page sections
   - Delete category → Delete all menu items linking to it
   - Delete page → Delete all menu items linking to it

3. **SET NULL on Delete:**
   - Delete user → Post.author_id set to NULL (post preserved)
   - Delete category → Post.category_id set to NULL (post preserved)

4. **Singleton Pattern:**
   - SiteSettings always has ID=1 (enforced in model)

---

## 🎯 **Data-Driven Features**

All website content is dynamically generated from the database:

1. **Homepage Layout:** Controlled by Page with slug='home' and its sections
2. **Navigation Menu:** Generated from Menu table (menu_type='navbar')
3. **Footer Menu:** Generated from Menu table (menu_type='footer')
4. **Category Pages:** Dynamically generated based on Category slug
5. **Article Pages:** Dynamically generated based on Post slug
6. **Static Pages:** Generated from Page table
7. **SEO Meta Tags:** Generated from Post/Page/Category SEO fields
8. **Featured Content:** Filtered using Post flags (is_featured, is_slider, etc.)

---

## 📝 **Migration History**

- `0001_initial` - Initial schema (User, Category, Post, Page, PageSection, Menu)
- `0004_sitesettings` - Added SiteSettings model
- `0005_post_video_post_video_url` - Added video support to Post model

---

## 🚀 **Backup & Maintenance**

### **Backup Database:**
```bash
mysqldump -u username -p database_name > backup.sql
```

### **Restore Database:**
```bash
mysql -u username -p database_name < backup.sql
```

### **Database Size:**
- Typical: 50-500 MB (depending on media files)
- Media files stored separately in `media/` directory

---

**Last Updated:** Database schema is version-controlled via Django migrations  
**Migration Files:** `backend/cms/migrations/` and `backend/users/migrations/`

---

*This is a complete data-driven CMS where every piece of content is managed through the database, allowing for full dynamic control without code changes.*
