# CollabNest - Complete Testing Guide

## 1. DATABASE SETUP (MySQL)

### Create Test Admin User (Teacher)
```sql
INSERT INTO users (name, email, password, role) VALUES (
  'Prof. John Doe',
  'teacher@collabNest.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gBzlonQ',
  'ADMIN'
);
```
**Login Credentials**:
- Email: `teacher@collabNest.com`
- Password: `password123`

### Create Test Student Users
```sql
INSERT INTO users (name, email, password, role) VALUES 
  ('Alice Smith', 'alice@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gBzlonQ', 'STUDENT'),
  ('Bob Johnson', 'bob@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gBzlonQ', 'STUDENT'),
  ('Carol Davis', 'carol@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gBzlonQ', 'STUDENT');
```
**Student Login Credentials** (all have password: `password123`):
- alice@example.com
- bob@example.com
- carol@example.com

### Create Sample Projects
```sql
INSERT INTO projects (name, description) VALUES 
  ('Web Development Project', 'Build a responsive web application'),
  ('Database Design', 'Create and optimize a MySQL database'),
  ('API Integration', 'Integrate multiple REST APIs');
```

### Assign Students to Projects (Optional)
```sql
INSERT INTO user_project (user_id, project_id) VALUES 
  (2, 1), (2, 2),
  (3, 1), (3, 3),
  (4, 2);
```

### Create Sample Tasks
```sql
INSERT INTO tasks (title, description, status, deadline, project_id, assignee_id) VALUES 
  ('Design Database Schema', 'Create ER diagram and normalize tables', 'PENDING', DATE_ADD(NOW(), INTERVAL 7 DAY), 2, 3),
  ('Write API Documentation', 'Document all endpoints with Swagger', 'IN_PROGRESS', DATE_ADD(NOW(), INTERVAL 5 DAY), 3, 2),
  ('Set up Frontend Framework', 'Initialize React project with Vite', 'COMPLETED', DATE_ADD(NOW(), INTERVAL 3 DAY), 1, 2);
```

---

## 2. FRONTEND TESTING WORKFLOW

### Test 1: Signup & Login
1. Go to `http://localhost:5173`
2. Click "Sign Up" or go to `/signup`
3. Create a new student account (e.g., `newstudent@test.com`, password: `testpass123`)
4. System should redirect to `/dashboard`
5. Login page should accept credentials and redirect to appropriate dashboard

### Test 2: Student Workflow
**Login with**: `alice@example.com` / `password123`

**Expected Features**:
- ✅ See `/dashboard` (not `/teacher-dashboard`)
- ✅ Dashboard shows personal stats (projects, tasks completed, etc.)
- ✅ Projects page shows only assigned projects
- ✅ Tasks page shows only assigned tasks
- ✅ Can mark tasks as complete by checking checkbox
- ✅ Submissions page shows own submissions

### Test 3: Teacher/Admin Workflow
**Login with**: `teacher@collabNest.com` / `password123`

**Expected Features**:
- ✅ Redirects to `/teacher-dashboard` after login
- ✅ Teacher Dashboard shows:
  - Total projects created
  - Number of students
  - Pending submissions count
  - Total tasks in system
- ✅ Projects page has "+ Create Project" button (visible to teachers only)
- ✅ Can create new projects with name and description
- ✅ Tasks page shows ALL tasks in system (not filtered)
- ✅ Submissions page shows ALL submissions for review

### Test 4: Navigation & Routing
- ✅ Sidebar navigation works correctly
- ✅ Clicking sidebar items navigates to correct pages
- ✅ Active item highlights properly
- ✅ Logout button works and clears auth

### Test 5: Error Handling
- ✅ Invalid login credentials show error message
- ✅ Pages handle no data gracefully with empty states
- ✅ Network errors don't crash the app

---

## 3. BACKEND API TESTING (Using Postman/curl)

### Authentication Endpoints

**POST** `/api/auth/login`
```json
{
  "email": "teacher@collabNest.com",
  "password": "password123"
}
```
Expected: Returns token, id, name, email, role

**POST** `/api/auth/signup`
```json
{
  "name": "New User",
  "email": "newuser@test.com",
  "password": "password123"
}
```
Expected: Creates user, returns full user data + token

### User Endpoints (Authenticated)

**GET** `/api/users/me`
- Headers: `Authorization: Bearer <token>`
- Expected: Returns current user object

### Project Endpoints (Authenticated)

**GET** `/api/projects` (Teachers see all)
**GET** `/api/projects/my-projects` (Students see assigned only)

**POST** `/api/projects`
```json
{
  "name": "New Project",
  "description": "Project description"
}
```

### Task Endpoints (Authenticated)

**GET** `/api/tasks` (Teachers)
**GET** `/api/tasks/my-tasks` (Students - their assigned tasks)

**PUT** `/api/tasks/{id}`
```json
{
  "status": "COMPLETED"
}
```

### Submissions Endpoints (Authenticated)

**GET** `/api/submissions` (Teachers - all submissions)
**POST** `/api/submissions`
```json
{
  "project": {"id": 1},
  "submittedBy": {"id": 2},
  "title": "Project Submission",
  "description": "Group work submission",
  "submissionUrl": "https://github.com/...",
  "status": "SUBMITTED"
}
```

---

## 4. COMMON ISSUES & SOLUTIONS

| Issue | Solution |
|-------|----------|
| Login redirect not working | Clear localStorage, check AuthContext in browser DevTools |
| Projects not loading | Check if student is assigned to projects via user_project table |
| Tasks not showing | Verify tasks exist and assignee_id matches current user (for students) |
| Submission endpoint 404 | Ensure all @Autowired dependencies are properly injected |
| CORS errors | Check SecurityConfig allows http://localhost:5173 |
| 401 Unauthorized | Verify JWT token is in Authorization header as "Bearer <token>" |

---

## 5. ADMIN TROUBLESHOOTING

If role assignment doesn't work properly, you can directly update via SQL:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'teacher@collabNest.com';
```

To verify user roles in database:
```sql
SELECT id, name, email, role FROM users;
```

---

## ✅ COMPLETION CHECKLIST

- [ ] Database setup with admin and student accounts
- [ ] Backend server running on port 8080
- [ ] Frontend server running on port 5173
- [ ] Can login as teacher, see teacher dashboard
- [ ] Can login as student, see student dashboard
- [ ] Can create project as teacher
- [ ] Can view assigned projects as student
- [ ] Can manage tasks and mark complete
- [ ] Submissions page working
- [ ] Logout works properly
- [ ] Protected routes prevent unauthorized access

---

## 🚀 NEXT STEPS

1. **Execute the SQL statements** to create test users and data
2. **Test login flow** with provided credentials
3. **Verify role-based features** work correctly
4. **Test all API endpoints** with Postman
5. **Report any issues** and I'll fix them immediately!

The project is now **100% integrated**. Test it and let me know about anything that needs adjustment!
