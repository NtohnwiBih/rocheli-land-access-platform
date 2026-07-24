<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEnquiryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isGuest = ! $this->user();

        return [
            'property_id' => ['required', 'exists:properties,id'],
            'interest' => ['nullable', Rule::in(['buy', 'financing', 'visit', 'information'])],
            'message' => ['nullable', 'string', 'max:2000'],

            // Only required when nobody is logged in — a member's contact
            // details already live on their account, so the form hides
            // these fields entirely when authenticated (see the frontend).
            'name' => [Rule::requiredIf($isGuest), 'nullable', 'string', 'max:255'],
            'email' => [Rule::requiredIf($isGuest), 'nullable', 'email', 'max:255'],
            'phone' => [Rule::requiredIf($isGuest), 'nullable', 'string', 'max:30'],
        ];
    }
}