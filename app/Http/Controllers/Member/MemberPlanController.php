<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Http\Requests\Member\StoreMemberPlanRequest;
use App\Models\MemberPlan;
use App\Models\Plan;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MemberPlanController extends Controller
{
    public function index(): Response
    {
        $member = auth()->user()->member;

        $subscriptions = $member
            ->memberPlans()
            ->with('plan')
            ->latest('subscribed_at')
            ->get()
            ->map(function (MemberPlan $mp) {
                $totalContributed = $mp->contributions()->where('status', 'successful')->sum('amount');

                return [
                    'id' => $mp->id,
                    'label' => $mp->displayName(),
                    'plan_name' => $mp->plan->name,
                    'target_price' => (float) $mp->plan->target_price,
                    'total_contributed' => (float) $totalContributed,
                    'contribution_frequency' => $mp->contribution_frequency,
                    'contribution_amount' => (float) $mp->contribution_amount,
                    'status' => $mp->status,
                    'is_primary' => $mp->is_primary,
                    'subscribed_at' => $mp->subscribed_at->format('M j, Y'),
                ];
            });

        return Inertia::render('member/plans', [
            'subscriptions' => $subscriptions,
            'available_plans' => Plan::active()->get()->map(fn (Plan $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'target_price' => (float) $p->target_price,
                'daily_amount' => (float) $p->daily_amount,
                'weekly_amount' => (float) $p->weekly_amount,
                'monthly_amount' => (float) $p->monthly_amount,
                'is_flexible' => $p->is_flexible,
                'is_featured' => $p->is_featured,
            ]),
        ]);
    }

    public function store(StoreMemberPlanRequest $request): RedirectResponse
    {
        $member = $request->user()->member;
        $validated = $request->validated();

        MemberPlan::create([
            'member_id' => $member->id,
            'plan_id' => $validated['plan_id'],
            'label' => $validated['label'] ?? null,
            'goal' => $validated['goal'],
            'preferred_locations' => $validated['preferred_locations'] ?? [],
            'land_type' => $validated['land_type'],
            'contribution_frequency' => $validated['contribution_frequency'],
            'contribution_amount' => $validated['contribution_amount'],
            'payment_method' => $validated['payment_method'],
            'status' => 'pending',
            'is_primary' => false,
            'subscribed_at' => now(),
        ]);

        return back()->with('success', 'New project added — awaiting review.');
    }
}