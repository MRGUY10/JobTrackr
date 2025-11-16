<?php

namespace Database\Factories;

use App\Models\Application;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicationFactory extends Factory
{
    protected $model = Application::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'company' => $this->faker->company(),
            'position' => $this->faker->jobTitle(),
            'status' => 'Applied',  // Default to Applied, can override in tests
            'job_url' => $this->faker->url(),
            'job_description' => $this->faker->paragraph(),
            'notes' => $this->faker->sentence(),
            'applied_date' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'interview_date' => $this->faker->optional()->dateTimeBetween('now', '+30 days'),
            'interview_time' => $this->faker->optional()->time(),
            'interview_location' => $this->faker->optional()->address(),
            'interview_type' => $this->faker->optional(0.5)->randomElement(['video', 'phone', 'in-person']),
            'interviewer_name' => $this->faker->optional()->name(),
            'interview_notes' => $this->faker->optional()->sentence(),
            'deadline' => $this->faker->optional()->dateTimeBetween('now', '+60 days'),
        ];
    }
}
