# Notification System Documentation

## Overview
JobTrackr has a comprehensive notification system that automatically notifies users about important events related to their job applications. Notifications are sent both in-app and via email.

## Notification Types

### 1. **application_status_changed**
- **Trigger**: When an application status changes
- **Email**: ✅ Yes
- **Contains**: Old status, new status, company, position
- **Example**: "Your application at Google has moved to Interview stage"

### 2. **interview_scheduled**
- **Trigger**: When an interview date is set on an application
- **Email**: ✅ Yes
- **Contains**: Interview date/time, company, position, interview tips
- **Example**: "You have an interview scheduled with Microsoft on Jan 15, 2025 at 10:00 AM"

### 3. **interview_reminder**
- **Trigger**: Automatically sent 1 day before interview (via scheduled task)
- **Email**: ✅ Yes
- **Contains**: Interview date/time, company, position, reminder tips
- **Example**: "Reminder: Your interview with Apple is tomorrow at 2:00 PM"

### 4. **document_uploaded**
- **Trigger**: When a user uploads a document to an application
- **Email**: ❌ No (in-app only)
- **Contains**: Document type, file name, application details
- **Example**: "You uploaded your CV for the Software Engineer position at Amazon"

### 5. **application_created**
- **Trigger**: When a new application is submitted
- **Email**: ✅ Yes (confirmation)
- **Contains**: Company, position, application date
- **Example**: "Application successfully submitted for Senior Developer at Meta"

### 6. **application_deadline_approaching**
- **Trigger**: Automatically sent 3 days before deadline (via scheduled task)
- **Email**: ✅ Yes
- **Contains**: Days remaining, company, position
- **Example**: "Deadline approaching: 3 days left to complete your application at Netflix"

### 7. **follow_up_reminder**
- **Trigger**: Automatically sent 7 days after applying if still in "Applied" status (via scheduled task)
- **Email**: ✅ Yes
- **Contains**: Days since applied, company, position, follow-up suggestions
- **Example**: "It's been 7 days since you applied to Tesla. Consider following up!"

### 8. **job_posting_new**
- **Trigger**: When new job postings are added that match user profile
- **Email**: ✅ Yes (if user opted in)
- **Contains**: Job title, company, location, requirements
- **Example**: "New job posting: Senior React Developer at Stripe"

### 9. **system**
- **Trigger**: System-wide notifications (maintenance, updates, etc.)
- **Email**: ❌ No (in-app only)
- **Contains**: System message
- **Example**: "JobTrackr will undergo maintenance tonight from 2-4 AM EST"

### 10. **general**
- **Trigger**: Manual notifications from admin or general updates
- **Email**: ✅ Yes
- **Contains**: Custom title and message
- **Example**: "Welcome to JobTrackr! Here's how to get started..."

## Backend Architecture

### Database Schema
```sql
notifications table:
- id (primary key)
- user_id (foreign key)
- title (string)
- message (text)
- type (enum: 10 notification types)
- metadata (JSON - stores additional data like old_status, new_status, interview_date, etc.)
- email_sent (boolean - tracks if email was sent)
- related_type (string - polymorphic relation type, e.g., 'Application')
- related_id (integer - polymorphic relation ID)
- action_url (string - deep link to related resource in frontend)
- read_at (timestamp - null if unread)
- created_at, updated_at
```

### NotificationService (`app/Services/NotificationService.php`)
Central service for creating and sending notifications:

#### Key Methods:
```php
// Application lifecycle notifications
NotificationService::applicationCreated($application)
NotificationService::applicationStatusChanged($application, $oldStatus)
NotificationService::interviewScheduled($application)
NotificationService::interviewReminder($application)
NotificationService::deadlineApproaching($application, $daysRemaining)
NotificationService::followUpReminder($application, $daysSinceApplied)
NotificationService::documentUploaded($application, $document)

// Job and general notifications
NotificationService::newJobPosting($user, $jobPosting)
NotificationService::createGeneral($user, $title, $message, $actionUrl = null)
NotificationService::createSystem($user, $title, $message)

// Batch notifications
NotificationService::sendBatch($users, $title, $message, $type, $metadata = [])
```

