# 🚀 Production Deployment Guide - PM2 + aapanel

## Masalah yang Terjadi
- Halaman `/berita` tidak terupdate di production meski sudah `git pull`, `build ulang`, dan `pm2 restart`
- Local development berjalan baik karena Next.js dev server auto-refresh
- Production issue: **PM2 tanpa config + Next.js module cache**

## Root Causes
1. **PM2 tanpa ecosystem config** → Restart tidak graceful
2. **Node.js module cache** → Process lama masih cache module di memory
3. **Next.js standalone cache** → File `.next/` tidak fully replaced
4. **Nginx cache** (jika ada) → Response cached di reverse proxy

## ✅ Solusi yang Diterapkan

### 1. PM2 Configuration (`ecosystem.config.js`)
- ✓ Proper cluster mode dengan graceful shutdown
- ✓ Max memory restart limit (500MB)
- ✓ Correct kill timeout (5 detik)
- ✓ Error dan output logging
- ✓ Deploy section untuk future automation

### 2. Deployment Script (`scripts/deploy.sh`)
Automated script yang:
- ✓ Git pull latest changes
- ✓ Install dependencies
- ✓ **Generate Prisma client** (penting!)
- ✓ Run database migrations
- ✓ **Hapus `.next/` dan cache** sebelum build
- ✓ Build project
- ✓ **Force kill semua PM2 processes** dengan delay
- ✓ Start aplikasi dengan ecosystem config
- ✓ Verify deployment success

### 3. Cache Busting pada API
Sudah di-update di:
- `src/app/api/posts/route.ts` → No-cache headers
- `src/components/sections/AllPostsView.tsx` → Timestamp query param

## 🔧 Setup di VPS

### Step 1: Setup awal (one-time)
```bash
# SSH ke VPS
ssh www@your-vps-ip

# Navigate ke project directory
cd /path/to/pn-nangabulik

# Make deploy script executable
chmod +x scripts/deploy.sh

# Install PM2 globally (jika belum)
npm install -g pm2

# Save PM2 startup script
pm2 startup
pm2 save
```

### Step 2: Setiap kali update
```bash
# Option A: Gunakan deploy script
./scripts/deploy.sh

# Option B: Manual command
git pull origin main && \
npm install && \
npx prisma generate && \
npx prisma db push --skip-generate && \
rm -rf .next && \
npm run build && \
pm2 stop pn-nangabulik && \
sleep 2 && \
pm2 kill && \
sleep 2 && \
pm2 start ecosystem.config.js --env production && \
pm2 save
```

## 🔍 Troubleshooting

### Halaman masih tidak terupdate setelah deploy
```bash
# Cek apakah PM2 running
pm2 list

# Lihat logs
pm2 logs pn-nangabulik --err

# Force restart dengan hard kill
pm2 kill -9
pm2 start ecosystem.config.js --env production
pm2 save

# Check process
ps aux | grep node
```

### Clear Nginx cache (jika pakai aapanel reverse proxy)
Masuk ke aapanel panel:
1. Reverse Proxy → Edit → Disable cache atau set cache time ke 0
2. Atau di terminal:
```bash
# If using Nginx
sudo systemctl reload nginx

# If using Varnish
sudo varnishadm 'ban req.url ~ .'
```

### Database connection issue
```bash
# Regenerate Prisma client
npx prisma generate

# Test database connection
npx prisma db execute --stdin < /dev/null

# View database schema
npx prisma studio
```

## 📋 Monitoring

### Real-time monitoring
```bash
pm2 monit
```

### View logs
```bash
# Error logs
pm2 logs pn-nangabulik --err

# All logs
pm2 logs pn-nangabulik

# Follow logs in real-time
pm2 logs pn-nangabulik --lines 100 --follow
```

### Check health
```bash
# PM2 status
pm2 status

# Process info
pm2 info pn-nangabulik

# Verify API response
curl http://localhost:3000/api/posts
```

## 🔒 Security Notes

- ✓ `ecosystem.config.js` contains path info → Add to `.gitignore` if using custom VPS info
- ✓ `scripts/deploy.sh` uses `origin/main` → Ensure correct branch
- ✓ PM2 startup runs as system user → Proper permissions needed
- ✓ Never commit `.env.local` → Use VPS environment variables

## 🎯 Tips

1. **Always test deploy script locally first** (in dev environment)
2. **Keep PM2 logs small**: `pm2 flush` weekly
3. **Monitor memory**: Set `max_memory_restart: '500M'` appropriately
4. **Database backups**: Run `mysqldump` before each deploy
5. **Rollback plan**: Keep previous `.next` build: `cp -r .next .next.bak`

## 📞 Issues?

Jika masalah persisten, cek:
1. `.next/standalone/server.js` exist dan correct
2. `NODE_ENV=production` di environment
3. Database credentials correct
4. Disk space available (`df -h`)
5. Port 3000 tidak blocked
6. PM2 not running as different user than app files owner
