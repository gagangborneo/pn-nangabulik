# Visitor Statistics System

## Overview
A comprehensive visitor tracking and analytics system for the PN Nanga Bulik website with real-time monitoring, per-page statistics, and bot filtering.

## Features

### ✅ Implemented Features
- **Global Visitor Tracking**: Tracks all page visits across the entire website
- **Per-Page Statistics**: Individual page visit counts and analytics
- **Bot Detection & Filtering**: Automatically filters out bots, crawlers, and headless browsers
- **Cloudflare Compatible**: Properly detects real IP addresses behind Cloudflare proxy
- **Unique Daily Visits**: Prevents duplicate counts per IP per page per day
- **Real-time Online Users**: Shows users active in the last 5 minutes
- **Minimalist Landing Page Counter**: Clean, modern visitor counter displayed on homepage
- **Full Admin Dashboard**: Comprehensive analytics dashboard with charts and tables

### 📊 Statistics Provided
- Today's visitors
- Yesterday's visitors
- This week vs last week
- This month vs last month
- Total visitors since tracking began
- Online users (last 5 minutes)
- Top 20 most visited pages
- Per-page unique visitors

## Architecture

### Database Structure

**Table: `Visitor`**
```prisma
model Visitor {
  id          BigInt   @id @default(autoincrement())
  ipAddress   String   @db.VarChar(45)
  userAgent   String   @db.Text
  path        String   @db.VarChar(255)
  visitedDate DateTime @db.Date
  createdAt   DateTime @default(now())

  @@unique([ipAddress, path, visitedDate], name: "unique_daily_ip_path")
  @@index([visitedDate], name: "idx_visited_date")
  @@index([path], name: "idx_path")
  @@index([createdAt], name: "idx_created_at")
}
```

**Key Constraints:**
- Unique constraint prevents duplicate daily counts per IP per page
- Indexes optimize query performance for date-based and path-based queries

### API Endpoints

#### 1. POST `/api/visitor`
Tracks a page visit.

**Request:**
```json
{
  "path": "/berita/artikel-example"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Visitor tracked"
}
```

**Features:**
- Detects real IP from Cloudflare headers (`cf-connecting-ip`)
- Falls back to `x-forwarded-for` and `x-real-ip`
- Filters out bots based on user-agent patterns
- Prevents duplicate daily counts automatically

#### 2. GET `/api/statistics`
Returns comprehensive visitor statistics.

**Response:**
```json
{
  "global": {
    "today": 150,
    "yesterday": 120,
    "thisWeek": 890,
    "lastWeek": 760,
    "thisMonth": 3200,
    "lastMonth": 2800,
    "total": 15000,
    "onlineUsers": 8
  },
  "perPage": [
    {
      "path": "/",
      "today": 45,
      "total": 5000,
      "uniqueToday": 32
    },
    {
      "path": "/berita",
      "today": 28,
      "total": 2500,
      "uniqueToday": 22
    }
  ],
  "currentIp": "103.127.133.230",
  "currentDateFormatted": "Rab - Feb - 2026"
}
```

### Components

#### 1. VisitorTracker Component
**Location:** `src/components/VisitorTracker.tsx`

Automatically tracks page visits on every route change.

