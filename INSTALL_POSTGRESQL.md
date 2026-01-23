# PostgreSQL Installation Guide for Windows

## What to Install

### Option 1: PostgreSQL with pgAdmin (Recommended for Beginners)

**Download and Install:**
1. Go to: https://www.postgresql.org/download/windows/
2. Click "Download the installer" → Choose **PostgreSQL 14 or 15**
3. Or use direct link: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

**During Installation:**
- ✅ **Installation Directory**: Default (`C:\Program Files\PostgreSQL\15`)
- ✅ **Data Directory**: Default (`C:\Program Files\PostgreSQL\15\data`)
- ✅ **Password**: Set a password for `postgres` superuser (REMEMBER THIS!)
- ✅ **Port**: Default `5432` (keep this)
- ✅ **Locale**: Default
- ✅ **Stack Builder**: Uncheck (not needed for basic setup)

**Important:** During installation, check:
- ✅ "Add PostgreSQL bin directory to PATH" (if available)
- Or manually add: `C:\Program Files\PostgreSQL\15\bin` to your PATH

**What Gets Installed:**
- PostgreSQL Server (database engine)
- pgAdmin 4 (GUI tool for managing databases)
- Command-line tools (`psql`, `createdb`, etc.)
- PostgreSQL documentation

---

### Option 2: PostgreSQL via Chocolatey (If you have Chocolatey)

```powershell
# Install PostgreSQL
choco install postgresql --params '/Password:YourPassword'

# Or with specific version
choco install postgresql14 --params '/Password:YourPassword'
```

---

### Option 3: PostgreSQL via Scoop (If you have Scoop)

```powershell
scoop bucket add versions
scoop install postgresql14
```

---

## After Installation

### 1. Verify Installation

Open PowerShell and run:
```powershell
psql --version
```

If you see a version number, PostgreSQL is installed correctly!

### 2. Add to PATH (If not automatically added)

If `psql --version` doesn't work:

1. Find PostgreSQL installation (usually `C:\Program Files\PostgreSQL\15\bin`)
2. Add to PATH:
   - Press `Win + X` → System → Advanced system settings
   - Click "Environment Variables"
   - Under "System variables", find "Path" → Edit
   - Click "New" → Add: `C:\Program Files\PostgreSQL\15\bin`
   - Click OK on all dialogs
   - **Restart PowerShell/Terminal**

### 3. Start PostgreSQL Service

```powershell
# Check if service is running
Get-Service postgresql*

# Start service (if not running)
Start-Service postgresql-x64-15  # Replace 15 with your version
```

Or use Services app:
- Press `Win + R` → type `services.msc`
- Find "postgresql-x64-15" → Right-click → Start

---

## Create Database

### Method 1: Using psql (Command Line)

```powershell
# Connect to PostgreSQL
psql -U postgres

# Enter your password when prompted
# Then run:
CREATE DATABASE cms_db;

# Exit
\q
```

### Method 2: Using pgAdmin (GUI - Easier!)

1. Open **pgAdmin 4** (installed with PostgreSQL)
2. Enter your `postgres` password when prompted
3. Expand "Servers" → "PostgreSQL 15" → "Databases"
4. Right-click "Databases" → Create → Database
5. Name: `cms_db`
6. Click "Save"

### Method 3: One-liner

```powershell
psql -U postgres -c "CREATE DATABASE cms_db;"
```

---

## Update Your .env File

After creating the database, update `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/cms_db?schema=public"
```

Replace `YOUR_PASSWORD` with the password you set during installation.

---

## Troubleshooting

### "psql: command not found"
- PostgreSQL not in PATH → Add bin directory to PATH (see above)
- Or use full path: `"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres`

### "Connection refused" or "Cannot connect"
- PostgreSQL service not running → Start the service (see above)

### "Password authentication failed"
- Wrong password → Use the password you set during installation
- Reset password: https://www.postgresql.org/docs/current/auth-methods.html

### "Database already exists"
- Database already created → You're good to go!

---

## Quick Test

```powershell
# Test connection
psql -U postgres -d cms_db -c "SELECT version();"
```

If this works, you're all set! 🎉

---

## Alternative: Use Cloud Database (No Installation Needed)

If you don't want to install PostgreSQL locally:

1. **Supabase** (Free tier): https://supabase.com
   - Sign up → Create project → Get connection string

2. **Neon** (Free tier): https://neon.tech
   - Sign up → Create project → Get connection string

3. **Railway** (Free tier): https://railway.app
   - Sign up → New → PostgreSQL → Get connection string

Then use the connection string directly in your `.env` file!
