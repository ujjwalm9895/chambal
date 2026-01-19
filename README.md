# Chambal Sandesh - Custom CMS + News Website

A production-ready, fully data-driven CMS-based news website built with Django REST Framework (Backend) and Next.js (Frontend). Features a **custom CMS panel** (NOT Django Admin) with complete workflow management.

## Project Overview

**Chambal Sandesh** is a complete CMS solution where:
- **Custom CMS Panel** - Built with Next.js (not Django Admin)
- **JWT Authentication** - Secure token-based auth
- **Post Workflow** - Draft → Pending → Scheduled → Published
- **Role-Based Access** - Admin, Editor, Writer roles
- **Bulk Upload** - CSV import for posts
- **Homepage Builder** - Dynamic sections management
- **Multi-Language** - Hindi + English support
- **Everything CMS-Driven** - Zero hardcoded content

## Tech Stack

### Backend
- **Django 4.2** - Web framework
- **Django REST Framework** - API development
- **MySQL** - Database
- **JWT** - Authentication (djangorestframework-simplejwt)
- **Pandas** - CSV processing for bulk upload

### Frontend
- **Next.js 14** - React framework (App Router)
- **Tailwind CSS** - Styling
- **TipTap** - Rich text editor
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## Project Structure

```
chambal/
├── backend/
│   ├── config/              # Django project settings
│   ├── users/               # User management + JWT auth
│   ├── cms/                 # CMS app
│   │   ├── models.py        # Post, Category, Menu, Page, PageSection
│   │   ├── cms_views.py     # CMS APIs (authenticated)
│   │   ├── public_views.py  # Public APIs (no auth)
│   │   ├── permissions.py   # Role-based permissions
│   │   └── urls.py
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── cms/             # CMS Panel routes
│   │   │   ├── layout.js    # CMS Layout with sidebar
│   │   │   ├── page.js      # Dashboard
│   │   │   ├── login/
│   │   │   ├── posts/
│   │   │   ├── categories/
│   │   │   └── ...
│   │   ├── page.js          # Public homepage
│   │   ├── article/[slug]/
│   │   ├── category/[slug]/
│   │   └── page/[slug]/
│   ├── components/
│   │   ├── cms/             # CMS components
│   │   └── sections/        # Dynamic section renderers
│   ├── lib/
│   │   ├── api.js           # Public API client
│   │   └── cms-api.js       # CMS API client (with JWT)
│   └── package.json
│
└── README.md
```

## 🗄️ Database Models

### User
- `name`, `email`, `username`, `password`
- `role` (admin/editor/writer)
- `is_active`

### Post (was Article)
- `title`, `slug`, `content` (rich text), `excerpt`
- `category`, `author`, `language` (en/hi)
- `status` (draft/pending/scheduled/published)
- `is_featured`, `is_slider`, `is_breaking`, `is_recommended`
- `publish_at` (scheduling)
- `seo_title`, `seo_description`
- `views_count`

### Category
- `name`, `slug`, `language` (en/hi)
- `show_in_menu`, `menu_order`, `is_active`

### Menu
- `title`, `menu_type` (navbar/footer)
- `link_type` (category/page/url)
- `order`, `is_active`

### Page & PageSection
- `Page`: `title`, `slug`, SEO fields
- `PageSection`: `section_type` (hero/slider/article_list/banner/html), `data` (JSON), `order`

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 18+
- MySQL 8.0+
- pip and npm

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Configure database:**
   - Create MySQL database:
   ```sql
   CREATE DATABASE chambal_sandesh CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

5. **Configure environment variables:**
   - Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   - Edit `.env` with your database credentials:
   ```
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   DB_NAME=chambal_sandesh
   DB_USER=root
   DB_PASSWORD=your-password
   DB_HOST=localhost
   DB_PORT=3306
   ```

6. **Run migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

7. **Create superuser:**
```bash
python manage.py createsuperuser
```

8. **Run development server:**
```bash
python manage.py runserver
```

Backend will run on `http://localhost:8000`
- Admin panel (fallback): `http://localhost:8000/admin`
- API: `http://localhost:8000/api`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Configure environment variables:**
   - Create `.env.local`:
   ```bash
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   ```

4. **Run development server:**
```bash
npm run dev
# or
yarn dev
```

Frontend will run on `http://localhost:3000`
- Public website: `http://localhost:3000`
- CMS panel: `http://localhost:3000/cms`

## 📡 API Endpoints

### Auth APIs (Public)
- `POST /api/auth/login/` - Login (returns JWT tokens)
- `POST /api/auth/logout/` - Logout (blacklist refresh token)
- `GET /api/auth/me/` - Get current user (requires JWT)

### CMS APIs (Authenticated)
- `GET /api/cms/dashboard/stats/` - Dashboard statistics
- `CRUD /api/cms/posts/` - Post management
- `POST /api/cms/posts/bulk-upload/` - Bulk CSV upload
- `POST /api/cms/posts/{id}/approve/` - Approve pending post
- `CRUD /api/cms/categories/` - Category management
- `CRUD /api/cms/menus/` - Menu management
- `CRUD /api/cms/pages/` - Page management
- `CRUD /api/cms/page-sections/` - Page section management

