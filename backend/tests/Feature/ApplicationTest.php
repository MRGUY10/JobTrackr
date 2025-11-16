<?php

namespace Tests\Feature;

use App\Models\Application;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApplicationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_view_their_applications()
    {
        $user = User::factory()->create();
        Application::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->getJson('/api/applications');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    /** @test */
    public function user_can_create_application()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/applications', [
                'company' => 'Tech Corp',
                'position' => 'Software Engineer',
                'job_url' => 'https://example.com/job',
                'status' => 'Applied',
                'applied_date' => now()->format('Y-m-d'),
                'notes' => 'Great opportunity',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'id',
                    'company',
                    'position',
                    'status',
                ],
            ]);

        $this->assertDatabaseHas('applications', [
            'company' => 'Tech Corp',
            'position' => 'Software Engineer',
            'user_id' => $user->id,
        ]);
    }

    /** @test */
    public function user_can_update_their_application()
    {
        $user = User::factory()->create();
        $application = Application::factory()->create([
            'user_id' => $user->id,
            'status' => 'Applied',
        ]);

        $response = $this->actingAs($user)
            ->putJson("/api/applications/{$application->id}", [
                'company' => 'Tech Corp Updated',
                'position' => 'Senior Software Engineer',
                'status' => 'Interview',
                'applied_date' => $application->applied_date->format('Y-m-d'),
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Application updated successfully',
            ]);

        $this->assertDatabaseHas('applications', [
            'id' => $application->id,
            'company' => 'Tech Corp Updated',
            'position' => 'Senior Software Engineer',
            'status' => 'Interview',
        ]);
    }

    /** @test */
    public function user_cannot_update_other_users_application()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $application = Application::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)
            ->putJson("/api/applications/{$application->id}", [
                'company' => 'Updated Company',
                'position' => 'Updated Position',
                'status' => 'Interview',
                'applied_date' => now()->format('Y-m-d'),
            ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function user_can_delete_their_application()
    {
        $user = User::factory()->create();
        $application = Application::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->deleteJson("/api/applications/{$application->id}");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Application deleted successfully',
            ]);

        $this->assertDatabaseMissing('applications', [
            'id' => $application->id,
        ]);
    }

    /** @test */
    public function user_cannot_delete_other_users_application()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $application = Application::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)
            ->deleteJson("/api/applications/{$application->id}");

        $response->assertStatus(403);
    }

    /** @test */
    public function user_can_view_single_application()
    {
        $user = User::factory()->create();
        $application = Application::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->getJson("/api/applications/{$application->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $application->id,
                    'company' => $application->company,
                ],
            ]);
    }

    /** @test */
    public function application_validation_requires_required_fields()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/applications', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['company', 'position', 'applied_date']);
    }

    /** @test */
    public function application_status_must_be_valid()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/applications', [
                'company' => 'Tech Corp',
                'position' => 'Developer',
                'status' => 'invalid_status',
                'applied_date' => now()->format('Y-m-d'),
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['status']);
    }

    /** @test */
    public function user_can_filter_applications_by_status()
    {
        $user = User::factory()->create();
        Application::factory()->create(['user_id' => $user->id, 'status' => 'Applied']);
        Application::factory()->create(['user_id' => $user->id, 'status' => 'Interview']);
        Application::factory()->create(['user_id' => $user->id, 'status' => 'Interview']);

        $response = $this->actingAs($user)
            ->getJson('/api/applications?status=Interview');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }
}
