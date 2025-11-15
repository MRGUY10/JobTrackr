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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->string('location')->nullable()->after('phone');
            $table->string('title')->nullable()->after('location');
            $table->text('bio')->nullable()->after('title');
            $table->string('website')->nullable()->after('bio');
            $table->string('linkedin')->nullable()->after('website');
            $table->string('github')->nullable()->after('linkedin');
            $table->integer('years_of_experience')->nullable()->after('github');
            $table->string('current_company')->nullable()->after('years_of_experience');
            $table->string('education')->nullable()->after('current_company');
            $table->json('skills')->nullable()->after('education');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'location',
                'title',
                'bio',
                'website',
                'linkedin',
                'github',
                'years_of_experience',
                'current_company',
                'education',
                'skills',
            ]);
        });
    }
};
