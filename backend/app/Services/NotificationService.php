<?php

namespace App\Services;

use App\Models\User;
use App\Models\Notification;
use App\Models\Application;
use App\Mail\ApplicationStatusChanged;
use App\Mail\InterviewScheduled;
use App\Mail\DeadlineReminder;
use App\Mail\GeneralNotification;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Create notification when application status changes
     */
    public static function applicationStatusChanged(Application $application, string $oldStatus, string $newStatus = null): void
    {
        $newStatus = $newStatus ?? $application->status;
        
        $notification = Notification::create([
            'user_id' => $application->user_id,
            'title' => 'Application Status Updated',
            'message' => "Your application for {$application->position} at {$application->company} has been updated from {$oldStatus} to {$newStatus}.",
            'type' => 'application_status_changed',
            'metadata' => [
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
                'application_id' => $application->id,
                'company' => $application->company,
                'position' => $application->position,
            ],
            'related_type' => 'App\Models\Application',
            'related_id' => $application->id,
            'action_url' => "/applications/{$application->id}",
        ]);

        self::sendEmail($notification, $application->user);
    }

    /**
     * Create notification when interview is scheduled
     */
    public static function interviewScheduled(Application $application): void
    {
        $interviewDate = $application->interview_date ? $application->interview_date->format('M d, Y') : 'TBD';
        
        $notification = Notification::create([
            'user_id' => $application->user_id,
            'title' => 'Interview Scheduled',
            'message' => "You have an interview scheduled for {$application->position} at {$application->company} on {$interviewDate}.",
            'type' => 'interview_scheduled',
            'metadata' => [
                'application_id' => $application->id,
                'company' => $application->company,
                'position' => $application->position,
                'interview_date' => $application->interview_date,
            ],
            'related_type' => 'App\Models\Application',
            'related_id' => $application->id,
            'action_url' => "/applications/{$application->id}",
        ]);

        self::sendEmail($notification, $application->user);
    }

    /**
     * Create reminder notification for upcoming interview
     */
    public static function interviewReminder(Application $application): void
    {
        $interviewDate = $application->interview_date->format('M d, Y h:i A');
        
        $notification = Notification::create([
            'user_id' => $application->user_id,
            'title' => 'Interview Reminder',
            'message' => "Reminder: You have an interview for {$application->position} at {$application->company} tomorrow at {$interviewDate}.",
            'type' => 'interview_reminder',
            'metadata' => [
                'application_id' => $application->id,
                'company' => $application->company,
                'position' => $application->position,
                'interview_date' => $application->interview_date,
            ],
            'related_type' => 'App\Models\Application',
            'related_id' => $application->id,
            'action_url' => "/applications/{$application->id}",
        ]);

        self::sendEmail($notification, $application->user);
    }

    /**
     * Create notification when application is created
     */
    public static function applicationCreated(Application $application): void
    {
        $notification = Notification::create([
            'user_id' => $application->user_id,
            'title' => 'Application Submitted',
            'message' => "Your application for {$application->position} at {$application->company} has been successfully submitted.",
            'type' => 'application_created',
            'metadata' => [
                'application_id' => $application->id,
                'company' => $application->company,
                'position' => $application->position,
            ],
            'related_type' => 'App\Models\Application',
            'related_id' => $application->id,
            'action_url' => "/applications/{$application->id}",
        ]);

        self::sendEmail($notification, $application->user);
    }

    /**
     * Create notification when document is uploaded
     */
    public static function documentUploaded(Application $application, $document): void
    {
        $notification = Notification::create([
            'user_id' => $application->user_id,
            'title' => 'Document Uploaded',
            'message' => "A new {$document->type} document has been uploaded for your application to {$application->position} at {$application->company}.",
            'type' => 'document_uploaded',
            'metadata' => [
                'document_type' => $document->type,
                'application_id' => $application->id,
                'document_id' => $document->id,
                'company' => $application->company,
                'position' => $application->position,
            ],
            'related_type' => 'App\Models\Document',
            'related_id' => $document->id,
            'action_url' => '/documents',
        ]);

        self::sendEmail($notification, $application->user);
    }

    /**
     * Create notification for deadline approaching
     */
    public static function deadlineApproaching(Application $application, int $daysRemaining): void
    {
        $notification = Notification::create([
            'user_id' => $application->user_id,
            'title' => 'Application Deadline Approaching',
            'message' => "The deadline for your application to {$application->position} at {$application->company} is in {$daysRemaining} days.",
            'type' => 'application_deadline_approaching',
            'metadata' => [
                'application_id' => $application->id,
                'company' => $application->company,
                'position' => $application->position,
                'days_remaining' => $daysRemaining,
            ],
            'related_type' => 'App\Models\Application',
            'related_id' => $application->id,
            'action_url' => "/applications/{$application->id}",
        ]);

        self::sendEmail($notification, $application->user);
    }

    /**
     * Create follow-up reminder notification
     */
    public static function followUpReminder(Application $application, int $daysSinceApplied): void
    {
        $notification = Notification::create([
            'user_id' => $application->user_id,
            'title' => 'Follow-up Reminder',
            'message' => "It's been {$daysSinceApplied} days since you applied to {$application->position} at {$application->company}. Consider following up.",
            'type' => 'follow_up_reminder',
            'metadata' => [
                'application_id' => $application->id,
                'company' => $application->company,
                'position' => $application->position,
                'days_since_applied' => $daysSinceApplied,
            ],
            'related_type' => 'App\Models\Application',
            'related_id' => $application->id,
            'action_url' => "/applications/{$application->id}",
        ]);

        self::sendEmail($notification, $application->user);
    }

    /**
     * Create general notification
     */
    public static function createGeneral(User $user, string $title, string $message, array $metadata = []): void
    {
        $notification = Notification::create([
            'user_id' => $user->id,
            'title' => $title,
            'message' => $message,
            'type' => 'general',
            'metadata' => $metadata,
        ]);

        self::sendEmail($notification, $user);
    }

    /**
     * Create system notification
     */
    public static function createSystem(User $user, string $title, string $message): void
    {
        Notification::create([
            'user_id' => $user->id,
            'title' => $title,
            'message' => $message,
            'type' => 'system',
        ]);
    }

    /**
     * Notify user about new job posting matching their criteria
     */
    public static function newJobPosting(User $user, array $jobData): void
    {
        $notification = Notification::create([
            'user_id' => $user->id,
            'title' => 'New Job Opportunity',
            'message' => "A new job posting for {$jobData['title']} at {$jobData['company']} matches your profile.",
            'type' => 'job_posting_new',
            'metadata' => $jobData,
            'related_type' => 'App\Models\JobPosting',
            'related_id' => $jobData['id'] ?? null,
            'action_url' => '/job-search',
        ]);

        self::sendEmail($notification, $user);
    }

    /**
     * Send email notification
     */
    protected static function sendEmail(Notification $notification, User $user): void
    {
        try {
            switch ($notification->type) {
                case 'application_status_changed':
                    Mail::to($user->email)->send(new ApplicationStatusChanged($notification, $user));
                    break;
                
                case 'interview_scheduled':
                case 'interview_reminder':
                    Mail::to($user->email)->send(new InterviewScheduled($notification, $user));
                    break;
                
                case 'application_deadline_approaching':
                case 'follow_up_reminder':
                    Mail::to($user->email)->send(new DeadlineReminder($notification, $user));
                    break;
                
                default:
                    Mail::to($user->email)->send(new GeneralNotification($notification, $user));
                    break;
            }

            $notification->update(['email_sent' => true]);
        } catch (\Exception $e) {
            Log::error('Failed to send notification email', [
                'notification_id' => $notification->id,
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Send batch notifications to multiple users
     */
    public static function sendBatch(array $userIds, string $title, string $message, string $type = 'general'): void
    {
        foreach ($userIds as $userId) {
            $user = User::find($userId);
            if ($user) {
                if ($type === 'general') {
                    self::createGeneral($user, $title, $message);
                } else {
                    self::createSystem($user, $title, $message);
                }
            }
        }
    }
}
