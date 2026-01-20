# 🔐 Connect to SSH - Step by Step Guide

**Follow these steps to connect to your cPanel server via SSH.**

---

## ✅ **Step 1: Get Your SSH Connection Details**

You need these details from cPanel:

1. **Login to cPanel**
2. **Go to:** `Security` → `SSH Access` (or search "SSH" in search bar)
3. **Note down:**
   - **Host/Server:** Usually `yourdomain.com` or `server.yourhosting.com` or `IP address`
   - **Port:** Usually `22` (default SSH port), but could be `2222` or another port
   - **Username:** Your cPanel username
   - **Password:** Your cPanel password

**Example:**
- Host: `chambalsandesh.com`
- Port: `22`
- Username: `ujjwal`
- Password: `your-cpanel-password`

---

## ✅ **Step 2: Check if SSH is Enabled**

**In PowerShell (on Windows), run:**

```powershell
ssh -V
```

**Expected output:**
```
OpenSSH_for_Windows_8.x or similar
```

**If you get error:** "ssh is not recognized"
- Windows 10/11: SSH should be built-in
- If missing: Install OpenSSH Client from Windows Settings → Apps → Optional Features

---

## ✅ **Step 3: Connect to Your Server**

### **Method 1: Simple Connection (Password-based)**

**Open PowerShell and run:**

```powershell
ssh username@yourdomain.com
```

**Replace:**
- `username` = Your cPanel username
- `yourdomain.com` = Your domain or server address

**Example:**
```powershell
ssh ujjwal@chambalsandesh.com
```

**What happens:**
1. First time: You'll see a message about host authenticity
   ```
   The authenticity of host 'chambalsandesh.com (x.x.x.x)' can't be established.
   ECDSA key fingerprint is SHA256:xxxxxxxxx.
   Are you sure you want to continue connecting (yes/no/[fingerprint])? 
   ```
   **Type:** `yes` and press Enter

2. Password prompt:
   ```
   username@yourdomain.com's password:
   ```
   **Type:** Your cPanel password (characters won't show as you type)
   **Press:** Enter

3. If successful, you'll see:
   ```
   [username@server ~]$
   ```

### **Method 2: Connection with Specific Port**

If your hosting uses a different port (like 2222):

```powershell
ssh -p 2222 username@yourdomain.com
```

**Example:**
```powershell
ssh -p 2222 ujjwal@chambalsandesh.com
```

---

## ✅ **Step 4: Verify You're Connected**

Once connected, you should see a prompt like:

```
[username@server ~]$
```

**Test commands:**

```bash
# Check current directory
pwd
# Should show: /home/username

# List files
ls -la
# Should show your files

# Check Python version
python3 --version
# Should show: Python 3.8.x or higher
```

---

## 🔑 **Step 5: Set Up SSH Key (Optional but Recommended)**

Using SSH keys is more secure than passwords. You already have `id_rsa.pub` in your project!

### **5.1 Copy Your Public Key**

**In PowerShell (from your project directory):**

```powershell
cd D:\chambal
Get-Content id_rsa.pub | Set-Clipboard
```

This copies your public key to clipboard.

### **5.2 Add Key to cPanel**

1. **Login to cPanel**
2. **Go to:** `Security` → `SSH Access`
3. **Click:** `Manage SSH Keys` or `Import Key`
4. **Paste** your public key (from clipboard)
5. **Click:** `Import` or `Save`
6. **Authorize the key** (click `Authorize` or `Manage`)

### **5.3 Test Key-Based Connection**

```powershell
ssh username@yourdomain.com
```

If set up correctly, it should connect without asking for password!

---

## 🚨 **Troubleshooting Common Issues**

### **Problem 1: "Permission denied (publickey,password)"**

**Solutions:**
1. **Double-check username and password**
   ```powershell
   # Make sure username is correct (usually your cPanel username)
   ssh username@yourdomain.com
   ```

2. **Try with verbose output to see what's happening:**
   ```powershell
   ssh -v username@yourdomain.com
   ```

3. **Verify SSH is enabled in cPanel:**
   - Go to cPanel → Security → SSH Access
   - Make sure SSH is enabled
   - If not, enable it or contact hosting support

### **Problem 2: "Connection refused"**

**Solutions:**
1. **Check if SSH is enabled on server:**
   - Contact hosting support
   - Some hosts disable SSH by default

2. **Try different port:**
   ```powershell
   ssh -p 2222 username@yourdomain.com
   ```

3. **Check server address:**
   - Use your domain: `yourdomain.com`
   - Or server IP: `x.x.x.x`
   - Or server hostname: `server.yourhosting.com`

### **Problem 3: "ssh: command not found" (Windows)**

**Solutions:**
1. **Install OpenSSH Client:**
   - Windows Settings → Apps → Optional Features
   - Click "Add a feature"
   - Search for "OpenSSH Client"
   - Click "Install"

2. **Or use PuTTY:**
   - Download: https://www.putty.org/
   - Install and use PuTTY to connect

### **Problem 4: "Host key verification failed"**

**Solutions:**
```powershell
# Remove old host key
ssh-keygen -R yourdomain.com

# Then try connecting again
ssh username@yourdomain.com
```

### **Problem 5: Timeout or Connection Slow**

**Solutions:**
1. **Check your internet connection**
2. **Try using IP address instead of domain:**
   ```powershell
   ssh username@x.x.x.x
   ```
3. **Contact hosting support** if server is down

---

## 📝 **Quick Connection Checklist**

Before connecting, make sure you have:

- [ ] cPanel login credentials
- [ ] SSH enabled in cPanel (Security → SSH Access)
- [ ] SSH connection details:
  - [ ] Host/Server address
  - [ ] Port (usually 22)
  - [ ] Username
  - [ ] Password
- [ ] SSH client installed on your computer (built-in on Windows 10/11)

---

## ✅ **After Connecting Successfully**

Once you're connected and see `[username@server ~]$`, you can:

1. **Navigate to your backend:**
   ```bash
   cd ~/api/backend
   # OR wherever you uploaded your files
   ```

2. **Set up virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Continue with deployment steps** from `DEPLOYMENT_GUIDE_CPANEL.md`

---

## 🆘 **Still Having Issues?**

### **Contact Your Hosting Provider**

Ask them:
1. Is SSH enabled on my account?
2. What is my SSH host/server address?
3. What port should I use? (usually 22 or 2222)
4. What is my SSH username? (usually same as cPanel username)

### **Alternative: Use cPanel Terminal**

Some cPanel installations have a built-in terminal:
1. **Login to cPanel**
2. **Look for:** "Terminal" in the main dashboard
3. **Click it** - opens a terminal in your browser
4. **You're already logged in!** No SSH needed

---

## 📞 **Need Help?**

If you're stuck, provide:
- Your hosting provider name
- Error message you're getting
- Steps you've already tried

I can help troubleshoot specific issues!

---

**Ready to connect? Open PowerShell and run:**
```powershell
ssh username@yourdomain.com
```

**Good luck!** 🚀
