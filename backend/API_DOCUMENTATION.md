# JobTrackr API Documentation

## Accessing API Documentation

The API documentation is available via Swagger UI at:

**URL:** [http://localhost:8000/api/documentation](http://localhost:8000/api/documentation)

### Prerequisites
1. Start the Laravel development server:
   ```bash
   php artisan serve
   ```

2. Access the Swagger UI in your browser at the URL above

### Authentication

Most endpoints require authentication using Bearer tokens. To authenticate:

1. **Register a new user** via `POST /api/auth/register`
2. **Login** via `POST /api/auth/login` to get your access token
3. Click the **"Authorize"** button in Swagger UI
4. Enter your token in the format: `Bearer YOUR_TOKEN_HERE`
5. Click **"Authorize"** and then **"Close"**

Now you can test protected endpoints!

### Regenerating Documentation

After adding new API endpoints or modifying existing ones, regenerate the Swagger docs:

```bash
php artisan l5-swagger:generate
```

## Available API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get access token
- `POST /api/auth/logout` - Logout (revoke token)
- `GET /api/auth/user` - Get authenticated user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/email/verify/{id}/{hash}` - Verify email address
- `POST /api/auth/email/resend` - Resend verification email

### Profile Management
- `GET /api/profile` - Get user profile with relationships
- `PUT /api/profile` - Update profile information
- `DELETE /api/profile` - Delete user account
- `POST /api/profile/avatar` - Upload avatar image
- `POST /api/profile/cv` - Upload CV document

### Applications
- `GET /api/applications` - List all applications (with filtering)
- `POST /api/applications` - Create new application
- `GET /api/applications/{id}` - Get specific application
- `PUT /api/applications/{id}` - Update application (including interview details)
- `DELETE /api/applications/{id}` - Delete application

### Calendar & Interviews
- `GET /api/calendar/events` - Get calendar events (interviews and deadlines)
- `GET /api/calendar/interviews` - Get upcoming interviews

### Documents
- `GET /api/applications/{id}/documents` - List application documents
- `POST /api/applications/{id}/documents` - Upload document
- `GET /api/documents/{id}/download` - Download document
- `DELETE /api/documents/{id}` - Delete document

### Notifications
- `GET /api/notifications` - List all notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/{id}/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/{id}` - Delete notification

### Statistics
- `GET /api/stats/overview` - Get overview statistics
- `GET /api/stats/monthly` - Get monthly statistics
- `GET /api/stats/by-status` - Get applications by status
- `GET /api/stats/top-companies` - Get top companies
- `GET /api/stats/recent-activity` - Get recent activity

### Job Postings (Public)
- `GET /api/job-postings` - Get all job postings (no auth required)

### Admin Routes (Admin only)
- `GET /api/admin/dashboard` - Admin dashboard statistics
- `GET /api/admin/users` - List all users
- `GET /api/admin/applications` - List all applications
- `GET /api/admin/job-postings` - List job postings (admin view)
- `POST /api/admin/job-postings` - Create job posting
- `PUT /api/admin/job-postings/{id}` - Update job posting
- `DELETE /api/admin/job-postings/{id}` - Delete job posting

## Response Format

All API responses follow this structure:

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "message": "Error message",
  "errors": {
    "field": ["Validation error message"]
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

## Testing with Postman

You can also import the OpenAPI specification into Postman:

1. Get the JSON spec: [http://localhost:8000/docs/api-docs.json](http://localhost:8000/docs/api-docs.json)
2. In Postman, click **Import** → **Link** → paste the URL
3. Postman will create a collection with all endpoints

## Next Steps

Continue with Phase 4 to implement:
- Application CRUD endpoints
- Document management
- AI job analyzer
- Dashboard statistics
