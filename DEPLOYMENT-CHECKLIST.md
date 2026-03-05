# ✅ Docker Deployment Checklist

## 📦 Files Created

Berikut adalah file-file Docker yang telah dibuat untuk deployment:

### Core Docker Files
- ✅ **Dockerfile** - Multi-stage Docker image untuk Next.js app
- ✅ **docker-compose.yml** - Orchestration untuk production (app + postgres + caddy)
- ✅ **docker-compose.dev.yml** - Konfigurasi development (dengan hot reload)
- ✅ **.dockerignore** - Files yang diabaikan saat build Docker

### Configuration Files
- ✅ **.env.production.example** - Template environment variables
- ✅ **Caddyfile.production** - Caddy reverse proxy config untuk production

### Scripts
- ✅ **scripts/deploy-docker.sh** - Main deployment script dengan berbagai commands
- ✅ **scripts/backup-database.sh** - Automated database backup
- ✅ **scripts/health-check.sh** - Health check script

### Documentation
- ✅ **DOCKER-DEPLOYMENT.md** - Panduan lengkap deployment di VPS
- ✅ **DOCKER-QUICK-REFERENCE.md** - Quick reference commands

---

## 🚀 Langkah-Langkah Deployment di VPS

### Step 1: Persiapan VPS
```bash
# SSH ke VPS
ssh user@your-vps-ip

# Update sistem
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sudo sh

# Install Docker Compose  
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Tambah user ke docker group
sudo usermod -aG docker $USER
newgrp docker
```

### Step 2: Clone & Setup Aplikasi
```bash
# Clone repository
cd /var/www
sudo git clone <your-repo-url> pn-nangabulik
cd pn-nangabulik

# Copy environment file
cp .env.production.example .env.production

# Edit dengan editor (nano, vim, etc)
sudo nano .env.production
# - Set DATABASE_PASSWORD yang aman
# - Set NEXTAUTH_SECRET dengan: openssl rand -base64 32
# - Set domain Anda
# - Set URL lainnya

# Set proper permissions
sudo chown -R $USER:$USER .
chmod 600 .env.production
```

### Step 3: Konfigurasi Caddyfile
```bash
# Copy Caddyfile production
cp Caddyfile.production Caddyfile

# Edit domain Anda
nano Caddyfile
# Ganti "your-domain.com" dengan domain Anda
# Ganti "your-email@example.com" jika perlu email untuk SSL
```

### Step 4: Build & Deploy
```bash
# Build Docker image
docker-compose build

# Start services
docker-compose up -d

# Tunggu ~30 detik sampai postgres siap
sleep 30

# Initialize database
docker-compose exec app npx prisma generate
docker-compose exec app npx prisma migrate deploy

# Optional: Seed data
docker-compose exec app npm run db:seed

# Verify semua berjalan
docker-compose ps
docker-compose logs -f app
```

### Step 5: Setup Backup Otomatis (Cron)
```bash
# Edit crontab
crontab -e

# Tambah baris untuk backup setiap hari jam 2 pagi:
0 2 * * * /var/www/pn-nangabulik/scripts/backup-database.sh >> /var/log/pn-backup.log 2>&1

# Untuk update otomatis setiap minggu (Minggu jam 3 pagi):
0 3 * * 0 cd /var/www/pn-nangabulik && git pull && docker-compose build && docker-compose up -d
```

---

## 🐳 Docker Architecture

```
┌─────────────────────────────────────┐
│        Browser / Client             │
└────────────────┬────────────────────┘
                 │ HTTPS (Port 443)
                 │
         ┌───────▼─────────┐
         │   Caddy         │
         │ (Reverse Proxy) │
         └───────┬─────────┘
                 │ HTTP (Port 3000)
         ┌───────▼──────────────┐
         │  Next.js App         │
         │  (Node.js)           │
         └───────┬──────────────┘
                 │ TCP (Port 5432)
         ┌───────▼──────────────┐
         │  PostgreSQL          │
         │  (Database)          │
         └──────────────────────┘
```

