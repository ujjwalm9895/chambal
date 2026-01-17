# 🗄️ Database Quick Reference Guide

**Quick lookup for developers working with the Chambal Sandesh CMS database.**

---

## 📋 **Table Quick Reference**

| Table | Purpose | Key Fields | Relationships |
|-------|---------|------------|---------------|
| `users` | User accounts & authentication | `id`, `username`, `role`, `is_active` | → Posts (author) |
| `cms_category` | Content categories | `id`, `name`, `slug`, `language` | ← Posts, ← Menu |
| `cms_post` | News articles/posts | `id`, `title`, `slug`, `status`, `category_id`, `author_id` | ← Category, ← User |
| `cms_page` | Static pages | `id`, `title`, `slug`, `is_active` | → Sections, ← Menu |
| `cms_pagesection` | Page layout sections | `id`, `page_id`, `section_type`, `data`, `order` | ← Page |
| `cms_menu` | Navigation menus | `id`, `title`, `menu_type`, `link_type`, `order` | ← Category, ← Page |
| `cms_sitesettings` | Site configuration | `id` (always 1) | N/A (Singleton) |

---

## 🔑 **Primary Keys & Foreign Keys**

### **Primary Keys:**
- All tables: `id` (AUTO_INCREMENT INT)

### **Foreign Keys:**
```sql
cms_post.category_id → cms_category.id (SET NULL)
cms_post.author_id → users.id (SET NULL)
cms_pagesection.page_id → cms_page.id (CASCADE)
cms_menu.category_id → cms_category.id (CASCADE)
cms_menu.page_id → cms_page.id (CASCADE)
```

---

## 🎯 **Common Queries**

### **Get All Published Posts:**
```python
Post.objects.filter(status='published', publish_at__lte=timezone.now())
```

### **Get Posts by Category:**
```python
Post.objects.filter(category__slug='news', status='published')
```

### **Get Homepage Sections:**
```python
PageSection.objects.filter(page__slug='home', is_active=True).order_by('order')
```

### **Get Active Navbar Menu:**
```python
Menu.objects.filter(menu_type='navbar', is_active=True).order_by('order')
```

### **Get Featured Posts:**
```python
Post.objects.filter(is_featured=True, status='published')
```

### **Get Site Settings:**
```python
SiteSettings.objects.get(pk=1)  # or SiteSettings.get_settings()
```

---

## 📊 **Field Value Enums**

### **User Roles:**
- `'admin'` - Full access
- `'editor'` - Can edit all content
- `'writer'` - Can create posts, limited editing

### **Post Status:**
- `'draft'` - Not published
- `'pending'` - Awaiting review
- `'scheduled'` - Set to publish later
- `'published'` - Live on website

### **Language Codes:**
- `'en'` - English
- `'hi'` - Hindi

### **Menu Types:**
- `'navbar'` - Top navigation
- `'footer'` - Footer links

### **Link Types:**
- `'category'` - Links to category page
- `'page'` - Links to static page
- `'url'` - External URL

### **Section Types:**
- `'hero'` - Hero banner
- `'slider'` - Image/article slider
- `'article_list'` - List of articles
- `'banner'` - Promotional banner
- `'html'` - Custom HTML

---

## 🚨 **Constraints & Validations**

### **Unique Constraints:**
- `Post.slug` - Globally unique
- `Category(slug, language)` - Unique per language
- `Page.slug` - Globally unique
- `User.username` - Globally unique
- `SiteSettings.id` - Always 1 (singleton)

### **Required Fields:**
- `Post`: title, content, status
- `Category`: name, language
- `Page`: title
- `Menu`: title, menu_type, link_type
- `User`: username, password

### **Max Lengths:**
- `Post.title`: 300 chars
- `Post.seo_title`: 70 chars
- `Post.seo_description`: 160 chars
- `Category.name`: 200 chars
- `Page.title`: 200 chars

---

## 🔄 **Common Operations**

### **Create a Post:**
```python
post = Post.objects.create(
    title="Article Title",
    content="Rich HTML content...",
    author=user,
    category=category,
    status='draft'
)
```

### **Publish a Post:**
```python
post.status = 'published'
post.publish_at = timezone.now()
post.save()
```

### **Get Active Categories:**
```python
Category.objects.filter(is_active=True, language='en').order_by('menu_order')
```

### **Add Menu Item:**
```python
Menu.objects.create(
    title="News",
    menu_type='navbar',
    link_type='category',
    category=category,
    order=1
)
```

### **Get Homepage Data:**
```python
page = Page.objects.get(slug='home')
sections = page.sections.filter(is_active=True).order_by('order')
posts = Post.objects.filter(status='published')[:10]
```

---

## 📁 **Media File Paths**

- **Post Images:** `media/posts/{filename}`
- **Post Videos:** `media/posts/videos/{filename}`
- **Site Logo:** `media/settings/{filename}`
- **Site Favicon:** `media/settings/{filename}`

---

## 🔐 **Permission Checks**

### **Backend (Django):**
```python
# Check if user is admin/editor
if user.is_staff or user.role in ['admin', 'editor']:
    # Full access

# Check if user owns post or is editor+
if post.author == user or user.role in ['admin', 'editor']:
    # Can edit
```

### **Frontend (React):**
```javascript
const canEdit = user.role === 'admin' || user.role === 'editor' || post.author === user.id;
```

---

## 📈 **Indexes for Performance**

Key database indexes:
- `(status, publish_at)` on Post - Fast published post queries
- `(category_id, status)` on Post - Category filtering
- `(language, status)` on Post - Language filtering
- `is_featured`, `is_slider`, `is_breaking` on Post - Special content queries

---

## 🐛 **Common Issues & Solutions**

### **Issue: Duplicate slug error**
- **Cause:** Slug already exists
- **Fix:** Auto-append number (e.g., `news-1`)

### **Issue: Post not showing on website**
- **Check:** `status='published'` AND `publish_at <= now()`
- **Check:** `category.is_active = True`
- **Check:** `is_active` flags

### **Issue: Menu item not appearing**
- **Check:** `is_active = True`
- **Check:** `link_type` matches `category_id` or `page_id`
- **Check:** Linked category/page exists and is active

### **Issue: Homepage not loading**
- **Check:** Page with `slug='home'` exists
- **Check:** Page has `is_active = True`
- **Check:** Page has at least one active section

---

## 📚 **Related Documentation**

- Full schema: `DATABASE_SCHEMA.md`
- API endpoints: `README.md`
- Testing guide: `STEP_BY_STEP_TESTING_GUIDE.md`

---

*Quick reference for developers - See DATABASE_SCHEMA.md for complete documentation.*
