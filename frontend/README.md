# Career_Snap

Discover Your Next Career Opportunity — daily job alerts, internships, fresher jobs, remote jobs, and more.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4 + shadcn/ui
- Neon PostgreSQL + Prisma ORM
- NextAuth.js (admin credentials)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in:

```env
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET="your-random-secret-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@careersnap.com"
ADMIN_PASSWORD="admin123"
```

**Neon setup:** Create a free database at [neon.tech](https://neon.tech), copy the connection string to `DATABASE_URL`.

### 3. Database setup

```bash
npx prisma db push
npm run db:seed
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Admin panel:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)  
Default credentials: `admin@careersnap.com` / `admin123` (from seed)

## Features

- Instant job search (company, role, search code, location)
- Job categories: Fresher, Internships, Remote, WFH, Off-Campus, Experienced
- Unique search codes (CS001, CS002, ...)
- Dark/light mode
- Share via WhatsApp, Telegram, copy link
- Bookmark jobs (localStorage)
- Admin dashboard: CRUD jobs, companies, featured/trending toggles
- SEO: sitemap, robots, JSON-LD, Open Graph

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio |

## Project Structure

```
src/
├── app/
│   ├── (site)/          # Public pages with header/footer
│   ├── admin/           # Admin login + dashboard
│   └── api/             # REST API routes
├── components/
│   ├── admin/           # Admin forms & sidebar
│   ├── home/            # Homepage sections
│   ├── jobs/            # Job cards, filters, detail
│   ├── layout/          # Header, footer, theme
│   └── search/          # Instant search
├── lib/                 # DB, auth, SEO, validations
└── generated/prisma/    # Prisma client
```
