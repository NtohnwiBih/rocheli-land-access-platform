<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\MemberPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function create(Request $request): Response
    {
        $member = auth()->user()->member;

        $subscriptions = $member
            ? $member->memberPlans()->with('plan')->orderBy('subscribed_at')->get()
            : collect();

        $selectedId = $request->integer('plan')
            ?: $subscriptions->firstWhere('is_primary', true)?->id
            ?? $subscriptions->first()?->id;

        $selected = $subscriptions->firstWhere('id', $selectedId);

        $successfulContributions = $selected
            ? $selected->contributions()->where('status', 'successful')->get()
            : collect();

        $walletBalance = $successfulContributions->sum('amount');
        $contributionsCount = $successfulContributions->count();
        $targetPrice = $selected ? (float) $selected->plan->target_price : 0;
        $outstanding = max($targetPrice - $walletBalance, 0);

        $thisMonthTotal = $successfulContributions
            ->filter(fn ($c) => $c->created_at->isSameMonth(now()))
            ->sum('amount');

        $savingsData = collect(range(7, 0))->map(function ($monthsAgo) use ($successfulContributions) {
            $month = now()->subMonths($monthsAgo);
            $total = $successfulContributions
                ->filter(fn ($c) => $c->created_at->isSameMonth($month) && $c->created_at->isSameYear($month))
                ->sum('amount');

            return ['m' => $month->format('M'), 'v' => (float) $total];
        })->values();

        $recentContributions = $selected
            ? $selected->contributions()->latest()->take(3)->get()->map(fn ($c) => [
                'date' => $c->created_at->format('M j'),
                'amount' => (float) $c->amount,
                'status' => ucfirst($c->status),
            ])
            : collect();

        return Inertia::render('member/index', [
            'subscriptions' => $subscriptions->map(function (MemberPlan $mp) {
                $total = $mp->totalContributed();
                $target = (float) $mp->plan->target_price;

                return [
                    'id' => $mp->id,
                    'label' => $mp->displayName(),
                    'plan_name' => $mp->plan->name,
                    'status' => $mp->status,
                    'is_primary' => $mp->is_primary,
                    'is_completed' => $mp->isCompleted(),
                    'total_contributed' => $total,
                    'target_price' => $target,
                    'progress_pct' => $target > 0
                        ? min(round(($total / $target) * 100, 2), 100)
                        : 0,
                ];
            }),
            'selected_plan_id' => $selected?->id,
            'member' => $selected ? [
                'goal' => $selected->goal,
                'preferred_locations' => $selected->preferred_locations,
                'land_type' => $selected->land_type,
                'plan' => $selected->plan->name,
                'contribution_frequency' => $selected->contribution_frequency,
                'contribution_amount' => $selected->contribution_amount,
                'payment_method' => $selected->payment_method,
                'status' => $selected->status,
                'is_completed' => $selected->isCompleted(),
            ] : null,
            'stats' => [
                'wallet_balance' => (float) $walletBalance,
                'this_month' => (float) $thisMonthTotal,
                'contributions_count' => $contributionsCount,
                'outstanding' => (float) $outstanding,
                'target_price' => $targetPrice,
            ],
            'savings_data' => $savingsData,
            'recent_contributions' => $recentContributions,
        ]);
    }
}