<?php

namespace Tests\Feature;

use App\Models\Application;
use App\Models\Document;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DocumentTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_upload_document_to_application()
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $application = Application::factory()->create(['user_id' => $user->id]);

        $file = UploadedFile::fake()->create('resume.pdf', 100);

        $response = $this->actingAs($user)
            ->postJson("/api/applications/{$application->id}/documents", [
                'file' => $file,
                'type' => 'cv',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'document' => [
                    'id',
                    'type',
                    'file_name',
                    'file_path',
                ],
            ]);

        $this->assertDatabaseHas('documents', [
            'application_id' => $application->id,
            'type' => 'cv',
        ]);
    }

    /** @test */
    public function user_cannot_upload_document_to_other_users_application()
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $application = Application::factory()->create(['user_id' => $otherUser->id]);

        $file = UploadedFile::fake()->create('resume.pdf', 100);

        $response = $this->actingAs($user)
            ->postJson("/api/applications/{$application->id}/documents", [
                'file' => $file,
                'type' => 'cv',
            ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function document_validation_requires_valid_file_type()
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $application = Application::factory()->create(['user_id' => $user->id]);

        $file = UploadedFile::fake()->create('invalid.exe', 100);

        $response = $this->actingAs($user)
            ->postJson("/api/applications/{$application->id}/documents", [
                'file' => $file,
                'type' => 'cv',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file']);
    }

    /** @test */
    public function user_can_list_documents_for_application()
    {
        $user = User::factory()->create();
        $application = Application::factory()->create(['user_id' => $user->id]);
        Document::factory()->count(3)->create(['application_id' => $application->id]);

        $response = $this->actingAs($user)
            ->getJson("/api/applications/{$application->id}/documents");

        $response->assertStatus(200)
            ->assertJsonCount(3, 'documents');
    }

    /** @test */
    public function user_can_delete_document()
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $application = Application::factory()->create(['user_id' => $user->id]);
        
        // Create a real file path
        $filePath = 'documents/test.pdf';
        Storage::disk('public')->put($filePath, 'content');
        
        $document = Document::factory()->create([
            'application_id' => $application->id,
            'file_path' => $filePath,
        ]);

        $response = $this->actingAs($user)
            ->deleteJson("/api/applications/{$application->id}/documents/{$document->id}");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Document deleted successfully',
            ]);

        $this->assertDatabaseMissing('documents', [
            'id' => $document->id,
        ]);

        Storage::disk('public')->assertMissing($filePath);
    }

    /** @test */
    public function user_cannot_delete_other_users_document()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $application = Application::factory()->create(['user_id' => $otherUser->id]);
        $document = Document::factory()->create(['application_id' => $application->id]);

        $response = $this->actingAs($user)
            ->deleteJson("/api/applications/{$application->id}/documents/{$document->id}");

        $response->assertStatus(403);
    }
}
