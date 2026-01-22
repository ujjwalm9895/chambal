# Local Testing Checklist

Use this checklist to verify that the migrated backend works correctly on your local machine.

## 1. Setup & Initialization
- [ ] **Dependencies**: `npm install` runs without errors.
- [ ] **Database**: Local MySQL is running and `DATABASE_URL` is set in `.env`.
- [ ] **Schema Push**: `npx prisma db push` succeeds.
- [ ] **Seeding**: `node prisma/seed.js` runs and creates the admin user.

## 2. Authentication & Users
- [ ] **Login**: Can log in with `admin@example.com` / `admin`.
- [ ] **Session**: User is redirected to `/cms` or Dashboard after login.
- [ ] **Create User**: Admin can create a new user (e.g., "Editor User" with role "Editor").
- [ ] **Role Logic**:
    - [ ] Login as "Writer": Verify cannot publish posts (only Draft/Pending).
    - [ ] Login as "Editor": Verify can publish posts.

## 3. Content Management (Posts)
- [ ] **Create Post (English)**: Create a post with title "Hello World" (Language: English).
- [ ] **Slug Generation**: Verify slug becomes `hello-world`.
- [ ] **Create Post (Hindi)**: Create a post with title "Namaste" (Language: Hindi).
- [ ] **Slug Uniqueness**: Create another English post "Hello World". Verify slug becomes `hello-world-1`.
- [ ] **Workflow**:
    - [ ] Save as **Draft**.
    - [ ] Save as **Pending**.
    - [ ] Save as **Published** (as Admin/Editor).
- [ ] **Image Upload**: Upload a featured image. Verify it appears in `public/uploads/posts`.

## 4. Multi-Language Support
- [ ] **Pages**: Create a page "About" (English) and "About" (Hindi). Both should be saveable with slug `about` (scoped by language).
- [ ] **Menus**: Create a Navbar menu for English and another for Hindi.
- [ ] **Filtering**: Verify the Post list in Admin allows filtering by Language.

## 5. Public Facing Data (Simulation)
Since there is no frontend change, we verify the data availability via logs or database inspection.
- [ ] **Public Homepage**: Verify `getPublicHomepage('en')` returns English content.
- [ ] **Public Article**: Verify `getPublicArticle('hello-world', 'en')` returns the English post.

## 6. Cleanup
- [ ] **Delete**: Verify deleting a post works.
- [ ] **Delete User**: Verify deleting a user works.
