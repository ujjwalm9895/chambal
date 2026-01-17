# 🔐 SSH Setup Guide for cPanel

**Complete guide to access your cPanel server via SSH and set up Python virtual environment.**

---

## 📋 **Step 1: Enable SSH Access in cPanel**

### **1.1 Check if SSH is Already Enabled**

1. **Login to cPanel**
2. **Look for "Terminal" or "SSH Access"** in the main dashboard
   - If you see it, SSH might already be enabled
   - If not, continue to enable it

### **1.2 Enable SSH Access**

**Option A: Via cPanel Interface**

1. **Login to cPanel**
2. **Go to:** `Security` → `SSH Access` (or search "SSH" in search bar)
3. **Click "Manage SSH Keys"** or **"Enable SSH Access"**
4. **If prompted, click "Enable SSH"**
5. **Note your SSH details:**
   - **Host:** Usually `yourdomain.com` or `server.yourhosting.com`
   - **Port:** Usually `22` (default SSH port)
   - **Username:** Your cPanel username
   - **Password:** Your cPanel password (or use SSH keys)

**Option B: Contact Your Hosting Provider**

Some hosting providers require you to:
- Request SSH access via support ticket
- Provide identification
- Wait for approval (usually 24-48 hours)

**Popular Hosting Providers:**
- **Hostinger:** Enable via cPanel → Security → SSH Access
- **Bluehost:** Contact support to enable
- **SiteGround:** Already enabled, use Site Tools → SSH Keys
- **A2 Hosting:** Enable via cPanel → Security → SSH Access
- **Namecheap:** Enable via cPanel → Advanced → SSH Access

---

## 🔑 **Step 2: Connect via SSH**

### **2.1 Windows: Using PowerShell (Built-in)**

**Windows 10/11 has SSH built-in:**

```powershell
# Connect to server
ssh username@yourdomain.com

# Or with port (if different from 22)
ssh -p 22 username@yourdomain.com

# Example:
ssh ujjwal@chambalsandesh.com
```

**When prompted:**
- **First time:** Type `yes` to accept the server fingerprint
- **Password:** Enter your cPanel password

### **2.2 Windows: Using PuTTY (Alternative)**

1. **Download PuTTY:** https://www.putty.org/
2. **Install and open PuTTY**
3. **Enter connection details:**
   - **Host Name:** `yourdomain.com` or `server.yourhosting.com`
   - **Port:** `22`
   - **Connection Type:** `SSH`
4. **Click "Open"**
5. **Login with:**
   - **Username:** Your cPanel username
   - **Password:** Your cPanel password

### **2.3 Windows: Using Windows Terminal (Recommended)**

1. **Open Windows Terminal** (Windows 11) or **PowerShell**
2. **Run:**
   ```powershell
   ssh username@yourdomain.com
   ```
3. **Enter password when prompted**

### **2.4 Mac/Linux: Using Terminal**

```bash
ssh username@yourdomain.com
```

---

## ✅ **Step 3: Verify Connection**

Once connected, you should see:

```
[username@server ~]$
```

**Test commands:**
```bash
# Check current directory
pwd

# Should show: /home/username

# Check Python version
python3 --version
# Should show: Python 3.8.x or higher

# Check if you're in the right location
ls -la
# Should show your files/folders
```

---

## 🐍 **Step 4: Set Up Python Virtual Environment**

### **4.1 Navigate to Backend Directory**

```bash
# Go to your home directory (if not already there)
cd ~

# If you uploaded files via FTP, navigate to where you uploaded
# Common locations:
cd ~/api/backend
# OR
cd ~/public_html/api/backend
# OR
cd ~/chambal-sandesh/backend

# List files to verify
ls -la
# Should show: manage.py, requirements.txt, etc.
```

### **4.2 Check Python Version**

```bash
# Check Python 3 version
python3 --version

# If not available, try:
python --version

# Check which Python is available
which python3
which python
```

**Required:** Python 3.8 or higher

### **4.3 Create Virtual Environment**

```bash
# Create virtual environment named 'venv'
python3 -m venv venv

# OR if python3 doesn't work:
python3.8 -m venv venv
python3.9 -m venv venv
python3.10 -m venv venv

# Wait for it to complete (may take 1-2 minutes)
```

**If you get error:** `python3: command not found`
- Try: `python -m venv venv`
- Or contact hosting support to install Python 3

### **4.4 Activate Virtual Environment**

```bash
# Activate virtual environment
source venv/bin/activate

# You should see (venv) prefix in your prompt:
# (venv) [username@server backend]$
```

**To deactivate later:**
```bash
deactivate
```

### **4.5 Upgrade Pip**

```bash
# Make sure venv is activated (you should see (venv) prefix)
pip install --upgrade pip

# OR if pip doesn't work:
pip3 install --upgrade pip
```

### **4.6 Install Dependencies**

```bash
# Install all required packages
pip install -r requirements.txt

# This may take 5-10 minutes depending on server speed
```

**If you get errors:**
- **"Permission denied":** Make sure venv is activated
- **"Package not found":** Check if requirements.txt exists
- **"MySQL client error":** See troubleshooting below

### **4.7 Install Production Dependencies**

```bash
# Install Gunicorn (WSGI server)
pip install gunicorn

# Install MySQL client
pip install mysqlclient

# If mysqlclient fails, use PyMySQL instead:
pip install pymysql
```

**If mysqlclient fails:**
```bash
# Use PyMySQL (easier to install)
pip install pymysql

# Then you need to configure it in Django settings
# (See next section)
```

---

## ⚙️ **Step 5: Configure PyMySQL (If mysqlclient Failed)**

If you used `pymysql` instead of `mysqlclient`, configure it:

