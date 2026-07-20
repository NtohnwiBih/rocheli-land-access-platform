<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePropertyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'city_id' => ['required', 'integer', 'exists:cities,id'],
            'location' => ['required', 'string', 'max:255'],
            'size' => ['required', 'string', 'max:100'],
            'type' => ['required', 'string', 'max:100'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'price' => ['required', 'string', 'max:100'],
            'price_value' => ['nullable', 'numeric'],
            'status' => ['required', Rule::in(['Available', 'Selling Fast', 'Reserved', 'Sold'])],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:5120'],
        ];
    }
}