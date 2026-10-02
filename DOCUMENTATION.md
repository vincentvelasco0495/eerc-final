# EERC LMS — System Documentation

This document describes the **EERC Learning Management System (LMS)** built in this repository: what it does, how it is structured, who uses it, and how to run and deploy it.

**For end-user instructions (students and administrators), see [USER_MANUAL.md](./USER_MANUAL.md).**

---

## Table of contents

1. [System overview](#1-system-overview)
2. [Architecture](#2-architecture)
3. [User roles and access](#3-user-roles-and-access)
4. [Feature modules](#4-feature-modules)
5. [Enrollment and payments](#5-enrollment-and-payments)
6. [Content management (CMS)](#6-content-management-cms)
7. [Authentication](#7-authentication)
8. [Local development setup](#8-local-development-setup)
9. [Production deployment](#9-production-deployment)
10. [Environment variables](#10-environment-variables)
11. [Database and demo data](#11-database-and-demo-data)
12. [API overview](#12-api-overview)
13. [Troubleshooting](#13-troubleshooting)
14. [Key file locations](#14-key-file-locations)

---

## 1. System overview

**EERC LMS** is a full-stack learning platform for professional and continuing education (e.g. board review, engineering programs). It combines:

| Layer | Purpose |
|--------|---------|
| **Public website** | Marketing homepage, About Us, Contact Us, program/course catalog |
| **Student portal** | Browse programs, apply for enrollment, pay fees, take courses, quizzes, and assignments |
| **Staff portal** | Admin and instructors manage enrollments, payments, courses, gradebook, announcements, and site content |

**Repository layout:**

```
eerc-v2/
├── src/                 # React frontend (Vite)
├── backend/             # Laravel 11 API
├── public/              # Static assets, SPA redirects
├── .env                 # Frontend environment (VITE_*)
└── backend/.env         # Backend environment
```

**Production URLs (example):**

- Frontend: `https://eerc-v2.netlify.app` and `https://eerc-final.netlify.app` (Netlify)
- Backend API: `https://api.atlanticseamandormitory.com` (Hostinger)

---

## 2. Architecture

### Frontend

| Technology | Use |
|------------|-----|
| React 19 + Vite 7 | Single-page application |
| React Router 7 | Routing and navigation |
| MUI 7 | UI components |
| Redux + Redux Saga | LMS data fetching and mutations |
| React Hook Form + Zod | Forms and validation |
| Axios | HTTP client to Laravel API |
| TipTap | Rich text (courses, CMS, announcements) |

**Entry points:**

- App router: `src/app/routes/router.jsx`
- Path constants: `src/routes/paths.js`
- Dashboard routes: `src/app/routes/sections/dashboard.jsx`

When `VITE_SERVER_URL` is **empty**, the app uses **mock data** from `src/services/lms.service.js` (offline/demo mode).

When `VITE_SERVER_URL` is **set**, all LMS reads/writes go to the Laravel API.

### Backend

| Technology | Use |
|------------|-----|
| Laravel 11 | REST JSON API |
| Laravel Sanctum | Bearer token authentication |
| MySQL | Primary database (`eerc_lms`) |
| Eloquent | ORM and relationships |

Most business logic lives in **`App\Services\LmsCatalogService`**. Routes are defined in **`backend/routes/api.php`**.

### How frontend and backend connect

```
Browser (Netlify)
    │
    │  HTTPS + Authorization: Bearer {token}
    ▼
Laravel API (Hostinger)
    │
    ▼
MySQL database
```

The browser enforces **CORS**: the API must return `Access-Control-Allow-Origin` for the frontend domain (see [Production deployment](#9-production-deployment)).

---

## 3. User roles and access

There are three roles stored on `users.role`:

| Role | Default home after login | Who they are |
|------|--------------------------|--------------|
| **student** | `/available-programs` | Learners enrolling in programs and taking courses |
| **instructor** | `/instructor-home` | Teachers managing courses, gradebook, enrollments |
| **admin** | `/dashboard` | Full system access including user and program settings |

### How permissions work

1. Permissions are stored in **`role_page_permissions`** (seeded by `RolePagePermissionSeeder`).
2. On login, `GET /api/user` returns **`pagePermissions`** for the user’s role.
3. The frontend **`PermissionGuard`** and sidebar menus use `src/auth/utils/page-permissions.js` to show/hide pages.

If the API has not loaded permissions yet, **fallback rules** in the same file allow basic access per role.

### What each role can do (summary)

#### Student

- View available programs and program cards
- Submit enrollment application (`/enrollment/apply`)
- Pay downpayment and partial payments on enrolled programs
- View payment history on their program cards
- Take courses, quizzes, and assignments
- Edit profile at `/settings`
- View quiz history

#### Instructor

- Everything in the student list that applies to staff, plus:
- Review enrollment applications (`/enrollment`)
- Review payment history across all students (`/payment-history`)
- Mark payments as **Correct** or **Invalid**
- Build and edit course curriculum
- Gradebook, assignments, student quizzes
- Post announcements
- Edit CMS content (homepage, about, contact)
- Configure enrollment-related settings (learning modes, branches, schedules, packages, honors/discounts)

#### Admin

- All instructor capabilities, plus:
- Manage programs and enrollment fees (`/setting-program`)
- Manage instructors and students
- Batch enroll settings
- Payment method settings (bank/e-wallet)
- Admin tools page (`/admin`)

**Sidebar navigation:**

- Student: `src/features/student-profile/student-profile-data.js`
- Admin/Instructor: `src/features/instructor-profile/instructor-profile-data.js`

---

## 4. Feature modules

### 4.1 Public marketing site

| Page | URL | Data source |
|------|-----|-------------|
| Homepage | `/` | `GET /api/homepage-v2` |
| About Us | `/about-us` | `GET /api/about-us` |
| Contact Us | `/contact-us` | `GET /api/contact-page` |
| Program / course detail | `/program-course-detail`, `/course-details/:slug` | Programs & courses API |

Homepage sections (editable in CMS): Hero, Benefits Cards, Instructor Showcase, **Advertise Sample Lecture** (video), Statistics, Success Stories, How It Works, Featured Content.

### 4.2 Programs and catalog

- **Admin:** `/setting-program` — create/edit programs, set **enrollment fee** per program, upload banners.
- **Student:** `/available-programs` — program cards show fee, enrollment status, and actions (partial pay, payment history, view program).

Backend stores `enrollment_fee` on the `programs` table.

### 4.3 Courses and curriculum

- **Course list:** `/courses`
- **Course player:** `/course-details/:slug` — text lessons, video lessons, quizzes, assignments
- **Curriculum builder:** `/course-curriculum`, `/course-curriculum/:slug/edit`
  - Modules, lessons, reorder
  - Upload lesson materials (including video)
  - Quizzes and assignments attached to modules

### 4.4 Enrollment (staff)

**URL:** `/enrollment`

- Paginated list of learner applications (grouped by student)
- Search by name, email, program, etc.
- Expand a row to see each program/course enrollment
- Actions: **View**, **Payment history**, **Approve**, **Hold**, **Reject**
- Rows **highlighted in yellow** when the student has payments waiting for admin review

### 4.5 Payment history (staff)

**URL:** `/payment-history`

- Global list of all downpayments and partial payments
- Filters: search, verification status (Pending / Correct / Invalid)
- Server-side pagination (`page`, `per_page` in URL)
- Actions: view proof, mark **Correct** or **Invalid**
- Only **Correct** payments count toward the student’s paid balance

**API:** `GET /api/enrollment-payments`

### 4.6 Enrollment application (student)

**URL:** `/enrollment/apply?programId=...`

Multi-step wizard:

1. Personal information  
2. Enrollment setup (program, batch, learning mode, branch, schedule)  
3. Documents and discounts  
4. Package and consent  
5. Exam payment (downpayment + proof upload)  
6. Review and submit  

Form options (batches, branches, etc.) come from `GET /api/enrollment-form/options`.

### 4.7 Quizzes and assignments

- **Student:** `/quizzes`, `/assignments`, in-course quiz/assignment pages
- **Instructor:** `/student-quizzes`, `/assignment` (+ per-assignment student lists and leaderboards)
- **Gradebook:** `/gradebook`

Quiz attempts are saved via `POST /api/quizzes/{id}/attempts`. Session state can persist in `sessionStorage` during an attempt.

### 4.8 Announcements and notifications

- **Create:** `/announcement` (staff with permission)
- Creates in-app notifications for users with **approved** enrollments
- **Bell drawer:** `GET /api/notifications`, mark read/unread

Partial payment submissions also notify admins via the notification system.

### 4.9 Feedback inbox

- Public contact form submissions
- **Staff:** `/feedback` — view and manage messages

### 4.10 Analytics and leaderboard

- `/analytics` — learner/instructor analytics
- `/leaderboard` — daily, weekly, overall rankings

---

## 5. Enrollment and payments

This is one of the most important flows in the system.

### 5.1 Enrollment lifecycle

```
Student applies (wizard)
        │
        ▼
Status: pending ──► admin: Approve / Hold / Reject
        │
        ▼
Status: approved ──► student gets access to enrolled courses / notifications
```

Enrollment records live in the **`enrollments`** table. Application data (form fields, partial payments) is stored in **`form_data`** (JSON).

### 5.2 Payment types

| Type | When | Proof |
|------|------|--------|
| **Initial downpayment** | Submitted with enrollment application | `payment_proof_path` on enrollment |
| **Partial payment** | Student pays remaining balance later | Document in `form_data.partialPayments[]` |

### 5.3 Payment verification statuses

Each payment has a **verification status**:

| Status | Meaning |
|--------|---------|
| `pending` | Submitted, waiting for admin review |
| `correct` | Verified — **counts toward balance** |
| `invalid` | Rejected — **does not count toward balance** |

Admins set status from:

- **Enrollment** page → Payment history dialog per enrollment  
- **Payment history** page → global list  

**API:** `PATCH /api/enrollments/{publicId}/payments/{paymentId}/verification`

### 5.4 Balance calculation

- **Total paid** = sum of amounts where verification status is **`correct`**
- **Remaining** = program enrollment fee − total paid (correct only)
- Partial payment form validates: amount paid ≤ remaining balance

### 5.5 Student-facing payment actions

On each program card (`/available-programs`), students with an approved/pending enrollment can:

- **Pay partial amount** — upload proof and amount  
- **View payment history** — all downpayment + partial entries with status  
- **View program** — program detail page  

### 5.6 Admin signals

- Enrollment table rows **highlight yellow** when `hasUnreviewedPayments` is true  
- Payment history page highlights **pending** rows the same way  
- Admin receives notification when a student submits a partial payment  

---

## 6. Content management (CMS)

Staff with **Content management** permission can edit public pages without code changes.

| CMS page | URL | Backend sections |
|----------|-----|------------------|
| Homepage v2 | `/content-management/homepage-v2` | `homepage_sections` (hero, feature_cards, instructors, sample_lecture, stats, …) |
| About Us | `/content-management/about-us` | `about_page_sections` |
| Contact Us | `/content-management/contact-us` | `contact_page_sections` |

**Media uploads:**

- Images: JPG, PNG, WebP (via `POST /api/admin/upload`)
- Sample lecture video: MP4, WebM, OGG (same upload endpoint, extended MIME types)
- Files stored under `storage/app/public/cms/` and served via `/api/media/{id}/file`

Each section has **Visible** toggle and **Published / Draft** status. Public site uses `GET /api/homepage-v2` (drafts only with `?preview=1` when logged in).

---

## 7. Authentication

### Production (Laravel Sanctum)

1. User opens **`/login`** and submits email + password.  
2. Frontend calls **`POST /api/login`**.  
3. API returns `{ user, token, token_type: "Bearer" }`.  
4. Token is stored in **`sessionStorage`** (`lms_sanctum_token`) via `src/lib/lms-sanctum-session.js`.  
5. Axios adds **`Authorization: Bearer {token}`** on every API request.  
6. On app load, **`GET /api/user`** restores the session.  
7. Logout: **`POST /api/logout`** and clear token.

**Note:** Login **revokes previous tokens** — only one active session per user at a time.

### Registration

- **`POST /api/register`** — creates account with role **`student`**, student profile row, and LMS profile.

### Demo / offline mode

If **`VITE_SERVER_URL`** is empty:

- No real API calls; data comes from mocks.  
- Optional frontend demo login (`VITE_ALLOW_DEMO_SIGN_IN`).

---

## 8. Local development setup

### Prerequisites

- **Node.js** 22+  
- **PHP** 8.2+ and **Composer**  
- **MySQL** (or use SQLite for quick tests)

### Frontend

```bash
# From repo root
npm install
# or: yarn install

# Create .env (copy from comments in repo or use):
# VITE_SERVER_URL=http://127.0.0.1:8000

npm run dev
# App runs at http://localhost:3030
```

### Backend

```bash
cd backend
composer install
cp .env.example .env   # Windows: copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
# API at http://127.0.0.1:8000
```

### Backend `.env` (local)

```env
APP_URL=http://127.0.0.1:8000
CORS_ALLOWED_ORIGINS=http://localhost:3030,http://127.0.0.1:3030,http://localhost:5173,http://127.0.0.1:5173
DB_DATABASE=eerc_lms
DB_USERNAME=root
DB_PASSWORD=your_password
```

### Root `.env` (local)

```env
VITE_SERVER_URL=http://127.0.0.1:8000
```

Run **both** frontend and backend for full integration.

---

## 9. Production deployment

### Frontend — Netlify

| Setting | Value |
|---------|--------|
| Build command | `npm run build` or `yarn build` |
| Publish directory | `dist` |
| Node version | 22+ recommended |

**Environment variables (Netlify UI → Site settings → Environment variables):**

```env
VITE_SERVER_URL=https://api.atlanticseamandormitory.com
VITE_ALLOW_DEMO_SIGN_IN=false
```

Redeploy after changing `VITE_*` variables (they are baked in at build time).

SPA routing: `public/_redirects` contains `/* /index.html 200`.

### Backend — Hostinger

1. Upload Laravel project; point document root to **`public/`**.  
2. Configure **`backend/.env`** (database, `APP_URL`, `APP_KEY`, `CORS_ALLOWED_ORIGINS`).  
3. Run:

```bash
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan storage:link
```

Ensure **`storage/`** and **`bootstrap/cache/`** are writable.

### CORS (required for Netlify + Hostinger)

The browser blocks API responses if the backend does not allow the frontend origin.

Allow **every** live frontend origin (no trailing slash). Do not hardcode a single Netlify URL — that makes the other site fail:

```env
CORS_ALLOWED_ORIGINS=https://eerc-v2.netlify.app,https://eerc-final.netlify.app
```

`backend/config/cors.php` already includes both sites plus localhost. After uploading files on Hostinger:

```bash
php artisan config:clear
php artisan config:cache
```

If Hostinger/hPanel has a CORS field set to only one URL (for example only `https://eerc-final.netlify.app`), **clear it**. A static `Access-Control-Allow-Origin` that never matches the page you opened is the usual production CORS error.

**Verify CORS** (the echoed origin must match the `Origin` you sent):

```bash
curl -I "https://api.atlanticseamandormitory.com/api/programs" \
  -H "Origin: https://eerc-v2.netlify.app"
```

You should see:

```http
Access-Control-Allow-Origin: https://eerc-v2.netlify.app
```

Repeat with `Origin: https://eerc-final.netlify.app` and confirm that header is `https://eerc-final.netlify.app`.

---

## 10. Environment variables

### Frontend (repo root `.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SERVER_URL` | For production | Laravel API base URL; empty = mock mode |
| `VITE_ALLOW_DEMO_SIGN_IN` | No | Set `false` in production |
| `VITE_ASSETS_DIR` | No | Static asset path prefix |
| `VITE_ENROLLMENT_FEE_*` | No | Optional overrides for enrollment payment UI |

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `APP_KEY` | Yes | `php artisan key:generate` |
| `APP_URL` | Yes | Public API URL |
| `APP_DEBUG` | Yes | `false` in production |
| `DB_*` | Yes | MySQL connection |
| `CORS_ALLOWED_ORIGINS` | Yes (multi-origin) | Comma-separated frontend URLs, no trailing slash |

---

## 11. Database and demo data

### Fresh install

```bash
cd backend
php artisan migrate --seed
```

### Import SQL dump (optional)

```bash
mysql -u root -p eerc_lms < backend/database/database.mysql
```

### Seeder order (`DatabaseSeeder`)

1. `LmsDemoSeeder` — programs, courses, users, enrollments, leaderboard  
2. Enrollment lookup tables (batch, branch, review schedule, honors, packages, learning modes)  
3. CMS sections (homepage, about, contact)  
4. `RolePagePermissionSeeder` — role → page access  

### Demo accounts (password: `password`)

| Email | Role |
|-------|------|
| `alex.rivera@eerc.edu` | admin |
| `mina@demo.edu` | student |
| `reese@demo.edu` | instructor |

---

## 12. API overview

**Base URL:** `{APP_URL}/api`

### Public (no token)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/login`, `/register` | Authentication |
| GET | `/homepage-v2`, `/about-us`, `/contact-page` | Public CMS |
| GET | `/programs`, `/courses`, `/courses/{id}/detail` | Catalog |
| POST | `/contact-feedback` | Contact form |

### Authenticated (`Authorization: Bearer {token}`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/user` | Current user + permissions |
| GET/PATCH | `/user` | Profile update (student fields) |
| GET | `/enrollments` | List enrollments (paginated for staff) |
| POST | `/enrollments` | Submit enrollment |
| PATCH | `/enrollments/{id}` | Approve / hold / reject |
| GET | `/enrollment-payments` | Global payment history (staff) |
| POST | `/enrollments/{id}/partial-payments` | Student partial payment |
| PATCH | `/enrollments/{id}/payments/{paymentId}/verification` | Verify payment |
| GET | `/enrollments/{id}/payment-proof` | Download initial proof |
| GET | `/enrollments/{id}/documents/{key}` | Download partial proof |

Full route list: **`backend/routes/api.php`**.

### Pagination pattern

Many list endpoints accept:

```
?page=1&per_page=10&search=...
```

Response shape:

```json
{
  "data": [ ... ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 42,
    "from": 1,
    "to": 10
  }
}
```

---

## 13. Troubleshooting

### CORS error in browser console

**Symptom:**  
`Access to XMLHttpRequest ... has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header`

**Fix:**

1. Upload updated `backend/config/cors.php` and `backend/public/.htaccess` to Hostinger.  
2. Set `CORS_ALLOWED_ORIGINS` to **both** Netlify URLs (see [Production deployment](#9-production-deployment)).  
3. Remove any Hostinger/hPanel CORS setting that always sends a single origin.  
4. Run `php artisan config:clear` and `php artisan config:cache`.  
5. Confirm with `curl -I` that `Access-Control-Allow-Origin` **matches** the request `Origin`.

### Frontend shows mock data instead of API

**Symptom:** Demo users or stale data; no real enrollments.

**Fix:** Set `VITE_SERVER_URL` in Netlify and **rebuild** the site.

### Login works locally but not in production

- Check API URL in built app (Network tab → request host).  
- Check CORS and that `/api/login` returns 200.  
- Ensure MySQL on Hostinger has migrated tables and seeded users.

### Student profile “School held” shows wrong value

The field maps to `students.school_held` in the database, not email. Update via `/settings` and save (requires phone + birthday per API validation).

### Netlify build fails on ESLint

Run locally before push:

```bash
npm run lint
npm run build
```

Fix import order errors (`perfectionist/sort-imports`) with:

```bash
npm run lint:fix
```

### Payment history empty for staff

- Ensure user role is **admin** or **instructor**.  
- Check `/payment-history` is in `role_page_permissions`.  
- Confirm enrollments have downpayment or partial payments in `form_data`.

---

## 14. Key file locations

| Topic | Path |
|-------|------|
| API routes | `backend/routes/api.php` |
| LMS business logic | `backend/app/Services/LmsCatalogService.php` |
| Enrollment payments helper | `backend/app/Support/EnrollmentPayments.php` |
| CORS config | `backend/config/cors.php` |
| Page permissions seeder | `backend/database/seeders/RolePagePermissionSeeder.php` |
| Frontend routes | `src/routes/paths.js`, `src/app/routes/sections/dashboard.jsx` |
| Auth + Sanctum session | `src/lib/lms-sanctum-session.js`, `src/auth/context/jwt/` |
| API client | `src/lib/axios.js`, `src/redux/api/lmsApi.js` |
| Enrollment admin table | `src/components/enrollments/EnrollmentTable.jsx` |
| Payment history page | `src/pages/dashboard/payment-history.jsx` |
| Enrollment wizard | `src/features/enrollment/enrollment-wizard/` |
| Student program cards | `src/features/instructor-profile/components/instructor-program-card/` |
| Homepage CMS | `src/features/content-management/views/homepage-v2-cms-view/` |
| Public homepage | `src/sections/home-v2/view/home-v2-view.jsx` |
| Backend setup guide | `backend/README.md` |

---

## Document history

This documentation reflects the EERC LMS as implemented in the **eerc-v2** repository, including enrollment fees, payment verification, staff payment history, CMS homepage (including sample lecture video), and Netlify + Hostinger deployment.

For API endpoint details beyond this summary, see **`backend/README.md`**.
