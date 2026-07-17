<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Property;
use Inertia\Inertia;
use Inertia\Response;

class CalculatorController extends Controller
{
    protected const PAYMENTS_PER_YEAR = [
        'Daily' => 365,
        'Weekly' => 52,
        'Monthly' => 12,
    ];

    public function index(): Response
    {
        $member = auth()->user()->member;

        $plan = $member?->plan
            ? Plan::where('name', $member->plan)->first()
            : null;

        $targetPrice = $plan ? (float) $plan->target_price : 0;
        $amountPerPayment = $member ? (float) $member->contribution_amount : 0;
        $frequency = $member?->contribution_frequency;
        $paymentsPerYear = self::PAYMENTS_PER_YEAR[$frequency] ?? 12;

        $totalContributed = $member
            ? (float) $member->contributions()->where('status', 'successful')->sum('amount')
            : 0;

        $remaining = max($targetPrice - $totalContributed, 0);
        $paymentsRemaining = $amountPerPayment > 0
            ? (int) ceil($remaining / $amountPerPayment)
            : 0;
        $yearsRemaining = $paymentsPerYear > 0
            ? round($paymentsRemaining / $paymentsPerYear, 1)
            : 0;

        $locations = Property::query()
            ->whereIn('status', ['Available', 'Selling Fast'])
            ->distinct()
            ->orderBy('location')
            ->pluck('location')
            ->take(6)
            ->values();

        if ($locations->isEmpty()) {
            $locations = collect(['Yaoundé', 'Douala', 'Buea', 'Limbe', 'Bamenda', 'Bafoussam']);
        }

        return Inertia::render('member/calculator', [
            'plan' => [
                'name' => $member?->plan,
                'target_price' => $targetPrice,
            ],
            'contribution' => [
                'frequency' => $frequency,
                'amount' => $amountPerPayment,
            ],
            'progress' => [
                'total_contributed' => $totalContributed,
                'remaining' => $remaining,
                'payments_remaining' => $paymentsRemaining,
                'years_remaining' => $yearsRemaining,
                'payments_per_year' => $paymentsPerYear,
            ],
            'appreciation_rate' => (float) config('rocheli.appreciation_rate'),
            'price_per_sqm' => (float) config('rocheli.price_per_sqm'),
            'suggested_locations' => $locations,
        ]);
    }
}