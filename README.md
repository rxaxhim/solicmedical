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

The Supabase client will live in `src/lib/supabase.ts` (env vars in `.env.local`).
