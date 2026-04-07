# CollabNest API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
All endpoints (except `/auth/*` and `/users` POST) require:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication Endpoints

### 1. Login
**POST** `/auth/login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "role": "ADMIN"
}
```

**Errors**:
- 401: Invalid credentials

---

### 2. Signup
**POST** `/auth/signup`

**Request Body**:
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123"
}
```

**Response** (201 Created):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 2,
  "name": "New User",
  "email": "newuser@example.com",
  "role": "STUDENT"
}
```

**Errors**:
- 409: User already exists

---

## User Endpoints

### 3. Get Current User
**GET** `/users/me`

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "role": "ADMIN"
}
```

### 4. Get All Users
**GET** `/users`

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "teacher@collabNest.com",
    "role": "ADMIN"
  },
  {
    "id": 2,
    "name": "Alice Smith",
    "email": "alice@example.com",
    "role": "STUDENT"
  }
]
```

### 5. Get User by ID
**GET** `/users/{id}`

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "role": "ADMIN"
}
```

### 6. Update User
**PUT** `/users/{id}`

**Request Body**:
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "password": "newpassword123"
}
```

---

## Project Endpoints

### 7. Create Project (Teacher/Admin Only)
**POST** `/projects`

**Request Body**:
```json
{
  "name": "Web Development Project",
  "description": "Build a responsive web application using React"
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "name": "Web Development Project",
  "description": "Build a responsive web application using React",
  "tasks": [],
  "users": []
}
```

### 8. Get All Projects
**GET** `/projects`

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Web Development Project",
    "description": "Build a responsive web application using React",
    "tasks": [
      {
        "id": 1,
        "title": "Setup React",
        "status": "IN_PROGRESS",
        "deadline": "2026-04-14"
      }
    ],
    "users": [
      {
        "id": 2,
        "name": "Alice Smith",
        "email": "alice@example.com"
      }
    ]
  }
]
```

### 9. Get My Projects (Students)
**GET** `/projects/my-projects`

Returns only projects assigned to current user.

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Web Development Project",
    ...
  }
]
```

### 10. Get Project by ID
**GET** `/projects/{id}`

### 11. Update Project
**PUT** `/projects/{id}`

**Request Body**:
```json
{
  "name": "Updated Project Name",
  "description": "Updated description"
}
```

### 12. Delete Project
**DELETE** `/projects/{id}`

**Response** (204 No Content)

---

## Task Endpoints

### 13. Create Task
**POST** `/tasks`

**Request Body**:
```json
{
  "title": "Design Database Schema",
  "description": "Create ER diagram and normalize tables",
  "status": "PENDING",
  "deadline": "2026-04-14",
  "project": {
    "id": 1
  },
  "assignee": {
    "id": 2
  }
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "title": "Design Database Schema",
  "description": "Create ER diagram and normalize tables",
  "status": "PENDING",
  "deadline": "2026-04-14",
  "project": {
    "id": 1,
    "name": "Web Development Project"
  },
  "assignee": {
    "id": 2,
    "name": "Alice Smith"
  }
}
```

### 14. Get All Tasks
**GET** `/tasks`

### 15. Get My Tasks (Assigned to Current User)
**GET** `/tasks/my-tasks`

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "Design Database Schema",
    "status": "PENDING",
    "deadline": "2026-04-14",
    ...
  }
]
```

### 16. Get Task by ID
**GET** `/tasks/{id}`

### 17. Update Task
**PUT** `/tasks/{id}`

**Request Body** (partial update supported):
```json
{
  "title": "Updated Title",
  "status": "COMPLETED",
  "description": "Updated description"
}
```

**Status Options**:
- `PENDING`
- `IN_PROGRESS`
- `COMPLETED`

### 18. Delete Task
**DELETE** `/tasks/{id}`

---

## Submission Endpoints

### 19. Create Submission
**POST** `/submissions`

**Request Body**:
```json
{
  "project": {
    "id": 1
  },
  "submittedBy": {
    "id": 2
  },
  "title": "Final Project Submission",
  "description": "Group project completed",
  "submissionUrl": "https://github.com/group/project",
  "status": "SUBMITTED"
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "project": {
    "id": 1,
    "name": "Web Development Project"
  },
  "submittedBy": {
    "id": 2,
    "name": "Alice Smith"
  },
  "title": "Final Project Submission",
  "description": "Group project completed",
  "submissionUrl": "https://github.com/group/project",
  "status": "SUBMITTED",
  "submittedAt": "2026-04-07T10:30:00",
  "feedback": null,
  "grade": null
}
```

### 20. Get All Submissions (Teacher)
**GET** `/submissions`

### 21. Get Submissions by Project
**GET** `/submissions/project/{projectId}`

### 22. Get My Submissions (Student)
**GET** `/submissions/user/me`

### 23. Get Submission by ID
**GET** `/submissions/{id}`

### 24. Review Submission (Teacher)
**PUT** `/submissions/{id}`

**Request Body**:
```json
{
  "status": "APPROVED",
  "feedback": "Excellent work! Great implementation.",
  "grade": 95.0,
  "reviewedBy": {
    "id": 1
  }
}
```

**Status Options**:
- `SUBMITTED`
- `PENDING`
- `APPROVED`
- `REJECTED`

### 25. Delete Submission
**DELETE** `/submissions/{id}`

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request format"
}
```

### 401 Unauthorized
```json
{
  "error": "Token required or invalid"
}
```

### 403 Forbidden
```json
{
  "error": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "error": "User already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Request/Response Headers

### Request
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

### Response
```
Content-Type: application/json
```

---

## Rate Limiting
No rate limiting currently implemented.

## CORS Policy
- Allowed Origin: `http://localhost:5173`
- Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed Headers: All

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@collabNest.com","password":"password123"}'
```

### Get Current User (with token)
```bash
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### Create Project
```bash
curl -X POST http://localhost:8080/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{"name":"New Project","description":"Project description"}'
```

### Get My Tasks
```bash
curl -X GET http://localhost:8080/api/tasks/my-tasks \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

## Version
- API Version: 1.0
- Last Updated: April 7, 2026
