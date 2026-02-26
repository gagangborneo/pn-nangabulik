# Quick PM2 + Next.js Deploy Reference

## ⚡ ONE-LINER DEPLOY (copy & paste ke VPS)
```bash
cd /path/to/pn-nangabulik && git pull origin main && npm install && npx prisma generate && npx prisma db push --skip-generate && rm -rf .next && npm run build && pm2 stop pn-nangabulik && sleep 2 && pm2 kill && sleep 2 && pm2 start ecosystem.config.js --env production && pm2 save && echo "✅ DONE!"
```

## 🚀 ATAU Pakai Script (RECOMMENDED)
```bash
cd /path/to/pn-nangabulik && chmod +x scripts/deploy.sh && ./scripts/deploy.sh
```

## 📊 Monitoring Commands
```bash
pm2 list                          # Lihat semua proses
pm2 logs pn-nangabulik --err      # Error logs
pm2 logs pn-nangabulik -f         # Follow logs
pm2 monit                         # Real-time monitor
```

## 🔄 Common Operations
```bash
pm2 restart pn-nangabulik         # Restart
pm2 stop pn-nangabulik            # Stop (keep in PM2 list)
pm2 start ecosystem.config.js     # Start
pm2 delete pn-nangabulik          # Remove from PM2 list
pm2 kill                          # Kill all PM2 processes
pm2 save                          # Save state to disk
pm2 startup                       # Setup auto-start on reboot
```

## 🆘 If Still Not Updated
1. Check logs: `pm2 logs pn-nangabulik --err`
2. Hard kill: `pm2 kill` then `pm2 start ecosystem.config.js --env production`
3. Clear cache: `rm -rf .next && npm run build`
4. Check Nginx: `sudo systemctl reload nginx` (if aapanel using Nginx)
5. Verify running: `curl http://localhost:3000/api/posts`

## 🔗 Important Files
- `ecosystem.config.js` - PM2 configuration
- `scripts/deploy.sh` - Deployment automation script
- `PRODUCTION-DEPLOYMENT.md` - Full documentation
- `.next/standalone/` - Production build output
