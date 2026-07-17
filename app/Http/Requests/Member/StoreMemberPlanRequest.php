<?php

namespace App\Http\Requests\Member;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMemberPlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->member !== null;
    }

    public function rules(): array
    {
        return [
            'plan_id' => ['required', 'integer', Rule::exists('plans', 'id')->where('is_active', true)],
            'label' => ['nullable', 'string', 'max:100'],
            'goal' => ['required', 'string'],
            'preferred_locations' => ['nullable', 'array'],
            'land_type' => ['required', 'string'],
            'contribution_frequency' => ['required', 'string', 'in:Daily,Weekly,Monthly'],
            'contribution_amount' => ['required', 'numeric', 'min:1'],
            'payment_method' => ['required', 'string', 'in:MTN Mobile Money,Orange Money,Bank Transfer,Cash Deposit'],
        ];
    }
}