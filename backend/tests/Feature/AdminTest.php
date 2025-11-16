<?php

namespace Tests\Feature;

use App\Models\Application;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function admin_can_view_dashboard_statistics()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        User::factory()->count(5)->create();
        Application::factory()->count(10)->create();

        $response = $this->actingAs($admin)
            ->getJson('/api/admin/dashboard');

        $response->assertStatus(200);
    }

    /** @test */
    public function non_admin_cannot_access_admin_dashboard()
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)
            ->getJson('/api/admin/dashboard');

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_view_all_users()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        User::factory()->count(5)->create();

        $response = $this->actingAs($admin)
            ->getJson('/api/admin/users');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data'
            ]);
    }

    /** @test */
    public function admin_can_view_all_applications()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Application::factory()->count(5)->create();

        $response = $this->actingAs($admin)
            ->getJson('/api/admin/applications');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data',
            ]);
    }

    /** @test */
    public function admin_can_delete_user()
    {
        $this->markTestSkipped('Delete user route not implemented');
    }

    /** @test */
    public function non_admin_cannot_delete_user()
    {
        $this->markTestSkipped('Delete user route not implemented');
    }
}
