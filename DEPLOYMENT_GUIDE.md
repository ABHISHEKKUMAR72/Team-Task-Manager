# Deployment Guide - Team Task Manager

## Quick Start Deployment to Railway

This guide will help you deploy the Team Task Manager application to Railway in minutes.

## Prerequisites

1. **Railway Account**: https://railway.app
2. **GitHub Account**: With push access to this repository
3. **PostgreSQL**: Railway will provide this automatically

## Step 1: Connect Your GitHub Repository

1. Go to [Railway Dashboard](https://railway.app)
2. Click **"New Project"**
3. Select **"GitHub Repo"**
4. Click **"Connect GitHub"** and authorize Railway
5. Select **"ABHISHEKKUMAR72/Team-Task-Manager"** from the list
6. Click **"Deploy Now"**

## Step 2: Create PostgreSQL Database

1. In Railway Dashboard, click **"Add Service"**
2. Select **"Database"** → **"PostgreSQL"**
3. Note the connection details (you'll need these)

## Step 3: Deploy Backend

1. Click **"Add Service"** → **"GitHub Repo"**
2. Select your Team-Task-Manager repo
3. Configure the service:
   - **Name**: `team-task-manager-backend`
   - **Dockerfile**: `Dockerfile.backend`
   - **Port**: `5000`

4. Add environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=<generate-a-strong-secret>
   FRONTEND_URL=<your-frontend-railway-url>
   ```
   
   For database variables, Railway will auto-provide:
   - `DATABASE_URL` (if using Railway PostgreSQL)
   
   Or set manually:
   - `DB_HOST=<your-postgres-host>`
   - `DB_PORT=5432`
   - `DB_NAME=team_task_manager`
   - `DB_USER=postgres`
   - `DB_PASSWORD=<your-password>`

5. Click **"Deploy"**

## Step 4: Deploy Frontend

1. Click **"Add Service"** → **"GitHub Repo"**
2. Select your Team-Task-Manager repo again
3. Configure the service:
   - **Name**: `team-task-manager-frontend`
   - **Dockerfile**: `Dockerfile.frontend`
   - **Port**: `3000`

4. Add environment variables:
   ```
   REACT_APP_API_URL=<your-backend-railway-url>/api
   ```

5. Click **"Deploy"**

## Step 5: Verify Deployment

1. Check both services show ✅ "Deployed" status
2. Visit your frontend URL from Railway dashboard
3. Test the signup/login functionality
4. Create a test project to verify everything works

## Environment Variables Reference

### Backend (.env)
```
NODE_ENV=production
PORT=5000
DB_HOST=<postgres-host>
DB_PORT=5432
DB_NAME=team_task_manager
DB_USER=postgres
DB_PASSWORD=<secure-password>
JWT_SECRET=<long-random-secret-key>
FRONTEND_URL=https://your-frontend.railway.app
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend.railway.app/api
```

## Railway URL Format

After deployment, your URLs will be:
- **Frontend**: `https://team-task-manager-frontend.railway.app`
- **Backend**: `https://team-task-manager-backend.railway.app`
- **API Base**: `https://team-task-manager-backend.railway.app/api`

(The exact URLs depend on your Railway project settings)

## Common Issues & Solutions

### Database Connection Errors
**Problem**: "Can't connect to database"
**Solution**:
1. Verify `DB_HOST`, `DB_PORT`, `DB_NAME` are correct
2. Check PostgreSQL service is running in Railway
3. Ensure `DATABASE_URL` format is correct if using it

### CORS Errors
**Problem**: Frontend can't reach backend
**Solution**:
1. Verify `FRONTEND_URL` matches your actual frontend URL
2. Check backend is running (`/api/health` should return 200)
3. Ensure `REACT_APP_API_URL` is set correctly in frontend

### Port Already in Use
**Problem**: "Port 5000 already in use"
**Solution**: Railway automatically handles port mapping - no action needed

### Build Failures
**Problem**: Docker build fails
**Solution**:
1. Check Dockerfile paths are correct
2. Verify all dependencies are in package.json
3. Check build logs for specific errors

## Monitoring & Logs

1. Click any service in Railway Dashboard
2. View **"Logs"** tab for real-time output
3. Check **"Deployments"** for deployment history
4. Monitor **"Metrics"** for performance

## Updating Your Application

1. Make changes locally
2. Push to GitHub
3. Railway automatically redeploys
4. Check Dashboard for deployment status

## Database Backups

1. Go to Railway PostgreSQL service
2. Click **"Data"** tab
3. Use Railway's backup features for production data

## Scaling & Performance

### For High Traffic
1. Upgrade Railway plan for more resources
2. Consider adding caching (Redis)
3. Enable connection pooling in Sequelize
4. Optimize database queries

### Database Performance
1. Add indexes to frequently queried columns
2. Implement pagination for list endpoints
3. Use database connection pooling

## Production Checklist

- [ ] Set strong `JWT_SECRET`
- [ ] Enable HTTPS (automatic with Railway)
- [ ] Configure proper CORS with real frontend URL
- [ ] Set `NODE_ENV=production`
- [ ] Test all API endpoints
- [ ] Verify email/notifications (if added)
- [ ] Monitor logs for errors
- [ ] Setup Database backups
- [ ] Document deployment steps
- [ ] Test login and task creation workflows

## Support & Troubleshooting

- **Railway Docs**: https://docs.railway.app
- **Contact Railway Support**: https://railway.app/support
- **GitHub Issues**: Create an issue in the repository
- **Check Logs**: First place to look for errors

## Next Steps

1. Test your live application
2. Share the live URL with team members
3. Create test accounts
4. Document any custom configurations
5. Setup monitoring and alerts (optional)

---

**Deployment Complete!** Your Team Task Manager is now live on Railway. 🎉