### Email Templates
Located in `resources/views/emails/`:

1. **application-status-changed.blade.php** (HTML)
   - Status badges showing old → new transition
   - Company and position details
   - "View Application" button

2. **application-status-changed-text.blade.php** (Plain text fallback)

3. **interview-scheduled.blade.php** (HTML)
   - Highlighted interview date/time box
   - Company and position details
   - Interview preparation tips
   - "View Application Details" button

4. **interview-scheduled-text.blade.php** (Plain text fallback)

5. **deadline-reminder.blade.php** (HTML)
   - Reminder alert box
   - Days remaining counter
   - Application details
   - "View Application" button

6. **deadline-reminder-text.blade.php** (Plain text fallback)

7. **general-notification.blade.php** (HTML)
   - Clean, simple design
   - Dynamic title and message
   - Optional action button

8. **general-notification-text.blade.php** (Plain text fallback)

### Automatic Notification Triggers

#### In Controllers:
- **ApplicationController@store**: Sends `application_created` notification
- **ApplicationController@update**: Sends `application_status_changed` or `interview_scheduled` based on changes
- **DocumentController@store**: Sends `document_uploaded` notification

#### Scheduled Commands:
Run `php artisan notifications:send-reminders` daily at 9 AM via Laravel scheduler.

This command automatically:
1. Sends interview reminders for interviews happening tomorrow
2. Sends deadline warnings for deadlines approaching in 3 days
3. Sends follow-up reminders for applications 7 days after submission

To enable scheduled commands, add to your cron:
```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

Or manually run:
```bash
php artisan notifications:send-reminders
```

## Frontend Integration

### NotificationService (`src/services/notificationService.js`)
Frontend service for API interactions:

```javascript
import notificationService from '../services/notificationService';

// Get all notifications
const { data } = await notificationService.getAllNotifications();

// Get unread count
const { count } = await notificationService.getUnreadCount();

// Mark as read
await notificationService.markAsRead(notificationId);

// Mark all as read
await notificationService.markAllAsRead();

// Delete notification
await notificationService.deleteNotification(notificationId);

// Get notification styling (icon, colors)
const style = notificationService.getNotificationStyle('interview_scheduled');
// Returns: { icon: '📅', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' }

// Format notification time
const timeAgo = notificationService.formatNotificationTime(notification.created_at);
// Returns: "2 hours ago", "Just now", "3 days ago", etc.
```

### NotificationsPage
Full-featured notifications page at `/notifications`:
- Real-time notification list with 10 notification types
- Filter by all/unread/read
- Search notifications
- Mark individual/all as read
- Delete notifications
- Visual indicators (emoji icons, colors, unread badges)
- Email sent indicator
- Action buttons with deep links
- Statistics footer

## Email Configuration

### Setup Gmail SMTP
In `.env` file:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"

# Frontend URL for deep links in emails
APP_FRONTEND_URL=http://localhost:5175
```

**Important**: Use App Password, not regular Gmail password. Generate at:
https://myaccount.google.com/apppasswords

### Email Features
- ✅ Professional HTML templates with inline CSS
- ✅ Plain text fallbacks for email clients that don't support HTML
- ✅ Branded with JobTrackr logo and gradient colors
- ✅ Responsive design
- ✅ Deep links to frontend application pages
- ✅ Error handling with logging
- ✅ Email sent tracking in database

## Testing Notifications

### Manual Testing:
```php
// In tinker (php artisan tinker)
$user = User::first();
$application = $user->applications()->first();

// Test status change
NotificationService::applicationStatusChanged($application, 'Applied');

// Test interview scheduled
NotificationService::interviewScheduled($application);

// Test document upload
$document = $application->documents()->first();
NotificationService::documentUploaded($application, $document);

// Test general notification
NotificationService::createGeneral($user, 'Test Notification', 'This is a test message.', '/dashboard');
```

### Test Scheduled Reminders:
```bash
# Run manually to test
php artisan notifications:send-reminders
```

