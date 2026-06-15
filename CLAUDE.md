# PN Nangabulik

Website resmi & sistem informasi publik **Pengadilan Negeri Nanga Bulik** — landing page publik
dengan panel admin (CMS) untuk mengelola konten, layanan, pengumuman sidang, dan statistik pengunjung.

## Tech Stack

- **Next.js 16** (App Router, standalone output) + **React 19** + **TypeScript 5**
- **Tailwind CSS 4** + **shadcn/ui** (Radix primitives) + Framer Motion
- **Prisma 6** ORM → **MySQL**
- **NextAuth.js** untuk autentikasi admin
- **TanStack Query / Table**, **Zustand**, **React Hook Form + Zod**
- **next-intl** (i18n), **bun** sebagai package manager & runner

## Commands

```bash
bun run dev          # next dev di port 3000 (output di-tee ke dev.log)
bun run build        # rm -rf .next && prisma generate && next build (+copy static ke standalone)
bun run start        # jalankan build standalone (NODE_ENV=production)
bun run lint         # eslint

bun run db:push      # prisma db push (sync schema tanpa migrasi)
bun run db:generate  # prisma generate
bun run db:migrate   # prisma migrate dev
bun run db:reset     # prisma migrate reset
bun run db:seed      # bun prisma/seed.ts
```

## Architecture

- **`src/app/`** — App Router
  - Halaman publik: `berita/`, `pengumuman-sidang/`, `data-laporan/`, `[...slug]` (halaman dinamis dari CMS), `maintenance/`, `login/`
  - **`admin/`** — panel CMS (terproteksi)
  - **`api/`** — route handlers REST: `posts`, `pages`, `menus`, `categories`, `layanan`, `pengumuman-sidang`, `faq`, `partners`, `pejabat`, `survey`, `reports`, `statistics`, `visitor`, `settings`, `maintenance`, berbagai `*-slides` (hero/information/maklumat/pojok-info), `youtube-videos`, dan `auth/*`
- **`src/components/`** — `ui/` (shadcn), `sections/` (blok landing page), `layout/`, `admin/`
- **`src/lib/`** — `db.ts` (Prisma client), `auth.ts` (NextAuth), `maintenance.ts`, `safe-fetch.ts`, `wordpress.ts`, `youtube.ts`, `utils.ts`
- **`prisma/schema.prisma`** — model utama: `User`, `MenuItem` (nested via `parentId`), `SiteSetting` (key/value), serta model konten/layanan/laporan
- Konten situs (menu, slide, halaman, pengaturan) di-drive dari database lewat panel admin, bukan hardcode.

## Deployment

- Output **standalone** Next.js; tersedia konfigurasi **Docker** (`Dockerfile`, `docker-compose*.yml`), **Caddy** (`Caddyfile*`), **nginx/aaPanel**, dan **PM2** (`ecosystem.config.js`).
- **Maintenance mode** dikontrol via `src/lib/maintenance.ts` + API `api/maintenance` (lihat `MAINTENANCE-MODE.md`).
- Dokumentasi tambahan: `DEPLOYMENT-CHECKLIST.md`, `DOCKER-DEPLOYMENT.md`, `PRODUCTION-DEPLOYMENT.md`, `VISITOR-STATISTICS.md`, `TTS-FEATURE.md`.
- `DATABASE_URL` (MySQL) wajib di-set di `.env`.

## Konvensi

- Komentar & teks UI berbahasa Indonesia; ikuti gaya kode di sekitarnya.
- Validasi input dengan Zod; form dengan React Hook Form.
- Akses DB selalu lewat singleton Prisma client di `src/lib/db.ts`.

---

## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
| ------ | ---------- |
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
