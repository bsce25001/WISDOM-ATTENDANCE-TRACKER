# WISDOM ATTENDANCE TRACKER

A full-stack web application for managing attendance of WISDOM organization members.

## Features

- **Login System** — Role-based authentication (Admin/Student)
- **Admin Dashboard**
  - Manage Students (Add, Edit, Delete, View)
  - Manage Events/Meetings
  - Mark Attendance per event (Present/Absent toggles)
  - Attendance Statistics (Charts & Tables)
  - Download PDF Reports per student
- **Student Dashboard**
  - View personal attendance history
  - Download personal PDF report
- **Welcome message**: "Welcome to WISDOM ATTENDANCE TRACKER"
- **Color theme**: White, Gray, Orange, Blue

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js + Express
- **Database**: MongoDB

## Project Structure

```
WISDOM-ATTENDANCE-TRACKER/
├── backend/           # Node.js + Express API
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── middleware/    # Auth middleware
│   ├── server.js      # Express server entry
│   └── seed.js        # Database seeder
└── frontend/          # React.js app
    └── src/
        ├── pages/     # Login, Admin, Student pages
        ├── components/# Shared components (AdminLayout)
        ├── context/   # Auth context
        └── api/       # Axios instance
```

## Setup & Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed database with admin + 22 students
npm run seed

# Start server
npm start
# Or for development with auto-reload:
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm start
```

The app will open at http://localhost:3000

### Default Credentials

| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@wisdom.com       | admin123   |
| Student | (any student email) | student123 |

Example student logins:
- `malikharisarshad29@gmail.com` / `student123`
- `m.adilbaltistani@gmail.com` / `student123`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Current user |
| GET | /api/students | List students |
| POST | /api/students | Add student |
| PUT | /api/students/:id | Update student |
| DELETE | /api/students/:id | Delete student |
| GET | /api/events | List events |
| POST | /api/events | Create event |
| GET | /api/attendance/event/:id | Get event attendance |
| GET | /api/attendance/student/:id | Get student attendance |
| POST | /api/attendance/mark-bulk | Mark bulk attendance |
| GET | /api/attendance/stats | Overall statistics |
| GET | /api/reports/student/:id | Download PDF report |
