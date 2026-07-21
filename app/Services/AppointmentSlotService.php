<?php

namespace App\Services;

use App\Models\Appointment;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class AppointmentSlotService
{
    /**
     * Fixed daily time slots. Adjust here if opening hours change —
     * single source of truth for both availability checks and the UI.
     */
    protected const TIME_SLOTS = ['10:00', '11:30', '14:00', '15:30', '16:30', '17:00'];

    protected const WORKING_DAYS_SHOWN = 6;

    /**
     * Returns the next N working days (Mon–Sat) starting from today,
     * each with its list of time slots and whether each slot is still
     * bookable (not in the past, not already taken).
     */
    public function getUpcomingWindow(): Collection
    {
        $days = collect();
        $cursor = Carbon::today();

        while ($days->count() < self::WORKING_DAYS_SHOWN) {
            if (! $cursor->isSunday()) {
                $days->push($cursor->copy());
            }
            $cursor->addDay();
        }

        $bookedSlots = Appointment::whereIn('status', ['pending', 'confirmed'])
            ->whereBetween('appointment_date', [$days->first(), $days->last()])
            ->get()
            ->map(fn (Appointment $a) => $a->appointment_date->format('Y-m-d') . ' ' . $a->appointment_time->format('H:i'))
            ->all();

        return $days->map(function (Carbon $date) use ($bookedSlots) {
            $isToday = $date->isToday();

            $slots = collect(self::TIME_SLOTS)->map(function (string $time) use ($date, $isToday, $bookedSlots) {
                $key = $date->format('Y-m-d') . ' ' . $time;
                $isPast = $isToday && Carbon::createFromFormat('H:i', $time)->lessThan(Carbon::now());
                $isTaken = in_array($key, $bookedSlots, true);

                return [
                    'time' => $time,
                    'available' => ! $isPast && ! $isTaken,
                ];
            });

            return [
                'date' => $date->format('Y-m-d'),
                'label' => $date->format('D d'), // "Mon 09"
                'full_label' => $date->translatedFormat('l, F j'),
                'is_today' => $isToday,
                'slots' => $slots,
            ];
        });
    }

    public function isSlotAvailable(string $date, string $time): bool
    {
        $carbonDate = Carbon::parse($date);

        if ($carbonDate->isSunday() || $carbonDate->isPast() && ! $carbonDate->isToday()) {
            return false;
        }

        if ($carbonDate->isToday() && Carbon::createFromFormat('H:i', $time)->lessThan(Carbon::now())) {
            return false;
        }

        return ! Appointment::where('appointment_date', $carbonDate->format('Y-m-d'))
            ->where('appointment_time', $time)
            ->whereIn('status', ['pending', 'confirmed'])
            ->exists();
    }
}