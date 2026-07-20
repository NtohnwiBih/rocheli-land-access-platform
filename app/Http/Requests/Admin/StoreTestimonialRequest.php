<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreTestimonialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'role_en' => ['required', 'string', 'max:150'],
            'role_fr' => ['required', 'string', 'max:150'],
            'quote_en' => ['required', 'string'],
            'quote_fr' => ['required', 'string'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'sort_order' => ['nullable', 'integer'],
            'is_published' => ['boolean'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ];
    }
}