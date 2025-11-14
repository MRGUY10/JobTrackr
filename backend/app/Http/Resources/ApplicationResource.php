<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company' => $this->company,
            'position' => $this->position,
            'status' => $this->status,
            'job_url' => $this->job_url,
            'job_description' => $this->job_description,
            'notes' => $this->notes,
            'applied_date' => $this->applied_date->format('Y-m-d'),
            'documents' => DocumentResource::collection($this->whenLoaded('documents')),
            'documents_count' => $this->when(isset($this->documents_count), $this->documents_count),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
