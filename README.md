# Team Task Manager

A comprehensive web application for managing projects and tasks with role-based access control. Users can create projects, assign tasks to team members, track progress, and manage team members with different roles (Admin/Member).

## 🌟 Key Features

### Authentication & Authorization
- User registration and login with JWT-based authentication
- Role-based access control (Admin/Member)
- Secure password hashing with bcryptjs
- Token expiration and refresh handling

### Project Management
- Create and manage multiple projects
- Assign team members to projects
- Track project status (active, completed, archived)
- Set project deadlines
- Role-based project access (Owner, Admin, Member)

### Task Management
- Create tasks within projects
- Assign tasks to team members
- Track task status (To Do, In Progress, Completed)
- Set task priority levels (Low, Medium, High)
- Track task deadlines and overdue items

### Dashboard & Analytics
- Real-time task statistics
- Task overview with status breakdown
- Overdue task tracking
- Assigned tasks view
- Project performance overview

## 🛠️ Tech Stack

### Backend
- **Framework**: Express.js (Node.js)
- **Database**: MongoDB
- **ORM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **CORS**: Enabled for frontend integration

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Styling**: CSS3 with responsive design

### Deployment
- **Containerization**: Docker & Docker Compose
- **Platform**: Railway.app
- **Reverse Proxy**: Nginx (optional)

## 📋 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Projects
- `POST /api/projects` - Create project (Protected)
- `GET /api/projects` - List user's projects (Protected)
- `GET /api/projects/:projectId` - Get project details (Protected)
- `PUT /api/projects/:projectId` - Update project (Protected)
- `DELETE /api/projects/:projectId` - Delete project (Protected)
- `POST /api/projects/:projectId/members` - Add project member (Protected)
- `DELETE /api/projects/:projectId/members/:userId` - Remove project member (Protected)

### Tasks
- `POST /api/projects/:projectId/tasks` - Create task (Protected)
- `GET /api/projects/:projectId/tasks` - Get project tasks (Protected)
- `PUT /api/projects/tasks/:taskId` - Update task (Protected)
- `DELETE /api/projects/tasks/:taskId` - Delete task (Protected)
- `GET /api/projects/stats/overview` - Get task statistics (Protected)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB 5.0+ (Local or Atlas)

### Installation & Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ABHISHEKKUMAR72/Team-Task-Manager.git
   cd Team-Task-Manager
   ```

2. **Install All Dependencies**
   ```bash
   npm run install-all
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

#### Individual Service Setup

**Start Backend:**
```bash
cd backend
npm run dev
```

**Start Frontend:**
```bash
cd frontend
npm start
```

## 📖 Usage Guide

### Creating a Project
1. Login to your account
2. Navigate to "Projects"
3. Click "New Project"
4. Fill in project details (name, description, due date)
5. Click "Create Project"

### Managing Tasks
1. Select a project
2. Click "New Task"
3. Fill in task details (title, description, priority, due date)
4. Assign the task to a team member
5. Update task status as work progresses

### Adding Team Members
1. Open a project
2. Go to "Team Members" section
3. Enter the member's email
4. Assign role (Admin/Member)
5. Click "Add Member"

### Tracking Progress
1. Visit Dashboard to see task statistics
2. View overdue tasks
3. Track completion percentage
4. Monitor team member workload

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Role-based access control
- CORS protection
- Input validation and sanitization
- Secure token storage in localStorage

## 📦 Database Models (MongoDB)

### User
- firstName: String
- lastName: String
- email: String (Unique)
- password: String (Hashed)
- role: Enum (admin, member)

### Project
- name: String
- description: String
- owner: ObjectId (User)
- status: Enum (active, completed, archived)
- startDate: Date
- dueDate: Date

### Task
- title: String
- description: String
- project: ObjectId (Project)
- assignedTo: ObjectId (User)
- status: Enum (todo, in_progress, completed)
- priority: Enum (low, medium, high)
- dueDate: Date
- createdBy: ObjectId (User)

### ProjectMember
- project: ObjectId (Project)
- user: ObjectId (User)
- role: Enum (admin, member)

## 🚢 Deployment to Railway

### Prerequisites
- Railway account (https://railway.app)
- GitHub account with repository push access

### Deployment Steps

1. **Connect GitHub Repository**
   - Go to Railway Dashboard
   - Click "New Project"
   - Select "GitHub Repo"
   - Authorize and select this repository

2. **Configure Environment Variables**
   ```
   DB_HOST=<railway-postgres-host>
   DB_PORT=5432
   DB_NAME=team_task_manager
   DB_USER=postgres
   DB_PASSWORD=<auto-generated>
   JWT_SECRET=<your-secret-key>
   NODE_ENV=production
   FRONTEND_URL=<your-frontend-url>
   ```

3. **Deploy Backend**
   - Create new service for backend
   - Set Dockerfile: `Dockerfile.backend`
   - Add PostgreSQL plugin
   - Deploy

4. **Deploy Frontend**
   - Create new service for frontend
   - Set Dockerfile: `Dockerfile.frontend`
   - Set environment variable: `REACT_APP_API_URL=<backend-url>/api`
   - Deploy

5. **Verify Deployment**
   - Check Railway Dashboard for service status
   - Test application endpoints
   - Verify database connections

### Live URL
After deployment, you'll get URLs like:
- Frontend: `https://your-app-frontend.up.railway.app`
- Backend: `https://your-app-backend.up.railway.app`

## 🧪 Testing

### Test User Accounts
Create test accounts with the signup feature:
1. Admin account: admin@example.com / password123
2. Member account: member@example.com / password123

### Test Scenarios
1. Create a new project
2. Add multiple team members
3. Create and assign tasks
4. Update task statuses
5. Track progress on dashboard
6. Test role-based access

## 📝 Project Structure

```
Team-Task-Manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── projectController.js
│   │   │   └── taskController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   ├── Task.js
│   │   │   ├── ProjectMember.js
│   │   │   └── index.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   └── taskRoutes.js
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   └── hash.js
│   │   └── index.js
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── AuthPages.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── ProjectsPages.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Navigation.css
│   │   │   └── Projects.css
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
├── .gitignore
├── LICENSE
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Database Connection Issues
- Ensure MongoDB is running (default port 27017)
- Check MONGO_URI in backend .env

### CORS Errors
- Make sure frontend URL is set in backend .env
- Check that backend is running on correct port

### Authentication Errors
- Clear browser localStorage and login again
- Verify JWT_SECRET is set in .env
- Check token expiration settings

### Port Already in Use
```bash
# Kill process on port
lsof -ti:5000 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Frontend
```

## 📞 Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error messages and steps to reproduce

## 🎯 Roadmap

- [ ] Email notifications for task assignments
- [ ] File attachments for tasks
- [ ] Task comments and collaboration
- [ ] Advanced filtering and sorting
- [ ] Task templates
- [ ] Recurring tasks
- [ ] Team performance analytics
- [ ] Kanban board view
- [ ] Mobile app
- [ ] Real-time updates with WebSockets

## ✨ Features by Role

### Admin
- Create and manage projects
- Invite team members
- Assign tasks
- View all project tasks
- Delete projects
- Manage team member roles

### Member
- View assigned tasks
- Update task status
- View project details
- See team members
- Track personal progress

---

**Made with ❤️ by Abhishek Kumar**

For more information visit: [GitHub Repository](https://github.com/ABHISHEKKUMAR72/Team-Task-Manager)