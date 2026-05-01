# Technical Specification - Team Task Manager

## Project Overview

Team Task Manager is a full-stack web application that enables teams to collaborate on projects and tasks with role-based access control. It provides features for project management, task assignment, progress tracking, and team collaboration.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
│              Running on Port 3000                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Pages: Auth, Dashboard, Projects, Tasks              │  │
│  │ Components: Navigation, ProtectedRoute               │  │
│  │ Services: API Client (Axios)                         │  │
│  │ Context: AuthContext for state management            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Express.js)                        │
│              Running on Port 5000                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Routes: Auth, Projects, Tasks                        │  │
│  │ Controllers: Business Logic                          │  │
│  │ Models: Mongoose (MongoDB)                           │  │
│  │ Middleware: Authentication, Authorization            │  │
│  │ Utils: JWT, Password Hashing                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓ NoSQL
┌─────────────────────────────────────────────────────────────┐
│              MongoDB Database                                │
│           Running on Port 27017                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Collections: Users, Projects, Tasks, ProjectMembers │  │
│  │ Relationships: References (ObjectIds)                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **React 18.2.0**: UI library
- **React Router v6.18.0**: Client-side routing
- **Axios 1.6.0**: HTTP client
- **CSS3**: Styling with responsive design
- **React Scripts 5.0.1**: Build tool

### Backend
- **Node.js 18+**: JavaScript runtime
- **Express.js 4.18.2**: Web framework
- **MongoDB 5.0+**: NoSQL database
- **Mongoose 8.x**: ODM for database
- **bcryptjs 2.4.3**: Password hashing
- **jsonwebtoken 9.1.0**: JWT authentication
- **cors 2.8.5**: Cross-origin requests
- **express-validator 7.0.0**: Input validation
- **dotenv 16.3.1**: Environment variables

### DevOps
- **Docker 20.10+**: Containerization
- **Docker Compose 2.10+**: Multi-container orchestration
- **Nginx**: Reverse proxy (optional)
- **Railway.app**: Cloud deployment platform

## Database Collections

### Users
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique user identifier |
| firstName | String | User's first name |
| lastName | String | User's last name |
| email | String | Unique user email |
| password | String | Hashed password |
| role | String | admin or member |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |

### Projects
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique project identifier |
| name | String | Project name |
| description | String | Project description |
| owner | ObjectId | Reference to User |
| status | String | active, completed, archived |
| startDate | Date | Project start date |
| dueDate | Date | Project due date |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |

### Tasks
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique task identifier |
| title | String | Task title |
| description | String | Task description |
| project | ObjectId | Reference to Project |
| assignedTo | ObjectId | Reference to User |
| status | String | todo, in_progress, completed |
| priority | String | low, medium, high |
| dueDate | Date | Task due date |
| createdBy | ObjectId | Reference to User |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |

### ProjectMembers
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique record identifier |
| project | ObjectId | Reference to Project |
| user | ObjectId | Reference to User |
| role | String | admin or member |
| createdAt | Date | Auto-generated |

## API Design

### Authentication Flow
1. User signs up or logs in
2. Backend validates credentials
3. Server returns JWT token
4. Client stores token in localStorage
5. Client sends token in Authorization header for protected requests
6. Middleware verifies token and allows/denies access

### Authorization Levels
- **Public**: `/auth/signup`, `/auth/login`
- **Authenticated**: All `/api/*` endpoints
- **Owner/Admin**: Project modification, member management
- **Member**: Task updates, project viewing

### Request/Response Format
```json
Request Header:
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}

Response Success (2xx):
{
  "message": "Operation successful",
  "data": { ... }
}

Response Error (4xx/5xx):
{
  "message": "Error description",
  "error": "Additional details"
}
```

## Security Implementation

### Password Security
- Passwords hashed with bcryptjs (10 salt rounds)
- Never stored in plain text
- Never returned in API responses

### Token Security
- JWT signed with secret key
- Configurable expiration (default 7 days)
- Validated on every protected request
- Stored in browser localStorage

### CORS Protection
- Frontend URL validation
- Credentials support enabled
- Prevents cross-origin attacks

### Data Validation
- Input validation on all endpoints
- NoSQL injection prevention via Mongoose
- XSS protection via React escaping
- Rate limiting (to be added)

### HTTP Security
- HTTPS in production (via Railway)
- Secure headers (via Express defaults)
- CSRF protection (enabled by default)

## Deployment Architecture

