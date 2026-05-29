# Euromecanico Corp — Sistema de Gestión

Full-stack shop management system for **Euromecanico Corp**, a Porsche-specialized
repair shop in Puerto Rico. Two interfaces:

- **Taller (shop)** — dark, industrial, PIN-gated desktop app for staff.
- **Portal público (client)** — light, mobile-first tracking + repair guides.

## Tech Stack

- **Next.js 14** (App Router) + **TypeScript**
- **SQLite** + **Prisma ORM** (local, no cloud)
- **Tailwind CSS** — Porsche Guards Red (`#CC2229`) + warm gray
- PIN-based staff auth (cookie)
- `qrcode` for QR generation, `@react-pdf/renderer` for estimate PDFs
- `nodemailer` for automatic client emails (log-only fallback)

## Getting started (local) — zero config

Only requires **Node 18+**. No database to install, no `.env` to edit — local dev
uses a self-contained SQLite file.

```bash
npm install
npm run local      # creates the SQLite DB, loads sample data, starts the app
```

Then open **http://localhost:3000**. Staff login PIN: **2229**.

That's it. `npm run local` is the only command you need after install — it builds
the database, seeds 2 clients / 3 Porsches / 5 orders / 10 parts / 3 guides, and
launches the dev server. Re-running it keeps your data (the seed skips if data
already exists). `npm run db:reset` wipes and re-seeds from scratch.

> Local dev uses `prisma/schema.sqlite.prisma` (SQLite). Production/Vercel uses
> `prisma/schema.prisma` (PostgreSQL). The models are identical in both.

## Deploy to Vercel (one account, ~5 clicks)

1. Push this repo to GitHub (already done on branch `claude/inspiring-pasteur-WlgB7`).
2. At **vercel.com** → *Add New → Project* → import this repo.
3. Open the project → **Storage** tab → *Create Database* → **Postgres**.
   This auto-creates `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING`.
4. (Optional) add env vars: `SHOP_PIN`, `NEXT_PUBLIC_BASE_URL`
   (set to your `https://<app>.vercel.app`), and SMTP_* for real emails.
5. **Deploy**. The build (see `vercel.json`) runs `prisma db push` + seeds sample
   data automatically on the first deploy. The seed is **skipped** on later
   deploys, so your data is never wiped.

The site is then live at `https://<app>.vercel.app` — `/login` (PIN 2229) for the
shop, `/` and `/guias` public, `/track/<token>` for client tracking.

## Routes

### Shop (`/`, PIN-gated)
| Route | Purpose |
|-------|---------|
| `/login` | PIN entry |
| `/dashboard` | Open orders, today's activity, status breakdown |
| `/orders`, `/orders/[id]`, `/orders/new` | Order list / detail / create |
| `/vehicles`, `/vehicles/[id]` | Vehicle search + VIN history timeline |
| `/estimate/[id]` | Estimate builder + PDF export |
| `/inventory` | Parts inventory + stock adjust |
| `/guides` | Repair-guide CRUD |

### Public (no auth)
| Route | Purpose |
|-------|---------|
| `/` | Landing |
| `/track/[qrToken]` | Client vehicle status (QR target) |
| `/guias`, `/guias/[id]` | Public guide search + step-by-step viewer |

### API
`POST /api/auth/login`, `POST /api/orders`, `PATCH /api/orders/[id]`,
`PATCH /api/orders/[id]/status` (updates status + sends/logs Spanish message),
`POST /api/orders/[id]/line-items`, `DELETE /api/line-items/[id]`,
`GET /api/estimate/[id]/pdf`, `PATCH /api/parts/[id]`, `PATCH /api/vehicles/[id]`,
`POST /api/guides`, `PATCH|DELETE /api/guides/[id]`, `GET /api/track/[token]`.

## Modules

1. **Vehicle Tracking (QR)** — each order has a unique `qrToken`; public
   `/track/[token]` shows status, progress bar, shop notes. QR is printable
   from the order detail page.
2. **Estimate Calculator** — LABOR/PART line items, auto subtotal + **11.5% IVU**
   + total, client-approval flag, PDF export.
3. **VIN History** — search by VIN/plate/model/client; per-vehicle timeline,
   lifetime service value, editable notes.
4. **Automatic Messages** — status changes send the Spanish template email
   (Nodemailer; log-only when SMTP is unset) and log to `MessageLog`.
5. **Repair Guides** — staff CRUD; public search by model/year/category;
   step viewer with progress tracking and per-step warnings.

## Schema note

`OrderStatus` / `LineType` are stored as `String` and guide `steps` as serialized
JSON (kept from the original SQLite-compatible design so the schema is portable).
The allowed values live as TypeScript unions in `lib/constants.ts`, keeping the
app type-safe. All other models match the project spec.

## Shop info

Euromecanico Corp · Puerto Rico · +1 (787) 344-6328 · admin@euromecanicocorp.com
· euromecanicocorp.com · Lunes a Viernes 8am–5pm
