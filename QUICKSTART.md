# Quick Start Guide - Team Task Manager

## 🚀 Running Locally (5 minutes)

**Prerequisites:**
- Node.js 16+ (https://nodejs.org)
- MongoDB 5.0+ (https://www.mongodb.com/try/download/community)

**Setup & Start:**

```bash
# 1. Install all dependencies for both frontend and backend
npm run install-all

# 2. Start both services concurrently
npm run dev

# Frontend will be available at: http://localhost:3000
# Backend will be available at: http://localhost:5000
```

### Alternative: Individual Service Setup

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start
```

## 🔐 First Time Login

1. Click **"Sign Up"**
2. Create account with email & password
3. Log in with your credentials
4. Dashboard loads automatically

## 📋 Quick Test Workflow

1. **Create Project**
   - Click Projects → New Project
   - Enter name, description, due date
   - Click Create

2. **Add Task**
   - Select project
   - Click New Task
   - Fill details and save

3. **View Dashboard**
   - Check statistics
   - See assigned tasks
   - Track progress

## 🎯 Common Tasks

### Add Team Member
1. Open project
2. Team Members section
3. Enter email & select role
4. Click Add

### Update Task Status
1. Go to project
2. Click task
3. Change status dropdown
4. Auto-saves

### Delete Project
1. Projects list
2. Find project
3. Click Delete button
4. Confirm deletion

## 📱 Features

✅ User authentication
✅ Project management
✅ Task tracking
✅ Team collaboration
✅ Role-based access
✅ Progress dashboard
✅ Responsive design

## 🆘 Troubleshooting

**Port 3000 in use?**
```bash
# Kill process on port 3000
npx kill-port 3000
npm start
```

**Database connection error?**
- Check PostgreSQL is running
- Verify credentials in .env
- Ensure database exists

**Dependencies not installing?**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
```

## 📚 Documentation

- [Full README.md](./README.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [API Documentation](./API_DOCS.md)

## 🚀 Next: Deploy to Railway

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for production deployment steps.
