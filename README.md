# Custom CMS - Full-Stack Content Management System

A fully custom, production-ready Content Management System built with modern technologies. This CMS provides complete control over website content through a powerful admin panel and renders pages dynamically on the frontend.

## 🏗️ Architecture

- **Backend**: NestJS + PostgreSQL + Prisma
- **Admin Panel**: React + TypeScript + Material-UI
- **Website Frontend**: Next.js 14 + Tailwind CSS
- **Authentication**: JWT with role-based access control
- **API**: RESTful, versioned (`/api/v1`)

## 📁 Project Structure

```
.
├── backend/          # NestJS API server
├── admin/           # React admin panel
├── website/         # Next.js public website
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Git

### 1. Database Setup

**Option 1: Using psql (Recommended)**
```bash
# Connect to PostgreSQL and create database
psql -U postgres -c "CREATE DATABASE cms_db;"

# Or interactively:
psql -U postgres
CREATE DATABASE cms_db;
\q
```

**Option 2: Using pgAdmin (GUI)**
1. Open pgAdmin
2. Right-click "Databases" > Create > Database
3. Name: `cms_db` > Save

**Option 3: Using Docker**
```bash
docker run --name cms-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=cms_db -p 5432:5432 -d postgres:14
```

**Note:** If `psql` command is not found, ensure PostgreSQL is installed and added to your PATH. See `setup-database.md` for detailed instructions.

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
# On Windows (PowerShell):
Copy-Item env.template .env
# On Linux/Mac:
cp env.template .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://user:password@localhost:5432/cms_db?schema=public"
# JWT_SECRET="your-secret-key-here"

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
c

# Start development server
npm run start:dev
```

Backend will run on `http://localhost:3000`

### 3. Admin Panel Setup

```bash
cd admin

# Install dependencies
npm install

# Create .env file (optional, defaults work)
echo "VITE_API_URL=http://localhost:3000/api/v1" > .env

# Start development server
npm run dev
```

Admin panel will run on `http://localhost:3001`

### 4. Website Frontend Setup

```bash
cd website

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1" > .env.local

# Start development server
npm run dev
```

Website will run on `http://localhost:3002`

## 🔐 Default Credentials

After seeding the database:

- **Admin**: `admin@cms.com` / `admin123`
- **Editor**: `editor@cms.com` / `editor123`

## 📚 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (ADMIN, EDITOR)
- Secure password hashing with bcrypt
- Protected API routes

### Page Management
- Create, edit, delete pages
- Unique slug generation
- Draft/Published status
- SEO metadata (title, description)

### Dynamic Section Builder
- **5 Section Types**:
  - **Hero**: Large banner with heading, subheading, image, CTA button
  - **Text**: Rich text content with title
  - **Image**: Image with caption and alt text
  - **CTA**: Call-to-action section
  - **FAQ**: Frequently asked questions
- Drag & drop reordering
- Dynamic add/remove sections
- JSON-based flexible content storage

### Media Management
- Upload images and files
- Media library with preview
- File metadata storage
- Secure file serving

### Menu Management
- Create menus for header/footer
- Menu items with ordering
- Hierarchical menu support (parent/child)

### Website Rendering
- Dynamic page rendering by slug
- Section-based page composition
- SEO tags from CMS
- Only published pages visible
- Responsive design with Tailwind CSS

## 🛠️ API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Pages
- `GET /api/v1/pages` - List all pages (with `?includeDrafts=true` for drafts)
- `GET /api/v1/pages/public/:slug` - Get published page by slug (public)
- `GET /api/v1/pages/:id` - Get page by ID
- `POST /api/v1/pages` - Create page (auth required)
- `PATCH /api/v1/pages/:id` - Update page (auth required)
- `DELETE /api/v1/pages/:id` - Delete page (admin only)

