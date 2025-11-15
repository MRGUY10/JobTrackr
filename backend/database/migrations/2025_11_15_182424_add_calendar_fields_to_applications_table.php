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
        Schema::table('applications', function (Blueprint $table) {
            $table->dateTime('interview_date')->nullable()->after('applied_date');
            $table->string('interview_time')->nullable()->after('interview_date');
            $table->string('interview_location')->nullable()->after('interview_time');
            $table->enum('interview_type', ['video', 'phone', 'in-person'])->nullable()->after('interview_location');
            $table->string('interviewer_name')->nullable()->after('interview_type');
            $table->text('interview_notes')->nullable()->after('interviewer_name');
            $table->date('deadline')->nullable()->after('interview_notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn([
                'interview_date',
                'interview_time',
                'interview_location',
                'interview_type',
                'interviewer_name',
                'interview_notes',
                'deadline'
            ]);
        });
    }
};
