<?php

namespace Database\Factories;

use App\Models\Application;
use App\Models\Document;
use Illuminate\Database\Eloquent\Factories\Factory;

class DocumentFactory extends Factory
{
    protected $model = Document::class;

    public function definition(): array
    {
        return [
            'application_id' => Application::factory(),
            'type' => $this->faker->randomElement(['cv', 'cover_letter', 'portfolio', 'certificate', 'reference', 'other']),
            'original_name' => $this->faker->word() . '.pdf',
            'file_path' => 'documents/' . $this->faker->uuid() . '.pdf',
            'file_size' => $this->faker->numberBetween(10000, 5000000),
        ];
    }
}
