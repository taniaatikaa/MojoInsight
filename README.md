<p align="center">
  <img alt="MojoInsight" src="app/icon.svg" width="96">
</p>

# MojoInsight

A population data system for 6 RT (neighborhood units) in RW 13, Dusun Mojo,
Ngeposari Village, Semanu District, Gunung Kidul. Built as an individual KKN
(university community service) project, replacing manual record-keeping
(photocopies of Family Cards) with an admin dashboard and a public data
visualization that always stays in sync with the current state.

**Live:** [mojoinsight.tech](https://www.mojoinsight.tech/)

Current data coverage: 279 families, around 800 residents, 6 RT.

## Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-149ECA?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-FF6384?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

A single Next.js app (App Router). Data is stored in Supabase (PostgreSQL).
The public site only reads from aggregate views, while the admin panel
writes through Server Actions to tables protected by Row Level Security.
The public site never touches the raw tables directly, so residents' names
and birthdates are never exposed on the public side.

## Features

- Public landing page with a live counter (total families, total residents,
  births and deaths for the current year), an age group distribution chart
  (donut) and a Top 3 Occupations chart (bar), plus a map of all 6 RT
  (Leaflet with OSM tiles, real GPS coordinates) with a detail panel per RT.
- Community Leaders page (`/struktur`): cards for the Village Head and RW
  Head, a grid of RT Heads 01-06, photos from Supabase Storage with an
  initials avatar fallback. Display order follows the position hierarchy
  automatically.
- Family Data table in the admin panel: search by name/family card number,
  filter by RT, pagination, and export to `.xlsx` following the currently
  active filter.
- A nested Family Data form: family card number and RT are filled in once,
  then family members can be added or removed as many times as needed
  before a single submit. The occupation dropdown has search/autocomplete,
  and a duplicate name plus birthdate warning appears live while typing
  (checked across all RT, non-blocking).
- Mutation Log: append-only records for Birth, Death, Moved In, and Moved
  Out events. A member's residency status updates automatically through a
  trigger, and the birth/death counters on the landing page are computed
  from this log.
- CRUD for Community Leaders, including photo upload and removal.
- Admin authentication via Supabase Auth (email/password; Google OAuth is
  already wired in the code, just needs the provider enabled), an email
  whitelist through the `admin_users` table, middleware protecting
  `/admin/*`, and a page for changing your own password.
- Two permission tiers: `super_admin` (access to all RT) and `rt_admin`
  (full CRUD but locked to their own RT). Enforced through RLS, not just
  UI filtering, so it can't be bypassed through a direct API call.
- Automatic sync via `revalidatePath` after every admin mutation, so the
  public pages reflect changes immediately without a redeploy.

## Project Structure

```
mojoinsight/
├── app/
│   ├── page.tsx                 landing page: hero + demographics + map
│   ├── struktur/                Community Leaders page (public)
│   ├── admin/
│   │   ├── login/               auth gate (outside the admin shell)
│   │   └── (protected)/         admin panel (guarded by middleware + RLS)
│   │       ├── page.tsx         Family Data table & export
│   │       ├── mutasi/          Mutation Log
│   │       ├── struktur/        Community Leaders CRUD
│   │       └── settings/        change password
│   └── auth/callback/           OAuth callback
├── components/                  hero, charts (Recharts), map (Leaflet), admin shell
├── lib/
│   ├── supabase/                browser / server / middleware clients
│   └── *-list.ts                dropdown master data (occupation, relation, position, mutation type)
├── supabase/migrations/         schema, RLS, aggregate views, storage bucket
└── next.config.ts
```

## Running Locally

### 1. Environment variables

```bash
cp .env.example .env.local
```

Fill these in from the Supabase dashboard, Project Settings > API:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon/publishable key, safe to use in the browser |
| `SUPABASE_SERVICE_ROLE_KEY` | server-only, bypasses RLS, used only by data migration scripts, never bundle this into the browser |

### 2. Dependencies & dev server

```bash
npm install
npm run dev          # http://localhost:3000
```

### 3. Database

Migrations live in `supabase/migrations/`. Apply them to a Supabase project
through the CLI:

```bash
supabase link --project-ref <project-ref>
supabase db push
```

## Age Group Boundaries

| Group | Range |
| --- | --- |
| School Age | 0-14 |
| Productive Age | 15-59 |
| Elderly | 60+ |

Follows Law No. 13 of 1998, not the 65-year cutoff used by BPS (Indonesia's
statistics agency), to stay aligned with real programs in the field such as
the Elderly Posyandu (health post).

## Team

Tania's individual KKN project in Dusun Mojo.

| Person | Part |
| --- | --- |
| Tania | Project owner, data entry, infrastructure setup (Supabase & Vercel), feature development |
| Hidayat | Helped with coding/development |
