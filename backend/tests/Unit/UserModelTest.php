<?php

namespace Tests\Unit;

use App\Models\Application;
use App\Models\Document;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserModelTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_has_applications()
    {
        $user = User::factory()->create();
        Application::factory()->count(3)->create(['user_id' => $user->id]);

        $this->assertCount(3, $user->applications);
    }

    /** @test */
    public function user_has_notifications()
    {
        $user = User::factory()->create();
        Notification::factory()->count(5)->create(['user_id' => $user->id]);

        $this->assertCount(5, $user->notifications);
    }

    /** @test */
    public function user_can_be_admin()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'user']);

        $this->assertTrue($admin->role === 'admin');
        $this->assertFalse($user->role === 'admin');
    }

    /** @test */
    public function user_password_is_hashed()
    {
        $user = User::factory()->create(['password' => 'password']);

        $this->assertNotEquals('password', $user->password);
        $this->assertTrue(strlen($user->password) > 30);
    }

    /** @test */
    public function deleting_user_cascades_to_applications()
    {
        $user = User::factory()->create();
        $application = Application::factory()->create(['user_id' => $user->id]);

        $user->delete();

        $this->assertDatabaseMissing('applications', [
            'id' => $application->id,
        ]);
    }
}
