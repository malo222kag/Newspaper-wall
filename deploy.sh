#!/bin/bash

# Newspaper Wall Deployment Script
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment of Newspaper Wall..."

# Configuration
PROJECT_DIR="/var/www/newspaper_wall"
VENV_DIR="$PROJECT_DIR/.venv"
BACKUP_DIR="/var/backups/newspaper_wall"
DATE=$(date +%Y%m%d_%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run this script as root"
    exit 1
fi

# Check if project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
    print_error "Project directory $PROJECT_DIR does not exist"
    exit 1
fi

print_status "Backing up current deployment..."
sudo mkdir -p "$BACKUP_DIR"
sudo tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" -C "$PROJECT_DIR" . 2>/dev/null || true

print_status "Stopping services..."
sudo systemctl stop newspaper-wall || true
sudo systemctl stop nginx || true

print_status "Updating code..."
cd "$PROJECT_DIR"
git pull origin main || git pull origin master

print_status "Activating virtual environment..."
source "$VENV_DIR/bin/activate"

print_status "Installing/updating dependencies..."
pip install -r requirements.txt

print_status "Running database migrations..."
python manage.py migrate --settings=newspaper_wall.settings_production

print_status "Collecting static files..."
python manage.py collectstatic --noinput --settings=newspaper_wall.settings_production

print_status "Creating necessary directories..."
sudo mkdir -p /var/log/gunicorn
sudo mkdir -p /var/run/gunicorn
sudo mkdir -p "$PROJECT_DIR/logs"
sudo mkdir -p "$PROJECT_DIR/media"

print_status "Setting permissions..."
sudo chown -R www-data:www-data "$PROJECT_DIR"
sudo chmod -R 755 "$PROJECT_DIR"
sudo chmod +x "$PROJECT_DIR/deploy.sh"

print_status "Starting services..."
sudo systemctl start newspaper-wall
sudo systemctl enable newspaper-wall
sudo systemctl start nginx

print_status "Checking service status..."
sleep 5
if systemctl is-active --quiet newspaper-wall; then
    print_status "✅ Newspaper Wall service is running"
else
    print_error "❌ Newspaper Wall service failed to start"
    sudo journalctl -u newspaper-wall --no-pager -l
    exit 1
fi

if systemctl is-active --quiet nginx; then
    print_status "✅ Nginx service is running"
else
    print_error "❌ Nginx service failed to start"
    sudo journalctl -u nginx --no-pager -l
    exit 1
fi

print_status "Testing application..."
if curl -f http://localhost/ > /dev/null 2>&1; then
    print_status "✅ Application is responding"
else
    print_warning "⚠️  Application might not be responding correctly"
fi

print_status "🎉 Deployment completed successfully!"
print_status "Application should be available at: http://your-domain.com"
print_status "Backup created at: $BACKUP_DIR/backup_$DATE.tar.gz"
