# Docker Deployment Guide untuk VPS

Panduan lengkap untuk deploy aplikasi PN Nangabulik di VPS menggunakan Docker.

## Prasyarat

- VPS dengan minimal 2GB RAM dan 20GB storage
- Docker dan Docker Compose terinstall
- Domain atau IP address
- SSH access ke VPS
- Git untuk clone repository

## 1. Instalasi Docker & Docker Compose di VPS

### Di Ubuntu/Debian:

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Tambah user ke docker group (opsional, untuk menghindari sudo)
sudo usermod -aG docker $USER
newgrp docker
```

### Verifikasi instalasi:
```bash
docker --version
docker-compose --version
```

## 2. Setup di VPS

```bash
# Clone repository
cd /var/www
sudo git clone <your-repo-url> pn-nangabulik
cd pn-nangabulik

# Buat .env.production
sudo nano .env.production
```

### Isi .env.production:
```env
# Next.js
NODE_ENV=production

# Auth (jika menggunakan NextAuth)
NEXTAUTH_SECRET=your_nextauth_secret_here_generate_with_openssl_rand_base64_32
NEXTAUTH_URL=https://your-domain.com

# API endpoints
NEXT_PUBLIC_API_URL=https://your-domain.com

# Logging
LOG_LEVEL=info
```

### Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## 3. Konfigurasi Caddyfile untuk VPS

Edit `Caddyfile` untuk domain Anda:

```caddy
# Production dengan SSL auto-renew
your-domain.com {
    encode gzip
    
    # Enable compression
    header / -Server
    
    # Security headers
    header / X-Frame-Options "SAMEORIGIN"
    header / X-Content-Type-Options "nosniff"
    header / X-XSS-Protection "1; mode=block"
    header / Referrer-Policy "strict-origin-when-cross-origin"
    
    # Reverse proxy ke Next.js app
    reverse_proxy app:3000 {
        header_up Host {host}
        header_up X-Forwarded-For {remote_host}
        header_up X-Forwarded-Proto {scheme}
        header_up X-Real-IP {remote_host}
    }
    
    # Timeout settings
    reverse_proxy app:3000 {
        policy random
        health_uri /
        health_interval 10s
        health_timeout 5s
    }
}

# Redirect www to non-www (opsional)
www.your-domain.com {
    redir https://your-domain.com{uri} permanent
}

# Internal monitoring port (tidak expose ke internet)
:81 {
    @health_check {
        path /health
    }
    
    handle @health_check {
        respond "OK" 200
    }
    
    handle {
        reverse_proxy app:3000 {
            header_up Host {host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
        }
    }
}
```

## 4. Persiapan Struktur Direktori

```bash
# Buat direktori untuk volumes
mkdir -p ./upload
mkdir -p ./public

# Set proper permissions
sudo chown -R $USER:$USER ./upload ./public
chmod -R 755 ./upload ./public
```

## 5. Build dan Start Services

```bash
# Build Docker image
docker-compose build

# Start semua services di background
docker-compose up -d

# Lihat logs
docker-compose logs -f

# Logs untuk service tertentu
docker-compose logs -f app
docker-compose logs -f caddy
```

## 6. Verifikasi Services (First Time Only)

```bash
# Check status services
docker-compose ps

# View app logs
docker-compose logs app
```

## 7. Monitoring dan Maintenance

### Check status services:
```bash
docker-compose ps
```

### View logs real-time:
```bash
docker-compose logs -f
```

### Restart service:
```bash
docker-compose restart app
docker-compose restart caddy
```

### Stop semua services:
```bash
docker-compose down
```

### Stop dan hapus volumes (HATI-HATI!):
```bash
docker-compose down -v
```

## 8. File Storage & Backups

### Regular file backups:

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/var/backups/pn-nangabulik"
mkdir -p $BACKUP_DIR

# Backup upload directory
tar -czf "$BACKUP_DIR/upload_$(date +%Y%m%d_%H%M%S).tar.gz" ./upload

# Keep only last 7 days of backups
find $BACKUP_DIR -name "upload_*.tar.gz" -mtime +7 -delete

echo "Backup completed!"
```

### Schedule dengan cron (daily at 2 AM):
```bash
0 2 * * * /var/www/pn-nangabulik/backup.sh
```

## 9. Update Aplikasi

```bash
# Pull latest code
cd /var/www/pn-nangabulik
git pull origin main

# Rebuild image
docker-compose build

# Start services
docker-compose up -d

# Check logs untuk memastikan semua berjalan
docker-compose logs -f

# Or use convenient script
./scripts/deploy-docker.sh update
```

## 10. Troubleshooting

### Port 80/443 already in use:
```bash
# Find process using port
sudo lsof -i :80
sudo lsof -i :443

# Kill process
sudo kill -9 <PID>
```

### Caddy certificate issues:
```bash
# Check Caddy logs
docker-compose logs caddy

# Check Caddy config
docker-compose exec caddy caddy validate --config /etc/caddy/Caddyfile

# Regenerate certificates
docker-compose exec caddy caddy reload
```

### Out of disk space:
```bash
# Check disk usage
df -h

# Clean unused Docker objects
docker system prune -a --volumes
```

## 11. Security Checklist

- [ ] Ubah password DATABASE_PASSWORD
- [ ] Ubah NEXTAUTH_SECRET dengan value unik
- [ ] Set NEXTAUTH_URL ke domain yang benar
- [ ] Enable firewall di VPS (hanya buka port 22, 80, 443)
- [ ] Setup SSH key-based authentication
- [ ] Disable root login via SSH
- [ ] Regular backup database
- [ ] Monitor disk usage
- [ ] Update Docker image secara berkala
- [ ] Implementasi rate limiting di Caddy

## 12. Performance Tips

### Enable compression di production:
Sudah included di Caddyfile dengan `encode gzip`

### Implement caching:
Tambah cache headers di Caddyfile:
```caddy
header / Cache-Control "public, max-age=3600"
```

## Resource Contact

- Docker Docs: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- Caddy Docs: https://caddyserver.com/docs/
- Prisma Docs: https://www.prisma.io/docs/
- Next.js Deployment: https://nextjs.org/docs/deployment/

---

**Last Updated:** 2026-03-02
**Maintained by:** PN Nangabulik Dev Team
