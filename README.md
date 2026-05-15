# Lawyer Portfolio Platform

Premium bilingual one-page lawyer portfolio platform with a private admin dashboard.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- Supabase

## Current status

Phase 2 foundation is implemented:

- Public and admin route groups
- Bilingual routing with `en` and `ar`
- Premium design token baseline
- Shared UI primitives and section architecture
- Admin shell information architecture
- Supabase client helpers and environment validation
- Supabase schema, RLS policies, seed files, and storage bucket setup
- Server actions for admin auth, hero editing, media upload, and public leads
- Dynamic public content and SEO lookup with fallback scaffolding
- Validation and domain type contracts

## Key paths

- `app/(public)/[locale]` public website
- `app/admin` admin dashboard shell
- `components/sections` public page sections
- `components/admin` dashboard UI
- `lib/domain` typed domain services and content adapters
- `lib/supabase` Supabase clients
- `lib/validation` Zod schemas
- `supabase/migrations` database migrations

## Environment

Copy `.env.example` and fill in the Supabase values when Phase 2 begins.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run typecheck
```

## Note

Dependency installation could not be fully verified in this environment because npm encountered repeated `ECONNRESET` network failures while downloading packages. The source structure is in place and ready for verification once package installation succeeds.
