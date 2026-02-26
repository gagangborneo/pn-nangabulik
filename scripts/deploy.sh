#!/bin/bash

# Production Deploy Script for PN Nangabulik
# Usage: ./scripts/deploy.sh

set -e  # Exit on error

echo "📦 Starting production deployment..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${RED}❌ PM2 not installed. Install with: npm install -g pm2${NC}"
    exit 1
fi

# 1. Pull latest changes from git
echo -e "${YELLOW}1️⃣  Pulling latest changes from git...${NC}"
git pull origin main || { echo -e "${RED}Git pull failed${NC}"; exit 1; }

# 2. Install/update dependencies
echo -e "${YELLOW}2️⃣  Installing dependencies...${NC}"
npm install --production=false || { echo -e "${RED}npm install failed${NC}"; exit 1; }

# 3. Generate Prisma Client (important!)
echo -e "${YELLOW}3️⃣  Generating Prisma client...${NC}"
npx prisma generate || { echo -e "${RED}Prisma generate failed${NC}"; exit 1; }

# 4. Run database migrations
echo -e "${YELLOW}4️⃣  Running database migrations...${NC}"
npx prisma db push --skip-generate || { echo -e "${RED}Database migration failed${NC}"; exit 1; }

# 5. Clear Next.js cache
echo -e "${YELLOW}5️⃣  Clearing Next.js cache...${NC}"
rm -rf .next || true
rm -rf node_modules/.cache || true

# 6. Build project
echo -e "${YELLOW}6️⃣  Building Next.js project...${NC}"
npm run build || { echo -e "${RED}Build failed${NC}"; exit 1; }

# 7. Force stop old PM2 processes with delay
echo -e "${YELLOW}7️⃣  Stopping old PM2 processes...${NC}"
pm2 stop pn-nangabulik || true
sleep 2  # Give time for graceful shutdown
pm2 kill || true
sleep 2

# 8. Clear PM2 logs (optional, prevents log bloat)
pm2 flush || true

# 9. Start application with ecosystem.config.js
echo -e "${YELLOW}8️⃣  Starting application with PM2...${NC}"
pm2 start ecosystem.config.js --env production --watch-delay 5000 || { echo -e "${RED}PM2 start failed${NC}"; exit 1; }

# 10. Save PM2 process state
echo -e "${YELLOW}9️⃣  Saving PM2 process state...${NC}"
pm2 save || true

# 11. Setup PM2 startup script for system reboot
echo -e "${YELLOW}🔟 Setting up PM2 startup...${NC}"
pm2 startup || true

# 12. Verify deployment
echo -e "${YELLOW}✅ Verifying deployment...${NC}"
sleep 3
if pm2 ping > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Application is running${NC}"
    pm2 list
else
    echo -e "${RED}❌ Application failed to start${NC}"
    pm2 logs pn-nangabulik --err
    exit 1
fi

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "App URL: http://localhost:3000"
echo -e "\n${YELLOW}Useful commands:${NC}"
echo "  - Monitor:  pm2 monit"
echo "  - Logs:     pm2 logs pn-nangabulik"
echo "  - Restart:  pm2 restart pn-nangabulik"
echo "  - Stop:     pm2 stop pn-nangabulik"
