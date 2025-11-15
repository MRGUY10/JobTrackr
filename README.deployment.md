# JobTrackr Deployment Guide - Render with Docker

## Prerequisites
- GitHub account
- Render account (https://render.com)
- PostgreSQL database already created on Render

## Deployment Steps

### 1. Prepare Your Repository

Make sure all files are committed and pushed to GitHub:

```bash
git add .
git commit -m "Add Docker deployment configuration"
git push origin main
```

### 2. Deploy on Render

#### Option A: Using render.yaml (Blueprint - Recommended)

1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository `MRGUY10/JobTrackr`
4. Render will automatically detect the `render.yaml` file
5. Review the configuration and click **"Apply"**
6. Wait for the deployment to complete (5-10 minutes)

#### Option B: Manual Setup

1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository `MRGUY10/JobTrackr`
4. Configure the following:
   - **Name**: `jobtrackr`
   - **Region**: `Oregon (US West)`
   - **Branch**: `main`
   - **Runtime**: `Docker`
   - **Instance Type**: `Free`

5. Add Environment Variables (click "Advanced" → "Add Environment Variable"):
   ```
   APP_NAME=JobTrackr
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://jobtrackr.onrender.com
   APP_KEY=base64:YOUR_APP_KEY_HERE
   
   DB_CONNECTION=pgsql
   DB_HOST=dpg-d4cdu0a4d50c73d519r0-a.oregon-postgres.render.com
   DB_PORT=5432
   DB_DATABASE=jobtrackr_8jpn
   DB_USERNAME=jobtrackr_8jpn_user
   DB_PASSWORD=B6vbgGyjzJTvJNIj2Dpy0hhdPCS01puz
   
   SESSION_DRIVER=database
   QUEUE_CONNECTION=database
   CACHE_STORE=database
   
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=kamdem.guy@institutsaintjean.org
   MAIL_PASSWORD=osurrusawvgooxam
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS=kamdem.guy@institutsaintjean.org
   MAIL_FROM_NAME=JobTrackr
   
   FRONTEND_URL=https://jobtrackr.onrender.com
   SANCTUM_STATEFUL_DOMAINS=jobtrackr.onrender.com
   SESSION_DOMAIN=.jobtrackr.onrender.com
   ```

6. Click **"Create Web Service"**

### 3. Generate APP_KEY

If you need to generate a new APP_KEY:

```bash
cd backend
php artisan key:generate --show
```

Copy the output and add it to your Render environment variables.

### 4. Post-Deployment

1. Your app will be available at: `https://jobtrackr.onrender.com`
2. The Docker container will automatically:
   - Run database migrations
   - Cache configurations
   - Start PHP-FPM, Nginx, and Queue Worker
3. Check logs in Render dashboard if there are any issues

### 5. Custom Domain (Optional)

To use a custom domain:

1. Go to your service settings in Render
2. Click "Custom Domains"
3. Add your domain (e.g., `jobtrackr.com`)
4. Update DNS records as instructed
5. Update environment variables:
   - `APP_URL=https://yourdomain.com`
   - `FRONTEND_URL=https://yourdomain.com`
   - `SANCTUM_STATEFUL_DOMAINS=yourdomain.com`
   - `SESSION_DOMAIN=.yourdomain.com`

## Docker Architecture

The deployment uses a multi-stage Docker build:

1. **Stage 1**: Builds React frontend with Node.js
2. **Stage 2**: Sets up PHP-FPM with Laravel backend and serves the built frontend

The container runs:
- **Nginx** (web server on port 8080)
- **PHP-FPM** (processes PHP requests)
- **Queue Worker** (processes background jobs)

All managed by Supervisor for automatic restarts.

## Troubleshooting

### Check Logs
```bash
# In Render dashboard, go to your service → Logs
```

### Common Issues

1. **Database Connection Failed**
   - Verify database credentials in environment variables
   - Ensure PostgreSQL database is running on Render

2. **500 Internal Server Error**
   - Check if APP_KEY is set
   - Review application logs in Render dashboard

3. **CORS Errors**
   - Verify FRONTEND_URL and SANCTUM_STATEFUL_DOMAINS match your domain

4. **Build Failed**
   - Check Dockerfile syntax
   - Ensure all required files are committed to repository

## Updating the Application

To deploy updates:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Render will automatically rebuild and redeploy your application.

## Free Tier Limitations

Render free tier includes:
- 750 hours per month
- Service spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds

For production, consider upgrading to a paid plan for:
- 24/7 uptime
- Faster performance
- More resources

## Support

For issues or questions:
- Render Documentation: https://render.com/docs
- Laravel Documentation: https://laravel.com/docs
- React Documentation: https://react.dev
