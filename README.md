# SNBT Daily — UTBK-SNBT 2025 Daily Practice Web

Full-stack app built with Next.js 14 App Router, Prisma, and Tailwind CSS for daily UTBK-SNBT drills.

## Stack
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Database**: PostgreSQL via Prisma (Neon friendly)
- **Auth**: Cookie sessions (httpOnly) + bcrypt
- **UI**: Glassmorphism + Bento cards, optional lofi YouTube embed on landing page only

## Features
- Admin-only “Generate Daily Set” button wipes and regenerates new questions per day
- Offline stub generator when `OPENAI_API_KEY` is absent; uses OpenAI Responses API otherwise
- Supports MCQ, complex multiple choice, true/false, and short answer question models
- Enforces 1 attempt per account per calendar day and 1 account per device hash
- Subtests: TPS (Induktif, Deduktif, Kuantitatif, PPU, PBM, PK), Literasi (BI/EN), Penalaran Matematika
- Premium flag gates explanations; upgrade CTA links to WhatsApp admin chat

## Quick Start (Local)
1. `pnpm install`
2. Copy `.env.example` to `.env` and fill `DATABASE_URL`, `APP_SECRET`, `ADMIN_EMAIL`, `OPENAI_API_KEY` (optional)
3. `npx prisma migrate dev`
4. `pnpm dev`

## Deployment (Vercel)
1. Provision Neon PostgreSQL; copy connection string to `DATABASE_URL`
2. Set `APP_SECRET`, `ADMIN_EMAIL`, and optionally `OPENAI_API_KEY`
3. Import the repo into Vercel and deploy. Ensure Neon connection string enforces SSL.

## Codebase Overview
```
app/
  layout.tsx
  page.tsx
  dashboard/page.tsx
  attempt/[id]/page.tsx
  admin/page.tsx
app/api/
  auth/(register|login)
  attempt/(start|answer)
  admin/(generate|premium)
components/
  Bento.tsx, Glass.tsx, Forms.tsx
lib/
  auth.ts, crypto.ts, db.ts, device.ts, z.ts
prisma/schema.prisma
services/generator.ts
middleware.ts
```
