# Docker Deployment Quick Reference

## 📋 Quick Start

```bash
# 1. Clone & setup
git clone <repo-url>
cd pn-nangabulik

# 2. Create environment file
cp .env.production.example .env.production
# Edit .env.production dengan nilai yang sesuai

# 3. Build & Start
docker-compose build
docker-compose up -d

# 4. Initialize database
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npm run db:seed  # jika ada

# 5. Verify
docker-compose ps
docker-compose logs app
```

## 🚀 Common Commands

### Monitoring
```bash
# Check services status
docker-compose ps

# View logs real-time
docker-compose logs -f
docker-compose logs -f app        # app only
docker-compose logs -f postgres   # database only
docker-compose logs -f caddy      # reverse proxy only

# Health check
docker-compose exec app curl http://localhost:3000

# Resource usage
docker stats
```

### Maintenance
```bash
# Restart services
docker-compose restart

# Restart specific service
docker-compose restart app
docker-compose restart caddy

# Stop all services
docker-compose down

# Stop & remove volumes (⚠️ DANGER - data loss!)
docker-compose down -v
```

### File Management
```bash
# Backup upload directory
tar -czf upload_backup.tar.gz ./upload

# Restore upload directory
tar -xzf upload_backup.tar.gz
```

### Updates & Deployment
```bash
# Pull latest code
git pull origin main

# Rebuild image
docker-compose build

# Restart with new image
docker-compose up -d

# Or one-liner for full update
git pull origin main && docker-compose build && docker-compose up -d
```

### Troubleshooting
```bash
# Check if ports are available
lsof -i :80
lsof -i :443
lsof -i :3000
lsof -i :5432

# Rebuild without cache
docker-compose build --no-cache

# Remove unused Docker objects
docker system prune -a --volumes

# View environment variables in container
docker-compose exec app env

# Execute custom command in container
docker-compose exec app npm list

# SSH into container
docker-compose exec app /bin/sh
```

### Using Deploy Script

```bash
# Make script executable
chmod +x scripts/deploy-docker.sh

# View all available commands
./scripts/deploy-docker.sh help

# Check Docker installation
./scripts/deploy-docker.sh check

# Build & Start
./scripts/deploy-docker.sh build
./scripts/deploy-docker.sh start

# View status & logs
./scripts/deploy-docker.sh status
./scripts/deploy-docker.sh logs

# Backup upload files
./scripts/deploy-docker.sh backup

# Update aplikasi
./scripts/deploy-docker.sh update

# Cleanup
./scripts/deploy-docker.sh cleanup
```

## 🔐 Security Checklist

```bash
# Generate secure secrets
openssl rand -base64 32  # NEXTAUTH_SECRET
openssl rand -base64 32  # DATABASE_PASSWORD

# Set proper file permissions
chmod 600 .env.production
chown $USER:$USER .env.production

# Change PostgreSQL password in .env.production
# Update NEXTAUTH_URL dan NEXTAUTH_SECRET

# Setup firewall (UFW)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Disable root SSH login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
# Set: PasswordAuthentication no
# Restart: sudo systemctl restart sshd
```

## 📊 Useful Docker Commands

```bash
# Image management
docker images                    # List images
docker rmi <image-id>           # Remove image
docker pull <image>             # Pull image

# Container management
docker ps -a                     # List all containers
docker inspect <container>       # Get container details
docker logs -f <container>      # View logs with follow

# Volume management
docker volume ls                 # List volumes
docker volume inspect <name>     # Volume details
docker volume prune              # Remove unused volumes

# Network management
docker network ls                # List networks
docker network inspect <name>    # Network details
```

## 🆘 Emergency Recovery

```bash
# If app won't start
docker-compose logs app               # Check error logs
docker-compose exec app npm run build # Try rebuild

# If disk is full
docker system prune -a --volumes -f  # Delete all unused
df -h                                  # Check space
```

## 📝 Cron Jobs Setup

### Daily backup at 2 AM
```bash
# Edit crontab
crontab -e

# Add line (backup upload files):
0 2 * * * /var/www/pn-nangabulik/scripts/backup-docker.sh >> /var/log/backup.log 2>&1

# Verify
crontab -l
```

### Weekly update at Sunday 3 AM
```bash
# Add to crontab:
0 3 * * 0 cd /var/www/pn-nangabulik && git pull origin main && docker-compose build && docker-compose up -d
```

## 🔗 Useful Links

- **Docker Docs:** https://docs.docker.com/
- **Docker Compose:** https://docs.docker.com/compose/
- **Caddy Docs:** https://caddyserver.com/
- **Prisma Docs:** https://www.prisma.io/docs/
- **Next.js:** https://nextjs.org/docs/
- **PostgreSQL:** https://www.postgresql.org/docs/

## 📞 Support

For issues:
1. Check logs: `docker-compose logs -f`
2. Check disk space: `df -h`
3. Check memory: `free -h`
4. Restart services: `docker-compose restart`
5. Check Docker status: `docker ps`

---

**Pro Tips:**
- Always backup before updates
- Monitor disk space regularly
- Keep logs for debugging
- Use `.env.production` for secrets (never commit!)
- Test changes on staging first

**Last Updated:** 2026-03-02
