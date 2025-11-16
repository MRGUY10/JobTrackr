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
        // Check if column exists before dropping
        if (Schema::hasColumn('documents', 'type')) {
            Schema::table('documents', function (Blueprint $table) {
                $table->dropColumn('type');
            });
        }
        
        Schema::table('documents', function (Blueprint $table) {
            $table->string('type', 255)->default('other')->after('application_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropColumn('type');
        });
        
        Schema::table('documents', function (Blueprint $table) {
            $table->string('type', 255)->default('other')->after('user_id');
        });
    }
};