### **5.1 Edit Django Settings**

```bash
# Navigate to backend directory
cd ~/api/backend  # or wherever your backend is

# Edit settings file
nano core/settings.py
# OR
vi core/settings.py
```

### **5.2 Add PyMySQL Configuration**

**At the very top of `core/settings.py`, add:**

```python
import pymysql
pymysql.install_as_MySQLdb()
```

**Save and exit:**
- **nano:** Press `Ctrl+X`, then `Y`, then `Enter`
- **vi:** Press `Esc`, type `:wq`, press `Enter`

---

## 🔧 **Step 6: Configure Environment Variables**

### **6.1 Create .env File**

```bash
# Make sure you're in backend directory
cd ~/api/backend

# Create .env file
nano .env
# OR
vi .env
```

### **6.2 Add Environment Variables**

Paste your production environment variables:

```env
DEBUG=False
SECRET_KEY=your-production-secret-key-here
DATABASE_NAME=your_database_name
DATABASE_USER=your_database_user
DATABASE_PASSWORD=your_database_password
DATABASE_HOST=localhost
DATABASE_PORT=3306
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

**Save and exit:**
- **nano:** `Ctrl+X`, then `Y`, then `Enter`
- **vi:** `Esc`, then `:wq`, then `Enter`

---

## 🗄️ **Step 7: Run Database Migrations**

```bash
# Make sure venv is activated
source venv/bin/activate

# Run migrations
python manage.py migrate

# Create superuser (optional, for admin access)
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput
```

---

## ✅ **Step 8: Test Installation**

```bash
# Test if Django works
python manage.py check

# Should show: "System check identified no issues (0 silenced)."

# Test server (optional, for testing only)
python manage.py runserver 0.0.0.0:8000

# Press Ctrl+C to stop
```

---

## 🔄 **Step 9: Keep Virtual Environment Active**

**Important:** Every time you SSH into the server, you need to activate the virtual environment:

```bash
# Navigate to backend
cd ~/api/backend

# Activate venv
source venv/bin/activate

# Now you can run Django commands
python manage.py migrate
python manage.py collectstatic
```

**To make it easier, create an alias:**

```bash
# Add to ~/.bashrc or ~/.bash_profile
nano ~/.bashrc

# Add this line:
alias activate-venv='cd ~/api/backend && source venv/bin/activate'

# Save and reload
source ~/.bashrc

# Now you can just type:
activate-venv
```

---

## 🚨 **Troubleshooting**

### **Problem: "SSH Access Denied"**

**Solutions:**
1. Verify SSH is enabled in cPanel
2. Check username and password
3. Contact hosting support
4. Try different port (some hosts use 2222)

### **Problem: "python3: command not found"**

**Solutions:**
```bash
# Try different Python commands
python --version
python3.8 --version
python3.9 --version

# Check available Python versions
which python*
ls -la /usr/bin/python*

# Contact hosting support if Python 3 is not installed
```

### **Problem: "Permission denied" when creating venv**

**Solutions:**
```bash
# Make sure you're in your home directory
cd ~
pwd
# Should show: /home/username

# Check permissions
ls -la

# If needed, create directory with proper permissions
mkdir -p ~/api/backend
chmod 755 ~/api/backend
```

### **Problem: "mysqlclient installation failed"**

**Solution:** Use PyMySQL instead:
```bash
pip install pymysql
```

Then add to `core/settings.py`:
```python
import pymysql
pymysql.install_as_MySQLdb()
```

### **Problem: "pip: command not found"**

**Solutions:**
```bash
# Use pip3
pip3 install --upgrade pip

# Or install pip
python3 -m ensurepip --upgrade
```

### **Problem: "ModuleNotFoundError" after installation**

**Solutions:**
```bash
# Make sure venv is activated
source venv/bin/activate

# Reinstall requirements
pip install -r requirements.txt

# Verify installation
pip list
```

### **Problem: "Database connection failed"**

**Solutions:**
1. Check `.env` file has correct database credentials
2. Verify database exists in cPanel → MySQL Databases
3. Check database user has proper permissions
4. Verify `DATABASE_HOST=localhost` (not 127.0.0.1)

---

## 📝 **Quick Reference Commands**

```bash
# Connect to server
ssh username@yourdomain.com

# Navigate to backend
cd ~/api/backend

# Activate virtual environment
source venv/bin/activate

# Deactivate virtual environment
deactivate

# Install packages
pip install package-name

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Create superuser
python manage.py createsuperuser

# Check Django
python manage.py check

# Exit SSH
exit
```

---

## 🎯 **Complete Setup Checklist**

- [ ] SSH access enabled in cPanel
- [ ] Connected to server via SSH
- [ ] Navigated to backend directory
- [ ] Python 3.8+ installed and verified
- [ ] Virtual environment created (`python3 -m venv venv`)
- [ ] Virtual environment activated (`source venv/bin/activate`)
- [ ] Pip upgraded (`pip install --upgrade pip`)
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] Gunicorn installed (`pip install gunicorn`)
- [ ] MySQL client installed (`pip install mysqlclient` or `pymysql`)
- [ ] `.env` file created with production settings
- [ ] PyMySQL configured (if used)
- [ ] Database migrations run (`python manage.py migrate`)
- [ ] Static files collected (`python manage.py collectstatic`)
- [ ] Superuser created (optional)

---

## 📞 **Need Help?**

- **cPanel SSH Documentation:** https://docs.cpanel.net/knowledge-base/general-systems-administration/how-to-enable-ssh-access/
- **Python venv Documentation:** https://docs.python.org/3/library/venv.html
- **Contact your hosting provider** if SSH is not available

---

**Once virtual environment is set up, you can proceed with Django deployment!** 🚀
