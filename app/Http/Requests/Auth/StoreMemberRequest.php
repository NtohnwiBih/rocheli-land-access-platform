<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Step 1 — Personal
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'email', 'max:255', Rule::unique('users', 'email')],
            'phone' => ['required', 'string', 'max:30', Rule::unique('users', 'phone')],
            'whatsapp' => ['nullable', 'string', 'max:30'],
            'gender' => ['required', Rule::in(['male', 'female', 'other'])],
            'occupation' => ['nullable', 'string', 'max:255'],
            'country_of_residence' => ['nullable', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'password' => ['required', 'confirmed', Password::defaults()],

            // Step 2 — Identity verification
            'id_type' => ['required', Rule::in(['NIN', 'Passport', "Driver's License"])],
            'id_number' => ['required', 'string', 'max:100'],
            'id_document' => ['required', 'file', 'mimes:png,jpg,jpeg,pdf', 'max:5120'],
            'kin_name' => ['nullable', 'string', 'max:255'],
            'kin_relationship' => ['nullable', 'string', 'max:100'],
            'kin_phone' => ['nullable', 'string', 'max:30'],

            // Step 3 — Preferences
            'goal' => ['required', 'string', 'max:255'],
            'preferred_locations' => ['nullable', 'array'],
            'preferred_locations.*' => ['string', 'max:255'],
            'land_type' => ['required', 'string', 'max:255'],

            // Step 4 — Contribution
            'plan' => ['required', 'string', 'max:255'],
            'contribution_frequency' => ['required', Rule::in(['Daily', 'Weekly', 'Monthly'])],
            'contribution_amount' => ['required', 'numeric', 'min:0'],
            'payment_method' => ['required', 'string', 'max:255'],

            // Step 5 — Confirmation
            'agreements' => ['required', 'array', 'size:4'],
            'agreements.*' => ['required', 'accepted'],
            'signature' => ['required', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'agreements.*.accepted' => 'You must accept all agreements to continue.',
            'id_document.max' => 'The ID document must not be larger than 5MB.',
        ];
    }
}