### Sections
- `GET /api/v1/sections/page/:pageId` - Get sections for a page
- `POST /api/v1/sections` - Create section (auth required)
- `PATCH /api/v1/sections/:id` - Update section (auth required)
- `DELETE /api/v1/sections/:id` - Delete section (auth required)
- `POST /api/v1/sections/reorder` - Reorder sections (auth required)

### Media
- `GET /api/v1/media` - List all media (auth required)
- `POST /api/v1/media/upload` - Upload file (auth required)
- `GET /api/v1/media/:id` - Get media by ID (auth required)
- `DELETE /api/v1/media/:id` - Delete media (admin only)

### Menus
- `GET /api/v1/menus` - List all menus
- `GET /api/v1/menus/location/:location` - Get menu by location
- `POST /api/v1/menus` - Create menu (auth required)
- `POST /api/v1/menus/items` - Create menu item (auth required)
- `PATCH /api/v1/menus/items/:id` - Update menu item (auth required)
- `DELETE /api/v1/menus/:id` - Delete menu (admin only)

## 🗄️ Database Schema

### Users
- id, email, password, role (ADMIN/EDITOR), timestamps

### Pages
- id, title, slug (unique), status (DRAFT/PUBLISHED), seoTitle, seoDescription, timestamps

### Sections
- id, pageId, type (HERO/TEXT/IMAGE/CTA/FAQ), order, content (JSON), timestamps

### Media
- id, filename, originalName, mimeType, size, path, url, timestamps

### Menus
- id, name, location (unique), timestamps

### MenuItems
- id, menuId, label, url, order, parentId (for nested menus), timestamps

## 🎨 Admin Panel Features

1. **Dashboard**: Overview with statistics
2. **Pages**: List, create, edit pages
3. **Page Editor**:
   - Page metadata (title, slug, status)
   - Section builder with drag & drop
   - Rich text editor for text sections
   - SEO settings
4. **Media Library**: Upload and manage files
5. **Menus**: Manage navigation menus

## 🌐 Website Features

- Dynamic routing based on page slugs
- Section-based page rendering
- SEO-optimized with meta tags from CMS
- Responsive design
- Header and footer menus from CMS

## 🔧 Development

### Backend
```bash
cd backend
npm run start:dev      # Development with hot reload
npm run build         # Build for production
npm run start:prod    # Run production build
```

### Admin Panel
```bash
cd admin
npm run dev           # Development server
npm run build         # Production build
```

### Website
```bash
cd website
npm run dev           # Development server
npm run build         # Production build
npm run start         # Production server
```

## 📦 Production Deployment

### Backend
1. Set environment variables in production
2. Run migrations: `npm run prisma:migrate deploy`
3. Build: `npm run build`
4. Start: `npm run start:prod`

### Admin Panel
1. Build: `npm run build`
2. Serve static files from `dist/` directory

### Website
1. Set `NEXT_PUBLIC_API_URL` to production API URL
2. Build: `npm run build`
3. Start: `npm run start`

## 🔒 Security Considerations

- JWT tokens with expiration
- Password hashing with bcrypt
- Role-based access control
- Input validation with class-validator
- CORS configuration
- SQL injection protection (Prisma)
- File upload validation

## 🧪 Testing

Seed data includes:
- 2 users (admin, editor)
- 2 sample pages (home, about)
- Sample sections
- Sample menus

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/cms_db?schema=public"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001,http://localhost:3002
MEDIA_UPLOAD_PATH=./uploads
MEDIA_BASE_URL=http://localhost:3000/uploads
```

### Admin (.env)
```env
VITE_API_URL=http://localhost:3000/api/v1
```

### Website (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## 🤝 Contributing

This is a custom CMS built from scratch. Feel free to extend and customize according to your needs.

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🎯 Next Steps

- Add more section types
- Implement media optimization
- Add page templates
- Implement versioning/history
- Add webhooks
- Implement caching
- Add analytics

---

Built with ❤️ using NestJS, React, and Next.js
