# Interactive Learning Management System (LMS)

This is a comprehensive Learning Management System with a dashboard and multiple tabs for managing different aspects of an educational institution.

## Features

### Dashboard
- User role-specific dashboards (Admin, Teacher, Student)
- Analytics and performance charts
- Announcements and upcoming events

### Tabs Available

1. **Dashboard** - Main overview with analytics
2. **Admin Panel** - Full system management capabilities
3. **Teachers** - Faculty directory and management
4. **Students** - Student directory and management
5. **Courses** - Course scheduling and management
6. **Grades** - Gradebook and academic performance tracking
7. **Syllabi** - Syllabus creation and management
8. **Payment** - Billing and financial tracking
9. **Transcript** - Academic records and transcripts
10. **Events & Shows** - Upcoming events management
11. **Announcements** - Communication system
12. **Photo Studio** - Student photo management

## User Roles

- **Admin**: Full access to all features
- **Teacher**: Access to student management, grades, courses, syllabi
- **Student**: Access to personal profile, grades, courses, payments

## Technology Stack

- React with TypeScript
- Vite for build tooling
- Lucide React for icons
- Recharts for data visualization
- Tailwind CSS for styling

## Getting Started

### Option 1: Using Python Server (Recommended for this environment)
1. Run the Python server:
   ```bash
   python3 server.py
   ```
2. Open your browser and navigate to `http://localhost:8000`

### Option 2: Direct Browser Access
1. Open the file `/workspace/dist/index.html` directly in your browser

### Option 3: Development Environment (if dependencies can be installed)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Access the application at `http://localhost:5173`

## Demo Credentials

- Admin: admin / password
- Student: msrdharangit23@gmail.com / password
- Teacher: director@academy.com / password

## Key Functionality

- User authentication and role-based access
- Student and teacher management
- Course scheduling and enrollment
- Grade tracking and reporting
- Payment processing and billing
- Syllabus creation and management
- Academic transcript generation
- Event and announcement management
- Photo management for students

The system is fully interactive with CRUD operations, real-time data updates, and responsive design for all device sizes.