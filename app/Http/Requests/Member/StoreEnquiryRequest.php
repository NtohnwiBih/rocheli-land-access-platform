<?php

namespace App\Http\Requests\Member;

use Illuminate\Foundation\Http\FormRequest;

class StoreEnquiryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->member !== null;
    }

    public function rules(): array
    {
        return [
            'property_id' => ['required', 'integer', 'exists:properties,id'],
            'interest' => ['required', 'string', 'in:info,inspection,installments,reserve'],
            'message' => ['nullable', 'string', 'max:1000'],
        ];
    }
}