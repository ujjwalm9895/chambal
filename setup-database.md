# Database Setup Guide

## Option 1: Using psql (Command Line)

If PostgreSQL is installed but `createdb` is not in your PATH:

```bash
# Connect to PostgreSQL
psql -U postgres

# Then run these SQL commands:
CREATE DATABASE cms_db;
\q
```

Or in one line:
```bash
psql -U postgres -c "CREATE DATABASE cms_db;"
```

## Option 2: Using pgAdmin (GUI) - Detailed Guide

pgAdmin is a visual tool that comes with PostgreSQL installation. It's the easiest way to create and manage databases.

### Step 1: Launch pgAdmin

1. **Find pgAdmin 4**:
   - Press `Win` key and type "pgAdmin"
   - Or look in Start Menu → PostgreSQL 15 → pgAdmin 4
   - Or search: `C:\Program Files\PostgreSQL\15\pgAdmin 4\bin\pgAdmin4.exe`

2. **First Launch**:
   - pgAdmin opens in your web browser (usually `http://127.0.0.1:XXXXX`)
   - You may be prompted to set a master password (for pgAdmin itself)
   - **Note**: This is different from your PostgreSQL password!

### Step 2: Connect to PostgreSQL Server

1. **In the left sidebar**, you'll see:
   ```
   Servers
     └── PostgreSQL 15 (or your version)
   ```

2. **Expand "Servers"** → Click on "PostgreSQL 15"

3. **Enter Password**:
   - If prompted, enter the password you set during PostgreSQL installation
   - This is the `postgres` user password
   - Check "Save password" if you want (optional)

4. **Connection Successful**: You should see the server expand with folders like:
   - Databases
   - Login/Group Roles
   - Tablespaces

### Step 3: Create the Database

1. **Navigate to Databases**:
   - Expand "PostgreSQL 15" → Expand "Databases"
   - You'll see default databases like `postgres`, `template0`, `template1`

2. **Create New Database**:
   - **Right-click** on "Databases" folder
   - Select **"Create"** → **"Database..."**
   
   OR
   
   - Click on "Databases" folder to select it
   - Click the **"Create"** button in the toolbar
   - Select **"Database..."** from dropdown

3. **Database Dialog Opens**:
   - You'll see a dialog with multiple tabs

4. **General Tab**:
   - **Database name**: Type `cms_db`
   - **Owner**: Leave as `postgres` (default)
   - **Comment**: Optional (e.g., "CMS Database")

5. **Definition Tab** (Optional):
   - **Template**: Leave as `template0` (default)
   - **Encoding**: Leave as `UTF8` (default)
   - **Collation**: Leave as default
   - **Character Type**: Leave as default

6. **Security Tab** (Optional):
   - You can set privileges here if needed
   - For now, leave defaults

7. **Parameters Tab** (Optional):
   - Advanced settings - leave defaults for now

8. **Save**:
   - Click the **"Save"** button (or press `Ctrl+S`)
   - The database `cms_db` will appear in the Databases list

### Step 4: Verify Database Creation

1. **Check the Database**:
   - In the left sidebar, expand "Databases"
   - You should see `cms_db` listed
   - Expand `cms_db` to see its structure (Schemas, Tables, etc.)

2. **Test Connection** (Optional):
   - Right-click on `cms_db` → **"Query Tool"**
   - Type: `SELECT version();`
   - Click the **Execute** button (or press `F5`)
   - You should see PostgreSQL version information

### Visual Guide (What You'll See)

```
pgAdmin Interface:
┌─────────────────────────────────────┐
│  Left Sidebar:                      │
│  ▼ Servers                          │
│    ▼ PostgreSQL 15                 │
│      ▼ Databases                    │
│        ▼ postgres                   │
│        ▼ template0                  │
│        ▼ template1                  │
│        ▼ cms_db  ← Your new DB!    │
│      Login/Group Roles              │
│      Tablespaces                    │
└─────────────────────────────────────┘
```

### Troubleshooting

**Problem: "pgAdmin won't start"**
- Solution: Make sure PostgreSQL service is running
  - Open Services (`Win + R` → `services.msc`)
  - Find "postgresql-x64-15" → Start it

**Problem: "Connection refused"**
- Solution: PostgreSQL service not running (see above)

**Problem: "Password authentication failed"**
- Solution: Use the password you set during PostgreSQL installation
- If forgotten, you may need to reset it (see PostgreSQL docs)

**Problem: "Database already exists"**
- Solution: The database is already created! You're good to go.
- To delete and recreate: Right-click `cms_db` → Delete/Drop → Confirm

**Problem: "Can't find pgAdmin"**
- Solution: It should be in Start Menu under PostgreSQL folder
- Or search for `pgAdmin4.exe` in Program Files

### Next Steps

After creating `cms_db`:

1. **Update your `.env` file** in `backend/`:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/cms_db?schema=public"
   ```

2. **Continue with backend setup**:
   ```bash
   cd backend
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

### Tips

- **Save Connection**: pgAdmin can save your password for convenience
- **Query Tool**: Use it to run SQL commands directly
- **Refresh**: Right-click → Refresh if you don't see changes
- **Backup**: Right-click database → Backup to create database backups

## Option 3: Check PostgreSQL Installation

If `psql` is also not found, PostgreSQL might not be installed or not in your PATH.

### Windows Installation:
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Install PostgreSQL (remember the password you set for the `postgres` user)
3. During installation, make sure to add PostgreSQL to PATH

### Verify Installation:
```bash
# Check if PostgreSQL is installed
psql --version

# If not found, you may need to add PostgreSQL bin to PATH:
# C:\Program Files\PostgreSQL\<version>\bin
```

## Option 4: Using Docker (Alternative)

If you prefer Docker:

```bash
# Run PostgreSQL in Docker
docker run --name cms-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=cms_db -p 5432:5432 -d postgres:14

# Then your DATABASE_URL would be:
# postgresql://postgres:postgres@localhost:5432/cms_db?schema=public
```

## After Creating Database

Once the database is created, continue with the backend setup:

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```
