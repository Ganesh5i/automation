# CareerSnap - Complete Architecture Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Folder Structure](#folder-structure)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Database Architecture](#database-architecture)
6. [API Flow](#api-flow)
7. [Authentication Flow](#authentication-flow)
8. [Instagram Automation Flow](#instagram-automation-flow)
9. [Supabase Usage](#supabase-usage)
10. [Prisma Usage](#prisma-usage)
11. [Neon Database Usage](#neon-database-usage)
12. [Environment Variables](#environment-variables)
13. [Build Process](#build-process)
14. [Deployment Architecture](#deployment-architecture)
15. [External Services](#external-services)
16. [AI Integration](#ai-integration)
17. [Webhook Flow](#webhook-flow)
18. [Logging System](#logging-system)
19. [Architecture Diagrams](#architecture-diagrams)

---

## Project Overview

CareerSnap is a dual-system application consisting of:
- **Frontend**: Next.js 16 job board with admin panel (Neon PostgreSQL + Prisma)
- **Backend**: Express.js automation server for Instagram DM automation (Supabase + Meta Graph API)

The system enables Instagram users to comment on posts with keywords or search codes to receive automated job information via DM.

---

## Folder Structure

```
careersnap/
├── backend/                          # Express.js automation backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.js               # Environment variable configuration
│   │   │   └── supabase.js          # Supabase client initialization
│   │   ├── controllers/
│   │   │   └── webhook.controller.js # Meta webhook handlers
│   │   ├── middleware/
│   │   │   ├── error.middleware.js  # Global error handler
│   │   │   └── notFound.middleware.js # 404 handler
│   │   ├── routes/
│   │   │   ├── automation.routes.js  # Automation test endpoints
│   │   │   ├── lead.routes.js        # Lead saving endpoints
│   │   │   ├── test.routes.js        # Test endpoints
│   │   │   └── webhook.routes.js    # Meta webhook routes
│   │   ├── services/
│   │   │   ├── ai.service.js        # AI integration (currently mock)
│   │   │   ├── automationEngine.js   # Main automation orchestrator
│   │   │   ├── instagram.service.js # Instagram DM service
│   │   │   ├── keywordEngine.js     # Keyword matching logic
│   │   │   ├── lead.service.js      # Lead storage in Supabase
│   │   │   └── supabase.service.js  # Supabase queries (job lookup)
│   │   ├── utils/
│   │   │   └── logger.js            # Custom logging utility
│   │   └── app.js                   # Express app configuration
│   ├── server.js                    # Server entry point
│   ├── .env.example                 # Backend environment template
│   ├── package.json                 # Backend dependencies
│   └── README.md                    # Backend documentation
│
├── frontend-temp/                    # Next.js 16 frontend
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema definition
│   │   └── seed.ts                  # Database seeding script
│   ├── src/
│   │   ├── app/
│   │   │   ├── (site)/              # Public pages with layout
│   │   │   │   ├── (public)/        # Public routes
│   │   │   │   │   ├── about/       # About page
│   │   │   │   │   ├── companies/   # Company listings
│   │   │   │   │   ├── experienced/ # Experienced jobs
│   │   │   │   │   ├── internships/  # Internship jobs
│   │   │   │   │   ├── job/         # Job detail pages
│   │   │   │   │   ├── jobs/        # Job listings
│   │   │   │   │   ├── off-campus/  # Off-campus jobs
│   │   │   │   │   ├── remote-jobs/ # Remote jobs
│   │   │   │   │   └── work-from-home/ # WFH jobs
│   │   │   │   ├── layout.tsx       # Site layout
│   │   │   │   ├── page.tsx         # Homepage
│   │   │   │   └── loading.tsx      # Loading state
│   │   │   ├── admin/               # Admin panel
│   │   │   │   ├── (panel)/         # Protected admin routes
│   │   │   │   │   ├── categories/  # Category management
│   │   │   │   │   ├── companies/   # Company management
│   │   │   │   │   ├── jobs/        # Job CRUD
│   │   │   │   │   ├── layout.tsx   # Admin layout
│   │   │   │   │   └── page.tsx     # Admin dashboard
│   │   │   │   └── login/           # Admin login
│   │   │   ├── api/                 # API routes
│   │   │   │   ├── admin/           # Admin API endpoints
│   │   │   │   │   ├── companies/   # Company CRUD
│   │   │   │   │   ├── jobs/        # Job CRUD
│   │   │   │   │   ├── search-code/ # Search code generation
│   │   │   │   │   └── upload/      # File upload
│   │   │   │   ├── auth/            # NextAuth endpoints
│   │   │   │   ├── companies/       # Public company API
│   │   │   │   ├── jobs/            # Public job API
│   │   │   │   └── search/          # Search API
│   │   │   ├── layout.tsx           # Root layout
│   │   │   ├── globals.css          # Global styles
│   │   │   └── error.tsx            # Error page
│   │   ├── components/
│   │   │   ├── admin/               # Admin components
│   │   │   │   ├── admin-sidebar.tsx
│   │   │   │   ├── job-form.tsx
│   │   │   │   ├── logo-upload.tsx
│   │   │   │   └── stats-cards.tsx
│   │   │   ├── companies/           # Company components
│   │   │   │   └── company-card.tsx
│   │   │   ├── home/                # Homepage components
│   │   │   │   ├── category-sections.tsx
│   │   │   │   ├── hero-search.tsx
│   │   │   │   ├── latest-jobs.tsx
│   │   │   │   ├── popular-companies.tsx
│   │   │   │   └── trending-jobs.tsx
│   │   │   ├── jobs/                # Job components
│   │   │   │   ├── bookmark-button.tsx
│   │   │   │   ├── job-card-skeleton.tsx
│   │   │   │   ├── job-card.tsx
│   │   │   │   ├── job-detail-header.tsx
│   │   │   │   ├── job-filters.tsx
│   │   │   │   ├── job-grid.tsx
│   │   │   │   ├── job-listing-page.tsx
│   │   │   │   ├── related-jobs.tsx
│   │   │   │   └── share-buttons.tsx
│   │   │   ├── layout/              # Layout components
│   │   │   │   ├── footer.tsx
│   │   │   │   └── header.tsx
│   │   │   ├── search/              # Search components
│   │   │   │   ├── instant-search.tsx
│   │   │   │   └── search-modal.tsx
│   │   │   ├── ui/                  # shadcn/ui components
│   │   │   └── theme-toggle.tsx     # Theme switcher
│   │   ├── lib/
│   │   │   ├── auth.config.ts       # NextAuth configuration
│   │   │   ├── auth.ts              # NextAuth setup
│   │   │   ├── constants.ts         # App constants
│   │   │   ├── db.ts                # Prisma client
│   │   │   ├── filters.ts           # Search filters
│   │   │   ├── hooks/               # Custom React hooks
│   │   │   │   ├── use-bookmarks.ts
│   │   │   │   ├── use-debounced-search.ts
│   │   │   │   └── use-recent-searches.ts
│   │   │   ├── parse-job-paste.ts   # Job parsing utility
│   │   │   ├── search-code.ts       # Search code generation
│   │   │   ├── seo.ts               # SEO utilities
│   │   │   ├── utils.ts             # General utilities
│   │   │   └── validations/         # Zod schemas
│   │   │       ├── company.ts
│   │   │       └── job.ts
│   │   ├── generated/prisma/        # Generated Prisma client
│   │   └── types/                   # TypeScript types
│   ├── public/                      # Static assets
│   │   └── uploads/                 # Uploaded files (logos)
│   ├── middleware.ts                # NextAuth middleware
│   ├── next.config.ts               # Next.js configuration
│   ├── prisma.config.ts             # Prisma configuration
│   ├── tsconfig.json                # TypeScript configuration
│   ├── components.json              # shadcn/ui configuration
│   ├── package.json                 # Frontend dependencies
│   └── README.md                    # Frontend documentation
│
├── package.json                     # Root dependencies (Supabase)
└── README_ARCHITECTURE.md          # This file
```

---

## Frontend Architecture

### Technology Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database**: Neon PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5 (beta)
- **State Management**: React hooks + localStorage
- **Form Handling**: React Hook Form + Zod validation

### Key Frontend Files

#### Configuration Files
- `next.config.ts` - Next.js config with image optimization
- `tsconfig.json` - TypeScript configuration
- `components.json` - shadcn/ui component configuration
- `prisma.config.ts` - Prisma configuration
- `middleware.ts` - NextAuth route protection

#### Core Libraries
- `src/lib/db.ts` - Prisma client singleton with connection pooling
- `src/lib/auth.ts` - NextAuth credentials provider setup
- `src/lib/auth.config.ts` - NextAuth configuration (JWT strategy)
- `src/lib/constants.ts` - Application constants
- `src/lib/seo.ts` - SEO utilities (meta tags, Open Graph)

#### API Routes
- `src/app/api/jobs/route.ts` - Job listing with pagination and filters
- `src/app/api/jobs/[searchCode]/route.ts` - Single job by search code
- `src/app/api/search/route.ts` - Instant search with multi-field matching
- `src/app/api/companies/route.ts` - Company listings
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth handler
- `src/app/api/admin/*` - Admin CRUD endpoints

#### Page Structure
- **Public Pages** (`src/app/(site)/(public)/`):
  - Homepage with hero search, latest jobs, trending jobs
  - Category pages: internships, experienced, remote, WFH, off-campus
  - Company listing and detail pages
  - Job detail pages with share buttons
- **Admin Panel** (`src/app/admin/`):
  - Login page with credentials
  - Dashboard with stats
  - Job CRUD with form validation
  - Company management
  - Logo upload functionality

---

## Backend Architecture

### Technology Stack
- **Framework**: Express.js 5
- **Language**: JavaScript (CommonJS)
- **Security**: Helmet, CORS
- **Logging**: Morgan + custom logger
- **HTTP Client**: Axios
- **Environment**: dotenv

### Backend Structure

#### Entry Point
- `server.js` - Server initialization with graceful shutdown
- `src/app.js` - Express app configuration with middleware

#### Configuration
- `src/config/env.js` - Centralized environment variable reader
- `src/config/supabase.js` - Supabase client singleton

#### Routes
- `src/routes/webhook.routes.js` - Meta webhook endpoints (GET/POST /webhook)
- `src/routes/automation.routes.js` - Automation test endpoint (POST /test-automation)
- `src/routes/lead.routes.js` - Lead saving test endpoint (POST /test-save)
- `src/routes/test.routes.js` - General test endpoints

#### Controllers
- `src/controllers/webhook.controller.js` - Webhook verification and receiving logic

#### Services
- `src/services/automationEngine.js` - Main automation orchestrator
- `src/services/keywordEngine.js` - Keyword matching and search code detection
- `src/services/instagram.service.js` - Instagram DM via Meta Graph API
- `src/services/ai.service.js` - AI integration (currently mock)
- `src/services/supabase.service.js` - Supabase job lookup by search code
- `src/services/lead.service.js` - Lead storage in Supabase

#### Middleware
- `src/middleware/error.middleware.js` - Global error handler
- `src/middleware/notFound.middleware.js` - 404 handler

#### Utilities
- `src/utils/logger.js` - Custom timestamped logger (info, warn, error, debug)

---

## Database Architecture

### Frontend Database (Neon PostgreSQL + Prisma)

#### Schema Models

**Company Model**
```prisma
model Company {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  logo        String?
  description String?
  website     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  jobs        Job[]
}
```

**Job Model**
```prisma
model Job {
  id               String      @id @default(cuid())
  searchCode       String      @unique
  companyName      String
  companyLogo      String?
  companyId        String?
  company          Company?    @relation(fields: [companyId], references: [id])
  role             String
  category         JobCategory
  jobType          JobType     @default(FULL_TIME)
  location         String
  experience       String
  qualification    String?
  salary           String?
  description      String      @db.Text
  responsibilities String[]
  skills           String[]
  applyLink        String
  postedDate       DateTime    @default(now())
  featured         Boolean     @default(false)
  trending         Boolean     @default(false)
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt
}
```

**AdminUser Model**
```prisma
model AdminUser {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   @db.Text
  name      String?
  createdAt DateTime @default(now())
}
```

#### Enums
```prisma
enum JobCategory {
  FRESHER
  INTERNSHIP
  REMOTE
  WORK_FROM_HOME
  OFF_CAMPUS
  EXPERIENCED
}

enum JobType {
  FULL_TIME
  PART_TIME
  CONTRACT
  INTERNSHIP
  REMOTE
}
```

#### Indexes
- Category + postedDate
- Search code
- Company name
- Role
- Location
- Featured
- Trending

### Backend Database (Supabase)

#### Tables
- **jobs** - Job lookup table (search_code, title, company, job_link)
- **leads** - Lead capture table (message, source, keyword, reply)

---

## API Flow

### Frontend API Flow

```
User Request
    ↓
Next.js API Route
    ↓
Prisma Client (src/lib/db.ts)
    ↓
Neon PostgreSQL
    ↓
Response
```

### Backend API Flow

```
Meta Webhook
    ↓
Express Route (webhook.routes.js)
    ↓
Controller (webhook.controller.js)
    ↓
Service Layer (automationEngine.js)
    ↓
External Services (Supabase, Meta Graph API, AI)
    ↓
Response
```

### Frontend API Endpoints

#### Public APIs
- `GET /api/jobs` - Job listings with pagination and filters
- `GET /api/jobs/[searchCode]` - Single job by search code
- `GET /api/search` - Instant search
- `GET /api/companies` - Company listings

#### Admin APIs
- `GET /api/admin/jobs` - List all jobs
- `POST /api/admin/jobs` - Create job
- `PUT /api/admin/jobs/[id]` - Update job
- `DELETE /api/admin/jobs/[id]` - Delete job
- `GET /api/admin/companies` - List companies
- `POST /api/admin/companies` - Create company
- `POST /api/admin/upload` - Upload file
- `GET /api/admin/search-code` - Generate unique search code

#### Auth APIs
- `GET /api/auth/[...nextauth]` - NextAuth handler
- `POST /api/auth/[...nextauth]` - NextAuth handler

### Backend API Endpoints

- `GET /` - Server status
- `GET /health` - Health check
- `GET /webhook` - Meta webhook verification
- `POST /webhook` - Meta webhook receiver
- `POST /test-automation` - Test automation engine
- `POST /test-save` - Test lead saving

---

## Authentication Flow

### NextAuth.js Implementation

```
User Login
    ↓
POST /api/auth/[...nextauth]
    ↓
Credentials Provider
    ↓
bcrypt.compare(password, hash)
    ↓
AdminUser Lookup (Prisma)
    ↓
JWT Session Creation
    ↓
Middleware Protection
    ↓
Admin Panel Access
```

### Authentication Components

#### Configuration
- `src/lib/auth.config.ts` - NextAuth config with JWT strategy
- `src/lib/auth.ts` - Credentials provider with bcrypt
- `middleware.ts` - Route protection for /admin paths

#### Flow Details
1. User submits email/password to `/admin/login`
2. NextAuth credentials provider validates against `AdminUser` table
3. Password verified using bcrypt.compare()
4. On success, JWT session created with user ID
5. Middleware checks session on all `/admin/*` routes
6. Unauthorized users redirected to login

---

## Instagram Automation Flow

### Complete Automation Pipeline

```
Instagram Comment
    ↓
Meta Webhook (POST /webhook)
    ↓
Extract Comment Data
    ↓
Keyword Engine (keywordEngine.js)
    ↓
┌─────────────────┬──────────────────┬─────────────────┐
│ Keyword Match   │ Search Code      │ Unknown Input   │
│ (LINK, JOB,     │ (CS001, CS002)   │                 │
│  PDF, HELP)     │                  │                 │
└─────────────────┴──────────────────┴─────────────────┘
        ↓                   ↓                   ↓
Immediate Reply      Supabase Lookup      AI Fallback
        ↓                   ↓                   ↓
Instagram DM         Job Found/Not Found   AI Response
        ↓                   ↓                   ↓
User Receives DM    Send Job Details    Send AI Reply
```

### Keyword Engine Logic

**Supported Keywords** (case-insensitive):
- `LINK` - Returns CareerSnap URL
- `JOB` - Returns job listing message
- `PDF` - Returns PDF download link
- `HELP` - Returns help message

**Search Code Detection**:
- Pattern: `CS` + 3 digits (CS001-CS999)
- Example: "CS001", "CS123", "CS999"

**AI Fallback**:
- Any unrecognized input routes to AI service
- Currently mock implementation
- Planned: Gemini API integration

---

## Supabase Usage

### Backend Supabase Integration

#### Configuration
- `src/config/supabase.js` - Supabase client singleton
- Uses ANON key for client-style access
- Graceful degradation when not configured

#### Services Using Supabase

**Job Lookup** (`src/services/supabase.service.js`)
- Query: `getJobBySearchCode(code)`
- Table: `jobs`
- Fields: `search_code`, `title`, `company`, `job_link`
- Returns job details for automation DM

**Lead Storage** (`src/services/lead.service.js`)
- Query: `saveLead({ message, source, keyword, reply })`
- Table: `leads`
- Fields: `message`, `source`, `keyword`, `reply`
- Captures automation interactions

#### Supabase Tables

**jobs Table**
```sql
- search_code (text, unique)
- title (text)
- company (text)
- job_link (text)
```

**leads Table**
```sql
- message (text)
- source (text)
- keyword (text)
- reply (text)
```

---

## Prisma Usage

### Frontend Prisma Setup

#### Configuration
- `prisma/schema.prisma` - Database schema definition
- `prisma.config.ts` - Prisma configuration
- `src/lib/db.ts` - Prisma client singleton with connection pooling

#### Database Connection
```typescript
// src/lib/db.ts
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
```

#### Prisma Client Generation
- Output: `src/generated/prisma/client`
- Generated via: `prisma generate`
- Auto-generated on: `npm install` (postinstall hook)

#### Database Operations

**Job Queries**
```typescript
// List jobs with filters
db.job.findMany({
  where: { category, location, role },
  orderBy: { postedDate: "desc" }
})

// Single job by search code
db.job.findUnique({
  where: { searchCode }
})
```

**Company Queries**
```typescript
db.company.findMany()
db.company.findUnique({ where: { slug } })
```

**Admin Operations**
```typescript
db.adminUser.findUnique({ where: { email } })
db.adminUser.create({ data: { email, password, name } })
```

#### Seeding
- `prisma/seed.ts` - Database seeding script
- Creates 8 sample companies
- Creates 15 sample jobs
- Creates default admin user
- Run via: `npm run db:seed`

---

## Neon Database Usage

### Neon PostgreSQL Configuration

#### Connection String
```env
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

#### Neon Features Used
- Serverless PostgreSQL
- Connection pooling via PrismaPg adapter
- SSL mode required
- Branching support (not currently used)

#### Why Neon?
- Free tier available
- Serverless architecture
- Built for edge deployments
- Compatible with Prisma
- Vercel integration ready

---

## Environment Variables

### Backend Environment Variables (.env)

```env
PORT=3000
VERIFY_TOKEN=careersnap_verify_token
META_APP_ID=<meta_app_id>
META_APP_SECRET=<meta_app_secret>
META_ACCESS_TOKEN=<meta_access_token>
META_GRAPH_API_VERSION=v21.0
META_IG_USER_ID=<instagram_user_id>
SUPABASE_URL=<supabase_url>
SUPABASE_ANON_KEY=<supabase_anon_key>
GEMINI_API_KEY=<gemini_api_key>
LOG_LEVEL=debug
```

### Frontend Environment Variables (.env.local)

```env
DATABASE_URL=<neon_postgresql_connection_string>
NEXTAUTH_SECRET=<random_secret_min_32_chars>
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@careersnap.com
ADMIN_PASSWORD=admin123
```

### Environment Variable Flow

```
.env/.env.local
    ↓
dotenv.config()
    ↓
process.env
    ↓
Config Modules (env.js, db.ts)
    ↓
Application Services
```

---

## Build Process

### Frontend Build Process

```bash
npm run build
```

**Build Steps:**
1. `prisma generate` - Generate Prisma client
2. `next build` - Build Next.js application
3. TypeScript compilation
4. Asset optimization
5. Route pre-rendering

**Development Build:**
```bash
npm run dev
```
- Runs Next.js dev server on port 3000
- Hot module replacement
- Prisma client auto-generation

### Backend Build Process

```bash
npm start
```

**Production:**
- `node server.js` - Start Express server
- No build step required (CommonJS)

**Development:**
```bash
npm run dev
```
- `nodemon server.js` - Auto-restart on changes

---

## Deployment Architecture

### Current Deployment Status

**No deployment configuration files found** (no vercel.json, Dockerfile, docker-compose.yml)

**Likely Deployment:**
- Frontend: Vercel (based on URLs in code)
- Backend: Likely Vercel/Render/Railway
- Database: Neon PostgreSQL (frontend), Supabase (backend)

### Recommended Deployment Architecture

```
┌─────────────────────────────────────────┐
│           Vercel (Frontend)               │
│  - Next.js 16 App Router                 │
│  - Edge functions for API routes         │
│  - Static asset optimization             │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│        Vercel/Render (Backend)           │
│  - Express.js server                     │
│  - Webhook endpoint                      │
│  - Automation engine                     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Neon PostgreSQL (Frontend DB)    │
│  - Jobs, Companies, AdminUsers           │
│  - Connection pooling                    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Supabase (Backend DB)            │
│  - Job lookup table                      │
│  - Leads table                           │
│  - RLS policies                          │
└─────────────────────────────────────────┘
```

---

## External Services

### Meta Graph API (Instagram)

**Purpose:** Send Instagram DMs to users

**Configuration:**
- `META_APP_ID` - Meta application ID
- `META_APP_SECRET` - Meta application secret
- `META_ACCESS_TOKEN` - Page access token with messaging permissions
- `META_GRAPH_API_VERSION` - API version (default: v21.0)
- `META_IG_USER_ID` - Instagram business account ID

**API Endpoint:**
```
POST https://graph.facebook.com/{version}/{account_id}/messages
```

**Permissions Required:**
- `instagram_basic`
- `instagram_manage_messages`
- `pages_messaging`

### Supabase

**Purpose:** Backend data storage and job lookup

**Configuration:**
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Anonymous public key

**Tables:**
- `jobs` - Job lookup for search codes
- `leads` - Lead capture from automation

### Neon PostgreSQL

**Purpose:** Frontend database for job board

**Configuration:**
- `DATABASE_URL` - PostgreSQL connection string

**Features:**
- Serverless PostgreSQL
- Connection pooling
- SSL required
- Branching support

### Gemini AI (Planned)

**Purpose:** AI fallback for unknown Instagram comments

**Current Status:** Mock implementation

**Configuration:**
- `GEMINI_API_KEY` - Google Gemini API key

**Planned Integration:**
- Replace mock in `src/services/ai.service.js`
- Add Gemini SDK dependency
- Implement prompt engineering for job-related queries

---

## AI Integration

### Current Implementation (Mock)

**File:** `src/services/ai.service.js`

```javascript
async function generateAIResponse(prompt) {
  return {
    success: true,
    provider: "mock",
    reply: `AI response for: ${prompt}`
  };
}
```

### Planned Gemini Integration

**Integration Point:**
- `src/services/ai.service.js` - Replace mock with Gemini API call

**Flow:**
```
Unknown Comment
    ↓
Keyword Engine (type: "ai")
    ↓
AI Service (generateAIResponse)
    ↓
Gemini API Call
    ↓
AI Response
    ↓
Instagram DM
```

**Use Cases:**
- Natural language job queries
- Career advice requests
- General questions about CareerSnap
- Fallback for unrecognized keywords

---

## Webhook Flow

### Meta Webhook Verification

```
Meta GET /webhook
    ↓
Query Params:
  - hub.mode = "subscribe"
  - hub.verify_token = VERIFY_TOKEN
  - hub.challenge = <challenge_string>
    ↓
Verify Token Match
    ↓
Return hub.challenge (200 OK)
    ↓
Webhook Verified
```

### Meta Webhook Receiver

```
Meta POST /webhook
    ↓
Extract Comment Payload
    ↓
Parse:
  - commentId
  - commentText
  - username
  - userId
  - mediaId
    ↓
Automation Engine
    ↓
Process Incoming Message
    ↓
Return 200 OK (always)
```

### Webhook Payload Structure

```json
{
  "object": "instagram",
  "entry": [{
    "changes": [{
      "field": "comments",
      "value": {
        "text": "LINK",
        "id": "comment_id",
        "from": {
          "username": "user",
          "id": "user_id"
        },
        "media": {
          "id": "media_id"
        }
      }
    }]
  }]
}
```

---

## Logging System

### Backend Logger Implementation

**File:** `src/utils/logger.js`

**Features:**
- Timestamped logs (ISO format)
- Log levels: info, warn, error, debug
- JSON metadata support
- Error stack trace logging
- Debug mode via LOG_LEVEL env var

**Usage:**
```javascript
logger.info("Message", { meta: "data" });
logger.warn("Warning", { context: "value" });
logger.error("Error", errorObject);
logger.debug("Debug info", { debug: "data" });
```

**Integration:**
- Morgan HTTP logging → logger
- Service layer → logger
- Error middleware → logger

**Log Format:**
```
[2024-01-01T00:00:00.000Z] [INFO] Message {"meta":"data"}
```

---

## Architecture Diagrams

### High-Level System Architecture

```mermaid
graph TB
    subgraph "User Interface"
        UI[Instagram User]
        WEB[Web Browser]
 end

    subgraph "Meta Platform"
        IG[Instagram]
        META[Meta Graph API]
    end

    subgraph "Frontend - Next.js"
        NEXT[Next.js App]
        PRISMA[Prisma Client]
    end

    subgraph "Backend - Express.js"
        EXPRESS[Express Server]
        WEBHOOK[Webhook Handler]
        AUTO[Automation Engine]
        KEYWORD[Keyword Engine]
        AI[AI Service]
        IG_SERVICE[Instagram Service]
    end

    subgraph "Databases"
        NEON[Neon PostgreSQL]
        SUPABASE[Supabase]
    end

    UI -->|Comment| IG
    IG -->|Webhook| WEBHOOK
    WEBHOOK --> AUTO
    AUTO --> KEYWORD
    KEYWORD -->|Keyword Match| AUTO
    KEYWORD -->|Search Code| SUPABASE
    KEYWORD -->|Unknown| AI
    AUTO --> IG_SERVICE
    IG_SERVICE --> META
    META -->|DM| UI

    WEB -->|HTTP| NEXT
    NEXT --> PRISMA
    PRISMA --> NEON

    SUPABASE -->|Job Lookup| AUTO
    AUTO -->|Lead Storage| SUPABASE

    style UI fill:#e1f5ff
    style WEB fill:#e1f5ff
    style NEXT fill:#fff4e1
    style EXPRESS fill:#ffe1e1
    style NEON fill:#e1ffe1
    style SUPABASE fill:#e1ffe1
```

### Frontend Request Flow

```mermaid
sequenceDiagram
    participant User
    participant NextJS
    participant API
    participant Prisma
    participant Neon

    User->>NextJS: Visit /jobs
    NextJS->>API: GET /api/jobs
    API->>Prisma: db.job.findMany()
    Prisma->>Neon: SQL Query
    Neon-->>Prisma: Job Data
    Prisma-->>API: Job Objects
    API-->>NextJS: JSON Response
    NextJS-->>User: Render Jobs Page
```

### Backend Automation Flow

```mermaid
sequenceDiagram
    participant IG as Instagram
    participant Webhook as Webhook Handler
    participant Auto as Automation Engine
    participant Keyword as Keyword Engine
    participant Supabase as Supabase
    participant AI as AI Service
    participant IG_Service as Instagram Service
    participant User as Instagram User

    IG->>Webhook: POST /webhook (comment)
    Webhook->>Auto: processIncomingMessage()
    Auto->>Keyword: processKeyword()
    
    alt Keyword Match
        Keyword-->>Auto: Keyword Response
        Auto->>IG_Service: sendInstagramDM()
        IG_Service->>User: DM with Keyword Reply
    else Search Code
        Keyword-->>Auto: Search Code
        Auto->>Supabase: getJobBySearchCode()
        Supabase-->>Auto: Job Data
        Auto->>IG_Service: sendInstagramDM()
        IG_Service->>User: DM with Job Details
    else Unknown
        Keyword-->>Auto: AI Fallback
        Auto->>AI: generateAIResponse()
        AI-->>Auto: AI Response
        Auto->>IG_Service: sendInstagramDM()
        IG_Service->>User: DM with AI Reply
    end

    Auto-->>IG: 200 OK
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant Admin
    participant Login as Login Page
    participant NextAuth as NextAuth API
    participant Prisma as Prisma Client
    participant Neon as Neon DB
    participant Session as JWT Session

    Admin->>Login: Enter Credentials
    Login->>NextAuth: POST /api/auth/[...nextauth]
    NextAuth->>Prisma: adminUser.findUnique()
    Prisma->>Neon: Query AdminUser
    Neon-->>Prisma: User Data
    Prisma-->>NextAuth: User Object
    NextAuth->>NextAuth: bcrypt.compare()
    
    alt Valid Credentials
        NextAuth->>Session: Create JWT
        Session-->>NextAuth: Session Token
        NextAuth-->>Login: Success Response
        Login->>Admin: Redirect to /admin
    else Invalid Credentials
        NextAuth-->>Login: Error Response
        Login-->>Admin: Show Error
    end
```

### Database Schema Relationship

```mermaid
erDiagram
    Company ||--o{ Job : "has"
    Job {
        string id PK
        string searchCode UK
        string companyName
        string companyLogo
        string companyId FK
        string role
        JobCategory category
        JobType jobType
        string location
        string experience
        string qualification
        string salary
        text description
        string[] responsibilities
        string[] skills
        string applyLink
        datetime postedDate
        boolean featured
        boolean trending
        datetime createdAt
        datetime updatedAt
    }
    Company {
        string id PK
        string name UK
        string slug UK
        string logo
        string description
        string website
        datetime createdAt
        datetime updatedAt
    }
    AdminUser {
        string id PK
        string email UK
        string password
        string name
        datetime createdAt
    }
```

### Meta Webhook Integration

```mermaid
graph LR
    A[Instagram Comment] --> B[Meta Webhook]
    B --> C[Express /webhook]
    C --> D[Verify Token]
    D --> E[Extract Payload]
    E --> F[Comment Text]
    E --> G[User ID]
    E --> H[Media ID]
    F --> I[Keyword Engine]
    I --> J{Match Type}
    J -->|Keyword| K[Immediate Reply]
    J -->|Search Code| L[Supabase Lookup]
    J -->|Unknown| M[AI Fallback]
    K --> N[Instagram DM]
    L --> N
    M --> N
    N --> O[User Receives DM]
```

### Folder Dependency Graph

```mermaid
graph TD
    Root[careersnap/] --> Backend[backend/]
    Root --> Frontend[frontend-temp/]
    
    Backend --> Src[src/]
    Src --> Config[config/]
    Src --> Controllers[controllers/]
    Src --> Middleware[middleware/]
    Src --> Routes[routes/]
    Src --> Services[services/]
    Src --> Utils[utils/]
    
    Routes --> Controllers
    Routes --> Services
    Controllers --> Services
    Services --> Config
    Services --> Utils
    Middleware --> Utils
    
    Frontend --> Prisma[prisma/]
    Frontend --> Src2[src/]
    Frontend --> Public[public/]
    
    Src2 --> App[app/]
    Src2 --> Components[components/]
    Src2 --> Lib[lib/]
    Src2 --> Generated[generated/]
    
    App --> API[api/]
    App --> Admin[admin/]
    App --> Site[(site)/]
    
    API --> Lib
    Admin --> Lib
    Admin --> Components
    Site --> Components
    Site --> Lib
    
    Lib --> Generated
    Prisma --> Generated
```

---

## Summary

CareerSnap is a sophisticated dual-system application combining:

1. **Modern Job Board** (Next.js 16 + Neon PostgreSQL)
   - Public job search and browsing
   - Admin panel for content management
   - SEO-optimized with shadcn/ui components

2. **Instagram Automation** (Express.js + Supabase)
   - Meta webhook integration
   - Keyword-based automation
   - Search code lookup system
   - AI-powered fallback (planned)

The architecture follows best practices with:
- Modular, maintainable code structure
- Separation of concerns (routes → controllers → services)
- Environment-based configuration
- Comprehensive logging
- Graceful error handling
- Database connection pooling
- Security middleware (Helmet, CORS, NextAuth)

The system is production-ready for deployment to Vercel (frontend) and any Node.js hosting platform (backend), with Neon and Supabase providing managed database services.
