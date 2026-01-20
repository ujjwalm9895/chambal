# ⚡ SSH Quick Connect

**Fast guide to connect via SSH right now.**

---

## 🚀 **Quick Connection (3 Steps)**

### **1. Open PowerShell**

Press `Windows + X` → Click "Windows PowerShell" or "Terminal"

### **2. Run This Command**

```powershell
ssh username@yourdomain.com
```

**Replace:**
- `username` = Your cPanel username
- `yourdomain.com` = Your domain name

**Example:**
```powershell
ssh ujjwal@chambalsandesh.com
```

### **3. Enter Password**

When prompted:
- Type your cPanel password (characters won't show)
- Press Enter

**That's it!** If successful, you'll see:
```
[username@server ~]$
```

---

## 🔍 **Find Your Connection Details**

**In cPanel:**
1. Login to cPanel
2. Go to: `Security` → `SSH Access`
3. Find:
   - **Host:** `yourdomain.com` or IP address
   - **Port:** Usually `22`
   - **Username:** Your cPanel username

---

## 🚨 **Common Issues & Quick Fixes**

| Problem | Solution |
|---------|----------|
| "ssh: command not found" | Install OpenSSH Client from Windows Settings |
| "Permission denied" | Check username/password, or enable SSH in cPanel |
| "Connection refused" | SSH might be disabled - contact hosting support |
| Wrong port | Try: `ssh -p 2222 username@yourdomain.com` |

---

## ✅ **Test After Connecting**

```bash
pwd          # Should show: /home/username
python3 --version  # Should show: Python 3.8+
```

---

**Full guide:** See `CONNECT_SSH_STEP_BY_STEP.md` for detailed instructions.
