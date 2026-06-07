# Solic Medical — Website

A clean, professional website for Solic Medical Equipment, built with Next.js 15 + TypeScript + Tailwind CSS. Designed in the visual language of major medical equipment suppliers (Hillrom, McKesson, Welch Allyn).

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **lucide-react** (icons)
- **Inter** (Google Font, the standard for medical/tech UIs)

## Pages built (Phase 1)

- `/` — Home
- `/about` — About
- `/support` — Technical Support
- `/contact` — Contact

`/products` is a placeholder for Phase 2 (Products + Admin Panel with Supabase).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Design system

Defined in `tailwind.config.ts`:

- **Navy** — primary palette (50–900). Used for headings, body, dark sections.
- **Accent (ember)** — `#EE8826`, from the Solic logo. Used sparingly for emphasis (eyebrows, link hovers, key indicators).
- **Surface / Muted / Border** — clean white, light grey (#F7F9FC), soft border (#E4E9F2).
- **Typography** — Inter throughout, with a defined display scale (display-xl through display-sm).
- **Shadows** — subtle card and card-hover shadows for elevation.

The overall feel is clinical, structured, and trustworthy — patterned after the most established medical equipment supplier websites.

## Project structure

```
src/
├── app/
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── products/page.tsx     # placeholder for Phase 2
│   ├── support/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # home
├── components/
│   ├── Footer.tsx
│   └── Navbar.tsx
└── lib/                      # reserved for Phase 2 (Supabase client)
public/
└── images/
    └── logo.png              # Solic Medical logo
```

## Phase 2 — Products & Admin (Supabase)

Next phase will wire up:

- Product catalogue (Supabase-backed)
- Category pages
- Individual product detail pages (gallery, tabs, accessories, related products with modal)
- Site-wide product search by name or model code
- Hidden admin panel with full CRUD for products, accessories, PDFs, YouTube links

### Backend foundation (this step — schema only)

```
supabase/
└── migrations/
    └── 0001_initial_schema.sql   # tables, indexes, RLS, storage buckets
src/lib/
├── database.types.ts             # typed schema (regenerate via CLI, see below)
├── supabase.ts                   # browser client (Client Components)
└── supabase-server.ts            # server client (admin; needs a Node runtime)
```

Tables: `categories`, `products`, `product_images`, `product_overview`,
`product_configurations`, `product_documents`, `product_videos`,
`accessories`, `related_products`. RLS is **public read / authenticated write**
on every table. Storage buckets: `product-images`, `product-docs`,
`category-images` (public read, authenticated write).

### Environment variables

Copy `.env.local.example` → `.env.local` and fill in from the Supabase
dashboard (Project Settings → API):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Using the clients

```ts
// Client Components ('use client')
import { supabase } from '@/lib/supabase';
const { data } = await supabase.from('categories').select('*');

// Server Components / Route Handlers / Server Actions (needs a Node runtime)
import { createServerSupabaseClient } from '@/lib/supabase-server';
const supabase = await createServerSupabaseClient();
```

> ⚠️ The public site is currently a **static export** (`output: 'export'` in
> `next.config.js`) for GitHub Pages, so only the **browser client** runs in
> production. The server client is for the admin panel, which will need a real
> server runtime (Vercel/Node deployment, or `next dev`). See Steps 2/3.

### Regenerating database types

Whenever the schema changes, regenerate the typed definitions from the live
project so `database.types.ts` stays accurate:

```bash
# one-time: install the CLI (or use `npx supabase` ad-hoc)
npm install -D supabase

# log in once, then generate (project ref is in your project URL / dashboard)
npx supabase login
npx supabase gen types typescript --project-id <your-project-ref> \
  --schema public > src/lib/database.types.ts
```
