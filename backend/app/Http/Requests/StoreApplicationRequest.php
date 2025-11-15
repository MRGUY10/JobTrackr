<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'company' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'status' => ['sometimes', 'in:Applied,Interview,Technical Test,Offer,Rejected'],
            'job_url' => ['nullable', 'url', 'max:500'],
            'job_description' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'applied_date' => ['required', 'date'],
            'interview_date' => ['nullable', 'date'],
            'interview_time' => ['nullable', 'string', 'max:50'],
            'interview_location' => ['nullable', 'string', 'max:255'],
            'interview_type' => ['nullable', 'in:video,phone,in-person'],
            'interviewer_name' => ['nullable', 'string', 'max:255'],
            'interview_notes' => ['nullable', 'string'],
            'deadline' => ['nullable', 'date'],
        ];
    }

    /**
     * Prepare data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'user_id' => $this->user()->id,
        ]);
    }
}
