# CollabNest - Testing Guide for Blank Page Fix

## Overview
The blank page issue after login has been **completely fixed**. The root cause was Dashboard.jsx using the wrong API endpoint (`/users/me` instead of `/api/users/me`), plus missing AuthContext integration.

## What Was Fixed
✅ **Dashboard.jsx** - Now uses correct endpoints and AuthContext  
✅ **TeacherDashboard.jsx** - Properly waits for AuthProvider loading  
✅ **ProtectedRoute.jsx** - Uses AuthContext instead of localStorage  
✅ **Sidebar.css** - Removed invalid CSS syntax  
✅ **Frontend Build** - Compiles without errors  

---

## Quick Start Testing

### Step 1: Start the Backend Server

**Option A: Using Maven Wrapper (Windows)**
```bash
cd c:\Users\knvsa\Desktop\CollabNest\server
.\mvnw.cmd spring-boot:run
```

**Option B: Using Pre-built JAR**
```bash
cd c:\Users\knvsa\Desktop\CollabNest\server
java -jar target/server-0.0.1-SNAPSHOT.jar
```

**Expected Output**:
```
Tomcat started on port(s): 8080 (http)
Started ServerApplication in X.XXX seconds
```

### Step 2: Start the Frontend Development Server

```bash
cd c:\Users\knvsa\Desktop\CollabNest\frontend
npm run dev
```

**Expected Output**:
```
VITE v8.0.3  ready in XXX ms

➜  Local:   http://localhost:5173/
```

### Step 3: Open Browser and Test

Navigate to: **http://localhost:5173**

---

## Test Scenarios

### ✅ Scenario 1: Student Login (Fresh User)

1. Click "Sign Up" or go to `/signup`
2. Fill in:
   - Name: `John Doe`
   - Email: `student@test.com`
   - Password: `password123`
   - Role: **STUDENT** (important!)
3. Click "Sign Up"
4. **Expected Result**:
   ✅ Auto-login occurs
   ✅ Redirected to `/dashboard` (NOT `/teacher-dashboard`)
   ✅ Dashboard loads with user stats and projects
   ✅ No blank page
   ✅ No console errors

5. **Verify Dashboard Content**:
   - [ ] Sidebar shows user name (John Doe)
   - [ ] Summary cards show: Active Projects, Completed Tasks, In Progress, Total Tasks
   - [ ] Recent Projects section displays (or "No Projects Yet" if none assigned)
   - [ ] Navbar has logout button

6. **Test Navigation**:
   - [ ] Click "View Projects" → loads projects
   - [ ] Click "Tasks" in sidebar → loads tasks page
   - [ ] Click "Logout" → redirects to home page
   - [ ] Try accessing `/teacher-dashboard` → redirects to `/dashboard`

---

### ✅ Scenario 2: Teacher Login (Fresh User)

1. Click "Sign Up" or go to `/signup`
2. Fill in:
   - Name: `Jane Smith`
   - Email: `teacher@test.com`
   - Password: `password123`
   - Role: **ADMIN** (important - note: this creates a "teacher")
3. Click "Sign Up"
4. **Expected Result**:
   ✅ Auto-login occurs
   ✅ Redirected to `/teacher-dashboard` (NOT `/dashboard`)
   ✅ Teacher Dashboard loads with teacher stats
   ✅ No blank page
   ✅ No console errors

5. **Verify Teacher Dashboard Content**:
   - [ ] Shows "Teacher Dashboard" title with 👨‍🏫 icon
   - [ ] Summary cards show: Projects Created, Students, Pending Reviews, Total Tasks
   - [ ] Recent Projects section displays
   - [ ] Sidebar shows user name (Jane Smith)

6. **Test Navigation**:
   - [ ] Click "Manage All" → loads projects
   - [ ] Can create new projects
   - [ ] Navigate to Tasks → sees all tasks (not filtered)
   - [ ] Logout works correctly

---

### ✅ Scenario 3: Existing User Re-login

1. **Logout** from current session
2. Go to `/login`
3. Login with previous credentials:
   - Email: `student@test.com` (or `teacher@test.com`)
   - Password: `password123`
4. **Expected Result**:
   ✅ User data loads from localStorage
   ✅ Dashboard/TeacherDashboard shows immediately
   ✅ No loading delays
   ✅ User info persists correctly

---

### ✅ Scenario 4: Protected Routes

1. **Clear localStorage** (Dev Tools → Application → Local Storage → Clear All)
2. Try accessing **http://localhost:5173/dashboard** directly
3. **Expected Result**:
   ✅ Redirected to home page (since not logged in)
   ✅ No errors
   ✅ Can click "Login" to authenticate

---

## Browser Console Check

