<p align="center">
  <img src="frontend/public/logo.svg" alt="ResumeLens Logo" width="120" height="120" />
</p>

<h1 align="center">ResumeLens</h1>

<p align="center">
  <strong>An open-source, developer-first resume builder and ATS optimization platform.</strong>
</p>

<p align="center">
  <a href="https://resume-lens-puce-one.vercel.app"><strong>Live Demo on Vercel »</strong></a>
</p>

---

ResumeLens is a self-hosted SaaS application designed to help job seekers build, style, and optimize their resumes for Applicant Tracking Systems (ATS). The platform features an interactive resume builder, dynamic rendering templates, an AI-powered resume audit engine, and integrated subscription billing.

---

## Architecture Overview

ResumeLens is structured as a decoupled monorepo containing a TypeScript/Express backend API and a Next.js frontend client.

```mermaid
graph TD
    Client[Next.js 16 Client] <-->|HTTP / JSON| API[Express API Gateway]
    API <-->|Prisma Client| DB[(PostgreSQL)]
    API <-->|Secure SDK| Groq[Groq API Llama 3.3 70B]
    API <-->|Webhook & API| Razorpay[Razorpay payment gateway]
```

- **Client App**: Single-page interactive builder using React Hook Form and Zustand for client-side state.
- **Backend API**: Stateless REST API built on Express, handling authentication, data validation, resume assembly, and third-party API integration.
- **AI Processing Layer**: Connects to the Groq API utilizing `llama-3.3-70b-versatile` to perform deterministic JSON-based resume parsing, keyword checking, and career recommendations.
- **Database Layer**: PostgreSQL database managed through the Prisma Object-Relational Mapper (ORM).

---

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router) & React 19
- **Styling**: Tailwind CSS v4 (using PostCSS)
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query v5 & Axios
- **Form Handling**: React Hook Form

### Backend
- **Runtime**: Node.js & TypeScript
- **Framework**: Express (v5)
- **Database ORM**: Prisma Client (v6)
- **Security**: JWT Authentication, bcrypt password hashing, and CORS middleware
- **Third-Party Integrations**: Razorpay Node SDK, Groq API

---

## Project Structure

```
├── backend/
│   ├── prisma/             # Database schemas & migrations
│   ├── src/
│   │   ├── config/         # App configuration & DB client instances
│   │   ├── controllers/    # Express request handlers
│   │   ├── middleware/     # JWT Auth and validation layers
│   │   ├── routes/         # Express endpoint definitions
│   │   ├── services/       # Core business logic (AI, Payment, ATS)
│   │   ├── types/          # Shared TypeScript interfaces
│   │   └── utils/          # Helper functions
│   └── tsconfig.json
├── frontend/
│   ├── public/             # Static templates and icons
│   ├── src/
│   │   ├── app/            # Next.js App Router structure
│   │   ├── components/     # UI elements & custom layout views
│   │   ├── store/          # Zustand global stores
│   │   └── styles/         # CSS and tailwind entrypoints
│   └── tsconfig.json
└── docker-compose.yml       # Local PostgreSQL database services
```

---

## Environment Variables

To run the application, configure the environment variables in both the `backend` and `frontend` directories.

### Backend Config (`backend/.env`)

Create a `.env` file inside the `backend/` directory:

| Variable | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `PORT` | Local port for Express API | `3001` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/resumelens` |
| `JWT_SECRET` | Secret token signing key | `your-secure-jwt-secret-string` |
| `RAZORPAY_KEY_ID` | Razorpay Merchant Public Key | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay Merchant Secret Key | `secret_...` |
| `FRONTEND_URL` | CORS Origin URL for Client app | `http://localhost:3000` |
| `PRO_PLAN_PRICE` | Base price in smallest currency unit | `99` (e.g., INR 99 or USD 0.99) |
| `GROQ_API_KEY` | Groq developer console API token | `gsk_...` |

### Frontend Config (`frontend/.env.local`)

Create a `.env.local` file inside the `frontend/` directory:

| Variable | Description | Value |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Base URI of backend API | `http://localhost:3001/api` |

---

## Setup & Local Installation

### Prerequisites
- Node.js (v18.x or higher)
- npm (v9.x or higher)
- Docker Desktop (Optional, for database hosting)

---

### Step 1: Clone and Database Provisioning

Launch the PostgreSQL container using the included Docker Compose configuration:

```bash
docker compose up -d postgres
```

Verify that PostgreSQL is running on port `5432`.

---

### Step 2: Configure and Boot the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate the Prisma Client and execute database migrations:
   ```bash
   # Generates TypeScript Prisma Client code
   npm run db:generate
   
   # Applies pending schema migrations to local Postgres instance
   npm run db:migrate
   ```
4. Start the backend application in development mode:
   ```bash
   npm run dev
   ```

The backend server defaults to running on [http://localhost:3001](http://localhost:3001).

---

### Step 3: Boot the Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

The Next.js client is accessible at [http://localhost:3000](http://localhost:3000).

---

## Core API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Registers a new user. Returns a signed JWT.
- `POST /api/auth/login` — Auths credentials. Returns user session and token.

### Resume Management (`/api/resumes`)
- `POST /api/resumes` — Creates a new resume configuration.
- `GET /api/resumes` — Lists all resumes owned by the authenticated user.
- `GET /api/resumes/:id` — Details a specific resume payload.
- `PUT /api/resumes/:id` — Edits resume parameters (education, skills, etc.).
- `DELETE /api/resumes/:id` — Removes a resume entry.

### ATS Audit & Analysis (`/api/ats`)
- `POST /api/ats/analyze` — Audits text content or a pre-existing resume schema against a specified job description.
- `GET /api/ats/history` — Lists past scans, matching scores, and timestamps.
- `GET /api/ats/report/:id` — Retrieves detailed AI feedback, strengths list, suggestions table, and recruiter perspectives.

### Payments & Billing (`/api/payments`)
- `POST /api/payments/create-order` — Initiates a transaction with Razorpay.
- `POST /api/payments/verify-payment` — Verifies signature headers and updates subscription models.
