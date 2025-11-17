# Complete JobTrackr Deployment Guide
## Domain: isjpreenrollnow.me | IP: 4.178.35.142

This guide walks you through the complete deployment process from start to finish.

---

## 📋 Prerequisites Checklist

- [x] Azure VM running Ubuntu (IP: 4.178.35.142)
- [x] Domain name: isjpreenrollnow.me
- [ ] SSH access to VM
- [ ] Git repository cloned
- [ ] Docker and Docker Compose installed on VM

---

## Part 1: DNS Configuration (Do First)

### 1.1 Point Your Domain to Azure VM

Go to your domain registrar (where you bought isjpreenrollnow.me) and add these DNS records:

```
Type: A Record
Name: @
Value: 4.178.35.142
TTL: 3600 (or Auto)

Type: A Record  
Name: www
Value: 4.178.35.142
TTL: 3600 (or Auto)
```

**Wait 5-30 minutes** for DNS propagation. Test with:
```bash
ping isjpreenrollnow.me
```

---

## Part 2: VM Preparation

### 2.1 SSH into Your VM

```bash
ssh your-username@4.178.35.142
```

### 2.2 Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose -y

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y

# Install Node.js (for building frontend on VM if needed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# Log out and back in for docker group to take effect
exit
```

SSH back in:
```bash
ssh your-username@4.178.35.142
```

### 2.3 Clone Your Repository

```bash
cd ~
git clone https://github.com/MRGUY10/JobTrackr.git
cd JobTrackr
```

---

## Part 3: Backend Deployment (Docker Containers)

### 3.1 Start Backend Services

```bash
cd ~/JobTrackr

# Start MySQL, phpMyAdmin, and Laravel backend
docker-compose up -d mysql phpmyadmin backend

# Check if containers are running
docker ps

# View logs if needed
docker-compose logs -f backend
```

### 3.2 Verify Backend is Running

```bash
# Test backend API
curl http://localhost:8080/api/health

# Or from your local machine:
# curl http://4.178.35.142:8080/api/health
```

### 3.3 Run Database Migrations

```bash
# Enter backend container
docker exec -it jobtrackr-backend bash

# Inside container:
php artisan migrate --force
php artisan db:seed --force  # If you have seeders
php artisan storage:link
exit
```

---

## Part 4: Frontend Build and Deployment

### 4.1 Build Frontend on Your Local Machine (Windows)

On your Windows machine (where you have the code):

```powershell
cd E:\Project\JobTrackr
.\build-frontend.ps1
```

This creates optimized files in `frontend/dist/` with API pointing to `https://isjpreenrollnow.me/api`

### 4.2 Copy Frontend to VM

**Option A: Using SCP (from PowerShell on Windows)**
```powershell
scp -r frontend/dist/* your-username@4.178.35.142:/tmp/frontend/
```

**Option B: Using WinSCP or FileZilla**
- Connect to 4.178.35.142
- Upload entire `frontend/dist` folder contents to `/tmp/frontend/`

### 4.3 Move Files to Web Root on VM

SSH into VM:
```bash
ssh your-username@4.178.35.142

# Create web directory if needed
sudo mkdir -p /var/www/html

# Move frontend files
sudo rm -rf /var/www/html/*  # Clear old files
sudo cp -r /tmp/frontend/* /var/www/html/

# Set permissions
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

# Clean up
rm -rf /tmp/frontend
```

---

## Part 5: Nginx Configuration

### 5.1 Copy Nginx Config

```bash
cd ~/JobTrackr

# Copy nginx config
sudo cp nginx-frontend.conf /etc/nginx/sites-available/jobtrackr

# Create symbolic link
sudo ln -s /etc/nginx/sites-available/jobtrackr /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test nginx config
sudo nginx -t
```

### 5.2 Reload Nginx

```bash
sudo systemctl reload nginx
```

**Test HTTP access:**
- Open browser: `http://isjpreenrollnow.me`
- You should see your frontend (without SSL for now)

---

## Part 6: SSL Certificate Setup (Let's Encrypt)

### 6.1 Get Free SSL Certificate

```bash
# Run Certbot
sudo certbot --nginx -d isjpreenrollnow.me -d www.isjpreenrollnow.me
```

**Follow prompts:**
1. Enter your email address
2. Agree to terms (Y)
3. Choose to redirect HTTP to HTTPS (option 2 - recommended)

### 6.2 Verify SSL

Open browser: `https://isjpreenrollnow.me`

You should see:
- 🔒 Secure connection (padlock icon)
- Your JobTrackr application
- No mixed content warnings

### 6.3 Auto-Renewal Test

```bash
# Test renewal (dry run)
sudo certbot renew --dry-run

# Auto-renewal is already set up via cron
```

---

## Part 7: Configure Firewall

### 7.1 Azure Network Security Group

In Azure Portal:
1. Go to your VM → Networking
2. Add inbound port rules:
   - **Port 80** (HTTP) - Allow
   - **Port 443** (HTTPS) - Allow
   - **Port 8080** (Backend API) - Allow from localhost only
   - **Port 3306** (MySQL) - Deny from internet
   - **Port 8081** (phpMyAdmin) - Allow (or restrict to your IP)

### 7.2 Ubuntu Firewall (UFW)

```bash
# Enable firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 8080
sudo ufw allow 8081
sudo ufw enable
sudo ufw status
```

---

## Part 8: Verification & Testing

### 8.1 Check All Services

```bash
# Check Docker containers
docker ps

# Expected containers:
# - jobtrackr-mysql
# - jobtrackr-phpmyadmin
# - jobtrackr-backend

# Check Nginx
sudo systemctl status nginx

# Check SSL certificate
sudo certbot certificates
```

### 8.2 Test Application

