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
