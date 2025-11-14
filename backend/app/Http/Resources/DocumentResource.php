<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
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
            'application_id' => $this->application_id,
            'file_path' => $this->file_path,
            'file_url' => $this->url,
            'type' => $this->type,
            'original_name' => $this->original_name,
            'file_size' => $this->file_size,
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
