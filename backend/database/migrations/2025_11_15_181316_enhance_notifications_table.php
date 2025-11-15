<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            // Drop old enum constraint
            $table->dropColumn('type');
        });

        Schema::table('notifications', function (Blueprint $table) {
            // Add new enhanced type with more options
            $table->enum('type', [
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
            ])->default('general')->after('message');
            
            // Add metadata for storing additional data (JSON)
            $table->json('metadata')->nullable()->after('type');
            
            // Add email sent flag
            $table->boolean('email_sent')->default(false)->after('metadata');
            
            // Add related model tracking
            $table->string('related_type')->nullable()->after('email_sent');
            $table->unsignedBigInteger('related_id')->nullable()->after('related_type');
            
            // Add action URL for notifications
            $table->string('action_url')->nullable()->after('related_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropColumn(['metadata', 'email_sent', 'related_type', 'related_id', 'action_url']);
            $table->dropColumn('type');
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->enum('type', ['interview_reminder', 'follow_up', 'general'])->default('general')->after('message');
        });
    }
};