### Public APIs (No Auth)
- `GET /api/homepage/homepage/` - Homepage data
- `GET /api/articles/` - Get articles (filters: category, lang, featured, etc.)
- `GET /api/articles/{slug}/` - Get single article
- `GET /api/categories/` - Get categories
- `GET /api/menus/` - Get menus
- `GET /api/pages/{slug}/` - Get page with sections

## 🔐 Authentication

### Login Flow
1. User logs in via `/cms/login`
2. Backend returns JWT `access` and `refresh` tokens
3. Frontend stores tokens in `localStorage`
4. All CMS API calls include `Authorization: Bearer {access_token}`
5. Token auto-refreshes on 401 errors

### Roles & Permissions
- **Admin**: Full access to all features
- **Editor**: Can approve posts, manage content (except users)
- **Writer**: Can create/edit own posts, cannot approve

## CMS Panel Features

### Dashboard
- Statistics cards (Total, Published, Pending, Drafts, Scheduled, etc.)
- Clickable cards → filtered post list
- Real-time stats from API

### Post Management
- **Post Editor**: Rich text editor (TipTap), image upload, workflow controls
- **Post Listing**: Filter by status, featured, slider, breaking
- **Workflow**: Draft → Pending → Scheduled → Published
- **Bulk Upload**: CSV import with validation

### Homepage Builder
- Create/edit pages with dynamic sections
- Section types: Hero, Slider, Article List, Banner, HTML
- Drag-and-drop ordering
- Preview sections

### Content Management
- **Categories**: Create with language support (en/hi)
- **Menus**: Navbar and footer menus
- **Pages**: Custom pages with SEO
- **Users**: User management (Admin only)

## Public Website

### Homepage
- Dynamically renders sections from CMS
- Featured posts, slider, breaking news
- No hardcoded content

### Pages
- `/` - Homepage
- `/article/[slug]` - Article detail
- `/category/[slug]` - Category listing
- `/page/[slug]` - Custom page

### Dynamic Section Rendering
```javascript
switch(section.section_type) {
  case "hero":
  case "slider":
  case "article_list":
  case "banner":
  case "html":
}
```

## Post Workflow

1. **Draft** - Writer creates post (not visible on website)
2. **Pending** - Writer submits for review (visible to editors)
3. **Scheduled** - Editor schedules for future publish
4. **Published** - Post is live on website

### Status Transitions
- Writer: Draft → Pending
- Editor/Admin: Pending → Published (or Scheduled)
- Editor/Admin: Can directly publish drafts

## Bulk Upload

### CSV Format
Required columns:
- `title` - Post title
- `content` - Post content
- `category` - Category name

Optional columns:
- `status` - draft/pending/published/scheduled
- `language` - en/hi
- `excerpt` - Brief description
- `publish_at` - Scheduled publish date/time

### Usage
1. Go to **CMS → Bulk Post Upload**
2. Upload CSV file
3. Preview validation errors
4. Confirm upload

## Multi-Language Support

- Categories support Hindi (`hi`) and English (`en`)
- Posts can be in Hindi or English
- Filter by language: `?lang=hi`
- Language switch in CMS topbar

## SEO Features

- Dynamic meta tags per post/page
- OpenGraph support
- Server-side rendering (Next.js SSR)
- SEO-friendly URLs (slug-based)
- Custom SEO title and description

## 🚦 Development Workflow

1. **Start Backend:**
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access:**
   - Public website: `http://localhost:3000`
   - CMS panel: `http://localhost:3000/cms`
   - Login with superuser credentials

## Testing the CMS

For comprehensive testing instructions, see **[TESTING_GUIDE.md](TESTING_GUIDE.md)**.

Quick test checklist:
1. Create test categories (English and Hindi)
2. Create navbar and footer menus
3. Create posts with different statuses
4. Test workflow: Draft → Pending → Published
5. Build homepage with sections
6. Verify all content renders on public website

**For detailed step-by-step testing instructions, refer to `TESTING_GUIDE.md`**

## Key Features

 **Custom CMS Panel** - Built with Next.js, not Django Admin  
 **JWT Authentication** - Secure token-based auth  
 **Post Workflow** - Complete draft → published flow  
 **Role-Based Access** - Admin, Editor, Writer roles  
 **Bulk Upload** - CSV import for posts  
 **Homepage Builder** - Dynamic sections management  
 **Multi-Language** - Hindi and English support  
 **SEO Optimized** - Meta tags, OpenGraph, SSR  
 **Production Ready** - Scalable architecture  

## Troubleshooting

### Backend Issues
- **Database connection error**: Check MySQL credentials in `.env`
- **JWT errors**: Ensure `djangorestframework-simplejwt` is installed
- **Migration errors**: Run `python manage.py migrate --run-syncdb`

### Frontend Issues
- **API connection error**: Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
- **CORS errors**: Ensure `django-cors-headers` is configured
- **JWT token errors**: Clear localStorage and re-login

## Production Deployment

### Backend:
- Set `DEBUG=False`
- Configure proper `ALLOWED_HOSTS`
- Use production database
- Set up proper secret key
- Configure static/media file serving
- Set up JWT token blacklist

### Frontend:
- Build: `npm run build`
- Start: `npm start`
- Configure production API URL
- Set up reverse proxy if needed

## License

This project is built for production use.

---

**Built with ❤️ for Chambal Sandesh**

For questions or issues, refer to the Django and Next.js documentation.