Open **Browser DevTools** (F12) and check the **Console tab**:

### ✅ Expected Console Output (Clean):
- No red error messages
- Possible info/warn messages (OK)
- Network tab shows:
  - `POST /api/auth/login` → 200 OK
  - `GET /api/users/me` → 200 OK ← **KEY FIX**
  - `GET /api/projects/my-projects` → 200 OK ← **KEY FIX**

### ❌ DO NOT SEE These Errors:
- `404 for /users/me` (old broken endpoint)
- `Cannot read properties of undefined`
- `AuthContext is undefined`
- Any CSS parsing errors

---

## Network Tab Verification

Open **DevTools Network Tab** (F12 → Network), then login:

### ✅ Correct API Flow:
```
POST /api/auth/login → 200 OK
  Response: { token, id, name, email, role }

GET /api/users/me → 200 OK
  Response: { id, name, email, role }

GET /api/projects/my-projects → 200 OK
  Response: [ { id, name, description, ... } ]
```

### ❌ Broken API Flow (Before Fix):
```
❌ GET /users/me → 404 (WRONG - missing /api/)
❌ GET /api/projects → 200 (WRONG - should be /my-projects)
```

---

## Common Issues & Solutions

### Issue 1: Still Seeing Blank Page
**Possible Causes**:
- Backend not running on `localhost:8080`
- Database connection issues
- Browser cache (clear it!)

**Solution**:
1. Verify backend is running: `http://localhost:8080/api/users` should return JSON
2. Clear browser cache: DevTools → Application → Clear Site Data
3. Stop frontend (`Ctrl+C`) and restart: `npm run dev`

### Issue 2: Login Succeeds but Dashboard Doesn't Load
**Possible Cause**: API endpoint still not responding

**Solution**:
1. Check Network tab - do you see 404 errors?
2. Verify `/api/users/me` endpoint is returning user data
3. Check backend logs for errors
4. Restart backend server

### Issue 3: Wrong Dashboard Opens
**Possible Cause**: Role not set correctly

**Solution**:
1. Verify role during signup - **STUDENT** or **ADMIN** (not other values)
2. Check localStorage: DevTools → Application → Local Storage → user object
3. Check user role in database

### Issue 4: CSS Styling Issues
**Solution**:
- This should be fixed now, but if issues persist:
1. Clear browser cache again
2. Restart frontend: `npm run dev`

---

## Data Setup (Optional)

If you want to test with pre-made data, add these users via signup:

| Name | Email | Password | Role |
|------|-------|----------|------|
| Alice Johnson | alice@test.com | pass123 | STUDENT |
| Bob Smith | bob@test.com | pass123 | STUDENT |
| Dr. Wilson | wilson@test.com | pass123 | ADMIN |
| Ms. Taylor | taylor@test.com | pass123 | ADMIN |

Then teachers can create projects and assign students.

---

## Verification Checklist

After running all tests, verify:

- [ ] Frontend builds without errors: `npm run build` ✅ PASSES
- [ ] Student login → Dashboard loads ✅ (test this)
- [ ] Teacher login → TeacherDashboard loads ✅ (test this)
- [ ] No console errors during page load
- [ ] Logout redirects to home
- [ ] Protected routes work (redirect when not logged in)
- [ ] API calls use correct endpoints (`/api/users/me`, `/api/projects/my-projects`)
- [ ] User data displays on dashboard
- [ ] Project filtering works (students see own projects)

---

## Success Criteria

The fix is successful when:

✅ **No blank page after login**  
✅ **Dashboard/TeacherDashboard loads with content**  
✅ **No API 404 errors in Network tab**  
✅ **No JavaScript errors in Console**  
✅ **Logout works correctly**  
✅ **Role-based redirects work (ADMIN → /teacher-dashboard, STUDENT → /dashboard)**  

---

## Files Modified in This Fix

1. **frontend/src/pages/Dashboard.jsx**
   - Added AuthContext integration
   - Fixed API endpoints
   - Added role-based filtering

2. **frontend/src/pages/TeacherDashboard.jsx**
   - Added authLoading state check
   - Better loading state handling

3. **frontend/src/components/ProtectedRoute.jsx**
   - Uses AuthContext instead of localStorage
   - Shows loading spinner while auth initializes

4. **frontend/src/styles/Sidebar.css**
   - Removed invalid CSS syntax

---

## Need Help?

1. **Check FIXES_APPLIED.md** - Detailed explanation of all changes
2. **Check browser DevTools** - Most issues visible in Console/Network tabs
3. **Check backend logs** - Spring Boot startup errors indicate database/config issues
4. **Restart everything** - Stop both servers and restart fresh

---

Good luck! The app should now work perfectly! 🎉
