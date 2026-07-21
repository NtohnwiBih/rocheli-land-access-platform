<?php

namespace App\Http\Requests;

use App\Services\AppointmentSlotService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'phone' => ['required', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'interest' => ['nullable', 'string', 'max:150'],
            'message' => ['nullable', 'string', 'max:2000'],
            'appointment_date' => ['required', 'date', 'after_or_equal:today'],
            'appointment_time' => ['required', 'date_format:H:i'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $service = app(AppointmentSlotService::class);

            if (
                $this->filled(['appointment_date', 'appointment_time'])
                && ! $service->isSlotAvailable($this->input('appointment_date'), $this->input('appointment_time'))
            ) {
                $validator->errors()->add('appointment_time', 'This slot is no longer available. Please choose another.');
            }
        });
    }
}