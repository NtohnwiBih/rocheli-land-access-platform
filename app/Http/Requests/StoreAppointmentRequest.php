<?php

namespace App\Http\Requests;

use App\Services\AppointmentAvailabilityService;
use Illuminate\Contracts\Validation\Validator as ValidatorContract;
use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190'],
            'phone' => ['required', 'string', 'max:40'],
            'interest' => ['nullable', 'string', 'max:120'],
            'message' => ['nullable', 'string', 'max:2000'],
            'appointment_date' => ['required', 'date_format:Y-m-d'],
            'appointment_time' => ['required', 'date_format:H:i'],
        ];
    }

    public function withValidator(ValidatorContract $validator): void
    {
        $validator->after(function (ValidatorContract $validator) {
            if ($validator->errors()->has('appointment_date') || $validator->errors()->has('appointment_time')) {
                return;
            }

            $availability = app(AppointmentAvailabilityService::class);

            if (! $availability->isBookable($this->input('appointment_date'), $this->input('appointment_time'))) {
                $validator->errors()->add(
                    'appointment_time',
                    'That slot just got booked or is outside our opening hours — please pick another time.'
                );
            }
        });
    }
}