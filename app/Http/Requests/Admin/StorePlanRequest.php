<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StorePlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'target_price' => ['required', 'numeric', 'min:0'],
            'daily_amount' => ['required', 'numeric', 'min:0'],
            'weekly_amount' => ['required', 'numeric', 'min:0'],
            'monthly_amount' => ['required', 'numeric', 'min:0'],
            'is_flexible' => ['boolean'],
            'is_featured' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
        ];
    }
}