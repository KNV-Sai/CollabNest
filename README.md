# CollabNest

CollabNest is a group project management platform for students and teachers.

- **Teacher (Admin):** creates projects, monitors tasks, and reviews submissions.
- **Student:** views assigned projects, updates task progress, and submits work.

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Spring Boot, Spring Security (JWT), Spring Data JPA, Hibernate
- **Database:** MySQL

## Project Structure

- `frontend/` - React web client
- `server/` - Spring Boot API

## Prerequisites

- Node.js 20+
- Java 17+
- MySQL 8+

## Environment Setup

1. Copy `.env.example` and set secure values.
2. Configure backend environment variables:
   - `APP_JWT_SECRET`
   - `APP_CORS_ALLOWED_ORIGINS` (for example `http://localhost:5173`)
3. Create `frontend/.env` with:
   - `VITE_API_BASE_URL=http://localhost:8080/api`

## Run Backend

```bash
cd server
./mvnw spring-boot:run
```

Windows:

```powershell
cd server
.\mvnw.cmd spring-boot:run
```

Backend defaults are in `server/src/main/resources/application.properties`:
- port `8080`
- MySQL URL `jdbc:mysql://localhost:3306/project_db`

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Build and Test

Backend:

```bash
cd server
./mvnw test
```

Frontend:

```bash
cd frontend
npm run build
```

## Production Notes

- Use a strong, private `APP_JWT_SECRET`.
- Restrict `APP_CORS_ALLOWED_ORIGINS` to trusted domains.
- Do not use default database credentials in production.
- Serve frontend and backend behind HTTPS.
