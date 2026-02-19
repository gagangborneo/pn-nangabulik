# Testing Maintenance Mode Feature

## Test Scenarios

### Scenario 1: Enable Maintenance Mode (Non-Admin User)
**Expected:** All non-admin users redirected to maintenance page

1. Run script to enable maintenance:
   ```bash
   npx tsx scripts/enable-maintenance.ts
   ```

2. Open incognito/private browser window
3. Navigate to `http://localhost:3000`
4. **✓ Should auto-redirect to `/maintenance`**
5. Try other pages:
   - `/berita` → redirects to `/maintenance` ✓
   - `/data-laporan` → redirects to `/maintenance` ✓
   - Any dynamic page → redirects to `/maintenance` ✓

### Scenario 2: Admin Can Still Access (Maintenance ON)
**Expected:** Admin users can access all pages normally

1. Login as admin at `/login`
2. Navigate to `http://localhost:3000`
3. **✓ Should display homepage normally (no redirect)**
4. Admin panel accessible at `/admin` ✓
5. All pages accessible normally ✓

### Scenario 3: Disable Maintenance Mode
**Expected:** All users can access website normally

1. Admin goes to `/admin` → Settings
2. Toggle "Mode Maintenance" to OFF
3. Click "Simpan Pengaturan"
4. OR run script:
   ```bash
   npx tsx scripts/disable-maintenance.ts
   ```

5. Refresh incognito browser at `http://localhost:3000`
6. **✓ Should display homepage normally**
7. All pages now accessible ✓

### Scenario 4: Direct Access to Maintenance Page (Maintenance OFF)
**Expected:** Redirect to homepage

1. Ensure maintenance mode is OFF
2. Try to access `http://localhost:3000/maintenance` directly
3. **✓ Should auto-redirect to `/` (homepage)**
4. This prevents users from seeing maintenance page when it's not active

## Quick Test Commands

### Enable Maintenance
```bash
npx tsx scripts/enable-maintenance.ts
```

### Disable Maintenance  
```bash
npx tsx scripts/disable-maintenance.ts
```

### Check Current Status
```bash
npx tsx scripts/check-maintenance.ts
```

## Via Admin Panel

1. Login to `/admin`
2. Go to "Pengaturan" (Settings)
3. Scroll to "Mode Maintenance" section
4. Toggle switch ON/OFF
5. Customize "Judul Halaman Maintenance" if needed
6. Click "Simpan Pengaturan"

## Test Results Checklist

- [x] ✅ Maintenance ON → Non-admin redirected to `/maintenance`
- [x] ✅ Maintenance ON → Admin can still access all pages
- [x] ✅ Maintenance OFF → All users can access website
- [x] ✅ Maintenance OFF → Direct access to `/maintenance` redirects to `/`
- [x] ✅ All pages (/, /berita, /data-laporan, dynamic pages) checked
- [x] ✅ Client-side pages use MaintenanceCheck component
- [x] ✅ Server-side pages use shouldRedirectToMaintenance()
- [x] ✅ Settings can be changed via admin panel
- [x] ✅ Settings can be changed via scripts

## Server Response Codes

- `307` - Temporary Redirect (used for maintenance redirects)
- `200` - Success (page loaded normally)

## Files Involved

### Core Logic
- `/src/app/page.tsx` - Homepage with server-side check
- `/src/app/maintenance/page.tsx` - Maintenance landing page with redirect logic
- `/src/lib/maintenance.ts` - Helper functions for checking maintenance mode
- `/src/components/MaintenanceCheck.tsx` - Client-side maintenance checker

### API
- `/src/app/api/maintenance/route.ts` - API endpoint for maintenance status

### Admin
- `/src/components/admin/SettingsManagement.tsx` - Admin UI for maintenance toggle

### Scripts
- `scripts/enable-maintenance.ts` - Quick enable via CLI
- `scripts/disable-maintenance.ts` - Quick disable via CLI  
- `scripts/check-maintenance.ts` - Check current status

## Implementation Complete ✅

All scenarios tested and working correctly!
