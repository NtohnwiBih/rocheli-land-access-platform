<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAppointmentRequest;
use App\Mail\AppointmentAdminNotification;
use App\Mail\AppointmentClientConfirmation;
use App\Models\Appointment;
use App\Services\AppointmentAvailabilityService;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class AppointmentController extends Controller
{
    public function index(AppointmentAvailabilityService $availability): Response
    {
        return Inertia::render('site/contact', [
            'content' => [],
            'availability' => $availability->availability(),
        ]);
    }

    /**
     * Lightweight JSON refresh so the front end can re-check availability
     * right before submit, in case the page has been open for a while.
     */
    public function availability(AppointmentAvailabilityService $availability): JsonResponse
    {
        return response()->json($availability->availability());
    }

    public function store(StoreAppointmentRequest $request): RedirectResponse
    {
        $data = $request->validated();

        try {
            $appointment = DB::transaction(fn () => Appointment::create($data + [
                'status' => 'confirmed',
            ]));
        } catch (QueryException $e) {
            // The unique(appointment_date, appointment_time) index is what
            // actually stops a double-booking race; this just turns that
            // DB-level rejection into a friendly, field-scoped error.
            if ((int) $e->getCode() === 23000) {
                return back()
                    ->withInput()
                    ->withErrors(['appointment_time' => 'That slot was just taken by someone else. Please pick another time.']);
            }

            throw $e;
        }

        Mail::to($appointment->email)->queue(new AppointmentClientConfirmation($appointment));
        Mail::to(config('mail.admin_address', config('mail.from.address')))
            ->queue(new AppointmentAdminNotification($appointment));

        return back()->with('success', [
            'date' => $appointment->appointment_date->toDateString(),
            'time' => $appointment->short_time,
        ]);
    }
}