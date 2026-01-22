# Chambal Sandesh CMS - Local Operation Guide

This guide provides step-by-step instructions to set up, run, and operate the Chambal Sandesh CMS locally. This project has been migrated from a Django backend to a pure Next.js 14+ Server Actions backend.

## Prerequisites

Ensure you have the following installed on your machine:
1.  **Node.js**: v18.17.0 or later.
2.  **MySQL**: Local MySQL server (or MariaDB).
3.  **Git**: For version control.

## 1. Project Setup

### Install Dependencies
Open a terminal in the `frontend` directory:
```bash
cd frontend
npm install
```

### Database Setup
1.  Start your local MySQL server.
2.  Create a new database (e.g., `chambal_cms`).
3.  Configure the environment variables:
    *   Create a `.env` file in the `frontend` directory (if not exists).
    *   Add your database connection string and NextAuth secret.

**Example `.env`:**
```env
# Database Connection (Adjust user, password, port, database name)
DATABASE_URL="mysql://root:password@localhost:3306/chambal_cms"

# NextAuth Configuration
AUTH_SECRET="your-super-secret-key-at-least-32-chars" # Generate with: openssl rand -base64 32
AUTH_URL="http://localhost:3000"
```

### Initialize Database Schema
Push the Prisma schema to your local database:
```bash
npx prisma db push
```
*This command creates all necessary tables in your MySQL database.*

### Seed Initial Data
Populate the database with the default admin user and initial settings:
```bash
node prisma/seed.js
```
*   **Default Admin Credentials:**
    *   Email: `admin@example.com`
    *   Password: `admin`

## 2. Running the Application

Start the local development server:
```bash
npm run dev
```
Access the application at: [http://localhost:3000](http://localhost:3000)

## 3. CMS Operation Guide

### Accessing the Admin Panel
1.  Go to `http://localhost:3000/cms`.
2.  Log in with the default credentials (`admin@example.com` / `admin`).

### User Management
*   **Create User**: Go to **Users** -> **Add User**. Assign roles (Admin, Editor, Writer).
*   **RBAC**:
    *   **Admin**: Full access.
    *   **Editor**: Can publish posts, manage categories/pages.
    *   **Writer**: Can create posts (Draft/Pending), cannot publish.

### Multi-Language Content
The CMS supports **English (en)** and **Hindi (hi)**.
*   **Posts/Pages/Categories**: When creating or editing, select the "Language" dropdown.
*   **Slugs**: Slugs are unique *per language*. You can have a "home" slug for English and a "home" slug for Hindi.
*   **Menus**: Create separate menus for English and Hindi. The frontend will fetch the appropriate menu based on the context.

### Post Workflow
1.  **Draft**: Initial status for writers. Visible only to author and editors/admins.
2.  **Pending**: Writer submits for review.
3.  **Scheduled**: Set a future "Publish Date". Content appears automatically after that date (logic handled by query).
4.  **Published**: Live on the website.

### Media Management
*   **Featured Images**: Upload directly in the Post editor. Images are saved to `public/uploads/posts`.

## 4. Troubleshooting

*   **Database Connection Error**: Check your `DATABASE_URL` in `.env`. Ensure MySQL is running.
*   **Prisma Error**: Run `npx prisma generate` to refresh the Prisma client if you change the schema.
*   **"Unauthorized" Actions**: Ensure you are logged in. If session issues persist, clear cookies or restart the server.

## 5. Directory Structure (Backend)
*   `lib/prisma.ts`: Prisma client instance.
*   `lib/actions/`: Server Actions (backend logic).
    *   `posts.ts`: Post CRUD and workflow.
    *   `users.ts`: User management.
    *   `public.ts`: Public-facing data fetching.
*   `prisma/schema.prisma`: Database schema definition.
*   `auth.ts`: NextAuth.js configuration (Credentials provider).
