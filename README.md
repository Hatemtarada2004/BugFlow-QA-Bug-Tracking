<div align="center">

# 🐛 BugFlow — QA Bug Tracking System

**A production-grade bug tracking platform built for QA engineers, developers, and project managers.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

[Live Demo](#demo-accounts) · [Features](#features) · [Tech Stack](#tech-stack) · [Getting Started](#getting-started)

</div>

---

## Overview

BugFlow is a full-stack bug tracking system with role-based access control, real-time activity logs, file attachments, email notifications, and analytical dashboards. Built as a portfolio project to demonstrate full-stack TypeScript development, REST API design, and modern QA tooling practices.

---

## Features

### Bug Management
- **Full CRUD** — Create, view, edit, and delete bugs with rich metadata
- **Priority & Severity** — 4 priority levels (Low → Critical) and 5 severity levels (Trivial → Blocker)
- **Status Workflow** — Open → In Progress → Fixed → Closed
- **Assignment** — Assign bugs to specific developers with email notifications
- **Steps to Reproduce** — Structured fields for expected result, actual result, and environment

### Dashboard & Analytics
- **Live Stats** — Total, Open, In Progress, Fixed, Closed, and Assigned-to-me counters
- **Interactive Charts** — Donut chart by status, horizontal bar charts by severity and priority, bar chart by project (Recharts)
- **Recent Bugs Feed** — Latest bugs with priority and status indicators

### Search, Filters & Export
- **Smart Search** — Real-time debounced text search across title and description
- **Multi-filter** — Filter by status, priority, severity, and project simultaneously
- **Active Filter Chips** — Visual chips for each active filter with individual clear buttons
- **CSV Export** — One-click export of filtered results with BOM encoding for Excel compatibility
- **Pagination** — Server-side pagination with 20 bugs per page

### Collaboration
- **Comments** — Threaded comments on every bug with avatar initials
- **Activity Timeline** — Immutable audit log of every change (status, priority, severity, assignment) with timestamps
- **File Attachments** — Upload images, PDFs, CSVs, and videos (up to 10 MB) per bug

### Access Control
- **Role-Based Access (RBAC)** — Three roles: Admin, Tester, Developer with enforced permissions
  - **Admin** — Full access: manage users, create/delete any bug, admin panel
  - **Tester** — Create and manage bugs, upload attachments, add comments
  - **Developer** — View bugs, update status, add comments, upload attachments
- **JWT Authentication** — Secure token-based auth with 7-day expiry

### Developer Experience
- **Dark Mode** — Full dark mode with localStorage persistence and anti-flash script
- **Bilingual** — Full English/Arabic UI with RTL layout support (react-i18next)
- **E2E Tests** — 13 Playwright tests covering auth, bug management, and dashboard
- **Email Notifications** — Nodemailer + Gmail SMTP when a bug is assigned

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, React Router v7, Recharts, React Hook Form + Zod, react-i18next |
| **Backend** | Node.js 20, Express 5, TypeScript, Prisma ORM v5, Zod validation |
| **Database** | PostgreSQL 17 |
| **Auth** | JWT (jsonwebtoken), bcrypt |
| **File Upload** | Multer with disk storage |
| **Email** | Nodemailer (Gmail SMTP) |
| **Testing** | Playwright E2E (Chromium) |

---

## Project Structure

```
BugFlow/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database models
│   │   └── seed.ts             # Demo data (25 bugs, 4 projects, 5 users)
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/         # Auth, role guard, error handler
│   │   ├── routes/             # Express routers
│   │   ├── lib/                # Prisma client, Multer, Nodemailer
│   │   ├── validators/         # Zod schemas
│   │   └── app.ts              # Express app entry point
│   └── uploads/                # Uploaded files (gitignored)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Sidebar, AppLayout
│   │   │   └── ui/             # Button, Input, Badge, Skeleton, Spinner
│   │   ├── context/            # AuthContext (JWT, user state)
│   │   ├── hooks/              # useDarkMode
│   │   ├── pages/              # All page components
│   │   ├── services/           # Axios instance
│   │   ├── types/              # TypeScript interfaces
│   │   └── i18n/               # EN/AR translation files
│   └── index.html
└── e2e/
    ├── tests/
    │   ├── auth.spec.ts         # Login / register tests
    │   ├── bugs.spec.ts         # Bug CRUD tests
    │   └── dashboard.spec.ts    # Dashboard tests
    └── playwright.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 17 running locally
- npm or pnpm

### 1. Clone the repository

```bash
git clone https://github.com/Hatemtarada2004/BugFlow-QA-Bug-Tracking.git
cd BugFlow-QA-Bug-Tracking
```

### 2. Set up the backend

```bash
cd backend
npm install

# Copy the environment file
cp .env.example .env
```

Edit `.env` and fill in your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/bugflow"
JWT_SECRET="your-super-secret-key-change-this"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development

# Optional: Email notifications (Gmail App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
APP_URL=http://localhost:5173
```

```bash
# Push schema to database
npm run db:push

# Seed with demo data (25 bugs, 4 projects, 5 users)
npm run db:seed

# Start the dev server
npm run dev
```

Backend runs at **http://localhost:5000**

### 3. Set up the frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## Demo Accounts

The seed script creates these accounts ready to use:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | admin@bugflow.com | admin123 | Full access — manage users, all bugs |
| **Tester** | tester@bugflow.com | tester123 | Create bugs, add comments, upload files |
| **Developer** | dev@bugflow.com | dev123456 | View bugs, update status, add comments |

The seed also creates **25 realistic bugs** across 4 projects with comments, activity logs, and various statuses — no setup needed to explore the full UI.

---

## API Endpoints

```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login and receive JWT

GET    /api/bugs                   List bugs (search, filter, paginate)
POST   /api/bugs                   Create bug
GET    /api/bugs/stats             Dashboard statistics
GET    /api/bugs/:id               Get bug details
PUT    /api/bugs/:id               Update bug
DELETE /api/bugs/:id               Delete bug
GET    /api/bugs/:id/activity      Activity log for a bug

GET    /api/projects               List projects
POST   /api/projects               Create project
PUT    /api/projects/:id           Update project
DELETE /api/projects/:id           Delete project

POST   /api/comments/:bugId        Add comment
DELETE /api/comments/:id           Delete comment

GET    /api/attachments/:bugId     List attachments
POST   /api/attachments/:bugId     Upload file
DELETE /api/attachments/:id        Delete attachment

GET    /api/users                  List users (Admin only)
PUT    /api/users/:id/role         Update user role (Admin only)
```

---

## Running E2E Tests

Make sure both backend and frontend are running, then:

```bash
cd e2e
npm install
npx playwright install chromium
npm test
```

Tests cover: login, registration, creating bugs, editing bugs, dashboard stats.

---

## Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)
*Live stats, interactive Recharts donut/bar charts, and recent bugs feed*

### Bug List
![Bug List](screenshots/bugs-list.png)
*Advanced search, multi-filter, active filter chips, CSV export, and pagination*

### Projects
![Projects](screenshots/projects.png)
*Project cards with bug count badges and color-coded status indicators*

---

## License

MIT © 2025 Hatem Tarada