1. **Frontend:** https://isjpreenrollnow.me
   - Should load with HTTPS
   - No console errors

2. **API:** https://isjpreenrollnow.me/api/health
   - Should return JSON response

3. **Register a test account**
   - Go to: https://isjpreenrollnow.me/register
   - Create account
   - Check email for verification

4. **phpMyAdmin:** http://4.178.35.142:8081
   - Login with MySQL credentials from docker-compose.yml
   - User: `jobtrackr_user`
   - Password: `jobtrackr_password`

---

## Part 9: Update Backend Environment (If Needed)

### 9.1 Update Laravel .env in Container

```bash
# Enter backend container
docker exec -it jobtrackr-backend bash

# Edit .env file
nano .env
```

Key settings to verify:
```env
APP_URL=https://isjpreenrollnow.me
FRONTEND_URL=https://isjpreenrollnow.me
SANCTUM_STATEFUL_DOMAINS=isjpreenrollnow.me,www.isjpreenrollnow.me
```

```bash
# Clear cache after changes
php artisan config:clear
php artisan cache:clear
exit
```

---

## Part 10: Maintenance Commands

### 10.1 View Logs

```bash
# Docker container logs
docker-compose logs -f backend
docker-compose logs -f mysql

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Laravel logs (from inside container)
docker exec -it jobtrackr-backend tail -f storage/logs/laravel.log
```

### 10.2 Restart Services

```bash
# Restart all containers
docker-compose restart

# Restart specific container
docker-compose restart backend

# Restart Nginx
sudo systemctl restart nginx
```

### 10.3 Update Application

```bash
cd ~/JobTrackr

# Pull latest code
git pull origin main

# Restart backend
docker-compose down
docker-compose up -d mysql phpmyadmin backend

# Run migrations if needed
docker exec -it jobtrackr-backend php artisan migrate --force

# Rebuild and redeploy frontend (on local machine)
# Then copy to VM as described in Part 4
```

---

## Part 11: Troubleshooting

### Frontend Issues

**Problem:** Frontend shows blank page
```bash
# Check nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check file permissions
ls -la /var/www/html

# Should see index.html
```

**Problem:** API calls failing (CORS errors)
- Check browser console (F12)
- Verify `CORS_ALLOWED_ORIGINS` in docker-compose.yml includes your domain
- Restart backend: `docker-compose restart backend`

### Backend Issues

**Problem:** 502 Bad Gateway
```bash
# Check if backend is running
docker ps | grep backend

# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

**Problem:** Database connection errors
```bash
# Check MySQL container
docker ps | grep mysql

# Check MySQL logs
docker-compose logs mysql

# Wait for MySQL to be ready (check health)
docker inspect jobtrackr-mysql | grep Health
```

### SSL Issues

**Problem:** Certificate not working
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew --force-renewal

# Check nginx SSL config
sudo nginx -t
```

---

## Part 12: Backup Strategy

### 12.1 Database Backup

```bash
# Create backup script
cat > ~/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec jobtrackr-mysql mysqldump -u jobtrackr_user -pjobtrackr_password jobtrackr > ~/backups/db_backup_$DATE.sql
# Keep only last 7 days
find ~/backups -name "db_backup_*.sql" -mtime +7 -delete
EOF

chmod +x ~/backup-db.sh

# Create backups directory
mkdir -p ~/backups

# Test backup
./backup-db.sh

# Schedule daily backup (add to crontab)
crontab -e
# Add line:
# 0 2 * * * /home/your-username/backup-db.sh
```

### 12.2 Files Backup

```bash
# Backup uploaded files (documents)
docker cp jobtrackr-backend:/var/www/html/storage ~/backups/storage_backup_$(date +%Y%m%d)
```

---

## Part 13: Performance Optimization

### 13.1 Laravel Optimization

```bash
docker exec -it jobtrackr-backend bash

# Inside container:
php artisan config:cache
php artisan route:cache
php artisan view:cache
exit
```

### 13.2 Enable Gzip in Nginx

Already configured in `nginx-frontend.conf`, verify:
```bash
sudo nginx -t
```

---

## Summary Checklist

- [ ] DNS pointing to VM
- [ ] Docker containers running (mysql, backend, phpmyadmin)
- [ ] Frontend built and deployed to /var/www/html
- [ ] Nginx configured and running
- [ ] SSL certificate installed and working
- [ ] Firewall configured
- [ ] Application accessible at https://isjpreenrollnow.me
- [ ] API accessible at https://isjpreenrollnow.me/api
- [ ] Test user registration and login working
- [ ] Email notifications working
- [ ] Backups configured

---

## Quick Reference

### Useful URLs
- **Frontend:** https://isjpreenrollnow.me
- **API:** https://isjpreenrollnow.me/api
- **phpMyAdmin:** http://4.178.35.142:8081

### Important Paths
- **Frontend files:** `/var/www/html`
- **Nginx config:** `/etc/nginx/sites-available/jobtrackr`
- **Project directory:** `~/JobTrackr`
- **SSL certificates:** `/etc/letsencrypt/live/isjpreenrollnow.me/`

### Key Commands
```bash
# View running containers
docker ps

# Restart backend
docker-compose restart backend

# View backend logs
docker-compose logs -f backend

# Restart Nginx
sudo systemctl restart nginx

# Renew SSL
sudo certbot renew

# Update application
cd ~/JobTrackr && git pull && docker-compose restart
```

---

## Need Help?

1. Check logs first (Part 10.1)
2. Review troubleshooting section (Part 11)
3. Verify all services are running: `docker ps` and `sudo systemctl status nginx`
4. Check DNS: `ping isjpreenrollnow.me`
5. Test API directly: `curl https://isjpreenrollnow.me/api/health`

Good luck with your deployment! 🚀
