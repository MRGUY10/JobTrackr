<?php

namespace Tests\Unit;

use App\Models\Application;
use App\Models\Document;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApplicationModelTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function application_belongs_to_user()
    {
        $user = User::factory()->create();
        $application = Application::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $application->user);
        $this->assertEquals($user->id, $application->user->id);
    }

    /** @test */
    public function application_has_documents()
    {
        $application = Application::factory()->create();
        Document::factory()->count(3)->create(['application_id' => $application->id]);

        $this->assertCount(3, $application->documents);
    }

    /** @test */
    public function application_has_fillable_attributes()
    {
        $application = Application::factory()->create([
            'company' => 'Test Company',
            'position' => 'Developer',
            'status' => 'Applied',
        ]);

        $this->assertEquals('Test Company', $application->company);
        $this->assertEquals('Developer', $application->position);
        $this->assertEquals('Applied', $application->status);
    }

    /** @test */
    public function application_casts_dates_correctly()
    {
        $application = Application::factory()->create([
            'applied_date' => '2024-01-15',
            'interview_date' => '2024-01-20 10:00:00',
        ]);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $application->applied_date);
        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $application->interview_date);
    }

    /** @test */
    public function deleting_application_cascades_to_documents()
    {
        $application = Application::factory()->create();
        $document = Document::factory()->create(['application_id' => $application->id]);

        $application->delete();

        $this->assertDatabaseMissing('documents', [
            'id' => $document->id,
        ]);
    }
}
