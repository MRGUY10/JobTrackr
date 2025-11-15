<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobPosting extends Model
{
    protected $fillable = [
        'title',
        'company',
        'description',
        'location',
        'job_type',
        'experience_level',
        'salary_range',
        'requirements',
        'benefits',
        'application_url',
        'contact_email',
        'status',
        'posted_by',
        'deadline',
    ];

    protected $casts = [
        'deadline' => 'date',
    ];

    public function postedBy()
    {
        return $this->belongsTo(User::class, 'posted_by');
    }
}
