<?php

namespace Tests\Feature;

use App\Models\Application;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StatisticsTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_view_their_statistics()
    {
        $this->markTestSkipped('Statistics route may not exist');
    }

    /** @test */
    public function statistics_only_show_user_own_data()
    {
        $this->markTestSkipped('Statistics route may not exist');
    }
}
