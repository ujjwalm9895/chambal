# How to Start and Access Your Website

## Quick Start

1. **Open a new terminal/PowerShell window**

2. **Navigate to website folder:**
   ```powershell
   cd D:\chambal\website
   ```

3. **Install dependencies (if not done):**
   ```powershell
   npm install
   ```

4. **Start the website:**
   ```powershell
   npm run dev
   ```

5. **Open in browser:**
   - Go to: `http://localhost:3000`
   - Or: `http://localhost:3000/home`

## Note About Ports

By default, Next.js runs on port **3000**, but your backend is already using port 3000.

### Option 1: Change Website Port (Recommended)

Create/edit `website/.env.local`:
```env
PORT=3002
```

Then start with:
```powershell
npm run dev -- -p 3002
```

Or modify `package.json`:
```json
"dev": "next dev -p 3002"
```

### Option 2: Change Backend Port

Edit `backend/.env`:
```env
PORT=3001
```

Then website can use port 3000.

## Access URLs

Once running:
- **Website**: `http://localhost:3000` or `http://localhost:3002`
- **Home Page**: `http://localhost:3000/home`
- **About Page**: `http://localhost:3000/about`

## Troubleshooting

**"Port already in use"**
- Another service is using the port
- Change the port (see above)

**"Cannot connect"**
- Make sure backend is running on port 3000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

**"Page not found"**
- Make sure pages are published in admin panel
- Check database has pages with status "PUBLISHED"
