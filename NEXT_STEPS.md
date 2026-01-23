# Next Steps After Opening pgAdmin

## Step 1: Add/Connect to PostgreSQL Server

Since you see the "Servers" section in pgAdmin, you need to connect to your PostgreSQL server:

### If you see "Servers" but no server listed:

1. **Right-click on "Servers"** in the left sidebar
2. Select **"Register" → "Server..."**
3. **General Tab**:
   - **Name**: `PostgreSQL 15` (or any name you prefer)
4. **Connection Tab**:
   - **Host name/address**: `localhost` (or `127.0.0.1`)
   - **Port**: `5432` (default)
   - **Maintenance database**: `postgres`
   - **Username**: `postgres`
   - **Password**: Enter the password you set during PostgreSQL installation
   - ✅ Check "Save password" (optional, for convenience)
5. Click **"Save"**

### If you already see a server listed:

1. **Click on the server** (e.g., "PostgreSQL 15")
2. **Enter password** when prompted
3. The server will expand showing:
   - Databases
   - Login/Group Roles
   - Tablespaces

---

## Step 2: Create the Database

1. **Expand your server** → **Expand "Databases"**
2. **Right-click on "Databases"** folder
3. Select **"Create" → "Database..."**
4. **In the dialog**:
   - **General Tab**:
     - **Database name**: `cms_db`
     - **Owner**: `postgres` (default)
   - **Click "Save"**
5. **Verify**: You should see `cms_db` appear in the Databases list

---

## Step 3: Update Your .env File

1. **Open** `backend/.env` (or create it from `env.template`)
2. **Update the DATABASE_URL**:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/cms_db?schema=public"
   ```
   Replace `YOUR_PASSWORD` with your actual PostgreSQL password

---

## Step 4: Run Backend Setup Commands

Open your terminal in the `backend` folder and run:

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations (creates tables)
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed
```

**Expected Output:**
- ✅ Prisma client generated
- ✅ Database tables created
- ✅ Sample data inserted (admin user, pages, sections, menus)

---

## Step 5: Start the Backend Server

```bash
npm run start:dev
```

You should see:
```
🚀 CMS Backend running on http://localhost:3000/api/v1
```

---

## Step 6: Verify Everything Works

### Test the API:
Open browser and visit:
- `http://localhost:3000/api/v1/pages` (should return pages list)

### Check in pgAdmin:
1. Expand `cms_db` → **Schemas** → **public** → **Tables**
2. You should see tables:
   - `users`
   - `pages`
   - `sections`
   - `media`
   - `menus`
   - `menu_items`

---

## Step 7: Start Admin Panel

In a **new terminal**:

```bash
cd admin
npm install
npm run dev
```

Admin panel will run on `http://localhost:3001`

**Login with:**
- Email: `admin@cms.com`
- Password: `admin123`

---

## Step 8: Start Website Frontend

In **another terminal**:

```bash
cd website
npm install
npm run dev
```

Website will run on `http://localhost:3002`

Visit: `http://localhost:3002/home` to see your CMS-powered website!

---

## Quick Checklist

- [ ] PostgreSQL server connected in pgAdmin
- [ ] Database `cms_db` created
- [ ] `.env` file updated with database credentials
- [ ] Prisma client generated
- [ ] Database migrations run
- [ ] Database seeded with sample data
- [ ] Backend server running (port 3000)
- [ ] Admin panel running (port 3001)
- [ ] Website running (port 3002)

---

## Troubleshooting

**"Migration failed" or "Connection error"**
- Check `.env` file has correct DATABASE_URL
- Verify PostgreSQL service is running
- Check password is correct

**"Port already in use"**
- Another process is using the port
- Change PORT in `.env` or stop the other process

**"Module not found"**
- Run `npm install` in the respective folder

---

## You're All Set! 🎉

Once all three services are running, you have:
- ✅ Backend API at `http://localhost:3000`
- ✅ Admin Panel at `http://localhost:3001`
- ✅ Website at `http://localhost:3002`

Start creating pages and content in the admin panel!
