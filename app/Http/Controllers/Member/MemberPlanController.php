<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Http\Requests\Member\StoreMemberPlanRequest;
use App\Models\City;
use App\Models\MemberPlan;
use App\Models\Plan;
use App\Models\User;
use App\Notifications\NewPlanSubscribed;
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
            ->orderBy('subscribed_at')
            ->get()
            ->map(function (MemberPlan $mp) {
                $totalContributed = $mp->totalContributed();
                $target = (float) $mp->plan->target_price;

                return [
                    'id' => $mp->id,
                    'label' => $mp->displayName(),
                    'plan_name' => $mp->plan->name,
                    'target_price' => $target,
                    'total_contributed' => $totalContributed,
                    'progress_pct' => $target > 0
                        ? min(round(($totalContributed / $target) * 100, 2), 100)
                        : 0,
                    'contribution_frequency' => $mp->contribution_frequency,
                    'contribution_amount' => (float) $mp->contribution_amount,
                    'goal' => $mp->goal,
                    'land_type' => $mp->land_type,
                    'status' => $mp->status,
                    'is_primary' => $mp->is_primary,
                    'is_completed' => $mp->status === 'completed',
                    'completed_at' => $mp->completed_at?->format('M j, Y'),
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
            'cities' => City::active()->get()->map(fn (City $c) => [
                'key' => $c->key,
                'name_en' => $c->name_en,
                'name_fr' => $c->name_fr,
            ]),
        ]);
    }

    public function store(StoreMemberPlanRequest $request): RedirectResponse
    {
        $member = $request->user()->member;
        $validated = $request->validated();

        $memberPlan = MemberPlan::create([
            'member_id' => $member->id,
            'plan_id' => $validated['plan_id'],
            'label' => $validated['label'] ?? null,
            'goal' => $validated['goal'],
            'preferred_locations' => $validated['preferred_locations'] ?? [],
            'land_type' => $validated['land_type'],
            'contribution_frequency' => $validated['contribution_frequency'],
            'contribution_amount' => $validated['contribution_amount'],
            'payment_method' => $validated['payment_method'],
            'status' => 'active',
            'is_primary' => false,
            'subscribed_at' => now(),
        ]);

        $memberPlan->load('member.user');

        User::where('role', 'admin')->get()->each(
            fn (User $admin) => $admin->notify(new NewPlanSubscribed($memberPlan))
        );

        return back()->with('success', 'New project added — awaiting review.');
    }

    public function suspend(MemberPlan $memberPlan): RedirectResponse
    {
        $member = auth()->user()->member;

        abort_unless($memberPlan->member_id === $member->id, 403);

        if ($memberPlan->status !== 'inactive') {
            return back()->with('error', 'Only inactive plans can be suspended.');
        }

        $memberPlan->suspend();

        return back()->with('success', 'Project suspended. You can now create a new one.');
    }
}