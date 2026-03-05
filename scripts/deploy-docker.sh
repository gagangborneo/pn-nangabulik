#!/bin/bash

# Docker Deployment Script untuk VPS
# Usage: chmod +x scripts/deploy-docker.sh && ./scripts/deploy-docker.sh [action]

set -e

COLOR_RESET='\033[0m'
COLOR_GREEN='\033[0;32m'
COLOR_RED='\033[0;31m'
COLOR_YELLOW='\033[1;33m'
COLOR_BLUE='\033[0;34m'

PROJECT_NAME="pn-nangabulik"
APP_DIR="/var/www/$PROJECT_NAME"

log_info() {
    echo -e "${COLOR_BLUE}[INFO]${COLOR_RESET} $1"
}

log_success() {
    echo -e "${COLOR_GREEN}[SUCCESS]${COLOR_RESET} $1"
}

log_error() {
    echo -e "${COLOR_RED}[ERROR]${COLOR_RESET} $1"
}

log_warning() {
    echo -e "${COLOR_YELLOW}[WARNING]${COLOR_RESET} $1"
}

# Check if docker-compose exists
check_docker() {
    if ! command -v docker-compose &> /dev/null; then
        log_error "docker-compose tidak terinstall. Silakan install Docker dan Docker Compose."
        exit 1
    fi
    log_success "Docker dan Docker Compose terdeteksi"
}

# Build Docker image
build() {
    log_info "Membangun Docker image..."
    cd $APP_DIR
    docker-compose build --no-cache
    log_success "Docker image berhasil dibangun"
}

# Start services
start() {
    log_info "Memulai services..."
    cd $APP_DIR
    docker-compose up -d
    
    log_info "Menunggu services siap (15 detik)..."
    sleep 15
    
    log_success "Services berhasil dijalankan"
    docker-compose ps
}

# Check status
status() {
    log_info "Status services:"
    cd $APP_DIR
    docker-compose ps
}

# View logs
logs() {
    log_info "Menampilkan logs (Ctrl+C untuk exit)..."
    cd $APP_DIR
    docker-compose logs -f
}

# Restart services
restart() {
    log_info "Restart services..."
    cd $APP_DIR
    docker-compose restart
    log_success "Services berhasil di-restart"
    docker-compose ps
}

# Stop services
stop() {
    log_info "Menghentikan services..."
    cd $APP_DIR
    docker-compose down
    log_success "Services berhasil dihentikan"
}

# Backup upload files
backup() {
    BACKUP_DIR="/var/backups/$PROJECT_NAME"
    mkdir -p $BACKUP_DIR
    
    log_info "Backup upload files ke $BACKUP_DIR..."
    cd $APP_DIR
    
    if [ -d "./upload" ]; then
        BACKUP_FILE="$BACKUP_DIR/upload_$(date +%Y%m%d_%H%M%S).tar.gz"
        tar -czf "$BACKUP_FILE" ./upload
        
        log_success "Backup selesai: $BACKUP_FILE"
        
        # Cleanup old backups (>7 days)
        log_info "Membersihkan backup lama..."
        find $BACKUP_DIR -name "upload_*.tar.gz" -mtime +7 -delete
        
        log_info "Backup available:"
        ls -lh $BACKUP_DIR
    else
        log_warning "Upload directory tidak ditemukan"
    fi
}

# Update aplikasi
update() {
    log_warning "Update aplikasi. Pastikan ada backup terbaru!"
    read -p "Lanjutkan? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd $APP_DIR
        
        log_info "Pull latest code..."
        git pull origin main --quiet
        
        log_info "Build Docker image..."
        docker-compose build --no-cache
        
        log_info "Restart services..."
        docker-compose up -d
        
        log_info "Menunggu services siap..."
        sleep 30
        
        log_success "Aplikasi berhasil di-update"
        docker-compose ps
    else
        log_warning "Update dibatalkan"
    fi
}

# Clean up
cleanup() {
    read -p "Hapus unused Docker objects? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Cleaning up Docker..."
        docker system prune -a --volumes -f
        log_success "Cleanup selesai"
    fi
}

# Show help
show_help() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Available commands:"
    echo "  check      - Check Docker installation"
    echo "  build      - Build Docker image"
    echo "  start      - Start services (docker-compose up -d)"
    echo "  status     - Show services status"
    echo "  logs       - View real-time logs"
    echo "  restart    - Restart services"
    echo "  stop       - Stop services (docker-compose down)"
    echo "  backup     - Backup upload files"
    echo "  update     - Update aplikasi dari Git"
    echo "  cleanup    - Clean unused Docker objects"
    echo "  help       - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 check"
    echo "  $0 build && $0 start"
    echo "  $0 logs"
}

# Main
main() {
    case "$1" in
        check)
            check_docker
            ;;
        build)
            check_docker
            build
            ;;
        start)
            check_docker
            start
            ;;
        status)
            status
            ;;
        logs)
            logs
            ;;
        restart)
            restart
            ;;
        stop)
            stop
            ;;
        backup)
            backup
            ;;
        update)
            update
            ;;
        cleanup)
            cleanup
            ;;
        help|--help|-h|"")
            show_help
            ;;
        *)
            log_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

main "$1"
