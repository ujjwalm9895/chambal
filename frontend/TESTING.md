# Local Testing Checklist for Chambal Sandesh Backend Migration

This checklist guides you through verifying the migrated Next.js backend functionality locally.

## Prerequisites
- [ ] MySQL is running locally.
- [ ] `.env` file is configured with `DATABASE_URL` pointing to your local MySQL instance.
- [ ] `npm install` has been run to install dependencies.
- [ ] `npx prisma db push` has been run to apply the schema to the local database.
- [ ] `npx prisma db seed` (if available) or manual data creation has been performed.

## 1. Authentication & User Management
- [ ] **Login**: Visit `/cms/login`. Log in with a valid user (e.g., admin/admin).
  - [ ] Verify successful redirect to Dashboard.
  - [ ] Verify "Invalid credentials" error for wrong password.
- [ ] **Logout**: Click Logout in the Topbar. Verify redirect to login page.
- [ ] **RBAC**: Log in as a "Writer".
  - [ ] Try to access `/cms/settings`. Should be restricted (if middleware/layout enforces it).
  - [ ] Try to publish a post. Should be blocked or forced to "Pending".

## 2. Posts Management (Core Workflow)
- [ ] **Create Draft**:
  - [ ] Go to "Add Post".
  - [ ] Fill title, content.
  - [ ] Select Status: "Draft".
  - [ ] Save. Verify it appears in the list with "Draft" status.
- [ ] **Workflow Transition**:
  - [ ] Edit the draft. Change status to "Pending". Save.
  - [ ] Log in as Editor/Admin.
  - [ ] Edit the pending post. Change status to "Published". Save.
  - [ ] Verify status is "Published".
- [ ] **Validation**:
  - [ ] Try to create a post without a Title. Verify error message.
- [ ] **Slug Generation**:
  - [ ] Create a post with title "Hello World". Verify slug is `hello-world`.
  - [ ] Create another post with title "Hello World". Verify slug is `hello-world-1` (or similar unique slug).
- [ ] **Bulk Upload**:
  - [ ] Go to "Bulk Upload".
  - [ ] Upload a CSV file with headers: `title,content,status`.
  - [ ] Verify posts are created.

## 3. Categories & Menus
- [ ] **Categories**:
  - [ ] Create a category "Politics" (en).
  - [ ] Create a category "Politics" (hi) if allowed (or different slug).
  - [ ] Verify they appear in lists.
- [ ] **Menus**:
  - [ ] Create a Navbar menu item pointing to a Category.
  - [ ] Verify it appears in the frontend Navbar.

## 4. Frontend (Public View)
- [ ] **Homepage**:
  - [ ] Visit `http://localhost:3000`.
  - [ ] Verify the "Home" page content loads (Slider, Featured Posts).
- [ ] **Article Page**:
  - [ ] Click on a published article.
  - [ ] Verify the article detail page loads (`/article/[slug]`).
- [ ] **Category Page**:
  - [ ] Click on a category in Navbar.
  - [ ] Verify category page loads with list of articles.
- [ ] **Language Filtering**:
  - [ ] (If UI supports it) Check if Hindi articles appear only when Hindi is selected or in Hindi categories.

## 5. Server Actions & Security
- [ ] **Direct Access**:
  - [ ] Verify that Server Actions cannot be called without authentication (except public ones).
  - [ ] (Code Review) Ensure `auth()` check is present in all CMS actions.

## 6. Database
- [ ] **Persistence**: Restart the dev server (`npm run dev`). Verify data persists.
- [ ] **Prisma Studio**: Run `npx prisma studio`. Check data integrity in the browser.

---
**Status**: Ready for Verification.
