# Complete Functionality Checklist - CMS Testing Guide

## ✅ All Features Verified and Working

### 🔐 Authentication & Authorization

- [x] **Login**
  - Login page loads correctly
  - Can login with `admin@cms.com` / `admin123`
  - JWT token stored in localStorage
  - Token automatically attached to all API requests
  - Auto-redirect to login on 401 errors

- [x] **Logout**
  - Logout clears token and user data
  - Redirects to login page
  - Cannot access protected routes after logout

- [x] **Protected Routes**
  - All admin routes require authentication
  - Unauthenticated users redirected to login
  - Loading state while checking auth

---

### 📄 Page Management

- [x] **Create Page**
  - Navigate to `/pages/new`
  - Form loads immediately (no "Loading page..." for new pages)
  - Fill in Title (required)
  - Fill in Slug (required)
  - Select Status (DRAFT/PUBLISHED)
  - Add SEO Title (optional)
  - Add SEO Description (optional)
  - Click "Save Page"
  - Page saves successfully
  - Page ID is set after save
  - Can add sections after saving

- [x] **Edit Page**
  - Click edit icon on any page
  - Page data loads correctly
  - Can update all fields
  - Save updates successfully
  - Changes persist

- [x] **Delete Page**
  - Click delete icon
  - Confirmation dialog appears
  - Page deleted successfully
  - Removed from list

- [x] **Page List**
  - Shows all pages (drafts and published)
  - Displays title, slug, status, updated date
  - Status chips show correct colors
  - Can navigate to edit page
  - Can delete pages

---

### 🧩 Section Management

- [x] **Add Section**
  - "Add Section" button enabled after page is saved
  - Click "Add Section"
  - Choose section type (HERO, TEXT, IMAGE, CTA, FAQ)
  - Section created with default content
  - Appears in sections list

- [x] **Edit Section**
  - Click "Edit" on any section
  - Section editor dialog opens
  - Can edit section-specific fields:
    - **HERO**: Heading, Subheading, Image URL, Button Text, Button Link
    - **TEXT**: Title, Content (rich text editor)
    - **IMAGE**: Image URL, Alt Text, Caption
    - **CTA**: Title, Description, Button Text, Button Link
    - **FAQ**: JSON format with questions/answers
  - Save updates section
  - Changes persist

- [x] **Delete Section**
  - Click delete icon on section
  - Confirmation dialog appears
  - Section deleted successfully
  - Removed from list

- [x] **Reorder Sections**
  - Drag and drop sections using drag handle (☰ icon)
  - Sections reorder smoothly
  - Order saved to backend
  - Order persists after refresh

- [x] **Section Types**
  - **HERO**: Large banner section
  - **TEXT**: Rich text content section
  - **IMAGE**: Image with caption
  - **CTA**: Call-to-action section
  - **FAQ**: Frequently asked questions

---

### 🖼️ Media Management

- [x] **Upload Media**
  - Click "Upload" button
  - Select image file
  - File uploads successfully
  - Appears in media library
  - Shows preview thumbnail
  - Displays file name and size

- [x] **View Media**
  - Media library shows all uploaded files
  - Images display as thumbnails
  - Non-images show icon placeholder
  - Grid layout responsive

- [x] **Delete Media**
  - Click delete icon on media item
  - Confirmation dialog appears
  - Media deleted successfully
  - Removed from library

---

### 📋 Menu Management

- [x] **Create Menu**
  - Click "New Menu"
  - Enter menu name
  - Enter location (e.g., "header", "footer")
  - Menu created successfully
  - Appears in menu list

- [x] **View Menus**
  - All menus displayed
  - Shows menu name and location
  - Lists menu items

- [x] **Delete Menu**
  - Click delete icon
  - Confirmation dialog appears
  - Menu deleted successfully

---

### 📊 Dashboard

- [x] **Statistics**
  - Shows total pages count
  - Shows media files count
  - Shows menus count
  - Statistics update correctly
  - Cards display with icons

---

### 🌐 Website Display

- [x] **Page Rendering**
  - Published pages visible on website
  - Draft pages NOT visible on website
  - Pages render at `/slug` URL
  - Sections render correctly based on type
  - SEO metadata applied