**Features:**
- Client-side component using Next.js `usePathname` hook
- Automatic tracking on route changes
- Non-blocking (500ms delay after page load)
- Silent error handling (doesn't disrupt user experience)
- Integrated into root layout for site-wide tracking

#### 2. VisitorCounterSection Component
**Location:** `src/components/sections/VisitorCounterSection.tsx`

Minimalist visitor counter displayed on the landing page before the footer.

**Features:**
- Four key metrics: Online Now, Today, This Month, Total
- Gradient card design with icons
- Responsive grid layout (2 columns on mobile, 4 on desktop)
- Auto-refresh statistics on mount
- Loading state with skeleton animation

**Display:**
- Online Users (green theme)
- Today's Visitors (blue theme)
- This Month (purple theme)
- Total Visits (orange theme)

#### 3. VisitorDashboard Component
**Location:** `src/components/admin/VisitorDashboard.tsx`

Full analytics dashboard for admin panel.

**Features:**
- Real-time statistics (auto-refresh every 30 seconds)
- Comparison cards showing percentage changes
- Today vs Yesterday comparison
- Week over week comparison
- Month over month comparison
- Online users indicator
- Top 20 pages table with:
  - Page path
  - Today's visits
  - Unique visitors today
  - Total visits
- Responsive design
- Loading and error states

### Pages

#### Admin Statistics Page
**Location:** `src/app/admin/statistics/page.tsx`

Protected admin page displaying the full visitor dashboard.

**Features:**
- Requires authentication (NextAuth session)
- Redirects to login if not authenticated
- Full-width dashboard layout
- Integrated into admin panel navigation

**Access:** `/admin/statistics`

## Bot Detection

The system filters out the following bot patterns (case-insensitive):
- `bot`
- `crawl`
- `spider`
- `preview`
- `headless`
- `curl`
- `wget`
- `python-requests`
- `axios`
- `postman`

## IP Detection Priority

1. **Cloudflare**: `cf-connecting-ip` header (highest priority)
2. **X-Forwarded-For**: First IP in the list
3. **X-Real-IP**: Direct real IP header
4. **Fallback**: "unknown" if none available

## Performance Optimizations

### Database
- Indexed fields for fast queries
- Unique constraint prevents duplicate inserts
- Optimized date range queries
- Connection pooling via Prisma

### API
- Parallel query execution using `Promise.all()`
- Raw SQL for complex aggregations
- Efficient date calculations
- Minimal data transfer

### Frontend
- Auto-refresh every 30 seconds (dashboard)
- Loading states prevent layout shifts
- Silent error handling
- Non-blocking tracking (500ms delay)
- Responsive design with mobile-first approach

## Integration Points

### Root Layout
**File:** `src/app/layout.tsx`

The `VisitorTracker` component is integrated into the root layout:

```tsx
<TTSProvider>
  <VisitorTracker />
  {children}
  <Toaster />
</TTSProvider>
```

This ensures automatic tracking across all pages.

### Landing Page
**File:** `src/app/page.tsx`

The `VisitorCounterSection` is placed before the footer:

```tsx
<ContactSection />
<VisitorCounterSection />
</main>
<Footer />
```

### Admin Panel
**File:** `src/components/admin/AdminDashboard.tsx`

Statistics link added to admin navigation menu (2nd item from top).

## Usage

### For Developers

**1. Track a page visit (automatic):**
The VisitorTracker component automatically tracks all page visits. No manual implementation needed.

**2. Get statistics programmatically:**
```typescript
const response = await fetch('/api/statistics')
const data = await response.json()
console.log(data.global.today) // Today's visitor count
```

**3. Add visitor counter to a page:**
```tsx
import VisitorCounterSection from '@/components/sections/VisitorCounterSection'

export default function MyPage() {
  return (
    <div>
      {/* Your content */}
      <VisitorCounterSection />
    </div>
  )
}
```

### For Admins

**Access the full dashboard:**
1. Log in to admin panel at `/login`
2. Navigate to "Statistik Pengunjung" in the sidebar
3. View real-time statistics, charts, and per-page analytics

## Security Considerations

✅ **Bot filtering** prevents inflated statistics
✅ **IP-based deduplication** prevents abuse
✅ **Silent error handling** prevents information leakage
✅ **Admin authentication** protects sensitive analytics
✅ **Rate limiting** via unique daily constraint
✅ **No PII storage** (only IP, user-agent, path)

## Environment Variables

No additional environment variables needed. Uses existing `DATABASE_URL` from Prisma configuration.

## Database Migration

The Visitor table was created using:
```bash
npx prisma db push
```

To regenerate Prisma Client after schema changes:
```bash
npx prisma generate
```

## Testing

### Test Visitor Tracking
1. Open the website in a browser
2. Navigate to different pages
3. Check browser console for tracking requests
4. Visit `/admin/statistics` to see the data

### Test Bot Filtering
```bash
# This should NOT be tracked
curl -A "Mozilla/5.0 (compatible; Googlebot/2.1)" http://localhost:3000/api/visitor -X POST -H "Content-Type: application/json" -d '{"path":"/"}'

# This SHOULD be tracked
curl -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" http://localhost:3000/api/visitor -X POST -H "Content-Type: application/json" -d '{"path":"/"}'
```

## Future Enhancements (Optional)

- [ ] Export statistics to CSV/Excel
- [ ] Referrer tracking
- [ ] Geographic location tracking
- [ ] Custom date range filters
- [ ] Visitor session tracking
- [ ] Real-time dashboard updates (WebSocket)
- [ ] Bounce rate calculation
- [ ] Average session duration
- [ ] Device/browser analytics
- [ ] Chart visualizations (line/bar charts)

## Troubleshooting

### Statistics not updating
1. Check if VisitorTracker is in layout.tsx
2. Verify database connection
3. Check browser console for errors
4. Verify Prisma Client is generated: `npx prisma generate`

### Bot visits being tracked
1. Verify user-agent detection in `/api/visitor`
2. Add custom bot patterns to BOT_PATTERNS array

### Duplicate counts
1. Verify unique constraint is in database
2. Check if visitedDate is being set correctly
3. Confirm IP detection is working

### Performance issues
1. Check database indexes
2. Verify connection pooling
3. Consider caching statistics for high-traffic sites

## Credits

Built for Pengadilan Negeri Nanga Bulik using:
- Next.js 14 (App Router)
- Prisma ORM
- MySQL Database
- TypeScript
- Tailwind CSS
- shadcn/ui components

---

**Last Updated:** February 18, 2026
**Version:** 1.0.0
