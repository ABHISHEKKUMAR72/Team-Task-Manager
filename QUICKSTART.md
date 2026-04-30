# Quick Start Guide - Team Task Manager

## 🚀 Running Locally (5 minutes)

### Option 1: Docker Compose (Easiest)

```bash
# Install Docker from https://www.docker.com/products/docker-desktop

# In project root:
docker-compose up -d

# Wait 2-3 minutes for services to start
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Database: localhost:5432
```

### Option 2: Manual Setup

**Install Prerequisites:**
- Node.js 16+ (https://nodejs.org)
- PostgreSQL 12+ (https://www.postgresql.org/download/)

**Setup:**

```bash
# Terminal 1: Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
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
