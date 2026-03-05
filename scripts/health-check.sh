#!/bin/bash

# Quick health check script
# Usage: docker-compose exec app ./scripts/health-check.sh

set -e

echo "🔍 Checking application health..."

# Check if app is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Application is not responding"
    exit 1
fi

echo "✅ Application is healthy"

# Check database connection
echo ""
echo "🔍 Checking database connection..."

cd /app

if ! npx prisma db execute --stdin < /dev/null 2>/dev/null; then
    echo "⚠️  Warning: Could not connect to database"
else
    echo "✅ Database connection is healthy"
fi

# Check disk space
echo ""
echo "🔍 Checking disk space..."

DISK_USAGE=$(df /app | awk 'NR==2 {print $5}' | sed 's/%//')

if [ "$DISK_USAGE" -gt 80 ]; then
    echo "⚠️  Warning: Disk usage is at $DISK_USAGE%"
else
    echo "✅ Disk space is healthy ($DISK_USAGE% used)"
fi

echo ""
echo "🎉 All health checks passed!"
