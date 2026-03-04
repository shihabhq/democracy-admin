# Vote Kori – Admin Dashboard

This package is the **internal admin dashboard** for the Vote Kori project. It gives maintainers insight into quiz performance and lets them manage content used by the public-facing site.

Built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**, it talks to the `democracy-server` API and Supabase to surface analytics and protected admin functionality.

## Overview

The admin app is intended for internal use only. It provides:

- A high-level **dashboard** of quiz activity.
- **Aggregated analytics** by district, age group, and gender.
- **Question difficulty insights** (toughest and easiest questions by success rate).
- Navigation to question management screens and other admin tools.

The main entry page (`src/app/page.tsx`) shows:

- Total attempts, pass/fail counts, average score, and certificate count.
- Tables of attempts by district and by age group.
- Breakdown of performance by gender.
- Lists of the toughest and easiest questions based on success rate.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI**: React 19, Tailwind CSS v4
- **Backend integration**: REST API calls to `democracy-server`
- **Supabase**: `@supabase/ssr` and `@supabase/supabase-js` for authentication and server-side helpers

## Architecture

Key files and directories:

- `src/app/layout.tsx` – Root layout, global styles, and shell for the admin UI.
- `src/app/page.tsx` – Admin dashboard showing analytics and summary statistics.
- `src/app/questions/page.tsx` – Question management UI (view/edit quiz questions).
- `src/app/login/` – Login page and form for admin authentication.
- `src/app/auth/callback/route.ts` – Auth callback route for Supabase or OAuth flows.
- `src/lib/api.ts` – (Typically) wraps `fetch` calls to the backend analytics and admin endpoints.

The dashboard relies on analytics endpoints from `democracy-server` (e.g. `/api/analytics`) and admin endpoints under `/api/admin`.

## Getting Started

### Prerequisites

- Node.js **20+** (recommended)
- A running instance of **democracy-server** with analytics and admin routes available
- Supabase project (or other auth provider) configured for admin login

### Installation

```bash
cd democracy-admin
npm install
```

### Environment variables

Set up a `.env` (or `.env.local`) file with values similar to:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api     # democracy-server base URL
NEXT_PUBLIC_SITE_URL=https://admin.votekori.cloud # Admin app public URL

NEXT_PUBLIC_SUPABASE_URL=...                      # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=...                 # Supabase anon key for client
```

> Do **not** commit real keys or secrets. Use different values for local development and production, and store them securely.

### Scripts

- `npm run dev` – Start the admin app in dev mode.
- `npm run build` – Build for production.
- `npm run start` – Run the production build.
- `npm run lint` – Lint the codebase.

### Running locally

1. Start the `democracy-server` on `http://localhost:5000`.
2. Ensure Supabase (or your auth provider) is correctly configured for redirect URLs.
3. From this folder:

   ```bash
   cd democracy-admin
   npm run dev
   ```

4. Visit `http://localhost:3001` (or the port configured in `next.config` / dev server).

## Relationship to Other Packages

- **democracy-client** – Public user interface for taking the quiz and downloading certificates.
- **democracy-server** – API server that this admin dashboard uses for analytics and admin operations.

The admin dashboard is where you **observe** how people interact with Vote Kori and where you can **iterate** on quiz content and overall effectiveness.

