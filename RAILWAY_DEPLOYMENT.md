# Railway Deployment Guide - Team Task Manager

## Overview
- **Backend**: Render.com (https://task-manager-backend-urdf.onrender.com)
- **Frontend**: Railway.app
- **Communication**: REST APIs with environment variables

---

## 🚀 Step 1: Prepare Frontend for Production

### Build the frontend
```bash
cd frontend
npm run build
```

This creates a `build/` folder with optimized static files.

### Verify build is complete
```bash
npm run build
# Check that frontend/build/ folder exists
```

---

## 📤 Step 2: Push to GitHub

```bash
# From root directory
git add .
git commit -m "Configure frontend for Railway deployment with backend API"
git push origin main
```

---

## 🚢 Step 3: Deploy on Railway

### 3.1 Create New Project
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub Repo"**
4. Choose **ABHISHEKKUMAR72/Team-Task-Manager**
5. Railway auto-detects and deploys

### 3.2 Configure Build Settings
If Railway doesn't auto-detect, set these manually:

| Setting | Value |
|---------|-------|
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Root Directory** | `.` (root) |

### 3.3 Add Environment Variables
In Railway Dashboard → Variables tab, add:

```
REACT_APP_API_URL=https://task-manager-backend-urdf.onrender.com/api
PORT=5000
NODE_ENV=production
```

### 3.4 Deploy
Click **Deploy** and wait for the green ✅ status.

You'll get a URL like: `https://your-app.up.railway.app`

---

## 🔗 Step 4: Verify Connection

### Test frontend is served
```
https://your-app.up.railway.app
```
Should load your React app ✅

### Test API connection
Go to your deployed frontend and:
1. Click Signup/Login
2. Check browser console (F12) for any API errors
3. Check Network tab to see API calls to Render backend

### If API calls fail:
1. **Check CORS** - Backend must allow your Railway URL
2. **Check environment variable** - Ensure `REACT_APP_API_URL` is set correctly
3. **Check backend status** - Visit `https://task-manager-backend-urdf.onrender.com/health`

---

## 🔧 Step 5: Fix CORS on Render Backend

Your backend on Render needs to allow requests from Railway frontend.

### In your Render backend (server.js/index.js):
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'https://your-app.up.railway.app',  // Replace with your Railway URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

Or allow all origins during development:
```javascript
app.use(cors());
```

---

## ✅ Troubleshooting

### Issue: 404 error on login/signup
- **Cause**: Frontend can't reach backend API
- **Fix**: Check `REACT_APP_API_URL` environment variable in Railway
- **Verify**: Open DevTools → Network tab → Check API endpoint URLs

### Issue: CORS errors
- **Cause**: Backend CORS not configured for your Railway URL
- **Fix**: Update CORS origin in Render backend with your Railway URL
- **Test**: `curl -i -X GET "https://task-manager-backend-urdf.onrender.com/health"`

### Issue: Build fails on Railway
- **Cause**: Missing dependencies or build error
- **Fix**: 
  ```bash
  npm install
  npm run build  # Test locally first
  ```
- **Check**: Look at Railway logs for build errors

### Issue: App shows blank page
- **Cause**: Static files not being served
- **Fix**: Verify `frontend/build/` exists and has `index.html`
- **Test**: `ls frontend/build/index.html`

---

## 📊 Deployment Architecture

```
Your Computer
     ↓
   GitHub (push)
     ↓
┌─────────────────────────────┐
│     Railway.app             │
│  ┌─────────────────────┐   │
│  │  Frontend (React)    │   │
│  │  Port: 5000          │   │
│  │  Built files served  │   │
│  └─────────────────────┘   │
│           ↓                 │
│  Calls REACT_APP_API_URL    │
└─────────────────────────────┘
           ↓ HTTPS
    ┌──────────────┐
    │  Render.com  │
    │   Backend    │
    │   Express.js │
    │   MongoDB    │
    │   API Routes │
    └──────────────┘
```

---

## 🎯 Quick Reference

### Local Development
```bash
# Terminal 1: Frontend
cd frontend
npm start

# Terminal 2: Backend (separate machine/folder)
npm run dev
```
Frontend calls: `http://localhost:5000/api`

### Production (Railway + Render)
- Frontend URL: `https://your-app.up.railway.app`
- Frontend calls: `https://task-manager-backend-urdf.onrender.com/api`
- Backend must have CORS enabled

### Commands
| Command | Purpose |
|---------|---------|
| `npm run build` | Build React app for production |
| `npm start` | Start Node.js server (serves built frontend) |
| `npm run dev` | Local development (React dev server) |

---

## 🔐 Environment Variables Checklist

- [ ] `REACT_APP_API_URL` set in Railway
- [ ] Backend URL matches `https://task-manager-backend-urdf.onrender.com/api`
- [ ] CORS enabled on Render backend
- [ ] Render backend online and responding
- [ ] Frontend environment files updated (`.env.production`)

---

## 📞 Need Help?

Check Railway & Render logs:
- **Railway**: Dashboard → Logs tab
- **Render**: Dashboard → Logs tab

Look for:
- Build errors
- Runtime errors
- Network/API errors
