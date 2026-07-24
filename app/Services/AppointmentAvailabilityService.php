<?php

namespace App\Services;

use App\Models\Appointment;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/**
 * Builds the rolling booking window shown in the contact page's calendar.
 *
 * Business rules encoded here:
 *  - The office is open Monday–Saturday (6 working days a week), closed Sunday.
 *  - Weekdays (Mon–Fri) run 09:00–12:30 and 14:00–17:30 (30-minute slots).
 *  - Saturday closes early, at 13:30, so its last slot starts at 13:00.
 *  - The picker always shows the *next 6 working days*, not a fixed calendar
 *    week. Once "today" is no longer bookable (past closing time, or less
 *    than MIN_NOTICE_MINUTES from now), it drops off the front of the window
 *    and the window's tail slides forward to keep 6 working days visible.
 *
 *    Example: it's Monday the 6th and the office has closed for the day.
 *    Today (Mon 6) is excluded. The next 6 working days, skipping Sunday
 *    the 12th, are: Tue 7, Wed 8, Thu 9, Fri 10, Sat 11, Mon 13.
 */
class AppointmentAvailabilityService
{
    private const WINDOW_SIZE = 6;

    /** A slot must start at least this far in the future to be bookable. */
    private const MIN_NOTICE_MINUTES = 60;

    private const WEEKDAY_SLOTS = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    ];

    private const SATURDAY_SLOTS = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00',
    ];

    private CarbonImmutable $now;

    public function __construct(?CarbonImmutable $now = null)
    {
        $this->now = $now ?? CarbonImmutable::now();
    }

    /**
     * @return Collection<int, array{date: string, weekday: int, closesAt: string, slots: Collection}>
     */
    public function availability(): Collection
    {
        $days = $this->upcomingWorkingDays();

        $bookedByDay = Appointment::query()
            ->confirmed()
            ->whereIn('appointment_date', $days->map->toDateString())
            ->get(['appointment_date', 'appointment_time'])
            ->groupBy(fn ($row) => $row->appointment_date->toDateString())
            ->map(fn ($rows) => $rows->map(fn ($row) => substr($row->appointment_time, 0, 5))->all());

        return $days->map(function (CarbonImmutable $date) use ($bookedByDay) {
            $isSaturday = $date->isSaturday();
            $slotTimes = $isSaturday ? self::SATURDAY_SLOTS : self::WEEKDAY_SLOTS;

            // If this is today, drop slots that no longer have enough notice.
            if ($date->isSameDay($this->now)) {
                $cutoff = $this->now->addMinutes(self::MIN_NOTICE_MINUTES);
                $slotTimes = array_values(array_filter(
                    $slotTimes,
                    fn ($time) => $date->setTimeFromTimeString($time) >= $cutoff
                ));
            }

            $bookedToday = $bookedByDay->get($date->toDateString(), []);

            return [
                'date' => $date->toDateString(),
                'weekday' => $date->dayOfWeekIso, // 1 = Monday ... 6 = Saturday
                'closesAt' => $isSaturday ? '13:30' : '18:00',
                'slots' => collect($slotTimes)->map(fn ($time) => [
                    'time' => $time,
                    'available' => ! in_array($time, $bookedToday, true),
                ])->values(),
            ];
        })->values();
    }

    /**
     * Server-side truth check used at submit time: is this exact date/time
     * still inside the valid window, still open, and not already booked?
     */
    public function isBookable(string $date, string $time): bool
    {
        $day = $this->availability()->firstWhere('date', $date);

        if (! $day) {
            return false;
        }

        $slot = collect($day['slots'])->firstWhere('time', $time);

        return $slot !== null && $slot['available'] === true;
    }

    /**
     * @return Collection<int, CarbonImmutable>
     */
    private function upcomingWorkingDays(): Collection
    {
        $cursor = $this->now;
        $todayClosesAt = $this->now->isSaturday() ? '13:30' : '18:00';

        $todayStillBookable = ! $this->now->isSunday()
            && $this->now->addMinutes(self::MIN_NOTICE_MINUTES) < $this->now->setTimeFromTimeString($todayClosesAt);

        if (! $todayStillBookable) {
            $cursor = $cursor->addDay();
        }

        $days = collect();

        while ($days->count() < self::WINDOW_SIZE) {
            if (! $cursor->isSunday()) {
                $days->push($cursor);
            }
            $cursor = $cursor->addDay();
        }

        return $days;
    }
}