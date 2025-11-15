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
        Schema::create('job_postings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('company');
            $table->text('description');
            $table->string('location');
            $table->string('job_type'); // Full-time, Part-time, Contract, etc.
            $table->string('experience_level'); // Entry, Mid, Senior
            $table->string('salary_range')->nullable();
            $table->text('requirements')->nullable();
            $table->text('benefits')->nullable();
            $table->string('application_url')->nullable();
            $table->string('contact_email')->nullable();
            $table->enum('status', ['active', 'closed', 'draft'])->default('active');
            $table->foreignId('posted_by')->constrained('users')->onDelete('cascade');
            $table->date('deadline')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_postings');
    }
};
