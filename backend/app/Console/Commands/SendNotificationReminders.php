<?php

namespace App\Console\Commands;

use App\Models\Application;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendNotificationReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:send-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send automatic notification reminders (interview reminders, deadline warnings, follow-up reminders)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting notification reminders...');
        
        $interviewReminders = 0;
        $deadlineWarnings = 0;
        $followUpReminders = 0;

        // 1. Interview Reminders (send day before interview)
        $tomorrow = Carbon::tomorrow();
        $applicationsWithInterviews = Application::whereNotNull('interview_date')
            ->whereDate('interview_date', $tomorrow->toDateString())
            ->whereIn('status', ['Interview', 'Technical Test'])
            ->with('user')
            ->get();

        foreach ($applicationsWithInterviews as $application) {
            NotificationService::interviewReminder($application);
            $interviewReminders++;
        }

        // 2. Deadline Approaching Warnings (3 days before deadline)
        $threeDaysLater = Carbon::now()->addDays(3);
        $applicationsWithDeadlines = Application::whereNotNull('deadline')
            ->whereDate('deadline', $threeDaysLater->toDateString())
            ->whereIn('status', ['Applied', 'Interview', 'Technical Test'])
            ->with('user')
            ->get();

        foreach ($applicationsWithDeadlines as $application) {
            $daysRemaining = Carbon::now()->diffInDays(Carbon::parse($application->deadline), false);
            NotificationService::deadlineApproaching($application, $daysRemaining);
            $deadlineWarnings++;
        }

        // 3. Follow-up Reminders (7 days after applying, if still in "Applied" status)
        $sevenDaysAgo = Carbon::now()->subDays(7);
        $applicationsNeedingFollowUp = Application::where('status', 'Applied')
            ->whereDate('applied_date', $sevenDaysAgo->toDateString())
            ->with('user')
            ->get();

        foreach ($applicationsNeedingFollowUp as $application) {
            $daysSinceApplied = Carbon::parse($application->applied_date)->diffInDays(Carbon::now());
            NotificationService::followUpReminder($application, $daysSinceApplied);
            $followUpReminders++;
        }

        // Summary
        $this->info("Interview reminders sent: {$interviewReminders}");
        $this->info("Deadline warnings sent: {$deadlineWarnings}");
        $this->info("Follow-up reminders sent: {$followUpReminders}");
        $this->info('Notification reminders completed!');

        return Command::SUCCESS;
    }
}
