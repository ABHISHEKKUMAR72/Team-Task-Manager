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
│  │ Models: Sequelize ORM                                │  │
│  │ Middleware: Authentication, Authorization            │  │
│  │ Utils: JWT, Password Hashing                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓ SQL
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL Database                             │
│           Running on Port 5432                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Tables: Users, Projects, Tasks, ProjectMembers      │  │
│  │ Relationships: Foreign Keys, Junctions               │  │
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
- **PostgreSQL 15+**: Relational database
- **Sequelize 6.35.0**: ORM for database
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

## Database Schema

### Users Table
| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| id | UUID | Primary Key | Unique user identifier |
| firstName | String | Not Null | User's first name |
| lastName | String | Not Null | User's last name |
| email | String | Unique, Not Null | User's email |
| password | String | Not Null | Hashed password |
| role | Enum | Default 'member' | admin or member |
| createdAt | Timestamp | Auto | Creation timestamp |
| updatedAt | Timestamp | Auto | Update timestamp |

### Projects Table
| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| id | UUID | Primary Key | Unique project identifier |
| name | String | Not Null | Project name |
| description | Text | Nullable | Project description |
| ownerId | UUID | Foreign Key | Owner user ID |
| status | Enum | Default 'active' | active, completed, archived |
| startDate | Date | Nullable | Project start date |
| dueDate | Date | Nullable | Project due date |
| createdAt | Timestamp | Auto | Creation timestamp |
| updatedAt | Timestamp | Auto | Update timestamp |

### Tasks Table
| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| id | UUID | Primary Key | Unique task identifier |
| title | String | Not Null | Task title |
| description | Text | Nullable | Task description |
| projectId | UUID | Foreign Key | Associated project |
| assignedTo | UUID | Foreign Key | Assigned user ID |
| status | Enum | Default 'todo' | todo, in_progress, completed |
| priority | Enum | Default 'medium' | low, medium, high |
| dueDate | Date | Nullable | Task due date |
| createdBy | UUID | Foreign Key | Creator user ID |
| createdAt | Timestamp | Auto | Creation timestamp |
| updatedAt | Timestamp | Auto | Update timestamp |

### ProjectMembers Table (Junction)
| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| id | UUID | Primary Key | Unique record identifier |
| projectId | UUID | Foreign Key | Associated project |
| userId | UUID | Foreign Key | Associated user |
| role | Enum | Default 'member' | admin or member |
| createdAt | Timestamp | Auto | Creation timestamp |

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
- SQL injection prevention via ORM
- XSS protection via React escaping
- Rate limiting (to be added)

### HTTP Security
- HTTPS in production (via Railway)
- Secure headers (via Express defaults)
- CSRF protection (enabled by default)

## Deployment Architecture

### Development (Docker Compose)
```
docker-compose.yml
├── frontend (React dev server)
├── backend (Node.js)
└── postgres (Database)
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
└── PostgreSQL Database
    └── Managed by Railway
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

- **API Version**: 1.0.0
- **Node.js**: 18+
- **React**: 18.2.0
- **PostgreSQL**: 12+
- **Last Updated**: January 2024

---

For deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
For API documentation, see [API_DOCS.md](./API_DOCS.md)