### Development (Local)
```
Team-Task-Manager (Root)
├── backend (Node.js + Mongoose)
├── frontend (React)
└── MongoDB (Local Service)
```

### Production (Railway)
```
Railway Project
├── Frontend Service
│   ├── Dockerfile.frontend
│   └── Built React app (static)
├── Backend Service
│   ├── Dockerfile.backend
│   └── Express.js API
└── MongoDB Database
    └── Managed by MongoDB Atlas
```

## File Structure

```
Team-Task-Manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js (Sequelize config)
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── projectController.js
│   │   │   └── taskController.js
│   │   ├── middleware/
│   │   │   └── auth.js (JWT validation, role checking)
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   ├── Task.js
│   │   │   ├── ProjectMember.js
│   │   │   └── index.js (Model associations)
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   └── taskRoutes.js
│   │   ├── utils/
│   │   │   ├── jwt.js (Token management)
│   │   │   └── hash.js (Password hashing)
│   │   └── index.js (Express app setup)
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
│
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
│   │   │   └── api.js (Axios config & endpoints)
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Navigation.css
│   │   │   └── Projects.css
│   │   ├── App.js (Main component)
│   │   ├── index.js (React entry point)
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
├── nginx.conf (Optional reverse proxy)
├── .gitignore
├── LICENSE
├── README.md
├── QUICKSTART.md
├── DEPLOYMENT_GUIDE.md
├── API_DOCS.md
├── TECH_SPEC.md (This file)
└── railway.json
```

## Key Features Breakdown

### 1. Authentication
- JWT-based token authentication
- Password hashing with bcryptjs
- Session persistence in localStorage
- Automatic token refresh logic (to be added)

### 2. Project Management
- CRUD operations for projects
- Project ownership and access control
- Team member management
- Project status tracking
- Start and due date management

### 3. Task Management
- Task creation within projects
- Task assignment to team members
- Status tracking (todo, in_progress, completed)
- Priority levels (low, medium, high)
- Deadline tracking and overdue detection
- Task history and updates

### 4. Dashboard
- Task statistics overview
- Overdue task alerts
- Personal task view
- Project progress tracking
- Team member task distribution

### 5. Role-Based Access Control
- **Admin Role**: Full system access, user/project management
- **Member Role**: Project participation, task management
- **Owner**: Full project control, member management

## Performance Considerations

### Database Optimization
- Indexes on frequently queried columns
- Foreign key relationships
- Connection pooling via Sequelize
- Query optimization in controllers

### Frontend Optimization
- React component memoization
- Lazy loading for routes
- CSS optimization
- Image compression (recommended)

### Backend Optimization
- Request validation middleware
- Error handling and logging
- Connection pooling
- JSON response compression

## Scalability Plan

### Phase 1 (Current)
- Single instance deployment
- PostgreSQL database
- File-based uploads (future)

### Phase 2 (Future)
- Load balancing
- Database replication
- Caching layer (Redis)
- CDN for static assets

### Phase 3 (Future)
- Microservices architecture
- Message queues (RabbitMQ)
- Elasticsearch for search
- Distributed database

## Testing Strategy

### Unit Tests (Recommended)
- Controller logic
- Utility functions
- Model validations

### Integration Tests (Recommended)
- API endpoints
- Database operations
- Authentication flow

### E2E Tests (Recommended)
- User workflows
- Complete project/task lifecycle
- Multi-user scenarios

## Monitoring & Logging

### Development
- Console logging
- Error stack traces
- Request/response logging

### Production (Recommended)
- Centralized logging (e.g., ELK, Datadog)
- Error tracking (e.g., Sentry)
- Performance monitoring
- Application metrics

## Maintenance Tasks

### Regular
- Database backups
- Dependency updates
- Security patches
- Log rotation

### Periodic
- Performance optimization
- Database cleanup
- Code refactoring
- Documentation updates

## Environment Configuration

### Development
```
NODE_ENV=development
DB_HOST=localhost
JWT_SECRET=dev_secret
```

### Production
```
NODE_ENV=production
DB_HOST=railway-postgres
JWT_SECRET=<strong-secret>
FRONTEND_URL=https://production-url.com
```

## Version Information

- **API Version**: 1.1.0
- **Node.js**: 18+
- **React**: 18.2.0
- **MongoDB**: 5.0+
- **Last Updated**: May 2026

---

For deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
For API documentation, see [API_DOCS.md](./API_DOCS.md)