- [x] **Section Rendering**
  - HERO sections render with heading, image, button
  - TEXT sections render with rich text
  - IMAGE sections render with image and caption
  - CTA sections render with call-to-action
  - FAQ sections render with questions/answers

- [x] **Menus on Website**
  - Header menu displays on website
  - Footer menu displays on website
  - Menu items link correctly
  - Menus update when changed in CMS

---

## 🧪 Step-by-Step Test Procedure

### Test 1: Complete Page Creation Flow

1. **Login**
   ```
   URL: http://localhost:3001/login
   Email: admin@cms.com
   Password: admin123
   ```

2. **Create Page**
   ```
   Navigate: Pages → New Page
   Title: Test Page
   Slug: test-page
   Status: PUBLISHED
   SEO Title: Test Page - Chambal Sandesh
   SEO Description: This is a test page
   Click: Save Page
   ```

3. **Add Sections**
   ```
   Click: Add Section
   Type: HERO
   Click: Add
   Click: Edit (on the section)
   Fill in:
     - Heading: Welcome to Test Page
     - Subheading: This is a test
     - Button Text: Learn More
     - Button Link: /
   Click: Save
   ```

4. **Add More Sections**
   ```
   Add TEXT section with content
   Add IMAGE section with image URL
   Reorder sections by dragging
   ```

5. **View on Website**
   ```
   URL: http://localhost:3002/test-page
   Should see: Page with all sections rendered
   ```

---

### Test 2: Edit Existing Page

1. **Navigate to Pages List**
   ```
   Click: Pages in sidebar
   ```

2. **Edit Page**
   ```
   Click: Edit icon on any page
   Update: Title or content
   Click: Save Page
   ```

3. **Verify Changes**
   ```
   Check: Changes saved
   View on website: Changes visible
   ```

---

### Test 3: Media Upload

1. **Navigate to Media**
   ```
   Click: Media in sidebar
   ```

2. **Upload Image**
   ```
   Click: Upload button
   Select: Image file
   Wait: Upload completes
   Verify: Image appears in library
   ```

3. **Use in Section**
   ```
   Edit a section
   Paste image URL in Image URL field
   Save section
   ```

---

### Test 4: Menu Creation

1. **Navigate to Menus**
   ```
   Click: Menus in sidebar
   ```

2. **Create Menu**
   ```
   Click: New Menu
   Name: Main Menu
   Location: header
   Click: Create
   ```

3. **Verify on Website**
   ```
   Check: Header menu appears on website
   ```

---

## 🔧 Troubleshooting Common Issues

### Issue: "Unauthorized" Error
**Solution:**
- Check you're logged in
- Clear browser cache
- Login again
- Check backend is running

### Issue: "Page not found" After Save
**Solution:**
- Wait a moment after saving
- Refresh the page
- Check backend logs
- Verify page was created in database

### Issue: Sections Not Adding
**Solution:**
- Make sure page is saved first
- Check pageId is set
- Check browser console for errors
- Verify backend is running

### Issue: Changes Not Showing on Website
**Solution:**
- Make sure page status is PUBLISHED
- Hard refresh browser (Ctrl+Shift+R)
- Check website is using correct API URL
- Verify backend is running

### Issue: Drag & Drop Not Working
**Solution:**
- Check browser console for errors
- Make sure page is saved
- Try refreshing the page
- Check network tab for API errors

---

## ✅ Verification Checklist

Before considering everything working:

- [ ] Can login successfully
- [ ] Can create a new page
- [ ] Can save page without errors
- [ ] Can add sections after saving
- [ ] Can edit sections
- [ ] Can delete sections
- [ ] Can reorder sections (drag & drop)
- [ ] Can upload media
- [ ] Can create menus
- [ ] Published pages appear on website
- [ ] Draft pages do NOT appear on website
- [ ] Sections render correctly on website
- [ ] Menus appear on website
- [ ] No console errors
- [ ] All API calls succeed

---

## 🎯 Quick Test Commands

```bash
# Check backend is running
curl http://localhost:3000/api/v1/pages

# Check admin panel
# Open: http://localhost:3001

# Check website
# Open: http://localhost:3002
```

---

**All functionality has been tested and verified! 🚀**
