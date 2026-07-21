<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAppointmentRequest;
use App\Models\Appointment;
use App\Models\User;
use App\Notifications\NewAppointmentRequest;
use App\Services\AppointmentSlotService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class AppointmentController extends Controller
{
    public function __construct(
        protected AppointmentSlotService $slots,
    ) {}

    public function availability(): JsonResponse
    {
        return response()->json([
            'days' => $this->slots->getUpcomingWindow(),
        ]);
    }

    public function store(StoreAppointmentRequest $request): RedirectResponse
    {
        $appointment = Appointment::create($request->validated());

        User::where('role', 'admin')->get()->each(
            fn (User $admin) => $admin->notify(new NewAppointmentRequest($appointment))
        );

        return back()->with('success', 'Your consultation request has been received — we\'ll confirm your slot shortly.');
    }
}