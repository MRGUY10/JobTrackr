# JobTrackr Docker Setup

Complete Docker setup with MySQL, phpMyAdmin, Backend (Laravel), and Frontend (React).

## Prerequisites

- Docker Desktop installed
- Docker Compose installed

## Quick Start

### 1. Start All Services

```bash
docker-compose up -d
```

This will start:
- **MySQL** on port 3306
- **phpMyAdmin** on http://localhost:8081
- **Backend API** on http://localhost:8080
- **Frontend** on http://localhost:5173

### 2. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **API Documentation**: http://localhost:8080/api/documentation
- **phpMyAdmin**: http://localhost:8081
  - Username: `root`
  - Password: `root_password_change_me`

### 3. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### 4. Stop Services

```bash
docker-compose down
```

### 5. Stop and Remove Everything (including data)

```bash
docker-compose down -v
```

## Database Management

### phpMyAdmin Access

1. Open http://localhost:8081
2. Login with:
   - Server: `mysql`
   - Username: `root`
   - Password: `root_password_change_me`
3. Database: `jobtrackr`

### Manual MySQL Access

```bash
# Connect to MySQL container
docker exec -it jobtrackr-mysql mysql -u root -p

# Enter password: root_password_change_me

# Then run SQL commands
USE jobtrackr;
SHOW TABLES;
```

### Reset Database

```bash
# Stop services
docker-compose down

# Remove MySQL data volume
docker volume rm jobtrackr_mysql_data

# Start services (fresh database)
docker-compose up -d
```

## Development

### Rebuild Containers

```bash
# Rebuild all
docker-compose build

# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Rebuild and restart
docker-compose up -d --build
```

### Update Backend Code

```bash
# Backend changes are not hot-reloaded
# Rebuild the container
docker-compose build backend
docker-compose up -d backend
```

### Update Frontend Code

```bash
# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
```

## Production Deployment

### 1. Update Environment Variables

Edit `docker-compose.yml` and change:
- MySQL passwords
- APP_KEY (generate with `php artisan key:generate --show`)
- Mail credentials
- Set `APP_DEBUG: "false"`

### 2. Use Production Domain

Update in `docker-compose.yml`:
```yaml
environment:
  APP_URL: https://yourdomain.com
  VITE_API_BASE_URL: https://yourdomain.com/api
```

### 3. Deploy to Server

```bash
# Copy files to server
scp -r . user@yourserver:/path/to/jobtrackr

# SSH to server
ssh user@yourserver

# Navigate to directory
cd /path/to/jobtrackr

# Start services
docker-compose up -d
```

### 4. Setup Reverse Proxy (Nginx/Apache)

Example Nginx config:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs backend

# Check if port is in use
netstat -ano | findstr :8080

# Restart container
docker-compose restart backend
```

### Database connection failed

```bash
# Check MySQL is running
docker ps | grep mysql

# Check MySQL logs
docker-compose logs mysql

# Wait for MySQL to be ready
docker-compose up -d mysql
# Wait 30 seconds
docker-compose up -d backend
```

### Reset everything

```bash
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

## Commands Reference

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart backend

# Execute command in container
docker-compose exec backend php artisan migrate

# Shell access
docker-compose exec backend sh
docker-compose exec mysql bash

# Check running containers
docker ps

# Check volumes
docker volume ls

# Check networks
docker network ls
```

## Ports

- 3306: MySQL
- 8080: Backend API
- 8081: phpMyAdmin
- 5173: Frontend

## Volumes

- `mysql_data`: Persistent MySQL data
- `backend_storage`: Backend storage files

## Security Notes

⚠️ **Before Production:**
1. Change all default passwords in `docker-compose.yml`
2. Generate new APP_KEY
3. Use strong MySQL root password
4. Enable SSL/HTTPS
5. Restrict phpMyAdmin access
6. Use environment file for sensitive data
