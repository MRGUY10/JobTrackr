<?php

namespace Tests\Feature;

use App\Models\Application;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StatisticsTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_view_their_statistics()
    {
        $user = User::factory()->create();
        Application::factory()->count(5)->create([
            'user_id' => $user->id,
            'status' => 'applied',
        ]);
        Application::factory()->count(3)->create([
            'user_id' => $user->id,
            'status' => 'interview',
        ]);
        Application::factory()->count(2)->create([
            'user_id' => $user->id,
            'status' => 'offer',
        ]);

        $response = $this->actingAs($user)
            ->getJson('/api/statistics');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'total_applications',
                'applications_by_status',
                'recent_activity',
                'upcoming_interviews',
            ]);

        $response->assertJson([
            'total_applications' => 10,
            'applications_by_status' => [
                'applied' => 5,
                'interview' => 3,
                'offer' => 2,
            ],
        ]);
    }

    /** @test */
    public function statistics_only_show_user_own_data()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        Application::factory()->count(5)->create(['user_id' => $user->id]);
        Application::factory()->count(10)->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)
            ->getJson('/api/statistics');

        $response->assertStatus(200)
            ->assertJson([
                'total_applications' => 5,
            ]);
    }
}