### Check Notification API:
```bash
# Get all notifications (requires auth token)
GET http://localhost:8000/api/notifications

# Get unread count
GET http://localhost:8000/api/notifications/unread-count

# Mark as read
PUT http://localhost:8000/api/notifications/{id}/read

# Mark all as read
PUT http://localhost:8000/api/notifications/mark-all-read

# Delete notification
DELETE http://localhost:8000/api/notifications/{id}
```

## Future Enhancements

### Planned Features:
1. **Real-time Notifications**
   - WebSockets/Pusher integration
   - Browser push notifications
   - Live notification badges

2. **Notification Preferences**
   - User settings to enable/disable specific notification types
   - Email frequency preferences (immediate, daily digest, weekly digest)
   - Quiet hours configuration

3. **Advanced Reminders**
   - Custom reminder schedules
   - Snooze functionality
   - Recurring reminders

4. **Mobile Notifications**
   - Push notifications for mobile apps
   - SMS notifications (Twilio integration)

5. **Notification Categories**
   - Grouped notifications
   - Priority levels (low, medium, high, urgent)
   - Notification templates for admins

6. **Analytics**
   - Email open rates
   - Click-through rates
   - Notification effectiveness metrics

## Troubleshooting

### Emails Not Sending
1. Check `.env` configuration
2. Verify MAIL_USERNAME and MAIL_PASSWORD (use App Password for Gmail)
3. Check Laravel logs: `storage/logs/laravel.log`
4. Test email configuration: `php artisan tinker` → `Mail::raw('Test', function($msg) { $msg->to('test@example.com')->subject('Test'); });`

### Notifications Not Appearing
1. Check if user is authenticated
2. Verify notification was created in database: `select * from notifications order by created_at desc limit 10;`
3. Check browser console for JavaScript errors
4. Verify API endpoints are accessible

### Scheduled Commands Not Running
1. Ensure cron is configured
2. Check if scheduler is working: `php artisan schedule:list`
3. Run manually to test: `php artisan notifications:send-reminders`
4. Check Laravel logs for errors

## API Endpoints

All notification endpoints require authentication (Bearer token).

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get all notifications (paginated) |
| POST | `/api/notifications` | Create notification (admin only) |
| GET | `/api/notifications/unread-count` | Get unread count |
| PUT | `/api/notifications/{id}/read` | Mark as read |
| PUT | `/api/notifications/mark-all-read` | Mark all as read |
| DELETE | `/api/notifications/{id}` | Delete notification |

## Database Queries

Useful queries for monitoring:

```sql
-- Get unread notifications for a user
SELECT * FROM notifications WHERE user_id = 1 AND read_at IS NULL ORDER BY created_at DESC;

-- Count notifications by type
SELECT type, COUNT(*) as count FROM notifications GROUP BY type;

-- Get recent notifications with emails sent
SELECT * FROM notifications WHERE email_sent = 1 ORDER BY created_at DESC LIMIT 10;

-- Find notifications without action URLs
SELECT * FROM notifications WHERE action_url IS NULL AND type NOT IN ('system', 'general');

-- Get notification statistics
SELECT 
  type,
  COUNT(*) as total,
  SUM(CASE WHEN read_at IS NOT NULL THEN 1 ELSE 0 END) as read_count,
  SUM(CASE WHEN email_sent = 1 THEN 1 ELSE 0 END) as email_count
FROM notifications
GROUP BY type;
```

## Best Practices

1. **Always provide action URLs** for actionable notifications
2. **Keep messages concise** but informative
3. **Use metadata** to store additional context
4. **Test email templates** in multiple email clients
5. **Handle email failures gracefully** (log errors, don't block application)
6. **Respect user preferences** (implement opt-out mechanisms)
7. **Monitor notification volume** (don't spam users)
8. **Use appropriate notification types** for proper categorization
9. **Include relevant context** in metadata for rich notifications
10. **Test scheduled commands** before deploying to production

---

**Last Updated**: November 15, 2025
**Version**: 1.0.0
