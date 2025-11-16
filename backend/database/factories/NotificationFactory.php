<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    protected $model = Notification::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => $this->faker->randomElement([
                'application_status_changed',
                'interview_scheduled',
                'interview_reminder',
                'document_uploaded',
                'application_created',
                'application_deadline_approaching',
                'follow_up_reminder',
                'job_posting_new',
                'system',
                'general'
            ]),
            'title' => $this->faker->sentence(4),
            'message' => $this->faker->sentence(),
            'read_at' => $this->faker->optional()->dateTime(),
        ];
    }
}
