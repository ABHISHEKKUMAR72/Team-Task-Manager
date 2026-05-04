# 🚀 Railway Deployment Checklist

## Pre-Deployment (Done ✅)

- [x] Frontend built successfully (`frontend/build/` folder created)
- [x] Server.js configured to serve static files
- [x] package.json scripts updated:
  - `npm run build` - builds frontend
  - `npm start` - serves production build
- [x] Environment files created:
  - `.env.production` - points to Render backend
  - `.env.development` - points to localhost
- [x] Removed localhost proxy from frontend
- [x] API service configured with environment variables

## Deployment Steps

### 1️⃣ Push to GitHub
```bash
git add .
git commit -m "Configure production deployment for Railway and Render backend"
git push origin main
```

### 2️⃣ Deploy on Railway
1. Go to https://railway.app/dashboard
2. Click **New Project** → **Deploy from GitHub Repo**
3. Select **ABHISHEKKUMAR72/Team-Task-Manager**
4. Railway auto-deploys with these settings:

| Setting | Value |
|---------|-------|
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Port | 5000 |

### 3️⃣ Add Environment Variables (CRITICAL)
In Railway Dashboard → Variables tab:
```
REACT_APP_API_URL=https://task-manager-backend-urdf.onrender.com/api
PORT=5000
NODE_ENV=production
```

### 4️⃣ Verify Deployment
- ✅ Green deployment status
- ✅ Your app URL appears (e.g., `https://your-app.up.railway.app`)
- ✅ Visit the URL → should load your React app
- ✅ Try login/signup → should call your Render backend

## If Something Fails

### Frontend loads but API calls fail:
1. **Check environment variable**: `REACT_APP_API_URL` set correctly in Railway?
2. **Check Render backend**: Is it online? Visit `https://task-manager-backend-urdf.onrender.com/health`
3. **Check CORS**: Does your Render backend allow your Railway URL?

### Build fails:
1. Check Railway logs
2. Test locally: `npm run build`
3. Verify: `npm start` (should work on localhost:5000)

### Railway shows error:
1. Click deployment → view logs
2. Look for build or runtime errors
3. Most common: missing dependencies or env variables

## Architecture Summary

```
GitHub (Main Branch)
    ↓ (auto-trigger)
Railway.app
  ├─ Build: npm install && npm run build
  ├─ Start: npm start
  ├─ Serves: frontend/build/* (static React files)
  └─ API URL: https://task-manager-backend-urdf.onrender.com/api
       ↓
Render.com (Backend)
  ├─ Node.js/Express API
  ├─ MongoDB
  └─ CORS configured for Railway URL
```

## Quick Commands

```bash
# Build locally (test before pushing)
npm run build

# Serve locally (test production build)
npm start

# Push to GitHub (triggers Railway deployment)
git add . && git commit -m "message" && git push

# View logs (after Railway deployment)
# Go to Railway Dashboard → Click deployment → Logs tab
```

## Important Files

- `server.js` - Production server configuration
- `package.json` - Build & start commands
- `frontend/.env.production` - Production API URL
- `RAILWAY_DEPLOYMENT.md` - Full deployment guide

---

**Next Steps:**
1. Push to GitHub
2. Check Railway deployment in 2-3 minutes
3. Test login/signup with Render backend
4. Fix CORS on Render if needed

✨ You're ready to deploy!
