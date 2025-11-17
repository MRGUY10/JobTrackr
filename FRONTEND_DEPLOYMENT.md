# JobTrackr Frontend Deployment Guide

## Building the Frontend for Production

The frontend is no longer running in a container. Instead, build it and deploy to your web server with SSL.

### Option 1: Build on Windows (PowerShell)

```powershell
.\build-frontend.ps1
```

### Option 2: Build on Linux/VM (Bash)

```bash
chmod +x build-frontend.sh
./build-frontend.sh
```

### Option 3: Manual Build

```bash
cd frontend
npm ci
VITE_API_BASE_URL=https://4.178.35.142/api npm run build
```

The build output will be in `frontend/dist/`

## Deploying to Your VM

### Step 1: Copy Build Files to VM

From your local machine:

```bash
scp -r frontend/dist/* your-user@4.178.35.142:/var/www/html/
```

Or use WinSCP/FileZilla to copy the `frontend/dist` contents to `/var/www/html/`

### Step 2: Configure Nginx on VM

Copy the nginx configuration:

```bash
sudo cp nginx-frontend.conf /etc/nginx/sites-available/jobtrackr
sudo ln -s /etc/nginx/sites-available/jobtrackr /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default site
```

Test and reload nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 3: Configure SSL with Certbot

Install Certbot (if not already installed):

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

Get SSL certificate:

```bash
# If you have a domain name:
sudo certbot --nginx -d yourdomain.com

# For IP-based SSL (self-signed):
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/nginx-selfsigned.key \
  -out /etc/ssl/certs/nginx-selfsigned.crt
```

Update nginx config to use SSL:

```nginx
server {
    listen 443 ssl http2;
    server_name 4.178.35.142;
    
    ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;
    
    # ... rest of config from nginx-frontend.conf
}

server {
    listen 80;
    server_name 4.178.35.142;
    return 301 https://$server_name$request_uri;
}
```

## Running Docker Containers

After frontend deployment, only run backend containers:

```bash
docker-compose up -d mysql phpmyadmin backend
```

## Update Frontend API URL

If you change domains or SSL settings, update the API URL:

1. Edit `build-frontend.ps1` or `build-frontend.sh`
2. Change `API_URL` to your new URL (e.g., `https://yourdomain.com/api`)
3. Rebuild and redeploy

## Troubleshooting

### Frontend shows connection errors
- Check API URL in browser console
- Verify backend CORS settings allow your domain
- Check nginx proxy configuration for `/api` location

### SSL certificate errors
- Use `sudo certbot renew --dry-run` to test renewal
- Check certificate paths in nginx config

### Static files not loading
- Check file permissions: `sudo chown -R www-data:www-data /var/www/html`
- Verify nginx is serving from correct directory
