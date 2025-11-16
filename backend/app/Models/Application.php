<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "Application",
    properties: [
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "company", type: "string", example: "Google"),
        new OA\Property(property: "position", type: "string", example: "Senior Developer"),
        new OA\Property(property: "status", type: "string", enum: ["Applied", "Interview", "Technical Test", "Offer", "Rejected"]),
        new OA\Property(property: "job_url", type: "string", format: "url", nullable: true),
        new OA\Property(property: "job_description", type: "string", nullable: true),
        new OA\Property(property: "notes", type: "string", nullable: true),
        new OA\Property(property: "applied_date", type: "string", format: "date"),
        new OA\Property(property: "documents_count", type: "integer"),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time")
    ]
)]
class Application extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'user_id',
        'company',
        'position',
        'status',
        'job_url',
        'job_description',
        'notes',
        'applied_date',
        'interview_date',
        'interview_time',
        'interview_location',
        'interview_type',
        'interviewer_name',
        'interview_notes',
        'deadline',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'applied_date' => 'date',
            'interview_date' => 'datetime',
            'deadline' => 'date',
        ];
    }

    /**
     * Get the user that owns the application.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the documents for the application.
     */
    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }
}
