# 📤 How to Export/Import Database

**Guide to create .sql file from your local database (if needed).**

---

## 🎯 **Important: You Don't Need .sql File for Fresh Deployment!**

For **fresh deployment**, you don't need an SQL file. Just:
1. Create empty database in cPanel
2. Run `python manage.py migrate` on server

**Only create .sql file if you want to copy your LOCAL data to production!**

---

## 📤 **Option 1: Export Local Database (Windows)**

### **Using Command Prompt/PowerShell:**

```bash
# Navigate to backend directory
cd D:\chambal\backend

# Export database (replace with your actual database name)
mysqldump -u root -p chambal_sandesh > database_backup.sql

# Enter your MySQL password when prompted
```

**Note:** Make sure MySQL bin directory is in your PATH, or use full path:
```bash
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe" -u root -p chambal_sandesh > database_backup.sql
```

### **Find your MySQL installation:**
- Usually: `C:\Program Files\MySQL\MySQL Server 8.0\bin\`
- Or: `C:\xampp\mysql\bin\` (if using XAMPP)
- Or: `C:\wamp64\bin\mysql\mysql8.0.xx\bin\` (if using WAMP)

---

## 📤 **Option 2: Export Using phpMyAdmin (Local)**

If you have phpMyAdmin running locally:

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Select database: `chambal_sandesh`
3. Click **Export** tab
4. Select **Quick** or **Custom** method
5. Click **Go**
6. File will download as `.sql`

---

## 📤 **Option 3: Export Using MySQL Workbench**

1. Open MySQL Workbench
2. Connect to your database
3. Go to **Server** → **Data Export**
4. Select database: `chambal_sandesh`
5. Select all tables
6. Choose export location
7. Click **Start Export**

---

## 📥 **Import to cPanel (If You Export Data)**

If you created a `.sql` file and want to import it:

### **Using phpMyAdmin (cPanel):**

1. Login to cPanel
2. Click **phpMyAdmin**
3. Select your database (e.g., `yourusername_chambal`)
4. Click **Import** tab
5. Choose your `.sql` file
6. Click **Go**
7. Wait for import to complete

**⚠️ Important:** Only import if you want to copy your local data. For fresh setup, use migrations instead!

---

## ✅ **Recommended Approach for Deployment:**

### **Fresh Database (No Local Data to Copy):**
```bash
# On server via SSH
cd ~/api/backend
source venv/bin/activate
python manage.py migrate
python manage.py createsuperuser
python manage.py populate_dummy_data  # Optional: Add dummy data
```

### **Copy Local Data to Production:**
```bash
# Step 1: Export from local
mysqldump -u root -p chambal_sandesh > database_backup.sql

# Step 2: Upload database_backup.sql to server

# Step 3: Import via phpMyAdmin in cPanel
# OR via SSH:
mysql -u yourusername_chambal_user -p yourusername_chambal < database_backup.sql

# Step 4: Run migrations anyway (to ensure schema is up-to-date)
python manage.py migrate
```

---

## 📁 **Where to Save .sql File:**

If you create one, save it in:
```
D:\chambal\database_backup.sql
```

**⚠️ Security:** Don't commit .sql files to Git (they contain data)!  
The `.gitignore` already excludes `.sql` files.

---

## 🔍 **Check if You Have Local Data to Export:**

Check your local database:
```bash
# Activate virtual environment
cd D:\chambal\backend
venv\Scripts\activate

# Open Django shell
python manage.py shell

# Check post count
from cms.models import Post
print(f"Posts: {Post.objects.count()}")

# Check category count
from cms.models import Category
print(f"Categories: {Category.objects.count()}")

# Exit shell
exit()
```

**If counts are 0 or low, you probably don't need to export - just use migrations + populate_dummy_data!**

---

**Summary:**
- ✅ **Fresh deployment:** Use migrations (no .sql needed)
- ✅ **Copy local data:** Export .sql, then import via phpMyAdmin
- ✅ **Most common:** Just use migrations + `populate_dummy_data` command
