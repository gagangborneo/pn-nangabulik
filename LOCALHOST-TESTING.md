# Testing Visitor Statistics on Localhost

## ✅ Fixed Issues

The error `"Failed to fetch statistics"` was caused by:
1. Prisma Client cache not picking up the new Visitor model
2. Next.js cache (.next folder) containing old compiled code

## Solution Applied

```bash
# Clear Next.js cache and regenerate Prisma Client
rm -rf .next
npx prisma generate

# Restart dev server
bun run dev
```

## Testing on Localhost

### 1. Test Statistics API
```bash
curl http://localhost:3000/api/statistics
```

**Expected Response:**
```json
{
  "global": {
    "today": 0,
    "yesterday": 9,
    "thisWeek": 9,
    "lastWeek": 0,
    "thisMonth": 9,
    "lastMonth": 0,
    "total": 9,
    "onlineUsers": 1
  },
  "perPage": [...],
  "currentIp": "::ffff:127.0.0.1",
  "currentDateFormatted": "Rab - Feb - 2026"
}
```

### 2. Test Visitor Tracking (Browser User Agent)
```bash
curl -X POST http://localhost:3000/api/visitor \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" \
  -d '{"path":"/test-page"}'
```

**Expected Response:**
```json
{"success":true,"message":"Visitor tracked"}
```

### 3. Test Bot Detection
```bash
curl -X POST http://localhost:3000/api/visitor \
  -H "Content-Type: application/json" \
  -d '{"path":"/"}'
```

**Expected Response:**
```json
{"success":true,"message":"Bot detected, not tracked"}
```

## Viewing in Browser

### Public Landing Page Counter
1. Open http://localhost:3000
2. Scroll to the bottom (before footer)
3. See the minimalist visitor counter with 4 cards:
   - Online Sekarang
   - Hari Ini
   - Bulan Ini
   - Total Kunjungan

### Admin Dashboard
1. Login at http://localhost:3000/login
2. Click "Statistik Pengunjung" in sidebar (2nd menu item)
3. View comprehensive analytics with:
   - Comparison cards (today vs yesterday, etc.)
   - Online users
   - Top 20 pages table
   - Auto-refresh every 30 seconds

## Troubleshooting

### Issue: Statistics still showing error after fix

**Solution 1: Hard Refresh Browser**
```
Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

**Solution 2: Clear Everything and Restart**
```bash
# Stop dev server
lsof -ti:3000 | xargs kill -9

# Clear all caches
rm -rf .next
rm -rf node_modules/.cache

# Regenerate Prisma
npx prisma generate

# Start fresh
bun run dev
```

**Solution 3: Check Database Connection**
```bash
# Test Prisma connection
npx prisma db pull
```

### Issue: "today" count shows 0 but visitors are tracked

This is normal on localhost because:
- The `visitedDate` field uses DATE type (not DATETIME)
- Timezone differences between your machine and database server
- Historical data was created on different dates

**To test "today" tracking:**
1. Clear your IP from database or use different browsers
2. Visit pages in a real browser (not curl)
3. Check statistics immediately

### Issue: All requests show "Bot detected"

If using curl, add a real browser User-Agent:
```bash
curl -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
  http://localhost:3000/api/visitor
```

## Production Deployment Checklist

Before deploying to production:

- ✅ Database schema synced (`npx prisma db push`)
- ✅ Prisma Client generated (`npx prisma generate`)
- ✅ Environment variables set (DATABASE_URL)
- ✅ Bot detection configured
- ✅ Cloudflare IP detection enabled (if using Cloudflare)

## Performance Notes

- Tracking is non-blocking (500ms delay after page load)
- Unique constraint prevents duplicate daily counts automatically
- Indexed fields ensure fast queries
- Statistics API caches results client-side

## Current Status

✅ **All APIs working correctly**
- POST `/api/visitor` - Tracking visitors
- GET `/api/statistics` - Returning statistics

✅ **Components working**
- VisitorTracker - Auto-tracking on all pages
- VisitorCounterSection - Displaying on landing page
- VisitorDashboard - Full admin dashboard

✅ **Database**
- Visitor table created
- Indexes applied
- Unique constraints working

## Next Steps

1. **Test in browser**: Visit http://localhost:3000 to see the counter
2. **Navigate pages**: Browse different pages to track visits
3. **Check admin**: Login and view full statistics at `/admin/statistics`
4. **Monitor**: Watch terminal for tracking logs

---

**Last Updated:** February 18, 2026
**Status:** ✅ Working on Localhost
