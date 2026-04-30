# API Documentation - Team Task Manager

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Sign Up
**POST** `/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "member"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Login
**POST** `/auth/login`

Authenticate and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "member"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Get Profile
**GET** `/auth/profile`

Get current user profile. *(Protected)*

**Response (200):**
```json
{
  "message": "Profile retrieved",
  "user": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "member",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 📁 Project Endpoints

### Create Project
**POST** `/projects`

Create a new project. *(Protected)*

**Request Body:**
```json
{
  "name": "Q1 Product Launch",
  "description": "Launch new product features",
  "startDate": "2024-02-01",
  "dueDate": "2024-03-31"
}
```

**Response (201):**
```json
{
  "message": "Project created successfully",
  "project": {
    "id": "uuid",
    "name": "Q1 Product Launch",
    "description": "Launch new product features",
    "ownerId": "uuid",
    "status": "active",
    "startDate": "2024-02-01T00:00:00Z",
    "dueDate": "2024-03-31T00:00:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Get All Projects
**GET** `/projects`

Get all projects owned by user. *(Protected)*

**Response (200):**
```json
{
  "message": "Projects retrieved",
  "projects": [
    {
      "id": "uuid",
      "name": "Q1 Product Launch",
      "description": "Launch new product features",
      "ownerId": "uuid",
      "status": "active",
      "startDate": "2024-02-01T00:00:00Z",
      "dueDate": "2024-03-31T00:00:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "owner": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "tasks": [
        {
          "id": "uuid",
          "title": "Design mockups",
          "status": "in_progress"
        }
      ]
    }
  ]
}
```

---

### Get Project Details
**GET** `/projects/:projectId`

Get details of a specific project. *(Protected)*

**Response (200):**
```json
{
  "message": "Project retrieved",
  "project": {
    "id": "uuid",
    "name": "Q1 Product Launch",
    "description": "Launch new product features",
    "ownerId": "uuid",
    "status": "active",
    "startDate": "2024-02-01T00:00:00Z",
    "dueDate": "2024-03-31T00:00:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "owner": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "members": [
      {
        "id": "uuid",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane@example.com",
        "ProjectMember": {
          "role": "admin"
        }
      }
    ],
    "tasks": [
      {
        "id": "uuid",
        "title": "Design mockups",
        "description": "Create UI mockups",
        "status": "in_progress",
        "priority": "high",
        "dueDate": "2024-02-15T00:00:00Z"
      }
    ]
  }
}
```

---

### Update Project
**PUT** `/projects/:projectId`

Update project details. *(Protected - Owner/Admin only)*

**Request Body:**
```json
{
  "name": "Q1 Product Launch - Updated",
  "description": "Updated description",
  "status": "active",
  "dueDate": "2024-04-15"
}
```

**Response (200):**
```json
{
  "message": "Project updated successfully",
  "project": {
    "id": "uuid",
    "name": "Q1 Product Launch - Updated",
    "description": "Updated description",
    "status": "active",
    "dueDate": "2024-04-15T00:00:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

---

### Delete Project
**DELETE** `/projects/:projectId`

Delete a project and all associated tasks. *(Protected - Owner/Admin only)*

**Response (200):**
```json
{
  "message": "Project deleted successfully"
}
```

---

## 👥 Project Members Endpoints

### Add Project Member
**POST** `/projects/:projectId/members`

Add a user to a project. *(Protected - Owner/Admin only)*

**Request Body:**
```json
{
  "userId": "uuid",
  "role": "member"
}
```

**Response (201):**
```json
{
  "message": "Member added successfully",
  "member": {
    "id": "uuid",
    "projectId": "uuid",
    "userId": "uuid",
    "role": "member",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Remove Project Member
**DELETE** `/projects/:projectId/members/:userId`

Remove a user from a project. *(Protected - Owner/Admin only)*

**Response (200):**
```json
{
  "message": "Member removed successfully"
}
```

---

## ✅ Task Endpoints

### Create Task
**POST** `/projects/:projectId/tasks`

Create a new task. *(Protected - Project members only)*

**Request Body:**
```json
{
  "title": "Design homepage",
  "description": "Create responsive homepage design",
  "priority": "high",
  "dueDate": "2024-02-15",
  "assignedTo": "uuid"
}
```

**Response (201):**
```json
{
  "message": "Task created successfully",
  "task": {
    "id": "uuid",
    "title": "Design homepage",
    "description": "Create responsive homepage design",
    "projectId": "uuid",
    "status": "todo",
    "priority": "high",
    "dueDate": "2024-02-15T00:00:00Z",
    "assignedTo": "uuid",
    "createdBy": "uuid",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Get Project Tasks
**GET** `/projects/:projectId/tasks`

Get all tasks in a project. *(Protected - Project members only)*

**Response (200):**
```json
{
  "message": "Tasks retrieved",
  "tasks": [
    {
      "id": "uuid",
      "title": "Design homepage",
      "description": "Create responsive homepage design",
      "projectId": "uuid",
      "status": "in_progress",
      "priority": "high",
      "dueDate": "2024-02-15T00:00:00Z",
      "assignedTo": "uuid",
      "createdBy": "uuid",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Update Task
**PUT** `/projects/tasks/:taskId`

Update task details. *(Protected - Project members only)*

**Request Body:**
```json
{
  "title": "Design homepage - Updated",
  "status": "completed",
  "priority": "medium",
  "dueDate": "2024-02-20"
}
```

**Response (200):**
```json
{
  "message": "Task updated successfully",
  "task": {
    "id": "uuid",
    "title": "Design homepage - Updated",
    "status": "completed",
    "priority": "medium",
    "dueDate": "2024-02-20T00:00:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

---

### Delete Task
**DELETE** `/projects/tasks/:taskId`

Delete a task. *(Protected - Project members only)*

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

---

### Get Task Statistics
**GET** `/projects/stats/overview`

Get statistics of all tasks assigned to current user. *(Protected)*

**Response (200):**
```json
{
  "message": "Task statistics retrieved",
  "stats": {
    "total": 10,
    "todo": 3,
    "inProgress": 5,
    "completed": 2,
    "overdue": 1
  },
  "tasks": [
    {
      "id": "uuid",
      "title": "Design homepage",
      "status": "in_progress",
      "priority": "high",
      "dueDate": "2024-02-15T00:00:00Z",
      "projectId": "uuid",
      "createdBy": "uuid"
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Email already registered"
}
```

### 401 Unauthorized
```json
{
  "message": "Access token required"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "message": "Project not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error",
  "error": "Error details"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Success |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Auth required |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

---

## Enums

### User Role
- `admin` - Full access
- `member` - Limited access

### Project Status
- `active` - Project is ongoing
- `completed` - Project is finished
- `archived` - Project is archived

### Task Status
- `todo` - Task not started
- `in_progress` - Task in progress
- `completed` - Task completed

### Task Priority
- `low` - Low priority
- `medium` - Medium priority
- `high` - High priority

---

## Rate Limiting

No rate limiting currently implemented. Production deployment should add rate limiting.

---

## Testing with cURL

```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get profile (with token)
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Changelog

### v1.0.0 (2024-01-15)
- Initial API release
- Authentication endpoints
- Project management endpoints
- Task management endpoints
- Project member management
