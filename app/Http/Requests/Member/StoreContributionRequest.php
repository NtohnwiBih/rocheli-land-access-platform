<?php

namespace App\Http\Requests\Member;

use Illuminate\Foundation\Http\FormRequest;

class StoreContributionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->member !== null;
    }

    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'min:1000'],
            'method' => ['required', 'string', 'in:Bank transfer,Card,Direct debit,Cash deposit'],
            'proof' => ['required', 'file', 'image', 'max:5120'], // 5MB
            'note' => ['nullable', 'string', 'max:255'],
            'member_plan_id' => ['required', 'integer', 'exists:member_plans,id'],
        ];
    }
}