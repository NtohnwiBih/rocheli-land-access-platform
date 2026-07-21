<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreFaqRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'question_en' => ['required', 'string', 'max:255'],
            'question_fr' => ['required', 'string', 'max:255'],
            'answer_en' => ['required', 'string'],
            'answer_fr' => ['required', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'is_published' => ['boolean'],
        ];
    }
}