### Services:
1. **Caddy** (Port 80/443) - Reverse proxy dengan SSL otomatis
2. **Next.js App** (Port 3000) - Aplikasi utama
3. **PostgreSQL** (Port 5432) - Database

### Volumes:
- `postgres_data` - Data database
- `caddy_data` - SSL certificates
- `caddy_config` - Caddy config
- `./upload` - File uploads
- `./public` - Static files

---

## 📊 Monitoring & Maintenance

### Daily Tasks
```bash
# Check services
docker-compose ps

# View logs
docker-compose logs -f

# Monitor resources
docker stats
```

### Weekly Tasks
```bash
# Verify backup
ls -lh /var/backups/pn-nangabulik/

# Check disk space
df -h

# Check updates
cd /var/www/pn-nangabulik && git status
```

### Monthly Tasks
```bash
# Cleanup unused Docker objects
docker system prune -a --volumes

# Update all services
docker-compose build --pull
docker-compose up -d
```

---

## 🔐 Security Checklist

```bash
# ✅ Change credentials
- [ ] DATABASE_PASSWORD - buat password yang kuat
- [ ] NEXTAUTH_SECRET - generate dengan openssl rand -base64 32
- [ ] NEXTAUTH_URL - sesuaikan dengan domain

# ✅ File Permissions
- [ ] chmod 600 .env.production
- [ ] chown $USER:$USER .env.production

# ✅ Firewall Setup
- [ ] sudo ufw allow 22/tcp   (SSH)
- [ ] sudo ufw allow 80/tcp   (HTTP)
- [ ] sudo ufw allow 443/tcp  (HTTPS)
- [ ] sudo ufw enable

# ✅ SSH Hardening
- [ ] Disable root login
- [ ] Use SSH keys only
- [ ] Change SSH port (optional)

# ✅ Backup
- [ ] Setup automated backup
- [ ] Test restore procedure
- [ ] Store backup di tempat aman
```

---

## 🆘 Troubleshooting Quick Guide

### Server tidak response
```bash
# Check app logs
docker-compose logs app

# Check if container is running
docker-compose ps

# Restart services
docker-compose restart
```

### Database connection error
```bash
# Check database logs
docker-compose logs postgres

# Check if postgres is healthy
docker-compose exec postgres pg_isready

# Check DATABASE_URL
docker-compose exec app env | grep DATABASE_URL
```

### Port sudah terpakai
```bash
# Find process
sudo lsof -i :80
sudo lsof -i :443
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>
```

### Disk penuh
```bash
# Check usage
df -h

# Cleanup Docker
docker system prune -a --volumes

# Cleanup old logs
docker-compose logs --tail=0 -f
```

---

## 📚 Additional Resources

- **Full Deployment Guide:** [DOCKER-DEPLOYMENT.md](DOCKER-DEPLOYMENT.md)
- **Quick Commands:** [DOCKER-QUICK-REFERENCE.md](DOCKER-QUICK-REFERENCE.md)
- **Environment Template:** [.env.production.example](.env.production.example)

---

## 🎯 Next Steps

1. ✅ Review semua file yang telah dibuat
2. ✅ Test build di local machine (opsional)
3. ✅ Prepare VPS dengan Docker terinstall
4. ✅ Clone repository ke VPS
5. ✅ Setup .env.production dengan credentials
6. ✅ Run `docker-compose build && docker-compose up -d`
7. ✅ Initialize database
8. ✅ Setup backup cron
9. ✅ Monitor dan maintain

---

## 📞 Support Commands

```bash
# Deployment script help
./scripts/deploy-docker.sh help

# Check Docker installation  
./scripts/deploy-docker.sh check

# View app logs
./scripts/deploy-docker.sh logs

# Create database backup
./scripts/deploy-docker.sh backup

# Full update from Git
./scripts/deploy-docker.sh update
```

---

**Created:** 2026-03-02  
**Deployment Type:** Docker + Caddy + PostgreSQL  
**Next.js Output:** Standalone  

✨ **Siap untuk deployment di VPS!**
